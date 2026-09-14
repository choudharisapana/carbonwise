const axios = require('axios');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const notificationService = require('../services/notificationService');

// IMPORTANT:
// Agar tumhari encryption utility ka path alag hai
// to sirf is line ka path change karna.
const { encrypt } = require('../utils/crypto');


// ============================================
// ENVIRONMENT VARIABLES
// ============================================

const GITHUB_CLIENT_ID =
  process.env.GITHUB_CLIENT_ID;

const GITHUB_CLIENT_SECRET =
  process.env.GITHUB_CLIENT_SECRET;

const BACKEND_URL =
  process.env.BACKEND_URL ||
  'http://localhost:5000';

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  'http://localhost:5173';


// ============================================
// BUILD GITHUB OAUTH URL
// ============================================

const getGithubOAuthUrl = (
  redirectUri,
  state
) => {

  const params =
    new URLSearchParams({

      client_id:
        GITHUB_CLIENT_ID,

      redirect_uri:
        redirectUri,

      scope:
        'read:user user:email repo',

      state

    });


  return (
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );

};


// ============================================
// EXCHANGE CODE FOR ACCESS TOKEN
// ============================================

const getGithubAccessToken =
  async (
    code,
    redirectUri
  ) => {

    try {

      const response =
        await axios.post(

          'https://github.com/login/oauth/access_token',

          {

            client_id:
              GITHUB_CLIENT_ID,

            client_secret:
              GITHUB_CLIENT_SECRET,

            code,

            redirect_uri:
              redirectUri

          },

          {

            headers: {

              Accept:
                'application/json'

            }

          }

        );


      if (
        !response.data.access_token
      ) {

        throw new Error(

          response.data.error_description ||

          'GitHub access token not received'

        );

      }


      return response.data.access_token;


    } catch (error) {

      console.error(

        'GitHub token exchange error:',

        error.response?.data ||
        error.message

      );


      throw error;

    }

};


// ============================================
// GET GITHUB USER
// ============================================

const getGithubUser =
  async (
    accessToken
  ) => {

    try {

      const response =
        await axios.get(

          'https://api.github.com/user',

          {

            headers: {

              Authorization:
                `Bearer ${accessToken}`,

              Accept:
                'application/vnd.github+json'

            }

          }

        );


      return response.data;


    } catch (error) {

      console.error(

        'GitHub user fetch error:',

        error.response?.data ||
        error.message

      );


      throw error;

    }

};


// ============================================
// GET GITHUB EMAIL
// ============================================

const getGithubEmail =
  async (
    accessToken,
    githubUser
  ) => {

    try {

      // Sometimes GitHub provides
      // the public email directly

      if (
        githubUser.email
      ) {

        return githubUser.email;

      }


      const response =
        await axios.get(

          'https://api.github.com/user/emails',

          {

            headers: {

              Authorization:
                `Bearer ${accessToken}`,

              Accept:
                'application/vnd.github+json'

            }

          }

        );


      const emails =
        response.data;


      const primaryEmail =
        emails.find(

          (email) =>
            email.primary &&
            email.verified

        );


      if (
        primaryEmail
      ) {

        return primaryEmail.email;

      }


      const verifiedEmail =
        emails.find(

          (email) =>
            email.verified

        );


      if (
        verifiedEmail
      ) {

        return verifiedEmail.email;

      }


      throw new Error(
        'No verified email found in GitHub account'
      );


    } catch (error) {

      console.error(

        'GitHub email error:',

        error.response?.data ||
        error.message

      );


      throw error;

    }

};


// ============================================
// CREATE RANDOM OAUTH STATE
// ============================================

const createOAuthState = () => {

  return crypto
    .randomBytes(32)
    .toString('hex');

};



// ============================================
// GITHUB LOGIN / REGISTER
// GET /api/auth/github/login
// ============================================

const initiateGithubLogin =
  async (req, res) => {

    try {

      if (
        !GITHUB_CLIENT_ID
      ) {

        return res.status(500).json({

          success: false,

          message:
            'GitHub OAuth is not configured'

        });

      }


      const state =
        createOAuthState();


      // IMPORTANT:
      // Login/Register has its own callback

      const redirectUri =
        `${BACKEND_URL}/api/auth/github/login/callback`;


      // Store state in cookie
      // to validate OAuth callback

      res.cookie(

        'github_login_state',

        state,

        {

          httpOnly: true,

          secure:
            process.env.NODE_ENV ===
            'production',

          sameSite:
            'lax',

          maxAge:
            10 * 60 * 1000

        }

      );


      const githubUrl =
        getGithubOAuthUrl(

          redirectUri,

          state

        );


      return res.redirect(
        githubUrl
      );


    } catch (error) {

      console.error(

        'GitHub login initiation error:',

        error.message

      );


      return res.redirect(

        `${FRONTEND_URL}/login?github=error`

      );

    }

};



// ============================================
// GITHUB LOGIN CALLBACK
// GET /api/auth/github/login/callback
// ============================================

