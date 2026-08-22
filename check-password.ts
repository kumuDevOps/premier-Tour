import { connectDatabase } from './src/server/config/database';
import { User } from './src/server/models/User';
import bcrypt from 'bcryptjs';

async function run() {
  await connectDatabase();
  const user = await User.findOne({ email: 'admin@theluxuryesp.com' });
  if (!user) {
    console.log('User not found');
    process.exit(0);
  }
  const match = await bcrypt.compare('Admin@2026', user.passwordHash);
  console.log('Password Match for Admin@2026:', match);
  const match2 = await bcrypt.compare('password123', user.passwordHash);
  console.log('Password Match for password123:', match2);
  const match3 = await bcrypt.compare('admin', user.passwordHash);
  console.log('Password Match for admin:', match3);
  process.exit(0);
}
run();
