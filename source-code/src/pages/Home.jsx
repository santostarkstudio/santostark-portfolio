import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code, Terminal, Cpu, Sparkles, Mail, Globe } from 'lucide-react';
import HeroCanvas from '../components/3d/HeroCanvas';
import PageWrapper from '../components/PageWrapper';
import { subscribeToDoc, initialHeroInfo } from '../services/firebase';

export default function Home() {
  const navigate = useNavigate();
  const [isZoomingToEarth, setIsZoomingToEarth] = useState(false);
  const [showWarpFlash, setShowWarpFlash] = useState(false);
  const [heroInfo, setHeroInfo] = useState(initialHeroInfo);

  useEffect(() => {
    const unsub = subscribeToDoc('hero_info', 'main_hero', (data) => {
      if (data) setHeroInfo({ ...initialHeroInfo, ...data });
    }, initialHeroInfo);
    return () => unsub();
  }, []);

  const handleGetInTouchClick = (e) => {
    e.preventDefault();
    if (isZoomingToEarth) return;

    setIsZoomingToEarth(true);

    setTimeout(() => {
      setShowWarpFlash(true);
    }, 1750);
  };

  const handleEarthZoomComplete = () => {
    navigate('/contact');
  };

  return (
    <PageWrapper isHome={true}>
      <div className="relative w-full h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
        <HeroCanvas
          isZoomingToEarth={isZoomingToEarth}
          onEarthZoomComplete={handleEarthZoomComplete}
        />

        <AnimatePresence>
          {showWarpFlash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65 }}
              className="fixed inset-0 z-50 bg-gradient-to-b from-cyan-400 via-white to-slate-950 pointer-events-none flex items-center justify-center backdrop-blur-md"
            >
              <div className="text-center space-y-3">
                <Globe className="w-16 h-16 text-slate-900 animate-spin mx-auto" />
                <h2 className="text-3xl font-extrabold text-slate-950 font-mono tracking-tight">
                  ENTERING ATMOSPHERE OVER INDIA 🇮🇳
                </h2>
                <p className="text-sm text-slate-800 font-mono font-bold">
                  Establishing Direct Neural Connection...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 text-center max-w-4xl px-4 space-y-6 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-xl pointer-events-auto"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>{heroInfo.tagline || 'Seeking Cybersecurity Internships ✦'}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-7xl font-extrabold tracking-tight text-white leading-tight"
          >
            {heroInfo.name || 'Hi, I\'m SANTOSHA D'}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-violet-500 mt-1">
              {heroInfo.title || 'Aspiring Cyber Pro & CSE Grad'}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md"
          >
            {heroInfo.subtitle || 'Computer Science Engineering graduate and aspiring Cloud Security and GRC professional focused on IAM. I am passionate about bridging technical security with IT audit, software testing, and project management.'}
          </motion.p>

          {/* Dynamic Skill Chips (Editable via Admin CMS) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-nowrap sm:flex-wrap items-center justify-center gap-2.5 pt-2 text-xs font-mono text-slate-300 pointer-events-auto overflow-x-auto no-scrollbar touch-pan-x px-2"
          >
            <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-1.5 hover:border-cyan-400/40 hover:bg-white/10 transition-all shadow-sm">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>{heroInfo.skillPill1 || '<> C++ & Python'}</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-1.5 hover:border-violet-400/40 hover:bg-white/10 transition-all shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>{heroInfo.skillPill2 || '⚛ React & Three.js 3D'}</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-1.5 hover:border-emerald-400/40 hover:bg-white/10 transition-all shadow-sm">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>{heroInfo.skillPill3 || '>_ Firebase & Cloud'}</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 pt-2 pointer-events-auto w-full sm:w-auto px-6 sm:px-0"
          >
            <button
              onClick={() => navigate('/projects')}
              className="w-full sm:w-auto justify-center px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all flex items-center space-x-2"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleGetInTouchClick}
              disabled={isZoomingToEarth}
              className="w-full sm:w-auto justify-center px-8 py-3.5 rounded-2xl glass-panel border border-white/20 text-slate-100 font-semibold text-sm hover:border-cyan-400 hover:bg-white/10 hover:scale-105 transition-all flex items-center space-x-2 group"
            >
              <Globe className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
              <span>{isZoomingToEarth ? '🚀 Orbital Descent Initiated...' : 'Establish Contact'}</span>
            </button>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
