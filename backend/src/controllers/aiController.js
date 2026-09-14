
const Analysis =
  require(
    '../models/Analysis'
  );


const Repository =
  require(
    '../models/Repository'
  );


const AISuggestion =
  require(
    '../models/AISuggestion'
  );


const {
  generateSuggestions
} = require(
  '../services/aiSuggestionService'
);


// ====================================
// GET OR GENERATE AI SUGGESTIONS
//
// GET /api/ai/:analysisId
//
// Optional:
//
// ?regenerate=true
// ====================================

const getSuggestions =
  async (
    req,
    res
  ) => {


    try {


      const {
        analysisId
      } =
        req.params;


      // ====================================
      // FIND ANALYSIS
      // ====================================

      const analysis =
        await Analysis.findById(
          analysisId
        );


      if (!analysis) {

        return res.status(404).json({

          success:
            false,

          message:
            'Analysis not found'

        });

      }


      // ====================================
      // OWNERSHIP CHECK
      // ====================================

      if (
        analysis.user.toString() !==
        req.user.id.toString()
      ) {

        return res.status(403).json({

          success:
            false,

          message:
            'You do not have access to this analysis'

        });

      }


      const forceRegenerate =
        req.query.regenerate ===
        'true';


      // ====================================
      // RETURN CACHED SUGGESTIONS
      // ====================================

      if (
        !forceRegenerate
      ) {


        const existing =
          await AISuggestion
            .find({

              analysis:
                analysis._id

            })
            .sort({

              createdAt:
                1

            });


        if (
          existing.length > 0
        ) {

          return res.status(200).json({

            success:
              true,

            cached:
              true,

            suggestions:
              existing

          });

        }


      }


      // ====================================
      // FIND REPOSITORY
      // ====================================

      const repository =
        await Repository.findById(
          analysis.repository
        );


      if (!repository) {

        return res.status(404).json({

          success:
            false,

          message:
            'Repository for this analysis was not found'

        });

      }


      // ====================================
      // GENERATE SUGGESTIONS
      // ====================================

      const generated =
        await generateSuggestions({

          analysis,

          repository

        });


      if (
        !generated ||
        generated.length === 0
      ) {

        throw new Error(
          'No suggestions could be generated'
        );

      }


      // ====================================
      // REMOVE OLD SUGGESTIONS
      // ====================================

      if (
        forceRegenerate
      ) {

        await AISuggestion.deleteMany({

          analysis:
            analysis._id

        });

      }


      // ====================================
      // SAVE SUGGESTIONS
      // ====================================

      const saved =
        await AISuggestion.insertMany(

          generated.map(
            suggestion => ({

              repository:
                analysis.repository,

              analysis:
                analysis._id,

              ...suggestion

            })
          )

        );


      // ====================================
      // RESPONSE
      // ====================================

      return res.status(200).json({

        success:
          true,

        cached:
          false,

        suggestions:
          saved

      });


    }


    catch (error) {


      console.error(
        'AI Suggestions Controller Error:',
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          'Failed to generate AI suggestions',

        error:

          process.env.NODE_ENV ===
          'development'

            ? error.message

            : undefined

      });


    }


  };


// ====================================
// EXPORT
// ====================================

module.exports = {

  getSuggestions

};