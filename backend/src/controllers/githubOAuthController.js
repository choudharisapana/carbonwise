const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { encrypt } = require('../utils/crypto');

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

const getCallbackUrl = () =>
  process.env.GITHUB_CALLBACK_URL ||
  `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/github/callback`;

// ====================================
// Step 1: Redirect user to GitHub's authorization page
// GET /api/auth/github/connect?token=<JWT>
//
// This is a plain browser navigation (not an API call from axios), so it
// can't carry an Authorization header — the JWT is passed as a query param
// instead and verified manually here.
// ====================================
const initiateGithubConnect = (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Missing auth token' });
    }

    // Verify the user's session token to identify who is connecting
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Short-lived signed state param — carries the user's identity through
    // GitHub's redirect flow and proves the callback wasn't forged.
    const state = jwt.sign(
      { userId: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: getCallbackUrl(),
      scope: 'repo read:user',
      state
    });

    res.redirect(`${GITHUB_AUTHORIZE_URL}?${params.toString()}`);
  } catch (error) {
    console.error('GitHub connect initiation error:', error.message);
    res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
  }
};

// ====================================
// Step 2: GitHub redirects back here with a `code`
// GET /api/auth/github/callback?code=...&state=...
// ====================================
const githubOAuthCallback = async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.redirect(`${frontendUrl}/settings?github=error&reason=missing_params`);
    }

    // Verify state to recover which user initiated this
    const decodedState = jwt.verify(state, process.env.JWT_SECRET);
    const userId = decodedState.userId;

    // Exchange the temporary code for a real access token
    const tokenResponse = await axios.post(
      GITHUB_TOKEN_URL,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: getCallbackUrl()
      },
      { headers: { Accept: 'application/json' } }
    );

    const { access_token, error: ghError } = tokenResponse.data;

    if (ghError || !access_token) {
      console.error('GitHub token exchange error:', tokenResponse.data);
      return res.redirect(`${frontendUrl}/settings?github=error&reason=token_exchange_failed`);
    }

    // Fetch the connected GitHub profile
    const profileResponse = await axios.get(GITHUB_USER_URL, {
      headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/vnd.github+json' }
    });

    const { id: githubId, login: githubUsername, avatar_url: githubAvatarUrl } = profileResponse.data;

    await User.findByIdAndUpdate(userId, {
      githubId: String(githubId),
      githubUsername,
      githubAvatarUrl,
      githubAccessTokenEncrypted: encrypt(access_token)
    });

    res.redirect(`${frontendUrl}/settings?github=connected`);
  } catch (error) {
    console.error('GitHub OAuth callback error:', error.message);
    res.redirect(`${frontendUrl}/settings?github=error&reason=server_error`);
  }
};

// ====================================
// Check connection status
// GET /api/auth/github/status  (protected)
// ====================================
const getGithubStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      connected: !!user.githubId,
      githubUsername: user.githubUsername || null,
      githubAvatarUrl: user.githubAvatarUrl || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================================
// Disconnect GitHub
// DELETE /api/auth/github/disconnect  (protected)
// ====================================
const disconnectGithub = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      githubId: null,
      githubUsername: null,
      githubAvatarUrl: null,
      githubAccessTokenEncrypted: null
    });

    res.json({ success: true, message: 'GitHub account disconnected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  initiateGithubConnect,
  githubOAuthCallback,
  getGithubStatus,
  disconnectGithub
};
