import activeWin from 'active-win';

let activeWindow = 'Unknown';

export async function getActiveWindow() {
  try {
    const win = await activeWin.default();
    activeWindow = win ? win.title : 'Unknown';
    return activeWindow;
  } catch (err) {
    activeWindow = 'Unknown';
    return activeWindow;
  }
}

export function getLastActiveWindow() {
  return activeWindow;
}

export default {
  getActiveWindow,
  getLastActiveWindow
};
