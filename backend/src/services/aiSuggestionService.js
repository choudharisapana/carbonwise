const { generateJSON } = require('./geminiService');

const VALID_TYPES = ['energy', 'performance', 'carbon', 'architecture', 'dependency'];
const VALID_IMPACT = ['low', 'medium', 'high'];
const VALID_CONFIDENCE = ['low', 'medium', 'high'];

/**
 * Builds a prompt grounded ONLY in real, verified data from this specific
 * analysis. Every data category is explicitly labeled as either AVAILABLE
 * (with real numbers/names) or NOT AVAILABLE — the model is instructed to
 * only generate suggestions for categories marked available, so it can't
 * fabricate a "CI optimization" suggestion for a repo with no CI data, or
 * invent dependency names that were never fetched.
 *
 * IMPORTANT distinction: "not available" (we never fetched this data) is
 * different from "checked and found zero" (we fetched it and there
 * genuinely isn't any) — every section below states explicitly which one
 * applies, so the model never treats missing data as evidence of absence.
 */
const buildPrompt = ({ analysis, repository }) => {
  const availability = analysis.dataAvailability || {};
  const ciStats = analysis.ciStats || {};
  const fileStats = analysis.fileStats || {};
  const breakdown = analysis.energyBreakdown || {};
  const dependencyUsage = analysis.dependencyUsage || [];

  const deps = analysis.dependencies?.length
    ? analysis.dependencies.join(', ')
    : null;

  const devDeps = analysis.devDependencies?.length
    ? analysis.devDependencies.join(', ')
    : null;

  const languageList = analysis.languageBreakdown && Object.keys(analysis.languageBreakdown).length
    ? Object.entries(analysis.languageBreakdown)
        .sort((a, b) => b[1] - a[1])
        .map(([lang, bytes]) => `${lang} (${(bytes / 1024).toFixed(0)}KB)`)
        .join(', ')
    : null;

  const largeFilesList = fileStats.largeFiles?.length
    ? fileStats.largeFiles.map((f) => `${f.path} (${f.sizeKB}KB)`).join(', ')
    : null;

  const configFilesList = fileStats.configFilesDetected?.length
    ? fileStats.configFilesDetected.join(', ')
    : null;

  const hasDockerfile = fileStats.configFilesDetected?.includes('Dockerfile') || false;

  // Split dependency usage results into what we could and couldn't verify.
  const verifiedUnused = dependencyUsage.filter((d) => d.verified && d.referencedInSource === false);
  const verifiedUsed = dependencyUsage.filter((d) => d.verified && d.referencedInSource === true);
  const unverified = dependencyUsage.filter((d) => !d.verified);

  // Deep carbon analysis: express each energy component as a % of total
  // so the AI can reason about WHICH component genuinely dominates this
  // repo's footprint, instead of just seeing three raw kWh numbers.
  const totalKWh = analysis.energyConsumption || 0;
  const ciKWh = breakdown.ciEnergyKWh || 0;
  const storageKWh = breakdown.storageEnergyKWh || 0;
  const networkKWh = breakdown.networkEnergyKWh || 0;
  const pct = (part) => (totalKWh > 0 ? ((part / totalKWh) * 100).toFixed(1) : '0.0');

  const scoreBand =
    analysis.sustainabilityScore >= 90 ? 'A (excellent)' :
    analysis.sustainabilityScore >= 75 ? 'B (good)' :
    analysis.sustainabilityScore >= 60 ? 'C (average)' :
    analysis.sustainabilityScore >= 40 ? 'D (below average)' :
    'E (poor)';

  const sections = [];

  sections.push(`REPOSITORY:
- Name: ${repository.repositoryName}
- Primary language: ${repository.language}
- Size: ${(repository.size / 1024).toFixed(2)} MB
- Stars: ${repository.stars}, Forks: ${repository.forks}`);

  sections.push(`CARBON & ENERGY ANALYSIS RESULTS (always available — computed for every analysis):
- Carbon score: ${analysis.carbonScore}/100
- Sustainability score: ${analysis.sustainabilityScore}/100 — Grade ${scoreBand}
- CO2 emission: ${analysis.co2Emission} grams CO2e for this analysis
- Total energy consumption: ${totalKWh} kWh
- DEEP BREAKDOWN (% of this repo's total energy, not generic percentages):
  • CI/CD compute: ${ciKWh} kWh (${pct(ciKWh)}% of total)
  • Repository storage: ${storageKWh} kWh (${pct(storageKWh)}% of total)
  • Dependencies/network transfer: ${networkKWh} kWh (${pct(networkKWh)}% of total)
- The dominant contributor above is what your suggestions should prioritize — do not spread suggestions evenly across all three components if one clearly dominates.
- Auto-generated evidence-based findings already computed for this analysis: ${analysis.recommendations?.length ? analysis.recommendations.join(' | ') : 'none'}
  (Do not just repeat these verbatim — go deeper: explain WHY the dominant component is high using the specific numbers above, and suggest a concrete next step.)`);

  sections.push(
    availability.languagesAvailable
      ? `LANGUAGE BREAKDOWN — AVAILABLE:\n- ${languageList}`
      : `LANGUAGE BREAKDOWN — NOT AVAILABLE for this analysis (we could not fetch it — this does not mean the repo has no languages). Do not make language-specific suggestions beyond the primary language listed above.`
  );

  if (!availability.dependencyDataAvailable) {
    sections.push(
      `DEPENDENCIES — NOT AVAILABLE (no readable package.json — likely not a Node.js project, or the file couldn't be fetched; this does NOT mean the repo has zero dependencies, just that we couldn't read them). Do NOT generate any dependency-specific suggestions.`
    );
  } else {
    sections.push(`DEPENDENCIES — AVAILABLE (${analysis.dependencies?.length || 0} production, ${analysis.devDependencies?.length || 0} dev):
- Production: ${deps || 'none'}
- Dev: ${devDeps || 'none'}

DEPENDENCY SOURCE-CODE USAGE VERIFICATION (via GitHub code search — best effort, not perfect):
- CONFIRMED referenced in source code: ${verifiedUsed.length ? verifiedUsed.map((d) => d.name).join(', ') : 'none'}
- CONFIRMED NOT found referenced anywhere in source code: ${verifiedUnused.length ? verifiedUnused.map((d) => d.name).join(', ') : 'none'}
- NOT VERIFIED (usage unknown — could not be checked): ${unverified.length ? unverified.map((d) => d.name).join(', ') : 'none'}

RULE: You may ONLY say a dependency is "unused" for names in the CONFIRMED NOT found list above. NEVER claim a dependency in the NOT VERIFIED list is unused — for those, at most note the dependency exists, or say nothing about its usage status.`);
  }

  sections.push(
    availability.ciDataAvailable && ciStats.totalRuns > 0
      ? `CI/CD DATA — AVAILABLE:
- Total workflow runs analyzed: ${ciStats.totalRuns}
- Failed runs: ${ciStats.failedRuns}
- Success rate: ${ciStats.successRate}%
- Workflow names: ${ciStats.workflowNames?.join(', ') || 'unnamed'}
- CI compute time: ${breakdown.ciHoursAnalyzed || 0} hours`
      : `CI/CD DATA — NOT AVAILABLE (no GitHub Actions workflow runs detected, or Actions isn't used/accessible; this does not mean CI is broken, just that there's nothing to analyze). Do NOT generate any CI/CD optimization suggestions.`
  );

  sections.push(
    availability.fileTreeAvailable
      ? `FILE STRUCTURE — AVAILABLE:
- Total files: ${fileStats.totalFiles}
- Large files (>500KB): ${largeFilesList || 'none found — do not suggest large-file/Git LFS cleanup'}
- Config/build files detected: ${configFilesList || 'none detected'}
- Dockerfile present: ${hasDockerfile ? 'YES' : 'NO — do not generate any Docker/container-related suggestions'}
- GitHub Actions workflow files: ${fileStats.workflowFileCount || 0}`
      : `FILE STRUCTURE — NOT AVAILABLE (repository file tree could not be read; this does not mean the repo has no large files or config files, just that we couldn't check). Do NOT generate suggestions about large files, Dockerfile/Docker, or repository structure.`
  );

  return `You are a senior software sustainability engineer reviewing a REAL GitHub repository analysis. Every fact below was collected directly from the GitHub API for this exact repository — nothing here is estimated or assumed.

${sections.join('\n\n')}

STRICT RULES:
1. Only generate a suggestion in a category if that category's data above is marked AVAILABLE. If a category is NOT AVAILABLE, skip it entirely — never treat "not available" as "zero" or as license to guess.
2. Every suggestion must reference a SPECIFIC real number, package name, file path, or workflow name from the data above. Generic advice that could apply to any repository is not acceptable.
3. Do not invent facts not present in the data above.
4. A dependency may only be called "unused" if it appears in the CONFIRMED NOT found list. Never claim a NOT VERIFIED dependency is unused.
5. Docker/container suggestions are only allowed if "Dockerfile present: YES" above.
6. At least one suggestion of type "carbon" MUST directly reference the deep breakdown percentages above and explain the dominant contributor, not just restate the total CO2 figure.
7. Prefer fewer, stronger suggestions: return between 2 and 5 suggestions total. Do NOT pad the list to hit a higher count — 2 well-evidenced suggestions are better than 5 weak ones. It is correct to return fewer than 5 if the available evidence doesn't support more.
8. For EVERY suggestion, fill in all five fields below with real, specific content — no field should restate the title or be generic filler.

Respond ONLY with a JSON array (no markdown, no explanation) where each item has exactly this shape:
{
  "suggestionType": one of "energy" | "performance" | "carbon" | "architecture" | "dependency",
  "title": "short specific title, under 60 characters",
  "whatWasFound": "the specific real evidence this is based on — exact numbers, names, or paths from the data above",
  "whyItMatters": "why this specific finding is a sustainability/carbon concern",
  "recommendedAction": "the exact, concrete next step to take — specific enough someone could act on it immediately",
  "expectedImpact": "the expected carbon/energy effect of taking this action, grounded in the numbers above where possible",
  "confidence": one of "low" | "medium" | "high" — how confident you are given the evidence quality,
  "impact": one of "low" | "medium" | "high" — how much this matters relative to the repo's overall footprint,
  "description": "1-2 sentence summary combining whatWasFound and recommendedAction, for compact display"
}`;
};

