import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ExternalLink, Github,
  Cpu, Film, Palette, Wrench, Sparkles, Star,
  Activity, CheckCircle2, Eye, Filter, X,
  Layers, Terminal, Rocket, Globe, Monitor
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { subscribeToCollection } from '../services/firebase';

/* ─────────────────────────────────────
   STATIC DATA
   ───────────────────────────────────── */
const STATS = [
  { label: 'Projects Shipped', val: '20+', c: 'text-cyan-400', b: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
  { label: 'Certifications', val: '15+', c: 'text-amber-400', b: 'border-amber-500/30', bg: 'bg-amber-500/10' },
  { label: 'Years Experience', val: '3+', c: 'text-violet-400', b: 'border-violet-500/30', bg: 'bg-violet-500/10' },
  { label: 'Tech & Toolsets', val: '30+', c: 'text-emerald-400', b: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
];

const WINGS = [
  { id: 'technical', label: '⚡ Technical Wing', icon: Cpu, color: 'cyan', desc: 'Computer Science, Full-Stack Web, Embedded Systems, IoT & Automation' },
  { id: 'entertainment', label: '🎬 Entertainment Wing', icon: Film, color: 'violet', desc: 'Gaming Content, VFX Compositing, Film Production, Video Editing & Live Streaming' },
  { id: 'arts', label: '🎨 Arts & Design Wing', icon: Palette, color: 'amber', desc: 'UI/UX Design Systems, AI Digital Art, Creative Branding & 3D Visuals' },
  { id: 'other', label: '🔧 Lab & Other Wing', icon: Wrench, color: 'emerald', desc: 'Technical Certifications, Student Workshops, Research Documentation & Open Source' },
];

const COLOR_MAP = {
  cyan:    { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-400', tag: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', btn: 'bg-cyan-500 text-slate-950', glow: 'shadow-cyan-500/25' },
  violet:  { border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400', tag: 'bg-violet-500/15 text-violet-400 border-violet-500/30', btn: 'bg-violet-500 text-white', glow: 'shadow-violet-500/25' },
  amber:   { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', tag: 'bg-amber-500/15 text-amber-400 border-amber-500/30', btn: 'bg-amber-500 text-slate-950', glow: 'shadow-amber-500/25' },
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', tag: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', btn: 'bg-emerald-500 text-slate-950', glow: 'shadow-emerald-500/25' },
};

const STATUS_STYLES = {
  'Live':        'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  'In Progress': 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  'Completed':   'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
  'Concept':     'bg-violet-500/20 text-violet-400 border-violet-500/40',
};

const STATUS_DOTS = {
  'Live':        'bg-emerald-400 animate-pulse',
  'In Progress': 'bg-amber-400 animate-pulse',
  'Completed':   'bg-cyan-400',
  'Concept':     'bg-violet-400',
};

const PROJECTS = {
  technical: [
    {
      id: 'tech-1',
      title: 'Santo Stark Portfolio System',
      desc: 'Interactive 3D Solar System hero, Firebase Realtime CMS, glassmorphic UI, Three.js & React single-page architecture.',
      details: 'Built with React 18, Three.js / React Three Fiber for WebGL canvas rendering, Tailwind CSS for glassmorphism styling, and Google Firebase for live headless CMS database feeds.',
      tags: ['React', 'Three.js', 'Firebase', 'Tailwind', 'Vite'],
      status: 'Live',
      color: 'cyan',
      featured: true,
      demoUrl: '/',
    },
    {
      id: 'tech-2',
      title: 'IoT Smart Hardware Dashboard',
      desc: 'ESP32 micro-controller sensor data streamed in real-time via MQTT protocol to a live reactive web interface.',
      details: 'Features ESP32 micro-controller programmed in C++, MQTT broker pub/sub pipeline, low-latency WebSocket connection, and interactive Chart.js gauges for telemetry.',
      tags: ['ESP32', 'MQTT', 'Node.js', 'C++', 'Chart.js'],
      status: 'Completed',
      color: 'cyan',
    },
    {
      id: 'tech-3',
      title: 'React Cloud Web Application',
      desc: 'Full-stack single page web application with Firebase Firestore backend, user authentication, and responsive views.',
      details: 'Complete end-to-end cloud web app implementing secure Firebase Auth, Firestore real-time listeners, state management, and optimized touch-first responsive layouts.',
      tags: ['React', 'Firebase', 'Tailwind', 'Auth'],
      status: 'Completed',
      color: 'cyan',
    },
    {
      id: 'tech-4',
      title: 'Embedded Firmware & Robotics',
      desc: 'STM32/ESP32 firmware architecture with FreeRTOS multitasking, interrupt routines, and custom sensor PCB layout.',
      details: 'Low-level bare-metal and RTOS firmware written in C/C++, featuring task scheduling, sensor polling queues, and hardware schematics drafted in KiCad.',
      tags: ['STM32', 'FreeRTOS', 'C++', 'PCB', 'KiCad'],
      status: 'In Progress',
      color: 'cyan',
    },
    {
      id: 'tech-5',
      title: 'C++ Socket Server & Networking',
      desc: 'Multi-threaded TCP/UDP server handling concurrent client packets, custom network protocol, and low-latency data feeds.',
      details: 'POSIX sockets server written in modern C++ with thread pooling, packet serialization, mutex synchronization, and high throughput under simulated connection load.',
      tags: ['C++', 'Sockets', 'Threading', 'Linux', 'TCP/IP'],
      status: 'Completed',
      color: 'cyan',
    },
    {
      id: 'tech-6',
      title: 'Python Automation & ML Tooling',
      desc: 'Data processing pipelines, automated web scraping scripts, and neural experiments for predictive classification.',
      details: 'Python suite leveraging Pandas, Scikit-learn, and BeautifulSoup for automated task scheduling, data sanitization, and machine learning model training.',
      tags: ['Python', 'Pandas', 'Scikit-Learn', 'Automation'],
      status: 'In Progress',
      color: 'cyan',
    },
  ],

  entertainment: [
    {
      id: 'ent-1',
      title: 'Gaming Content & Montage Reel',
      desc: 'High-octane gaming recordings, competitive gameplay highlights, sound design synchronization, and fast-paced montages.',
      details: 'Produced high-framerate gameplay captures, synced beat transitions in Premiere Pro, dynamic speed ramping, and personalized audio mixing.',
      tags: ['Gaming', 'Recording', 'Editing', 'Montage', 'Streaming'],
      status: 'In Progress',
      color: 'violet',
      featured: true,
    },
    {
      id: 'ent-2',
      title: 'VFX & Motion Graphics Experiments',
      desc: 'Visual effects compositing, 3D particle systems, screen tracking, dynamic title design, and motion identity.',
      details: 'After Effects compositions utilizing Boris FX, planar motion tracking, particle simulations, and seamless green-screen compositing.',
      tags: ['VFX', 'After Effects', 'Motion', 'Compositing'],
      status: 'In Progress',
      color: 'violet',
    },
    {
      id: 'ent-3',
      title: 'Cinematic Video Editing Showcase',
      desc: 'Narrative pacing, audio soundscapes, color grading in DaVinci Resolve, and cinematic cuts for multimedia clips.',
      details: 'Full post-production workflow: timeline pacing, color wheel grade balances, LUT mastering, and multi-track Foley sound effects layering.',
      tags: ['Premiere Pro', 'DaVinci', 'Color Grade', 'SFX'],
      status: 'Completed',
      color: 'violet',
    },
    {
      id: 'ent-4',
      title: 'Short Film & Screenplay Concepts',
      desc: 'Scriptwriting, storyboard layouts, cinematography test shoots, lighting setups, and narrative direction.',
      details: 'Pre-production script development, two-column audio/video storyboards, lens choice experimentation, and cinematic framing principles.',
      tags: ['Film', 'Direction', 'Story', 'Cinematography'],
      status: 'Concept',
      color: 'violet',
    },
    {
      id: 'ent-5',
      title: '3D Animation & Rigging Studies',
      desc: 'Procedural keyframing, character motion studies, lighting aesthetics, and camera animation in Blender.',
      details: 'Blender 3D scene creation, inverse kinematics character rigging, procedural shader nodes, and Cycles render optimization.',
      tags: ['Blender', '3D', 'Rigging', 'Keyframes', 'Cycles'],
      status: 'Concept',
      color: 'violet',
    },
    {
      id: 'ent-6',
      title: 'Live Streaming & Broadcast Production',
      desc: 'Custom OBS scene switchers, animated overlays, audio gate mixing, and multi-stream relay configurations.',
      details: 'Broadcast studio setup with OBS Studio, custom HTML/CSS alert overlays, VST audio filters for noise reduction, and dual-monitor workflow.',
      tags: ['OBS', 'Broadcast', 'Audio Mix', 'Twitch', 'Streaming'],
      status: 'Live',
      color: 'violet',
    },
  ],

  arts: [
    {
      id: 'art-1',
      title: 'UI/UX Design Systems & Prototypes',
      desc: 'Figma design systems, scalable design tokens, micro-interactions, and mobile/desktop high-fidelity wireframes.',
      details: 'Component libraries with auto-layout, interactive variants, responsive grid constraints, and design token hierarchies ready for developer handoff.',
      tags: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'],
      status: 'In Progress',
      color: 'amber',
      featured: true,
    },
    {
      id: 'art-2',
      title: 'AI-Generated Digital Art Collection',
      desc: 'Generative aesthetics, prompt engineering, diffusion models, and high-resolution digital remastering.',
      details: 'Curated gallery exploring prompt synthesis, latent space upscaling, negative prompt balancing, and digital retouching in Adobe Photoshop.',
      tags: ['AI Art', 'Midjourney', 'Diffusion', 'Digital Art'],
      status: 'In Progress',
      color: 'amber',
    },
    {
      id: 'art-3',
      title: 'Graphic Design & Visual Identity',
      desc: 'Brand identities, typography exploration, posters, social assets, and vector illustrations.',
      details: 'Vector typography, brand style guides, color palettes, and print/digital asset templates created in Adobe Illustrator.',
      tags: ['Illustrator', 'Photoshop', 'Branding', 'Vector'],
      status: 'Completed',
      color: 'amber',
    },
    {
      id: 'art-4',
      title: 'Abstract 3D Visualizations',
      desc: 'Procedural geometry, glass shaders, emissive materials, and real-time lighting studies in WebGL.',
      details: 'Custom Three.js shaders, lighting passes, refractive glass physical materials, and procedural particle vortex simulations.',
      tags: ['Three.js', 'WebGL', 'Blender', 'Shaders'],
      status: 'Concept',
      color: 'amber',
    },
  ],

  other: [
    {
      id: 'oth-1',
      title: 'Technical Certifications Portfolio',
      desc: '15+ verified certifications in Cloud, Cybersecurity, Embedded Computing, and Web Development.',
      details: 'Rigorous coursework and proctored examinations across NPTEL, Coursera, Cisco, and industry institutions verifying technical mastery.',
      tags: ['Cybersecurity', 'Cloud', 'NPTEL', 'DevOps'],
      status: 'Completed',
      color: 'emerald',
      featured: true,
    },
    {
      id: 'oth-2',
      title: 'Peer Workshops & Tech Mentorship',
      desc: 'Hands-on student bootcamps on ESP32 microcontroller coding and modern React frontend workflows.',
      details: 'Conducted interactive workshops for fellow engineering students, covering hardware breadboarding, sensor interfacing, and building full-stack web dashboards.',
      tags: ['Mentorship', 'ESP32', 'React', 'Community'],
      status: 'Completed',
      color: 'emerald',
    },
    {
      id: 'oth-3',
      title: 'Research & Technical Documentation',
      desc: 'Detailed engineering journals, IEEE format project reports, and system architecture schematics.',
      details: 'Comprehensive project papers typeset in LaTeX, containing circuit schematics, timing diagrams, code documentation, and performance benchmarks.',
      tags: ['Research', 'IEEE', 'Documentation', 'LaTeX'],
      status: 'In Progress',
      color: 'emerald',
    },
    {
      id: 'oth-4',
      title: 'Open-Source Code Contributions',
      desc: 'Active GitHub contributions, utility toolkits, and shared developer snippets for the community.',
      details: 'Open-source repositories hosting re-usable Arduino libraries, React hooks, and automation CLI scripts with full README guides.',
      tags: ['GitHub', 'Open Source', 'Git', 'Community'],
      status: 'In Progress',
      color: 'emerald',
    },
  ],
};

const TOOLS = [
  { name: 'VS Code', icon: '💻', d: 'IDE for Web & Firmware' },
  { name: 'Arduino / ESP-IDF', icon: '🔌', d: 'Microcontroller C/C++' },
  { name: 'React + Vite', icon: '⚛️', d: 'Reactive Web Architecture' },
  { name: 'Firebase Cloud', icon: '🔥', d: 'Realtime Data & Auth' },
  { name: 'Three.js / WebGL', icon: '🌐', d: '3D Graphics & Canvas' },
  { name: 'Figma Studio', icon: '🎨', d: 'UI/UX & Wireframing' },
  { name: 'Blender 3D', icon: '🎬', d: 'Modeling & 3D Lighting' },
  { name: 'DaVinci Resolve', icon: '🎞️', d: 'Color Grading & Edits' },
  { name: 'OBS Studio', icon: '📡', d: 'Streaming & Audio Relay' },
  { name: 'After Effects', icon: '✨', d: 'VFX & Motion Design' },
  { name: 'Python / AI', icon: '🐍', d: 'Automation & Data Lab' },
  { name: 'Git & Linux', icon: '🔀', d: 'Source & Server Control' },
];

/* ─────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────── */
export default function Studio() {
  const navigate = useNavigate();
  const [activeWing, setActiveWing] = useState('technical');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [radarPing, setRadarPing] = useState(true);
  const [dbStudioProjects, setDbStudioProjects] = useState([]);

  // Subscribe to Firebase studio_projects for live updates
  useEffect(() => {
    const unsub = subscribeToCollection('studio_projects', (docs) => {
      if (docs && docs.length > 0) setDbStudioProjects(docs);
    }, []);
    return () => unsub();
  }, []);

  // Radar pulse timer
  useEffect(() => {
    const t = setInterval(() => setRadarPing(p => !p), 1200);
    return () => clearInterval(t);
  }, []);

  // Initialize Interactive 3D Iron Man Model with Arc Reactor Zoom Transition
  useEffect(() => {
    let cleanup3D = null;
    const timer = setTimeout(() => {
      if (window.initStarkIronMan) {
        cleanup3D = window.initStarkIronMan('stark-ironman-container');
      }
    }, 150);
    return () => {
      clearTimeout(timer);
      if (cleanup3D) cleanup3D();
    };
  }, []);

  // Keyboard escape for modal
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const currentWing = WINGS.find(w => w.id === activeWing) || WINGS[0];
  // Merge static PROJECTS with Firebase studio_projects for this wing
  const dbWingProjects = dbStudioProjects
    .filter(p => p.wing === activeWing)
    .map(p => ({
      ...p,
      color: currentWing.color,
      tags: Array.isArray(p.tags) ? p.tags : typeof p.tags === 'string' ? p.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      desc: p.summary || p.desc || '',
      details: p.summary || p.details || '',
      isFromDB: true,
    }));
  const staticList = PROJECTS[activeWing] || [];
  const list = [...staticList, ...dbWingProjects];
  const featured = list.find(p => p.featured);
  const filteredList = statusFilter === 'All'
    ? list.filter(p => !p.featured)
    : list.filter(p => !p.featured && p.status === statusFilter);

  const statuses = ['All', 'Live', 'In Progress', 'Completed', 'Concept'];

  return (
    <div className="relative min-h-screen bg-dark-900 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* 1. Stark Lab Background (Fixed to Viewport - Crisp Lab Lighting & Vignette) */}
      <div 
        id="studio-bg-layer" className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none -z-20 transition-opacity duration-300" 
        style={{ backgroundImage: "url('/assets/studio-bg.jpg')", filter: "contrast(1.08) brightness(0.96) saturate(1.06)" }} 
      />
      <div 
        className="fixed inset-0 pointer-events-none -z-10" 
        style={{ background: "radial-gradient(ellipse at 50% 55%, transparent 45%, rgba(9, 10, 15, 0.40) 80%, rgba(9, 10, 15, 0.85) 100%)" }}
      />

      {/* 2. Fixed 3D Diorama Stage (Fixed to Viewport alongside Background - 0px vertical movement) */}
      <div 
        id="studio-3d-stage"
        className="fixed inset-0 z-0 flex items-center justify-center transition-opacity duration-300 pointer-events-auto"
      >
        <div 
          id="stark-ironman-container" 
          className="w-full h-full cursor-grab active:cursor-grabbing pointer-events-auto" 
        />
        {/* Forefront Atmospheric Veil (Depth Sandwich - soft mist wrapping pedestal & boots) */}
        <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-dark-900/85 via-cyan-950/20 to-transparent" />
      </div>

      {/* 3. Hero Scroll Trigger (100vh spacer with Scroll Indicator Button) */}
      <section 
        id="studio-hero-wrapper"
        className="relative w-full min-h-screen flex flex-col justify-end items-center pb-2 z-10 pointer-events-none"
      >
        {/* Simple, Small & Sleek Scroll Indicator Button */}
        <button
          type="button"
          onClick={() => {
            const wings = document.getElementById("studio-wings-section");
            if (wings) {
              wings.scrollIntoView({ behavior: "smooth" });
            } else {
              window.scrollTo({ top: window.innerHeight * 0.98, behavior: "smooth" });
            }
          }}
          className="relative z-30 group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/60 hover:bg-cyan-500/15 border border-cyan-400/30 hover:border-cyan-400/80 shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/25 transition-all cursor-pointer backdrop-blur-md mb-1 pointer-events-auto"
          title="Scroll Down to Explore"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-cyan-300 font-semibold uppercase">
            Explore Wings
          </span>
          <span className="text-cyan-400 text-xs font-bold group-hover:translate-y-0.5 transition-transform">
            ↓
          </span>
        </button>
      </section>

      {/* 4. Main Page Content (Wings, Stats, Projects, Lab) */}
      <main id="studio-wings-section" className="relative z-10 max-w-6xl mx-auto px-4 pt-12 pb-24 space-y-16">

        {/* Quick Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className={`glass-card p-4 sm:p-5 rounded-2xl border ${s.b} flex flex-col items-center justify-center space-y-1 shadow-lg hover:scale-105 transition-all`}
            >
              <span className={`text-3xl sm:text-4xl font-extrabold ${s.c}`}>{s.val}</span>
              <span className="text-xs text-slate-400 font-semibold">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* 2. Four Creative Wings (Interactive Tabs) */}
        <section className="space-y-8">
          
          {/* Wing Tab Buttons */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center">
            {WINGS.map((w) => {
              const active = activeWing === w.id;
              const c = COLOR_MAP[w.color];
              return (
                <button
                  key={w.id}
                  onClick={() => { setActiveWing(w.id); setStatusFilter('All'); }}
                  className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 ${
                    active
                      ? `${c.bg} ${c.text} ${c.border} shadow-lg ${c.glow} scale-105`
                      : 'glass-card border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span>{w.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Wing Description Banner */}
          <div className="text-center">
            <p className={`text-xs sm:text-sm font-mono ${COLOR_MAP[currentWing.color].text}`}>
              ↳ {currentWing.desc}
            </p>
          </div>

          {/* Featured Project Spotlight Card */}
          {featured && (
            <div className={`relative glass-panel rounded-3xl border ${COLOR_MAP[featured.color].border} p-6 sm:p-8 md:p-10 overflow-hidden shadow-2xl`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${STATUS_STYLES[featured.status]}`}>
                      <span className={`w-2 h-2 rounded-full ${STATUS_DOTS[featured.status]}`} />
                      {featured.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/10 text-slate-200 border border-white/20">
                      ★ Featured Showcase
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                    {featured.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {featured.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {featured.tags.map((tg, i) => (
                      <span key={i} className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${COLOR_MAP[featured.color].tag}`}>
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3 shrink-0">
                  <button
                    onClick={() => setSelectedProject(featured)}
                    className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold ${COLOR_MAP[featured.color].btn} shadow-xl hover:scale-105 transition-all text-center flex items-center justify-center gap-1.5`}
                  >
                    <Eye className="w-4 h-4" /> Inspect Project
                  </button>
                  <Link
                    to="/"
                    onClick={() => {
                      navigate('/');
                      setTimeout(() => {
                        if (window.starkScrollTo) window.starkScrollTo('contact');
                      }, 100);
                    }}
                    className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold glass-card border border-white/20 text-slate-200 hover:text-white hover:border-white/40 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Collaborate ✉</span>
                  </Link>
                </div>

              </div>
            </div>
          )}

          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <span className="text-xs text-slate-400 font-mono font-bold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {statuses.map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  statusFilter === st
                    ? (STATUS_STYLES[st] || 'bg-white/15 text-white border-white/30')
                    : 'glass-card border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Grid of Interactive Project Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredList.length > 0 ? (
              filteredList.map((p) => {
                const c = COLOR_MAP[p.color] || COLOR_MAP.cyan;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className={`glass-card rounded-3xl border ${c.border} p-5 space-y-4 shadow-xl flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl transition-all cursor-pointer group`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`w-8 h-8 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center text-sm`}>
                          {activeWing === 'technical' ? '⚡' : activeWing === 'entertainment' ? '🎬' : activeWing === 'arts' ? '🎨' : '🔧'}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLES[p.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[p.status]}`} />
                          {p.status}
                        </span>
                      </div>

                      <h4 className={`text-base font-bold text-slate-100 group-hover:${c.text} transition-colors`}>
                        {p.title}
                      </h4>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {p.desc}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-white/5">
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.map((tg, ti) => (
                          <span key={ti} className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${c.tag}`}>
                            {tg}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-slate-200">
                        <span>Click to view details</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center text-slate-500 text-sm glass-card rounded-2xl border border-white/5">
                No items in this category currently match the "{statusFilter}" status filter.
              </div>
            )}
          </div>

        </section>

        {/* 3. Daily Driver Toolkit & Tech Stack */}
        <section className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
              ⚙ Hardware, Creative & Code Arsenal
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Daily Workspace & Toolkit
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {TOOLS.map((tl, i) => (
              <div
                key={i}
                className="glass-card p-3.5 sm:p-4 rounded-2xl border border-white/10 flex items-center gap-3 hover:border-cyan-500/30 hover:scale-[1.02] transition-all"
              >
                <span className="text-2xl select-none">{tl.icon}</span>
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs sm:text-sm font-bold text-slate-200 truncate">{tl.name}</h5>
                  <p className="text-[10px] text-slate-400 truncate">{tl.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Collab Call-To-Action Box */}
        <section className="relative glass-panel rounded-3xl border border-cyan-500/30 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <span className={`w-2 h-2 rounded-full bg-emerald-400 transition-opacity duration-700 ${radarPing ? 'opacity-100' : 'opacity-30'}`} />
              Open for Collaborative Projects & Engineering
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
              Let's Build Something{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Remarkable
              </span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Whether you need an IoT embedded system, a high-performance web platform, or creative
              collaboration across video editing, film, VFX, or gaming — drop a message.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/"
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    if (window.starkScrollTo) window.starkScrollTo('contact');
                  }, 150);
                }}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all"
              >
                Establish Contact ↗
              </Link>
              <Link
                to="/"
                onClick={() => {
                  navigate('/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-3.5 rounded-2xl glass-card border border-white/15 text-slate-200 font-bold text-xs sm:text-sm hover:border-cyan-400/50 hover:text-cyan-400 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Main Portfolio
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── Interactive Project Detail Lightbox Modal ── */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl glass-panel rounded-3xl border border-cyan-500/40 p-6 sm:p-8 space-y-6 shadow-2xl bg-dark-900/95"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 p-2 rounded-xl glass-card border border-white/15 text-slate-400 hover:text-white hover:border-white/30 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="space-y-2 pr-10">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${STATUS_STYLES[selectedProject.status]}`}>
                    <span className={`w-2 h-2 rounded-full ${STATUS_DOTS[selectedProject.status]}`} />
                    {selectedProject.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID: {selectedProject.id}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-100">
                  {selectedProject.title}
                </h3>
              </div>

              {/* Modal Body */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-y border-white/10 py-4">
                <p className="font-semibold text-slate-200">{selectedProject.desc}</p>
                <p className="text-slate-400">{selectedProject.details}</p>
              </div>

              {/* Tech Tags */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400">Architecture & Tools:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.tags.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* DB Project Links (shown when project has demo/file links) */}
              {(selectedProject?.demoUrl || selectedProject?.fileLink) && (
                <div className="flex flex-wrap gap-2 pt-1 border-t border-white/10">
                  <span className="text-xs font-mono text-slate-400 w-full">Quick Links:</span>
                  {selectedProject.demoUrl && (
                    <a href={selectedProject.demoUrl} target="_blank" rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:bg-cyan-500/30 transition-all flex items-center gap-1.5"
                    >
                      🔗 Live Demo ↗
                    </a>
                  )}
                  {selectedProject.fileLink && (
                    <a href={selectedProject.fileLink} target="_blank" rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 font-bold text-xs hover:bg-violet-500/30 transition-all flex items-center gap-1.5"
                    >
                      📁 Download / View File ↗
                    </a>
                  )}
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-xl glass-card border border-white/15 text-slate-300 hover:text-white text-xs font-bold transition-all"
                >
                  Close [ESC]
                </button>
                <Link
                  to="/"
                  onClick={() => {
                    setSelectedProject(null);
                    navigate('/');
                    setTimeout(() => {
                      if (window.starkScrollTo) window.starkScrollTo('contact');
                    }, 100);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-slate-950 font-extrabold text-xs shadow-lg hover:scale-105 transition-all"
                >
                  Inquire About This Build ↗
                </Link>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
