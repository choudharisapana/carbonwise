import axios from 'axios';
import { API_URL } from '../utils/apiConfig';

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