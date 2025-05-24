import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from  "nodemailer"
import { sendOtpEmail } from "../utils/sendOtp.js";
import { otpStore } from "../utils/otpStore.js";

dotenv.config();

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();



export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        const teacherCode = generateCode();
        await User.create({
            username,
            email,
            password: hashedPassword,
            code: teacherCode,
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            code: teacherCode, // send code to frontend
        });
    } catch (error) {
        console.log(error);
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const token = await jwt.sign({ userId: user._id }, process.env.your_secret_key, { expiresIn: '1d' });

       
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user,
            code: user.code
        });

    } catch (error) {
        console.log(error);
    }
};
export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
  
      if (!token) return sendError(res, "Token is missing", 400);
      if (!password || password.length < 6) {
        return sendError(res, "Password must be at least 6 characters long", 400);
      }
  
      const decoded = jwt.verify(token, process.env.your_secret_key);
      if (!decoded || !decoded.id) return sendError(res, "Invalid token", 400);
  
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
  
      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("❌ Reset Password Error:", error.message);
      return sendError(res, "Invalid or expired token", 400);
    }
  };
  export const sendError = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  };
  

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return sendError(res, "User is not registered");

        const token = jwt.sign({ id: user._id }, process.env.your_secret_key, { expiresIn: "5h" });
        const encodedToken = encodeURIComponent(token).replace(/\./g, "%2E");
        // Send email with reset link
        const resetUrl = `https://rrerp.onrender.com/reset-password/${token}`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            text: `Click the following link to reset your password: ${resetUrl}`
        });

        return res.status(200).json({ message: "Password reset email sent", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


export const sendOtp = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }
    const existingPassword = await User.findOne({ password });
    if (existingPassword) {
      return res.status(409).json({ message: "Password already Used." });
    }
  
    const otp = generateCode(); // 6-digit OTP
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  
    otpStore.set(email, { otp, userData: { username, email, password }, expiresAt });
  
    await sendOtpEmail(email, otp);
  
    res.status(200).json({ message: "OTP sent to email." });
  };
  
  export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore.get(email);
  
    if (!record || Date.now() > record.expiresAt) {
      return res.status(400).json({ message: "OTP expired or invalid." });
    }
  
    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }
  
    const { username, password } = record.userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacherCode = generateCode();
    const newUser = await User.create({
      username,
      email,
      password:hashedPassword, // hash it if needed
      code:teacherCode, // unique 6-char code
    });
  
    otpStore.delete(email); // clear used OTP
  
    res.status(201).json({ message: "Signup successful", code: newUser.code });
  };
  
