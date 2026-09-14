// backend/src/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    // Password is required only for normal email/password accounts.
    // GitHub OAuth users do not need a password.
    password: {
      type: String,
      required: function () {
        return this.authProvider === 'local';
      },
      select: false
    },

    // Authentication method used to create/login to the account
    authProvider: {
      type: String,
      enum: ['local', 'github'],
      default: 'local'
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    verificationToken: {
      type: String,
      default: null
    },

    verificationTokenExpiry: {
      type: Date,
      default: null
    },

    resetPasswordToken: {
      type: String,
      default: null
    },

    resetPasswordExpiry: {
      type: Date,
      default: null
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    lastLogin: {
      type: Date,
      default: null
    },

    // =====================================
    // GitHub Account
    // =====================================

    githubId: {
      type: String,
      default: null,
      sparse: true
    },

    githubUsername: {
      type: String,
      default: null
    },

    githubAvatarUrl: {
      type: String,
      default: null
    },

    // Never expose GitHub token in API responses
    githubAccessTokenEncrypted: {
      type: String,
      default: null,
      select: false
    },

    // =====================================
    // User Preferences
    // =====================================

    preferences: {
      notifications: {
        analysisCompleted: {
          type: Boolean,
          default: true
        },

        reportGenerated: {
          type: Boolean,
          default: true
        },

        weeklySummary: {
          type: Boolean,
          default: false
        },

        securityAlerts: {
          type: Boolean,
          default: true
        },

        githubSync: {
          type: Boolean,
          default: true
        },

        emailNotifications: {
          type: Boolean,
          default: true
        }
      },

      appearance: {
        theme: {
          type: String,
          enum: ['dark', 'light'],
          default: 'dark'
        },

        carbonUnit: {
          type: String,
          enum: ['gCO₂', 'kgCO₂'],
          default: 'gCO₂'
        },

        defaultExport: {
          type: String,
          enum: ['PDF', 'CSV'],
          default: 'PDF'
        }
      }
    }
  },
  {
    timestamps: true
  }
);


// =====================================
// Hash Password Before Saving
// =====================================

userSchema.pre('save', async function () {
  if (!this.password || !this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});


// =====================================
// Compare Password
// =====================================

userSchema.methods.matchPassword =
  async function (enteredPassword) {

    if (!this.password) {
      return false;
    }

    return bcrypt.compare(
      enteredPassword,
      this.password
    );
  };


// =====================================
// Generate Verification Token
// =====================================

userSchema.methods.generateVerificationToken =
  function () {

    const crypto = require('crypto');

    const token =
      crypto.randomBytes(32).toString('hex');

    this.verificationToken = token;

    this.verificationTokenExpiry =
      Date.now() +
      24 * 60 * 60 * 1000;

    return token;
  };


// =====================================
// Generate Reset Password Token
// =====================================

userSchema.methods.generateResetToken =
  function () {

    const crypto = require('crypto');

    const token =
      crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = token;

    this.resetPasswordExpiry =
      Date.now() +
      15 * 60 * 1000;

    return token;
  };


// =====================================
// Check Verification Token
// =====================================

userSchema.methods.isVerificationTokenExpired =
  function () {

    return Date.now() >
      this.verificationTokenExpiry;
  };


// =====================================
// Check Reset Token
// =====================================

userSchema.methods.isResetTokenExpired =
  function () {

    return Date.now() >
      this.resetPasswordExpiry;
  };


const User =
  mongoose.model(
    'User',
    userSchema
  );

module.exports = User;