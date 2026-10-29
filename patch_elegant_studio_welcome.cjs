/**
 * patch_elegant_studio_welcome.cjs
 * Replaces the video welcome layer with the Simple & Elegant Glass Title Card:
 * - Deep Obsidian Stage (#030712) with subtle radial cyan glow
 * - Minimalist frosted glass card (backdrop-filter: blur(24px), hairline border)
 * - Top Pill: ● SANTO STARK STUDIO (tracking: 0.25em)
 * - Main Title: "Welcome to the Studio" (silver-white to cyan metallic gradient)
 * - Subtitle: "Creative Studio"
 * - 3-Second Hairline Progress Line (1.5px, glowing cyan, 0% -> 100% in 3.0s)
 * - Transition: Soft scale-up (1.04) and silky smooth dissolve out
 * - ZERO video file or player dependencies
 */

const fs = require('fs');
const path = require('path');

const ELEGANT_WELCOME_CODE = `
// ── ✨ Simple & Elegant Studio Welcome Transition (3 Seconds) ──────────────────
(function initStudioWelcomeTransition() {
  if (typeof window === 'undefined') return;

  let activeOverlay = null;

  function isStudioPage() {
    return window.location.pathname.toLowerCase().includes('/studio');
  }

  function playStudioWelcome(force) {
    if (!isStudioPage() && !force) return;
    if (activeOverlay) return; // Already running

    // Check if seen in this session (unless forced via ?replay=1)
    const urlParams = new URLSearchParams(window.location.search);
    const shouldReplay = urlParams.get('replay') === '1' || force;
    if (!shouldReplay && sessionStorage.getItem('stark_studio_intro_seen') === 'true') {
      return;
    }

    // 1. Deep Obsidian Stage (#030712) with subtle radial cyan glow
    const overlay = document.createElement('div');
    overlay.id = 'stark-studio-welcome-overlay';
    overlay.style.cssText = [
      'position: fixed', 'inset: 0', 'z-index: 99999',
      'background: radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.12) 0%, #030712 65%, #02050e 100%)',
      'display: flex', 'align-items: center', 'justify-content: center',
      'padding: 24px', 'overflow: hidden',
      'transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      'opacity: 1'
    ].join(';');

    // 2. The Floating Glass Title Card
    const card = document.createElement('div');
    card.style.cssText = [
      'position: relative', 'width: 100%', 'max-width: 480px',
      'background: rgba(10, 16, 32, 0.68)',
      'backdrop-filter: blur(24px)', '-webkit-backdrop-filter: blur(24px)',
      'border: 1px solid rgba(255, 255, 255, 0.12)',
      'border-radius: 28px', 'padding: 44px 38px',
      'display: flex', 'flex-direction: column', 'align-items: center',
      'text-align: center',
      'box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 0 45px rgba(0, 229, 255, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
      'transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      'transform: scale(0.97)', 'opacity: 0'
    ].join(';');

    // Top Pill: ● SANTO STARK STUDIO (tracking: 0.25em)
    const topPill = document.createElement('div');
    topPill.innerHTML = '<span style=\"color:#00e5ff;margin-right:8px;font-size:9px;vertical-align:middle;display:inline-block;box-shadow:0 0 8px #00e5ff;border-radius:50%;\">●</span>SANTO STARK STUDIO';
    topPill.style.cssText = [
      'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'font-size: 11px', 'font-weight: 700', 'color: #94a3b8',
      'letter-spacing: 0.25em', 'text-transform: uppercase',
      'margin-bottom: 18px', 'display: inline-flex', 'align-items: center'
    ].join(';');

    // Main Title: Welcome to the Studio (silver-white to cyan metallic sheen gradient)
    const mainTitle = document.createElement('h1');
    mainTitle.innerText = 'Welcome to the Studio';
    mainTitle.style.cssText = [
      'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'font-size: 34px', 'font-weight: 800', 'line-height: 1.18',
      'background: linear-gradient(135deg, #ffffff 35%, #e2e8f0 60%, #a5f3fc 100%)',
      '-webkit-background-clip: text', '-webkit-text-fill-color: transparent',
      'margin: 0 0 10px 0', 'letter-spacing: -0.02em',
      'filter: drop-shadow(0 2px 20px rgba(165, 243, 252, 0.25))'
    ].join(';');

    // Subtitle: Creative Studio in light, refined typography
    const subtitle = document.createElement('p');
    subtitle.innerText = 'Creative Studio';
    subtitle.style.cssText = [
      'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'font-size: 14px', 'font-weight: 400', 'color: #94a3b8',
      'letter-spacing: 0.05em', 'margin: 0 0 30px 0'
    ].join(';');

    // 3-Second Hairline Progress Line (1.5px delicate bar)
    const progressTrack = document.createElement('div');
    progressTrack.style.cssText = [
      'width: 100%', 'max-width: 200px', 'height: 1.5px',
      'background: rgba(255, 255, 255, 0.12)', 'border-radius: 9999px',
      'overflow: hidden', 'position: relative'
    ].join(';');

    const progressFill = document.createElement('div');
    progressFill.style.cssText = [
      'width: 0%', 'height: 100%',
      'background: linear-gradient(90deg, #00e5ff, #38bdf8)',
      'box-shadow: 0 0 10px #00e5ff',
      'transition: width 3.0s cubic-bezier(0.25, 1, 0.5, 1)'
    ].join(';');

    progressTrack.appendChild(progressFill);

    card.appendChild(topPill);
    card.appendChild(mainTitle);
    card.appendChild(subtitle);
    card.appendChild(progressTrack);

    overlay.appendChild(card);
    document.body.appendChild(overlay);
    activeOverlay = overlay;

    // Smooth card entry animation
    requestAnimationFrame(function() {
      card.style.transform = 'scale(1)';
      card.style.opacity = '1';
      // Trigger the 3.0s hairline progress
      requestAnimationFrame(function() {
        progressFill.style.width = '100%';
      });
    });

    let finished = false;
    function finishWelcome() {
      if (finished) return;
      finished = true;
      sessionStorage.setItem('stark_studio_intro_seen', 'true');
      // Silky Smooth Dissolve: card softly expands and dissolves away into air
      card.style.transform = 'scale(1.04)';
      card.style.opacity = '0';
      overlay.style.opacity = '0';
      setTimeout(function() {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        activeOverlay = null;
      }, 600);
    }

    // Dismiss on click/tap if desired
    overlay.onclick = finishWelcome;

    // Auto-transition after exactly 3.0 seconds
    setTimeout(finishWelcome, 3000);
  }

  // Hook into navigation events
  function checkNav() {
    if (isStudioPage()) {
      playStudioWelcome(false);
    }
  }

  const origPushState = history.pushState;
  history.pushState = function() {
    origPushState.apply(this, arguments);
    setTimeout(checkNav, 50);
  };
  const origReplaceState = history.replaceState;
  history.replaceState = function() {
    origReplaceState.apply(this, arguments);
    setTimeout(checkNav, 50);
  };
  window.addEventListener('popstate', checkNav);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkNav);
  } else {
    checkNav();
  }
})();
// ── End Simple & Elegant Studio Welcome Transition ───────────────────────────
`;

