const {
  generateJSON
} = require(
  './geminiService'
);


// ====================================
// VALID VALUES
// ====================================

const VALID_TYPES = [

  'energy',

  'performance',

  'carbon',

  'architecture',

  'dependency'

];


const VALID_IMPACT = [

  'low',

  'medium',

  'high'

];


// ====================================
// BUILD AI PROMPT
// ====================================

const buildPrompt =
  ({
    analysis,
    repository
  }) => {


    const dependencies =
      analysis.dependencies?.length
        ? analysis.dependencies.join(', ')
        : 'none';


    const devDependencies =
      analysis.devDependencies?.length
        ? analysis.devDependencies.join(', ')
        : 'none';


    const breakdown =
      analysis.energyBreakdown || {};


    return `You are a senior Green Software and software sustainability engineer.

Analyze the following REAL repository data and provide practical recommendations.

IMPORTANT RULES:

1. Use ONLY the provided data.
2. Do NOT invent repository facts.
3. Reference real numbers where relevant.
4. Reference actual dependency names when relevant.
5. Keep recommendations actionable.
6. Do not mention that you are an AI.
7. Return ONLY valid JSON.
8. Generate between 5 and 8 suggestions.


REPOSITORY DATA:

Name:
${repository.repositoryName || 'Unknown'}

Primary Language:
${repository.language || 'Unknown'}

Repository Size:
${((repository.size || 0) / 1024).toFixed(2)} MB

Stars:
${repository.stars || 0}

Forks:
${repository.forks || 0}


ANALYSIS DATA:

Carbon Score:
${analysis.carbonScore || 0}/100

Sustainability Score:
${analysis.sustainabilityScore || 0}/100

CO2 Emission:
${analysis.co2Emission || 0} grams CO2e

Energy Consumption:
${analysis.energyConsumption || 0} kWh


ENERGY BREAKDOWN:

CI/CD Energy:
${breakdown.ciEnergyKWh || 0} kWh

Storage Energy:
${breakdown.storageEnergyKWh || 0} kWh

Network/Dependency Energy:
${breakdown.networkEnergyKWh || 0} kWh

CI/CD Hours:
${breakdown.ciHoursAnalyzed || 0}


DEPENDENCIES:

Production:
${dependencies}

Development:
${devDependencies}


Generate suggestions across relevant categories:

- energy
- performance
- carbon
- architecture
- dependency


Return ONLY a JSON array.

Each object MUST follow exactly:

{
  "suggestionType": "energy",
  "title": "Short title",
  "description": "Specific actionable recommendation based on the provided repository data.",
  "impact": "medium"
}


Allowed suggestionType values:

energy
performance
carbon
architecture
dependency


Allowed impact values:

low
medium
high`;

  };


// ====================================
// SANITIZE AI RESPONSE
// ====================================

const sanitizeSuggestions =
  (rawSuggestions) => {


    if (
      !Array.isArray(
        rawSuggestions
      )
    ) {

      throw new Error(
        'Expected an array of suggestions from Gemini'
      );

    }


    const suggestions =
      rawSuggestions

        .filter(
          suggestion =>

            suggestion &&

            suggestion.title &&

            suggestion.description
        )


        .map(
          suggestion => ({

            suggestionType:

              VALID_TYPES.includes(
                suggestion.suggestionType
              )

                ? suggestion.suggestionType

                : 'architecture',


            title:

              String(
                suggestion.title
              )
                .trim()
                .slice(
                  0,
                  100
                ),


            description:

              String(
                suggestion.description
              )
              .trim()
              .slice(
                0,
                700
              ),


            impact:

              VALID_IMPACT.includes(
                suggestion.impact
              )

                ? suggestion.impact

                : 'medium'

          })
        );


    if (
      suggestions.length === 0
    ) {

      throw new Error(
        'Gemini returned no usable suggestions'
      );

    }


    return suggestions.slice(
      0,
      8
    );

  };


// ====================================
// DATA-BASED FALLBACK
//
// Used only when Gemini is temporarily
// unavailable.
//
// Suggestions are based on ACTUAL
// analysis values.
// ====================================

