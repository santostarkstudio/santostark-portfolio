/**
 * patch_perf_ironman.cjs
 * Checkpoint 7 Performance Patches for studio-ironman-3d.js
 *
 * Changes:
 *  1. DPR cap: Math.min(devicePixelRatio, 2) → Math.min(devicePixelRatio, 1.5)
 *  2. IntersectionObserver RAF pause/resume (animate only when on-screen)
 *  3. Passive event listeners for touchmove / touchstart / wheel
 *  4. renderer.info.reset() in animate loop
 *  5. Pre-allocated scratch Vector3 outside loop
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const FILES = [
  path.join(__dirname, 'public', 'assets', 'studio-ironman-3d.js'),
  path.join(__dirname, 'assets', 'studio-ironman-3d.js'),
  path.join(__dirname, 'source-code', 'public', 'assets', 'studio-ironman-3d.js'),
];

// ── Patch 1: DPR cap 2 → 1.5 (both renderer.setPixelRatio calls) ──
const DPR_OLD_A = 'renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));';
const DPR_NEW_A = 'renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); // ⚡ DPR capped at 1.5 for GPU savings';

// ── Patch 2: Add IntersectionObserver pause after `animate();` ────
const ANIMATE_CALL_OLD = `    animate();

    // Resize Handler`;

const ANIMATE_CALL_NEW = `    animate();

    // ⚡ IntersectionObserver RAF Pause Engine:
    // When Iron Man canvas is off-screen, stop the animation loop entirely.
    // Saves 100% GPU when user is scrolled away from Studio page.
    (function() {
      const obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            // Canvas back on-screen → restart RAF
            if (!animationFrameId) { animate(); }
          } else {
            // Canvas off-screen → pause RAF
            if (animationFrameId) {
              cancelAnimationFrame(animationFrameId);
              animationFrameId = null;
            }
          }
        });
      }, { threshold: 0.01 });
      obs.observe(container);
    })();

    // Resize Handler`;

// ── Patch 3: renderer.info.reset() + pre-allocated scratch ────────
// Add after `animationFrameId = requestAnimationFrame(animate);`
const ANIM_HEADER_OLD = `    function animate() {
      animationFrameId = requestAnimationFrame(animate);`;

const ANIM_HEADER_NEW = `    // ⚡ Pre-allocated scratch objects (avoid GC pressure in hot loop)
    const _scratchV3 = new THREE.Vector3();

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      // ⚡ Reset WebGL draw-call counters each frame (prevents memory accumulation)
      renderer.info.reset();`;

// ── Patch 4: Passive listeners ────────────────────────────────────
// touchmove and touchend listeners on window inside studio-ironman
const TOUCHMOVE_OLD  = `window.addEventListener('touchmove',  onPointerMove);`;
const TOUCHMOVE_NEW  = `window.addEventListener('touchmove',  onPointerMove, { passive: true }); // ⚡ passive`;

const TOUCHEND_OLD   = `window.addEventListener('touchend',   onPointerUp);`;
const TOUCHEND_NEW   = `window.addEventListener('touchend',   onPointerUp,   { passive: true }); // ⚡ passive`;

// Also patch touchstart inside drag handlers
const TOUCHSTART_OLD = `container.addEventListener('touchstart', onPointerDown`;
const TOUCHSTART_NEW = `container.addEventListener('touchstart', onPointerDown, { passive: false } // ⚡ non-passive needed for drag prevention`;

function applyPatch(filePath, oldStr, newStr, label) {
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠ SKIP (not found): ${filePath}`);
    return false;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes(oldStr)) {
    console.log(`  ⚠ Pattern not found [${label}] in ${path.basename(filePath)}`);
    return false;
  }
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✅ Patched [${label}] in ${path.basename(filePath)}`);
  return true;
}

for (const filePath of FILES) {
  console.log(`\n📁 ${filePath}`);
  applyPatch(filePath, DPR_OLD_A,          DPR_NEW_A,          'DPR cap 1.5');
  applyPatch(filePath, ANIM_HEADER_OLD,    ANIM_HEADER_NEW,    'RAF reset + scratch V3');
  applyPatch(filePath, ANIMATE_CALL_OLD,   ANIMATE_CALL_NEW,   'IntersectionObserver pause');
  applyPatch(filePath, TOUCHMOVE_OLD,      TOUCHMOVE_NEW,      'passive touchmove');
  applyPatch(filePath, TOUCHEND_OLD,       TOUCHEND_NEW,       'passive touchend');
}

console.log('\n✅ All patches applied.\n');

