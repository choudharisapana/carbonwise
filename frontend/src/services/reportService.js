// import axios from "axios";

// const API_URL = `${import.meta.env.VITE_API_URL}/reports`;
// const EXPORT_URL = `${import.meta.env.VITE_API_URL}/export`;

// const getToken = () => localStorage.getItem("token");

// const authHeaders = () => ({
//   headers: {
//     Authorization: `Bearer ${getToken()}`,
//   },
// });

// export const getReports = async () => {
//   const response = await axios.get(
//     API_URL,
//     authHeaders()
//   );

//   return response.data;
// };

// export const getReportById = async (id) => {
//   const response = await axios.get(
//     `${API_URL}/${id}`,
//     authHeaders()
//   );

//   return response.data;
// };

// export const deleteReport = async (id) => {
//   const response = await axios.delete(
//     `${API_URL}/${id}`,
//     authHeaders()
//   );

//   return response.data;
// };

// // ===============================
// // Download PDF
// // ===============================
// export const downloadPDF = async (analysisId) => {
//   const response = await axios.get(
//     `${EXPORT_URL}/pdf/${analysisId}`,
//     {
//       ...authHeaders(),
//       responseType: "blob",
//     }
//   );

//   return response;
// };

// // ===============================
// // Download CSV
// // ===============================
// export const downloadCSV = async (analysisId) => {
//   const response = await axios.get(
//     `${EXPORT_URL}/csv/${analysisId}`,
//     {
//       ...authHeaders(),
//       responseType: "blob",
//     }
//   );

//   return response;
// };

// export default {
//   getReports,
//   getReportById,
//   deleteReport,
//   downloadPDF,
//   downloadCSV,
// };
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/reports`;
const EXPORT_API_URL = `${import.meta.env.VITE_API_URL}/export`;

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});


// =====================================
// Get All Reports
// =====================================
const getReports = async () => {
  const response = await axios.get(
    API_URL,
    authHeaders()
  );

  return response.data;
};


// =====================================
// Get Single Report
// =====================================
const getReportById = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}`,
    authHeaders()
  );

  return response.data;
};


// =====================================
// Delete Report
// =====================================
const deleteReport = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    authHeaders()
  );

  return response.data;
};


// =====================================
// Download PDF
// =====================================
const downloadPDF = async (analysisId) => {
  const response = await axios.get(
    `${EXPORT_API_URL}/pdf/${analysisId}`,
    {
      ...authHeaders(),
      responseType: "blob",
    }
  );

  return response;
};


// =====================================
// Download CSV
// =====================================
const downloadCSV = async (analysisId) => {
  const response = await axios.get(
    `${EXPORT_API_URL}/csv/${analysisId}`,
    {
      ...authHeaders(),
      responseType: "blob",
    }
  );

  return response;
};


export default {
  getReports,
  getReportById,
  deleteReport,
  downloadPDF,
  downloadCSV,
};