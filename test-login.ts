import { api } from './src/services/api';

async function run() {
  const result = await api.auth.login('admin@theluxuryesp.com', 'Admin@2026');
  console.log('Login result:', result);
  process.exit(0);
}
run();