const githubLoginCallback =
  async (req, res) => {

    try {

      const {

        code,

        state,

        error

      } =
        req.query;


      // User denied GitHub authorization

      if (
        error
      ) {

        return res.redirect(

          `${FRONTEND_URL}/login?github=error`

        );

      }


      if (
        !code
      ) {

        return res.redirect(

          `${FRONTEND_URL}/login?github=error`

        );

      }


      // ==========================================
      // VALIDATE STATE
      // ==========================================

      const savedState =
        req.cookies?.github_login_state;


      if (
        savedState &&
        state !== savedState
      ) {

        console.error(
          'GitHub OAuth state mismatch'
        );


        return res.redirect(

          `${FRONTEND_URL}/login?github=error`

        );

      }


      // ==========================================
      // EXCHANGE CODE
      // ==========================================

      const redirectUri =
        `${BACKEND_URL}/api/auth/github/login/callback`;


      const accessToken =
        await getGithubAccessToken(

          code,

          redirectUri

        );


      // ==========================================
      // GET GITHUB USER
      // ==========================================

      const githubUser =
        await getGithubUser(
          accessToken
        );


      // ==========================================
      // GET VERIFIED EMAIL
      // ==========================================

      const email =
        await getGithubEmail(

          accessToken,

          githubUser

        );


      // ==========================================
      // FIND USER BY GITHUB ID
      // ==========================================

      let user =
        await User.findOne({

          githubId:
            githubUser.id.toString()

        });


      // ==========================================
      // EXISTING GITHUB USER
      // ==========================================

      if (
        user
      ) {

        user.githubUsername =
          githubUser.login;

        user.githubAvatarUrl =
          githubUser.avatar_url;

        user.githubAccessTokenEncrypted =
          encrypt(accessToken);

        user.lastLogin =
          new Date();


        await user.save();

      }


      // ==========================================
      // FIND EXISTING EMAIL USER
      // ==========================================

      else {

        user =
          await User.findOne({

            email:
              email.toLowerCase()

          });


        // ==========================================
        // EXISTING EMAIL USER
        // CONNECT GITHUB
        // ==========================================

        if (
          user
        ) {

          user.githubId =
            githubUser.id.toString();

          user.githubUsername =
            githubUser.login;

          user.githubAvatarUrl =
            githubUser.avatar_url;

          user.githubAccessTokenEncrypted =
            encrypt(accessToken);

          user.lastLogin =
            new Date();


          await user.save();

        }


        // ==========================================
        // CREATE NEW GITHUB USER
        // ==========================================

        else {

          user =
            await User.create({

              name:

                githubUser.name ||

                githubUser.login,


              email:
                email.toLowerCase(),


              authProvider:
                'github',


              // GitHub email is verified

              isVerified:
                true,


              githubId:
                githubUser.id.toString(),


              githubUsername:
                githubUser.login,


              githubAvatarUrl:
                githubUser.avatar_url,


              githubAccessTokenEncrypted:
                encrypt(accessToken),


              lastLogin:
                new Date()

            });

        }

      }


      // ==========================================
      // GENERATE JWT
      // ==========================================

      const token =
        generateToken(
          user._id
        );


      // ==========================================
      // CLEAR OAUTH COOKIE
      // ==========================================

      res.clearCookie(
        'github_login_state'
      );


      // ==========================================
      // REDIRECT FRONTEND
      // ==========================================

      return res.redirect(

        `${FRONTEND_URL}/auth/github-success?token=${encodeURIComponent(token)}`

      );


    } catch (error) {

      console.error(

        'GitHub login callback error:',

        error.response?.data ||

        error.message

      );


      return res.redirect(

        `${FRONTEND_URL}/login?github=error`

      );

    }

};



// ============================================
// CONNECT GITHUB ACCOUNT
// GET /api/auth/github/connect?token=JWT
// ============================================

const initiateGithubConnect =
  async (req, res) => {

    try {

      const token =
        req.query.token;


      if (
        !token
      ) {

        return res.status(401).json({

          success: false,

          message:
            'Authentication token is required'

        });

      }


      // Encode current JWT in state
      // so callback knows which user
      // is connecting GitHub

      const state =
        Buffer
          .from(

            JSON.stringify({

              token,

              nonce:
                createOAuthState()

            })

          )

          .toString(
            'base64url'
          );


      // IMPORTANT:
      // Settings connect uses
      // the normal callback

      const redirectUri =
        `${BACKEND_URL}/api/auth/github/callback`;


      const githubUrl =
        getGithubOAuthUrl(

          redirectUri,

          state

        );


      return res.redirect(
        githubUrl
      );


    } catch (error) {

      console.error(

        'GitHub connect initiation error:',

        error.message

      );


      return res.redirect(

        `${FRONTEND_URL}/settings?github=error`

      );

    }

};



// ============================================
// GITHUB CONNECT CALLBACK
// GET /api/auth/github/callback
// ============================================

