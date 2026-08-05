// frontend/src/services/repositoryService.js

import axios from 'axios';

const API_URL =
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api';

// Common auth header
const authHeader = () => ({
    headers: {
        Authorization:
            `Bearer ${localStorage.getItem('token')}`
    }
});

const repositoryService = {

    // =========================
    // Get all repositories
    // GET /api/repositories
    // =========================
    getRepositories: async () => {

        try {

            const response =
                await axios.get(
                    `${API_URL}/repositories`,
                    authHeader()
                );

            return response.data;

        } catch (error) {

            console.error(
                'Get repositories error:',
                error
            );

            throw error;
        }
    },


    // =========================
    // Add repository
    // POST /api/repositories
    // =========================
    addRepository: async (
        repositoryUrl
    ) => {

        try {

            const response =
                await axios.post(

                    `${API_URL}/repositories`,

                    {
                        repositoryUrl
                    },

                    authHeader()
                );

            return response.data;

        } catch (error) {

            console.error(
                'Add repository error:',
                error
            );

            throw error;
        }
    },


    // =========================
    // Analyze repository
    // POST /api/analysis/:id
    // =========================
    analyzeRepository: async (
        repositoryId
    ) => {

        try {

            const response =
                await axios.post(

                    `${API_URL}/analysis/${repositoryId}`,

                    {},

                    authHeader()
                );

            return response.data;

        } catch (error) {

            console.error(
                'Analyze repository error:',
                error
            );

            throw error;
        }
    },


    // =========================
    // Delete repository
    // DELETE /api/repositories/:id
    // =========================
    deleteRepository: async (
        repositoryId
    ) => {

        try {

            const response =
                await axios.delete(

                    `${API_URL}/repositories/${repositoryId}`,

                    authHeader()
                );

            return response.data;

        } catch (error) {

            console.error(
                'Delete repository error:',
                error
            );

            throw error;
        }
    },


    // =========================
    // Get reports
    // GET /api/reports
    // =========================
    getReports: async () => {

        try {

            const response =
                await axios.get(

                    `${API_URL}/reports`,

                    authHeader()
                );

            return response.data;

        } catch (error) {

            console.error(
                'Get reports error:',
                error
            );

            throw error;
        }
    },


    // =========================
    // Get repository by id
    // GET /api/repositories/:id
    // =========================
    getRepositoryById: async (
        repositoryId
    ) => {

        try {

            const response =
                await axios.get(

                    `${API_URL}/repositories/${repositoryId}`,

                    authHeader()
                );

            return response.data;

        } catch (error) {

            console.error(
                'Get repository error:',
                error
            );

            throw error;
        }
    }
};

export default repositoryService;