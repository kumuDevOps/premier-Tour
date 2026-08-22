const fs = require('fs');
const file = 'src/server/config/database.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  "const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;",
  "let uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;\n  if (uri.includes('example.mongodb.net')) {\n    uri = DEFAULT_MONGODB_URI;\n  }"
);
fs.writeFileSync(file, content);
