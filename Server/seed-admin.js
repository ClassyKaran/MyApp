import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  name: { type: String, default: 'Admin' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      console.log('Admin already exists. Updating password instead...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);
      await Admin.updateOne({}, { password: hashedPassword });
      console.log('Admin password updated');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);
      const admin = new Admin({
        email: 'admin@kavyashift.com',
        password: hashedPassword,
        name: 'Admin',
      });
      await admin.save();
      console.log('Admin created successfully');
    }

    console.log('\nLogin credentials:');
    console.log('Email: admin@kavyashift.com');
    console.log('Password: Admin@123');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();