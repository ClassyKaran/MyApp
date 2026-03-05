import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  hostname: { type: String, required: true, unique: true },
  name: { type: String },
  status: { type: String, enum: ['online', 'idle', 'offline'], default: 'offline' },
  lastActive: { type: Date },
});

export default mongoose.model('Employee', EmployeeSchema);
