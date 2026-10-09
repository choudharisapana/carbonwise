// backend/src/services/emailService.js

const emailService = {
  // ============================================
  // SEND VERIFICATION EMAIL
  // ============================================
  sendVerificationEmail: async (email, name, token) => {
    const verificationUrl =
      `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background: #f3f4f6;
          }

          .container {
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
            background: #f9fafb;
            border-radius: 10px;
          }

          .header {
            background: linear-gradient(135deg, #065F46, #10B981);
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }

          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
          }

          .content {
            padding: 30px;
            background: white;
            border-radius: 0 0 10px 10px;
          }

          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #10B981;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }

          .expiry {
            color: #ef4444;
            font-size: 12px;
          }

          .footer {
            text-align: center;
            margin-top: 20px;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>

      <body>
        <div class="container">

          <div class="header">
            <h1>🌱 CarbonWise</h1>
            <p style="color: rgba(255,255,255,0.8); margin-top: 5px;">
              Green Software Intelligence
            </p>
          </div>

          <div class="content">

            <h2>Hello ${name || 'there'}!</h2>

            <p>
              Welcome to <strong>CarbonWise</strong> —
              your Green Software Intelligence platform for
              sustainable software development.
            </p>

            <p>
              Please verify your email address to activate your account:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" class="button">
                ✅ Verify Email Address
              </a>
            </div>

            <p class="expiry">
              ⏰ This link will expire in <strong>24 hours</strong>.
            </p>

            <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
              If you didn't create an account with CarbonWise,
              please ignore this email.
            </p>

          </div>

          <div class="footer">
            <p>© 2026 CarbonWise. All rights reserved.</p>
            <p>Built for Green Software Engineering 🌱</p>
          </div>

        </div>
      </body>
      </html>
    `;

    try {
      const response = await fetch(
        'https://api.resend.com/emails',
        {
          method: 'POST',

          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            from: process.env.EMAIL_FROM,
            to: [email],
            subject: 'Verify Your Email - CarbonWise',
            html
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          '❌ Resend verification email error:',
          data
        );

        throw new Error(
          data?.message || 'Failed to send verification email'
        );
      }

      console.log(
        `✅ Verification email sent to ${email}`,
        data?.id ? `(ID: ${data.id})` : ''
      );

      return {
        success: true,
        id: data?.id
      };

    } catch (error) {
      console.error(
        '❌ Send verification email error:',
        error.message
      );

      throw new Error(
        'Failed to send verification email'
      );
    }
  },


  // ============================================
  // SEND PASSWORD RESET EMAIL
  // ============================================
  sendPasswordResetEmail: async (email, name, token) => {

    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background: #f3f4f6;
          }

          .container {
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
            background: #f9fafb;
            border-radius: 10px;
          }

          .header {
            background: linear-gradient(135deg, #065F46, #10B981);
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }

          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
          }

          .content {
            padding: 30px;
            background: white;
            border-radius: 0 0 10px 10px;
          }

          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #10B981;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }

          .expiry {
            color: #ef4444;
            font-size: 12px;
          }

          .warning {
            background: #fef3c7;
            padding: 12px;
            border-radius: 5px;
            margin: 20px 0;
          }

          .footer {
            text-align: center;
            margin-top: 20px;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>

      <body>

        <div class="container">

          <div class="header">
            <h1>🔐 CarbonWise</h1>

            <p style="color: rgba(255,255,255,0.8); margin-top: 5px;">
              Password Reset
            </p>
          </div>

          <div class="content">

            <h2>Hello ${name || 'there'}!</h2>

            <p>
              We received a request to reset your password
              for your CarbonWise account.
            </p>

            <div style="text-align: center; margin: 30px 0;">

              <a href="${resetUrl}" class="button">
                🔑 Reset Password
              </a>

            </div>

            <p class="expiry">
              ⏰ This link will expire in <strong>15 minutes</strong>.
            </p>

            <div class="warning">

              <strong>⚠️ Security Notice:</strong>

              If you didn't request this password reset,
              please ignore this email.

            </div>

          </div>

          <div class="footer">
            <p>© 2026 CarbonWise. All rights reserved.</p>
            <p>Built for Green Software Engineering 🌱</p>
          </div>

        </div>

      </body>
      </html>
    `;

    try {

      const response = await fetch(
        'https://api.resend.com/emails',
        {
          method: 'POST',

          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            from: process.env.EMAIL_FROM,
            to: [email],
            subject: 'Reset Your Password - CarbonWise',
            html
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        console.error(
          '❌ Resend password reset error:',
          data
        );

        throw new Error(
          data?.message || 'Failed to send password reset email'
        );
      }

      console.log(
        `✅ Password reset email sent to ${email}`,
        data?.id ? `(ID: ${data.id})` : ''
      );

      return {
        success: true,
        id: data?.id
      };

    } catch (error) {

      console.error(
        '❌ Send password reset email error:',
        error.message
      );

      throw new Error(
        'Failed to send password reset email'
      );
    }
  },


  // ============================================
  // SEND VERIFICATION SUCCESS EMAIL
  // ============================================
  sendVerificationSuccessEmail: async (email, name) => {

    const html = `
      <!DOCTYPE html>
      <html>

      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <style>

          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background: #f3f4f6;
          }

          .container {
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
            background: #f9fafb;
            border-radius: 10px;
          }

          .header {
            background: linear-gradient(135deg, #065F46, #10B981);
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }

          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
          }

          .content {
            padding: 30px;
            background: white;
            border-radius: 0 0 10px 10px;
          }

          .feature {
            background: #f3f4f6;
            padding: 10px;
            border-radius: 5px;
            margin: 8px 0;
            text-align: center;
          }

          .footer {
            text-align: center;
            margin-top: 20px;
            color: #6b7280;
            font-size: 12px;
          }

        </style>

      </head>

      <body>

        <div class="container">

          <div class="header">

            <h1>🌱 CarbonWise</h1>

            <p style="color: rgba(255,255,255,0.8);">
              Welcome Aboard! 🎉
            </p>

          </div>

          <div class="content">

            <h2>Welcome ${name || 'there'}!</h2>

            <p>
              Your email has been successfully verified.
              You're now ready to start your green software journey!
            </p>

            <div class="feature">
              🌿 Carbon Analysis
            </div>

            <div class="feature">
              🤖 AI Suggestions
            </div>

            <div class="feature">
              📊 Repository Insights
            </div>

            <div class="feature">
              🏆 Sustainability Insights
            </div>

            <p style="text-align: center; margin-top: 25px;">
              <strong>
                Start analyzing your repositories now!
              </strong>
            </p>

            <p style="font-size: 14px; color: #6b7280;">
              Login to your CarbonWise dashboard
              to get started with your first sustainability analysis.
            </p>

          </div>

          <div class="footer">

            <p>
              © 2026 CarbonWise. All rights reserved.
            </p>

            <p>
              Built for Green Software Engineering 🌱
            </p>

          </div>

        </div>

      </body>

      </html>
    `;

    try {

      const response = await fetch(
        'https://api.resend.com/emails',
        {
          method: 'POST',

          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            from: process.env.EMAIL_FROM,
            to: [email],
            subject: 'Welcome to CarbonWise! 🎉',
            html
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        console.error(
          '❌ Resend verification success email error:',
          data
        );

        return {
          success: false
        };
      }

      console.log(
        `✅ Verification success email sent to ${email}`,
        data?.id ? `(ID: ${data.id})` : ''
      );

      return {
        success: true,
        id: data?.id
      };

    } catch (error) {

      console.error(
        'Send verification success email error:',
        error.message
      );

      // Non-critical email — don't break verification
      return {
        success: false
      };
    }
  }
};

module.exports = emailService;