const fs = require('fs');
const path = require('path');

const keys = new Set();
const defaultVals = {};

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            // Regex to find t('key') || 'Default'
            const regex = /t\(['"]([^'"]+)['"]\)(?:\s*\|\|\s*['"]([^'"]+)['"])?/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                keys.add(match[1]);
                if (match[2]) {
                    defaultVals[match[1]] = match[2];
                }
            }
        }
    });
}

walk('src');
console.log(JSON.stringify(defaultVals, null, 2));
