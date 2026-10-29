const Repository = require('../models/Repository');
const Analysis = require('../models/Analysis');
const Report = require('../models/Report');

const getDashboardData = async (userId) => {
  

    const totalRepositories = await Repository.countDocuments({
        user: userId
    });

    const totalAnalyses = await Analysis.countDocuments({
        user: userId
    });

    const totalReports = await Report.countDocuments({
        user: userId
    });

  

    const repositories = await Repository.find({
        user: userId
    }).sort({
        createdAt: -1
    });

    

    const analyses = await Analysis.find({
        user: userId
    })
        .sort({
            createdAt: -1
        });


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


    const analysisCount = latestAnalyses.length || 1;

    const averageEnergyDistribution = {
        ci: energyDistribution.ci / analysisCount,
        storage: energyDistribution.storage / analysisCount,
        network: energyDistribution.network / analysisCount
    };


    const recentRepositories =
        repositories.slice(0, 5);


    return {
        totalRepositories,

        totalAnalyses,

        totalReports,

   
        averageCarbon:
            Number(
                averageCarbon.toFixed(2)
            ),

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

        energyDistribution: averageEnergyDistribution,

        // Latest connected repositories.
        recentRepositories
    };
};

module.exports = {
    getDashboardData
};
