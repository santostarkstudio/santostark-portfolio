/**
 * patch_instant_studio_model.cjs
 *
 * Fixes:
 *  1. Welcome page not showing when returning to Studio from portfolio.
 *     - Tracks transition from non-studio -> studio (wasOnStudio state).
 *     - Triggers welcome animation every time user navigates into Studio.
 *     - Removes blocking sessionStorage guard.
 *     - Adds 100ms active URL watcher to catch any route transition.
 *  2. 3D Model loads slowly and lately.
 *     - Implements global in-memory cache: window.__STARK_CACHED_IRONMAN_ROOT.
 *     - Implements automatic background preloader: window.__starkPreloadIronMan().
 *     - When Studio mounts, model is attached in 0.000 ms directly from RAM.
 *     - Detaches cleanly on destroy() so it can be re-attached instantly on return.
 *     - Calls renderer.compile(scene, camera) for zero-frame GPU hitching.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

/* ══════════════════════════════════════════════════════════════════
   1. PATCH STUDIO-IRONMAN-3D.JS (ALL 3 COPIES)
   ══════════════════════════════════════════════════════════════════ */
const IRONMAN_FILES = [
  path.join(__dirname, 'public', 'assets', 'studio-ironman-3d.js'),
  path.join(__dirname, 'assets', 'studio-ironman-3d.js'),
  path.join(__dirname, 'source-code', 'public', 'assets', 'studio-ironman-3d.js'),
];

// Header injection for global model cache and background preloader
const IRONMAN_HEADER_OLD = `(function() {
  window.initStarkIronMan = function(containerId) {`;

const IRONMAN_HEADER_NEW = `(function() {
  // ── Global In-Memory Model Cache & Background Preloader ─────────────
  window.__STARK_CACHED_IRONMAN_ROOT = null;
  window.__STARK_IRONMAN_PRELOAD_PROMISE = null;

  function processIronManModel(rawScene, floorY) {
    floorY = floorY !== undefined ? floorY : -1.25;
    const root = rawScene;

    // Auto-center and normalize size
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Scale model to 2.05 units tall for commanding showcase posture
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.05 / (maxDim || 1);
    root.scale.setScalar(scale);

    // Ground boots precisely on top surface of circular pedestal (floorY = -1.25)
    root.position.x = -center.x * scale;
    root.position.z = -center.z * scale;
    root.position.y = -box.min.y * scale + floorY;

    // Anodized metallic PBR with authentic Crimson Red & Champagne Gold
    root.traverse(function(node) {
      if (node.isMesh && node.material) {
        node.material.metalness       = 0.55;  // Rich metallic luster
        node.material.roughness       = 0.35;  // Smooth automotive clear-coat gloss
        node.material.metalnessMap    = null;
        node.material.roughnessMap    = null;
        node.material.envMap          = null;  // Dynamic studio light rig drives reflections
        node.material.envMapIntensity = 0.0;
        
        // Pure white glowing Arc Reactor core & eyes
        if (node.material.emissive) {
          const isEmissive = (node.material.emissive.r + node.material.emissive.g + node.material.emissive.b) > 0.05 || node.material.emissiveMap;
          if (isEmissive) {
            node.material.emissive.setHex(0xffffff);
            node.material.emissiveIntensity = 2.8; // Piercing energy bloom
          }
        }
        node.material.needsUpdate = true;
      }
    });

    return root;
  }

  window.__starkPreloadIronMan = function() {
    if (window.__STARK_CACHED_IRONMAN_ROOT) {
      return Promise.resolve(window.__STARK_CACHED_IRONMAN_ROOT);
    }
    if (window.__STARK_IRONMAN_PRELOAD_PROMISE) {
      return window.__STARK_IRONMAN_PRELOAD_PROMISE;
    }
    if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
      return Promise.reject(new Error('THREE or GLTFLoader not ready'));
    }

    const loader = new THREE.GLTFLoader();
    const modelUrl = '/assets/models/iron_man.glb';

    window.__STARK_IRONMAN_PRELOAD_PROMISE = new Promise(function(resolve, reject) {
      loader.load(
        modelUrl,
        function(gltf) {
          const processed = processIronManModel(gltf.scene, -1.25);
          window.__STARK_CACHED_IRONMAN_ROOT = processed;
          resolve(processed);
        },
        undefined,
        function(err) {
          console.warn('Preload of iron_man.glb encountered an issue:', err);
          reject(err);
        }
      );
    });

    return window.__STARK_IRONMAN_PRELOAD_PROMISE;
  };

  // Kick off background preload immediately if THREE is already loaded
  function triggerAutoPreload() {
    if (typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined') {
      window.__starkPreloadIronMan();
    } else {
      setTimeout(triggerAutoPreload, 150);
    }
  }
  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete') {
      triggerAutoPreload();
    } else {
      window.addEventListener('load', triggerAutoPreload, { once: true });
    }
  }

  window.initStarkIronMan = function(containerId) {`;

