// // // backend/src/controllers/analysisController.js

// // const Repository = require('../models/Repository');
// // const Analysis = require('../models/Analysis');
// // const Report = require("../models/Report");

// // const carbonCalculator =
// // require('../services/carbonCalculatorService');

// // const scoringService =
// // require('../services/scoringService');

// // const githubService =
// // require('../services/githubService');

// // const getUserGithubToken =
// // require('../utils/getUserGithubToken');

// // const historyService =
// // require('../services/historyService');

// // const notificationService =
// // require('../services/notificationService');


// // // ====================================
// // // Create Repository Analysis
// // // POST /api/analysis/:repositoryId
// // // ====================================
// // const createAnalysis = async (req, res) => {

// //     try {

// //         const { repositoryId } = req.params;

// //         // Find repository
// //         const repo =
// //             await Repository.findById(repositoryId);

// //         if (!repo) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: 'Repository not found'
// //             });
// //         }

// //         // Fetch REAL supporting data from GitHub before calculating —
// //         // this is what makes the emissions number defensible instead of
// //         // a formula based purely on stars/forks. Uses the user's own
// //         // connected GitHub token if available (needed for private repos),
// //         // falling back to the shared app-level token otherwise.
// //         const userToken = await getUserGithubToken(req.user.id);

// //         const [ciData, dependencyCount] = await Promise.all([
// //             githubService.fetchTotalCiBillableMs(repo.owner, repo.repositoryName, userToken),
// //             githubService.fetchDependencyCount(repo.owner, repo.repositoryName, userToken)
// //         ]);

// //         // Calculate carbon metrics from real data
// //         const carbonResult =
// //             carbonCalculator.calculateCarbon({
// //                 repository: repo,
// //                 ciBillableMs: ciData.totalMs,
// //                 dependencyCount
// //             });

// //         // Calculate sustainability score
// //         const scoreResult =
// //             scoringService.calculateScore({
// //                 carbonResult,
// //                 repository: repo,
// //                 ciHoursAnalyzed: carbonResult.breakdown.ciHoursAnalyzed,
// //                 dependencyCount
// //             });

// //         // Create analysis
// //         const analysis =
// //             await Analysis.create({

// //                 user: req.user.id,

// //                 repository: repo._id,

// //                 carbonScore:
// //                     carbonResult.carbonScore,

// //                 energyConsumption:
// //                     carbonResult.energyConsumption,

// //                 co2Emission:
// //                     carbonResult.co2Emission,

// //                 sustainabilityScore:
// //                     scoreResult.sustainabilityScore,

// //                 recommendations:
// //                     carbonResult.recommendations,

// //                 energyBreakdown:
// //                     carbonResult.breakdown,

// //                 methodology:
// //                     carbonResult.methodology
// //             });

// //         // Save history
// //         await historyService.saveHistory({

// //             user: req.user.id,

// //             repository: repo._id,

// //             analysis: analysis._id,

// //             carbonScore:
// //                 carbonResult.carbonScore,

// //             sustainabilityScore:
// //                 scoreResult.sustainabilityScore,

// //             co2Emission:
// //                 carbonResult.co2Emission,

// //             energyConsumption:
// //                 carbonResult.energyConsumption
// //         });

// //         // Create notification
// //         await notificationService.createNotification({

// //             user: req.user.id,

// //             title: 'Analysis Completed',

// //             message:
// //                 `${repo.repositoryName} analysis completed successfully`,

// //             type: 'analysis'
// //         });

// // // ====================================
// // // Auto Generate / Update Report
// // // ====================================

// // let report = await Report.findOne({
// //     user: req.user.id,
// //     repository: repo._id
// // });

// // if (report) {

// //     // Update Existing Report

// //     report.analysis = analysis._id;

// //     report.reportName =
// //         `${repo.repositoryName} Sustainability Report`;

// //     report.carbonScore =
// //         carbonResult.carbonScore;

// //     report.sustainabilityScore =
// //         scoreResult.sustainabilityScore;

// //     report.energyConsumption =
// //         carbonResult.energyConsumption;

// //     report.co2Emission =
// //         carbonResult.co2Emission;

// //     report.recommendations =
// //         carbonResult.recommendations;

