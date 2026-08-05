// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendVerificationSchema
} = require('../validators/authValidators');

const {
  registerUser,
  verifyEmail,
  resendVerification,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyToken
} = require('../controllers/authController');

// Public routes — rate limited + validated since these are the most attacked endpoints
router.post('/register', authLimiter, validate(registerSchema), registerUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', authLimiter, validate(resendVerificationSchema), resendVerification);
router.post('/login', authLimiter, validate(loginSchema), loginUser);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);
router.get('/verify', protect, verifyToken);


module.exports = router;