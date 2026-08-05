// frontend/src/services/githubOAuthService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const githubOAuthService = {
  // Redirects the browser to the backend, which redirects to GitHub.
  // Passes the JWT as a query param since this is a full-page navigation
  // (no Authorization header possible), not an axios call.
  connect: () => {
    const token = localStorage.getItem('token');
    window.location.href = `${API_URL}/auth/github/connect?token=${token}`;
  },

  getStatus: async () => {
    const response = await axios.get(`${API_URL}/auth/github/status`);
    return response.data;
  },

  disconnect: async () => {
    const response = await axios.delete(`${API_URL}/auth/github/disconnect`);
    return response.data;
  }
};

export default githubOAuthService;
