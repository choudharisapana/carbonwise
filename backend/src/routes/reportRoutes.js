const express =
require('express');

const router =
express.Router();

const {
  generateReport,
  getReports,
  getReportById,
  deleteReport
} = require("../controllers/reportController");
const {
    protect
} =
require(
'../middleware/authMiddleware'
);

router.post(
    '/:analysisId',
    protect,
    generateReport
);

router.get(
    '/',
    protect,
    getReports
);
router.get(
    "/:id",
    protect,
    getReportById
);
router.delete(
    "/:id",
    protect,
    deleteReport
);

module.exports =
router;