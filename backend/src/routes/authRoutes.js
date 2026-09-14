// backend/src/routes/authRoutes.js

const express = require('express');

const router = express.Router();


// ============================================
// IMPORT AUTH CONTROLLER
// ============================================

const {
  registerUser,
  verifyEmail,
  resendVerification,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyToken
} = require('../controllers/authController');


// ============================================
// IMPORT AUTH MIDDLEWARE
// ============================================

const {
  protect
} = require('../middleware/authMiddleware');


// ============================================
// AUTH RATE LIMITER
// ============================================

// Uncomment this if authLimiter exists
// in your rateLimiter.js file.

/*
const {
  authLimiter
} = require('../middleware/rateLimiter');
*/


// ============================================
// REGISTER USER
// ============================================

/*
  POST /api/auth/register

  Body:
  {
    name,
    email,
    password
  }

  Response:
  {
    success: true,
    message: "Verification email sent..."
  }
*/

router.post(
  '/register',
  registerUser
);


// ============================================
// LOGIN USER
// ============================================

/*
  POST /api/auth/login

  Body:
  {
    email,
    password
  }

  Response:
  {
    success: true,
    token,
    user
  }
*/

router.post(
  '/login',
  loginUser
);


// ============================================
// VERIFY EMAIL
// ============================================

/*
  GET /api/auth/verify-email/:token

  Example:

  /api/auth/verify-email/abc123
*/

router.get(
  '/verify-email/:token',
  verifyEmail
);


// ============================================
// RESEND VERIFICATION EMAIL
// ============================================

/*
  POST /api/auth/resend-verification

  Body:
  {
    email
  }
*/

router.post(
  '/resend-verification',
  resendVerification
);


// ============================================
// VERIFY JWT TOKEN
// ============================================

/*
  GET /api/auth/verify

  Headers:

  Authorization:
  Bearer JWT_TOKEN


  Used by:

  - AuthContext
  - Page Refresh
  - GitHub OAuth Login
  - Protected Routes
*/

router.get(
  '/verify',
  protect,
  verifyToken
);


// ============================================
// FORGOT PASSWORD
// ============================================

/*
  POST /api/auth/forgot-password

  Body:
  {
    email
  }
*/

router.post(
  '/forgot-password',
  forgotPassword
);


// ============================================
// RESET PASSWORD
// ============================================

/*
  POST /api/auth/reset-password

  Body:
  {
    token,
    newPassword
  }
*/

router.post(
  '/reset-password',
  resetPassword
);


// ============================================
// EXPORT ROUTER
// ============================================

module.exports = router;