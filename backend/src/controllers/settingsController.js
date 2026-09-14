const User = require("../models/User");

// ==========================================
// Get Settings
// GET /api/settings
// ==========================================

const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email role isVerified lastLogin githubUsername githubAvatarUrl preferences"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
        githubUsername: user.githubUsername,
        githubAvatarUrl: user.githubAvatarUrl,
      },
      preferences: user.preferences,
    });
  } catch (error) {
    console.error("Get Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings.",
    });
  }
};


// ==========================================
// Update Profile
// PUT /api/settings/profile
// ==========================================

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.name = name.trim();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};


// ==========================================
// Update Notifications
// PUT /api/settings/notifications
// ==========================================

const updateNotifications = async (req, res) => {
  try {
    const {
      analysisCompleted,
      reportGenerated,
      weeklySummary,
      securityAlerts,
      githubSync,
      emailNotifications,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.preferences.notifications = {
      analysisCompleted:
        typeof analysisCompleted === "boolean"
          ? analysisCompleted
          : true,

      reportGenerated:
        typeof reportGenerated === "boolean"
          ? reportGenerated
          : true,

      weeklySummary:
        typeof weeklySummary === "boolean"
          ? weeklySummary
          : false,

      securityAlerts:
        typeof securityAlerts === "boolean"
          ? securityAlerts
          : true,

      githubSync:
        typeof githubSync === "boolean"
          ? githubSync
          : true,

      emailNotifications:
        typeof emailNotifications === "boolean"
          ? emailNotifications
          : true,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Notification preferences updated successfully.",
      notifications: user.preferences.notifications,
    });
  } catch (error) {
    console.error("Update Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notification preferences.",
    });
  }
};


// ==========================================
// Update Appearance
// PUT /api/settings/appearance
// ==========================================

const updateAppearance = async (req, res) => {
  try {
    const {
      theme,
      carbonUnit,
      defaultExport,
    } = req.body;

    const allowedThemes = ["dark", "light"];
    const allowedUnits = ["gCO₂", "kgCO₂"];
    const allowedExports = ["PDF", "CSV"];

    if (theme && !allowedThemes.includes(theme)) {
      return res.status(400).json({
        success: false,
        message: "Invalid theme selected.",
      });
    }

    if (carbonUnit && !allowedUnits.includes(carbonUnit)) {
      return res.status(400).json({
        success: false,
        message: "Invalid carbon unit selected.",
      });
    }

    if (
      defaultExport &&
      !allowedExports.includes(defaultExport)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid export format selected.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (theme) {
      user.preferences.appearance.theme = theme;
    }

    if (carbonUnit) {
      user.preferences.appearance.carbonUnit = carbonUnit;
    }

    if (defaultExport) {
      user.preferences.appearance.defaultExport =
        defaultExport;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Appearance settings updated successfully.",
      appearance: user.preferences.appearance,
    });
  } catch (error) {
    console.error("Update Appearance Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update appearance settings.",
    });
  }
};


// ==========================================
// Update Password
// PUT /api/settings/security
// ==========================================

const updatePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 8 characters long.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch =
      await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Update Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update password.",
    });
  }
};


module.exports = {
  getSettings,
  updateProfile,
  updateNotifications,
  updateAppearance,
  updatePassword,
};