import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// ─── Texture loader with fallback ──────────────────────────────────────────
const _loader = new THREE.TextureLoader();

function loadTex(localPath, fallbackFn) {
  const t = _loader.load(
    localPath,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    },
    undefined,
    () => {
      if (fallbackFn) {
        const fb = fallbackFn();
        t.image = fb.image;
        t.needsUpdate = true;
      }
    }
  );
  return t;
}

// ─── Procedural Canvas Fallbacks ───────────────────────────────────────────
function mkSun() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(512, 256, 0, 512, 256, 520);
  g.addColorStop(0, '#fff8b0'); g.addColorStop(0.15, '#ffee00'); g.addColorStop(0.35, '#ff8800');
  g.addColorStop(0.65, '#ff4400'); g.addColorStop(0.85, '#cc1100'); g.addColorStop(1, '#660000');
  x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 1500; i++) {
    const px = Math.random() * 1024, py = Math.random() * 512, r = Math.random() * 18 + 2;
    x.fillStyle = Math.random() > 0.4 ? 'rgba(255,240,120,0.3)' : 'rgba(180,30,0,0.25)';
    x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
  }
  const t = new THREE.CanvasTexture(c); t.needsUpdate = true; return t;
}

function mkEarth() {
  const c = document.createElement('canvas'); c.width = 2048; c.height = 1024;
  const x = c.getContext('2d');
  const og = x.createLinearGradient(0, 0, 0, 1024);
  og.addColorStop(0, '#021024'); og.addColorStop(0.5, '#0b4070'); og.addColorStop(1, '#021024');
  x.fillStyle = og; x.fillRect(0, 0, 2048, 1024);
  const land = (cx, cy, rx, ry, c1, c2) => {
    x.fillStyle = c1; x.beginPath(); x.ellipse(cx, cy, rx, ry, (Math.random() - 0.5) * 0.4, 0, Math.PI * 2); x.fill();
    x.fillStyle = c2;
    for (let k = 0; k < 6; k++) {
      x.beginPath(); x.ellipse(cx + (Math.random() - 0.5) * rx * 1.2, cy + (Math.random() - 0.5) * ry * 1.2, rx * 0.4, ry * 0.4, 0, 0, Math.PI * 2); x.fill();
    }
  };
  land(520, 320, 240, 160, '#2d6a4f', '#bc8a5f'); land(420, 240, 180, 120, '#1b4332', '#6c757d');
  land(720, 680, 140, 220, '#1b4332', '#52796f'); land(1280, 250, 280, 150, '#2d6a4f', '#bc8a5f');
  land(1680, 280, 320, 160, '#52796f', '#e9ecef'); land(1120, 520, 180, 240, '#bc8a5f', '#1b4332');
  return new THREE.CanvasTexture(c);
}

function mkJupiter() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const x = c.getContext('2d');
  const bands = ['#c89f65', '#9e6d38', '#d6b88a', '#7a4b21', '#e8d3b3', '#8c5324', '#b58c54', '#d4a464', '#9a6030'];
  const bh = 512 / bands.length;
  bands.forEach((col, i) => {
    x.fillStyle = col; x.fillRect(0, i * bh, 1024, bh);
    for (let j = 0; j < 60; j++) {
      x.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.15) + ')';
      x.fillRect(Math.random() * 1024, i * bh + Math.random() * bh, Math.random() * 200 + 20, 2);
    }
  });
  const grs = x.createRadialGradient(650, 320, 0, 650, 320, 75);
  grs.addColorStop(0, '#ff3300'); grs.addColorStop(0.5, '#cc1100'); grs.addColorStop(1, 'rgba(150,20,0,0)');
  x.fillStyle = grs; x.beginPath(); x.ellipse(650, 320, 80, 48, -0.1, 0, Math.PI * 2); x.fill();
  const t = new THREE.CanvasTexture(c); t.needsUpdate = true; return t;
}

