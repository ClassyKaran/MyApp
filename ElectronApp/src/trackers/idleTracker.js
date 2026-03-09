let idleStartTime = null;
let isIdle = false;
const idleThresholdMs = 5 * 60 * 1000;
const checkInterval = 5000;
let lastActivityTime = Date.now();
let checkIntervalId = null;

function checkIdleStatus() {
  const now = Date.now();
  const timeSinceLastActivity = now - lastActivityTime;

  if (timeSinceLastActivity >= idleThresholdMs && !isIdle) {
    console.log('💤 User is idle');
    isIdle = true;
    idleStartTime = now;
    global.idleStatus = { isIdle: true, duration: timeSinceLastActivity };
  } else if (isIdle) {
    global.idleStatus = { isIdle: true, duration: timeSinceLastActivity };
  } else {
    global.idleStatus = { isIdle: false, duration: timeSinceLastActivity };
  }
}

export function startIdleTracker() {
  if (checkIntervalId) return;
  
  checkIntervalId = setInterval(() => {
    checkIdleStatus();
  }, checkInterval);
}

export function stopIdleTracker() {
  if (checkIntervalId) {
    clearInterval(checkIntervalId);
    checkIntervalId = null;
    console.log('⏹️ Idle tracker stopped');
  }
}

export function recordActivity() {
  lastActivityTime = Date.now();
  if (isIdle) {
    console.log('✅ User resumed activity');
    isIdle = false;
    idleStartTime = null;
  }
  global.idleStatus = { isIdle: false, duration: 0 };
}

export function getIdleStatus() {
  return global.idleStatus || { isIdle: false, duration: 0 };
}

startIdleTracker();

export default {
  start: startIdleTracker,
  stop: stopIdleTracker,
  recordActivity,
  getIdleStatus
};