// //     report.generatedAt =
// //         new Date();

// //     await report.save();

// // } else {

// //     // Create New Report

// //     await Report.create({

// //         user: req.user.id,

// //         repository: repo._id,

// //         analysis: analysis._id,

// //         reportName:
// //             `${repo.repositoryName} Sustainability Report`,
// //          reportType: "PDF", 
// //         carbonScore:
// //             carbonResult.carbonScore,

// //         sustainabilityScore:
// //             scoreResult.sustainabilityScore,

// //         energyConsumption:
// //             carbonResult.energyConsumption,

// //         co2Emission:
// //             carbonResult.co2Emission,

// //         recommendations:
// //             carbonResult.recommendations
// //     });
// // }
// //         // Update repository
// //         repo.carbonEmission =
// //             carbonResult.co2Emission;

// //         repo.sustainabilityScore =
// //             scoreResult.sustainabilityScore;

// //         repo.lastAnalyzed =
// //             new Date();

// //         await repo.save();

// //         // Return response
// //         res.status(201).json({

// //             success: true,

// //             analysis: {

// //                 ...analysis.toObject(),

// //                 grade:
// //                     scoreResult.grade,

// //                 breakdown:
// //                     scoreResult.breakdown
// //             }
// //         });

// //     }
// //     catch (error) {

// //         console.error(
// //             'Analysis Error:',
// //             error
// //         );

// //         res.status(500).json({
// //             success: false,
// //             message: error.message
// //         });
// //     }
// // };

// // // ====================================
// // // Get Latest Analysis By Repository
// // // GET /api/analysis/repository/:repositoryId
// // // ====================================
// // const getAnalysisByRepository = async (req, res) => {

// //     try {

// //         const analysis = await Analysis
// //             .findOne({
// //                 repository: req.params.repositoryId
// //             })
// //             .populate("repository")
// //             .sort({ createdAt: -1 });

// //         if (!analysis) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "No analysis found for this repository"
// //             });
// //         }

// //         res.json({
// //             success: true,
// //             analysis
// //         });

// //     } catch (error) {

// //         res.status(500).json({
// //             success: false,
// //             message: error.message
// //         });

// //     }

// // };
// // // ====================================
// // // Get Analysis By ID
// // // GET /api/analysis/:id
// // // ====================================
// // const getAnalysis = async (req, res) => {

// //     try {

// //         const analysis =
// //             await Analysis
// //                 .findById(req.params.id)
// //                 .populate(
// //                     'repository'
// //                 );

// //         if (!analysis) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: 'Analysis not found'
// //             });
// //         }

// //         res.json({
// //             success: true,
// //             analysis
// //         });

// //     }
// //     catch (error) {

// //         res.status(500).json({
// //             success: false,
// //             message: error.message
// //         });
// //     }
// // };


// // // ====================================
// // // Get User Analyses
// // // GET /api/analysis
// // // ====================================
// // const getUserAnalyses =
// // async (req, res) => {

// //     try {

// //         const analyses =
// //             await Analysis
// //                 .find({
// //                     user: req.user.id
// //                 })
// //                 .populate(
// //                     'repository'
// //                 )
// //                 .sort({
// //                     createdAt: -1
// //                 });

// //         res.json({
// //             success: true,
// //             analyses
// //         });

// //     }
// //     catch (error) {

// //         res.status(500).json({
// //             success: false,
// //             message: error.message
// //         });
// //     }
// // };


// // module.exports = {

// //     createAnalysis,

// //     getAnalysis,

// //     getAnalysisByRepository,

// //     getUserAnalyses
// // };

// // backend/src/controllers/analysisController.js

// const Repository = require('../models/Repository');
// const Analysis = require('../models/Analysis');
// const Report = require("../models/Report");

// const carbonCalculator =
// require('../services/carbonCalculatorService');

// const scoringService =
// require('../services/scoringService');

// const githubService =
// require('../services/githubService');

// const getUserGithubToken =
// require('../utils/getUserGithubToken');

// const historyService =
// require('../services/historyService');

// const notificationService =
// require('../services/notificationService');


// // ====================================
// // Create Repository Analysis
// // POST /api/analysis/:repositoryId
// // ====================================
// const createAnalysis = async (req, res) => {

