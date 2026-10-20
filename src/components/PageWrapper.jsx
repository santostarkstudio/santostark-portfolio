import React from 'react';
import { motion } from 'framer-motion';

// Page variant configurations
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.99
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: {
      duration: 0.25
    }
  }
};

export default function PageWrapper({ children, bgImage, title, subtitle, isHome = false }) {
  React.useEffect(() => {
    const saved = localStorage.getItem('portfolio_hero_info');
    let brand = "Santo Stark Studio";
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0 && parsed[0].brandName) {
          brand = parsed[0].brandName;
        }
      } catch (e) {}
    }
    document.title = title ? `${title} | ${brand}` : brand;
  }, [title]);

  // If Home page, no image overlay background (Home uses full-screen 3D Canvas)
  if (isHome) {
    return (
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative w-full min-h-screen pt-20"
      >
        {children}
      </motion.main>
    );
  }

  // Default high quality Unsplash tech wallpapers if bgImage is missing
  const defaultBg = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80";
  const bgUrl = bgImage || defaultBg;

  return (
    <div className="relative w-full min-h-screen bg-[#090a0f] overflow-hidden">
      {/* Fixed Background Image Container (iOS Safari & Android Smooth Hardware Accelerated Fix) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none transform-gpu"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />

      {/* Dark overlay backdrop for perfect text readability across screens */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-0 pointer-events-none" />

      {/* Main Page Content Container */}
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20 flex flex-col min-h-screen"
      >
        {/* Page Header (Title + Subtitle) */}
        {(title || subtitle) && (
          <motion.div 
            variants={{
              initial: { opacity: 0, y: 15 },
              animate: { opacity: 1, y: 0 }
            }}
            className="mb-8 sm:mb-10 text-center md:text-left"
          >
            {title && (
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl font-light leading-relaxed">
                {subtitle}
              </p>
            )}
            <div className="mt-3 sm:mt-4 w-16 sm:w-20 h-1 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-full mx-auto md:mx-0" />
          </motion.div>
        )}

        {children}
      </motion.main>
    </div>
  );
}
