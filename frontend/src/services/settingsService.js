import axios from "axios";

const API_URL =
  `${import.meta.env.VITE_API_URL}/settings`;

const authHeaders = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token")}`,
  },
});

const settingsService = {

  // Get Settings
  getSettings: async () => {

    const response = await axios.get(
      API_URL,
      authHeaders()
    );

    return response.data;
  },


  // Update Profile
  updateProfile: async (profileData) => {

    const response = await axios.put(
      `${API_URL}/profile`,
      profileData,
      authHeaders()
    );

    return response.data;
  },


  // Update Notifications
  updateNotifications: async (
    notificationData
  ) => {

    const response = await axios.put(
      `${API_URL}/notifications`,
      notificationData,
      authHeaders()
    );

    return response.data;
  },


  // Update Appearance
  updateAppearance: async (
    appearanceData
  ) => {

    const response = await axios.put(
      `${API_URL}/appearance`,
      appearanceData,
      authHeaders()
    );

    return response.data;
  },


  // Update Password
  updatePassword: async (
    passwordData
  ) => {

    const response = await axios.put(
      `${API_URL}/security`,
      passwordData,
      authHeaders()
    );

    return response.data;
  },

};

export default settingsService;