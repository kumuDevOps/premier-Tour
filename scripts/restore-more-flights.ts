import { connectDatabase } from '../src/server/config/database';
import { Flight } from '../src/server/models/Flight';

async function run() {
  await connectDatabase();
  console.log('--- DB Audit Flights ---');
  
  let addedFlights = 0;
  let target = 3;

  const flights = [
    {
      airline: 'Air Arabia',
      flightNumber: 'G9 501',
      origin: 'Sharjah (SHJ)',
      destination: 'Colombo (CMB)',
      price: 350,
      duration: '4h 10m',
      cabinClass: 'Economy',
      availableSeats: 30,
      currency: 'USD'
    },
    {
      airline: 'Malaysia Airlines',
      flightNumber: 'MH 179',
      origin: 'Kuala Lumpur (KUL)',
      destination: 'Colombo (CMB)',
      price: 420,
      duration: '3h 30m',
      cabinClass: 'Economy',
      availableSeats: 40,
      currency: 'USD'
    },
    {
      airline: 'Cathay Pacific',
      flightNumber: 'CX 611',
      origin: 'Hong Kong (HKG)',
      destination: 'Colombo (CMB)',
      price: 750,
      duration: '5h 45m',
      cabinClass: 'Economy',
      availableSeats: 20,
      currency: 'USD'
    },
    {
      airline: 'Oman Air',
      flightNumber: 'WY 371',
      origin: 'Muscat (MCT)',
      destination: 'Colombo (CMB)',
      price: 410,
      duration: '4h 05m',
      cabinClass: 'Economy',
      availableSeats: 25,
      currency: 'USD'
    },
    {
      airline: 'Gulf Air',
      flightNumber: 'GF 144',
      origin: 'Bahrain (BAH)',
      destination: 'Colombo (CMB)',
      price: 460,
      duration: '4h 40m',
      cabinClass: 'Economy',
      availableSeats: 22,
      currency: 'USD'
    },
    {
      airline: 'Saudia',
      flightNumber: 'SV 786',
      origin: 'Riyadh (RUH)',
      destination: 'Colombo (CMB)',
      price: 490,
      duration: '5h 15m',
      cabinClass: 'Economy',
      availableSeats: 35,
      currency: 'USD'
    }
  ];

  for (const f of flights) {
    if (addedFlights >= target) break;
    const existing = await Flight.findOne({ airline: f.airline, flightNumber: f.flightNumber });
    if (!existing) {
      await Flight.create(f);
      addedFlights++;
    }
  }

  console.log(`NEW RECORDS ADDED: Flights: ${addedFlights}`);
  process.exit(0);
}
run();
