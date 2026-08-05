const generateCSV = (analysis) => {

    const rows = [

        ["Repository", analysis.repository.repositoryName],

        ["Owner", analysis.repository.owner],

        ["Language", analysis.repository.language],

        ["Visibility", analysis.repository.visibility],

        ["Carbon Score", analysis.carbonScore],

        ["Carbon Emission (gCO2)", analysis.co2Emission],

        ["Energy Consumption (Wh)", analysis.energyConsumption],

        ["Sustainability Score (%)", analysis.sustainabilityScore],

        ["Analysis Date", analysis.createdAt]

    ];

    rows.push([]);

    rows.push(["Recommendations"]);

    if (
        analysis.recommendations &&
        analysis.recommendations.length > 0
    ) {

        analysis.recommendations.forEach((item) => {

            rows.push([item]);

        });

    } else {

        rows.push(["No recommendations"]);

    }

    return rows
        .map(row => row.join(","))
        .join("\n");

};

module.exports = {
    generateCSV
};