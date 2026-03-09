import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['full_day', 'half_day', 'absent', 'non_working'],
    default: 'absent'
  },
  loginTime: { type: Date },
  logoutTime: { type: Date },
  activeTime: { type: String },
  idleTime: { type: String },
  onlineTime: { type: String },
  late: { type: Boolean, default: false },
  halfDay: { type: Boolean, default: false },
  totalKeyboard: { type: Number, default: 0 },
  totalMouse: { type: Number, default: 0 },
}, { timestamps: true });

AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', AttendanceSchema);
