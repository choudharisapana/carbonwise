// frontend/src/services/dashboardService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const dashboardService = {
  // Get dashboard data
  getDashboard: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const d = response.data;

      // Backend field names don't match what the UI expects — map them
      // here in one place instead of scattering the mismatch across pages.
      return {
        totalProjects: d.totalRepositories || 0,
        carbonScore: d.averageCarbon || 0,
        energyUsage: d.averageEnergyConsumptionWh || 0,
        sustainability: d.averageSustainability || 0,
        isDummy: (d.totalRepositories || 0) === 0,
        energyDistribution: d.energyDistribution || { ci: 0, storage: 0, network: 0 },
        recentRepositories: (d.recentRepositories || []).map((repo) => ({
          name: repo.repositoryName,
          owner: repo.owner,
          stars: repo.stars,
          language: repo.language,
          createdAt: repo.createdAt
        })),
        notifications: d.notifications || []
      };
    } catch (error) {
      console.error('Dashboard service error:', error);
      throw error;
    }
  },

  // Get dashboard stats only
  getStats: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Stats service error:', error);
      throw error;
    }
  }
};

export default dashboardService;