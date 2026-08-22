const fs = require('fs');
const glob = require('glob');
const path = require('path');

// 1. Remove .font-serif from CSS
let cssPath = 'src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(/--font-serif: "Poppins", sans-serif;/g, '');
css = css.replace(/\.font-serif \{[\s\S]*?\}/g, '');
fs.writeFileSync(cssPath, css);

// 2. Replace 'font-serif' with '' (or 'font-sans') in all TSX files
function replaceInFiles() {
  const files = glob.sync('src/**/*.tsx');
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('font-serif')) {
      content = content.replace(/font-serif/g, 'font-sans'); // font-sans maps to Poppins now
      fs.writeFileSync(file, content);
    }
  }
}
replaceInFiles();
console.log("Removed all serif references");
