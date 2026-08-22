import { connectDatabase } from '../config/database';
import { Tour } from '../models/Tour';
import { Hotel } from '../models/Hotel';
import { Car } from '../models/Car';
import { Flight } from '../models/Flight';
import { BlogPost } from '../models/BlogPost';
import { User } from '../models/User';
import { Review } from '../models/Review';
import { SAMPLE_REVIEWS } from '../../../scripts/seed-reviews';
import bcrypt from 'bcryptjs';


export async function seedDatabaseIfEmpty() {
  try {
    const db = await connectDatabase();
    if (!db) {
      console.log('[Seed] Database not connected, skipping seed.');
      return;
    }

    // 1. Admin user check
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('Admin@2026', salt);
      await User.create({
        email: 'admin@theluxuryesp.com',
        passwordHash,
        fullName: 'Premier Ceylon Administrator',
        role: 'admin',
        isActive: true,
      });
      console.log('✅ [Seed] Default administrator account provisioned.');
    }

    // 2. Tours check
    const tourCount = await Tour.countDocuments();
    if (tourCount === 0) {
      await Tour.create([
        {
          title: 'The Royal Sigiriya & Cultural Triangle Expedition',
          slug: 'royal-sigiriya-cultural-triangle',
          description: 'Immerse in ancient kingdoms, private UNESCO World Heritage access with senior archaeologists, and secluded boutique pavilion stays.',
          category: 'Luxury Cultural',
          durationDays: 7,
          duration: '7 Days / 6 Nights',
          location: 'Cultural Triangle, Sri Lanka',
          locations: ['Colombo', 'Dambulla', 'Sigiriya', 'Polonnaruwa', 'Kandy'],
          price: { amount: 1450, currency: 'USD' },
          maxGroupSize: 8,
          imageUrls: ['/assets/fallback/default-travel.webp'],
          includedServices: ['Private chauffeur & luxury vehicle', 'All 5-star pavilion stays', 'VIP UNESCO entrance escorts', 'Daily gourmet breakfast & dinner'],
          excludedServices: ['International airfare', 'Personal gratuities'],
          rating: 5.0,
          reviewCount: 18,
          isFeatured: true,
          isPublished: true,
        },
        {
          title: 'Ceylon High Tea & Misty Mountain Sanctuaries',
          slug: 'ceylon-high-tea-misty-mountains',
          description: 'Traverse colonial tea estates in Nuwara Eliya and Ella aboard private vintage observation carriages with Ceylon tea masterclasses.',
          category: 'Hill Country Heritage',
          durationDays: 5,
          duration: '5 Days / 4 Nights',
          location: 'Nuwara Eliya & Ella, Sri Lanka',
          locations: ['Kandy', 'Nuwara Eliya', 'Ella'],
          price: { amount: 1120, currency: 'USD' },
          maxGroupSize: 10,
          imageUrls: ['/assets/fallback/default-travel.webp'],
          includedServices: ['Colonial bungalow suites', 'Private tea tasting masterclass', 'First-class mountain railway booking', 'Chauffeured luxury SUV'],
          excludedServices: ['Alcoholic cellar pairings', 'Travel insurance'],
          rating: 4.9,
          reviewCount: 14,
          isFeatured: true,
          isPublished: true,
        },
        {
          title: 'Yala Leopard Safari & Southern Coast Hideaways',
          slug: 'yala-leopard-safari-southern-coast',
          description: 'Track apex Sri Lankan leopards with seasoned resident naturalists, followed by private oceanfront villa relaxation in historic Galle Fort.',
          category: 'Wildlife & Oceanfront',
          durationDays: 8,
          duration: '8 Days / 7 Nights',
          location: 'Yala & Galle, Sri Lanka',
          locations: ['Yala National Park', 'Mirissa', 'Galle Fort'],
          price: { amount: 1850, currency: 'USD' },
          maxGroupSize: 6,
          imageUrls: ['/assets/fallback/default-travel.webp'],
          includedServices: ['Bespoke luxury tented safari camp', 'Private 4x4 open safari jeeps', 'Marine biologist whale watching escort', 'Oceanfront luxury villa'],
          excludedServices: ['Personal expenditures', 'Gratuities'],
          rating: 5.0,
          reviewCount: 22,
          isFeatured: true,
          isPublished: true,
        },
      ]);
      console.log('✅ [Seed] Initial Luxury Tours seeded.');
    }

    // 3. Hotels check
    const hotelCount = await Hotel.countDocuments();
    if (hotelCount === 0) {
      await Hotel.create([
        {
          name: 'The Galle Face Colonial Haven',
          slug: 'galle-face-colonial-haven',
          city: 'Colombo',
          location: 'Colombo Seaside Promenade',
          description: 'A timeless oceanfront grand dame boasting Victorian architecture, private saltwater pool, and storied Ceylon hospitality.',
          pricePerNight: 280,
          currency: 'USD',
          rating: 5.0,
          reviewCount: 32,
          imageUrls: ['/assets/fallback/default-travel.webp'],
          amenities: ['Oceanfront Infinity Pool', 'Bespoke Spa', 'Fine Dining Conservatory', 'Private Airport Chauffeur'],
          isPublished: true,
        },
        {
          name: 'Ceylon Heritage Tea Planters Bungalow',
          slug: 'ceylon-heritage-tea-planters-bungalow',
          city: 'Nuwara Eliya',
          location: 'Nuwara Eliya Hill Country',
          description: 'Restored colonial tea estate residence nestled amidst emerald plantation valleys with private fireplace suites and butler service.',
          pricePerNight: 390,
          currency: 'USD',
          rating: 4.9,
          reviewCount: 26,
          imageUrls: ['/assets/fallback/default-travel.webp'],
          amenities: ['Personal Butler Service', 'Private Fireplace Lounge', 'Organic Tea Garden Dining', 'Croquet Lawn'],
          isPublished: true,
        },
      ]);
      console.log('✅ [Seed] Initial Luxury Hotels seeded.');
    }

    // 4. Cars check
    const carCount = await Car.countDocuments();
    if (carCount === 0) {
      await Car.create([
        {
          name: 'Mercedes-Benz V-Class Luxury Chauffeur',
          category: 'VIP Chauffeur Van',
          pricePerDay: 160,
          currency: 'USD',
          seats: 6,
          luggage: 6,
          transmission: 'Automatic',
          fuelType: 'Diesel',
          rating: 5.0,
          imageUrl: '/assets/fallback/default-travel.webp',
          description: 'First-class luxury executive carriage with ergonomic leather recliner seats, climate zoning, and certified chauffeur.',
          features: ['English-speaking Chauffeur', 'Complimentary Ceylon Mineral Water & Wi-Fi', 'Full Insurance Coverage'],
          status: 'ACTIVE',
          available: true,
        },
        {
          name: 'Toyota Land Cruiser Prado 4x4',
          category: 'Luxury Expedition SUV',
          pricePerDay: 135,
          currency: 'USD',
          seats: 5,
          luggage: 4,
          transmission: 'Automatic',
          fuelType: 'Hybrid',
          rating: 4.9,
          imageUrl: '/assets/fallback/default-travel.webp',
          description: 'Commanding luxury 4WD SUV ideal for navigating both the central mountain slopes and southern highways in supreme comfort.',
          features: ['All-Terrain Dynamic Suspension', 'Leather Interior', 'Panoramic Sunroof'],
          status: 'ACTIVE',
          available: true,
        },
      ]);
      console.log('✅ [Seed] Initial Vehicles seeded.');
    }

    // 5. Flights check
    const flightCount = await Flight.countDocuments();
    if (flightCount === 0) {
      await Flight.create([
        {
          airline: 'SriLankan Airlines (UL-101)',
          flightNumber: 'UL-101',
          origin: 'Colombo (CMB)',
          destination: 'Male, Maldives (MLE)',
          price: 240,
          currency: 'USD',
          cabinClass: 'Business',
          aircraft: 'Airbus A330-300',
          duration: '1h 25m',
          availableSeats: 8,
          isActive: true,
        },
        {
          airline: 'Emirates (EK-651)',
          flightNumber: 'EK-651',
          origin: 'Colombo (CMB)',
          destination: 'Dubai (DXB)',
          price: 490,
          currency: 'USD',
          cabinClass: 'Business',
          aircraft: 'Boeing 777-300ER',
          duration: '4h 30m',
          availableSeats: 12,
          isActive: true,
        },
      ]);
      console.log('✅ [Seed] Initial Flights seeded.');
    }

    // 6. Blog Posts check
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0) {
      await BlogPost.create([
        {
          title: 'The Ultimate Guide to Ceylon Cultural Triangle: Beyond the Guidebooks',
          slug: 'ultimate-guide-ceylon-cultural-triangle',
          excerpt: 'Discover secret archaeological vantage points, dawn ascents of Sigiriya, and secluded cave temples away from mainstream crowds.',
          content: 'Sri Lanka’s Cultural Triangle is a treasure trove of ancient civilization, spiritual monuments, and engineering marvels. From the iconic fifth-century rock fortress of Sigiriya to the sprawling monastic cities of Anuradhapura and Polonnaruwa, the history of ancient Ceylon is both vast and intimate...',
          coverImage: '/assets/heroes/blog-banner.webp',
          author: {
            name: 'Archaeological Advisory Board',
            role: 'Senior Heritage Specialist',
          },
          category: 'Cultural Heritage',
          tags: ['Sigiriya', 'Cultural Triangle', 'UNESCO', 'Ceylon'],
          readTime: '6 min read',
          isPublished: true,
          isFeatured: true,
        },
      ]);
      console.log('✅ [Seed] Initial Blog Posts seeded.');
    }

    // 7. Reviews check
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      for (const rev of SAMPLE_REVIEWS) {
        await Review.create({
          ...rev,
          isSample: true,
          source: 'development',
        } as any);
      }
      console.log(`✅ [Seed] Initial Reviews (${SAMPLE_REVIEWS.length} sample items) seeded.`);
    }
  } catch (err: any) {

    console.error('❌ [Seed Error]:', err.message);
  }
}
