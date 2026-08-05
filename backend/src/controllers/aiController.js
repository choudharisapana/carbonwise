const CarbonAnalysis =
require('../models/Analysis');

const AISuggestion =
require('../models/AISuggestion');

const {
    generateSuggestions
} =
require('../services/aiSuggestionService');

const getSuggestions =
async(req,res)=>{

    try{

        const analysis =
        await CarbonAnalysis.findById(
            req.params.analysisId
        );

        if(!analysis){
            return res.status(404).json({
                success:false,
                message:'Analysis not found'
            });
        }

        const suggestions =
        generateSuggestions(analysis);

        const saved =
        await AISuggestion.insertMany(
            suggestions.map(s=>({
                repository:
                analysis.repository,
                ...s
            }))
        );

        res.json({
            success:true,
            suggestions:saved
        });

    }
    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

module.exports = {
    getSuggestions
};