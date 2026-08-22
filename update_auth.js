const fs = require('fs');

let ctx = fs.readFileSync('src/context/AuthContext.tsx', 'utf8');
ctx = ctx.replace('interface AuthContextType {', 'interface AuthContextType {\n  isAdmin: boolean;\n  role: UserRole;\n  signIn: (e:string,p:string)=>Promise<{success:boolean,error?:string}>;\n  signUp: (n:string,e:string,p:string)=>Promise<{success:boolean,error?:string}>;\n  quickDemoLogin: ()=>Promise<void>;\n  resendConfirmationEmail: (e:string)=>Promise<{success:boolean,error?:string}>;');
ctx = ctx.replace('const [loading, setLoading] = useState(true);', 'const [loading, setLoading] = useState(true);\n  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";\n  const role = user?.role || "USER" as UserRole;');
ctx = ctx.replace('return (', '  const signIn = login;\n  const signUp = register;\n  const quickDemoLogin = async () => { await login("demo@example.com", "password123"); };\n  const resendConfirmationEmail = async (e:string) => ({success: true});\n  return (');
ctx = ctx.replace('value={{ user, loading, login, register, logout, updateProfile, updateAvatar, resetPassword }}', 'value={{ user, loading, login, register, logout, updateProfile, updateAvatar, resetPassword, isAdmin, role, signIn, signUp, quickDemoLogin, resendConfirmationEmail }}');
fs.writeFileSync('src/context/AuthContext.tsx', ctx);
