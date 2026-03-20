import express from "express";
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import cors from "cors";
import http from "http";
import { Server as IOServer } from "socket.io";

import activityRoutes from './routes/activity.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import screenshotRoutes from './routes/screenshot.routes.js';
import authRoutes from './routes/auth.routes.js';
import initSocket from './sockets/socket.js';
import errorHandler from './middlewares/errorHandler.js';
import Admin from './models/Admin.model.js';
import Employee from './models/Employee.model.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));

connectDB();

app.use('/api', activityRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', screenshotRoutes);
app.use('/api/auth', authRoutes);

const httpServer = http.createServer(app);
const io = new IOServer(httpServer, 
  { cors: { origin: process.env.FRONTEND_URL || "*", credentials: true },});

initSocket(io);

app.get("/", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post('/api/live-screen/request', (req, res) => {
  const { hostname } = req.body;
  if (!hostname) {
    return res.status(400).json({ message: 'Hostname is required' });
  }
  io.emit('request-screen-capture', { hostname });
  res.json({ success: true, message: `Screen capture requested for ${hostname}` });
});

app.post('/api/live-screen/stop', (req, res) => {
  io.emit('stop-screen-capture');
  res.json({ success: true, message: 'Screen capture stopped' });
});

setInterval(async () => {
  try {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const result = await Employee.updateMany(
      { lastActive: { $lt: twoMinutesAgo }, status: { $ne: 'offline' } },
      { $set: { status: 'offline' } }
    );
    if (result.modifiedCount > 0) {
      io.emit('employees-offline-check', { checked: true });
    }
  } catch (err) {
    console.error('Offline check error:', err);
  }
}, 30000);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
