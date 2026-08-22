import { connectDatabase } from '../src/server/config/database';
import { Tour } from '../src/server/models/Tour';
import { Hotel } from '../src/server/models/Hotel';
import { Car } from '../src/server/models/Car';
import { Flight } from '../src/server/models/Flight';
import { User } from '../src/server/models/User';

async function run() {
  await connectDatabase();
  console.log('--- DB Audit ---');
  const tCount = await Tour.countDocuments();
  const hCount = await Hotel.countDocuments();
  const cCount = await Car.countDocuments();
  const fCount = await Flight.countDocuments();
  console.log(`BEFORE: Tours: ${tCount}, Hotels: ${hCount}, Cars: ${cCount}, Flights: ${fCount}`);

  // 1. Admin Role
  const email = 'kumudevops@gmail.com';
  const user = await User.findOne({ email });
  if (user) {
    console.log(`User ${email} found with role: ${user.role}`);
    if (user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
      console.log(`Updated ${email} to admin role.`);
    } else {
      console.log(`${email} is already an admin.`);
    }
  } else {
    console.log(`User ${email} NOT found.`);
  }

  let addedTours = 0;
  let addedHotels = 0;
  let addedCars = 0;
  let addedFlights = 0;

  // 2. Insert 9 Tours
  const tours = [
    {
      title: 'Sigiriya & Cultural Triangle',
      slug: 'sigiriya-cultural-triangle-2026',
      description: 'Explore the ancient rock fortress of Sigiriya and the cultural wonders of Sri Lanka.',
      category: 'Cultural',
      durationDays: 4,
      duration: '4 Days',
      location: 'Sigiriya, Dambulla, Polonnaruwa',
      price: { amount: 450, currency: 'USD' },
      maxGroupSize: 10,
      imageUrls: ['https://images.unsplash.com/photo-1579541416480-e4b09ec4e3d1?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      title: 'Ella & Hill Country',
      slug: 'ella-hill-country-2026',
      description: 'Journey through the scenic hills, tea plantations, and waterfalls of Ella.',
      category: 'Nature',
      durationDays: 3,
      duration: '3 Days',
      location: 'Ella, Nuwara Eliya',
      price: { amount: 320, currency: 'USD' },
      maxGroupSize: 8,
      imageUrls: ['https://images.unsplash.com/photo-1588096344392-56c20539f1df?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      title: 'Kandy Heritage Journey',
      slug: 'kandy-heritage-journey-2026',
      description: 'Experience the spiritual heart of Sri Lanka and the sacred Temple of the Tooth.',
      category: 'Heritage',
      durationDays: 2,
      duration: '2 Days',
      location: 'Kandy',
      price: { amount: 200, currency: 'USD' },
      maxGroupSize: 12,
      imageUrls: ['https://images.unsplash.com/photo-1620021665476-80db266ab0e5?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      title: 'Galle & Southern Coast',
      slug: 'galle-southern-coast-2026',
      description: 'A coastal adventure combining Dutch colonial history with pristine beaches.',
      category: 'Coastal',
      durationDays: 3,
      duration: '3 Days',
      location: 'Galle, Unawatuna',
      price: { amount: 350, currency: 'USD' },
      maxGroupSize: 10,
      imageUrls: ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      title: 'Yala Wildlife Safari',
      slug: 'yala-wildlife-safari-2026',
      description: 'An exciting safari to spot leopards, elephants, and diverse wildlife in Yala.',
      category: 'Wildlife',
      durationDays: 2,
      duration: '2 Days',
      location: 'Yala National Park',
      price: { amount: 400, currency: 'USD' },
      maxGroupSize: 6,
      imageUrls: ['https://images.unsplash.com/photo-1549479361-bd80486eb72d?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      title: 'Nuwara Eliya Tea Country',
      slug: 'nuwara-eliya-tea-country-2026',
      description: 'Discover the "Little England" of Sri Lanka and its famous tea estates.',
      category: 'Nature',
      durationDays: 2,
      duration: '2 Days',
      location: 'Nuwara Eliya',
      price: { amount: 250, currency: 'USD' },
      maxGroupSize: 8,
      imageUrls: ['https://images.unsplash.com/photo-1625736300986-13ce32e0c242?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      title: 'Mirissa & South Coast',
      slug: 'mirissa-south-coast-2026',
      description: 'Whale watching and relaxing on the beautiful palm-fringed beaches of Mirissa.',
      category: 'Coastal',
      durationDays: 3,
      duration: '3 Days',
      location: 'Mirissa',
      price: { amount: 380, currency: 'USD' },
      maxGroupSize: 10,
      imageUrls: ['https://images.unsplash.com/photo-1538681105587-85640961bf8b?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      title: 'Jaffna Cultural Discovery',
      slug: 'jaffna-cultural-discovery-2026',
      description: 'Explore the vibrant culture, unique cuisine, and historical sites of the North.',
      category: 'Cultural',
      durationDays: 5,
      duration: '5 Days',
      location: 'Jaffna',
      price: { amount: 550, currency: 'USD' },
      maxGroupSize: 8,
      imageUrls: ['https://images.unsplash.com/photo-1606240096645-5d46815340eb?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      title: 'Bentota & Coastal Escape',
      slug: 'bentota-coastal-escape-2026',
      description: 'Water sports, river safaris, and luxurious beachside relaxation in Bentota.',
      category: 'Coastal',
      durationDays: 3,
      duration: '3 Days',
      location: 'Bentota',
      price: { amount: 300, currency: 'USD' },
      maxGroupSize: 12,
      imageUrls: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'],
    }
  ];

  for (const t of tours) {
    const existing = await Tour.findOne({ slug: t.slug });
    if (!existing) {
      await Tour.create(t);
      addedTours++;
    }
  }

  // 3. Insert 6 Hotels
  const hotels = [
    {
      name: 'Colombo Luxury Hotel',
      slug: 'colombo-luxury-hotel-2026',
      city: 'Colombo',
      location: 'Colombo',
      description: 'A 5-star oasis in the heart of the capital with ocean views.',
      pricePerNight: 200,
      currency: 'USD',
      imageUrls: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      name: 'Nuwara Eliya Luxury Retreat',
      slug: 'nuwara-eliya-luxury-retreat-2026',
      city: 'Nuwara Eliya',
      location: 'Nuwara Eliya',
      description: 'A colonial-style boutique hotel surrounded by lush tea gardens.',
      pricePerNight: 250,
      currency: 'USD',
      imageUrls: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      name: 'Kandy Heritage Hotel',
      slug: 'kandy-heritage-hotel-2026',
      city: 'Kandy',
      location: 'Kandy',
      description: 'Historic charm meets modern luxury near the Temple of the Tooth.',
      pricePerNight: 150,
      currency: 'USD',
      imageUrls: ['https://images.unsplash.com/photo-1542314831-c6a4d14db04a?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      name: 'Galle Coastal Luxury Hotel',
      slug: 'galle-coastal-luxury-hotel-2026',
      city: 'Galle',
      location: 'Galle',
      description: 'A serene beachfront resort located just outside the historic Galle Fort.',
      pricePerNight: 300,
      currency: 'USD',
      imageUrls: ['https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      name: 'Bentota Beach Resort',
      slug: 'bentota-beach-resort-2026',
      city: 'Bentota',
      location: 'Bentota',
      description: 'An idyllic retreat offering spa treatments and pristine private beaches.',
      pricePerNight: 280,
      currency: 'USD',
      imageUrls: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      name: 'Ella Mountain Retreat',
      slug: 'ella-mountain-retreat-2026',
      city: 'Ella',
      location: 'Ella',
      description: 'Breathtaking mountain views and luxurious comfort in Ella.',
      pricePerNight: 180,
      currency: 'USD',
      imageUrls: ['https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80'],
    }
  ];

  for (const h of hotels) {
    const existing = await Hotel.findOne({ slug: h.slug });
    if (!existing) {
      await Hotel.create(h);
      addedHotels++;
    }
  }

  // 4. Insert 6 Cars
  const cars = [
    {
      name: 'Toyota KDH',
      category: 'Van',
      pricePerDay: 50,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
      seats: 9,
      luggage: 5
    },
    {
      name: 'Toyota Hiace',
      category: 'Van',
      pricePerDay: 60,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=80',
      seats: 12,
      luggage: 6
    },
    {
      name: 'Luxury SUV',
      category: 'SUV',
      pricePerDay: 120,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1503376766468-b864fbce7382?auto=format&fit=crop&w=1200&q=80',
      seats: 5,
      luggage: 4
    },
    {
      name: 'Premium Sedan',
      category: 'Sedan',
      pricePerDay: 80,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
      seats: 4,
      luggage: 3
    },
    {
      name: 'Mini Bus',
      category: 'Bus',
      pricePerDay: 150,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
      seats: 20,
      luggage: 15
    },
    {
      name: 'Luxury Coach',
      category: 'Bus',
      pricePerDay: 250,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      seats: 40,
      luggage: 40
    }
  ];

  for (const c of cars) {
    const existing = await Car.findOne({ name: c.name });
    if (!existing) {
      await Car.create(c);
      addedCars++;
    }
  }

  // 5. Insert 6 Flights
  const flights = [
    {
      airline: 'Qatar Airways',
      flightNumber: 'QR 668',
      origin: 'Doha (DOH)',
      destination: 'Colombo (CMB)',
      price: 450,
      duration: '4h 30m',
      cabinClass: 'Economy',
      availableSeats: 25,
      currency: 'USD'
    },
    {
      airline: 'Emirates',
      flightNumber: 'EK 650',
      origin: 'Dubai (DXB)',
      destination: 'Colombo (CMB)',
      price: 520,
      duration: '4h 15m',
      cabinClass: 'Economy',
      availableSeats: 30,
      currency: 'USD'
    },
    {
      airline: 'Singapore Airlines',
      flightNumber: 'SQ 468',
      origin: 'Singapore (SIN)',
      destination: 'Colombo (CMB)',
      price: 600,
      duration: '4h 00m',
      cabinClass: 'Economy',
      availableSeats: 15,
      currency: 'USD'
    },
    {
      airline: 'Etihad Airways',
      flightNumber: 'EY 264',
      origin: 'Abu Dhabi (AUH)',
      destination: 'Colombo (CMB)',
      price: 480,
      duration: '4h 20m',
      cabinClass: 'Economy',
      availableSeats: 20,
      currency: 'USD'
    },
    {
      airline: 'SriLankan Airlines',
      flightNumber: 'UL 504',
      origin: 'Frankfurt (FRA)',
      destination: 'Colombo (CMB)',
      price: 850,
      duration: '10h 30m',
      cabinClass: 'Economy',
      availableSeats: 40,
      currency: 'USD'
    },
    {
      airline: 'Turkish Airlines',
      flightNumber: 'TK 730',
      origin: 'Istanbul (IST)',
      destination: 'Colombo (CMB)',
      price: 750,
      duration: '8h 45m',
      cabinClass: 'Economy',
      availableSeats: 35,
      currency: 'USD'
    }
  ];

  for (const f of flights) {
    const existing = await Flight.findOne({ airline: f.airline, flightNumber: f.flightNumber });
    if (!existing) {
      await Flight.create(f);
      addedFlights++;
    }
  }

  console.log('--- DB Update Complete ---');
  const tCount2 = await Tour.countDocuments();
  const hCount2 = await Hotel.countDocuments();
  const cCount2 = await Car.countDocuments();
  const fCount2 = await Flight.countDocuments();
  console.log(`AFTER: Tours: ${tCount2}, Hotels: ${hCount2}, Cars: ${cCount2}, Flights: ${fCount2}`);
  console.log(`NEW RECORDS ADDED: Tours: ${addedTours}, Hotels: ${addedHotels}, Cars: ${addedCars}, Flights: ${addedFlights}`);

  process.exit(0);
}
run();