const TARGETS = [
  path.join(__dirname, 'public', 'assets', 'stark-content-engine.js'),
  path.join(__dirname, 'assets', 'stark-content-engine.js'),
  path.join(__dirname, 'source-code', 'public', 'assets', 'stark-content-engine.js')
];

for (const target of TARGETS) {
  if (!fs.existsSync(target)) continue;
  let src = fs.readFileSync(target, 'utf8');

  // Remove old initStudioWelcomePipeline if present
  if (src.includes('initStudioWelcomePipeline')) {
    const startIdx = src.indexOf('// ── 🎬 Studio 3-Second Welcome Video');
    const endMarker = '// ── End Studio Welcome Pipeline ──────────────────────────────────────────────';
    const endIdx = src.indexOf(endMarker);
    if (startIdx !== -1 && endIdx !== -1) {
      src = src.slice(0, startIdx) + src.slice(endIdx + endMarker.length);
      console.log('✔ Removed old video welcome pipeline from:', path.relative(__dirname, target));
    }
  }

  // Also remove old initStudioWelcomeTransition if present
  if (src.includes('initStudioWelcomeTransition')) {
    const startIdx = src.indexOf('// ── ✨ Simple & Elegant Studio Welcome Transition');
    const endMarker = '// ── End Simple & Elegant Studio Welcome Transition ───────────────────────────';
    const endIdx = src.indexOf(endMarker);
    if (startIdx !== -1 && endIdx !== -1) {
      src = src.slice(0, startIdx) + src.slice(endIdx + endMarker.length);
    }
  }

  // Append new elegant welcome transition
  src = src.trim() + '\n' + ELEGANT_WELCOME_CODE;
  fs.writeFileSync(target, src, 'utf8');
  console.log('✅ Injected Simple & Elegant Welcome Transition into:', path.relative(__dirname, target));
}

console.log('Done.');

