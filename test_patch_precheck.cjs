const fs = require('fs');
const path = require('path');

const BUNDLES = [
  path.join(__dirname, 'assets', 'index-BMqPMOZ-.js'),
  path.join(__dirname, 'public', 'assets', 'index-BMqPMOZ-.js'),
];

// Verify studio-bg.jpg exists
if (!fs.existsSync(path.join(__dirname, 'public', 'assets', 'studio-bg.jpg'))) {
  console.error('Missing studio-bg.jpg in public/assets!');
  process.exit(1);
}

console.log('Verified studio-bg.jpg exists.');
