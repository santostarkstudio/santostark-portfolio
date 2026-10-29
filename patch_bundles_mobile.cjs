/**
 * patch_bundles_mobile.cjs
 * Patches live bundles for mobile multi-device experience:
 *
 * 1. Solar system orbital tilt: .25 → adaptive (0.45 on mobile, 0.25 on desktop)
 *    In the bundle, SolarSystem renders with rotation:[.25,0,0] and isMobile is
 *    now passed in source. We patch the bundle to read isMobile from a global.
 *    Strategy: replace rotation:[.25,0,0] with rotation:[window.__ssMobile?0.45:.25,0,0]
 *    and inject a window.__ssMobile setter near the isMobile state detection.
 *
 * 2. Canvas FOV: fov:50 in HeroCanvas → fov:isMobile?56:50
 *    In bundle, the Canvas has fov:50 next to dpr:isMobile and the hle/fle function.
 *    We locate the specific canvas and patch.
 *
 * 3. Wing tab buttons: flex flex-wrap gap-2.5 → add overflow-x-auto, shrink-0, etc.
 *
 * SYNC TO: public/assets/, assets/, source-code/public/assets/
 */

const fs = require('fs');
const path = require('path');

const BUNDLES = [
  path.join(__dirname, 'public', 'assets', 'index-BMqPMOZ-.js'),
  path.join(__dirname, 'assets', 'index-BMqPMOZ-.js'),
  path.join(__dirname, 'source-code', 'public', 'assets', 'index-BMqPMOZ-.js'),
];

