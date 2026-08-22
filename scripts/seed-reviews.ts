import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Review } from '../src/server/models/Review';
import { connectDatabase } from '../src/server/config/database';

dotenv.config();

export interface SampleReviewItem {
  sampleId: string;
  userName: string;
  userLocation: string;
  userAvatar: string;
  serviceType: 'tour' | 'hotel' | 'flight' | 'car' | 'general';
  serviceName: string;
  itemId: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  helpfulCount: number;
  reportedCount: number;
  verifiedPurchase: boolean;
  isDemo: boolean;
  isSample: boolean;
  source: string;
  categoryRatings: Record<string, number>;
  createdAt: Date;
}

export const SAMPLE_REVIEWS: SampleReviewItem[] = [
  {
    sampleId: 'sample-rev-1',
    userName: 'Alexander Wright',
    userLocation: 'London, United Kingdom',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    serviceType: 'tour',
    serviceName: 'The Royal Sigiriya & Cultural Triangle Expedition',
    itemId: 'royal-sigiriya-cultural-triangle',
    rating: 5,
    title: 'Unforgettable private ascent of Sigiriya at dawn',
    content: 'Our chauffeur-guide Samantha arranged a private early-morning ascent of Sigiriya before the gates opened to the public. Watching the sunrise over the central plains in absolute serenity was the crowning highlight of our Ceylon journey. Flawless hospitality and five-star pavilion retreats throughout.',
    images: [
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80',
      'https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&q=80'
    ],
    status: 'APPROVED' as const,
    helpfulCount: 28,
    reportedCount: 0,
    verifiedPurchase: true,
    isDemo: false,
    isSample: true,
    source: 'development',
    categoryRatings: { experience: 5, guide: 5, transportation: 5, itinerary: 5, value: 5 },
    createdAt: new Date('2026-02-12T08:30:00.000Z'),
  },
  {
    sampleId: 'sample-rev-2',
    userName: 'Elena Rostova',
    userLocation: 'Zurich, Switzerland',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    serviceType: 'tour',
    serviceName: 'Yala Leopard Safari & Southern Coast Hideaways',
    itemId: 'yala-leopard-safari-southern-coast',
    rating: 5,
    title: 'Spotted three leopards in Block 1 with our naturalist',
    content: 'Premier Tours provided an exclusive custom safari jeep with supreme suspension and an exceptional resident tracker. We encountered three leopards, a herd of elephants at dusk, and rare hornbills. The transition to our oceanfront villa in Galle Fort afterwards was pure bliss.',
    images: [
      'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&q=80'
    ],
    status: 'APPROVED' as const,
    helpfulCount: 34,
    reportedCount: 0,
    verifiedPurchase: true,
    isDemo: false,
    isSample: true,
    source: 'development',
    categoryRatings: { experience: 5, guide: 5, transportation: 5, itinerary: 5, value: 5 },
    createdAt: new Date('2026-02-08T14:15:00.000Z'),
  },
  {
    sampleId: 'sample-rev-3',
    userName: 'Marcus & Chloe Davies',
    userLocation: 'Melbourne, Australia',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    serviceType: 'tour',
    serviceName: 'Luxury Sri Lanka Honeymoon & Private Coastline',
    itemId: 'luxury-honeymoon-sri-lanka',
    rating: 5,
    title: 'The most magical honeymoon imaginable',
    content: 'From candlelit beach dinners in Tangalle to private seaplane transfers across the central highlands, every detail was orchestrated with utmost refinement. The VIP airport fast-track service in Colombo made arrival completely effortless.',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80'
    ],
    status: 'APPROVED' as const,
    helpfulCount: 41,
    reportedCount: 0,
    verifiedPurchase: true,
    isDemo: false,
    isSample: true,
    source: 'development',
    categoryRatings: { experience: 5, guide: 5, transportation: 5, itinerary: 5, value: 5 },
    createdAt: new Date('2026-02-01T17:45:00.000Z'),
  },
  {
    sampleId: 'sample-rev-4',
    userName: 'Hiroshi Tanaka',
    userLocation: 'Tokyo, Japan',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
    serviceType: 'tour',
    serviceName: 'Ceylon High Tea & Misty Mountain Sanctuaries',
    itemId: 'ceylon-high-tea-misty-mountains',
    rating: 5,
    title: 'Colonial elegance and pristine tea plantations',
    content: 'The private vintage observation carriage journey from Kandy to Nuwara Eliya through the misty mountains was spectacular. The tea masterclass at the restored planters bungalow gave deep appreciation to Ceylon tea craftsmanship.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'
    ],
    status: 'APPROVED' as const,
    helpfulCount: 19,
    reportedCount: 0,
    verifiedPurchase: true,
    isDemo: false,
    isSample: true,
    source: 'development',
    categoryRatings: { experience: 5, guide: 5, transportation: 5, itinerary: 5, value: 5 },
    createdAt: new Date('2026-01-26T10:00:00.000Z'),
  },
  {
    sampleId: 'sample-rev-5',
    userName: 'Claire Dupont',
    userLocation: 'Paris, France',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
    serviceType: 'tour',
    serviceName: 'Sri Lanka Cultural & Heritage Grand Tour',
    itemId: 'royal-sigiriya-cultural-triangle',
    rating: 5,
    title: 'Remarkable private access to historic temples',
    content: 'Visiting the Temple of the Sacred Tooth Relic in Kandy with an archaeologist guide gave us access and insights you simply cannot find on ordinary tours. The chauffeured Mercedes van was impeccably clean and comfortable.',
    images: [],
    status: 'APPROVED' as const,
    helpfulCount: 16,
    reportedCount: 0,
    verifiedPurchase: true,
    isDemo: false,
    isSample: true,
    source: 'development',
    categoryRatings: { experience: 5, guide: 5, transportation: 5, itinerary: 5, value: 5 },
    createdAt: new Date('2026-01-20T11:20:00.000Z'),
  },
  {
    sampleId: 'sample-rev-6',
    userName: 'David & Jennifer Miller',
    userLocation: 'San Francisco, USA',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&q=80',
    serviceType: 'tour',
    serviceName: 'Family Island Explorer & Elephant Sanctuary Experience',
    itemId: 'family-island-explorer',
    rating: 5,
    title: 'Flawless family journey with our two teenage children',
    content: 'Traveling with a family of four can be demanding, but our private concierge anticipated every need. The elephant gathering in Minneriya and private surf lessons in Weligama kept our teenagers completely captivated.',
    images: [
      'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&q=80'
    ],
    status: 'APPROVED' as const,
    helpfulCount: 22,
    reportedCount: 0,
    verifiedPurchase: true,
    isDemo: false,
    isSample: true,
    source: 'development',
    categoryRatings: { experience: 5, guide: 5, transportation: 5, itinerary: 5, value: 5 },
    createdAt: new Date('2026-01-15T09:00:00.000Z'),
  },
  {
    sampleId: 'sample-rev-7',
    userName: 'Oliver Becker',
    userLocation: 'Munich, Germany',
    userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80',
    serviceType: 'hotel',
    serviceName: 'The Galle Face Colonial Haven',
    itemId: 'galle-face-colonial-haven',
    rating: 5,
    title: 'Timeless grandeur on the Indian Ocean',
    content: 'Historic luxury done right. Sundowners on the checkered veranda watching the ocean waves, followed by extraordinary culinary curation. Premier Tours arranged a seamless private transfer right to the lobby.',
    images: [],
    status: 'APPROVED' as const,
    helpfulCount: 12,
    reportedCount: 0,
    verifiedPurchase: true,
    isDemo: false,
    isSample: true,
    source: 'development',
    categoryRatings: { cleanliness: 5, comfort: 5, location: 5, facilities: 5, staff: 5, value: 5 },
    createdAt: new Date('2026-01-10T16:00:00.000Z'),
  },
  {
    sampleId: 'sample-rev-8',
    userName: 'Nisha & Rahul Patel',
    userLocation: 'Singapore',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
    serviceType: 'tour',
    serviceName: 'The Royal Sigiriya & Cultural Triangle Expedition',
    itemId: 'royal-sigiriya-cultural-triangle',
    rating: 5,
    title: 'Impeccable service and luxurious mountain retreats',
    content: 'Every hotel stay was hand-picked and exquisite. The private cooking masterclass in a traditional spice garden was an absolute sensory delight. We will undoubtedly book our next trip with Premier Tours.',
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80'
    ],
    status: 'APPROVED' as const,
    helpfulCount: 25,
    reportedCount: 0,
    verifiedPurchase: true,
    isDemo: false,
    isSample: true,
    source: 'development',
    categoryRatings: { experience: 5, guide: 5, transportation: 5, itinerary: 5, value: 5 },
    createdAt: new Date('2026-01-05T13:20:00.000Z'),
  },
  {
    sampleId: 'sample-rev-9',
    userName: 'Liam O\'Connor',
    userLocation: 'Dublin, Ireland',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
    serviceType: 'car',
    serviceName: 'Mercedes-Benz V-Class Luxury Chauffeur',
    itemId: 'mercedes-benz-v-class',
    rating: 5,
    title: 'Exceptional chauffeur and absolute comfort',
    content: 'Our chauffeur was not just a courteous driver, but an extraordinary ambassador for Sri Lanka. The V-Class van was spacious, cool, and stocked with chilled towels and fresh Ceylon coconut water at every stop.',
    images: [],
    status: 'APPROVED' as const,
    helpfulCount: 17,
    reportedCount: 0,
    verifiedPurchase: true,
    isDemo: false,
    isSample: true,
    source: 'development',
    categoryRatings: { condition: 5, cleanliness: 5, driver: 5, comfort: 5, service: 5, value: 5 },
    createdAt: new Date('2025-12-29T10:45:00.000Z'),
  },
  {
    sampleId: 'sample-rev-10',
    userName: 'Camilla Lindqvist',
    userLocation: 'Stockholm, Sweden',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80',
    serviceType: 'tour',
    serviceName: 'Southern Coast Whale Watching & Galle Fort Retreat',
    itemId: 'yala-leopard-safari-southern-coast',
    rating: 4,
    title: 'Incredible blue whale encounter off Mirissa',
    content: 'Private chartered catamaran with marine biologist escort made whale watching respectful and intimate. We spotted two blue whales and a super-pod of spinner dolphins. Outstanding excursion.',
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80'
    ],
    status: 'APPROVED' as const,
    helpfulCount: 20,
    reportedCount: 0,
    verifiedPurchase: true,
    isDemo: false,
    isSample: true,
    source: 'development',
    categoryRatings: { experience: 4, guide: 5, transportation: 5, itinerary: 4, value: 4 },
    createdAt: new Date('2025-12-22T08:15:00.000Z'),
  },
  {
    sampleId: 'sample-rev-11',
    userName: 'Matteo Rossi',
    userLocation: 'Milan, Italy',
    userAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&q=80',
    serviceType: 'tour',
    serviceName: 'Ella Peaks, Nine Arches & Adventure Expedition',
    itemId: 'ceylon-high-tea-misty-mountains',
    rating: 5,
    title: 'Breathtaking Ella sunrise hike and Nine Arches Bridge',
    content: 'Climbing Little Adam\'s Peak at dawn with private picnic setup was pure perfection. The private observation timing for the blue train crossing Nine Arches Bridge allowed us to capture world-class photos without the crowds.',
    images: [
      'https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&q=80'
    ],
    status: 'APPROVED' as const,
    helpfulCount: 31,
    reportedCount: 0,
    verifiedPurchase: true,
    isDemo: false,
    isSample: true,
    source: 'development',
    categoryRatings: { experience: 5, guide: 5, transportation: 5, itinerary: 5, value: 5 },
    createdAt: new Date('2025-12-15T15:30:00.000Z'),
  },
  {
    sampleId: 'sample-rev-12',
    userName: 'Charlotte van Dijk',
    userLocation: 'Amsterdam, Netherlands',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80',
    serviceType: 'hotel',
    serviceName: 'Ceylon Heritage Tea Planters Bungalow',
    itemId: 'ceylon-heritage-tea-planters-bungalow',
    rating: 5,
    title: 'A sanctuary of peace in the hill country',
    content: 'Roaring log fires in the evening, bespoke high tea in the gardens, and private walking trails through emerald tea hills. The quintessential luxury Ceylon experience.',
    images: [],
    status: 'APPROVED' as const,
    helpfulCount: 15,
    reportedCount: 0,
    verifiedPurchase: true,
    isDemo: false,
    isSample: true,
    source: 'development',
    categoryRatings: { cleanliness: 5, comfort: 5, location: 5, facilities: 5, staff: 5, value: 5 },
    createdAt: new Date('2025-12-08T12:00:00.000Z'),
  }
];

