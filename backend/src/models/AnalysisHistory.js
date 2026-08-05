const mongoose = require('mongoose');

const analysisHistorySchema =
new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    repository:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Repository'
    },

    analysis:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Analysis'
    },

    carbonScore:Number,
    sustainabilityScore:Number,
    co2Emission:Number,
    energyConsumption:Number,

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports =
mongoose.model(
    'AnalysisHistory',
    analysisHistorySchema
);