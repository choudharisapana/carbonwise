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