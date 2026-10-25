import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Globe, Cpu, Terminal, User, FileText } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { subscribeToDoc, initialAboutInfo, initialHeroInfo } from '../services/firebase';

export default function About() {
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

    // Open clean, high-resolution viewing window in new tab (works with CMS Base64 uploads & URLs)
    const newTab = window.open('', '_blank');
    if (!newTab) {
      window.open(aboutInfo.photo, '_blank');
      return;
    }

    newTab.document.open();
    newTab.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profile Photo | Full Resolution</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, #0e172a 0%, #050811 100%);
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    }
    .photo-stage {
      max-width: 100%;
      max-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      max-width: 94vw;
      max-height: 92vh;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 35px 80px -20px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 242, 254, 0.1);
      pointer-events: none;
      -webkit-user-drag: none;
      user-drag: none;
    }
  </style>
</head>
<body oncontextmenu="return false;" onkeydown="if(event.ctrlKey&&(event.key==='s'||event.key==='p'||event.key==='u')){event.preventDefault();return false;}">
  <div class="photo-stage">
    <img id="fullPhoto" alt="Profile Photo" draggable="false" />
  </div>
  <script>
    document.addEventListener('contextmenu', function(e) { e.preventDefault(); return false; });
    document.addEventListener('dragstart', function(e) { e.preventDefault(); return false; });
  <\/script>
</body>
</html>`);
    newTab.document.close();

    const imgEl = newTab.document.getElementById('fullPhoto');
    if (imgEl) {
      imgEl.src = aboutInfo.photo;
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

            {/* Option 2: Ultra-Clean Studio Bento Thumbnail Card */}
            <div
              onClick={handlePhotoClick}
              title="Click to view full photo in a new tab"
              className="w-full h-72 sm:h-80 md:h-[390px] lg:h-[430px] rounded-3xl p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] cursor-pointer group relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(0,242,254,0.15),0_20px_40px_rgba(0,0,0,0.8)]"
            >
              <div className="w-full h-full bg-slate-950/80 backdrop-blur-xl rounded-[23px] overflow-hidden relative flex items-center justify-center">
                {aboutInfo.photo ? (
                  <>
                    <img
                      src={aboutInfo.photo}
                      alt="Profile Photo"
                      draggable="false"
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />

                    {/* Tactile soft glass reflection sweep on hover */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900/50 text-slate-400 text-xs">
                    <User className="w-16 h-16 text-cyan-400 mb-2 opacity-80" />
                    <span className="text-sm font-semibold text-slate-200">Upload Profile Photo</span>
                    <span className="text-[11px] font-mono text-slate-500 mt-1">Use Admin CMS to upload your picture!</span>
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
    </PageWrapper>
  );
}
