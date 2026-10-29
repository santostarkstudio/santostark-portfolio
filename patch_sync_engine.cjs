/**
 * patch_sync_engine.cjs
 * Syncs public/assets/stark-content-engine.js → assets/ and source-code/public/assets/
 */
'use strict';
const fs   = require('fs');
const path = require('path');

const SRC  = path.join(__dirname, 'public', 'assets', 'stark-content-engine.js');
const DEST = [
  path.join(__dirname, 'assets', 'stark-content-engine.js'),
  path.join(__dirname, 'source-code', 'public', 'assets', 'stark-content-engine.js'),
];

const content = fs.readFileSync(SRC, 'utf8');
DEST.forEach(function(d) {
  if (fs.existsSync(d)) {
    fs.writeFileSync(d, content, 'utf8');
    console.log('✅ Synced →', d);
  } else {
    console.log('⚠ Not found:', d);
  }
});
console.log('Done.');

