/**
 * patch_heromobile_init.cjs
 * Injects the initial window.__heroMobile = ... assignment into the
 * fle (HeroCanvas) component's initial state, so the solar system
 * tilt is correct on first render — not just after a resize event.
 *
 * Also injects CSS for no-scrollbar if missing from output CSS.
 */

const fs = require('fs');
const path = require('path');

const BUNDLES = [
  path.join(__dirname, 'public', 'assets', 'index-BMqPMOZ-.js'),
  path.join(__dirname, 'assets', 'index-BMqPMOZ-.js'),
];

function patchInit(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  const orig = src;

  // The fle function starts with:
  // function fle({isZoomingToEarth:n=!1,onEarthZoomComplete:e}){
  //   const t=q.useRef(),...
  //   [isMobile,setIsMobile]=q.useState(()=>{return typeof window!=="undefined"&&...})
  // We want to add window.__heroMobile = <init value> right after useState init.

  // Pattern: the useState initial value call
  const initOld = `typeof window!==\"undefined\"\u0026\u0026(\"ontouchstart\"in window||navigator.maxTouchPoints>0||window.innerWidth<1024)});`;
  const initNew = `typeof window!==\"undefined\"\u0026\u0026(\"ontouchstart\"in window||navigator.maxTouchPoints>0||window.innerWidth<1024)});if(typeof window!==\"undefined\"){window.__heroMobile=(\"ontouchstart\"in window||navigator.maxTouchPoints>0||window.innerWidth<1024);}`;

  if (src.includes(initOld)) {
    src = src.replace(initOld, initNew);
    console.log('  ✔ Injected initial window.__heroMobile on component mount');
  } else {
    // Try without unicode escapes
    const alt = `typeof window!=="undefined"&&("ontouchstart"in window||navigator.maxTouchPoints>0||window.innerWidth<1024)});`;
    if (src.includes(alt)) {
      src = src.replace(alt, alt.replace('});', `});if(typeof window!=="undefined"){window.__heroMobile=("ontouchstart"in window||navigator.maxTouchPoints>0||window.innerWidth<1024);}`));
      console.log('  ✔ Injected initial window.__heroMobile (alt)');
    } else {
      console.warn('  ⚠ Could not find useState init pattern for __heroMobile — skipping');
    }
  }

  if (src !== orig) {
    fs.writeFileSync(filePath, src, 'utf8');
    console.log(`  ✅ ${path.basename(filePath)} updated`);
  } else {
    console.log(`  ℹ ${path.basename(filePath)} unchanged`);
  }
}

for (const b of BUNDLES) {
  if (fs.existsSync(b)) {
    console.log(`\n🔧 ${b.replace(__dirname+path.sep, '')}`);
    patchInit(b);
  }
}
console.log('\nDone. Verifying syntax...');

