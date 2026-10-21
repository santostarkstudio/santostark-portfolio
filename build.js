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

const srcAssets = path.join(__dirname, 'assets');
const destAssets = path.join(outDir, 'assets');
if (fs.existsSync(srcAssets)) {
  if (!fs.existsSync(destAssets)) {
    fs.mkdirSync(destAssets, { recursive: true });
  }
  for (const file of fs.readdirSync(srcAssets)) {
    if (file.includes('.bak')) continue;
    const srcFile = path.join(srcAssets, file);
    const destFile = path.join(destAssets, file);
    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, destFile);
    }
  }
}

console.log('Build complete! Output in public/');
