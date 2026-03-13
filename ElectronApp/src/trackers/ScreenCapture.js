import { desktopCapturer } from 'electron'
import io from 'socket.io-client'
import { getHostname } from './systemInfo.js'

const SOCKET_URL = (process.env.BACKEND_URL || 'http://localhost:5000')
const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
})
const currentHostname = getHostname()

let isCapturing = false
let currentTargetHostname = null

socket.on('connect', () => {
  console.log('ScreenCapture socket connected:', socket.id)
})

socket.on('request-screen-capture', (data) => {
  console.log('Screen capture requested for:', data.hostname, 'current:', currentHostname)
  if (!data.hostname || data.hostname === currentHostname) {
    startCapturing(currentHostname)
  }
})

socket.on('stop-screen-capture', () => {
  console.log('Stopping screen capture')
  stopCapturing()
})

async function captureScreen(targetHostname = null) {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 1280, height: 720 }
    });

    if (!sources || sources.length === 0) {
      console.warn('ScreenCapture: no sources returned by desktopCapturer');
      return;
    }

    const screen = sources[0].thumbnail.toDataURL();

    const hostnameToUse = targetHostname || currentTargetHostname || currentHostname;
    const payload = {
      imageUrl: screen,
      hostname: hostnameToUse,
      timestamp: new Date().toISOString(),
    };

    socket.emit('screen-data', {
      image: screen,
      hostname: currentHostname,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Screen capture error:', error)
  }
}

function startCapturing(targetHostname) {
  if (targetHostname && targetHostname !== currentHostname) {
    console.log('Screen capture request ignored - hostname mismatch:', targetHostname, '!==', currentHostname)
    return
  }
  
  if (isCapturing && currentTargetHostname === targetHostname) {
    return
  }
  
  isCapturing = true
  currentTargetHostname = targetHostname || currentHostname
  
  captureScreen(targetHostname)
  
  const captureInterval = setInterval(() => {
    if (isCapturing && currentTargetHostname === (targetHostname || currentHostname)) {
      captureScreen(targetHostname)
    } else {
      clearInterval(captureInterval)
    }
  }, 1000)
}

function stopCapturing() {
  isCapturing = false
  currentTargetHostname = null
}
