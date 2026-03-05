import activeWin from 'active-win';

export default class ActiveWindowTracker {
  constructor() {
    this.activeWindow = 'Unknown';
  }

  async getActiveWindow() {
    try {
      const win = await activeWin.default();
      this.activeWindow = win ? win.title : 'Unknown';
      return this.activeWindow;
    } catch (err) {
      this.activeWindow = 'Unknown';
      return this.activeWindow;
    }
  }

  getLastActiveWindow() {
    return this.activeWindow;
  }
}
