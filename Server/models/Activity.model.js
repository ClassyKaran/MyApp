import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  hostname: { type: String, required: true },
  keyboardCount: { type: Number, default: 0 },
  mouseCount: { type: Number, default: 0 },
  activeWindow: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Activity', ActivitySchema);
