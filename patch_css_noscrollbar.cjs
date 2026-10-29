/**
 * patch_css_noscrollbar.cjs
 * Appends the .no-scrollbar utility to all CSS files that have .glass-card
 * (the main compiled CSS). Syncs to public/assets/, assets/, source-code/public/assets/
 */

const fs = require('fs');
const path = require('path');

const NO_SCROLLBAR_CSS = `

/* ── Mobile horizontal swipe rail utility ── */
.no-scrollbar {
  scrollbar-width: none;        /* Firefox */
  -ms-overflow-style: none;     /* IE/Edge */
}
.no-scrollbar::-webkit-scrollbar {
  display: none;                /* Chrome/Safari/WebKit */
}
`;

// Find the CSS file with glass-card in each assets dir
const ASSET_DIRS = [
  path.join(__dirname, 'public', 'assets'),
  path.join(__dirname, 'assets'),
  path.join(__dirname, 'source-code', 'public', 'assets'),
];

for (const dir of ASSET_DIRS) {
  if (!fs.existsSync(dir)) { console.warn('⚠ Dir not found: ' + dir); continue; }
  const cssFiles = fs.readdirSync(dir).filter(f => f.endsWith('.css'));
  for (const cssFile of cssFiles) {
    const fullPath = path.join(dir, cssFile);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('glass-card')) continue;
    if (content.includes('no-scrollbar')) {
      console.log('  ℹ Already has no-scrollbar: ' + path.relative(__dirname, fullPath));
      continue;
    }
    fs.writeFileSync(fullPath, content + NO_SCROLLBAR_CSS, 'utf8');
    console.log('  ✅ Added no-scrollbar: ' + path.relative(__dirname, fullPath));
    break; // only one CSS file per dir needs this
  }
}

console.log('\nDone.');
