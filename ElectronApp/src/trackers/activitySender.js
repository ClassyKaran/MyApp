import { getHostname } from '../trackers/systemInfo.js';
import { postActivity } from '../services/apiService.js';
import { getActivityStats, resetActivityStats } from './activityTracker.js';
import { getIdleStatus } from './idleTracker.js';
import { getActiveWindow } from './activeWindowTracker.js';

let sendInterval = null;

export async function sendActivityData() {
  const hostname = getHostname();
  const stats = getActivityStats();
  const idleStatus = getIdleStatus();
  const activeWindow = await getActiveWindow();

  const payload = {
    hostname,
    keyboardCount: stats.keyboardCount,
    mouseCount: stats.mouseClickCount,
    activeWindow,
    timestamp: new Date().toISOString(),
    isIdle: idleStatus.isIdle,
  };

  try {
    await postActivity(payload);
    console.log(`📤 Activity sent: K=${stats.keyboardCount}, M=${stats.mouseClickCount}, Idle=${idleStatus.isIdle}`);
    
    resetActivityStats();
  } catch (err) {
    console.error('❌ Failed to send activity:', err.message);
  }
}

export function startActivitySender(interval = 5000) {
  sendInterval = setInterval(() => {
    sendActivityData();
  }, interval);
  
  console.log(`⏱️ Sending activity every ${interval / 1000} seconds`);
  sendActivityData();
}

export function stopActivitySender() {
  if (sendInterval) {
    clearInterval(sendInterval);
    sendInterval = null;
    console.log('⏱️ Activity sender stopped');
  }
}

export default {
  start: startActivitySender,
  stop: stopActivitySender,
  sendActivityData
};
