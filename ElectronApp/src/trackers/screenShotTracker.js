import screenshot from "screenshot-desktop";
import sharp from "sharp";
import { getHostname } from "./systemInfo.js";
import { postScreenshot } from "../services/apiService.js";

let screenshotInterval = null;

export async function captureAndSendScreenshot() {
  try {
    const imgBuffer = await screenshot({ format: "png" });
    const compressedBuffer = await sharp(imgBuffer)
      .resize(1280, 720, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toBuffer();

    const base64Image = `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`;

    const payload = {
      hostname: getHostname(),
      imageUrl: base64Image,
      timestamp: new Date().toISOString(),
    };
    await postScreenshot(payload);
    console.log("📸 Screenshot captured and sent successfully");
  } catch (err) {
    console.error("❌ Failed to capture screenshot:", err.message);
    if (err.response) {
      console.error("Response:", err.response.data);
    }
  }
}

export function startScreenshotTracker(interval = 10 * 60 * 1000) {
  screenshotInterval = setInterval(() => {
    captureAndSendScreenshot();
  }, interval);

  console.log(`📸 Screenshot tracker started (interval: ${interval}ms)`);
  captureAndSendScreenshot();
}

export function stopScreenshotTracker() {
  if (screenshotInterval) {
    clearInterval(screenshotInterval);
    screenshotInterval = null;
    console.log("📸 Screenshot tracker stopped");
  }
}

export default {
  start: startScreenshotTracker,
  stop: stopScreenshotTracker,
  captureAndSendScreenshot,
};
