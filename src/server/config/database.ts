import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_MONGODB_URI = 'mongodb+srv://kumudevops_db_user:tncvBxik2FwUrgel@cluster0.tmtosz7.mongodb.net/premier_tours?retryWrites=true&w=majority&appName=Cluster0';

export async function connectDatabase(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

  if (!uri) {
    console.warn('[MongoDB Warning] MONGODB_URI is not defined. Running in mock/offline mode.');
    return null;
  }

  try {
    // If already connected, reuse connection
    if (mongoose.connection.readyState === 1) {
      return mongoose;
    }

    mongoose.set('strictQuery', false);
    
    console.log('[MongoDB] Connecting to MongoDB Atlas (premier_tours)...');
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    console.log('✅ [MongoDB Atlas] Connected successfully to premier_tours database.');
    return mongoose;
  } catch (err: any) {
    console.error('❌ [MongoDB Atlas Connection Error]:', err.message);
    return null;
  }
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
