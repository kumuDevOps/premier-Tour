const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
// replace font links
html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=DM\+Serif\+Display[^"]*" rel="stylesheet">/, '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">');
fs.writeFileSync('index.html', html);

let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/font-family: 'Manrope', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;/g, "font-family: 'Poppins', sans-serif;");
css = css.replace(/font-family: 'Manrope', sans-serif;/g, "font-family: 'Poppins', sans-serif;");
css = css.replace(/font-family: 'DM Serif Display', Georgia, serif;/g, "font-family: 'Poppins', sans-serif;");
fs.writeFileSync('src/index.css', css);

console.log("Fonts updated in html and css");
