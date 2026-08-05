const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Builds an axios client authenticated with either:
 *  - the user's own connected GitHub token (per-user, for private repos), or
 *  - the app-level GITHUB_TOKEN from .env (shared fallback, public repos only)
 * This is what makes private repo analysis work per-user instead of
 * everyone sharing one token.
 */
const getClient = (userToken) => {
  const token = userToken || process.env.GITHUB_TOKEN;

  return axios.create({
    baseURL: GITHUB_API_BASE,
    headers: {
      Accept: 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    timeout: 10000
  });
};

const parseOwnerRepo = (repoUrl) => {
  const cleaned = repoUrl.trim().replace(/\/+$/, '').replace(/\.git$/, '');
  const parts = cleaned.split('/');
  const owner = parts[parts.length - 2];
  const repo = parts[parts.length - 1];

  if (!owner || !repo) {
    throw new Error('Invalid GitHub repository URL');
  }

  return { owner, repo };
};

/**
 * Fetch core repository metadata (stars, forks, size, language, etc).
 */
const fetchRepository = async (repoUrl, userToken) => {
  const { owner, repo } = parseOwnerRepo(repoUrl);
  const client = getClient(userToken);

  try {
    const response = await client.get(`/repos/${owner}/${repo}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Repository not found. Check the URL, or if it is private, connect your GitHub account in Settings.');
    }
    if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Connect your GitHub account in Settings for a higher limit.');
    }
    throw new Error(`Failed to fetch repository: ${error.message}`);
  }
};

/**
 * Fetch language breakdown (bytes per language) — real code composition,
 * used for more accurate per-language recommendations.
 */
const fetchLanguages = async (owner, repo, userToken) => {
  try {
    const response = await getClient(userToken).get(`/repos/${owner}/${repo}/languages`);
    return response.data; // e.g. { JavaScript: 12345, CSS: 6789 }
  } catch (error) {
    return {}; // Non-critical — degrade gracefully
  }
};

/**
 * Fetch recent GitHub Actions workflow runs for this repo.
 */
const fetchWorkflowRuns = async (owner, repo, userToken, perPage = 15) => {
  try {
    const response = await getClient(userToken).get(
      `/repos/${owner}/${repo}/actions/runs`,
      { params: { per_page: perPage } }
    );
    return response.data.workflow_runs || [];
  } catch (error) {
    // Repo may have Actions disabled, be private without token access, etc.
    return [];
  }
};

/**
 * Fetch real billable compute time (ms) for a single workflow run.
 */
const fetchRunTiming = async (owner, repo, runId, userToken) => {
  try {
    const response = await getClient(userToken).get(
      `/repos/${owner}/${repo}/actions/runs/${runId}/timing`
    );
    return response.data.billable || {};
  } catch (error) {
    return {};
  }
};

/**
 * Aggregate real billable CI/CD milliseconds across recent workflow runs.
 */
const fetchTotalCiBillableMs = async (owner, repo, userToken) => {
  const runs = await fetchWorkflowRuns(owner, repo, userToken);

  if (runs.length === 0) {
    return { totalMs: 0, runsAnalyzed: 0 };
  }

  let totalMs = 0;

  for (const run of runs) {
    const timing = await fetchRunTiming(owner, repo, run.id, userToken);
    for (const os of Object.keys(timing)) {
      totalMs += timing[os]?.total_ms || 0;
    }
  }

  return { totalMs, runsAnalyzed: runs.length };
};

/**
 * Fetch and count dependencies from package.json, if present.
 */
const fetchDependencyCount = async (owner, repo, userToken) => {
  try {
    const response = await getClient(userToken).get(
      `/repos/${owner}/${repo}/contents/package.json`
    );

    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    const pkg = JSON.parse(content);

    const deps = Object.keys(pkg.dependencies || {}).length;
    const devDeps = Object.keys(pkg.devDependencies || {}).length;

    return deps + devDeps;
  } catch (error) {
    return 0; // Not a Node project, or file not found — non-critical
  }
};

module.exports = {
  fetchRepository,
  fetchLanguages,
  fetchWorkflowRuns,
  fetchRunTiming,
  fetchTotalCiBillableMs,
  fetchDependencyCount,
  parseOwnerRepo
};
