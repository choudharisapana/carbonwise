const User = require('../models/User');
const { decrypt } = require('./crypto');

/**
 * Returns the requesting user's own GitHub access token if they've
 * connected their account, or null if not connected (callers should then
 * fall back to the shared GITHUB_TOKEN env var, which only works for
 * public repos).
 */
const getUserGithubToken = async (userId) => {
  const user = await User.findById(userId).select('+githubAccessTokenEncrypted');

  if (!user || !user.githubAccessTokenEncrypted) {
    return null;
  }

  try {
    return decrypt(user.githubAccessTokenEncrypted);
  } catch (error) {
    console.error('Failed to decrypt stored GitHub token:', error.message);
    return null;
  }
};

module.exports = getUserGithubToken;
