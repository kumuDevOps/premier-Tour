const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/--font-sans: "Manrope", "Plus Jakarta Sans", sans-serif;/g, '--font-sans: "Poppins", sans-serif;');
css = css.replace(/--font-heading: "Manrope", sans-serif;/g, '--font-heading: "Poppins", sans-serif;');
css = css.replace(/--font-serif: "DM Serif Display", serif;/g, '--font-serif: "Poppins", sans-serif;');
fs.writeFileSync('src/index.css', css);
console.log("Updated theme fonts to Poppins in src/index.css");