function mkMars() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const x = c.getContext('2d');
  const mg = x.createLinearGradient(0, 0, 1024, 512);
  mg.addColorStop(0, '#c1440e'); mg.addColorStop(0.5, '#a0320a'); mg.addColorStop(1, '#d45518');
  x.fillStyle = mg; x.fillRect(0, 0, 1024, 512);
  const t = new THREE.CanvasTexture(c); t.needsUpdate = true; return t;
}

function mkRings() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 64;
  const x = c.getContext('2d');
  x.fillStyle = 'rgba(0,0,0,0)'; x.fillRect(0, 0, 512, 64);
  for (let i = 0; i < 512; i++) {
    const a = Math.sin((i / 512) * Math.PI * 20) * 0.28 + 0.42;
    const gap = (i > 175 && i < 210) || (i > 375 && i < 405);
    const hue = i < 180 ? '225,190,120' : i < 350 ? '200,165,95' : '240,205,140';
    x.fillStyle = gap ? 'rgba(0,0,0,0)' : ('rgba(' + hue + ',' + a + ')');
    x.fillRect(i, 0, 2, 64);
  }
  return new THREE.CanvasTexture(c);
}

// ─── Orbit Ring ─────────────────────────────────────────────────────────────
function OrbitRing({ radius, color = '#38bdf8', opacity = 0.25 }) {
  const pts = useMemo(() => {
    const a = [];
    for (let i = 0; i <= 128; i++) {
      const th = (i / 128) * Math.PI * 2;
      a.push(new THREE.Vector3(Math.cos(th) * radius, 0, Math.sin(th) * radius));
    }
    return a;
  }, [radius]);
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts]);
  return (
    <line geometry={geo}>
      <lineBasicMaterial attach="material" color={color} transparent opacity={opacity} linewidth={1} />
    </line>
  );
}

// ─── Asteroid Belt ───────────────────────────────────────────────────────────
function AsteroidBelt({ count = 450, innerRadius = 5.0, outerRadius = 5.5 }) {
  const ref = useRef(), dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => {
    const d = [];
    for (let i = 0; i < count; i++) {
      const r = innerRadius + Math.random() * (outerRadius - innerRadius);
      d.push({
        radius: r,
        angle: Math.random() * Math.PI * 2,
        y: (Math.random() - 0.5) * 0.35,
        scale: Math.random() * 0.04 + 0.012,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        orbitSpeed: (0.15 + Math.random() * 0.05) / r
      });
    }
    return d;
  }, [count, innerRadius, outerRadius]);

  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    if (!ref.current) return;
    data.forEach((a, i) => {
      const ang = a.angle + t * a.orbitSpeed;
      dummy.position.set(Math.cos(ang) * a.radius, a.y, Math.sin(ang) * a.radius);
      dummy.rotation.set(t * a.rotSpeed, t * a.rotSpeed * 2, 0);
      dummy.scale.setScalar(a.scale);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#8b8075" roughness={0.95} metalness={0.1} />
    </instancedMesh>
  );
}

