import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const DATABASE_URI = process.env.DATABASE_URI;

if (!DATABASE_URI) {
  throw new Error('Please define the DATABASE_URI environment variable');
}

async function connectDB() {
  try {
    await mongoose.connect(DATABASE_URI as string,{connectTimeoutMS: 60000});
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

export default connectDB;