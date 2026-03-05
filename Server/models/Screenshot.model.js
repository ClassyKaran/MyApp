import mongoose from 'mongoose';

const ScreenshotSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  hostname: { type: String, required: true },
  imageUrl: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Screenshot', ScreenshotSchema);
