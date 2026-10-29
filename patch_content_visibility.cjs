/**
 * patch_content_visibility.cjs
 * Checkpoint 7: Adds content-visibility: auto to below-the-fold sections
 * Reduces initial main thread layout time and Total Blocking Time (TBT).
 */
'use strict';
const fs   = require('fs');
const path = require('path');

const FILES = [
  path.join(__dirname, 'public', 'index.html'),
  path.join(__dirname, 'index.html'),
];

const TARGET = '.bg-dark{background:#090a0f}';
const INJECTION = `.bg-dark{background:#090a0f}
      /* Checkpoint 7: High-FPS Content Visibility & Frame Pacing Engine */
      @media (min-width: 640px) {
        #skills, #projects, #experience, #contact {
          content-visibility: auto;
          contain-intrinsic-size: 1px 750px;
        }
      }`;

FILES.forEach(function(f) {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('content-visibility: auto')) {
    console.log('Already patched:', path.basename(f));
    return;
  }
  if (!c.includes(TARGET)) {
    console.log('Target not found in:', path.basename(f));
    return;
  }
  c = c.replace(TARGET, INJECTION);
  fs.writeFileSync(f, c, 'utf8');
  console.log('✅ Patched content-visibility in', path.basename(f));
});
