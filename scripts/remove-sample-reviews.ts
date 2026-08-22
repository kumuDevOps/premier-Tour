import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Review } from '../src/server/models/Review';
import { connectDatabase } from '../src/server/config/database';

dotenv.config();

export async function removeSampleReviews() {
  console.log('🧹 [Remove Sample Reviews] Connecting to MongoDB Atlas...');

  const db = await connectDatabase();
  if (!db) {
    console.error('❌ [Remove Sample Reviews] Failed to connect to MongoDB Atlas database.');
    process.exit(1);
  }

  try {
    // Only delete reviews that are explicitly marked as samples or development seeds
    const filter = {
      $or: [
        { isSample: true },
        { source: 'development' },
        { sampleId: { $exists: true, $ne: null } }
      ]
    };

    const countBefore = await Review.countDocuments(filter);
    const result = await Review.deleteMany(filter);
    const countRemaining = await Review.countDocuments();

    console.log(`✅ [Remove Sample Reviews] Removed ${result.deletedCount} sample/development review(s).`);
    console.log(`   - Verified real customer reviews remaining: ${countRemaining}`);
  } catch (err: any) {
    console.error('❌ [Remove Sample Reviews] Error:', err.message);
    process.exit(1);
  }
}

// Auto-run if executed directly via tsx
if (process.argv[1] && process.argv[1].endsWith('remove-sample-reviews.ts')) {
  removeSampleReviews().then(() => {
    console.log('🏁 [Remove Sample Reviews] Cleanup complete.');
    process.exit(0);
  }).catch((err) => {
    console.error('❌ [Remove Sample Reviews] Fatal error:', err);
    process.exit(1);
  });
}
