import nodemailer from 'nodemailer';

type EmailPayload = {
    to: string;
    subject: string;
    html: string;
};

const EMAIL_MODE = process.env.EMAIL_MODE || 'production';

// Production SMTP Configuration
const smtpOptions = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // Use TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
};

export const sendEmail = async (data: EmailPayload) => {
    // Development mode: Log to console instead of sending
    if (EMAIL_MODE === 'dev') {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 [DEV MODE] Email would be sent:');
        console.log('To:', data.to);
        console.log('Subject:', data.subject);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        return { messageId: 'dev-mode' };
    }

    // Production mode: Send real email
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error('SMTP credentials not configured. Add SMTP_USER and SMTP_PASS to .env');
    }

    try {
        const transporter = nodemailer.createTransport(smtpOptions);

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"SMART-ASD Platform" <${process.env.SMTP_USER}>`,
            to: data.to,
            subject: data.subject,
            html: data.html,
        });

        console.log(`✅ Email sent to ${data.to} - Message ID: ${info.messageId}`);
        return info;
    } catch (error: any) {
        console.error('❌ Email sending failed:', error.message);
        // Don't expose SMTP credentials in error
        throw new Error('Failed to send email. Please contact support.');
    }
};
