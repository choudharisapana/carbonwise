// backend/src/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');
const generateToken = require('../utils/generateToken');

// ============================================================
// REGISTER USER
// @route   POST /api/auth/register
// @access  Public
// ============================================================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Send verification email
    try {
      await emailService.sendVerificationEmail(
        email,
        name,
        verificationToken
      );

      return res.status(201).json({
        success: true,
        emailSent: true,
        message:
          'Registration successful. Verification email sent. Please check your inbox.'
      });

    } catch (emailError) {
      console.error(
        '❌ Verification email sending failed:',
        emailError
      );

      return res.status(201).json({
        success: true,
        emailSent: false,
        needsVerification: true,
        message:
          'Registration successful, but we could not send the verification email. Please use Resend Verification.'
      });
    }

  } catch (error) {
    console.error('❌ Register error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};


// ============================================================
// VERIFY EMAIL
// @route   GET /api/auth/verify-email/:token
// @access  Public
// ============================================================
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find user with valid verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid or expired verification token. Please request a new one.'
      });
    }

    // Mark email as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;

    await user.save();

    // Send welcome email
    try {
      await emailService.sendVerificationSuccessEmail(
        user.email,
        user.name
      );
    } catch (emailError) {
      console.error(
        '⚠️ Welcome email failed:',
        emailError
      );
      // Welcome email is non-critical
    }

    return res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('❌ Verify email error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
};


// ============================================================
// RESEND VERIFICATION EMAIL
// @route   POST /api/auth/resend-verification
// @access  Public
// ============================================================
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    // Don't reveal whether account exists
    if (!user) {
      return res.json({
        success: true,
        message:
          'If an unverified account with that email exists, a verification link has been sent.'
      });
    }

    // Already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = user.generateVerificationToken();

    await user.save();

    // Send verification email
    try {
      await emailService.sendVerificationEmail(
        user.email,
        user.name,
        verificationToken
      );

      return res.json({
        success: true,
        emailSent: true,
        message:
          'Verification email resent successfully. Please check your inbox.'
      });

    } catch (emailError) {
      console.error(
        '❌ Resend verification email failed:',
        emailError
      );

      return res.status(500).json({
        success: false,
        emailSent: false,
        message:
          'Unable to send verification email. Please try again later.'
      });
    }

  } catch (error) {
    console.error(
      '❌ Resend verification error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Server error while resending verification'
    });
  }
};


// ============================================================
// LOGIN USER
// @route   POST /api/auth/login
// @access  Public
// ============================================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly include password
    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check email verification
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message:
          'Please verify your email before logging in. Check your inbox for the verification link.',
        needsVerification: true,
        email: user.email
      });
    }

    // Update last login
    user.lastLogin = new Date();

    await user.save();

    // Generate JWT only after verification
    const token = generateToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};


// ============================================================
// VERIFY JWT TOKEN
// ============================================================
const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password');

    return res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('❌ Verify token error:', error);

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};


// ============================================================
// FORGOT PASSWORD
// @route   POST /api/auth/forgot-password
// @access  Public
// ============================================================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    // Don't reveal whether account exists
    if (!user) {
      return res.json({
        success: true,
        message:
          'If an account with that email exists, a password reset email has been sent. Please check your inbox.'
      });
    }

    // Generate reset token
    const resetToken = user.generateResetToken();

    await user.save();

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken
      );

      return res.json({
        success: true,
        emailSent: true,
        message:
          'Password reset email sent. Please check your inbox.'
      });

    } catch (emailError) {
      console.error(
        '❌ Password reset email failed:',
        emailError
      );

      // Invalidate token if email wasn't sent
      user.resetPasswordToken = null;
      user.resetPasswordExpiry = null;

      await user.save();

      return res.status(500).json({
        success: false,
        emailSent: false,
        message:
          'Unable to send password reset email. Please try again later.'
      });
    }

  } catch (error) {
    console.error(
      '❌ Forgot password error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Server error while processing request'
    });
  }
};


// ============================================================
// RESET PASSWORD
// @route   POST /api/auth/reset-password
// @access  Public
// ============================================================
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          'Token and new password are required'
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid or expired reset token. Please request a new one.'
      });
    }

    // Update password
    user.password = newPassword;

    // Clear reset token
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;

    await user.save();

    return res.json({
      success: true,
      message:
        'Password reset successfully! You can now login with your new password.'
    });

  } catch (error) {
    console.error(
      '❌ Reset password error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Server error while resetting password'
    });
  }
};


// ============================================================
// EXPORT CONTROLLERS
// ============================================================
module.exports = {
  registerUser,
  verifyEmail,
  resendVerification,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyToken
};