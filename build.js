const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

if (fs.existsSync(path.join(__dirname, 'index.html'))) {
  fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(outDir, 'index.html'));
}

if (fs.existsSync(path.join(__dirname, 'bg-video.mp4'))) {
  fs.copyFileSync(path.join(__dirname, 'bg-video.mp4'), path.join(outDir, 'bg-video.mp4'));
}

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
