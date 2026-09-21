const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({

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

    carbonScore: {
        type: Number,
        default: 0
    },

    energyConsumption: {
        type: Number,
        default: 0
    },

    co2Emission: {
        type: Number,
        default: 0
    },

    sustainabilityScore: {
        type: Number,
        default: 0
    },

    recommendations: [String],

    // Breakdown of the real data used to compute the emissions estimate —
    // stored so past analyses stay auditable/explainable, not just a score.
    energyBreakdown: {
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

    // Real, best-effort verification of whether each (checked) dependency
    // is actually referenced in the repo's source code — see
    // githubService.checkDependencyUsage for how/why this is limited.
    // `verified: false` means usage genuinely could not be determined;
    // it must never be treated as "unused".
    dependencyUsage: [
        {
            name: String,
            referencedInSource: { type: Boolean, default: null },
            verified: { type: Boolean, default: false }
        }
    ],

    // Real per-language byte counts from GitHub's /languages endpoint —
    // e.g. { JavaScript: 245000, CSS: 12000 }. Lets suggestions reference
    // the actual language mix instead of just the single primary language.
    languageBreakdown: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // Real file-structure signals from the repo's Git tree — verified
    // facts about what's actually in the repository, not estimates.
    fileStats: {
        totalFiles: { type: Number, default: 0 },
        largeFiles: [
            {
                path: String,
                sizeKB: Number
            }
        ],
        configFilesDetected: [String],
        workflowFileCount: { type: Number, default: 0 },
        truncated: { type: Boolean, default: false }
    },

    // Real CI/CD health signals — not just compute time, but whether CI
    // is meaningfully used and how reliable it is.
    ciStats: {
        totalRuns: { type: Number, default: 0 },
        failedRuns: { type: Number, default: 0 },
        successRate: { type: Number, default: null },
        workflowNames: [String]
    },

    // Explicit flags for which data sources actually returned usable data
    // for THIS analysis. Scoring and AI suggestions use these to avoid
    // penalizing a repo or inventing suggestions for data that simply
    // wasn't available (private repo without Actions, no package.json,
    // rate-limited tree fetch, etc.) rather than guessing from absence.
    dataAvailability: {
        languagesAvailable: { type: Boolean, default: false },
        fileTreeAvailable: { type: Boolean, default: false },
        ciDataAvailable: { type: Boolean, default: false },
        dependencyDataAvailable: { type: Boolean, default: false }
    },

    methodology: {
        type: String,
        default: ''
    },

    analysisDate: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Analysis', analysisSchema);
