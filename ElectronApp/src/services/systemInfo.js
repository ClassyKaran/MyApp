import os from 'os';

class SystemInfo {
  static getHostname() {
    return os.hostname();
  }

  static getOSInfo() {
    return {
      platform: os.platform(),
      release: os.release(),
      arch: os.arch(),
    };
  }

  static getTotalRAM() {
    return os.totalmem();
  }

  static getUptimeSeconds() {
    return os.uptime();
  }

  static getLocalIP() {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
    return 'localhost';
  }

  static getSystemDetails() {
    return {
      hostname: this.getHostname(),
      osInfo: this.getOSInfo(),
      totalRAM: this.getTotalRAM(),
      uptime: this.getUptimeSeconds(),
      localIP: this.getLocalIP(),
    };
  }
}

export default SystemInfo;
