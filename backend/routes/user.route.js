import express from "express";
import { login, logout, register, forgotPassword, resetPassword , sendOtp, verifyOtp } from "../controllers/user.controller.js";


const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);


router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
