import { connectDatabase } from './src/server/config/database';
import { User } from './src/server/models/User';
import bcrypt from 'bcryptjs';

async function run() {
  await connectDatabase();
  const email = 'admin@theluxuryesp.com';
  const password = 'Admin@2026';
  
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  
  if (!user) {
    console.log('User not found!');
    process.exit(1);
  }
  
  console.log('User found:', user.email);
  
  if (user.passwordHash) {
    const match = await bcrypt.compare(password, user.passwordHash);
    console.log('Password match:', match);
  } else {
    console.log('No password hash');
  }
  process.exit(0);
}
run();
