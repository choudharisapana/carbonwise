const AnalysisHistory =
require('../models/AnalysisHistory');

const saveHistory =
async(data)=>{

    return await
    AnalysisHistory.create(data);

};

module.exports = {
    saveHistory
};