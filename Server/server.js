import express from "express";
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import cors from "cors";
import http from "http";
import { Server as IOServer } from "socket.io";

import activityRoutes from './routes/activity.routes.js';
import screenshotRoutes from './routes/screenshot.routes.js';
import initSocket from './sockets/socket.js';
import errorHandler from './middlewares/errorHandler.js';
import Employee from './models/Employee.model.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));

connectDB();

app.use('/api', activityRoutes);
app.use('/api', screenshotRoutes);

const httpServer = http.createServer(app);
const io = new IOServer(httpServer, 
  { cors: { origin: process.env.FRONTEND_URL || "*", credentials: true },});

initSocket(io);

app.get("/", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
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
