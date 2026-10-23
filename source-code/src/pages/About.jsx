import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Globe, Cpu, Terminal, User, FileText, X, Maximize2 } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { subscribeToDoc, initialAboutInfo, initialHeroInfo } from '../services/firebase';

export default function About() {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [aboutInfo, setAboutInfo] = useState(initialAboutInfo);
  const [heroInfo, setHeroInfo] = useState(initialHeroInfo);

  useEffect(() => {
    const unsubAbout = subscribeToDoc('about_info', 'main_about', (data) => {
      if (data) setAboutInfo({ ...initialAboutInfo, ...data });
    }, initialAboutInfo);

    const unsubHero = subscribeToDoc('hero_info', 'main_hero', (data) => {
      if (data) setHeroInfo({ ...initialHeroInfo, ...data });
    }, initialHeroInfo);

    return () => {
      unsubAbout();
      unsubHero();
    };
  }, []);

  const handlePhotoClick = (e) => {
    e.preventDefault();
    if (!aboutInfo.photo) return;

    if (aboutInfo.photo.startsWith('http')) {
      window.open(aboutInfo.photo, '_blank');
    } else {
      setShowPhotoModal(true);
    }
  };

  return (
    <PageWrapper
      title="About Me"
      subtitle="Engineering overview, academic background, and system design philosophy."
      bgImage="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="space-y-8 max-w-5xl mx-auto">
        <motion.div
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
          }}
          className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl space-y-6"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div className="space-y-5">
              <div className="flex items-center space-x-3">
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10">
                  <Terminal className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 leading-tight">{aboutInfo.title}</h2>
                  <p className="text-xs font-mono text-cyan-400 mt-1">{aboutInfo.institution}</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light">
                {aboutInfo.bio}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {heroInfo.resume && (
                  <a
                    href={heroInfo.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>📄 View / Download Official Resume PDF ↗</span>
                  </a>
                )}
              </div>
            </div>

            <div className="w-full h-80 md:h-[400px] rounded-3xl bg-gradient-to-br from-cyan-500 via-violet-600 to-cyan-400 p-[3px] shadow-2xl shadow-cyan-500/20 group relative overflow-hidden">
              <div className="w-full h-full bg-dark-900 rounded-[22px] overflow-hidden relative flex items-center justify-center">
                {aboutInfo.photo ? (
                  <div
                    onClick={handlePhotoClick}
                    title="Click to view high quality photo"
                    className="w-full h-full cursor-zoom-in relative"
                  >
                    <img
                      src={aboutInfo.photo}
                      alt="Profile Photo"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-dark-800 text-slate-400 text-xs">
                    <User className="w-16 h-16 text-cyan-400 mb-2" />
                    <span className="text-sm font-bold text-slate-200">Upload Your About Photo</span>
                    <span className="text-[11px] font-mono text-slate-400 mt-1">Use Admin CMS to upload your picture!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 hover:border-cyan-400/30 transition-all">
              <Code className="w-5 h-5 text-cyan-400" />
              <h4 className="font-bold text-sm text-slate-100">{aboutInfo.card1Title || 'Systems & C++'}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{aboutInfo.card1Desc || 'Memory optimization, socket communication, multi-threaded task management.'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 hover:border-violet-400/30 transition-all">
              <Globe className="w-5 h-5 text-violet-400" />
              <h4 className="font-bold text-sm text-slate-100">{aboutInfo.card2Title || 'Web & 3D Graphics'}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{aboutInfo.card2Desc || 'React, Vite, Three.js/R3F WebGL shaders, Tailwind CSS, and Firebase backends.'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 hover:border-emerald-400/30 transition-all">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-sm text-slate-100">{aboutInfo.card3Title || 'IoT & Embedded'}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{aboutInfo.card3Desc || 'ESP32, FreeRTOS, MQTT, sensor bus protocols (I2C, SPI), and custom PCB design.'}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPhotoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPhotoModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-slate-950 p-4 rounded-3xl border border-white/20 shadow-2xl z-10 flex flex-col items-center max-h-[90vh]"
            >
              <button
                onClick={() => setShowPhotoModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="w-full flex justify-center overflow-hidden rounded-2xl max-h-[80vh]">
                <img
                  src={aboutInfo.photo}
                  alt="High Resolution Profile Photo"
                  className="w-full h-full object-contain rounded-2xl shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
