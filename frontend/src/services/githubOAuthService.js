import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const authHeaders = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token")}`,
  },
});

const githubOAuthService = {

  connect: () => {

    const token =
      localStorage.getItem("token");

    window.location.href =
      `${API_URL}/auth/github/connect?token=${encodeURIComponent(token)}`;
  },


  getStatus: async () => {

    const response = await axios.get(
      `${API_URL}/auth/github/status`,
      authHeaders()
    );

    return response.data;
  },


  disconnect: async () => {

    const response = await axios.delete(
      `${API_URL}/auth/github/disconnect`,
      authHeaders()
    );

    return response.data;
  },

};

export default githubOAuthService;