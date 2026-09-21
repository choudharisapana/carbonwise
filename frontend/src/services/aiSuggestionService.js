import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const aiSuggestionService = {
  // Get (or trigger generation of) AI suggestions for an analysis.
  // Pass regenerate=true to force a fresh AI call instead of the cached set.
  getSuggestions: async (analysisId, regenerate = false) => {
    const response = await axios.get(
      `${API_URL}/ai/${analysisId}`,
      {
        params: regenerate ? { regenerate: "true" } : {},
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }
    );
    return response.data;
  }
};

export default aiSuggestionService;
