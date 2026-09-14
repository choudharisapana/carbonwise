// const mongoose =
// require('mongoose');

// const analysisSchema =
// new mongoose.Schema({

//     user:{
//         type:
//             mongoose.Schema.Types.ObjectId,
//         ref:'User',
//         required:true
//     },

//     repository:{
//         type:
//             mongoose.Schema.Types.ObjectId,
//         ref:'Repository',
//         required:true
//     },

//     carbonScore:{
//         type:Number,
//         default:0
//     },

//     energyConsumption:{
//         type:Number,
//         default:0
//     },

//     co2Emission:{
//         type:Number,
//         default:0
//     },

//     sustainabilityScore:{
//         type:Number,
//         default:0
//     },

//     recommendations:[
//         String
//     ],

//     // Breakdown of the real data used to compute the emissions estimate —
//     // stored so past analyses stay auditable/explainable, not just a score.
//     energyBreakdown:{
//         ciEnergyKWh: Number,
//         storageEnergyKWh: Number,
//         networkEnergyKWh: Number,
//         ciHoursAnalyzed: Number,
//         dependencyCount: Number
//     },

//     methodology:{
//         type: String,
//         default: ''
//     },

//     analysisDate:{
//         type:Date,
//         default:Date.now
//     }

// },
// {
//     timestamps:true
// });

// module.exports =
// mongoose.model(
//     'Analysis',
//     analysisSchema
// );

const mongoose =
require('mongoose');

const analysisSchema =
new mongoose.Schema({

    user:{
        type:
            mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    repository:{
        type:
            mongoose.Schema.Types.ObjectId,
        ref:'Repository',
        required:true
    },

    carbonScore:{
        type:Number,
        default:0
    },

    energyConsumption:{
        type:Number,
        default:0
    },

    co2Emission:{
        type:Number,
        default:0
    },

    sustainabilityScore:{
        type:Number,
        default:0
    },

    recommendations:[
        String
    ],

    // Breakdown of the real data used to compute the emissions estimate —
    // stored so past analyses stay auditable/explainable, not just a score.
    energyBreakdown:{
        ciEnergyKWh: Number,
        storageEnergyKWh: Number,
        networkEnergyKWh: Number,
        ciHoursAnalyzed: Number,
        dependencyCount: Number
    },

    // Actual dependency names (not just counts) — used to give AI
    // suggestions something concrete to reference (e.g. "moment is heavy").
    dependencies: [String],
    devDependencies: [String],

    methodology:{
        type: String,
        default: ''
    },

    analysisDate:{
        type:Date,
        default:Date.now
    }

},
{
    timestamps:true
});

module.exports =
mongoose.model(
    'Analysis',
    analysisSchema
);