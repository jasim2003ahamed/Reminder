// utils/sendEmail.js
import nodemailer from 'nodemailer';
import buildReminderMessage from './messageBuilder.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, notes) => {
  const text = buildReminderMessage({ title: subject, notes });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `Reminder: ${subject}`,
    text,
  });

  console.log(`✅ Email sent to ${to}: ${info.messageId}`);
};

export default sendEmail;
