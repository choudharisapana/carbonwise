import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const analysisService = {
    // Get Analysis By Repository
getAnalysisByRepository: async (repositoryId) => {

    const response = await axios.get(
        `${API_URL}/analysis/repository/${repositoryId}`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    return response.data;
},
  // Get analysis by ID
  getAnalysis: async (analysisId) => {
    const response = await axios.get(
      `${API_URL}/analysis/${analysisId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }
    );

    return response.data;
  },


  // Analyze repository again
  analyzeRepository: async (repositoryId) => {
    const response = await axios.post(
      `${API_URL}/analysis/${repositoryId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }
    );

    return response.data;
  },

  // Export PDF
  exportPDF: async (analysisId) => {
    const response = await axios.get(
      `${API_URL}/export/pdf/${analysisId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        },
        responseType: "blob"
      }
    );

    return response.data;
  },

  // Export CSV
  exportCSV: async (analysisId) => {
    const response = await axios.get(
      `${API_URL}/export/csv/${analysisId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        },
        responseType: "blob"
      }
    );

    return response.data;
  }
};

export default analysisService;