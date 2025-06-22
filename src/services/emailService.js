require("dotenv").config();           
const nodemailer = require("nodemailer");

// Create a Nodemailer transporter using SMTP settings from environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,        
  port: Number(process.env.SMTP_PORT), 
  secure: false,                       
  auth: {
    user: process.env.SMTP_USER,      
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// 
async function sendEmail(to, subject, text, attachments = []) {
  const mailOptions = {
    from: `"Expense Tracker" <${process.env.SMTP_FROM}>`,
    to,
    subject,
    text,
    attachments,
  };

  console.log(`[EmailService] Sending via ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
  const info = await transporter.sendMail(mailOptions);
  console.log(`[EmailService] Sent ${info.messageId} to ${to}`);
  return info;
}

module.exports = sendEmail;