// ─── Solar System ────────────────────────────────────────────────────────────
function SolarSystem({ earthRef, isZoomingToEarth }) {
  const sunR = useRef(), coronaR = useRef(), mercR = useRef(), venR = useRef();
  const earthGR = useRef(), moonR = useRef(), marsR = useRef(), jupR = useRef();
  const satGR = useRef(), satR = useRef(), urR = useRef(), nepR = useRef();

  const tx = useMemo(() => ({
    sun:         loadTex('/assets/planets/sun.jpg', mkSun),
    mercury:     loadTex('/assets/planets/mercury.jpg'),
    venus:       loadTex('/assets/planets/venus.jpg'),
    earth:       loadTex('/assets/planets/earth.jpg', mkEarth),
    moon:        loadTex('/assets/planets/moon.jpg'),
    mars:        loadTex('/assets/planets/mars.jpg', mkMars),
    jupiter:     loadTex('/assets/planets/jupiter.jpg', mkJupiter),
    saturn:      loadTex('/assets/planets/saturn.jpg'),
    saturn_ring: loadTex('/assets/planets/saturn_ring.png', mkRings),
    uranus:      loadTex('/assets/planets/uranus.jpg'),
    neptune:     loadTex('/assets/planets/neptune.jpg'),
  }), []);

  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    // Sun
    if (sunR.current) sunR.current.rotation.y = t * 0.08;
    if (coronaR.current) {
      coronaR.current.rotation.y = -t * 0.05;
      const p = 1.12 + Math.sin(t * 1.5) * 0.03;
      coronaR.current.scale.set(p, p, p);
    }
    // Mercury
    if (mercR.current) {
      const sp = t * 1.1;
      mercR.current.position.set(Math.cos(sp) * 1.7, 0, Math.sin(sp) * 1.7);
      mercR.current.rotation.y = t * 0.4;
    }
    // Venus
    if (venR.current) {
      const sp = t * 0.75;
      venR.current.position.set(Math.cos(sp) * 2.6, 0, Math.sin(sp) * 2.6);
      venR.current.rotation.y = -t * 0.3;
    }
    // Earth + Moon
    if (earthGR.current) {
      const sp = t * 0.5;
      earthGR.current.position.set(Math.cos(sp) * 3.7, 0, Math.sin(sp) * 3.7);
      if (earthRef?.current) {
        earthRef.current.rotation.y = isZoomingToEarth
          ? THREE.MathUtils.lerp(earthRef.current.rotation.y, Math.PI * 0.38, 0.12)
          : t * 0.9;
      }
      if (moonR.current) {
        const ms = t * 2.8;
        moonR.current.position.set(Math.cos(ms) * 0.52, Math.sin(ms * 0.5) * 0.15, Math.sin(ms) * 0.52);
        moonR.current.rotation.y = t * 0.5;
      }
    }
    // Mars
    if (marsR.current) {
      const sp = t * 0.38;
      marsR.current.position.set(Math.cos(sp) * 4.8, 0, Math.sin(sp) * 4.8);
      marsR.current.rotation.y = t * 0.8;
    }
    // Jupiter
    if (jupR.current) {
      const sp = t * 0.22;
      jupR.current.position.set(Math.cos(sp) * 6.4, 0, Math.sin(sp) * 6.4);
      jupR.current.rotation.y = t * 1.1;
    }
    // Saturn
    if (satGR.current) {
      const sp = t * 0.14;
      satGR.current.position.set(Math.cos(sp) * 8.1, 0, Math.sin(sp) * 8.1);
      if (satR.current) satR.current.rotation.y = t * 0.7;
    }
    // Uranus
    if (urR.current) {
      const sp = t * 0.09;
      urR.current.position.set(Math.cos(sp) * 9.5, 0, Math.sin(sp) * 9.5);
      urR.current.rotation.x = t * 0.5;
    }
    // Neptune
    if (nepR.current) {
      const sp = t * 0.06;
      nepR.current.position.set(Math.cos(sp) * 10.8, 0, Math.sin(sp) * 10.8);
      nepR.current.rotation.y = t * 0.6;
    }
  });

  return (
    <group rotation={[0.25, 0, 0]}>
      {/* ── Sun ── */}
      <group>
        <mesh ref={sunR}>
          <sphereGeometry args={[0.95, 64, 64]} />
          <meshStandardMaterial
            map={tx.sun}
            emissiveMap={tx.sun}
            emissive="#ff6600"
            emissiveIntensity={1.8}
            roughness={1}
            metalness={0}
          />
        </mesh>
        <mesh ref={coronaR} scale={1.12}>
          <sphereGeometry args={[0.95, 32, 32]} />
          <meshBasicMaterial color="#ff7700" transparent opacity={0.32} side={THREE.BackSide} />
        </mesh>
        <mesh scale={1.35}>
          <sphereGeometry args={[0.95, 32, 32]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.10} side={THREE.BackSide} />
        </mesh>
        <pointLight intensity={8} color="#fff5e0" distance={60} decay={0.9} />
      </group>

      {/* ── Orbits ── */}
      <OrbitRing radius={1.7} color="#94a3b8" opacity={0.22} />
      <OrbitRing radius={2.6} color="#fbbf24" opacity={0.28} />
      <OrbitRing radius={3.7} color="#00f0ff" opacity={0.45} />
      <OrbitRing radius={4.8} color="#f87171" opacity={0.35} />
      <OrbitRing radius={6.4} color="#f59e0b" opacity={0.30} />
      <OrbitRing radius={8.1} color="#eab308" opacity={0.35} />
      <OrbitRing radius={9.5} color="#38bdf8" opacity={0.25} />
      <OrbitRing radius={10.8} color="#818cf8" opacity={0.25} />

      {/* ── Asteroids ── */}
      <AsteroidBelt count={450} innerRadius={5.0} outerRadius={5.5} />

      {/* ── Mercury ── */}
      <mesh ref={mercR}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial map={tx.mercury} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* ── Venus ── */}
      <mesh ref={venR}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial map={tx.venus} roughness={0.7} />
      </mesh>

      {/* ── Earth + Moon ── */}
      <group ref={earthGR}>
        <mesh ref={earthRef}>
          <sphereGeometry args={[0.36, 64, 64]} />
          <meshStandardMaterial map={tx.earth} roughness={0.45} metalness={0.08} />
        </mesh>
        {/* Blue Atmospheric Glow */}
        <mesh scale={[1.09, 1.09, 1.09]}>
          <sphereGeometry args={[0.36, 32, 32]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.18} side={THREE.BackSide} />
        </mesh>
        {/* Moon */}
        <mesh ref={moonR}>
          <sphereGeometry args={[0.088, 32, 32]} />
          <meshStandardMaterial map={tx.moon} roughness={0.92} metalness={0.04} />
        </mesh>
      </group>

      {/* ── Mars ── */}
      <mesh ref={marsR}>
        <sphereGeometry args={[0.24, 64, 64]} />
        <meshStandardMaterial map={tx.mars} roughness={0.85} />
      </mesh>

      {/* ── Jupiter ── */}
      <mesh ref={jupR}>
        <sphereGeometry args={[0.58, 64, 64]} />
        <meshStandardMaterial map={tx.jupiter} roughness={0.5} />
      </mesh>

      {/* ── Saturn + Realistic Rings ── */}
      <group ref={satGR}>
        <mesh ref={satR}>
          <sphereGeometry args={[0.46, 64, 64]} />
          <meshStandardMaterial map={tx.saturn} roughness={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 2.8, 0, 0]}>
          <ringGeometry args={[0.60, 1.25, 128]} />
          <meshStandardMaterial
            map={tx.saturn_ring}
            side={THREE.DoubleSide}
            transparent
            opacity={0.95}
            roughness={0.7}
          />
        </mesh>
      </group>

      {/* ── Uranus ── */}
      <mesh ref={urR}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial map={tx.uranus} roughness={0.5} />
      </mesh>

      {/* ── Neptune ── */}
      <mesh ref={nepR}>
        <sphereGeometry args={[0.30, 32, 32]} />
        <meshStandardMaterial map={tx.neptune} roughness={0.5} />
      </mesh>
    </group>
  );
}

