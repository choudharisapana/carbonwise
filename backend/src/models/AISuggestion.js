const mongoose = require('mongoose');

const aiSuggestionSchema = new mongoose.Schema({
    repository: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repository'
    },

    suggestionType: {
        type: String,
        enum: [
            'energy',
            'performance',
            'carbon',
            'architecture'
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