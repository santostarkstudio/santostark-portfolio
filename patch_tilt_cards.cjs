/**
 * patch_tilt_cards.cjs
 * Injects a standalone Desktop 3D Tilt Card engine into stark-content-engine.js
 * The engine:
 *  - On desktop only (no touch), adds perspective tilt + glint sweep on project cards
 *  - Uses MutationObserver to detect when Studio page loads its project cards
 *  - Pure CSS transform approach (no Three.js needed)
 *  - Syncs to all 3 asset locations
 */

const fs = require('fs');
const path = require('path');

const TILT_CODE = `

// ── Desktop 3D Tilt Card Engine (Phase 3) ────────────────────────────────────
// Applies on desktop only; skipped on touch devices.
// Targets: .glass-card elements on /studio page.
(function initTiltCards() {
  if (typeof window === 'undefined') return;
  // Skip touch / mobile devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024) return;

  const INTENSITY = 10; // max tilt degrees
  const SCALE = 1.025;  // scale on hover

  function applyTilt(card) {
    if (card.__tiltAttached) return;
    card.__tiltAttached = true;
    card.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
    card.style.willChange = 'transform';
    card.style.transformStyle = 'preserve-3d';

    // Glint overlay
    const glint = document.createElement('div');
    glint.style.cssText = [
      'position:absolute', 'inset:0', 'pointer-events:none', 'border-radius:inherit',
      'background:linear-gradient(135deg,rgba(255,255,255,0.10) 0%,transparent 60%)',
      'opacity:0', 'transition:opacity 0.2s ease', 'z-index:2'
    ].join(';');
    const posOrig = window.getComputedStyle(card).position;
    if (posOrig === 'static') card.style.position = 'relative';
    card.appendChild(glint);

    card.addEventListener('mousemove', function(e) {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width / 2;
      const cy = r.height / 2;
      const rotY = ((x - cx) / cx) * INTENSITY;
      const rotX = -((y - cy) / cy) * INTENSITY;
      card.style.transform = 'perspective(900px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(' + SCALE + ')';
      card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(0,229,255,0.08)';
      glint.style.opacity = '1';
      // Move glint sweep
      const gx = (x / r.width) * 100;
      const gy = (y / r.height) * 100;
      glint.style.background = 'radial-gradient(ellipse at ' + gx + '% ' + gy + '%, rgba(255,255,255,0.13) 0%, transparent 65%)';
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.boxShadow = '';
      glint.style.opacity = '0';
    });
  }

  function attachToCards() {
    const cards = document.querySelectorAll('.glass-card:not([data-tilt-skip])');
    cards.forEach(applyTilt);
  }

  // Run on page load and whenever DOM changes (React SPA navigation)
  function observe() {
    attachToCards();
    const obs = new MutationObserver(function() { attachToCards(); });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observe);
  } else {
    observe();
  }
})();
// ── End Desktop 3D Tilt Card Engine ──────────────────────────────────────────
`;

const TARGETS = [
  path.join(__dirname, 'public', 'assets', 'stark-content-engine.js'),
  path.join(__dirname, 'assets', 'stark-content-engine.js'),
  path.join(__dirname, 'source-code', 'public', 'assets', 'stark-content-engine.js'),
];

let ok = true;
for (const target of TARGETS) {
  if (!fs.existsSync(target)) { console.warn('  ⚠ Not found: ' + target); continue; }
  let src = fs.readFileSync(target, 'utf8');
  if (src.includes('initTiltCards')) {
    console.log('  ℹ Already patched: ' + path.basename(target));
    continue;
  }
  // Append before the final closing line
  if (src.endsWith('})();')) {
    src = src.slice(0, -5) + '})();' + TILT_CODE;
  } else {
    src = src + TILT_CODE;
  }
  fs.writeFileSync(target, src, 'utf8');
  console.log('  ✅ Tilt engine injected: ' + path.relative(__dirname, target));
}

console.log('\nDone.');
