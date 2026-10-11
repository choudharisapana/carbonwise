
const emailService = {
  async sendEmail(to, subject, htmlContent) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.EMAIL_FROM;

    if (!apiKey || !senderEmail) {
      throw new Error(
        'Missing BREVO_API_KEY or EMAIL_FROM in environment variables'
      );
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'CarbonWise',
          email: senderEmail,
        },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Brevo email error:', response.status, result);
      throw new Error(
        result.message || `Brevo email failed with status ${response.status}`
      );
    }

    console.log(`Email accepted by Brevo for ${to}`);
    return result;
  },

  async sendVerificationEmail(email, name, token) {
    const verificationUrl =
      `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#1f2937">
        <h2 style="color:#16a34a">Welcome to CarbonWise, ${name}!</h2>
        <p>Please verify your email address to activate your account.</p>
        <p style="margin:28px 0">
          <a href="${verificationUrl}"
             style="background:#16a34a;color:#fff;padding:12px 22px;text-decoration:none;border-radius:6px;display:inline-block">
            Verify Email
          </a>
        </p>
        <p>If you did not create this account, you can ignore this email.</p>
        <p>Regards,<br/>CarbonWise Team</p>
      </div>
    `;

    return this.sendEmail(
      email,
      'Verify Your Email - CarbonWise',
      html
    );
  },

  async sendPasswordResetEmail(email, name, token) {
    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#1f2937">
        <h2 style="color:#16a34a">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your CarbonWise password.</p>
        <p style="margin:28px 0">
          <a href="${resetUrl}"
             style="background:#16a34a;color:#fff;padding:12px 22px;text-decoration:none;border-radius:6px;display:inline-block">
            Reset Password
          </a>
        </p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Regards,<br/>CarbonWise Team</p>
      </div>
    `;

    return this.sendEmail(
      email,
      'Reset Your Password - CarbonWise',
      html
    );
  },

  async sendVerificationSuccessEmail(email, name) {
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#1f2937">
        <h2 style="color:#16a34a">Email Verified Successfully!</h2>
        <p>Hi ${name},</p>
        <p>Your email has been verified. Welcome to CarbonWise!</p>
        <p>You can now log in and start tracking your software carbon footprint.</p>
        <p>Regards,<br/>CarbonWise Team</p>
      </div>
    `;

    return this.sendEmail(
      email,
      'Welcome to CarbonWise!',
      html
    );
  },
};

module.exports = emailService;
