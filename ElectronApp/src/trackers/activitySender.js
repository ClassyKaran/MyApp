import SystemInfo from '../services/systemInfo.js';
import APIService from '../services/apiService.js';

export default class ActivitySender {
  constructor(activityTracker, idleTracker, activeWindowTracker, interval = 5000) {
    this.activityTracker = activityTracker;
    this.idleTracker = idleTracker;
    this.activeWindowTracker = activeWindowTracker;
    this.interval = interval;
    this.sendInterval = null;
  }

  async sendActivityData() {
    const hostname = SystemInfo.getHostname();
    const stats = this.activityTracker.getStats();
    const idleStatus = this.idleTracker.getIdleStatus();
    const activeWindow = await this.activeWindowTracker.getActiveWindow();

    const payload = {
      hostname,
      keyboardCount: stats.keyboardCount,
      mouseCount: stats.mouseClickCount,
      activeWindow,
      timestamp: new Date().toISOString(),
      isIdle: idleStatus.isIdle,
    };

    try {
      await APIService.postActivity(payload);
       console.log(`📤 Activity sent: K=${stats.keyboardCount}, M=${stats.mouseClickCount}, Idle=${idleStatus.isIdle}`);
      
      this.activityTracker.reset();
    } catch (err) {
      console.error('❌ Failed to send activity:', err.message);
    }
  }

  start() {
    this.sendInterval = setInterval(() => {
      this.sendActivityData();
    }, this.interval);
    
    console.log(`⏱️ Sending activity every ${this.interval / 1000} seconds`);
    this.sendActivityData();
  }

  stop() {
    if (this.sendInterval) {
      clearInterval(this.sendInterval);
      this.sendInterval = null;
      console.log('⏱️ Activity sender stopped');
    }
  }
}