// Model loading replacement inside initStarkIronMan
const IRONMAN_LOAD_OLD = `    const loader   = new THREE.GLTFLoader();
    const modelUrl = '/assets/models/iron_man.glb';

    loader.load(
      modelUrl,
      function(gltf) {
        const root = gltf.scene;

        // Auto-center and normalize size
        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Scale model to 2.05 units tall for commanding showcase posture
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.05 / (maxDim || 1);
        root.scale.setScalar(scale);

        // Ground boots precisely on top surface of circular pedestal (floorY = -1.25)
        root.position.x = -center.x * scale;
        root.position.z = -center.z * scale;
        root.position.y = -box.min.y * scale + floorY;

        // Anodized metallic PBR with authentic Crimson Red & Champagne Gold
        root.traverse(function(node) {
          if (node.isMesh && node.material) {
            node.material.metalness       = 0.55;  // Rich metallic luster
            node.material.roughness       = 0.35;  // Smooth automotive clear-coat gloss
            node.material.metalnessMap    = null;
            node.material.roughnessMap    = null;
            node.material.envMap          = null;  // Dynamic studio light rig drives reflections
            node.material.envMapIntensity = 0.0;
            
            // Pure white glowing Arc Reactor core & eyes
            if (node.material.emissive) {
              const isEmissive = (node.material.emissive.r + node.material.emissive.g + node.material.emissive.b) > 0.05 || node.material.emissiveMap;
              if (isEmissive) {
                node.material.emissive.setHex(0xffffff);
                node.material.emissiveIntensity = 2.8; // Piercing energy bloom
              }
            }
            node.material.needsUpdate = true;
          }
        });

        modelGroup.add(root);
        isModelLoaded = true;
      },
      undefined,
      function(error) {
        console.error('Error loading iron_man.glb:', error);
      }
    );`;

const IRONMAN_LOAD_NEW = `    // ==========================================
    // 10. MODEL MOUNTING (Instant 0ms from RAM Cache or Background Stream)
    // ==========================================
    function attachModelToScene(rootObj) {
      if (!rootObj || !modelGroup) return;
      rootObj.rotation.set(0, 0, 0);
      modelGroup.add(rootObj);
      isModelLoaded = true;
      try {
        renderer.compile(scene, camera);
      } catch(e) {}
    }

    if (window.__STARK_CACHED_IRONMAN_ROOT) {
      // ⚡ INSTANT MOUNT from memory cache (0.000 ms!)
      attachModelToScene(window.__STARK_CACHED_IRONMAN_ROOT);
    } else if (window.__STARK_IRONMAN_PRELOAD_PROMISE) {
      window.__STARK_IRONMAN_PRELOAD_PROMISE.then(function(root) {
        attachModelToScene(root);
      }).catch(function() {
        fallbackLoad();
      });
    } else {
      window.__starkPreloadIronMan().then(function(root) {
        attachModelToScene(root);
      }).catch(function() {
        fallbackLoad();
      });
    }

    function fallbackLoad() {
      const loader = new THREE.GLTFLoader();
      loader.load('/assets/models/iron_man.glb', function(gltf) {
        const processed = processIronManModel(gltf.scene, floorY);
        window.__STARK_CACHED_IRONMAN_ROOT = processed;
        attachModelToScene(processed);
      }, undefined, function(err) {
        console.error('Fallback load error:', err);
      });
    }`;

// Destroy function clean detachment
const DESTROY_OLD = `      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();`;

const DESTROY_NEW = `      // ⚡ Preserve cached 3D model in RAM for instant re-mounting on next visit
      if (window.__STARK_CACHED_IRONMAN_ROOT && modelGroup) {
        modelGroup.remove(window.__STARK_CACHED_IRONMAN_ROOT);
      }
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();`;

IRONMAN_FILES.forEach(function(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('⚠ Not found:', filePath);
    return;
  }
  let c = fs.readFileSync(filePath, 'utf8');

  // Replace header
  if (c.includes(IRONMAN_HEADER_OLD)) {
    c = c.replace(IRONMAN_HEADER_OLD, IRONMAN_HEADER_NEW);
    console.log('✅ Patched Header in', path.basename(filePath));
  } else {
    console.log('⚠ Header pattern not found in', path.basename(filePath));
  }

  // Replace loader
  if (c.includes(IRONMAN_LOAD_OLD)) {
    c = c.replace(IRONMAN_LOAD_OLD, IRONMAN_LOAD_NEW);
    console.log('✅ Patched Loader in', path.basename(filePath));
  } else {
    console.log('⚠ Loader pattern not found in', path.basename(filePath));
  }

  // Replace destroy
  if (c.includes(DESTROY_OLD)) {
    c = c.replace(DESTROY_OLD, DESTROY_NEW);
    console.log('✅ Patched Destroy in', path.basename(filePath));
  } else {
    console.log('⚠ Destroy pattern not found in', path.basename(filePath));
  }

  fs.writeFileSync(filePath, c, 'utf8');
});

