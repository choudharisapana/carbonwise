// frontend/src/services/settingsService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const settingsService = {
  getSettings: async () => {
    const response = await axios.get(`${API_URL}/settings`);
    return response.data;
  },

  updateSettings: async (preferences) => {
    const response = await axios.put(`${API_URL}/settings`, preferences);
    return response.data;
  }
};

export default settingsService;
