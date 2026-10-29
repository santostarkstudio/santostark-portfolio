/**
 * patch_browser_title.cjs
 * Locks the browser header/tab title universally to "SANTO STARK STUDIO".
 */

const fs = require('fs');
const path = require('path');

// 1. HTML files
const htmlFiles = [
  path.join(__dirname, 'index.html'),
  path.join(__dirname, 'public', 'index.html')
];

for (const hf of htmlFiles) {
  if (fs.existsSync(hf)) {
    let content = fs.readFileSync(hf, 'utf8');
    content = content.replace(/<title>.*?<\/title>/gi, '<title>SANTO STARK STUDIO</title>');
    fs.writeFileSync(hf, content, 'utf8');
    console.log('✅ Updated title in:', path.relative(__dirname, hf));
  }
}

// 2. PageWrapper.jsx
const pwPath = path.join(__dirname, 'source-code', 'src', 'components', 'PageWrapper.jsx');
if (fs.existsSync(pwPath)) {
  let pw = fs.readFileSync(pwPath, 'utf8');
  pw = pw.replace(
    /document\.title\s*=\s*title\s*\?\s*`\$\{title\}\s*\|\s*\$\{brand\}`\s*:\s*brand;/,
    "document.title = 'SANTO STARK STUDIO';"
  );
  fs.writeFileSync(pwPath, pw, 'utf8');
  console.log('✅ Updated title in PageWrapper.jsx');
}

// 3. Bundles
const bundles = [
  path.join(__dirname, 'public', 'assets', 'index-BMqPMOZ-.js'),
  path.join(__dirname, 'assets', 'index-BMqPMOZ-.js'),
  path.join(__dirname, 'source-code', 'public', 'assets', 'index-BMqPMOZ-.js'),
];

for (const b of bundles) {
  if (fs.existsSync(b)) {
    let bsrc = fs.readFileSync(b, 'utf8');
    // Replace document.title=t?`${t} | ${l}`:l with document.title="SANTO STARK STUDIO"
    const oldTitle = 'document.title=t?`${t} | ${l}`:l';
    const newTitle = 'document.title="SANTO STARK STUDIO"';
    if (bsrc.includes(oldTitle)) {
      bsrc = bsrc.replace(oldTitle, newTitle);
      fs.writeFileSync(b, bsrc, 'utf8');
      console.log('✅ Replaced title in bundle:', path.relative(__dirname, b));
    } else {
      console.log('ℹ Title already patched or not found in:', path.relative(__dirname, b));
    }
  }
}

// 4. stark-content-engine.js - Add title guard and MutationObserver
const enginePaths = [
  path.join(__dirname, 'public', 'assets', 'stark-content-engine.js'),
  path.join(__dirname, 'assets', 'stark-content-engine.js'),
  path.join(__dirname, 'source-code', 'public', 'assets', 'stark-content-engine.js')
];

const TITLE_GUARD = `
// ── Permanent Header Title Guard: SANTO STARK STUDIO ──
(function enforceStarkTitle() {
  if (typeof document === 'undefined') return;
  const TARGET_TITLE = 'SANTO STARK STUDIO';
  document.title = TARGET_TITLE;
  try {
    const obs = new MutationObserver(function() {
      if (document.title !== TARGET_TITLE) {
        document.title = TARGET_TITLE;
      }
    });
    const tNode = document.querySelector('title') || document.head;
    if (tNode) {
      obs.observe(tNode, { childList: true, subtree: true, characterData: true });
    }
  } catch(e) {}
  window.addEventListener('popstate', function() { document.title = TARGET_TITLE; });
  window.addEventListener('hashchange', function() { document.title = TARGET_TITLE; });
})();
`;

for (const ep of enginePaths) {
  if (fs.existsSync(ep)) {
    let esrc = fs.readFileSync(ep, 'utf8');
    if (!esrc.includes('enforceStarkTitle')) {
      esrc = esrc + '\n' + TITLE_GUARD;
      fs.writeFileSync(ep, esrc, 'utf8');
      console.log('✅ Injected title guard into:', path.relative(__dirname, ep));
    } else {
      console.log('ℹ Title guard already present in:', path.relative(__dirname, ep));
    }
  }
}

console.log('Done.');