//     try {

//         const { repositoryId } = req.params;

//         // Find repository
//         const repo =
//             await Repository.findById(repositoryId);

//         if (!repo) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Repository not found'
//             });
//         }

//         // Fetch REAL supporting data from GitHub before calculating —
//         // this is what makes the emissions number defensible instead of
//         // a formula based purely on stars/forks. Uses the user's own
//         // connected GitHub token if available (needed for private repos),
//         // falling back to the shared app-level token otherwise.
//         const userToken = await getUserGithubToken(req.user.id);

//         const [ciData, dependencyCount] = await Promise.all([
//             githubService.fetchTotalCiBillableMs(repo.owner, repo.repositoryName, userToken),
//             githubService.fetchDependencyCount(repo.owner, repo.repositoryName, userToken)
//         ]);

//         // Calculate carbon metrics from real data
//         const carbonResult =
//             carbonCalculator.calculateCarbon({
//                 repository: repo,
//                 ciBillableMs: ciData.totalMs,
//                 dependencyCount
//             });

//         // Calculate sustainability score
//         const scoreResult =
//             scoringService.calculateScore({
//                 carbonResult,
//                 repository: repo,
//                 ciHoursAnalyzed: carbonResult.breakdown.ciHoursAnalyzed,
//                 dependencyCount
//             });

//         // Create analysis
//         const analysis =
//             await Analysis.create({

//                 user: req.user.id,

//                 repository: repo._id,

//                 carbonScore:
//                     carbonResult.carbonScore,

//                 energyConsumption:
//                     carbonResult.energyConsumption,

//                 co2Emission:
//                     carbonResult.co2Emission,

//                 sustainabilityScore:
//                     scoreResult.sustainabilityScore,

//                 recommendations:
//                     carbonResult.recommendations,

//                 energyBreakdown:
//                     carbonResult.breakdown,

//                 methodology:
//                     carbonResult.methodology
//             });

//         // Save history
//         await historyService.saveHistory({

//             user: req.user.id,

//             repository: repo._id,

//             analysis: analysis._id,

//             carbonScore:
//                 carbonResult.carbonScore,

//             sustainabilityScore:
//                 scoreResult.sustainabilityScore,

//             co2Emission:
//                 carbonResult.co2Emission,

//             energyConsumption:
//                 carbonResult.energyConsumption
//         });

//         // Create notification — only if the user hasn't turned this off in Settings
//         if (req.user?.preferences?.notifications?.analysisCompleted !== false) {
//             await notificationService.createNotification({

//                 user: req.user.id,

//                 title: 'Analysis Completed',

//                 message:
//                     `${repo.repositoryName} analysis completed successfully`,

//                 type: 'analysis'
//             });
//         }

// // ====================================
// // Auto Generate / Update Report
// // ====================================

// let report = await Report.findOne({
//     user: req.user.id,
//     repository: repo._id
// });

// if (report) {

//     // Update Existing Report

//     report.analysis = analysis._id;

//     report.reportName =
//         `${repo.repositoryName} Sustainability Report`;

//     report.carbonScore =
//         carbonResult.carbonScore;

//     report.sustainabilityScore =
//         scoreResult.sustainabilityScore;

//     report.energyConsumption =
//         carbonResult.energyConsumption;

//     report.co2Emission =
//         carbonResult.co2Emission;

//     report.recommendations =
//         carbonResult.recommendations;

//     report.generatedAt =
//         new Date();

//     await report.save();

// } else {

//     // Create New Report

//     await Report.create({

//         user: req.user.id,

//         repository: repo._id,

//         analysis: analysis._id,

//         reportName:
//             `${repo.repositoryName} Sustainability Report`,
//          reportType: "PDF", 
//         carbonScore:
//             carbonResult.carbonScore,

//         sustainabilityScore:
//             scoreResult.sustainabilityScore,

//         energyConsumption:
//             carbonResult.energyConsumption,

//         co2Emission:
//             carbonResult.co2Emission,

//         recommendations:
//             carbonResult.recommendations
//     });
// }
//         // Update repository
//         repo.carbonEmission =
//             carbonResult.co2Emission;

