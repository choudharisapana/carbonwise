const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    repositoryUrl: {
        type: String,
        required: true
    },

    repositoryName: {
        type: String,
        required: true
    },

    owner: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ''
    },

    language: {
        type: String,
        default: 'Unknown'
    },

    stars: {
        type: Number,
        default: 0
    },

    forks: {
        type: Number,
        default: 0
    },

    size: {
        type: Number,
        default: 0
    },

    visibility: {
        type: String,
        default: 'public'
    },

    // Needed to fetch the repo's file tree (Git Trees API requires a
    // branch/SHA reference) — defaults to 'main' for repos added before
    // this field existed.
    defaultBranch: {
        type: String,
        default: 'main'
    },

    sustainabilityScore: {
        type: Number,
        default: 0
    },

    carbonEmission: {
        type: Number,
        default: 0
    },

    lastAnalyzed: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
});

module.exports =
mongoose.model(
    'Repository',
    repositorySchema
);