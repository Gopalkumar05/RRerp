// 📄 backend/utils/sendOtp.js

import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Attendance App <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Signup",
    html: `<p>Your OTP for verification is:</p>
           <h2>${otp}</h2>
           <p>This OTP is valid for 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
