// backend/src/controllers/dashboardController.js

const dashboardService =
require('../services/dashboardService');

const Notification =
require('../models/Notification');


// ===================================
// GET Dashboard
// ===================================
const getDashboard =
async(req,res)=>{

    try{

        const userId =
            req.user.id;

        const dashboard =
            await dashboardService
            .getDashboardData(
                userId
            );

        const notifications =
            await Notification
            .find({
                user:userId
            })
            .sort({
                createdAt:-1
            })
            .limit(5);

        res.json({

            success:true,

            totalRepositories:
                dashboard
                .totalRepositories,

            totalAnalyses:
                dashboard
                .totalAnalyses,

            totalReports:
                dashboard
                .totalReports,

            averageCarbon:
                dashboard
                .averageCarbon,

            averageSustainability:
                dashboard
                .averageSustainability,

            averageEnergyConsumptionWh:
                dashboard
                .averageEnergyConsumptionWh,

            energyDistribution:
                dashboard
                .energyDistribution,

            recentRepositories:
                dashboard
                .recentRepositories,

            notifications
        });

    }
    catch(error){

        console.error(
            error
        );

        res.status(500)
        .json({

            success:false,

            message:
                error.message
        });
    }
};

module.exports = {
    getDashboard
};