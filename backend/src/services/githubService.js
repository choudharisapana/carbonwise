const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';

// Filenames that indicate specific tooling/config — detected from the
// repo's file tree so the analysis (and AI suggestions) can reference
// real, verified artifacts instead of guessing.
const CONFIG_FILE_PATTERNS = [
  { pattern: /^Dockerfile$/i, label: 'Dockerfile' },
  { pattern: /^docker-compose\.ya?ml$/i, label: 'docker-compose' },
  { pattern: /^webpack\.config\.(js|ts|cjs|mjs)$/i, label: 'Webpack config' },
  { pattern: /^vite\.config\.(js|ts|cjs|mjs)$/i, label: 'Vite config' },
  { pattern: /^rollup\.config\.(js|ts|cjs|mjs)$/i, label: 'Rollup config' },
  { pattern: /^tsconfig\.json$/i, label: 'TypeScript config' },
  { pattern: /^jest\.config\.(js|ts|cjs|mjs|json)$/i, label: 'Jest config' },
  { pattern: /^\.babelrc(\.js)?$/i, label: 'Babel config' },
  { pattern: /^next\.config\.(js|ts|mjs)$/i, label: 'Next.js config' },
  { pattern: /^tailwind\.config\.(js|ts|cjs)$/i, label: 'Tailwind config' },
  { pattern: /^requirements\.txt$/i, label: 'Python requirements' },
  { pattern: /^Pipfile$/i, label: 'Pipfile' },
  { pattern: /^pom\.xml$/i, label: 'Maven pom.xml' },
  { pattern: /^build\.gradle(\.kts)?$/i, label: 'Gradle build file' },
  { pattern: /^Gemfile$/i, label: 'Gemfile' },
  { pattern: /^go\.mod$/i, label: 'Go modules' },
  { pattern: /^Cargo\.toml$/i, label: 'Cargo.toml' }
];

// Files above this size are flagged as "large files" — a genuine signal
// for repo bloat / storage energy, not a guess.
const LARGE_FILE_THRESHOLD_KB = 500;

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
    timeout: 15000
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
 * Fetch language breakdown (bytes per language) — real code composition.
 * Returns {} (not an error) if unavailable, so callers can distinguish
 * "no languages detected" from a hard failure.
 */
const fetchLanguages = async (owner, repo, userToken) => {
  try {
    const response = await getClient(userToken).get(`/repos/${owner}/${repo}/languages`);
    return response.data || {}; // e.g. { JavaScript: 12345, CSS: 6789 }
  } catch (error) {
    return {}; // Non-critical — degrade gracefully
  }
};

/**
 * Fetch recent GitHub Actions workflow runs for this repo.
 */
