/**
 * patch_homepage_mobile.cjs
 * Patches Homepage mobile experience:
 *
 * A) HeroCanvas.jsx:
 *    1. SolarSystem group tilt: on mobile (isTouchDevice) use 0.45 rad instead of 0.25 rad
 *       → steep cascade down phone screen
 *    2. Mobile stars count: increase from 2200 → 3000 for better phone visual
 *    3. Canvas FOV on mobile: 50 → 56 so planets fill vertical screen better
 *
 * B) Home.jsx:
 *    1. Skill chips: on xs mobile → horizontal marquee ticker (hidden md+, shown sm-)
 *                    on sm+ keep existing flex-wrap layout
 *    2. CTA Buttons: w-full on xs, auto on sm+; stacked vertically on mobile
 */

const fs = require('fs');
const path = require('path');

// ─── A: HeroCanvas.jsx ───────────────────────────────────────────────────────
const HERO = path.join(__dirname, 'source-code', 'src', 'components', '3d', 'HeroCanvas.jsx');
let hero = fs.readFileSync(HERO, 'utf8');
const heroOrig = hero;

// 1. Adaptive tilt: pass isTouchDevice down to SolarSystem and use steeper tilt on mobile
//    Current: <SolarSystem earthRef={earthRef} isZoomingToEarth={isZoomingToEarth} />
//    New:     <SolarSystem earthRef={earthRef} isZoomingToEarth={isZoomingToEarth} isMobile={isTouchDevice} />
hero = hero.replace(
  `<SolarSystem earthRef={earthRef} isZoomingToEarth={isZoomingToEarth} />`,
  `<SolarSystem earthRef={earthRef} isZoomingToEarth={isZoomingToEarth} isMobile={isTouchDevice} />`
);

// 2. SolarSystem function signature: add isMobile prop
hero = hero.replace(
  `function SolarSystem({ earthRef, isZoomingToEarth }) {`,
  `function SolarSystem({ earthRef, isZoomingToEarth, isMobile }) {`
);

// 3. SolarSystem group rotation: use steeper tilt on mobile
//    Current: <group rotation={[0.25, 0, 0]}>
//    New:     <group rotation={[isMobile ? 0.45 : 0.25, 0, 0]}>
hero = hero.replace(
  `<group rotation={[0.25, 0, 0]}>`,
  `<group rotation={[isMobile ? 0.45 : 0.25, 0, 0]}>`
);

// 4. Canvas FOV: mobile 56°, desktop 50°
//    Current: camera={{ position: [defaultPos.x, defaultPos.y, defaultPos.z], fov: 50 }}
//    New:     camera={{ position: [defaultPos.x, defaultPos.y, defaultPos.z], fov: isTouchDevice ? 56 : 50 }}
hero = hero.replace(
  `camera={{ position: [defaultPos.x, defaultPos.y, defaultPos.z], fov: 50 }}`,
  `camera={{ position: [defaultPos.x, defaultPos.y, defaultPos.z], fov: isTouchDevice ? 56 : 50 }}`
);

// 5. Stars count mobile: 2200 → 3000
hero = hero.replace(
  `<Stars radius={85} depth={80} count={isTouchDevice ? 2200 : 6000}`,
  `<Stars radius={85} depth={80} count={isTouchDevice ? 3000 : 6000}`
);

if (hero !== heroOrig) {
  fs.writeFileSync(HERO, hero, 'utf8');
  console.log('✅  HeroCanvas.jsx patched.');
} else {
  console.error('❌  HeroCanvas.jsx: no changes applied!');
  process.exit(1);
}

// Verify HeroCanvas patches
const heroChecks = [
  ['SolarSystem isMobile prop pass', 'isMobile={isTouchDevice}'],
  ['SolarSystem isMobile param', 'function SolarSystem({ earthRef, isZoomingToEarth, isMobile })'],
  ['Adaptive orbital tilt', 'isMobile ? 0.45 : 0.25'],
  ['Canvas FOV mobile 56', 'fov: isTouchDevice ? 56 : 50'],
  ['Stars count 3000 mobile', 'isTouchDevice ? 3000 : 6000'],
];
let allGood = true;
for (const [label, needle] of heroChecks) {
  if (hero.includes(needle)) { console.log(`  ✔ ${label}`); }
  else { console.error(`  ✘ MISSING: ${label}`); allGood = false; }
}