//         repo.sustainabilityScore =
//             scoreResult.sustainabilityScore;

//         repo.lastAnalyzed =
//             new Date();

//         await repo.save();

//         // Return response
//         res.status(201).json({

//             success: true,

//             analysis: {

//                 ...analysis.toObject(),

//                 grade:
//                     scoreResult.grade,

//                 breakdown:
//                     scoreResult.breakdown
//             }
//         });

//     }
//     catch (error) {

//         console.error(
//             'Analysis Error:',
//             error
//         );

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // ====================================
// // Get Latest Analysis By Repository
// // GET /api/analysis/repository/:repositoryId
// // ====================================
// const getAnalysisByRepository = async (req, res) => {

//     try {

//         const analysis = await Analysis
//             .findOne({
//                 repository: req.params.repositoryId
//             })
//             .populate("repository")
//             .sort({ createdAt: -1 });

//         if (!analysis) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No analysis found for this repository"
//             });
//         }

//         res.json({
//             success: true,
//             analysis
//         });

//     } catch (error) {

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });

//     }

// };
// // ====================================
// // Get Analysis By ID
// // GET /api/analysis/:id
// // ====================================
// const getAnalysis = async (req, res) => {

//     try {

//         const analysis =
//             await Analysis
//                 .findById(req.params.id)
//                 .populate(
//                     'repository'
//                 );

//         if (!analysis) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Analysis not found'
//             });
//         }

//         res.json({
//             success: true,
//             analysis
//         });

//     }
//     catch (error) {

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


// // ====================================
// // Get User Analyses
// // GET /api/analysis
// // ====================================
// const getUserAnalyses =
// async (req, res) => {

//     try {

//         const analyses =
//             await Analysis
//                 .find({
//                     user: req.user.id
//                 })
//                 .populate(
//                     'repository'
//                 )
//                 .sort({
//                     createdAt: -1
//                 });

//         res.json({
//             success: true,
//             analyses
//         });

//     }
//     catch (error) {

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


// module.exports = {

//     createAnalysis,

//     getAnalysis,

//     getAnalysisByRepository,

//     getUserAnalyses
// };
// backend/src/controllers/analysisController.js

const Repository = require('../models/Repository');
const Analysis = require('../models/Analysis');
const Report = require("../models/Report");

const carbonCalculator =
require('../services/carbonCalculatorService');

const scoringService =
require('../services/scoringService');

const githubService =
require('../services/githubService');

const getUserGithubToken =
require('../utils/getUserGithubToken');

const historyService =
require('../services/historyService');

const notificationService =
require('../services/notificationService');