const fetchWorkflowRuns = async (owner, repo, userToken, perPage = 20) => {
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
 * Kept separate from fetchCiStats (below) for backward compatibility with
 * existing callers.
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
 * Real CI/CD health signals — not just compute time, but whether CI is
 * actually meaningfully used, how reliable it is, and which workflows
 * exist. This is what lets the AI say "your CI has a 40% failure rate"
 * instead of a generic "optimize your CI" suggestion.
 *
 * Combines the same workflow-run fetch used by fetchTotalCiBillableMs so
 * we don't hit the GitHub API twice for the same data — callers that need
 * both billable ms AND health stats should use this function and read
 * `.totalMs` from it instead of calling fetchTotalCiBillableMs separately.
 */
const fetchCiStats = async (owner, repo, userToken) => {
  const runs = await fetchWorkflowRuns(owner, repo, userToken);

  if (runs.length === 0) {
    return {
      hasData: false,
      totalMs: 0,
      runsAnalyzed: 0,
      totalRuns: 0,
      failedRuns: 0,
      successRate: null,
      workflowNames: []
    };
  }

  let totalMs = 0;
  let failedRuns = 0;
  const workflowNames = new Set();

  for (const run of runs) {
    const timing = await fetchRunTiming(owner, repo, run.id, userToken);
    for (const os of Object.keys(timing)) {
      totalMs += timing[os]?.total_ms || 0;
    }

    if (run.conclusion === 'failure' || run.conclusion === 'timed_out') {
      failedRuns += 1;
    }

    if (run.name) {
      workflowNames.add(run.name);
    }
  }

  return {
    hasData: true,
    totalMs,
    runsAnalyzed: runs.length,
    totalRuns: runs.length,
    failedRuns,
    successRate: Number((((runs.length - failedRuns) / runs.length) * 100).toFixed(1)),
    workflowNames: Array.from(workflowNames).slice(0, 10)
  };
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

/**
 * Fetch actual dependency NAMES (not just a count) from package.json.
 * Needed for AI suggestions, which need real package names to give useful
 * advice (e.g. "moment is heavy, consider date-fns") — a bare count can't
 * support that. Capped to 40 names to keep the AI prompt small.
 * Returns { dependencies: [...], devDependencies: [...], hasPackageJson }
 * — hasPackageJson lets callers distinguish "genuinely zero deps" from
 * "not a Node project at all" (both empty-arrays would otherwise look the same).
 */
const fetchDependencyNames = async (owner, repo, userToken) => {
  try {
    const response = await getClient(userToken).get(
      `/repos/${owner}/${repo}/contents/package.json`
    );

    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    const pkg = JSON.parse(content);

    return {
      hasPackageJson: true,
      dependencies: Object.keys(pkg.dependencies || {}).slice(0, 40),
      devDependencies: Object.keys(pkg.devDependencies || {}).slice(0, 40)
    };
  } catch (error) {
    return { hasPackageJson: false, dependencies: [], devDependencies: [] };
  }
};

/**
 * Fetch the repository's full file tree (recursive) and derive real
 * structural signals: total file count, large files, and which known
 * config/build files are actually present. One API call per analysis
 * (GitHub's Trees API supports recursive listing natively).
 *
 * Returns hasData: false (not an error) if the tree can't be read, so
 * callers know to skip file-based suggestions rather than guessing.
 */
const fetchRepoTree = async (owner, repo, defaultBranch, userToken) => {
  try {
    const branch = defaultBranch || 'main';

    const response = await getClient(userToken).get(
      `/repos/${owner}/${repo}/git/trees/${branch}`,
      { params: { recursive: 1 } }
    );

    const tree = response.data.tree || [];
    const files = tree.filter((item) => item.type === 'blob');

    const largeFiles = files
      .filter((f) => (f.size || 0) / 1024 >= LARGE_FILE_THRESHOLD_KB)
      .sort((a, b) => (b.size || 0) - (a.size || 0))
      .slice(0, 10)
      .map((f) => ({
        path: f.path,
        sizeKB: Number(((f.size || 0) / 1024).toFixed(1))
      }));

    const configFilesDetected = [];
    let workflowFileCount = 0;

    for (const file of files) {
      const basename = file.path.split('/').pop();

      if (file.path.startsWith('.github/workflows/') && /\.ya?ml$/i.test(basename)) {
        workflowFileCount += 1;
      }

      for (const { pattern, label } of CONFIG_FILE_PATTERNS) {
        if (pattern.test(basename) && !configFilesDetected.includes(label)) {
          configFilesDetected.push(label);
        }
      }
    }

    return {
      hasData: true,
      totalFiles: files.length,
      largeFiles,
      configFilesDetected,
      workflowFileCount,
      truncated: response.data.truncated === true // GitHub caps very large trees
    };
  } catch (error) {
    return {
      hasData: false,
      totalFiles: 0,
      largeFiles: [],
      configFilesDetected: [],
      workflowFileCount: 0,
      truncated: false
    };
  }
};

/**
 * Checks whether each dependency name genuinely appears somewhere in the
 * repository's source code, using GitHub's code search API. This is what
 * makes "unused dependency" claims defensible — we never let the AI just
 * assert a package is unused without a real check.
 *
 * IMPORTANT limitations (documented, not hidden): GitHub code search only
 * indexes the default branch, skips very large files, and has its own
 * separate (stricter) rate limit. So this is a best-effort heuristic, not
 * a perfect static analyzer — every result is tagged `verified: true/false`
 * so callers (the AI prompt) know exactly which dependencies actually got
 * checked vs which are simply unknown, and must never treat "unverified"
 * as "unused".
 *
 * Capped to CHECK_LIMIT dependencies (production deps only) per analysis
 * to respect GitHub's search rate limit and keep analysis time reasonable.
 */
const CHECK_LIMIT = 8;

const checkDependencyUsage = async (owner, repo, dependencyNames = [], userToken) => {
  const client = getClient(userToken);
  const results = [];

  const toCheck = dependencyNames.slice(0, CHECK_LIMIT);
  const skipped = dependencyNames.slice(CHECK_LIMIT);

  for (const name of toCheck) {
    try {
      const response = await client.get('/search/code', {
        params: { q: `"${name}" repo:${owner}/${repo}` },
        headers: { Accept: 'application/vnd.github+json' }
      });

      results.push({
        name,
        referencedInSource: (response.data.total_count || 0) > 0,
        verified: true
      });

      // GitHub's code search rate limit is much stricter than the core
      // API — a small delay between calls avoids bursting into it.
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      // Rate-limited, search temporarily unavailable, or a name with
      // characters the search API rejects — never guess, just mark
      // unverified so the AI is told not to claim a usage status.
      results.push({ name, referencedInSource: null, verified: false });
    }
  }

  for (const name of skipped) {
    results.push({ name, referencedInSource: null, verified: false });
  }

  return results;
};


module.exports = {
  checkDependencyUsage,
  fetchRepository,
  fetchLanguages,
  fetchWorkflowRuns,
  fetchRunTiming,
  fetchTotalCiBillableMs,
  fetchCiStats,
  fetchDependencyCount,
  fetchDependencyNames,
  fetchRepoTree,
  parseOwnerRepo
};