/**
 * Generates real AI suggestions from Gemini based on actual, structured
 * analysis data (never hardcoded/templated suggestions).
 */
const generateSuggestions = async ({ analysis, repository }) => {
  const prompt = buildPrompt({ analysis, repository });

  const raw = await generateJSON(prompt);

  if (!Array.isArray(raw)) {
    throw new Error('Expected an array of suggestions from Gemini');
  }

  // Sanitize — never trust the model's output shape blindly, since it
  // gets written straight into MongoDB.
  const suggestions = raw
    .filter((s) => s && s.title && (s.recommendedAction || s.description))
    .slice(0, 5) // hard cap regardless of what the model returned
    .map((s) => ({
      suggestionType: VALID_TYPES.includes(s.suggestionType) ? s.suggestionType : 'architecture',
      title: String(s.title).slice(0, 100),
      description: String(s.description || s.recommendedAction || '').slice(0, 600),
      whatWasFound: String(s.whatWasFound || '').slice(0, 500),
      whyItMatters: String(s.whyItMatters || '').slice(0, 500),
      recommendedAction: String(s.recommendedAction || '').slice(0, 500),
      expectedImpact: String(s.expectedImpact || '').slice(0, 300),
      confidence: VALID_CONFIDENCE.includes(s.confidence) ? s.confidence : 'medium',
      impact: VALID_IMPACT.includes(s.impact) ? s.impact : 'medium'
    }));

  if (suggestions.length === 0) {
    throw new Error('Gemini returned no usable suggestions');
  }

  return suggestions;
};

module.exports = { generateSuggestions };