// ====================================
// Create Repository Analysis
// POST /api/analysis/:repositoryId
// ====================================
const createAnalysis = async (req, res) => {

    try {

        const { repositoryId } = req.params;

        // Find repository
        const repo =
            await Repository.findById(repositoryId);

        if (!repo) {
            return res.status(404).json({
                success: false,
                message: 'Repository not found'
            });
        }

        // Fetch REAL supporting data from GitHub before calculating —
        // this is what makes the emissions number defensible instead of
        // a formula based purely on stars/forks. Uses the user's own
        // connected GitHub token if available (needed for private repos),
        // falling back to the shared app-level token otherwise.
        const userToken = await getUserGithubToken(req.user.id);

        const [ciData, dependencyCount, dependencyDetails] = await Promise.all([
            githubService.fetchTotalCiBillableMs(repo.owner, repo.repositoryName, userToken),
            githubService.fetchDependencyCount(repo.owner, repo.repositoryName, userToken),
            githubService.fetchDependencyNames(repo.owner, repo.repositoryName, userToken)
        ]);

        // Calculate carbon metrics from real data
        const carbonResult =
            carbonCalculator.calculateCarbon({
                repository: repo,
                ciBillableMs: ciData.totalMs,
                dependencyCount
            });

        // Calculate sustainability score
        const scoreResult =
            scoringService.calculateScore({
                carbonResult,
                repository: repo,
                ciHoursAnalyzed: carbonResult.breakdown.ciHoursAnalyzed,
                dependencyCount
            });

        // Create analysis
        const analysis =
            await Analysis.create({

                user: req.user.id,

                repository: repo._id,

                carbonScore:
                    carbonResult.carbonScore,

                energyConsumption:
                    carbonResult.energyConsumption,

                co2Emission:
                    carbonResult.co2Emission,

                sustainabilityScore:
                    scoreResult.sustainabilityScore,

                recommendations:
                    carbonResult.recommendations,

                energyBreakdown:
                    carbonResult.breakdown,

                dependencies:
                    dependencyDetails.dependencies,

                devDependencies:
                    dependencyDetails.devDependencies,

                methodology:
                    carbonResult.methodology
            });

        // Save history
        await historyService.saveHistory({

            user: req.user.id,

            repository: repo._id,

            analysis: analysis._id,

            carbonScore:
                carbonResult.carbonScore,

            sustainabilityScore:
                scoreResult.sustainabilityScore,

            co2Emission:
                carbonResult.co2Emission,

            energyConsumption:
                carbonResult.energyConsumption
        });

        // Create notification — only if the user hasn't turned this off in Settings
        if (req.user?.preferences?.notifications?.analysisCompleted !== false) {
            await notificationService.createNotification({

                user: req.user.id,

                title: 'Analysis Completed',

                message:
                    `${repo.repositoryName} analysis completed successfully`,

                type: 'analysis'
            });
        }

// ====================================
// Auto Generate / Update Report
// ====================================

let report = await Report.findOne({
    user: req.user.id,
    repository: repo._id
});

if (report) {

    // Update Existing Report

    report.analysis = analysis._id;

    report.reportName =
        `${repo.repositoryName} Sustainability Report`;

    report.carbonScore =
        carbonResult.carbonScore;

    report.sustainabilityScore =
        scoreResult.sustainabilityScore;

    report.energyConsumption =
        carbonResult.energyConsumption;

    report.co2Emission =
        carbonResult.co2Emission;

    report.recommendations =
        carbonResult.recommendations;

    report.generatedAt =
        new Date();

    await report.save();

} else {

    // Create New Report

    await Report.create({

        user: req.user.id,

        repository: repo._id,

        analysis: analysis._id,

        reportName:
            `${repo.repositoryName} Sustainability Report`,
         reportType: "PDF", 
        carbonScore:
            carbonResult.carbonScore,

        sustainabilityScore:
            scoreResult.sustainabilityScore,

        energyConsumption:
            carbonResult.energyConsumption,

        co2Emission:
            carbonResult.co2Emission,

        recommendations:
            carbonResult.recommendations
    });
}
        // Update repository
        repo.carbonEmission =
            carbonResult.co2Emission;

        repo.sustainabilityScore =
            scoreResult.sustainabilityScore;

        repo.lastAnalyzed =
            new Date();

        await repo.save();

        // Return response
        res.status(201).json({

            success: true,

            analysis: {

                ...analysis.toObject(),

                grade:
                    scoreResult.grade,

                breakdown:
                    scoreResult.breakdown
            }
        });

    }
    catch (error) {

        console.error(
            'Analysis Error:',
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ====================================
// Get Latest Analysis By Repository
// GET /api/analysis/repository/:repositoryId
// ====================================
const getAnalysisByRepository = async (req, res) => {

    try {

        const analysis = await Analysis
            .findOne({
                repository: req.params.repositoryId
            })
            .populate("repository")
            .sort({ createdAt: -1 });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "No analysis found for this repository"
            });
        }

        res.json({
            success: true,
            analysis
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// ====================================
// Get Analysis By ID
// GET /api/analysis/:id
// ====================================
const getAnalysis = async (req, res) => {

    try {

        const analysis =
            await Analysis
                .findById(req.params.id)
                .populate(
                    'repository'
                );

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        res.json({
            success: true,
            analysis
        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ====================================
// Get User Analyses
// GET /api/analysis
// ====================================
const getUserAnalyses =
async (req, res) => {

    try {

        const analyses =
            await Analysis
                .find({
                    user: req.user.id
                })
                .populate(
                    'repository'
                )
                .sort({
                    createdAt: -1
                });

        res.json({
            success: true,
            analyses
        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {

    createAnalysis,

    getAnalysis,

    getAnalysisByRepository,

    getUserAnalyses
};