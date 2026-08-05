const Analysis = require('../models/Analysis');

const pdfService = require('../services/pdfService');
const csvService = require('../services/csvService');


// =========================
// Export PDF
// =========================
const exportPDF = async (req, res) => {

    try {

        const analysis = await Analysis
            .findById(req.params.id)
            .populate('repository');

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        const pdf = await pdfService.generatePDF(analysis);

        res.setHeader(
            'Content-Type',
            'application/pdf'
        );

        res.setHeader(
            'Content-Disposition',
            `attachment; filename=${analysis.repository.repositoryName}.pdf`
        );

        res.send(pdf);

    }
    catch (error) {

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
            .findById(req.params.id)
            .populate('repository');

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        const csv = csvService.generateCSV(analysis);

        res.header(
            'Content-Type',
            'text/csv'
        );

        res.attachment(
            `${analysis.repository.repositoryName}.csv`
        );

        res.send(csv);

    }
    catch (error) {

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