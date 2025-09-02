import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (to, name, note = '') => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: '⏰ Monthly Reminder',
      text: `Hi ${name},\n\nThis is your reminder.\n\n📝 Note: ${note || 'No note'}\n\nThanks.`,
    });

    console.log(`✅ Email sent to ${to} - ID: ${info.messageId}`);
  } catch (err) {
    console.error(`❌ Email failed for ${name}:`, err.message);
  }
};

export default sendEmail;
