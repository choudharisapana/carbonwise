// backend/src/controllers/analyticsController.js

const Analysis = require('../models/Analysis');

const getAnalytics = async (req, res) => {
    try {

        // Get all analyses of logged-in user.
        // Latest analyses first so we can keep only the latest
        // analysis for each repository.
        const analyses = await Analysis.find({
            user: req.user.id
        })
            .populate('repository')
            .sort({ createdAt: -1 });


        // =====================================================
        // Keep ONLY latest analysis for each repository
        // =====================================================

        const latestByRepository = new Map();

        analyses.forEach((analysis) => {

            if (!analysis.repository) return;

            const repositoryId =
                analysis.repository._id.toString();

            // Because results are sorted newest first,
            // first analysis for a repository is its latest analysis.
            if (!latestByRepository.has(repositoryId)) {
                latestByRepository.set(
                    repositoryId,
                    analysis
                );
            }
        });


        const latestAnalyses =
            Array.from(latestByRepository.values());


        // =====================================================
        // Repository-wise Analytics
        // =====================================================

        const repositoryAnalytics =
            latestAnalyses.map((analysis) => {

                const breakdown =
                    analysis.energyBreakdown || {};

                const ciEnergy =
                    Number(
                        breakdown.ciEnergyKWh || 0
                    );

                const storageEnergy =
                    Number(
                        breakdown.storageEnergyKWh || 0
                    );

                const networkEnergy =
                    Number(
                        breakdown.networkEnergyKWh || 0
                    );


                // Find the biggest energy contributor
                const contributors = [
                    {
                        name: 'CI/CD Compute',
                        value: ciEnergy
                    },
                    {
                        name: 'Repository Storage',
                        value: storageEnergy
                    },
                    {
                        name: 'Dependencies / Network',
                        value: networkEnergy
                    }
                ];

                const mainContributor =
                    contributors.sort(
                        (a, b) =>
                            b.value - a.value
                    )[0];


                return {

                    repositoryId:
                        analysis.repository._id,

                    repositoryName:
                        analysis.repository.repositoryName,

                    language:
                        analysis.repository.language,

                    co2Emission:
                        Number(
                            (
                                analysis.co2Emission || 0
                            ).toFixed(3)
                        ),

                    energyConsumption:
                        Number(
                            (
                                analysis.energyConsumption || 0
                            ).toFixed(6)
                        ),

                    sustainabilityScore:
                        Math.round(
                            analysis.sustainabilityScore || 0
                        ),

                    carbonScore:
                        Math.round(
                            analysis.carbonScore || 0
                        ),

                    dependencyCount:
                        breakdown.dependencyCount || 0,

                    energyBreakdown: {

                        ciEnergyKWh:
                            Number(
                                ciEnergy.toFixed(6)
                            ),

                        storageEnergyKWh:
                            Number(
                                storageEnergy.toFixed(6)
                            ),

                        networkEnergyKWh:
                            Number(
                                networkEnergy.toFixed(6)
                            )
                    },

                    mainContributor:
                        mainContributor &&
                        mainContributor.value > 0
                            ? mainContributor.name
                            : 'No measurable activity'
                };
            });


        // =====================================================
        // Summary Metrics
        // =====================================================

        const repositoriesAnalyzed =
            repositoryAnalytics.length;


        const totalCo2Emission =
            repositoryAnalytics.reduce(
                (sum, repo) =>
                    sum + repo.co2Emission,
                0
            );


        const totalEnergyConsumption =
            repositoryAnalytics.reduce(
                (sum, repo) =>
                    sum + repo.energyConsumption,
                0
            );


        const sustainabilityAverage =
            repositoriesAnalyzed
                ? Math.round(
                    repositoryAnalytics.reduce(
                        (sum, repo) =>
                            sum +
                            repo.sustainabilityScore,
                        0
                    ) /
                    repositoriesAnalyzed
                )
                : 0;


        // =====================================================
        // Energy Breakdown Across Latest Repository Analyses
        // =====================================================

        const energyBreakdown =
            repositoryAnalytics.reduce(
                (total, repo) => {

                    total.ciEnergyKWh +=
                        repo.energyBreakdown.ciEnergyKWh;

                    total.storageEnergyKWh +=
                        repo.energyBreakdown.storageEnergyKWh;

                    total.networkEnergyKWh +=
                        repo.energyBreakdown.networkEnergyKWh;

                    return total;
                },
                {
                    ciEnergyKWh: 0,
                    storageEnergyKWh: 0,
                    networkEnergyKWh: 0
                }
            );


        energyBreakdown.ciEnergyKWh =
            Number(
                energyBreakdown.ciEnergyKWh.toFixed(6)
            );

        energyBreakdown.storageEnergyKWh =
            Number(
                energyBreakdown.storageEnergyKWh.toFixed(6)
            );

        energyBreakdown.networkEnergyKWh =
            Number(
                energyBreakdown.networkEnergyKWh.toFixed(6)
            );


        // =====================================================
        // Highest Carbon Impact Repository
        // =====================================================

        const highestImpact =
            repositoryAnalytics.length
                ? [...repositoryAnalytics].sort(
                    (a, b) =>
                        b.co2Emission -
                        a.co2Emission
                )[0]
                : null;


        // =====================================================
        // Most Sustainable Repository
        // =====================================================

        const mostSustainable =
            repositoryAnalytics.length
                ? [...repositoryAnalytics].sort(
                    (a, b) =>
                        b.sustainabilityScore -
                        a.sustainabilityScore
                )[0]
                : null;


        // =====================================================
        // Response
        // =====================================================

        res.json({

            success: true,

            analytics: {

                repositoriesAnalyzed,

                totalCo2Emission:
                    Number(
                        totalCo2Emission.toFixed(3)
                    ),

                totalEnergyConsumption:
                    Number(
                        totalEnergyConsumption.toFixed(6)
                    ),

                sustainabilityAverage,

                repositoryAnalytics,

                energyBreakdown,

                highestImpact,

                mostSustainable
            }
        });

    } catch (error) {

        console.error(
            'Analytics Error:',
            error
        );

        res.status(500).json({

            success: false,

            message: error.message
        });
    }
};


module.exports = {
    getAnalytics
};