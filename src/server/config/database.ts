import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_MONGODB_URI = 'mongodb+srv://kumudevops_db_user:tncvBxik2FwUrgel@cluster0.tmtosz7.mongodb.net/premier_tours?retryWrites=true&w=majority&appName=Cluster0';

// Global cache for serverless environments
let cachedConnection: typeof mongoose | null = null;
let connectionPromise: Promise<typeof mongoose | null> | null = null;

export async function connectDatabase(): Promise<typeof mongoose | null> {
  // If already connected, reuse existing connection immediately
  if (mongoose.connection.readyState === 1) {
    cachedConnection = mongoose;
    return mongoose;
  }

  // If a connection attempt is currently in flight, await it
  if (connectionPromise && mongoose.connection.readyState === 2) {
    return connectionPromise;
  }

  let uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
  if (!uri || uri.includes('example.mongodb.net') || uri.includes('username:password@')) {
    uri = DEFAULT_MONGODB_URI;
  }

  connectionPromise = (async () => {
    try {
      mongoose.set('strictQuery', false);
      mongoose.set('bufferCommands', false); // Fail fast, don't hang requests
      
      console.log('[MongoDB] Connecting to MongoDB Atlas (premier_tours)...');
      
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      });

      console.log('✅ [MongoDB Atlas] Connected successfully to premier_tours database.');
      cachedConnection = mongoose;
      return mongoose;
    } catch (err: any) {
      console.error('❌ [MongoDB Atlas Connection Error]:', err.message);
      connectionPromise = null;
      return null;
    }
  })();

  return connectionPromise;
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

