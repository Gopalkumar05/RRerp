import express from 'express';
import {

  signupStudent,
  loginStudent,
} from '../controllers/authController.js';

const router = express.Router();


router.post('/student/signup', signupStudent);
router.post('/student/login', loginStudent);

export default router;
