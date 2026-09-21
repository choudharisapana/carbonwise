/**
 * Composite scoring service.
 *
 * The core "carbonScore" (0-100, based on actual gCO2e) comes from
 * carbonCalculatorService, which uses real fetched data. This service adds
 * supporting sub-scores that describe engineering practices tied to
 * sustainability — each based on real signals, not stand-ins like
 * "stars > 100" which have no causal relationship to emissions.
 *
 * IMPORTANT: when a data source wasn't available for this analysis (private
 * repo without Actions access, no package.json, tree fetch failed), the
 * corresponding sub-score stays at its neutral default rather than being
 * pulled down — absence of data is not evidence of a problem.
 */
const calculateScore = ({
  carbonResult,
  repository,
  ciHoursAnalyzed = 0,
  dependencyCount = 0,
  ciStats = { hasData: false },
  fileStats = { hasData: false }
}) => {
  const { sustainabilityScore: carbonScore } = carbonResult;

  // CI/CD health: starts from the same neutral baseline as before (some
  // activity detected vs none). If we have a real, meaningfully-sized
  // sample of CI runs (3+), refine it using actual success rate instead
  // of just "did any CI run at all".
  let ciCdScore = ciHoursAnalyzed > 0 ? 80 : 60;

  if (ciStats.hasData && ciStats.totalRuns >= 3 && ciStats.successRate !== null) {
    // Blend: base activity score still counts for something, but a real
    // reliability signal (successRate) now carries most of the weight.
    ciCdScore = Math.round(ciStats.successRate * 0.7 + ciCdScore * 0.3);
  }

  // Dependency health: fewer dependencies generally means smaller attack
  // surface, faster installs, and lower network transfer energy. A repo
  // with 0 detected dependencies (e.g. non-Node project, or no
  // package.json readable) is scored neutrally-high, not penalized.
  let dependencyScore = 90;
  if (dependencyCount > 80) dependencyScore = 40;
  else if (dependencyCount > 40) dependencyScore = 60;
  else if (dependencyCount > 15) dependencyScore = 75;

  // Codebase size: smaller repos generally mean less storage energy and
  // faster clone/build times.
  const sizeGB = (repository.size || 0) / (1024 * 1024);
  let codebaseScore = 90;
  if (sizeGB > 1) codebaseScore = 50;
  else if (sizeGB > 0.25) codebaseScore = 70;

  // Small, evidence-gated adjustment: genuinely large tracked files are a
  // real storage/bloat signal independent of overall repo size. Only
  // applied when the file tree was actually readable.
  if (fileStats.hasData && fileStats.largeFiles?.length > 0) {
    codebaseScore = Math.max(30, codebaseScore - fileStats.largeFiles.length * 5);
  }

  const finalScore = Math.round(
    carbonScore * 0.5 +
    ciCdScore * 0.2 +
    dependencyScore * 0.2 +
    codebaseScore * 0.1
  );

  let grade = 'E';
  if (finalScore >= 90) grade = 'A';
  else if (finalScore >= 75) grade = 'B';
  else if (finalScore >= 60) grade = 'C';
  else if (finalScore >= 40) grade = 'D';

  return {
    sustainabilityScore: finalScore,
    grade,
    breakdown: {
      carbonScore,
      ciCdScore,
      dependencyScore,
      codebaseScore
    }
  };
};

module.exports = {
  calculateScore
};