// ─── B: Home.jsx ─────────────────────────────────────────────────────────────
const HOME = path.join(__dirname, 'source-code', 'src', 'pages', 'Home.jsx');
let home = fs.readFileSync(HOME, 'utf8');
const homeOrig = home;

// 1. Skill chips div: add mobile ticker support
//    Current: className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs font-mono text-slate-300 pointer-events-auto"
//    New: hidden on xs, shown as horizontal scroll on sm+ (always flex-wrap on md+)
//    We keep existing div but make it: overflow-x-auto on small, no-scrollbar
home = home.replace(
  `className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs font-mono text-slate-300 pointer-events-auto"`,
  `className="flex flex-nowrap sm:flex-wrap items-center justify-center gap-2.5 pt-2 text-xs font-mono text-slate-300 pointer-events-auto overflow-x-auto no-scrollbar touch-pan-x px-2"`
);

// 2. CTA Buttons container: flex-col on xs, flex-row on sm+; w-full on xs
//    Current: className="flex flex-wrap justify-center gap-4 pt-2 pointer-events-auto"
//    New: flex-col on xs, sm:flex-row
home = home.replace(
  `className="flex flex-wrap justify-center gap-4 pt-2 pointer-events-auto"`,
  `className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 pt-2 pointer-events-auto w-full sm:w-auto px-6 sm:px-0"`
);

// 3. Explore Projects button: add w-full sm:w-auto for thumb-zone sizing on mobile
//    Current: className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all flex items-center space-x-2"
//    New: add w-full sm:w-auto justify-center
home = home.replace(
  `className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all flex items-center space-x-2"`,
  `className="w-full sm:w-auto justify-center px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all flex items-center space-x-2"`
);

// 4. Establish Contact button: add w-full sm:w-auto
//    Current: className="px-8 py-3.5 rounded-2xl glass-panel border border-white/20 text-slate-100 font-semibold text-sm hover:border-cyan-400 hover:bg-white/10 hover:scale-105 transition-all flex items-center space-x-2 group"
//    New: add w-full sm:w-auto justify-center
home = home.replace(
  `className="px-8 py-3.5 rounded-2xl glass-panel border border-white/20 text-slate-100 font-semibold text-sm hover:border-cyan-400 hover:bg-white/10 hover:scale-105 transition-all flex items-center space-x-2 group"`,
  `className="w-full sm:w-auto justify-center px-8 py-3.5 rounded-2xl glass-panel border border-white/20 text-slate-100 font-semibold text-sm hover:border-cyan-400 hover:bg-white/10 hover:scale-105 transition-all flex items-center space-x-2 group"`
);

if (home !== homeOrig) {
  fs.writeFileSync(HOME, home, 'utf8');
  console.log('✅  Home.jsx patched.');
} else {
  console.error('❌  Home.jsx: no changes applied!');
  process.exit(1);
}

// Verify Home.jsx patches
const homeChecks = [
  ['Skill chips horizontal scroll', 'overflow-x-auto no-scrollbar touch-pan-x'],
  ['CTA flex-col mobile', 'flex-col sm:flex-row'],
  ['Explore btn w-full mobile', 'w-full sm:w-auto justify-center px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500'],
  ['Contact btn w-full mobile', 'w-full sm:w-auto justify-center px-8 py-3.5 rounded-2xl glass-panel'],
];
for (const [label, needle] of homeChecks) {
  if (home.includes(needle)) { console.log(`  ✔ ${label}`); }
  else { console.error(`  ✘ MISSING: ${label}`); allGood = false; }
}

if (!allGood) process.exit(1);
console.log('\n✅  All homepage mobile patches applied and verified.');

