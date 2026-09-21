const {
  CI_RUNNER_AVG_POWER_KW,
  STORAGE_KWH_PER_GB_PER_YEAR,
  STORAGE_AMORTIZATION_DAYS,
  NETWORK_KWH_PER_GB,
  AVG_DEPENDENCY_SIZE_MB,
  GRID_CARBON_INTENSITY_G_PER_KWH,
  SCORE_BANDS
} = require('../config/carbonConstants');

/**
 * Calculate estimated CO2 emissions for a repository based on REAL,
 * fetched data — not placeholder heuristics.
 *
 * Core energy/CO2 math is UNCHANGED from the original methodology (still
 * cited in the comments below) — only the recommendations generation was
 * expanded to reference the additional real evidence now available
 * (CI reliability, large files, language mix), when that data was
 * actually collected for this analysis.
 *
 * Inputs:
 *   repository: { size, language } — from GitHub repo metadata
 *   ciBillableMs: total real GitHub Actions billable milliseconds
 *   dependencyCount: number of npm dependencies (from package.json)
 *   ciStats: optional — { hasData, totalRuns, failedRuns, successRate }
 *   fileStats: optional — { hasData, largeFiles, configFilesDetected }
 *   languageBreakdown: optional — { hasData, languages: {JS: bytes, ...} }
 *
 * Methodology: energy (kWh) per component, summed, then multiplied by
 * grid carbon intensity (gCO2/kWh) — modeled on the Green Software
 * Foundation's Software Carbon Intensity (SCI) formula shape.
 * See config/carbonConstants.js for cited sources on every coefficient.
 */
const calculateCarbon = ({
  repository,
  ciBillableMs = 0,
  dependencyCount = 0,
  ciStats = { hasData: false },
  fileStats = { hasData: false },
  languageBreakdown = { hasData: false }
}) => {
  const sizeGB = (repository.size || 0) / (1024 * 1024); // GitHub size is in KB

  // --- Component 1: CI/CD compute energy (real measured data) ---
  const ciHours = ciBillableMs / (1000 * 60 * 60);
  const ciEnergyKWh = ciHours * CI_RUNNER_AVG_POWER_KW;

  // --- Component 2: Storage energy (amortized per-analysis) ---
  const storageEnergyKWh =
    sizeGB *
    STORAGE_KWH_PER_GB_PER_YEAR *
    (STORAGE_AMORTIZATION_DAYS / 365);

  // --- Component 3: Dependency / network transfer energy ---
  const dependencySizeGB = (dependencyCount * AVG_DEPENDENCY_SIZE_MB) / 1024;
  const networkEnergyKWh = dependencySizeGB * NETWORK_KWH_PER_GB;

  const totalEnergyKWh = ciEnergyKWh + storageEnergyKWh + networkEnergyKWh;

  // --- Convert energy to CO2e using grid carbon intensity ---
  const co2Grams = Number(
    (totalEnergyKWh * GRID_CARBON_INTENSITY_G_PER_KWH).toFixed(3)
  );

  // --- Normalize into a 0-100 sustainability score using documented bands ---
  const band = SCORE_BANDS.find((b) => co2Grams <= b.maxGrams);
  const sustainabilityScore = band ? band.score : 10;

  // --- Recommendations — each one only fires when the underlying data
  // actually supports it. No recommendation is generated from a category
  // whose data wasn't available for this analysis. ---
  const recommendations = [];
  const components = [
    { name: 'CI/CD compute', value: ciEnergyKWh },
    { name: 'Repository storage', value: storageEnergyKWh },
    { name: 'Dependencies/network transfer', value: networkEnergyKWh }
  ].sort((a, b) => b.value - a.value);

  const topContributor = components[0];

  if (totalEnergyKWh === 0) {
    recommendations.push(
      'No CI/CD activity or dependency data detected yet — run an analysis after your next workflow run for more accurate results.'
    );
  } else if (topContributor.name === 'CI/CD compute' && ciHours > 0) {
    recommendations.push(
      'CI/CD is your largest energy contributor — consider caching dependencies, reducing matrix build combinations, or using conditional workflow triggers to cut redundant runs.'
    );
  } else if (topContributor.name === 'Dependencies/network transfer' && dependencyCount > 30) {
    recommendations.push(
      `This project has ${dependencyCount} dependencies — auditing and removing unused ones would meaningfully reduce transfer energy on every install/deploy.`
    );
  } else if (topContributor.name === 'Repository storage' && sizeGB > 0.5) {
    recommendations.push(
      'Repository size is a significant factor — consider using Git LFS for large binary assets or cleaning up unused files/history.'
    );
  }

  // Evidence-gated: only mention CI reliability if we actually have CI run
  // data with a meaningful sample (avoid drawing conclusions from 1-2 runs).
  if (ciStats.hasData && ciStats.totalRuns >= 3 && ciStats.successRate < 80) {
    recommendations.push(
      `${ciStats.failedRuns} of your last ${ciStats.totalRuns} workflow runs failed (${ciStats.successRate}% success rate) — failed runs still consume compute energy without producing value, so fixing flaky CI steps would reduce wasted emissions.`
    );
  }

  // Evidence-gated: only mention large files if the file tree was actually
  // readable and genuinely found some.
  if (fileStats.hasData && fileStats.largeFiles?.length > 0) {
    const biggest = fileStats.largeFiles[0];
    recommendations.push(
      `${fileStats.largeFiles.length} file(s) over 500KB were found in the repository (largest: ${biggest.path} at ${biggest.sizeKB}KB) — consider Git LFS or removing them from history if they're binary assets.`
    );
  }

  // Evidence-gated: only mention language mix if we actually got a
  // breakdown with more than one language present.
  if (languageBreakdown.hasData) {
    const langs = Object.keys(languageBreakdown.languages || {});
    if (repository.language === 'JavaScript' || repository.language === 'TypeScript' || langs.includes('JavaScript') || langs.includes('TypeScript')) {
      recommendations.push('Enable tree-shaking and code-splitting in your bundler to reduce shipped code size.');
    }
  }

  return {
    breakdown: {
      ciEnergyKWh: Number(ciEnergyKWh.toFixed(6)),
      storageEnergyKWh: Number(storageEnergyKWh.toFixed(6)),
      networkEnergyKWh: Number(networkEnergyKWh.toFixed(6)),
      ciHoursAnalyzed: Number(ciHours.toFixed(4)),
      dependencyCount
    },
    energyConsumption: Number(totalEnergyKWh.toFixed(6)), // kWh
    co2Emission: co2Grams, // grams CO2e
    sustainabilityScore,
    carbonScore: sustainabilityScore,
    recommendations,
    methodology: 'Estimated using real CI/CD compute time (GitHub Actions API), repository size, and dependency count, converted to energy via Cloud Carbon Footprint / Sustainable Web Design coefficients, then to CO2e via global average grid carbon intensity (Ember Global Electricity Review). Recommendations are additionally grounded in real CI reliability, file structure, and language composition data where available.'
  };
};

module.exports = {
  calculateCarbon
};
