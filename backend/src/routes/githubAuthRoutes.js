const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
  initiateGithubConnect,
  githubOAuthCallback,
  getGithubStatus,
  disconnectGithub
} = require('../controllers/githubOAuthController');

// Note: /connect and /callback are NOT behind `protect` middleware because
// they're plain browser redirects (GitHub navigates the user's browser
// here directly) — they can't carry an Authorization header. Identity is
// verified manually inside the controllers via the token/state params.
router.get('/connect', initiateGithubConnect);
router.get('/callback', githubOAuthCallback);

router.get('/status', protect, getGithubStatus);
router.delete('/disconnect', protect, disconnectGithub);

module.exports = router;
