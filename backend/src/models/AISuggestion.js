const mongoose = require('mongoose');

const aiSuggestionSchema = new mongoose.Schema({
    repository: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repository'
    },

    // Every suggestion set is tied to the specific analysis run it was
    // generated from, so old suggestions stay accurate to that snapshot
    // even if the repo is re-analyzed later.
    analysis: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Analysis',
        required: true
    },

    suggestionType: {
        type: String,
        enum: [
            'energy',
            'performance',
            'carbon',
            'architecture',
            'dependency'
        ]
    },

    title: String,

    description: String,

    // Structured, evidence-based breakdown — every suggestion must be
    // traceable to real analysis data via these fields, not just a title
    // and a paragraph.
    whatWasFound: String,      // the specific real evidence (numbers, names, paths)
    whyItMatters: String,      // why that evidence is a sustainability concern
    recommendedAction: String, // exact, concrete next step
    expectedImpact: String,    // expected carbon/energy effect of taking the action

    confidence: {
        type: String,
        enum: [
            'low',
            'medium',
            'high'
        ],
        default: 'medium'
    },

    impact: {
        type: String,
        enum: [
            'low',
            'medium',
            'high'
        ]
    },

    implemented: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports =
mongoose.model(
    'AISuggestion',
    aiSuggestionSchema
);