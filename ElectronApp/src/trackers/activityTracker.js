import { uIOhook } from 'uiohook-napi';

class ActivityTracker {
  constructor() {
    this.keyboardCount = 0;
    this.mouseClickCount = 0;
    this.mouseMovementCount = 0;
    this.isRunning = false;
    this.onActivity = null;
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.keyboardCount = 0;
    this.mouseClickCount = 0;
    this.mouseMovementCount = 0;

    uIOhook.on('keydown', () => {
      this.keyboardCount++;
      if (this.onActivity) this.onActivity();
    });

    uIOhook.on('mousedown', () => {
      this.mouseClickCount++;
      if (this.onActivity) this.onActivity();
    });

    uIOhook.on('mousemove', () => {
      this.mouseMovementCount++;
      if (this.onActivity) this.onActivity();
    });

    uIOhook.start();
    console.log('🎯 Activity tracking started');
  }

  stop() {
    if (!this.isRunning) return;
    
    uIOhook.stop();
    this.isRunning = false;
    console.log('⏹️ Activity tracking stopped');
  }

  getStats() {
    return {
      keyboardCount: this.keyboardCount,
      mouseClickCount: this.mouseClickCount,
      mouseMovementCount: this.mouseMovementCount,
    };
  }

  reset() {
    this.keyboardCount = 0;
    this.mouseClickCount = 0;
    this.mouseMovementCount = 0;
  }
}

export default ActivityTracker;
