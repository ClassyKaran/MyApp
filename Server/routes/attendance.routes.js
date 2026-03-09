import express from 'express';
import { calculateAttendance, getAttendance, exportAttendanceCSV } from '../controllers/attendance.controller.js';

const router = express.Router();

router.post('/attendance/calculate', calculateAttendance);
router.get('/attendance', getAttendance);
router.get('/attendance/export', exportAttendanceCSV);

export default router;
