const fs = require('fs');
const file = 'src/context/AuthContext.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
`  const login = async (email: string, pass: string) => {
    try {
      const res = await api.auth.login(email, pass);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || 'Login failed' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };`,
`  const login = async (email: string, pass: string) => {
    try {
      console.log('Login attempt:', email);
      const res = await api.auth.login(email, pass);
      console.log('Login API response:', res);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true, user: res.user, role: res.user.role };
      }
      return { success: false, error: res.error || 'Login failed: Server did not return user details.' };
    } catch (e: any) {
      console.error('Login error:', e);
      return { success: false, error: e.message || 'Login encountered an unexpected error.' };
    }
  };`
);
fs.writeFileSync(file, content);
console.log('Patched login');
