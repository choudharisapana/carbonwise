const Report = require("../models/Report");
const Analysis = require("../models/Analysis");
const Repository = require("../models/Repository");

// Generate Report
const generateReport = async (req, res) => {
  try {
    const { analysisId } = req.params;

    // Check Analysis
    const analysis = await Analysis.findById(analysisId);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    // Check Repository
    const repository = await Repository.findById(analysis.repository);

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }

    // Create Report
    // Check if report already exists for this repository
let report = await Report.findOne({
  user: req.user.id,
  repository: repository._id,
});

if (report) {
  // Update existing report
  report.analysis = analysis._id;
  report.reportName = `${repository.repositoryName} Sustainability Report`;

  report.carbonScore = analysis.carbonScore;
  report.sustainabilityScore = analysis.sustainabilityScore;
  report.energyConsumption = analysis.energyConsumption;
  report.co2Emission = analysis.co2Emission;
  report.recommendations = analysis.recommendations;

  report.generatedAt = new Date();

  await report.save();

  return res.status(200).json({
    success: true,

    message: "Report updated successfully.",
    data: report,
  });
}

// Create new report
report = await Report.create({
  user: req.user.id,
  repository: repository._id,
  analysis: analysis._id,

  reportName: `${repository.repositoryName} Sustainability Report`,

  carbonScore: analysis.carbonScore,
  sustainabilityScore: analysis.sustainabilityScore,
  energyConsumption: analysis.energyConsumption,
  co2Emission: analysis.co2Emission,
  recommendations: analysis.recommendations,
});

return res.status(201).json({
  success: true,
  message: "Report generated successfully.",
  data: report,
});
  } catch (error) {
    console.error("Generate Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate report.",
      error: error.message,
    });
  }
};

// Get All Reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({
  user: req.user.id,
})
.populate("repository", "repositoryName")
.populate("analysis")
.sort({ generatedAt: -1 })
.lean();

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("Get Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports.",
      error: error.message,
    });
  }
};
// Get Single Report
const getReportById = async (req, res) => {
  try {

    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user.id
    })
      .populate("repository")
      .populate("analysis");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: report
    });

  } catch (error) {

    console.error("Get Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch report.",
      error: error.message
    });

  }
};
 const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    await Report.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete report.",
      error: error.message,
    });
  }
};

module.exports = {
    generateReport,
    getReports,
    getReportById,
    deleteReport
};