import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, RoundedBox } from '@react-three/drei';
import { Play, Pause, RefreshCw, Eye, Sparkles, Layers, Sliders } from 'lucide-react';

// 3D Cube Mesh Component
function RotatingCube({ isRotating, rotationSpeed, colorTheme, wireframe }) {
  const meshRef = useRef();
  const innerMeshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Continuous 3D rotation frame loop
  useFrame((state, delta) => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.x += delta * 0.4 * rotationSpeed;
      meshRef.current.rotation.y += delta * 0.6 * rotationSpeed;
    }
    if (innerMeshRef.current && isRotating) {
      innerMeshRef.current.rotation.x -= delta * 0.8 * rotationSpeed;
      innerMeshRef.current.rotation.z += delta * 0.5 * rotationSpeed;
    }
  });

  return (
    <group>
      {/* Floating 3D Outer Cube */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.15 : 1.0}
        >
          <boxGeometry args={[2.4, 2.4, 2.4]} />
          <meshStandardMaterial
            color={hovered ? '#818cf8' : colorTheme.main}
            roughness={0.2}
            metalness={0.8}
            wireframe={wireframe}
            transparent={true}
            opacity={0.85}
          />
        </mesh>

        {/* Inner Glowing Wireframe Cube */}
        <mesh ref={innerMeshRef} scale={hovered ? 0.75 : 0.65}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial
            color={colorTheme.glow}
            wireframe={true}
            emissive={colorTheme.glow}
            emissiveIntensity={hovered ? 1.5 : 0.8}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function Hero3D() {
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [wireframe, setWireframe] = useState(false);
  const [themeIndex, setThemeIndex] = useState(0);

  const colorThemes = [
    { name: 'Indigo Neon', main: '#6366f1', glow: '#a5b4fc', bgGlow: 'rgba(99, 102, 241, 0.25)' },
    { name: 'Emerald Cyber', main: '#10b981', glow: '#6ee7b7', bgGlow: 'rgba(16, 185, 129, 0.25)' },
    { name: 'Cyan Quantum', main: '#06b6d4', glow: '#67e8f9', bgGlow: 'rgba(6, 182, 212, 0.25)' },
    { name: 'Amber Fusion', main: '#f59e0b', glow: '#fde047', bgGlow: 'rgba(245, 158, 11, 0.25)' }
  ];

  const currentTheme = colorThemes[themeIndex];

  return (
    <section id="hero-3d" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem', position: 'relative' }}>
      <div className="container">
        
        {/* Intro Headline */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="badge badge-emerald" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} /> Interactive 3D WebGL Canvas
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.15 }}>
            Engineering Student & <br />
            <span className="gradient-text">Hardware Solutions Developer</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '680px', margin: '0 auto' }}>
            Specializing in embedded systems, IoT sensors, sound signal processing, and cloud monitoring applications.
            Interact with the 3D cube below by dragging to orbit or customizing controls!
          </p>
        </div>

        {/* 3D Canvas Box */}
        <div className="glass-panel" style={{
          position: 'relative',
          height: '460px',
          width: '100%',
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)',
          border: `1px solid ${currentTheme.main}40`,
          boxShadow: `0 20px 50px ${currentTheme.bgGlow}`
        }}>
          
          {/* Top Control Bar Overlay */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            right: '1rem',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexWrap: 'wrap',
            pointerEvents: 'none'
          }}>
            <div style={{
              background: 'rgba(11, 15, 25, 0.8)',
              backdropFilter: 'blur(12px)',
              padding: '0.4rem 0.9rem',
              borderRadius: '9999px',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: '#d1d5db',
              pointerEvents: 'auto'
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: currentTheme.main }}></span>
              <span>Drag to rotate 3D view</span>
            </div>

            {/* Interactive Control Buttons */}
            <div style={{
              background: 'rgba(11, 15, 25, 0.8)',
              backdropFilter: 'blur(12px)',
              padding: '0.4rem 0.6rem',
              borderRadius: '12px',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              pointerEvents: 'auto'
            }}>
              {/* Play / Pause Toggle */}
              <button
                onClick={() => setIsRotating(!isRotating)}
                title={isRotating ? "Pause Rotation" : "Resume Rotation"}
                style={{
                  background: isRotating ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--glass-border)',
                  color: '#ffffff',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                {isRotating ? <Pause size={14} /> : <Play size={14} />}
                {isRotating ? "Pause" : "Rotate"}
              </button>

              {/* Wireframe Toggle */}
              <button
                onClick={() => setWireframe(!wireframe)}
                title="Toggle Wireframe"
                style={{
                  background: wireframe ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--glass-border)',
                  color: wireframe ? '#a5b4fc' : '#ffffff',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                <Layers size={14} /> Wireframe
              </button>

              {/* Theme Cycle Button */}
              <button
                onClick={() => setThemeIndex((prev) => (prev + 1) % colorThemes.length)}
                title="Change Color Theme"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--glass-border)',
                  color: '#ffffff',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                <RefreshCw size={14} /> {currentTheme.name}
              </button>
            </div>
          </div>

          {/* Three.js R3F Canvas Container */}
          <Suspense fallback={
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}>
              Loading 3D Canvas...
            </div>
          }>
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
              {/* Lighting */}
              <ambientLight intensity={0.7} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} />
              <pointLight position={[-10, -10, -5]} color={currentTheme.glow} intensity={1} />
              
              {/* Background Stars */}
              <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1.5} />
              
              {/* Rotating Cube Mesh */}
              <RotatingCube
                isRotating={isRotating}
                rotationSpeed={rotationSpeed}
                colorTheme={currentTheme}
                wireframe={wireframe}
              />
              
              {/* Mouse Orbit Controls */}
              <OrbitControls enableZoom={true} minDistance={3.5} maxDistance={10} autoRotate={false} />
            </Canvas>
          </Suspense>

          {/* Bottom Speed Slider Bar */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(11, 15, 25, 0.85)',
            backdropFilter: 'blur(12px)',
            padding: '0.5rem 1.2rem',
            borderRadius: '9999px',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            zIndex: 10,
            fontSize: '0.8rem'
          }}>
            <Sliders size={14} color="var(--primary)" />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Speed:</span>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
              style={{ accentColor: currentTheme.main, cursor: 'pointer', width: '100px' }}
            />
            <span style={{ fontWeight: 600, color: '#ffffff', minWidth: '35px' }}>{rotationSpeed.toFixed(1)}x</span>
          </div>

        </div>

      </div>
    </section>
  );
}
