// backend/src/services/emailService.js
const nodemailer = require('nodemailer');

// Configure nodemailer with Gmail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error);
  } else {
    console.log('✅ Email service ready!');
  }
});

const emailService = {
  // Send verification email
  sendVerificationEmail: async (email, name, token) => {
    const verificationUrl =
   `${process.env.FRONTEND_URL}/verify-email/${token}`;
    const mailOptions = {
from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your Email - CodeCarbon AI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 10px; }
            .header { background: linear-gradient(135deg, #065F46, #10B981); padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 30px; background: white; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #10B981; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .button:hover { background: #059669; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            .expiry { color: #ef4444; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌱 CodeCarbon AI</h1>
              <p style="color: rgba(255,255,255,0.8); margin-top: 5px;">Green DevOps Platform</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Welcome to <strong>CodeCarbon AI</strong> - your Green DevOps Platform for sustainable software development.</p>
              <p>Please verify your email address to get started:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" class="button">✅ Verify Email Address</a>
              </div>
              <p class="expiry">⏰ This link will expire in <strong>24 hours</strong>.</p>
              <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
                If you didn't create an account with CodeCarbon AI, please ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>© 2026 CodeCarbon AI. All rights reserved.</p>
              <p>Built with ❤️ for Green Software Engineering</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Verification email sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Send verification email error:', error);
      throw new Error('Failed to send verification email');
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (email, name, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
from: process.env.EMAIL_FROM,      to: email,
      subject: 'Reset Your Password - CodeCarbon AI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 10px; }
            .header { background: linear-gradient(135deg, #065F46, #10B981); padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 30px; background: white; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #10B981; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .button:hover { background: #059669; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            .expiry { color: #ef4444; font-size: 12px; }
            .warning { background: #fef3c7; padding: 10px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 CodeCarbon AI</h1>
              <p style="color: rgba(255,255,255,0.8); margin-top: 5px;">Password Reset</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>We received a request to reset your password for your CodeCarbon AI account.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="button">🔑 Reset Password</a>
              </div>
              <p class="expiry">⏰ This link will expire in <strong>15 minutes</strong>.</p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact support.
              </div>
            </div>
            <div class="footer">
              <p>© 2026 CodeCarbon AI. All rights reserved.</p>
              <p>Built with ❤️ for Green Software Engineering</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Send password reset email error:', error);
      throw new Error('Failed to send password reset email');
    }
  },

  // Send verification success email
  sendVerificationSuccessEmail: async (email, name) => {
    const mailOptions = {
from: process.env.EMAIL_FROM,      to: email,
      subject: 'Welcome to CodeCarbon AI! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 10px; }
            .header { background: linear-gradient(135deg, #065F46, #10B981); padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 30px; background: white; border-radius: 0 0 10px 10px; }
            .features { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
            .feature { background: #f3f4f6; padding: 10px; border-radius: 5px; text-align: center; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌱 CodeCarbon AI</h1>
              <p style="color: rgba(255,255,255,0.8); margin-top: 5px;">Welcome Aboard! 🎉</p>
            </div>
            <div class="content">
              <h2>Welcome ${name}!</h2>
              <p>Your email has been successfully verified. You're now ready to start your green software journey!</p>
              <div class="features">
                <div class="feature">🌿 Carbon Analysis</div>
                <div class="feature">🤖 AI Suggestions</div>
                <div class="feature">📊 Repository Insights</div>
                <div class="feature">🏆 Green Certification</div>
              </div>
              <p style="text-align: center; margin-top: 20px;">
                <strong>Start analyzing your repositories now!</strong>
              </p>
              <p style="font-size: 14px; color: #6b7280;">
                Login to your dashboard to get started with your first sustainability analysis.
              </p>
            </div>
            <div class="footer">
              <p>© 2026 CodeCarbon AI. All rights reserved.</p>
              <p>Built with ❤️ for Green Software Engineering</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(` Verification success email sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('Send verification success email error:', error);
      // Don't throw - this is not critical
      return { success: false };
    }
  }
};

module.exports = emailService;