import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    console.log("Attempting to connect to:", uri);
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    console.error(`🚨 MongoDB Connection Error Details 🚨`);
    // This logs the complete error stack trace to terminal:
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
