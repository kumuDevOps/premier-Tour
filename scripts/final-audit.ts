import { connectDatabase } from '../src/server/config/database';
import { Tour } from '../src/server/models/Tour';
import { Hotel } from '../src/server/models/Hotel';
import { Car } from '../src/server/models/Car';
import { Flight } from '../src/server/models/Flight';

async function run() {
  await connectDatabase();
  console.log('--- FINAL DB Audit ---');
  const tCount = await Tour.countDocuments();
  const hCount = await Hotel.countDocuments();
  const cCount = await Car.countDocuments();
  const fCount = await Flight.countDocuments();
  console.log(`CURRENT DB COUNTS: Tours: ${tCount}, Hotels: ${hCount}, Cars: ${cCount}, Flights: ${fCount}`);
  process.exit(0);
}
run();
