const fs = require('fs');
const file = 'src/context/AuthContext.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";`,
  `const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" || user?.role === "admin" || user?.role === "staff";`
);

fs.writeFileSync(file, content);
console.log('Patched AuthContext isAdmin');