const githubOAuthCallback =
  async (req, res) => {

    try {

      const {

        code,

        state,

        error

      } =
        req.query;


      if (
        error ||
        !code ||
        !state
      ) {

        return res.redirect(

          `${FRONTEND_URL}/settings?github=error`

        );

      }


      // ==========================================
      // DECODE STATE
      // ==========================================

      let stateData;


      try {

        stateData =
          JSON.parse(

            Buffer
              .from(

                state,

                'base64url'

              )

              .toString(
                'utf8'
              )

          );

      } catch (decodeError) {

        return res.redirect(

          `${FRONTEND_URL}/settings?github=error`

        );

      }


      const {
        token
      } =
        stateData;


      if (
        !token
      ) {

        return res.redirect(

          `${FRONTEND_URL}/settings?github=error`

        );

      }


      // ==========================================
      // VERIFY JWT
      // ==========================================

      const decoded =
        jwt.verify(

          token,

          process.env.JWT_SECRET

        );


      const user =
        await User.findById(

          decoded.id

        );


      if (
        !user
      ) {

        return res.redirect(

          `${FRONTEND_URL}/settings?github=error`

        );

      }


      // ==========================================
      // EXCHANGE GITHUB CODE
      // ==========================================

      const redirectUri =
        `${BACKEND_URL}/api/auth/github/callback`;


      const accessToken =
        await getGithubAccessToken(

          code,

          redirectUri

        );


      // ==========================================
      // GET GITHUB USER
      // ==========================================

      const githubUser =
        await getGithubUser(
          accessToken
        );


      // ==========================================
      // SAVE GITHUB DETAILS
      // ==========================================

      user.githubId =
        githubUser.id.toString();


      user.githubUsername =
        githubUser.login;


      user.githubAvatarUrl =
        githubUser.avatar_url;


      user.githubAccessTokenEncrypted =
        encrypt(accessToken);


      await user.save();


      // ==========================================
      // CREATE GITHUB SYNC NOTIFICATION
      // Only if enabled in settings
      // ==========================================

      if (
        user.preferences
          ?.notifications
          ?.githubSync !== false
      ) {

        try {

          await notificationService
            .createNotification({

              user:
                user._id,

              title:
                'GitHub Synced Successfully',

              message:
                `Your GitHub account (@${githubUser.login}) was synced successfully.`,

              type:
                'system'

            });

        } catch (notificationError) {

          console.error(

            'GitHub notification error:',

            notificationError.message

          );

        }

      }


      // ==========================================
      // REDIRECT SETTINGS
      // ==========================================

      return res.redirect(

        `${FRONTEND_URL}/settings?github=connected`

      );


    } catch (error) {

      console.error(

        'GitHub connection callback error:',

        error.response?.data ||

        error.message

      );


      return res.redirect(

        `${FRONTEND_URL}/settings?github=error`

      );

    }

};



// ============================================
// GET GITHUB STATUS
// GET /api/auth/github/status
// ============================================

const getGithubStatus =
  async (req, res) => {

    try {

      const user =
        req.user;


      const connected =
        Boolean(
          user.githubId
        );


      return res.json({

        success: true,

        connected,


        githubUsername:

          connected

            ? user.githubUsername

            : null,


        githubAvatarUrl:

          connected

            ? user.githubAvatarUrl

            : null

      });


    } catch (error) {

      console.error(

        'GitHub status error:',

        error.message

      );


      return res.status(500).json({

        success: false,

        message:
          'Failed to get GitHub connection status'

      });

    }

};



// ============================================
// DISCONNECT GITHUB
// DELETE /api/auth/github/disconnect
// ============================================

const disconnectGithub =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        )

          .select(
            '+githubAccessTokenEncrypted'
          );


      if (
        !user
      ) {

        return res.status(404).json({

          success: false,

          message:
            'User not found'

        });

      }


      // Prevent GitHub-only user
      // from disconnecting only login method

      if (
        user.authProvider ===
        'github'
      ) {

        return res.status(400).json({

          success: false,

          message:
            'GitHub cannot be disconnected because it is your only login method.'

        });

      }


      // Remove GitHub details

      user.githubId =
        null;


      user.githubUsername =
        null;


      user.githubAvatarUrl =
        null;


      user.githubAccessTokenEncrypted =
        null;


      await user.save();


      // ==========================================
      // CREATE DISCONNECT NOTIFICATION
      // ==========================================

      if (
        user.preferences
          ?.notifications
          ?.githubSync !== false
      ) {

        try {

          await notificationService
            .createNotification({

              user:
                user._id,

              title:
                'GitHub Disconnected',

              message:
                'Your GitHub account was disconnected successfully.',

              type:
                'system'

            });

        } catch (notificationError) {

          console.error(

            'GitHub disconnect notification error:',

            notificationError.message

          );

        }

      }


      return res.json({

        success: true,

        message:
          'GitHub account disconnected successfully'

      });


    } catch (error) {

      console.error(

        'GitHub disconnect error:',

        error.message

      );


      return res.status(500).json({

        success: false,

        message:
          'Failed to disconnect GitHub account'

      });

    }

};



// ============================================
// EXPORTS
// ============================================

module.exports = {

  initiateGithubConnect,

  githubOAuthCallback,

  initiateGithubLogin,

  githubLoginCallback,

  getGithubStatus,

  disconnectGithub

};