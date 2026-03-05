import screenshot from 'screenshot-desktop';
import sharp from 'sharp';
import SystemInfo from '../services/systemInfo.js';
import APIService from '../services/apiService.js';

export default class ScreenshotTracker {
  constructor(interval = 10*60*1000) {
    this.interval = interval;
    this.screenshotInterval = null;
  }

  async captureAndSendScreenshot() {
    try {
      console.log('📸 Starting screenshot capture...');
      const imgBuffer = await screenshot({ format: 'png' });
      console.log('📸 Screenshot buffer size:', imgBuffer.length, 'bytes');
      
      const compressedBuffer = await sharp(imgBuffer)
        .resize(1280, 720, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 70 })
        .toBuffer();
      
      console.log('📸 Compressed buffer size:', compressedBuffer.length, 'bytes');
      
      const base64Image = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
      console.log('📸 Base64 length:', base64Image.length);
      
      const payload = {
        hostname: SystemInfo.getHostname(),
        imageUrl: base64Image,
        timestamp: new Date().toISOString()
      };
      
      console.log('📸 Sending screenshot to backend...');
      await APIService.postScreenshot(payload);
      console.log('📸 Screenshot captured and sent successfully');
    } catch (err) {
      console.error('❌ Failed to capture screenshot:', err.message);
      if (err.response) {
        console.error('Response:', err.response.data);
      }
    }
  }

  start() {
    this.screenshotInterval = setInterval(() => {
      this.captureAndSendScreenshot();
    }, this.interval);
    
    console.log(`📸 Screenshot tracker started (interval: ${this.interval}ms)`);
    this.captureAndSendScreenshot();
  }

  stop() {
    if (this.screenshotInterval) {
      clearInterval(this.screenshotInterval);
      this.screenshotInterval = null;
      console.log('📸 Screenshot tracker stopped');
    }
  }
}
