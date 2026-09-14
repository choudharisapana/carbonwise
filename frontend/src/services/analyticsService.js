import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

const analyticsService = {

  getAnalytics: async () => {

    const response =
      await axios.get(
        `${API_URL}/analytics`
      );

    return response.data;

  }

};

export default analyticsService;