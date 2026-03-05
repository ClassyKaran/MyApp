class IdleTracker {
  constructor() {
    this.idleStartTime = null;
    this.isIdle = false;
    this.idleThresholdMs = 5 * 60 * 1000;
    this.checkInterval = 5000;
    this.lastActivityTime = Date.now();
    this.startTracking();
  }

  startTracking() {
    setInterval(() => {
      this.checkIdleStatus();
    }, this.checkInterval);
  }

  recordActivity() {
    this.lastActivityTime = Date.now();
    if (this.isIdle) {
      console.log('✅ User resumed activity');
      this.isIdle = false;
      this.idleStartTime = null;
    }
    global.idleStatus = { isIdle: false, duration: 0 };
  }

  checkIdleStatus() {
    const now = Date.now();
    const timeSinceLastActivity = now - this.lastActivityTime;

    if (timeSinceLastActivity >= this.idleThresholdMs && !this.isIdle) {
      console.log('💤 User is idle');
      this.isIdle = true;
      this.idleStartTime = now;
      global.idleStatus = { isIdle: true, duration: timeSinceLastActivity };
    } else if (this.isIdle) {
      global.idleStatus = { isIdle: true, duration: timeSinceLastActivity };
    } else {
      global.idleStatus = { isIdle: false, duration: timeSinceLastActivity };
    }
  }

  getIdleStatus() {
    return global.idleStatus || { isIdle: false, duration: 0 };
  }
}

export default IdleTracker;
