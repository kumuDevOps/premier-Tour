const fs = require('fs');
let ctx = fs.readFileSync('src/context/AuthContext.tsx', 'utf8');
ctx = ctx.replace('resendConfirmationEmail: (e:string)=>Promise<{success:boolean,error?:string}>;', 'resendConfirmationEmail: (e:string)=>Promise<{success:boolean,error?:string}>;\n  signOut: ()=>Promise<void>;');
ctx = ctx.replace('const resendConfirmationEmail = async (e:string) => ({success: true});', 'const resendConfirmationEmail = async (e:string) => ({success: true});\n  const signOut = logout;');
ctx = ctx.replace('resendConfirmationEmail }}', 'resendConfirmationEmail, signOut }}');
fs.writeFileSync('src/context/AuthContext.tsx', ctx);
