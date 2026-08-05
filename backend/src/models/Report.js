const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    repository: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repository',
        required: true
    },

    analysis: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Analysis',
        required: true
    },

    reportName: {
        type: String,
        required: true
    },

    carbonScore: {
        type: Number,
        default: 0
    },

    sustainabilityScore: {
        type: Number,
        default: 0
    },

    energyConsumption: {
        type: Number,
        default: 0
    },
       

downloadCount: {
  type: Number,
  default: 0
},
    co2Emission: {
        type: Number,
        default: 0
    },

    recommendations: [{
        type: String
    }],
    reportType: {
    type: String,
    enum: ["PDF", "CSV"],
    default: "PDF"
},

    generatedAt: {
        type: Date,
        default: Date.now
    }

},{
    timestamps:true
});

module.exports =
    mongoose.model(
        'Report',
        reportSchema
    );