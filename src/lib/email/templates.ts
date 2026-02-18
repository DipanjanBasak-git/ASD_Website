export const otpVerificationEmail = (otp: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">SMART-ASD Platform</h1>
              <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 14px;">Autism Spectrum Disorder Research</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a202c; font-size: 24px; font-weight: 600;">Verify Your Email</h2>
              <p style="margin: 0 0 30px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Thank you for registering with SMART-ASD Platform. To complete your registration, please use the verification code below:
              </p>
              
              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 30px 0;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 20px 40px; display: inline-block;">
                      <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Verification Code</p>
                      <p style="margin: 10px 0 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                This code will expire in <strong>5 minutes</strong>. If you didn't request this code, please ignore this email.
              </p>
              
              <!-- Security Notice -->
              <div style="margin-top: 30px; padding: 20px; background-color: #fef5e7; border-left: 4px solid #f39c12; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                  <strong>⚠️ Security Notice:</strong> Never share this code with anyone. SMART-ASD staff will never ask for your verification code.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.6;">
                This is an automated message from SMART-ASD Platform<br>
                If you have questions, please contact our support team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const passwordResetEmail = (otp: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">SMART-ASD Platform</h1>
              <p style="margin: 10px 0 0; color: #ffe0e6; font-size: 14px;">Password Reset Request</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a202c; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
              <p style="margin: 0 0 30px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password. Use the code below to proceed with resetting your password:
              </p>
              
              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 30px 0;">
                    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px; padding: 20px 40px; display: inline-block;">
                      <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Reset Code</p>
                      <p style="margin: 10px 0 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                This code will expire in <strong>5 minutes</strong>. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
              </p>
              
              <!-- Security Notice -->
              <div style="margin-top: 30px; padding: 20px; background-color: #fee; border-left: 4px solid #e53e3e; border-radius: 4px;">
                <p style="margin: 0; color: #742a2a; font-size: 14px; line-height: 1.6;">
                  <strong>🔒 Security Alert:</strong> If you didn't request this password reset, someone may be trying to access your account. Please contact our security team immediately.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.6;">
                This is an automated message from SMART-ASD Platform<br>
                If you have questions, please contact our support team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
