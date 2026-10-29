const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

if (fs.existsSync(path.join(__dirname, 'index.html'))) {
  fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(outDir, 'index.html'));
}

if (fs.existsSync(path.join(__dirname, '_redirects'))) {
  fs.copyFileSync(path.join(__dirname, '_redirects'), path.join(outDir, '_redirects'));
}

if (fs.existsSync(path.join(__dirname, '_headers'))) {
  fs.copyFileSync(path.join(__dirname, '_headers'), path.join(outDir, '_headers'));
}

// bg-video.mp4 removed for 56.6MB performance boost

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      if (childItemName.includes('.bak')) return;
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(path.join(__dirname, 'assets'), path.join(outDir, 'assets'));
console.log('Build complete! Output in public/');
