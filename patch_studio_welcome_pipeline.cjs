/**
 * patch_studio_welcome_pipeline.cjs
 * Injects the Studio 3-Second Welcome Video & 3D Preloader Pipeline into:
 *  - public/assets/stark-content-engine.js
 *  - assets/stark-content-engine.js
 *  - source-code/public/assets/stark-content-engine.js
 */

const fs = require('fs');
const path = require('path');

const WELCOME_PIPELINE_CODE = `
// ── 🎬 Studio 3-Second Welcome Video & 3D Preloader Pipeline ──────────────────
(function initStudioWelcomePipeline() {
  if (typeof window === 'undefined') return;

  let activeOverlay = null;

  function isStudioPage() {
    return window.location.pathname.toLowerCase().includes('/studio');
  }

  function playStudioWelcome(force) {
    if (!isStudioPage() && !force) return;
    if (activeOverlay) return; // Already playing

    // Check if seen in this session (unless forced via ?replay=1 or replay button)
    const urlParams = new URLSearchParams(window.location.search);
    const shouldReplay = urlParams.get('replay') === '1' || force;
    if (!shouldReplay && sessionStorage.getItem('stark_studio_intro_seen') === 'true') {
      return;
    }

    // Create Full-Screen Cinematic Welcome Overlay
    const overlay = document.createElement('div');
    overlay.id = 'stark-studio-welcome-overlay';
    overlay.style.cssText = [
      'position: fixed', 'inset: 0', 'z-index: 99999',
      'background: #040814', 'display: flex', 'align-items: center',
      'justify-content: center', 'overflow: hidden',
      'transition: opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      'opacity: 1'
    ].join(';');

    // Video Element
    const video = document.createElement('video');
    video.src = '/assets/studio-welcome.mp4';
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.style.cssText = [
      'width: 100%', 'height: 100%', 'object-fit: cover',
      'pointer-events: none', 'filter: contrast(1.08) brightness(1.02)'
    ].join(';');

    // Skip Intro Pill Button
    const skipBtn = document.createElement('button');
    skipBtn.innerHTML = 'SKIP INTRO ⏭';
    skipBtn.style.cssText = [
      'position: absolute', 'top: 24px', 'right: 28px', 'z-index: 10',
      'padding: 8px 18px', 'border-radius: 9999px',
      'background: rgba(4, 12, 28, 0.75)', 'border: 1px solid rgba(0, 229, 255, 0.5)',
      'color: #00e5ff', 'font-family: monospace', 'font-size: 11px',
      'font-weight: 700', 'letter-spacing: 0.1em', 'cursor: pointer',
      'backdrop-filter: blur(12px)', 'box-shadow: 0 0 15px rgba(0, 229, 255, 0.25)',
      'transition: all 0.2s ease'
    ].join(';');
    skipBtn.onmouseenter = function() {
      skipBtn.style.background = 'rgba(0, 229, 255, 0.2)';
      skipBtn.style.transform = 'scale(1.05)';
    };
    skipBtn.onmouseleave = function() {
      skipBtn.style.background = 'rgba(4, 12, 28, 0.75)';
      skipBtn.style.transform = 'scale(1)';
    };

    // Bottom Stark Telemetry HUD
    const hudContainer = document.createElement('div');
    hudContainer.style.cssText = [
      'position: absolute', 'bottom: 34px', 'left: 50%',
      'transform: translateX(-50%)', 'width: 90%', 'max-width: 480px',
      'z-index: 10', 'display: flex', 'flex-direction: column', 'gap: 8px',
      'pointer-events: none', 'text-align: center'
    ].join(';');

    const hudText = document.createElement('div');
    hudText.innerHTML = '<span style=\"color:#00e5ff;animation:pulse 1.2s infinite;\">●</span> INITIALIZING MARK VII PROTOCOL // PRE-WARMING 3D ASSETS';
    hudText.style.cssText = [
      'color: #94a3b8', 'font-family: monospace', 'font-size: 11px',
      'letter-spacing: 0.08em', 'font-weight: 600',
      'text-shadow: 0 0 10px rgba(0, 229, 255, 0.6)'
    ].join(';');

    const barTrack = document.createElement('div');
    barTrack.style.cssText = [
      'width: 100%', 'height: 3px', 'background: rgba(255, 255, 255, 0.15)',
      'border-radius: 9999px', 'overflow: hidden', 'box-shadow: inset 0 1px 2px rgba(0,0,0,0.5)'
    ].join(';');

    const barFill = document.createElement('div');
    barFill.style.cssText = [
      'width: 0%', 'height: 100%',
      'background: linear-gradient(90deg, #00e5ff, #818cf8)',
      'box-shadow: 0 0 12px #00e5ff',
      'transition: width 3.0s cubic-bezier(0.2, 0.8, 0.2, 1)'
    ].join(';');

    barTrack.appendChild(barFill);
    hudContainer.appendChild(hudText);
    hudContainer.appendChild(barTrack);

    overlay.appendChild(video);
    overlay.appendChild(skipBtn);
    overlay.appendChild(hudContainer);

    document.body.appendChild(overlay);
    activeOverlay = overlay;

    // Start progress bar animation after mount
    requestAnimationFrame(function() {
      barFill.style.width = '100%';
    });

    let finished = false;
    function finishWelcome() {
      if (finished) return;
      finished = true;
      sessionStorage.setItem('stark_studio_intro_seen', 'true');
      overlay.style.opacity = '0';
      setTimeout(function() {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        activeOverlay = null;
      }, 500);
    }

    skipBtn.onclick = finishWelcome;

    // Trigger finish automatically after 3.0 seconds
    const autoTimer = setTimeout(finishWelcome, 3000);

    video.onended = function() {
      clearTimeout(autoTimer);
      finishWelcome();
    };
  }

  // Hook into navigation events
  function checkNav() {
    if (isStudioPage()) {
      playStudioWelcome(false);
    }
  }

  // Monkey-patch history pushState / replaceState to detect SPA route change to /studio
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

  // Global manual trigger
  window.starkPlayStudioIntro = function() {
    playStudioWelcome(true);
  };
})();
// ── End Studio Welcome Pipeline ──────────────────────────────────────────────
`;

const TARGETS = [
  path.join(__dirname, 'public', 'assets', 'stark-content-engine.js'),
  path.join(__dirname, 'assets', 'stark-content-engine.js'),
  path.join(__dirname, 'source-code', 'public', 'assets', 'stark-content-engine.js')
];

for (const target of TARGETS) {
  if (!fs.existsSync(target)) continue;
  let src = fs.readFileSync(target, 'utf8');
  if (src.includes('initStudioWelcomePipeline')) {
    console.log('ℹ Pipeline already injected in:', path.relative(__dirname, target));
    continue;
  }
  src = src + '\n' + WELCOME_PIPELINE_CODE;
  fs.writeFileSync(target, src, 'utf8');
  console.log('✅ Injected welcome pipeline into:', path.relative(__dirname, target));
}

console.log('Done.');
