// utils/workCalculator.js

const OFFICE_START_HOUR = 10;
const OFFICE_START_MINUTE = 30;
const OFFICE_END_HOUR = 18;
const OFFICE_END_MINUTE = 30;

const HALF_DAY_ACTIVE_HOURS = 4; // <4h active => half day

function msToTime(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  return `${hours}h ${minutes}m`;
}

export function calculateDailySummary(activities) {
  if (!activities || activities.length === 0) return null;

  // Sort by time
  activities.sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const firstActivity = new Date(activities[0].timestamp);
  const lastActivity = new Date(
    activities[activities.length - 1].timestamp
  );

  // Office time boundaries
  const officeStart = new Date(firstActivity);
  officeStart.setHours(OFFICE_START_HOUR, OFFICE_START_MINUTE, 0, 0);

  const officeEnd = new Date(firstActivity);
  officeEnd.setHours(OFFICE_END_HOUR, OFFICE_END_MINUTE, 0, 0);

  // Filter logs within office hours
  const filtered = activities.filter((a) => {
    const t = new Date(a.timestamp);
    return t >= officeStart && t <= officeEnd;
  });

  if (filtered.length === 0) return null;

  const loginTime = new Date(filtered[0].timestamp);
  const logoutTime = new Date(
    filtered[filtered.length - 1].timestamp
  );

  const onlineTimeMs = logoutTime - loginTime;

  // Aggregate keyboard & mouse
  let totalKeyboard = 0;
  let totalMouse = 0;
  let idleTimeMs = 0;

  for (let i = 0; i < filtered.length; i++) {
    totalKeyboard += filtered[i].keyboardCount || 0;
    totalMouse += filtered[i].mouseCount || 0;

    if (i > 0) {
      const prev = filtered[i - 1];
      const curr = filtered[i];

      const prevTime = new Date(prev.timestamp);
      const currTime = new Date(curr.timestamp);
      const diff = currTime - prevTime;

      if (prev.status === "idle") {
        idleTimeMs += diff;
      }
    }
  }

  const activeTimeMs = onlineTimeMs - idleTimeMs;

  // Late Login Detection
  const late =
    loginTime.getHours() > OFFICE_START_HOUR ||
    (loginTime.getHours() === OFFICE_START_HOUR &&
      loginTime.getMinutes() > OFFICE_START_MINUTE);

  // Half-Day Logic
  const activeHours = activeTimeMs / (1000 * 60 * 60);
  const halfDay = activeHours < HALF_DAY_ACTIVE_HOURS;

  return {
    totalKeyboard,
    totalMouse,
    entryCount: filtered.length,

    loginTime,
    logoutTime,

    onlineTime: msToTime(onlineTimeMs),
    idleTime: msToTime(idleTimeMs),
    activeTime: msToTime(activeTimeMs),

    late,
    halfDay,
  };
}