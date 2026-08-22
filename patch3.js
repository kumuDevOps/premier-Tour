const fs = require('fs');
const file = 'src/pages/AuthPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
`      const result = await signIn(email, password);`,
`      const result = await signIn(email.trim(), password.trim());`
);
fs.writeFileSync(file, content);
console.log('Patched AuthPage password trim');