export async function seedReviews() {
  console.log('🚀 [Seed Reviews] Starting MongoDB Review Seeder...');

  const db = await connectDatabase();
  if (!db) {
    console.error('❌ [Seed Reviews] Failed to connect to MongoDB Atlas database.');
    process.exit(1);
  }

  let insertedCount = 0;
  let updatedCount = 0;

  try {
    for (const revData of SAMPLE_REVIEWS) {
      const existing = await Review.findOne({ sampleId: revData.sampleId });

      if (!existing) {
        await Review.create({
          ...revData,
          isSample: true,
          source: 'development',
        });
        insertedCount++;
      } else {
        // Idempotent upsert - update fields without wiping
        await Review.updateOne(
          { sampleId: revData.sampleId },
          {
            $set: {
              userName: revData.userName,
              userLocation: revData.userLocation,
              userAvatar: revData.userAvatar,
              serviceType: revData.serviceType,
              serviceName: revData.serviceName,
              itemId: revData.itemId,
              rating: revData.rating,
              title: revData.title,
              content: revData.content,
              images: revData.images,
              status: revData.status,
              helpfulCount: revData.helpfulCount,
              verifiedPurchase: revData.verifiedPurchase,
              categoryRatings: revData.categoryRatings,
              isSample: true,
              source: 'development',
            },
          }
        );
        updatedCount++;
      }
    }

    const totalApproved = await Review.countDocuments({ status: 'APPROVED' });
    const totalSample = await Review.countDocuments({ isSample: true });
    const totalAll = await Review.countDocuments();

    console.log(`✅ [Seed Reviews] Success!`);
    console.log(`   - Inserted new sample reviews: ${insertedCount}`);
    console.log(`   - Updated existing sample reviews: ${updatedCount}`);
    console.log(`   - Total approved reviews in MongoDB: ${totalApproved}`);
    console.log(`   - Total sample reviews: ${totalSample}`);
    console.log(`   - Total all reviews: ${totalAll}`);
  } catch (err: any) {
    console.error('❌ [Seed Reviews] Error seeding reviews:', err.message);
    process.exit(1);
  }
}

// Auto-run if executed directly via tsx
if (process.argv[1] && process.argv[1].endsWith('seed-reviews.ts')) {
  seedReviews().then(() => {
    console.log('🏁 [Seed Reviews] Process finished.');
    process.exit(0);
  }).catch((err) => {
    console.error('❌ [Seed Reviews] Fatal error:', err);
    process.exit(1);
  });
}
