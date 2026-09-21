const Analysis = require('../models/Analysis');
const Report = require('../models/Report');

const pdfService = require('../services/pdfService');
const csvService = require('../services/csvService');


// =========================
// Export PDF
// =========================
const exportPDF = async (req, res) => {
    try {

        const analysis = await Analysis
            .findOne({
                _id: req.params.id,
                user: req.user.id
            })
            .populate('repository');

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        // Generate PDF
        const pdf = await pdfService.generatePDF(analysis);

        // Update corresponding report
        await Report.findOneAndUpdate(
            {
                analysis: analysis._id,
                user: req.user.id
            },
            {
                $set: {
                    reportType: 'PDF'
                },
                $inc: {
                    downloadCount: 1
                }
            }
        );

        const safeName =
            (analysis.repository?.repositoryName || 'sustainability-report')
                .replace(/[^a-zA-Z0-9-_]/g, '_');

        res.setHeader(
            'Content-Type',
            'application/pdf'
        );

        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${safeName}.pdf"`
        );

        res.send(pdf);

    } catch (error) {

        console.error('Export PDF Error:', error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =========================
// Export CSV
// =========================
const exportCSV = async (req, res) => {
    try {

        const analysis = await Analysis
            .findOne({
                _id: req.params.id,
                user: req.user.id
            })
            .populate('repository');

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        // Generate CSV
        const csv = csvService.generateCSV(analysis);

        // Update corresponding report
        await Report.findOneAndUpdate(
            {
                analysis: analysis._id,
                user: req.user.id
            },
            {
                $set: {
                    reportType: 'CSV'
                },
                $inc: {
                    downloadCount: 1
                }
            }
        );

        const safeName =
            (analysis.repository?.repositoryName || 'sustainability-report')
                .replace(/[^a-zA-Z0-9-_]/g, '_');

        res.setHeader(
            'Content-Type',
            'text/csv; charset=utf-8'
        );

        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${safeName}.csv"`
        );

        res.send(csv);

    } catch (error) {

        console.error('Export CSV Error:', error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    exportPDF,
    exportCSV
};
