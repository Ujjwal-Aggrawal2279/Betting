import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
       service: "gmail",
       auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
       },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
       try {
              await transporter.sendMail({
                     from: `"BetHive Team" <${process.env.SMTP_USER}>`,
                     to,
                     subject,
                     html,
              });
              console.log(`✅ Email sent to ${to}`);
       } catch (err) {
              console.error("❌ Error sending email:", err);
       }
};
