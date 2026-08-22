import { connectDatabase } from './src/server/config/database';
import { User } from './src/server/models/User';

async function run() {
  await connectDatabase();
  const users = await User.find({}, { email: 1, role: 1, passwordHash: 1 });
  console.log('Users in DB:');
  users.forEach(u => console.log(`- ${u.email} (Role: ${u.role}, HasHash: ${!!u.passwordHash})`));
  process.exit(0);
}
run();
