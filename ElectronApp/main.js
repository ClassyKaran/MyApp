import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { app, BrowserWindow } from 'electron';
import { createTray } from './src/utils/tray.js';
import ActivityTracker from './src/trackers/activityTracker.js';
import IdleTracker from './src/trackers/idleTracker.js';
import ScreenshotTracker from './src/trackers/screenShotTracker.js';
import ActiveWindowTracker from './src/trackers/activeWindowTracker.js';
import ActivitySender from './src/trackers/activitySender.js';
import { enableAutostart } from './src/utils/autoStart.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
}

app.whenReady().then(() => {
  enableAutostart();
  createWindow();
  createTray(mainWindow);



  const activityTracker = ActivityTracker;
  activityTracker.start();

  const idleTracker = IdleTracker;
  const activeWindowTracker = ActiveWindowTracker;
  const activitySender = ActivitySender;

  activityTracker.onActivity.set(() => {
    idleTracker.recordActivity();
  });

  const screenshotTracker = ScreenshotTracker;
  screenshotTracker.start();

  activitySender.start();

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      activityTracker.stop();
      idleTracker.stop();
      screenshotTracker.stop();
      activitySender.stop();
      app.quit();
    }
  });
});
