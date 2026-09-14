const express = require('express');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
  initiateGithubConnect,
  githubOAuthCallback,
  initiateGithubLogin,
  githubLoginCallback,
  getGithubStatus,
  disconnectGithub
} = require('../controllers/githubOAuthController');
// GitHub Login / Register
router.get(
  '/login',
  initiateGithubLogin
);


// GitHub Login Callback
router.get(
  '/login/callback',
  githubLoginCallback
);


// Common GitHub Callback
router.get(
  '/callback',
  githubOAuthCallback
);


// Connect GitHub Account
router.get(
  '/connect',
  initiateGithubConnect
);


// GitHub Status
router.get(
  '/status',
  protect,
  getGithubStatus
);


// Disconnect GitHub
router.delete(
  '/disconnect',
  protect,
  disconnectGithub
);


module.exports = router;