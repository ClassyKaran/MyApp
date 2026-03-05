import express from 'express';
import { postActivity, getEmployees, getSummary } from '../controllers/activity.controller.js';

const router = express.Router();

// employee posts periodic activity payload
router.post('/activity', postActivity);
router.get('/employees', getEmployees);
router.get('/employee/:hostname/summary', getSummary);

export default router;
