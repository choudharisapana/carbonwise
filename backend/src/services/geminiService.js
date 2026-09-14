// const axios = require('axios');

// const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
// const GEMINI_API_URL =
//   `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// /**
//  * Calls Google Gemini's generateContent endpoint with a prompt and returns
//  * the parsed JSON the model produced. Uses Gemini's JSON mode
//  * (responseMimeType: "application/json") so the model is constrained to
//  * return valid JSON matching the shape we ask for in the prompt, instead
//  * of freeform text we'd have to parse ourselves.
//  *
//  * Throws on any failure (missing key, network error, malformed response) —
//  * callers are expected to catch this and degrade gracefully.
//  */
// const generateJSON = async (prompt) => {
//   const apiKey = process.env.GEMINI_API_KEY;

//   if (!apiKey) {
//     throw new Error(
//       'GEMINI_API_KEY is not set in .env — get a free key at https://aistudio.google.com/apikey'
//     );
//   }

//   const response = await axios.post(
//     GEMINI_API_URL,
//     {
//       contents: [
//         {
//           parts: [{ text: prompt }]
//         }
//       ],
//       generationConfig: {
//         responseMimeType: 'application/json',
//         temperature: 0.4
//       }
//     },
//     {
//       headers: {
//         'x-goog-api-key': apiKey,
//         'Content-Type': 'application/json'
//       },
//       timeout: 25000
//     }
//   );

//   const text =
//     response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

//   if (!text) {
//     throw new Error('Gemini returned an empty response');
//   }

//   try {
//     return JSON.parse(text);
//   } catch (parseError) {
//     throw new Error('Gemini returned malformed JSON');
//   }
// };

// module.exports = { generateJSON };

const axios = require('axios');

const GEMINI_MODEL =
  process.env.GEMINI_MODEL ||
  'gemini-2.5-flash';

const getGeminiApiUrl = () => {

  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

};


// ====================================
// Generate JSON using Gemini
// ====================================

const generateJSON =
  async (prompt) => {

    const apiKey =
      process.env.GEMINI_API_KEY;


    // ====================================
    // API KEY CHECK
    // ====================================

    if (!apiKey) {

      throw new Error(
        'GEMINI_API_KEY is not configured in the backend .env file'
      );

    }


    try {

      const response =
        await axios.post(

          getGeminiApiUrl(),

          {

            contents: [

              {

                role: 'user',

                parts: [

                  {
                    text: prompt
                  }

                ]

              }

            ],


            generationConfig: {

              responseMimeType:
                'application/json',

              temperature:
                0.4,

              maxOutputTokens:
                4096

            }

          },


          {

            headers: {

              'x-goog-api-key':
                apiKey,

              'Content-Type':
                'application/json'

            },


            timeout:
              30000

          }

        );


      // ====================================
      // CHECK GEMINI RESPONSE
      // ====================================

      const candidate =
        response.data?.candidates?.[0];


      if (!candidate) {

        console.error(
          'Gemini empty response:',
          JSON.stringify(
            response.data,
            null,
            2
          )
        );


        throw new Error(
          'Gemini did not return a valid candidate'
        );

      }


      // ====================================
      // BLOCKED RESPONSE CHECK
      // ====================================

      if (
        candidate.finishReason &&
        candidate.finishReason !== 'STOP'
      ) {

        console.error(
          'Gemini generation stopped:',
          candidate.finishReason
        );

      }


      const text =
        candidate
          ?.content
          ?.parts
          ?.map(
            part => part.text || ''
          )
          .join('')
          .trim();


      if (!text) {

        console.error(
          'Gemini response has no text:',
          JSON.stringify(
            response.data,
            null,
            2
          )
        );


        throw new Error(
          'Gemini returned an empty response'
        );

      }


      // ====================================
      // PARSE JSON
      // ====================================

      try {

        return JSON.parse(
          text
        );

      }

      catch (parseError) {

        console.error(
          'Gemini invalid JSON response:',
          text
        );


        throw new Error(
          'Gemini returned malformed JSON'
        );

      }


    }

    catch (error) {


      // ====================================
      // GEMINI API ERROR
      // ====================================

      if (error.response) {

        const status =
          error.response.status;


        const apiMessage =
          error.response.data
            ?.error
            ?.message;


        console.error(
          'Gemini API Error:',
          {
            status,
            message:
              apiMessage,
            data:
              error.response.data
          }
        );


        if (status === 400) {

          throw new Error(
            apiMessage ||
            'Invalid Gemini request'
          );

        }


        if (status === 401) {

          throw new Error(
            'Gemini API authentication failed. Check GEMINI_API_KEY.'
          );

        }


        if (status === 403) {

          throw new Error(
            apiMessage ||
            'Gemini API access denied. Check API key permissions.'
          );

        }


        if (status === 404) {

          throw new Error(
            `Gemini model "${GEMINI_MODEL}" was not found or is unavailable.`
          );

        }


        if (status === 429) {

          throw new Error(
            'Gemini API quota or rate limit exceeded. Please try again later.'
          );

        }


        throw new Error(
          apiMessage ||
          `Gemini API request failed with status ${status}`
        );

      }


      // ====================================
      // TIMEOUT
      // ====================================

      if (
        error.code ===
        'ECONNABORTED'
      ) {

        throw new Error(
          'Gemini API request timed out. Please try again.'
        );

      }


      // ====================================
      // NETWORK ERROR
      // ====================================

      if (
        error.message
      ) {

        throw error;

      }


      throw new Error(
        'Unknown Gemini API error'
      );


    }


  };


module.exports = {

  generateJSON

};