// backend/src/controllers/analysisController.js

const Repository = require('../models/Repository');
const Analysis = require('../models/Analysis');
const Report = require('../models/Report');

const carbonCalculator = require('../services/carbonCalculatorService');
const scoringService = require('../services/scoringService');
const githubService = require('../services/githubService');
const getUserGithubToken = require('../utils/getUserGithubToken');
const historyService = require('../services/historyService');
const notificationService = require('../services/notificationService');


// ====================================
// Create Repository Analysis
// POST /api/analysis/:repositoryId
//
// Flow: GitHub Repository -> Real Data Collection -> Detailed Analysis ->
// Carbon/Energy Calculation -> Scoring -> MongoDB Analysis Data
//
// Every data source below is fetched independently and never blocks the
// others — if one fails (private repo without Actions access, no
// package.json, tree fetch rate-limited), the analysis still completes
// using whatever real data WAS available, and `dataAvailability` records
// exactly which sources succeeded so scoring/AI suggestions can reason
// about that honestly instead of guessing.
// ====================================
const createAnalysis = async (req, res) => {

    try {

        const { repositoryId } = req.params;

        // Find repository
        const repo = await Repository.findById(repositoryId);

        if (!repo) {
            return res.status(404).json({
                success: false,
                message: 'Repository not found'
            });
        }

        // Uses the user's own connected GitHub token if available (needed
        // for private repos), falling back to the shared app-level token.
        const userToken = await getUserGithubToken(req.user.id);

        // ======================================
        // Real Data Collection — all independent, all real GitHub data
        // ======================================
        const [ciStats, dependencyDetails, languages, repoTree] = await Promise.all([
            githubService.fetchCiStats(repo.owner, repo.repositoryName, userToken),
            githubService.fetchDependencyNames(repo.owner, repo.repositoryName, userToken),
            githubService.fetchLanguages(repo.owner, repo.repositoryName, userToken),
            githubService.fetchRepoTree(repo.owner, repo.repositoryName, repo.defaultBranch, userToken)
        ]);

        const dependencyCount =
            (dependencyDetails.dependencies?.length || 0) +
            (dependencyDetails.devDependencies?.length || 0);

        // What actually came back with real data vs what didn't — used by
        // scoring and (later) AI suggestions to avoid penalizing or
        // inventing suggestions for missing categories.
        const dataAvailability = {
            languagesAvailable: Object.keys(languages).length > 0,
            fileTreeAvailable: repoTree.hasData,
            ciDataAvailable: ciStats.hasData,
            dependencyDataAvailable: dependencyDetails.hasPackageJson
        };

        // Real usage verification for production dependencies only (dev
        // deps are typically referenced via config, not direct import, so
        // "unused" is a much less reliable signal for them). Skipped
        // entirely when there's no package.json to check against.
        const dependencyUsage = dataAvailability.dependencyDataAvailable
            ? await githubService.checkDependencyUsage(
                repo.owner,
                repo.repositoryName,
                dependencyDetails.dependencies,
                userToken
            )
            : [];

        // ======================================
        // Carbon/Energy Calculation — core formula unchanged, now fed
        // richer evidence for its recommendations
        // ======================================
        const carbonResult = carbonCalculator.calculateCarbon({
            repository: repo,
            ciBillableMs: ciStats.totalMs,
            dependencyCount,
            ciStats,
            fileStats: repoTree,
            languageBreakdown: { hasData: dataAvailability.languagesAvailable, languages }
        });

        // ======================================
        // Scoring — factors in real CI reliability and file bloat when
        // available, neutral (not penalized) when not
        // ======================================
        const scoreResult = scoringService.calculateScore({
            carbonResult,
            repository: repo,
            ciHoursAnalyzed: carbonResult.breakdown.ciHoursAnalyzed,
            dependencyCount,
            ciStats,
            fileStats: repoTree
        });

        // ======================================
        // Persist detailed structured findings to MongoDB — not just the
        // final score/energy/CO2 numbers
        // ======================================
        const analysis = await Analysis.create({

            user: req.user.id,
            repository: repo._id,

            carbonScore: carbonResult.carbonScore,
            energyConsumption: carbonResult.energyConsumption,
            co2Emission: carbonResult.co2Emission,
            sustainabilityScore: scoreResult.sustainabilityScore,
            recommendations: carbonResult.recommendations,
            energyBreakdown: carbonResult.breakdown,

            dependencies: dependencyDetails.dependencies,
            devDependencies: dependencyDetails.devDependencies,
            dependencyUsage,

            languageBreakdown: languages,

            fileStats: {
                totalFiles: repoTree.totalFiles,
                largeFiles: repoTree.largeFiles,
                configFilesDetected: repoTree.configFilesDetected,
                workflowFileCount: repoTree.workflowFileCount,
                truncated: repoTree.truncated
            },

            ciStats: {
                totalRuns: ciStats.totalRuns,
                failedRuns: ciStats.failedRuns,
                successRate: ciStats.successRate,
                workflowNames: ciStats.workflowNames
            },

            dataAvailability,

            methodology: carbonResult.methodology
        });

        // Save history
        await historyService.saveHistory({

            user: req.user.id,
            repository: repo._id,
            analysis: analysis._id,

            carbonScore: carbonResult.carbonScore,
            sustainabilityScore: scoreResult.sustainabilityScore,
            co2Emission: carbonResult.co2Emission,
            energyConsumption: carbonResult.energyConsumption
        });

        // Create notification — only if the user hasn't turned this off in Settings
        if (req.user?.preferences?.notifications?.analysisCompleted !== false) {
            await notificationService.createNotification({

                user: req.user.id,
                title: 'Analysis Completed',
                message: `${repo.repositoryName} analysis completed successfully`,
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
            report.reportName = `${repo.repositoryName} Sustainability Report`;
            report.carbonScore = carbonResult.carbonScore;
            report.sustainabilityScore = scoreResult.sustainabilityScore;
            report.energyConsumption = carbonResult.energyConsumption;
            report.co2Emission = carbonResult.co2Emission;
            report.recommendations = carbonResult.recommendations;
            report.generatedAt = new Date();

            await report.save();

        } else {

            // Create New Report
            await Report.create({

                user: req.user.id,
                repository: repo._id,
                analysis: analysis._id,

                reportName: `${repo.repositoryName} Sustainability Report`,
                reportType: 'PDF',

                carbonScore: carbonResult.carbonScore,
                sustainabilityScore: scoreResult.sustainabilityScore,
                energyConsumption: carbonResult.energyConsumption,
                co2Emission: carbonResult.co2Emission,
                recommendations: carbonResult.recommendations
            });
        }

        // Update repository
        repo.carbonEmission = carbonResult.co2Emission;
        repo.sustainabilityScore = scoreResult.sustainabilityScore;
        repo.lastAnalyzed = new Date();

        await repo.save();

        // Return response
        res.status(201).json({

            success: true,

            analysis: {
                ...analysis.toObject(),
                grade: scoreResult.grade,
                breakdown: scoreResult.breakdown
            }
        });

    }
    catch (error) {

        console.error('Analysis Error:', error);

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

        // SECURITY: scope by user too, not just repositoryId — otherwise
        // any logged-in user could read any other user's analysis by
        // passing someone else's repositoryId.
        const analysis = await Analysis
            .findOne({ repository: req.params.repositoryId, user: req.user.id })
            .populate('repository')
            .sort({ createdAt: -1 });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'No analysis found for this repository'
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

        // SECURITY: scope by user too — findById alone would let any
        // logged-in user fetch any other user's analysis by guessing/
        // enumerating MongoDB ObjectIds.
        const analysis = await Analysis
            .findOne({ _id: req.params.id, user: req.user.id })
            .populate('repository');

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
const getUserAnalyses = async (req, res) => {

    try {

        const analyses = await Analysis
            .find({ user: req.user.id })
            .populate('repository')
            .sort({ createdAt: -1 });

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
