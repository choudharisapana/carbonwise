const generateSuggestions = (analysis) => {

    const suggestions = [];

    if (analysis.energyConsumption > 50) {
        suggestions.push({
            suggestionType: 'energy',
            title: 'Reduce Energy Usage',
            description:
                'Optimize algorithms and reduce unnecessary computations.',
            impact: 'high'
        });
    }

    if (analysis.co2Emission > 30) {
        suggestions.push({
            suggestionType: 'carbon',
            title: 'Reduce Carbon Emission',
            description:
                'Use efficient cloud regions and optimize workloads.',
            impact: 'high'
        });
    }

    if (analysis.sustainabilityScore < 70) {
        suggestions.push({
            suggestionType: 'performance',
            title: 'Improve Sustainability',
            description:
                'Refactor inefficient modules and remove unused dependencies.',
            impact: 'medium'
        });
    }

    suggestions.push({
        suggestionType: 'architecture',
        title: 'Use Green Software Practices',
        description:
            'Implement caching, lazy loading and code splitting.',
        impact: 'low'
    });

    return suggestions;
};

module.exports = {
    generateSuggestions
};