const generateFallbackSuggestions =
  ({
    analysis,
    repository
  }) => {


    const suggestions = [];


    const breakdown =
      analysis.energyBreakdown || {};


    // ====================================
    // CI/CD
    // ====================================

    if (
      breakdown.ciEnergyKWh > 0 ||
      breakdown.ciHoursAnalyzed > 0
    ) {

      suggestions.push({

        suggestionType:
          'energy',

        title:
          'Optimize CI/CD workflow usage',

        description:
          `The analysis recorded ${Number(
            breakdown.ciHoursAnalyzed || 0
          ).toFixed(2)} CI/CD hours and ${Number(
            breakdown.ciEnergyKWh || 0
          ).toFixed(4)} kWh of CI/CD energy usage. Reduce unnecessary workflow runs, cache dependencies, and avoid running expensive jobs when unrelated files change.`,

        impact:
          'high'

      });

    }


    // ====================================
    // DEPENDENCIES
    // ====================================

    const dependencyCount =
      (analysis.dependencies?.length || 0) +
      (
        analysis.devDependencies?.length || 0
      );


    if (
      dependencyCount > 0
    ) {

      const packages =
        [
          ...(analysis.dependencies || []),
          ...(analysis.devDependencies || [])
        ];


      suggestions.push({

        suggestionType:
          'dependency',

        title:
          'Review installed dependencies',

        description:
          `This analysis found ${dependencyCount} dependencies. Review packages such as ${packages.slice(0, 5).join(', ')} and remove unused packages to reduce installation, build, and dependency processing overhead.`,

        impact:
          'medium'

      });

    }


    // ====================================
    // CARBON
    // ====================================

    suggestions.push({

      suggestionType:
        'carbon',

      title:
        'Reduce measured carbon impact',

      description:
        `The repository analysis estimated ${Number(
          analysis.co2Emission || 0
        ).toFixed(4)} grams CO2e. Prioritize optimizations in the highest resource-consuming areas and re-analyze after changes to measure improvement.`,

      impact:
        'high'

    });


    // ====================================
    // ENERGY
    // ====================================

    suggestions.push({

      suggestionType:
        'energy',

      title:
        'Reduce overall energy consumption',

      description:
        `Current estimated energy consumption is ${Number(
          analysis.energyConsumption || 0
        ).toFixed(4)} kWh. Reduce unnecessary computation, network requests, and repeated processing to improve energy efficiency.`,

      impact:
        'medium'

    });


    // ====================================
    // PERFORMANCE
    // ====================================

    suggestions.push({

      suggestionType:
        'performance',

      title:
        'Profile performance hotspots',

      description:
        'Profile CPU-intensive operations, unnecessary repeated computations, and expensive I/O paths. Focus optimization on measured bottlenecks instead of applying changes blindly.',

      impact:
        'medium'

    });


    // ====================================
    // ARCHITECTURE
    // ====================================

    suggestions.push({

      suggestionType:
        'architecture',

      title:
        'Improve resource-aware architecture',

      description:
        `Use modular components and avoid unnecessary data processing across the ${repository.language || 'current'} codebase. Design expensive operations to run only when required.`,

      impact:
        'medium'

    });


    // ====================================
    // STORAGE
    // ====================================

    if (
      breakdown.storageEnergyKWh > 0
    ) {

      suggestions.push({

        suggestionType:
          'energy',

        title:
          'Optimize storage usage',

        description:
          `Storage energy was estimated at ${Number(
            breakdown.storageEnergyKWh
          ).toFixed(4)} kWh. Remove obsolete artifacts, unnecessary cached files, and redundant stored data.`,

        impact:
          'low'

      });

    }


    return suggestions.slice(
      0,
      8
    );

  };


// ====================================
// GENERATE AI SUGGESTIONS
// ====================================

const generateSuggestions =
  async ({
    analysis,
    repository
  }) => {


    const prompt =
      buildPrompt({

        analysis,

        repository

      });


    try {


      // ====================================
      // REAL GEMINI AI
      // ====================================

      const raw =
        await generateJSON(
          prompt
        );


      return sanitizeSuggestions(
        raw
      );


    }

    catch (error) {


      console.error(
        'Gemini suggestion generation failed:',
        error.message
      );


      // ====================================
      // DATA BASED FALLBACK
      // ====================================

      const fallback =
        generateFallbackSuggestions({

          analysis,

          repository

        });


      if (
        fallback.length === 0
      ) {

        throw error;

      }


      console.warn(
        'Using data-based AI fallback suggestions'
      );


      return fallback;


    }


  };


// ====================================
// EXPORT
// ====================================

module.exports = {

  generateSuggestions

};