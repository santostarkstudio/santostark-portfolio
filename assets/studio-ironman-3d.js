/**
 * studio-ironman-3d.js
 * Photorealistic Stark Lab Showcase 3D Engine
 * 
 * Includes Hollywood VFX Depth-Sandwiched Foreground Atmosphere:
 * 1. Idea A: Forward Holographic Projection Cone Veil (#00e5ff additive haze in front of chest & armor)
 * 2. Idea B: Pedestal Vent Vapor & Lower Atmosphere (cool cyan wisps curling up in front of boots)
 * 3. Foreground 3D Dust Particle Field (75 floating motes with brownian drift between lens and suit)
 * 4. Volumetric Overhead Downward Light Beam (angled light shaft passing across front of suit)
 * 5. Accurate Grounding: Boots planted firmly on circular pedestal (floorY = -1.25)
 * 6. True Metallic Colors: Rich Crimson Red & Champagne Gold (natural studio key light, zero green distortion)
 */
(function() {
  window.initStarkIronMan = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    // Clean up any existing canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    if (typeof THREE === 'undefined') {
      console.warn('Three.js not yet loaded for Iron Man viewer');
      return null;
    }

    const width  = container.clientWidth  || window.innerWidth;
    const height = container.clientHeight || window.innerHeight || 720;

    // ==========================================
    // 1. SCENE & CAMERA (Exact Pedestal Perspective)
    // ==========================================
    const scene = new THREE.Scene();
    scene.background = null; // Transparent to show photorealistic lab background

    // Subtle atmospheric room depth
    scene.fog = new THREE.FogExp2(0x0a141e, 0.018);

    // 40mm cinematic camera with slight downward tilt aligned with pedestal
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    
    // Responsive Camera Auto-Framing (Adaptive FOV for Mobile & Tablet Portrait)
    function updateResponsiveCamera(w, h) {
      const aspect = w / h;
      if (aspect < 1.0) {
        // Vertical mobile/tablet screen: widen FOV from 40 to ~54 degrees
        // so full pedestal and Iron Man fit vertically without side cutoffs
        camera.fov = Math.min(56, 40 / Math.max(0.68, aspect));
        camera.position.set(0, 0.05 + (1 - aspect) * 0.12, 3.95);
        camera.lookAt(0, -0.22, 0);
      } else {
        // Desktop / Laptop widescreen:
        camera.fov = 40;
        camera.position.set(0, 0.05, 3.95);
        camera.lookAt(0, -0.25, 0);
      }
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }
    updateResponsiveCamera(width, height);

    // ==========================================
    // 2. RENDERER (ACES Filmic & High Dynamic Range)
    // ==========================================
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (renderer.outputColorSpace !== undefined) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08; // Elegant cinema film contrast
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    // ==========================================
    // 3. ELEGANT REALISTIC STUDIO LIGHTING RIG
    // (Natural warm key light to preserve rich red & gold armor, NO green tint)
    // ==========================================

    // A. Natural balanced ambient fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    // B. FRONT BEAUTY KEY LIGHT (Warm white, highly flattering on crimson & gold)
    const frontKeyLight = new THREE.DirectionalLight(0xfff6ec, 2.6);
    frontKeyLight.position.set(0.8, 1.8, 3.8);
    frontKeyLight.target.position.set(0, -0.2, 0);
    scene.add(frontKeyLight);
    scene.add(frontKeyLight.target);

    // C. SOFT FRONT-LEFT FILL LIGHT (Softens shadows, evens out specular rolloff)
    const frontFillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    frontFillLight.position.set(-1.8, 1.4, 3.2);
    frontFillLight.target.position.set(0, -0.2, 0);
    scene.add(frontFillLight);
    scene.add(frontFillLight.target);

    // D. OVERHEAD CEILING LIGHT (Simulates the two large overhead ceiling lamps)
    const overheadLight = new THREE.DirectionalLight(0xf4fbff, 1.8);
    overheadLight.position.set(0, 5.0, 0.8);
    overheadLight.target.position.set(0, -0.3, 0);
    scene.add(overheadLight);
    scene.add(overheadLight.target);

    // E. REAR SILHOUETTE RIM LIGHT (Crisp edge separation against dark lab)
    const backRimLight = new THREE.DirectionalLight(0x7dd3fc, 1.0);
    backRimLight.position.set(0, 1.6, -2.8);
    backRimLight.target.position.set(0, -0.2, 0);
    scene.add(backRimLight);
    scene.add(backRimLight.target);

    // F. SUBTLE CYAN FLOOR RIM (Softly mimics pedestal LED ring without contaminating front colors)
    const pedestalRimLight = new THREE.PointLight(0x38bdf8, 1.2, 2.8, 1.6);
    pedestalRimLight.position.set(0, -1.30, -0.2); // Placed low & slightly behind feet
    scene.add(pedestalRimLight);

    // ==========================================
    // 4. MODEL GROUP & PEDESTAL FLOOR HEIGHT
    // ==========================================
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Exact pedestal surface level: -1.25 units
    // Aligns boots directly onto the center disc of the circular pedestal
    const floorY = -1.25;

    // ==========================================
    // 5. CONTACT SHADOW ON PEDESTAL
    // ==========================================
    function createContactShadowTexture() {
      const canvas = document.createElement('canvas');
      canvas.width  = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 512, 512);

      // Soft ambient shadow directly under boots
      const drawFootAO = (cx, cy, rx, ry) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
        g.addColorStop(0,    'rgba(0, 0, 0, 0.95)');
        g.addColorStop(0.35, 'rgba(5, 10, 18, 0.70)');
        g.addColorStop(0.7,  'rgba(8, 20, 35, 0.22)');
        g.addColorStop(1,    'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      };

      drawFootAO(208, 256, 68, 36);
      drawFootAO(304, 256, 68, 36);

      // Core body ambient occlusion
      const bodyGrad = ctx.createRadialGradient(256, 256, 20, 256, 256, 175);
      bodyGrad.addColorStop(0,   'rgba(3, 8, 16, 0.65)');
      bodyGrad.addColorStop(0.5, 'rgba(5, 15, 28, 0.20)');
      bodyGrad.addColorStop(1,   'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.ellipse(256, 256, 175, 95, 0, 0, Math.PI * 2);
      ctx.fill();

      return new THREE.CanvasTexture(canvas);
    }

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.65, 1.25),
      new THREE.MeshBasicMaterial({
        map: createContactShadowTexture(),
        transparent: true,
        opacity: 0.88,
        depthWrite: false
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, floorY + 0.005, 0);
    scene.add(shadowPlane);

    // ==========================================
    // 6. FOREGROUND ATMOSPHERE LAYER 1:
    // Idea A: Forward Holographic Projection Cone Veil (#00e5ff Additive Haze)
    // Directly in front of Iron Man's chest, shoulders & thighs
    // ==========================================
    function createProjectionVeilTexture() {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, 512, 512);

      // Dual-center soft cyan holographic emission cloud
      const g = ctx.createRadialGradient(256, 230, 25, 256, 230, 250);
      g.addColorStop(0,    'rgba(0, 229, 255, 0.45)'); // #00e5ff core
      g.addColorStop(0.35, 'rgba(6, 182, 212, 0.25)');
      g.addColorStop(0.70, 'rgba(2, 132, 199, 0.08)');
      g.addColorStop(1,    'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 512);

      return new THREE.CanvasTexture(c);
    }

    const projectionVeil = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 2.6),
      new THREE.MeshBasicMaterial({
        map: createProjectionVeilTexture(),
        transparent: true,
        opacity: 0.15, // 12%–18% subtle veil
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    // Floats directly in front of Iron Man's chest (Z = +0.55)
    projectionVeil.position.set(0, -0.15, 0.55);
    scene.add(projectionVeil);

    // ==========================================
    // 7. FOREGROUND ATMOSPHERE LAYER 2:
    // Idea B: Pedestal Vent Vapor & Lower Atmosphere
    // Wisps of pressurized vapor rising in front of boots & shins
    // ==========================================
    function createVentVaporTexture() {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 256;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, 512, 256);

      // Low-lying vapor wisps curling along the pedestal rim
      const g = ctx.createRadialGradient(256, 200, 30, 256, 200, 220);
      g.addColorStop(0,    'rgba(56, 189, 248, 0.40)'); // Cool cyan vapor
      g.addColorStop(0.35, 'rgba(14, 165, 233, 0.20)');
      g.addColorStop(0.75, 'rgba(3, 105, 161, 0.05)');
      g.addColorStop(1,    'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 256);

      // Subtle atmospheric wisp filaments
      for (let i = 0; i < 6; i++) {
        const wx = 120 + i * 55;
        const wg = ctx.createRadialGradient(wx, 170 + (i % 2) * 20, 5, wx, 170, 65);
        wg.addColorStop(0,   'rgba(34, 211, 238, 0.25)');
        wg.addColorStop(1,   'rgba(0, 0, 0, 0)');
        ctx.fillStyle = wg;
        ctx.beginPath();
        ctx.ellipse(wx, 170, 65, 30, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      return new THREE.CanvasTexture(c);
    }

    const ventVapor = new THREE.Mesh(
      new THREE.PlaneGeometry(2.7, 0.85),
      new THREE.MeshBasicMaterial({
        map: createVentVaporTexture(),
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    // Floats right above pedestal rim in front of boots & shins
    ventVapor.position.set(0, floorY + 0.20, 0.42);
    scene.add(ventVapor);

    // ==========================================
    // 8. FOREGROUND ATMOSPHERE LAYER 3:
    // Volumetric Overhead Downward Light Beam (Passing Across Front of Suit)
    // ==========================================
    function createLightBeamTexture() {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 512;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, 256, 512);

      // Downward conical light beam gradient
      const g = ctx.createLinearGradient(128, 0, 128, 512);
      g.addColorStop(0,    'rgba(240, 253, 255, 0.35)'); // Bright ceiling source
      g.addColorStop(0.25, 'rgba(186, 230, 253, 0.20)');
      g.addColorStop(0.70, 'rgba(125, 211, 252, 0.08)');
      g.addColorStop(1,    'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      // Tapered beam shaft
      ctx.moveTo(80, 0);
      ctx.lineTo(176, 0);
      ctx.lineTo(240, 512);
      ctx.lineTo(16, 512);
      ctx.closePath();
      ctx.fill();

      return new THREE.CanvasTexture(c);
    }

    const lightBeam = new THREE.Mesh(
      new THREE.PlaneGeometry(1.9, 3.4),
      new THREE.MeshBasicMaterial({
        map: createLightBeamTexture(),
        transparent: true,
        opacity: 0.12, // Subtle translucent god ray
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    // Angled down across the front of the suit
    lightBeam.position.set(0.15, 0.35, 0.48);
    lightBeam.rotation.z = -0.04; // Gentle slant
    scene.add(lightBeam);

    // ==========================================
    // 9. FOREGROUND ATMOSPHERE LAYER 4:
    // Foreground 3D Dust Particle Field (75 Floating Motes)
    // Strictly positioned between camera (Z = 3.95) and Iron Man (Z = 0.0)
    // ==========================================
    const DUST_COUNT = 75;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    const dustVelocities = [];

    for (let i = 0; i < DUST_COUNT; i++) {
      // X: spread across horizontal view (-1.8 to +1.8)
      dustPositions[i * 3 + 0] = (Math.random() - 0.5) * 3.6;
      // Y: spread from floor to ceiling (-1.25 to +1.35)
      dustPositions[i * 3 + 1] = floorY + Math.random() * 2.6;
      // Z: strictly in front of the model towards the camera (+0.25 to +2.2)
      dustPositions[i * 3 + 2] = 0.25 + Math.random() * 1.95;

      dustVelocities.push({
        vx: (Math.random() - 0.5) * 0.0018,
        vy: (Math.random() * 0.0012) + 0.0004, // Gentle upward warm-air drift
        vz: (Math.random() - 0.5) * 0.0015,
        seed: Math.random() * Math.PI * 2
      });
    }

    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    function createDustParticleTexture() {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
      g.addColorStop(0,    'rgba(255, 255, 255, 1.0)'); // Glowing center glint
      g.addColorStop(0.35, 'rgba(165, 243, 252, 0.85)'); // Cyan halo
      g.addColorStop(0.70, 'rgba(56,  189, 248, 0.35)');
      g.addColorStop(1,    'rgba(0,   0,   0,   0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(c);
    }

    const dustMaterial = new THREE.PointsMaterial({
      size: 0.045,
      map: createDustParticleTexture(),
      transparent: true,
      opacity: 0.70,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustParticles);

    // ==========================================
    // 10. 3D MODEL LOADING — Anchored on Circular Pedestal
    // ==========================================
    let isModelLoaded = false;
    let autoRotate    = true;
    let idleTimer     = null;

    // Inertia Damping & Magnetic Snap state
    let isUserDragging      = false;
    let previousMouseX      = 0;
    let angularVelocity     = 0;
    const dampingFactor     = 0.05;
    let isSnapping          = false;
    let targetSnapRotationY = 0;

    const loader   = new THREE.GLTFLoader();
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
    );

    // ==========================================
    // 11. 360° MANUAL ORBIT — INERTIA & MAGNETIC SNAP
    // ==========================================
    function onPointerDown(e) {
      isUserDragging  = true;
      autoRotate      = false;
      isSnapping      = false;
      angularVelocity = 0;
      previousMouseX  = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      clearTimeout(idleTimer);
    }

    function onPointerMove(e) {
      if (!isUserDragging) return;
      const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const deltaX   = currentX - previousMouseX;
      previousMouseX = currentX;

      const rotationDelta = deltaX * 0.0075;
      modelGroup.rotation.y += rotationDelta;
      angularVelocity = rotationDelta;
    }

    function onPointerUp() {
      if (!isUserDragging) return;
      isUserDragging = false;

      // Resume gentle auto-orbit after 4 seconds of inactivity
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!isUserDragging) {
          snapToNearestFrontAngle();
        }
      }, 4000);
    }

    function snapToNearestFrontAngle() {
      const current = modelGroup.rotation.y;
      const twoPi   = Math.PI * 2;
      const normalized = ((current % twoPi) + twoPi) % twoPi;
      const snapPoints = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, twoPi];
      let nearest = 0;
      let minDiff = Infinity;

      for (const sp of snapPoints) {
        const diff = Math.abs(normalized - sp);
        if (diff < minDiff) {
          minDiff = diff;
          nearest = sp;
        }
      }

      const turns = Math.floor(current / twoPi);
      targetSnapRotationY = (turns * twoPi) + (nearest === twoPi ? 0 : nearest);
      isSnapping = true;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(12); } catch(e) {}
      }
    }

    const dom = renderer.domElement;
    dom.addEventListener('mousedown',  onPointerDown,  { passive: true });
    window.addEventListener('mousemove', onPointerMove,  { passive: true });
    window.addEventListener('mouseup',   onPointerUp,    { passive: true });
    dom.addEventListener('touchstart', onPointerDown,  { passive: true });
    window.addEventListener('touchmove', onPointerMove,  { passive: true });
    window.addEventListener('touchend',  onPointerUp,    { passive: true });

    // ==========================================
    // 12. SCROLL FADE (Synchronized with Studio Content)
    // ==========================================
    function handleScroll() {
      const scrollY        = window.scrollY || window.pageYOffset || 0;
      const vh             = window.innerHeight || 800;
      const scrollProgress = Math.min(1, Math.max(0, scrollY / (vh * 0.85)));
      const bgLayer        = document.getElementById('studio-bg-layer');
      const stageLayer     = document.getElementById('studio-3d-stage');

      const opacity = Math.max(0, 1 - scrollProgress * 1.35).toFixed(3);
      if (bgLayer)    bgLayer.style.opacity    = opacity;
      if (stageLayer) stageLayer.style.opacity = opacity;

      // Disable pointer events when faded out
      if (stageLayer) {
        stageLayer.style.pointerEvents = scrollProgress > 0.65 ? 'none' : 'auto';
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ==========================================
    // 13. ANIMATION LOOP (60 FPS Inertia & Atmospheric Life)
    // ==========================================
    let animationFrameId;
    let clock = new THREE.Clock();

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // 1. Forward Holographic Projection Cone Veil Breathing (#00e5ff haze)
      if (projectionVeil) {
        projectionVeil.material.opacity = 0.14 + Math.sin(elapsedTime * 0.7) * 0.03; // Oscillates between 11%–17%
        projectionVeil.position.x = Math.sin(elapsedTime * 0.35) * 0.04;
      }

      // 2. Pedestal Vent Vapor Swaying across boots & shins
      if (ventVapor) {
        ventVapor.position.x = Math.sin(elapsedTime * 0.45) * 0.07;
        ventVapor.material.opacity = 0.28 + Math.sin(elapsedTime * 0.9) * 0.06;
      }

      // 3. Volumetric Overhead Light Beam Subtle Shimmer
      if (lightBeam) {
        lightBeam.material.opacity = 0.11 + Math.sin(elapsedTime * 1.2) * 0.025;
      }

      // 4. Foreground 3D Dust Motes Brownian Drift
      if (dustParticles) {
        const positions = dustParticles.geometry.attributes.position.array;
        for (let i = 0; i < DUST_COUNT; i++) {
          const v = dustVelocities[i];
          // Gentle floating motion
          positions[i * 3 + 0] += Math.sin(elapsedTime * 0.6 + v.seed) * 0.0015;
          positions[i * 3 + 1] += v.vy; // Rising thermal drift
          positions[i * 3 + 2] += Math.cos(elapsedTime * 0.5 + v.seed) * 0.0012;

          // Wrap boundaries so dust motes cycle infinitely
          if (positions[i * 3 + 1] > 1.35) {
            positions[i * 3 + 1] = floorY; // Re-enter from floor
          }
          if (positions[i * 3 + 0] > 1.9)  positions[i * 3 + 0] = -1.9;
          if (positions[i * 3 + 0] < -1.9) positions[i * 3 + 0] = 1.9;
        }
        dustParticles.geometry.attributes.position.needsUpdate = true;
      }

      // 5. 3D Model Rotation & Inertia
      if (isModelLoaded) {
        if (!isUserDragging) {
          // Inertia decay
          if (Math.abs(angularVelocity) > 0.0001) {
            modelGroup.rotation.y += angularVelocity;
            angularVelocity *= (1 - dampingFactor);
          }
          // Magnetic snap
          if (isSnapping) {
            const diff = targetSnapRotationY - modelGroup.rotation.y;
            modelGroup.rotation.y += diff * 0.08;
            if (Math.abs(diff) < 0.001) {
              modelGroup.rotation.y = targetSnapRotationY;
              isSnapping = false;
              autoRotate = true;
            }
          }
          // Slow ambient showcase rotation
          if (autoRotate && !isSnapping) {
            modelGroup.rotation.y += 0.0035;
          }
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    // Resize Handler
    function onResize() {
      if (!container) return;
      const w = container.clientWidth  || window.innerWidth;
      const h = container.clientHeight || window.innerHeight || 720;
      updateResponsiveCamera(w, h);
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    }

    window.addEventListener('resize', onResize);

    // Cleanup function
    
    // Suit Reactivity Hook (reacts when visitor clicks Studio Wings)
    window.starkTriggerWingReaction = function(wingId) {
      if (!modelGroup) return;
      autoRotate = false;
      clearTimeout(idleTimer);
      let targetAngle = 0;
      if (wingId === 'technical')     targetAngle = -0.24; // subtle lean left
      if (wingId === 'entertainment') targetAngle =  0.24; // subtle lean right
      if (wingId === 'arts')          targetAngle = -0.12;
      if (wingId === 'other')         targetAngle =  0.0;
      targetSnapRotationY = targetAngle;
      isSnapping = true;
      if (pedestalRimLight) {
        pedestalRimLight.intensity = 2.2;
        setTimeout(() => { if (pedestalRimLight) pedestalRimLight.intensity = 1.2; }, 500);
      }
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([15, 20, 15]); } catch(e) {}
      }
    };

    return function destroy() {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize',     onResize);
      window.removeEventListener('scroll',     handleScroll);
      window.removeEventListener('mousemove',  onPointerMove);
      window.removeEventListener('mouseup',    onPointerUp);
      window.removeEventListener('touchmove',  onPointerMove);
      window.removeEventListener('touchend',   onPointerUp);
      clearTimeout(idleTimer);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  };
})();
