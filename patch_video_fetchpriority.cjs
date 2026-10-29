/**
 * patch_video_fetchpriority.cjs
 * Adds fetchpriority="low" to background video element in both index.html files
 */
'use strict';
const fs   = require('fs');
const path = require('path');

const FILES = [
  path.join(__dirname, 'public', 'index.html'),
  path.join(__dirname, 'index.html'),
];

const OLD = 'autoplay loop muted playsinline preload="none" style=';
const NEW = 'autoplay loop muted playsinline preload="none" fetchpriority="low" style=';

FILES.forEach(function(f) {
  if (!fs.existsSync(f)) { console.log('Not found:', f); return; }
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes(NEW)) { console.log('Already patched:', path.basename(f)); return; }
  if (!c.includes(OLD)) { console.log('Pattern not found:', path.basename(f)); return; }
  c = c.replace(OLD, NEW);
  fs.writeFileSync(f, c, 'utf8');
  console.log('✅ Patched fetchpriority in', path.basename(f));
});
console.log('Done.');

