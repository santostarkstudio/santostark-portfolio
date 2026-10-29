/**
 * patch_gyro_sensitivity.cjs
 * Upgrades Gyroscope Sensitivity on both Homepage (3D Solar System) and Studio (3D Iron Man):
 * 1. Homepage HeroCanvas.jsx + bundles:
 *    - Increases sensitivity multiplier from 1.8 -> 3.2 (horizontal)
 *    - Increases vertical multiplier from 1.2 -> 2.2
 *    - Reduces deadzone and boosts lerp speed from delta*3.5 to delta*5.8
 * 2. Studio studio-ironman-3d.js (all 3 locations):
 *    - Injects high-sensitivity device orientation listener
 *    - Adds subtle holographic rotation and camera parallax on phone/tablet tilt
 */

const fs = require('fs');
const path = require('path');

// ── 1. Homepage HeroCanvas.jsx ──────────────────────────────────────────────
const heroPath = path.join(__dirname, 'source-code', 'src', 'components', '3d', 'HeroCanvas.jsx');
if (fs.existsSync(heroPath)) {
  let hero = fs.readFileSync(heroPath, 'utf8');
  // Replace old multipliers
  hero = hero.replace(
    /gyro\.current\.x\s*=\s*\(gX\s*\/\s*45\)\s*\*\s*1\.8;/,
    "gyro.current.x = (gX / 45) * 3.2;"
  );
  hero = hero.replace(
    /gyro\.current\.y\s*=\s*\(\(gY\s*-\s*45\)\s*\/\s*35\)\s*\*\s*1\.2;/,
    "gyro.current.y = ((gY - 45) / 35) * 2.2;"
  );
  hero = hero.replace(
    /const\s*lerpFactor\s*=\s*Math\.min\(1,\s*delta\s*\*\s*3\.5\);/,
    "const lerpFactor = Math.min(1, delta * 5.8);"
  );
  fs.writeFileSync(heroPath, hero, 'utf8');
  console.log('✅ Updated HeroCanvas.jsx gyro sensitivity');
}

// ── 2. Homepage Bundles ─────────────────────────────────────────────────────
const bundles = [
  path.join(__dirname, 'public', 'assets', 'index-BMqPMOZ-.js'),
  path.join(__dirname, 'assets', 'index-BMqPMOZ-.js'),
  path.join(__dirname, 'source-code', 'public', 'assets', 'index-BMqPMOZ-.js')
];

for (const b of bundles) {
  if (fs.existsSync(b)) {
    let bsrc = fs.readFileSync(b, 'utf8');
    // Bundle pattern: r.current.x=(a/45)*1.8;r.current.y=((l-45)/35)*1.2;
    if (bsrc.includes('(a/45)*1.8')) {
      bsrc = bsrc.replace('(a/45)*1.8', '(a/45)*3.2');
      bsrc = bsrc.replace('((l-45)/35)*1.2', '((l-45)/35)*2.2');
      bsrc = bsrc.replace('c=Math.min(1,o*3.5)', 'c=Math.min(1,o*5.8)');
      fs.writeFileSync(b, bsrc, 'utf8');
      console.log('✅ Patched gyro sensitivity in bundle:', path.relative(__dirname, b));
    } else {
      console.log('ℹ Gyro already updated or pattern not found in:', path.relative(__dirname, b));
    }
  }
}

// ── 3. Studio studio-ironman-3d.js ──────────────────────────────────────────
const studioFiles = [
  path.join(__dirname, 'public', 'assets', 'studio-ironman-3d.js'),
  path.join(__dirname, 'assets', 'studio-ironman-3d.js'),
  path.join(__dirname, 'source-code', 'public', 'assets', 'studio-ironman-3d.js')
];

const GYRO_SETUP = `
    // ── Mobile & Tablet High-Sensitivity Gyroscope Controller ──
    let gyroActive = false;
    let gyroTargetRotX = 0;
    let gyroTargetCamY = 0;
    let currentGyroRotX = 0;
    let currentGyroCamY = 0;
    const baseCamY = camera.position.y;

    function handleStudioGyro(e) {
      if (e.gamma !== null && e.beta !== null && !isUserDragging) {
        gyroActive = true;
        const gX = Math.max(-45, Math.min(45, e.gamma));
        const gY = Math.max(15, Math.min(75, e.beta));
        // High sensitivity: tilting phone left/right rotates suit ±16°
        gyroTargetRotX = (gX / 45) * 0.28;
        // Tilting phone up/down shifts camera height slightly for 3D parallax
        gyroTargetCamY = ((gY - 45) / 30) * 0.16;
      }
    }

    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024)) {
      window.addEventListener('deviceorientation', handleStudioGyro, true);
    }
`;

const GYRO_ANIMATE_HOOK = `
      // 4b. High-Sensitivity Gyroscope Tilt & Holographic Depth
      if (gyroActive && !isUserDragging && modelGroup) {
        currentGyroRotX += (gyroTargetRotX - currentGyroRotX) * 0.12;
        currentGyroCamY += (gyroTargetCamY - currentGyroCamY) * 0.12;
        modelGroup.rotation.z = -currentGyroRotX * 0.25; // Subtle suit lean
        camera.position.x = currentGyroRotX * 0.35;
        camera.position.y = baseCamY + currentGyroCamY;
        camera.lookAt(0, -0.25, 0);
      }
`;

for (const sf of studioFiles) {
  if (fs.existsSync(sf)) {
    let ssrc = fs.readFileSync(sf, 'utf8');
    if (!ssrc.includes('handleStudioGyro')) {
      // Inject setup right before animate()
      ssrc = ssrc.replace('function animate() {', GYRO_SETUP + '\n    function animate() {');
      // Inject inside animate() right before renderer.render
      ssrc = ssrc.replace('renderer.render(scene, camera);', GYRO_ANIMATE_HOOK + '\n      renderer.render(scene, camera);');
      // Also clean up listener in cleanup function
      if (ssrc.includes('window.removeEventListener(\'resize\', onResize);')) {
        ssrc = ssrc.replace(
          "window.removeEventListener('resize', onResize);",
          "window.removeEventListener('resize', onResize);\n        window.removeEventListener('deviceorientation', handleStudioGyro, true);"
        );
      }
      fs.writeFileSync(sf, ssrc, 'utf8');
      console.log('✅ Injected mobile gyroscope tilt in:', path.relative(__dirname, sf));
    } else {
      console.log('ℹ Gyro already present in:', path.relative(__dirname, sf));
    }
  }
}

console.log('Done.');

