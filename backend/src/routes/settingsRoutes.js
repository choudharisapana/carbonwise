const express = require("express");

const router = express.Router();

const { protect } =
  require("../middleware/authMiddleware");

const {
  getSettings,
  updateProfile,
  updateNotifications,
  updateAppearance,
  updatePassword,
} =
  require("../controllers/settingsController");


// Get Settings
router.get(
  "/",
  protect,
  getSettings
);


// Profile
router.put(
  "/profile",
  protect,
  updateProfile
);


// Notifications
router.put(
  "/notifications",
  protect,
  updateNotifications
);


// Appearance
router.put(
  "/appearance",
  protect,
  updateAppearance
);


// Security / Password
router.put(
  "/security",
  protect,
  updatePassword
);


module.exports = router;