const express = require("express");
const router = express.Router();

const {
    createAnalysis,
    getAnalysis,
    getAnalysisByRepository,
    getUserAnalyses
} = require("../controllers/analysisController");

const {
    protect
} = require("../middleware/authMiddleware");


// ================================
// Create Analysis
// POST /api/analysis/:repositoryId
// ================================
router.post(
    "/:repositoryId",
    protect,
    createAnalysis
);


// ================================
// Get Latest Analysis By Repository
// GET /api/analysis/repository/:repositoryId
// ================================
router.get(
    "/repository/:repositoryId",
    protect,
    getAnalysisByRepository
);


// ================================
// Get User Analyses
// GET /api/analysis
// ================================
router.get(
    "/",
    protect,
    getUserAnalyses
);


// ================================
// Get Analysis By ID
// GET /api/analysis/:id
// ================================
router.get(
    "/:id",
    protect,
    getAnalysis
);

module.exports = router;