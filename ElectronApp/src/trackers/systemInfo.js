import os from "os";

export const getHostname = () => os.hostname();

export const getSystemDetails = () => {
  const nets = os.networkInterfaces();

  let localIP = "localhost";
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        localIP = net.address;
        break;
      }
    }
  }

  const cpus = os.cpus();

  return {
    hostname: os.hostname(),
    osInfo: {
      platform: os.platform(),
      release: os.release(),
      arch: os.arch(),
    },
    totalRAM: os.totalmem(),
    freeRAM: os.freemem(),
    cpu: {
      model: cpus[0].model,
      cores: cpus.length,
      speed: cpus[0].speed,
    },
    uptime: os.uptime(),
    localIP,
  };
};