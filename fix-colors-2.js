const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/sky-/g, 'emerald-');
    content = content.replace(/badge-light-blue-active/g, 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20');
    content = content.replace(/emerald-glow/g, 'shadow-[0_0_15px_rgba(22,156,114,0.3)]'); // replacing what would be sky-glow

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function traverseDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            traverseDirectory(fullPath);
        } else if (stat.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css'))) {
            replaceInFile(fullPath);
        }
    });
}

traverseDirectory(directoryPath);
