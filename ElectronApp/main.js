import dotenv from "dotenv";
import path from "path";
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

const { updateElectronApp } = pkg;

// ES module dirname support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load env
dotenv.config({ path: path.join(__dirname, ".env") });

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