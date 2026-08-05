// backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true
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
  // GitHub OAuth ("Connect GitHub") — lets each user link their own
  // GitHub account so private repos are analyzed with THEIR access,
  // not a single shared app-level token.
  githubId: {
    type: String,
    default: null
  },
  githubUsername: {
    type: String,
    default: null
  },
  githubAvatarUrl: {
    type: String,
    default: null
  },
  githubAccessTokenEncrypted: {
    type: String,
    default: null,
    select: false // never returned by default queries — must opt in with .select('+githubAccessTokenEncrypted')
  },
 preferences: {
    theme: {
        type: String,
        default: 'dark'
    },

    notifications: {
        type: Boolean,
        default: true
    },

    carbonUnit: {
        type: String,
        default: 'kg'
    },

    reportFormat: {
        type: String,
        default: 'pdf'
    }
}
});

// Hash password before saving
userSchema.pre('save', async function () {

  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate verification token
userSchema.methods.generateVerificationToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = token;
  this.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

// Generate reset password token
userSchema.methods.generateResetToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = token;
  this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
  return token;
};

// Check if verification token is expired
userSchema.methods.isVerificationTokenExpired = function() {
  return Date.now() > this.verificationTokenExpiry;
};

// Check if reset token is expired
userSchema.methods.isResetTokenExpired = function() {
  return Date.now() > this.resetPasswordExpiry;
};

const User = mongoose.model('User', userSchema);

module.exports = User;