const PDFDocument = require("pdfkit");

const generatePDF = (analysis) => {

    return new Promise((resolve) => {

        const doc = new PDFDocument({
            margin: 50
        });

        const buffers = [];

        doc.on("data", buffers.push.bind(buffers));

        doc.on("end", () => {
            resolve(Buffer.concat(buffers));
        });

        // Title
        doc
            .fontSize(24)
            .text("CodeCarbon AI Analysis Report", {
                align: "center"
            });

        doc.moveDown();

        // Repository Information
        doc
            .fontSize(18)
            .text(`Repository: ${analysis.repository.repositoryName}`);

        doc.text(`Owner: ${analysis.repository.owner}`);

        doc.text(`Language: ${analysis.repository.language}`);

        doc.text(`Visibility: ${analysis.repository.visibility}`);

        doc.moveDown();

        // Metrics
        doc
            .fontSize(16)
            .text("Analysis Metrics");

        doc.moveDown(0.5);

        doc.fontSize(13);

        doc.text(`Carbon Score: ${analysis.carbonScore}`);

        doc.text(`Carbon Emission: ${analysis.co2Emission} gCO₂`);

        doc.text(`Energy Consumption: ${analysis.energyConsumption} Wh`);

        doc.text(`Sustainability Score: ${analysis.sustainabilityScore}%`);

        doc.moveDown();

        // Recommendations
        doc
            .fontSize(16)
            .text("Recommendations");

        doc.moveDown(0.5);

        if (
            analysis.recommendations &&
            analysis.recommendations.length > 0
        ) {

            analysis.recommendations.forEach((item) => {

                doc.text(`• ${item}`);

            });

        } else {

            doc.text("No recommendations available.");

        }

        doc.moveDown();

        doc
            .fontSize(11)
            .fillColor("gray")
            .text(
                `Generated on: ${new Date().toLocaleString()}`
            );

        doc.end();

    });

};

module.exports = {
    generatePDF
};