/**
 * Composite scoring service.
 *
 * The core "carbonScore" (0-100, based on actual gCO2e) now comes from
 * carbonCalculatorService, which uses real fetched data. This service adds
 * supporting sub-scores that describe engineering practices tied to
 * sustainability — each is now based on real signals, not stand-ins like
 * "stars > 100" which have no causal relationship to emissions.
 */
const calculateScore = ({ carbonResult, repository, ciHoursAnalyzed = 0, dependencyCount = 0 }) => {
  const { sustainabilityScore: carbonScore } = carbonResult;

  // CI/CD health: repos with SOME CI/CD activity are being tested/automated
  // (fewer manual deploys = fewer redundant/failed runs over time). A repo
  // with zero detected runs isn't necessarily worse, so we score neutrally.
  const ciCdScore = ciHoursAnalyzed > 0 ? 80 : 60;

  // Dependency health: fewer dependencies generally means smaller attack
  // surface, faster installs, and lower network transfer energy.
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