// ─── Cosmic Dust ─────────────────────────────────────────────────────────────
function CosmicDust({ count = 2200 }) {
  const ref = useRef();
  const pos = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 38;
      p[i * 3 + 1] = (Math.random() - 0.5) * 22;
      p[i * 3 + 2] = (Math.random() - 0.5) * 38;
    }
    return p;
  }, [count]);

  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.getElapsedTime() * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#7dd3fc" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

// ─── Earth Zoom Controller ───────────────────────────────────────────────────
function EarthZoom({ earthRef, isZooming, onZoomComplete }) {
  const { camera } = useThree();
  const diving = useRef(false);
  const startPos = useRef(new THREE.Vector3());
  const prog = useRef(0);
  const tv = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!isZooming || !earthRef?.current) return;
    if (!diving.current) {
      diving.current = true;
      prog.current = 0;
      startPos.current.copy(camera.position);
    }
    prog.current += delta * 0.42;
    const t = Math.min(prog.current, 1.0);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    earthRef.current.getWorldPosition(tv);
    camera.position.lerpVectors(startPos.current, new THREE.Vector3(tv.x - 0.1, tv.y + 0.1, tv.z + 0.39), ease);
    camera.lookAt(tv.x - 0.1, tv.y + 0.1, tv.z);
    if (t >= 1.0) onZoomComplete();
  });

  return null;
}

