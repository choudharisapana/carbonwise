/**
 * Carbon Calculation Coefficients
 * ================================
 * These constants are used to convert measurable GitHub repository data
 * (CI/CD compute time, storage size, dependency count) into estimated
 * energy consumption (kWh) and CO2 emissions (grams CO2e).
 *
 * IMPORTANT: These are industry-published approximations, not exact
 * measurements — the same caveat applies to every public carbon calculator
 * (e.g. websitecarbon.com, Cloud Carbon Footprint). We cite our sources
 * below so the methodology is transparent and defensible, unlike the
 * previous version of this project which used arbitrary hardcoded scores.
 *
 * Cite these sources in your project report:
 * 1. Cloud Carbon Footprint (Thoughtworks, open source) — cloud compute
 *    and storage energy coefficients: https://www.cloudcarbonfootprint.org/docs/methodology
 * 2. Sustainable Web Design Model v4 (used by websitecarbon.com,
 *    thegreenwebfoundation.org) — data transfer energy intensity.
 * 3. Ember / IEA Global Electricity Review — global average grid carbon
 *    intensity: https://ember-climate.org/data/data-tools/global-electricity-review/
 * 4. Green Software Foundation — Software Carbon Intensity (SCI) spec,
 *    the general formula shape (energy x carbon intensity + embodied
 *    emissions per functional unit) this service is modeled on:
 *    https://sci-guide.greensoftware.foundation/
 */

module.exports = {
  // ---- CI/CD compute energy ----
  // GitHub-hosted Linux runners are 2 vCPU / 7GB RAM (Azure Standard_DS2_v2
  // class). Cloud Carbon Footprint's published coefficients put average
  // power draw for a comparable VM at ~15W under active load.
  // Source: Cloud Carbon Footprint methodology, Azure compute coefficients.
  CI_RUNNER_AVG_POWER_KW: 0.015, // 15 watts, expressed in kW

  // ---- Storage energy ----
  // Estimated annual energy to store 1GB in a data center.
  // Source: Cloud Carbon Footprint storage coefficients (SSD/HDD blended
  // estimate), commonly cited range is 0.02–0.08 kWh/GB/year.
  STORAGE_KWH_PER_GB_PER_YEAR: 0.06,

  // We amortize storage energy over a single analysis "snapshot" — treating
  // it as the energy footprint attributable to this repo existing for one
  // day of storage, since a full year isn't meaningful per-analysis.
  STORAGE_AMORTIZATION_DAYS: 1,

  // ---- Dependency / network transfer energy ----
  // Energy to transfer 1GB of data (download dependencies, clone, deploy).
  // Source: Sustainable Web Design Model v4 — 0.81 kWh/GB is the widely
  // cited figure used by websitecarbon.com and DIMPACT research.
  NETWORK_KWH_PER_GB: 0.81,

  // Average size estimate per npm dependency (unpacked), used when we only
  // have a dependency COUNT rather than actual measured bundle size.
  // Rough industry estimate — actual sizes vary widely by package.
  AVG_DEPENDENCY_SIZE_MB: 3,

  // ---- Grid carbon intensity ----
  // Global average grid carbon intensity in grams CO2 per kWh.
  // Source: Ember Global Electricity Review 2024 (global average).
  // This can be swapped for a region-specific figure if you know where
  // the repo's CI/CD or hosting actually runs.
  GRID_CARBON_INTENSITY_G_PER_KWH: 442,

  // ---- Scoring bands ----
  // Thresholds (in grams CO2e per analysis) used to translate a raw
  // emissions number into an interpretable 0–100 score. These bands are
  // a project-defined heuristic (clearly disclosed as such) since there is
  // no universal "good vs bad" absolute emissions number for a git repo —
  // but critically, the grams number itself is now derived from real,
  // fetched data instead of being invented.
  SCORE_BANDS: [
    { maxGrams: 5, score: 95 },
    { maxGrams: 20, score: 85 },
    { maxGrams: 50, score: 70 },
    { maxGrams: 100, score: 55 },
    { maxGrams: 250, score: 40 },
    { maxGrams: 500, score: 25 },
    { maxGrams: Infinity, score: 10 }
  ]
};