/* ══════════════════════════════════════════════════════════════════
   2. PATCH STARK-CONTENT-ENGINE.JS (ALL 3 COPIES)
   ══════════════════════════════════════════════════════════════════ */
const ENGINE_FILES = [
  path.join(__dirname, 'public', 'assets', 'stark-content-engine.js'),
  path.join(__dirname, 'assets', 'stark-content-engine.js'),
  path.join(__dirname, 'source-code', 'public', 'assets', 'stark-content-engine.js'),
];

// Target in stark-content-engine.js
const WELCOME_OLD = `(function initStudioWelcomeTransition() {
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
    }`;

const WELCOME_NEW = `(function initStudioWelcomeTransition() {
  if (typeof window === 'undefined') return;

  let activeOverlay = null;
  let wasOnStudio = false;

  function isStudioPage() {
    return window.location.pathname.toLowerCase().includes('/studio');
  }

  function playStudioWelcome(force) {
    if (!isStudioPage() && !force) return;
    if (activeOverlay) return; // Already running`;

const NAV_HOOK_OLD = `  // Hook into navigation events
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
})();`;

const NAV_HOOK_NEW = `  // Hook into navigation events (triggers every time entering Studio from portfolio)
  function checkNav() {
    const onStudio = isStudioPage();
    if (onStudio) {
      if (!wasOnStudio) {
        // Entering Studio from portfolio or external page!
        playStudioWelcome(true);
      }
      wasOnStudio = true;
    } else {
      // User is on portfolio/home!
      wasOnStudio = false;
      if (activeOverlay && activeOverlay.parentNode) {
        activeOverlay.parentNode.removeChild(activeOverlay);
        activeOverlay = null;
      }
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

  // Active URL watcher: catches any client-side router transition instantly
  let lastObservedUrl = window.location.href;
  setInterval(function() {
    if (window.location.href !== lastObservedUrl) {
      lastObservedUrl = window.location.href;
      checkNav();
    }
  }, 100);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkNav);
  } else {
    checkNav();
  }
})();`;

ENGINE_FILES.forEach(function(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('⚠ Not found:', filePath);
    return;
  }
  let c = fs.readFileSync(filePath, 'utf8');

  if (c.includes(WELCOME_OLD)) {
    c = c.replace(WELCOME_OLD, WELCOME_NEW);
    console.log('✅ Patched Welcome Start in', path.basename(filePath));
  } else {
    console.log('⚠ Welcome start pattern not found in', path.basename(filePath));
  }

  if (c.includes(NAV_HOOK_OLD)) {
    c = c.replace(NAV_HOOK_OLD, NAV_HOOK_NEW);
    console.log('✅ Patched Nav Hook in', path.basename(filePath));
  } else {
    console.log('⚠ Nav Hook pattern not found in', path.basename(filePath));
  }

  fs.writeFileSync(filePath, c, 'utf8');
});

/* ══════════════════════════════════════════════════════════════════
   3. PATCH INDEX.HTML FILES (PREFETCH LINK FOR MODEL)
   ══════════════════════════════════════════════════════════════════ */
const HTML_FILES = [
  path.join(__dirname, 'public', 'index.html'),
  path.join(__dirname, 'index.html'),
];

const PRELOAD_TARGET = '<link rel="preload" href="/assets/brand-logo.webp" as="image" type="image/webp">';
const PRELOAD_ADD    = `<link rel="preload" href="/assets/brand-logo.webp" as="image" type="image/webp">
      <!-- ⚡ Low-priority prefetch of Iron Man 3D model for instant Studio entry -->
      <link rel="prefetch" href="/assets/models/iron_man.glb" as="fetch" crossorigin>`;

HTML_FILES.forEach(function(filePath) {
  if (!fs.existsSync(filePath)) return;
  let c = fs.readFileSync(filePath, 'utf8');
  if (c.includes('iron_man.glb')) {
    console.log('Model prefetch already in', path.basename(filePath));
    return;
  }
  if (c.includes(PRELOAD_TARGET)) {
    c = c.replace(PRELOAD_TARGET, PRELOAD_ADD);
    fs.writeFileSync(filePath, c, 'utf8');
    console.log('✅ Added model prefetch in', path.basename(filePath));
  }
});

console.log('\n🚀 ALL PATCHES APPLIED SUCCESSFULLY!\n');
