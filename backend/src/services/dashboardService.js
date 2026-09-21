const Repository = require('../models/Repository');
const Analysis = require('../models/Analysis');
const Report = require('../models/Report');

const getDashboardData = async (userId) => {
    // =========================================
    // Basic Counts
    // =========================================

    const totalRepositories = await Repository.countDocuments({
        user: userId
    });

    const totalAnalyses = await Analysis.countDocuments({
        user: userId
    });

    const totalReports = await Report.countDocuments({
        user: userId
    });

    // =========================================
    // Fetch User Repositories
    // =========================================

    const repositories = await Repository.find({
        user: userId
    }).sort({
        createdAt: -1
    });

    // =========================================
    // Fetch Analyses
    // =========================================
    // Only the LATEST analysis for each repository
    // is used for dashboard metrics.
    //
    // This prevents repeated re-analysis of the same
    // repository from inflating dashboard values.

    const analyses = await Analysis.find({
        user: userId
    })
        .sort({
            createdAt: -1
        });

    // =========================================
    // Latest Analysis Per Repository
    // =========================================

    const latestAnalysisMap = new Map();

    for (const analysis of analyses) {
        const repositoryId =
            analysis.repository?.toString();

        if (
            repositoryId &&
            !latestAnalysisMap.has(repositoryId)
        ) {
            latestAnalysisMap.set(
                repositoryId,
                analysis
            );
        }
    }

    const latestAnalyses = Array.from(
        latestAnalysisMap.values()
    );

    // =========================================
    // Average Sustainability
    // =========================================
    // Current repository values are used so the
    // Dashboard matches Repository Analysis.

    const analyzedRepositories =
        repositories.filter(
            (repository) =>
                repository.lastAnalyzed
        );

    let averageSustainability = 0;

    if (analyzedRepositories.length) {
        averageSustainability =
            analyzedRepositories.reduce(
                (sum, repository) =>
                    sum +
                    (Number(
                        repository.sustainabilityScore
                    ) || 0),
                0
            ) / analyzedRepositories.length;
    }

    // =========================================
    // Average CO2 & Energy
    // =========================================

    let averageCarbon = 0;
    let averageEnergyConsumption = 0;

    if (latestAnalyses.length) {
        averageCarbon =
            latestAnalyses.reduce(
                (sum, analysis) =>
                    sum +
                    (Number(
                        analysis.co2Emission
                    ) || 0),
                0
            ) / latestAnalyses.length;

        averageEnergyConsumption =
            latestAnalyses.reduce(
                (sum, analysis) =>
                    sum +
                    (Number(
                        analysis.energyConsumption
                    ) || 0),
                0
            ) / latestAnalyses.length;
    }

    // =========================================
    // Energy Distribution
    // =========================================
    // Only latest analysis of each repository
    // contributes to the dashboard.

    const energyDistribution =
        latestAnalyses.reduce(
            (totals, analysis) => {
                const breakdown =
                    analysis.energyBreakdown || {};

                totals.ci +=
                    Number(
                        breakdown.ciEnergyKWh
                    ) || 0;

                totals.storage +=
                    Number(
                        breakdown.storageEnergyKWh
                    ) || 0;

                totals.network +=
                    Number(
                        breakdown.networkEnergyKWh
                    ) || 0;

                return totals;
            },
            {
                ci: 0,
                storage: 0,
                network: 0
            }
        );

    // =========================================
    // Recent Repositories
    // =========================================

    const recentRepositories =
        repositories.slice(0, 5);

    // =========================================
    // Final Response
    // =========================================

    return {
        totalRepositories,

        totalAnalyses,

        totalReports,

        // Average estimated CO2 emission
        // across latest analysis of each repository.
        averageCarbon:
            Number(
                averageCarbon.toFixed(2)
            ),

        // Average sustainability across
        // currently analyzed repositories.
        averageSustainability:
            Math.round(
                averageSustainability
            ),

        // Convert kWh -> Wh.
        averageEnergyConsumptionWh:
            Number(
                (
                    averageEnergyConsumption *
                    1000
                ).toFixed(2)
            ),

        // Real energy breakdown.
        energyDistribution,

        // Latest connected repositories.
        recentRepositories
    };
};

module.exports = {
    getDashboardData
};
