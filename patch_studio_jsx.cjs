/**
 * patch_studio_jsx.cjs
 * Patches source-code/src/pages/Studio.jsx:
 *  1. Wing Tab Buttons container → mobile horizontal swipe rail
 *  2. Each Wing button → adds shrink-0, active:scale-95, starkTriggerWingReaction
 *  3. Project cards grid → adds 2xl:grid-cols-4, active:scale-[0.98], hover:border-cyan-400/40
 *  4. Modal → adds max-h-[90vh] overflow-y-auto p-5 sm:p-8
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'source-code', 'src', 'pages', 'Studio.jsx');

let src = fs.readFileSync(FILE, 'utf8');
const orig = src;

// ── 1. Wing Tab Buttons container ─────────────────────────────────────────────
// Old: <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center">
// New: horizontal swipe rail on mobile, wrap on sm+
src = src.replace(
  `<div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center">`,
  `<div className="flex flex-nowrap sm:flex-wrap gap-2.5 sm:gap-3 justify-start sm:justify-center overflow-x-auto no-scrollbar touch-pan-x pb-1">`
);

// ── 2. Wing Tab Buttons – each button: add shrink-0, active:scale-95, starkTriggerWingReaction ──
// Old onClick: onClick={() => { setActiveWing(w.id); setStatusFilter('All'); }}
// New onClick: also calls window.starkTriggerWingReaction
src = src.replace(
  `onClick={() => { setActiveWing(w.id); setStatusFilter('All'); }}`,
  `onClick={() => { setActiveWing(w.id); setStatusFilter('All'); if (window.starkTriggerWingReaction) window.starkTriggerWingReaction(w.id); }}`
);

// Old button className start: `px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2
// New: add shrink-0 active:scale-95
src = src.replace(
  `className={\`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 \${`,
  `className={\`shrink-0 px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-95 border flex items-center gap-2 \${`
);

// ── 3. Project Cards Grid – add 2xl:grid-cols-4, active:scale-[0.98], hover:border-cyan-400/40 ──
// Old: <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
src = src.replace(
  `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">`,
  `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">`
);

// Old card className: hover:-translate-y-1.5 hover:shadow-2xl transition-all cursor-pointer group
// New: add active:scale-[0.98] hover:border-cyan-400/40
src = src.replace(
  `hover:-translate-y-1.5 hover:shadow-2xl transition-all cursor-pointer group`,
  `hover:-translate-y-1.5 hover:shadow-2xl hover:border-cyan-400/40 active:scale-[0.98] transition-all cursor-pointer group`
);

// ── 4. Project Detail Modal – add max-h overflow scroll and responsive padding ──
// Old: className="relative w-full max-w-2xl glass-panel rounded-3xl border border-cyan-500/40 p-6 sm:p-8 space-y-6 shadow-2xl bg-dark-900/95"
src = src.replace(
  `className="relative w-full max-w-2xl glass-panel rounded-3xl border border-cyan-500/40 p-6 sm:p-8 space-y-6 shadow-2xl bg-dark-900/95"`,
  `className="relative w-full max-w-2xl glass-panel rounded-3xl border border-cyan-500/40 p-5 sm:p-8 space-y-6 shadow-2xl bg-dark-900/95 max-h-[90vh] overflow-y-auto"`
);

if (src === orig) {
  console.error('❌  No changes applied — all patterns matched 0 times. Check source line content.');
  process.exit(1);
}

fs.writeFileSync(FILE, src, 'utf8');
console.log('✅  Studio.jsx patched successfully.');

// Verify key strings are present
const checks = [
  ['Wing swipe rail', 'flex-nowrap sm:flex-wrap'],
  ['Wing starkTriggerWingReaction', 'starkTriggerWingReaction'],
  ['Wing shrink-0', 'shrink-0'],
  ['Grid 2xl', '2xl:grid-cols-4'],
  ['Card hover cyan border', 'hover:border-cyan-400/40'],
  ['Modal max-h overflow', 'max-h-[90vh] overflow-y-auto'],
];
let allGood = true;
for (const [label, needle] of checks) {
  if (src.includes(needle)) {
    console.log(`  ✔ ${label}`);
  } else {
    console.error(`  ✘ MISSING: ${label} ("${needle}")`);
    allGood = false;
  }
}
if (!allGood) process.exit(1);
console.log('\n✅  All checks passed.');

