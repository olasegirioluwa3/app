import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true', // Convert string to boolean
        auth: {
            user: process.env.EMAIL_AUTH_USER,
            pass: process.env.EMAIL_AUTH_PASS
        },
        tls: {
            rejectUnauthorized: process.env.EMAIL_TLS_REJECTUNAUTHORIZED === 'true' // Convert string to boolean
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_AUTH_USER,
            to,
            subject,
            text,
        });
        console.log('Email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const email = {
  sendEmail
}
export default email;
