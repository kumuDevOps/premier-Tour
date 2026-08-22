import { connectDatabase } from './src/server/config/database';
import { User } from './src/server/models/User';

async function run() {
  await connectDatabase();
  const users = await User.find({ email: 'admin@theluxuryesp.com' });
  console.log(`Found ${users.length} users for admin@theluxuryesp.com:`);
  users.forEach((u, i) => console.log(`[${i}] ID: ${u._id}, Hash: ${u.passwordHash.substring(0, 10)}...`));
  process.exit(0);
}
run();
