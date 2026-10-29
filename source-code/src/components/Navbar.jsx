import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  User, 
  Code,
  GraduationCap, 
  Briefcase, 
  FolderGit2, 
  Award, 
  Sparkles, 
  Image, 
  Mail, 
  ShieldCheck, 
  Menu, 
  X,
  Terminal,
  Clapperboard
} from 'lucide-react';
import { subscribeToDoc, initialHeroInfo } from '../services/firebase';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About', icon: User },
  { path: '/skills', label: 'Skills', icon: Code },
  { path: '/education', label: 'Education', icon: GraduationCap },
  { path: '/work', label: 'Work', icon: Briefcase },
  { path: '/projects', label: 'Projects', icon: FolderGit2 },
  { path: '/certificates', label: 'Certificates', icon: Award },
  { path: '/interests', label: 'Interests', icon: Sparkles },
  { path: '/gallery', label: 'Gallery', icon: Image },
  { path: '/studio', label: 'Studio', icon: Clapperboard },
  { path: '/contact', label: 'Contact', icon: Mail },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroInfo, setHeroInfo] = useState(() => {
    try {
      const cached = localStorage.getItem("portfolio_hero_info");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.length > 0) return { ...initialHeroInfo, ...parsed[0] };
        if (parsed && typeof parsed === "object") return { ...initialHeroInfo, ...parsed };
      }
    } catch {}
    return initialHeroInfo;
  });
  const [activeSection, setActiveSection] = useState('/');
  const [hoveredSection, setHoveredSection] = useState(null);

  useEffect(() => {
    const unsub = subscribeToDoc('hero_info', 'main_hero', (data) => {
      if (data) setHeroInfo({ ...initialHeroInfo, ...data });
    }, initialHeroInfo);
    return () => unsub();
  }, []);

  useEffect(() => {
    const sections = [
      { id: 'home', path: '/' },
      { id: 'about', path: '/about' },
      { id: 'skills', path: '/skills' },
      { id: 'education', path: '/education' },
      { id: 'work', path: '/work' },
      { id: 'projects', path: '/projects' },
      { id: 'certificates', path: '/certificates' },
      { id: 'interests', path: '/interests' },
      { id: 'gallery', path: '/gallery' },
      { id: 'contact', path: '/contact' }
    ];

    const handleScroll = () => {
      const scrollY = window.pageYOffset + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i].path);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Floating Black Pill Header for /studio
  if (location.pathname === '/studio') {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 pointer-events-none">
        <div
          className="pointer-events-auto w-full mx-4 sm:mx-8 md:mx-12"
          style={{ maxWidth: '1100px' }}
        >
          <div
            className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 relative"
            style={{
              background: 'rgba(5, 7, 17, 0.82)',
              backdropFilter: 'blur(28px) saturate(1.3)',
              WebkitBackdropFilter: 'blur(28px) saturate(1.3)',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.70), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07)',
            }}
          >
            {/* Back Button */}
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/';
              }}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-cyan-300 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0 z-10"
              style={{
                background: 'rgba(34,211,238,0.08)',
                border: '1px solid rgba(34,211,238,0.25)',
                borderRadius: '999px',
              }}
            >
              <span className="text-sm font-bold">←</span>
              <span>Portfolio</span>
            </Link>

            {/* Brand - Absolute Centre */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full bg-cyan-400"
                  style={{ boxShadow: '0 0 8px rgba(34,211,238,0.9)', flexShrink: 0 }}
                />
                <span
                  className="text-xs sm:text-sm font-extrabold uppercase"
                  style={{
                    background: 'linear-gradient(90deg, #22d3ee 0%, #a78bfa 50%, #fbbf24 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.18em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {heroInfo.brandName || 'SANTO STARK STUDIO'}
                </span>
              </div>
            </div>

            {/* Status - Right */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-emerald-400 text-[10px] sm:text-[11px] font-mono font-bold shrink-0 z-10"
              style={{
                background: 'rgba(52,211,153,0.07)',
                border: '1px solid rgba(52,211,153,0.22)',
                borderRadius: '999px',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Online</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 py-2.5 transition-all duration-300">
      <div className="max-w-[1550px] w-full mx-auto glass-panel rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between border border-white/10 shadow-2xl backdrop-blur-xl">
        
        {/* Brand Logo / Display Picture (DP) */}
        <div className="flex items-center space-x-3 group">
          <div 
            onClick={(e) => {
              if (heroInfo.brandLogo) {
                e.preventDefault();
                e.stopPropagation();
                if (heroInfo.brandLogo.startsWith('data:')) {
                  const win = window.open('', '_blank');
                  if (win) {
                    win.document.write(`<html style="background:#090a0f;"><head><title>Brand Logo Preview</title></head><body style="margin:0;background:#090a0f;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="${heroInfo.brandLogo}" style="max-width:95vw;max-height:95vh;object-fit:contain;box-shadow:0 0 40px rgba(34,211,238,0.3);border-radius:16px;" /></body></html>`);
                  }
                } else {
                  window.open(heroInfo.brandLogo, '_blank');
                }
              }
            }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 p-[2px] shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform cursor-pointer"
            title={heroInfo.brandLogo ? "Click to view full high quality logo in new tab ↗" : "Santo Stark Studio Logo"}
          >
            <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center overflow-hidden">
              {heroInfo.brandLogo ? (
                <img 
                  src={heroInfo.brandLogo} 
                  alt="Brand Logo" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                </div>
              )}
            </div>
          </div>

          <Link 
            to="/" 
            className="flex flex-col cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('/');
              if (window.starkScrollTo) {
                window.starkScrollTo('home');
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent tracking-wide">
              {heroInfo.brandName || "SANTO STARK STUDIO"}
            </span>
            <span className="block text-[10px] text-slate-400 tracking-widest uppercase font-mono">
              {heroInfo.brandSubtitle || "cybersecurity and cse"}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-0.5 2xl:space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isCurrent = (hoveredSection || activeSection) === item.path || (location.pathname === item.path);

            return (
              <Link 
                key={item.path} 
                to={item.path}
                onMouseEnter={() => setHoveredSection(item.path)}
                onMouseLeave={() => setHoveredSection(null)}
                onClick={(e) => {
                  if (item.path === '/studio') {
                    setActiveSection('/studio');
                    return;
                  }
                  if (location.pathname === '/studio') {
                    e.preventDefault();
                    const targetId = item.path === '/' ? 'home' : item.path.replace('/', '');
                    window.location.href = '/#' + targetId;
                    return;
                  }
                  setActiveSection(item.path);
                  const targetId = item.path === '/' ? 'home' : item.path.replace('/', '');
                  if (window.starkScrollTo) {
                    e.preventDefault();
                    window.starkScrollTo(targetId);
                  } else {
                    const el = document.getElementById(targetId);
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-2 2xl:px-2.5 py-1.5 rounded-xl text-[11px] 2xl:text-xs font-semibold flex items-center space-x-1 transition-colors ${
                    isCurrent 
                      ? 'text-cyan-400 font-bold z-10' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {isCurrent && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.4)] pointer-events-none -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}

          <Link to="/admin">
            <motion.div
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-2.5 py-2 rounded-xl text-slate-400 hover:text-violet-300 hover:bg-violet-500/10 transition-colors"
              title="Owner Admin CMS"
            >
              <ShieldCheck className="w-4 h-4" />
            </motion.div>
          </Link>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center space-x-2 xl:hidden">
          <Link to="/admin" className="p-2 rounded-xl text-slate-400 hover:text-violet-300 hover:bg-violet-500/10">
            <ShieldCheck className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl glass-card text-slate-200 hover:text-cyan-400 transition-colors"
            aria-label="Toggle Mobile Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden max-w-7xl mx-auto mt-2 glass-panel rounded-2xl p-4 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      if (item.path === '/studio') {
                        setActiveSection('/studio');
                        return;
                      }
                      if (location.pathname === '/studio') {
                        e.preventDefault();
                        const targetId = item.path === '/' ? 'home' : item.path.replace('/', '');
                        window.location.href = '/#' + targetId;
                        return;
                      }
                      setActiveSection(item.path);
                      const targetId = item.path === '/' ? 'home' : item.path.replace('/', '');
                      if (window.starkScrollTo) {
                        e.preventDefault();
                        window.starkScrollTo(targetId);
                      } else {
                        const el = document.getElementById(targetId);
                        if (el) {
                          e.preventDefault();
                          el.scrollIntoView({ behavior: 'smooth' });
                        } else if (item.path === '/') {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }
                    }}
                  >
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