function patchBundle(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  const orig = src;
  let changes = 0;

  // ── 1. Orbital tilt: adaptive to device ──────────────────────────────────────
  // The bundle has: rotation:[.25,0,0] inside the SolarSystem (ule function)
  // We need to inject a window.__heroMobile check. The setIsMobile state fn 
  // already exists in fle (main export). We add a window setter alongside it.
  
  // Patch the SolarSystem group rotation to read from window.__heroMobile
  const tiltOld = `rotation:[.25,0,0]`;
  const tiltNew = `rotation:[window.__heroMobile?0.45:.25,0,0]`;
  if (src.includes(tiltOld)) {
    src = src.replace(tiltOld, tiltNew);
    changes++;
    console.log('  ✔ Patched orbital tilt to adaptive mobile/desktop');
  } else {
    console.warn('  ⚠ orbital tilt string not found — skipping');
  }

  // ── 2. Inject window.__heroMobile setter into the isMobile state detection ──
  // In bundle, fle function has: setIsMobile(typeof window!=="undefined"&&...
  // We patch to also set window.__heroMobile after state update
  // The pattern: setDp(getRespCamPos());};window.addEventListener
  const mobileSetterOld = `setDp(getRespCamPos());};window.addEventListener(\"resize\",chk);`;
  const mobileSetterNew = `setDp(getRespCamPos());window.__heroMobile=typeof window!=="undefined"&&("ontouchstart"in window||navigator.maxTouchPoints>0||window.innerWidth<1024);};window.addEventListener("resize",chk);`;
  if (src.includes(mobileSetterOld)) {
    src = src.replace(mobileSetterOld, mobileSetterNew);
    changes++;
    console.log('  ✔ Injected window.__heroMobile setter on resize');
  } else {
    // Try alternate pattern
    const alt1 = `setDp(getRespCamPos());\n};window.addEventListener("resize",chk);`;
    if (src.includes(alt1)) {
      src = src.replace(alt1, `setDp(getRespCamPos());window.__heroMobile=typeof window!=="undefined"&&("ontouchstart"in window||navigator.maxTouchPoints>0||window.innerWidth<1024);\n};window.addEventListener("resize",chk);`);
      changes++;
      console.log('  ✔ Injected window.__heroMobile setter (alt pattern)');
    } else {
      console.warn('  ⚠ mobile setter injection point not found — skipping');
    }
  }

  // ── 3. Canvas FOV: patch fle function canvas fov from 50 to mobile-aware ──
  // In bundle: fov:50},dpr:isMobile?[1,1.2]:[1,1.5]
  // We look for this specific combination to target only the HeroCanvas canvas
  const fovOld = `fov:50},dpr:isMobile?[1,1.2]:[1,1.5]`;
  const fovNew = `fov:isMobile?56:50},dpr:isMobile?[1,1.2]:[1,1.5]`;
  if (src.includes(fovOld)) {
    src = src.replace(fovOld, fovNew);
    changes++;
    console.log('  ✔ Patched Canvas FOV to 56 on mobile');
  } else {
    console.warn('  ⚠ Canvas FOV pattern not found in bundle');
  }

  // ── 4. Wing tab buttons: add mobile swipe rail classes ─────────────────────
  // In bundle Studio section: "flex flex-wrap gap-2.5 sm:gap-3 justify-center"
  // This is inside the Wing tab buttons div
  const wingDivOld = `"flex flex-wrap gap-2.5 sm:gap-3 justify-center"`;
  const wingDivNew = `"flex flex-nowrap sm:flex-wrap gap-2.5 sm:gap-3 justify-start sm:justify-center overflow-x-auto no-scrollbar touch-pan-x pb-1"`;
  if (src.includes(wingDivOld)) {
    // Only replace the first occurrence (wing tabs, not other flex-wrap elements)
    const idx = src.indexOf(wingDivOld);
    src = src.slice(0, idx) + wingDivNew + src.slice(idx + wingDivOld.length);
    changes++;
    console.log('  ✔ Patched Wing tab buttons to mobile swipe rail');
  } else {
    console.warn('  ⚠ Wing tab flex div not found in bundle');
  }

  // ── 5. Wing button shrink-0 + starkTriggerWingReaction ─────────────────────
  // Find: px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2
  // Add: shrink-0 active:scale-95
  const wingBtnOld = `"px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 `;
  const wingBtnNew = `"shrink-0 px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-95 border flex items-center gap-2 `;
  if (src.includes(wingBtnOld)) {
    src = src.replace(wingBtnOld, wingBtnNew);
    changes++;
    console.log('  ✔ Patched Wing buttons shrink-0 + active:scale-95');
  } else {
    console.warn('  ⚠ Wing button class not found in bundle');
  }

  // ── 6. starkTriggerWingReaction on wing click ───────────────────────────────
  // Find: setActiveWing(w.id);setStatusFilter("All")
  const wingClickOld = `setActiveWing(w.id);setStatusFilter("All")`;
  const wingClickNew = `setActiveWing(w.id);setStatusFilter("All");if(window.starkTriggerWingReaction)window.starkTriggerWingReaction(w.id)`;
  if (src.includes(wingClickOld)) {
    src = src.replace(wingClickOld, wingClickNew);
    changes++;
    console.log('  ✔ Patched Wing click to call starkTriggerWingReaction');
  } else {
    console.warn('  ⚠ Wing click handler not found');
  }

  // ── 7. Project Cards grid: 2xl:grid-cols-4 + active:scale-[0.98] ───────────
  const gridOld = `"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"`;
  const gridNew = `"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5"`;
  if (src.includes(gridOld)) {
    src = src.replace(gridOld, gridNew);
    changes++;
    console.log('  ✔ Patched project grid to 2xl:grid-cols-4');
  } else {
    console.warn('  ⚠ Project grid class not found');
  }

  // ── 8. Project cards hover: add hover:border-cyan-400/40 active:scale-[0.98] ──
  const cardHoverOld = `hover:-translate-y-1.5 hover:shadow-2xl transition-all cursor-pointer group"`;
  const cardHoverNew = `hover:-translate-y-1.5 hover:shadow-2xl hover:border-cyan-400/40 active:scale-[0.98] transition-all cursor-pointer group"`;
  if (src.includes(cardHoverOld)) {
    src = src.replace(cardHoverOld, cardHoverNew);
    changes++;
    console.log('  ✔ Patched project card hover cyan border + active scale');
  } else {
    console.warn('  ⚠ Project card hover class not found');
  }

  // ── 9. Modal: max-h-[90vh] overflow-y-auto ─────────────────────────────────
  const modalOld = `"relative w-full max-w-2xl glass-panel rounded-3xl border border-cyan-500/40 p-6 sm:p-8 space-y-6 shadow-2xl bg-dark-900/95"`;
  const modalNew = `"relative w-full max-w-2xl glass-panel rounded-3xl border border-cyan-500/40 p-5 sm:p-8 space-y-6 shadow-2xl bg-dark-900/95 max-h-[90vh] overflow-y-auto"`;
  if (src.includes(modalOld)) {
    src = src.replace(modalOld, modalNew);
    changes++;
    console.log('  ✔ Patched modal max-h overflow');
  } else {
    console.warn('  ⚠ Modal class not found');
  }

  if (src === orig) {
    console.error(`  ❌ No changes applied to ${path.basename(filePath)}!`);
    return false;
  }

  fs.writeFileSync(filePath, src, 'utf8');
  console.log(`  ✅ ${path.basename(filePath)}: ${changes} change(s) applied`);
  return true;
}

// Patch all 3 bundle locations
let allOk = true;
for (const bundlePath of BUNDLES) {
  if (!fs.existsSync(bundlePath)) {
    console.warn(`  ⚠ Not found: ${bundlePath}`);
    continue;
  }
  console.log(`\n🔧 Patching: ${bundlePath.replace(__dirname, '.')}`);
  const ok = patchBundle(bundlePath);
  if (!ok) allOk = false;
}

if (!allOk) {
  console.error('\n❌ Some bundles had issues — check warnings above.');
  process.exit(1);
}
console.log('\n✅  All bundles patched. Run: node -c "public/assets/index-BMqPMOZ-.js" to verify syntax.');

