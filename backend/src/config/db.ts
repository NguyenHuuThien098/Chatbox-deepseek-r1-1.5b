import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connect error:', err);
    process.exit(1); // Dừng server nếu kết nối thất bại
  }
};