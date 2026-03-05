import { Tray, Menu, app } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tray;

export function createTray(mainWindow) {
  tray = new Tray(path.join(__dirname, '..', '..', 'Assets', 'icon.ico'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Dashboard',
      click: () => {
        if (mainWindow) mainWindow.show();
      },
    },
    {
      label: 'Monitoring Active',
      enabled: false,
    },
    {
      type: 'separator',
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('WorkTrackLite - Monitoring Active');
  tray.setContextMenu(contextMenu);
}
