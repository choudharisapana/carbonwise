import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/reports`;

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

export const getReports = async () => {
    const response = await axios.get(API_URL, authHeaders());
    return response.data;
};

export const getReportById = async (id) => {

    const response = await axios.get(
        `${API_URL}/${id}`,
        authHeaders()
    );

    return response.data;
};
export const deleteReport = async (id) => {
    const response = await axios.delete(
        `${API_URL}/${id}`,
        authHeaders()
    );

    return response.data;
};


export default {
    getReports,
    getReportById,
    deleteReport
};