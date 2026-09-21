const axios = require('axios');

// "gemini-flash-latest" is Google's stable alias that always points at the
// current recommended Flash model — avoids the 404s that happen when a
// pinned version (e.g. "gemini-2.5-flash") gets deprecated/rotated on
// Google's side. GEMINI_MODEL in .env can still override this if needed.
const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
// If the primary model 404s (model unavailable for this key/region), retry
// once against a second, independently-versioned model before giving up.
const FALLBACK_MODEL = 'gemini-2.0-flash';

const buildUrl = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const callGemini = async (model, prompt, apiKey) => {
  const response = await axios.post(
    buildUrl(model),
    {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4
      }
    },
    {
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 25000
    }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  return text;
};

/**
 * Calls Google Gemini's generateContent endpoint with a prompt and returns
 * the parsed JSON the model produced. Uses Gemini's JSON mode
 * (responseMimeType: "application/json") so the model is constrained to
 * return valid JSON matching the shape we ask for in the prompt, instead
 * of freeform text we'd have to parse ourselves.
 *
 * Automatically retries once against FALLBACK_MODEL if the primary model
 * returns 404 (a known, currently-occurring issue where specific pinned
 * Gemini model versions intermittently stop resolving — see
 * https://ai.google.dev/gemini-api/docs/models for the current list).
 *
 * Throws on any failure (missing key, network error, malformed response) —
 * callers are expected to catch this and degrade gracefully.
 */
const generateJSON = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set in .env — get a free key at https://aistudio.google.com/apikey'
    );
  }

  let text;

  try {
    text = await callGemini(PRIMARY_MODEL, prompt, apiKey);
  } catch (error) {
    const status = error.response?.status;
    const geminiMessage = error.response?.data?.error?.message;

    if (status === 404) {
      console.warn(
        `Gemini model "${PRIMARY_MODEL}" returned 404 (${geminiMessage || 'model unavailable'}), retrying with "${FALLBACK_MODEL}"...`
      );
      try {
        text = await callGemini(FALLBACK_MODEL, prompt, apiKey);
      } catch (fallbackError) {
        const fallbackMessage = fallbackError.response?.data?.error?.message || fallbackError.message;
        throw new Error(`Gemini API error (both models failed): ${fallbackMessage}`);
      }
    } else {
      throw new Error(`Gemini API error: ${geminiMessage || error.message}`);
    }
  }

  try {
    return JSON.parse(text);
  } catch (parseError) {
    throw new Error('Gemini returned malformed JSON');
  }
};

module.exports = { generateJSON };
