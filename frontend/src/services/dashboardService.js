import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const dashboardService = {
  getDashboard: async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const d = response.data || {};

      return {
        totalRepositories:
          Number(d.totalRepositories) || 0,

        totalAnalyses:
          Number(d.totalAnalyses) || 0,

        totalReports:
          Number(d.totalReports) || 0,

        averageCarbon:
          Number(d.averageCarbon) || 0,

        averageSustainability:
          Number(d.averageSustainability) || 0,

        averageEnergyConsumptionWh:
          Number(d.averageEnergyConsumptionWh) || 0,

        energyDistribution: {
          ci:
            Number(d.energyDistribution?.ci) || 0,

          storage:
            Number(d.energyDistribution?.storage) || 0,

          network:
            Number(d.energyDistribution?.network) || 0
        },

        recentRepositories:
          Array.isArray(d.recentRepositories)
            ? d.recentRepositories
            : [],

        notifications:
          Array.isArray(d.notifications)
            ? d.notifications
            : []
      };
    } catch (error) {
      console.error(
        "Dashboard service error:",
        error
      );

      throw error;
    }
  },

  getStats: async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Stats service error:",
        error
      );

      throw error;
    }
  }
};

export default dashboardService;