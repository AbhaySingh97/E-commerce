import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cachedConnection = null;

export const connectDB = async () => {
  if (cachedConnection || mongoose.connection.readyState === 1) {
    return cachedConnection || mongoose.connection;
  }

  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    cachedConnection = await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
    return cachedConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cachedConnection = null;
    throw error;
  }
};

export default connectDB;
