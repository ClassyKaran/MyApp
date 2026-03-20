import mongoose from 'mongoose';

const ScreenshotSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  hostname: { type: String, required: true, index: true },
  imageUrl: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
});

ScreenshotSchema.index({ hostname: 1, timestamp: -1 });

export default mongoose.model('Screenshot', ScreenshotSchema);