// ─── Gyroscope / Device Tilt Controller (Mobile & Tablet) ──────────────────
function GyroTiltController({ isZooming }) {
  const { camera } = useThree();
  const gyro = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        gyro.current.active = true;
        const gX = Math.max(-45, Math.min(45, e.gamma));
        const gY = Math.max(10, Math.min(80, e.beta));
        gyro.current.x = (gX / 45) * 1.8;
        gyro.current.y = ((gY - 45) / 35) * 1.2;
      }
    };
    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, []);

  useFrame((_, delta) => {
    if (isZooming || !gyro.current.active) return;
    const targetX = gyro.current.x;
    const targetY = 5.5 + gyro.current.y;
    const lerpSpeed = Math.min(1, delta * 3.5);
    camera.position.x += (targetX - camera.position.x) * lerpSpeed;
    camera.position.y += (targetY - camera.position.y) * lerpSpeed;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function HeroCanvas({ isZoomingToEarth = false, onEarthZoomComplete }) {
  const earthRef = useRef();
  const [paused, setPaused] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(() => {
    return typeof window !== 'undefined' && ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || window.innerWidth < 1024);
  });

  useEffect(() => {
    const fn = () => setPaused(document.hidden);
    const checkTouch = () => {
      setIsTouchDevice(typeof window !== 'undefined' && ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || window.innerWidth < 1024));
    };
    document.addEventListener('visibilitychange', fn);
    window.addEventListener('resize', checkTouch);
    return () => {
      document.removeEventListener('visibilitychange', fn);
      window.removeEventListener('resize', checkTouch);
    };
  }, []);

  return (
    <div
      className={isTouchDevice ? "absolute inset-0 w-full h-full pointer-events-none touch-pan-y" : "absolute inset-0 w-full h-full pointer-events-auto"}
      style={{ touchAction: isTouchDevice ? 'pan-y' : 'auto' }}
    >
      <Canvas
        camera={{ position: [0, 5.5, 10.5], fov: 50 }}
        dpr={isTouchDevice ? [1, 1.2] : [1, 1.5]}
        frameloop={paused ? 'never' : 'always'}
        gl={{ antialias: !isTouchDevice, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={0.7} color="#38bdf8" />
        <directionalLight position={[-10, -10, -10]} intensity={0.35} color="#a855f7" />
        <Stars radius={85} depth={80} count={isTouchDevice ? 2200 : 6000} factor={5} saturation={0.95} fade speed={1.2} />
        <SolarSystem earthRef={earthRef} isZoomingToEarth={isZoomingToEarth} />
        <CosmicDust count={isTouchDevice ? 800 : 2000} />
        {isZoomingToEarth && (
          <EarthZoom earthRef={earthRef} isZooming={isZoomingToEarth} onZoomComplete={onEarthZoomComplete} />
        )}
        {/* Mobile & Tablet: Gyroscope tilt with zero touch interception */}
        {isTouchDevice && <GyroTiltController isZooming={isZoomingToEarth} />}
        {/* Desktop / PC: Full interactive 3D OrbitControls */}
        {!isTouchDevice && (
          <OrbitControls
            enabled={!isZoomingToEarth}
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.35}
            autoRotate={!isZoomingToEarth}
            autoRotateSpeed={0.18}
          />
        )}
      </Canvas>
    </div>
  );
}
