const Repository =
require('../models/Repository');

const Analysis =
require('../models/Analysis');

const Report =
require('../models/Report');

const getDashboardData =
async(userId)=>{

    const totalRepositories =
        await Repository.countDocuments({
            user:userId
        });

    const totalAnalyses =
        await Analysis.countDocuments({
            user:userId
        });

    const totalReports =
        await Report.countDocuments({
            user:userId
        });

    const analyses =
        await Analysis.find({
            user:userId
        });

    let averageCarbon = 0;
    let averageSustainability = 0;
    let averageEnergyConsumption = 0;

    if(analyses.length){

        averageCarbon =
            analyses.reduce(
                (sum,a)=>
                    sum+
                    (a.carbonScore||0),
                0
            )/analyses.length;

        averageSustainability =
            analyses.reduce(
                (sum,a)=>
                    sum+
                    (a.sustainabilityScore||0),
                0
            )/analyses.length;

        averageEnergyConsumption =
            analyses.reduce(
                (sum,a)=>
                    sum+
                    (a.energyConsumption||0),
                0
            )/analyses.length;
    }

    // Real energy distribution (CI/CD vs Storage vs Network/Dependencies)
    // summed across all analyses — replaces the old hardcoded pie chart.
    const energyDistribution = analyses.reduce(
        (totals, a) => {
            const b = a.energyBreakdown || {};
            totals.ci += b.ciEnergyKWh || 0;
            totals.storage += b.storageEnergyKWh || 0;
            totals.network += b.networkEnergyKWh || 0;
            return totals;
        },
        { ci: 0, storage: 0, network: 0 }
    );

    const recentRepositories =
        await Repository
        .find({
            user:userId
        })
        .sort({
            createdAt:-1
        })
        .limit(5);

    return {

        totalRepositories,

        totalAnalyses,

        totalReports,

        averageCarbon:
            Math.round(
                averageCarbon
            ),

        averageSustainability:
            Math.round(
                averageSustainability
            ),

        // Converted kWh -> Wh since our per-analysis kWh values are tiny
        // (fractions of a kWh) and would show as "0.00 kWh" on the dashboard.
        averageEnergyConsumptionWh:
            Number(
                (averageEnergyConsumption * 1000).toFixed(2)
            ),

        energyDistribution,

        recentRepositories
    };
};

module.exports = {
    getDashboardData
};