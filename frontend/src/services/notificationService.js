// frontend/src/services/notificationService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const notificationService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/notifications`);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await axios.put(`${API_URL}/notifications/${id}`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axios.put(`${API_URL}/notifications/read-all`);
    return response.data;
  },

  remove: async (id) => {
    const response = await axios.delete(`${API_URL}/notifications/${id}`);
    return response.data;
  }
};

export default notificationService;
