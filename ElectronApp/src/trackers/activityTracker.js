import { uIOhook } from 'uiohook-napi';

let keyboardCount = 0;
let mouseClickCount = 0;
let mouseMovementCount = 0;
let isRunning = false;
let onActivityCallback = null;

export function startActivityTracker() {
  if (isRunning) return;
  
  isRunning = true;
  keyboardCount = 0;
  mouseClickCount = 0;
  mouseMovementCount = 0;

  uIOhook.on('keydown', () => {
    keyboardCount++;
    if (onActivityCallback) onActivityCallback();
  });

  uIOhook.on('mousedown', () => {
    mouseClickCount++;
    if (onActivityCallback) onActivityCallback();
  });

  uIOhook.on('mousemove', () => {
    mouseMovementCount++;
    if (onActivityCallback) onActivityCallback();
  });

  uIOhook.start();
  console.log('🎯 Activity tracking started');
}

export function stopActivityTracker() {
  if (!isRunning) return;
  
  uIOhook.stop();
  isRunning = false;
  console.log('⏹️ Activity tracking stopped');
}

export function getActivityStats() {
  return {
    keyboardCount,
    mouseClickCount,
    mouseMovementCount,
  };
}

export function resetActivityStats() {
  keyboardCount = 0;
  mouseClickCount = 0;
  mouseMovementCount = 0;
}

export function setOnActivity(callback) {
  onActivityCallback = callback;
}

export default {
  start: startActivityTracker,
  stop: stopActivityTracker,
  getStats: getActivityStats,
  reset: resetActivityStats,
  onActivity: {
    set: setOnActivity
  }
};
