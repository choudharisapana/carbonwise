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
 * Inputs:
 *   repository: { size } — size in KB, from GitHub repo metadata
 *   ciBillableMs: total real GitHub Actions billable milliseconds
 *                 (from githubService.fetchTotalCiBillableMs)
 *   dependencyCount: number of npm dependencies (from package.json)
 *
 * Methodology: energy (kWh) per component, summed, then multiplied by
 * grid carbon intensity (gCO2/kWh) — modeled on the Green Software
 * Foundation's Software Carbon Intensity (SCI) formula shape.
 * See config/carbonConstants.js for cited sources on every coefficient.
 */
const calculateCarbon = ({ repository, ciBillableMs = 0, dependencyCount = 0 }) => {
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

  // --- Recommendations based on which component actually dominates ---
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

  if (repository.language === 'JavaScript' || repository.language === 'TypeScript') {
    recommendations.push('Enable tree-shaking and code-splitting in your bundler to reduce shipped code size.');
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
    methodology: 'Estimated using real CI/CD compute time (GitHub Actions API), repository size, and dependency count, converted to energy via Cloud Carbon Footprint / Sustainable Web Design coefficients, then to CO2e via global average grid carbon intensity (Ember Global Electricity Review).'
  };
};

module.exports = {
  calculateCarbon
};
