import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { app, BrowserWindow } from "electron";
import pkg from "update-electron-app";
// utilities
import { createTray } from "./src/utils/tray.js";
import { enableAutostart } from "./src/utils/autoStart.js";
// trackers
import ActivityTracker from "./src/trackers/activityTracker.js";
import IdleTracker from "./src/trackers/idleTracker.js";
import ScreenshotTracker from "./src/trackers/screenShotTracker.js";
import ActiveWindowTracker from "./src/trackers/activeWindowTracker.js";
import ActivitySender from "./src/trackers/activitySender.js";
import "./src/trackers/ScreenCapture.js";



function getLogFile() {
  return path.join(app.getPath("userData"), "app.log");
}

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

function log(...args) {
  const timestamp = new Date().toISOString();
  const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
  try {
    fs.appendFileSync(getLogFile(), `[${timestamp}] ${msg}\n`);
  } catch (e) {}
  originalConsoleLog(...args);
}



const { updateElectronApp } = pkg;

// ES module dirname support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load env - defer until app is ready
let envPath;
function loadEnv() {
  if (app.isPackaged) {
    envPath = path.join(process.resourcesPath, ".env");
  } else {
    envPath = path.join(__dirname, ".env");
  }
  log("Loading env from:", envPath);
  dotenv.config({ path: envPath });
  log("BACKEND_URL:", process.env.BACKEND_URL);
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
}

app.whenReady().then(() => {
  console.log = log;
  console.error = log;

  loadEnv();

  // -------------------------------
  // AUTO UPDATE
  // -------------------------------
  updateElectronApp({
    repo: process.env.UPDATE_REPO || "ClassyKaran/KavyaShift_ExeFile",
    updateInterval: "1 hour",
    logger: console,
  });

  // -------------------------------
  // APP SETUP
  // -------------------------------
  enableAutostart();
  createWindow();
  createTray(mainWindow);

  // -------------------------------
  // TRACKERS
  // -------------------------------
  const activityTracker = ActivityTracker;
  const idleTracker = IdleTracker;
  const screenshotTracker = ScreenshotTracker;
  const activeWindowTracker = ActiveWindowTracker;
  const activitySender = ActivitySender;

  activityTracker.start();
  screenshotTracker.start();
  activitySender.start();

  // track user activity
  activityTracker.onActivity.set(() => {
    idleTracker.recordActivity();
  });

  // -------------------------------
  // APP EVENTS
  // -------------------------------
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      activityTracker.stop();
      idleTracker.stop();
      screenshotTracker.stop();
      activitySender.stop();
      app.quit();
    }
  });

});