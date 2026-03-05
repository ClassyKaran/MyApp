import { contextBridge } from 'electron';
import SystemInfo from './src/services/systemInfo.js';

contextBridge.exposeInMainWorld('api', {
  getSystemInfo: () => SystemInfo.getSystemDetails(),
});
