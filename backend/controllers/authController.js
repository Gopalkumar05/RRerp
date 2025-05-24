import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User}from '../models/user.model.js';
import Student from '../models/Student.js';
import dotenv from 'dotenv';
dotenv.config();



  export const signupStudent = async (req, res) => {
    try {
      const { name, roll, password } = req.body;
  
      // Check if student already exists
      const existingStudent = await Student.findOne({ roll });
      if (existingStudent) {
        return res.status(400).json({ message: 'Student already registered' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Save student to database
      const newStudent = new Student({ name, roll, password: hashedPassword });
      await newStudent.save();
  
      res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  };

  export const loginStudent = async (req, res) => {
    try {
      const { roll, code } = req.body;
  
      // Check if student exists
      const student = await Student.findOne({ roll });
      if (!student) {
        return res.status(400).json({ message: "Student not found. Please sign up first." });
      }
  
      // Find teacher by code
      const teacher = await User.findOne({ code });
      if (!teacher) {
        return res.status(400).json({ message: "Invalid teacher code. Please try again." });
      }
  
      res.status(200).json({ message: "Login successful", studentName: student.name, teacherName: teacher.name });
    } catch (error) {
      console.error("Student login error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };