
import express from 'express';
import { getStudentView } from '../controllers/attendanceController.js'; // 👈 Add `.js` if missing

const router = express.Router();

router.get('/view/:username/:year/:month', getStudentView);

export default router;

