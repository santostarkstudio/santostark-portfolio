import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function LightboxModal({ isOpen, onClose, item }) {
  useEffect(() => {
    if (!isOpen) return;
    const cleanup = () => onClose && onClose();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') cleanup();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('focus', cleanup);
    window.addEventListener('blur', cleanup);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) cleanup();
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('focus', cleanup);
      window.removeEventListener('blur', cleanup);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const imageUrl = item.image || item.certImage || item.photo || item.src || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80";

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-3 sm:p-6 cursor-pointer select-none animate-fadeIn"
      >
        {/* Backdrop for click detection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Top Action Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl flex items-center justify-between pb-3 z-20 cursor-default"
        >
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
              {item.category || item.issuer || "HD Theater View"}
            </span>
            {item.date && (
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {item.date}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-400/50 text-xs font-mono font-bold flex items-center space-x-1.5 shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <X className="w-4 h-4" />
            <span>Close (Esc)</span>
          </button>
        </div>

        {/* Main Edge-to-Edge Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          onClick={onClose}
          className="relative max-w-5xl w-full flex flex-col items-center justify-center cursor-pointer"
        >
          <img
            src={imageUrl}
            alt={item.title || item.name || "Preview"}
            onClick={onClose}
            className="max-h-[76vh] max-w-[94vw] object-contain rounded-3xl shadow-2xl border border-white/20 hover:opacity-95 transition-opacity"
          />

          <div className="mt-3 text-center space-y-1 pointer-events-none">
            {(item.title || item.name) && (
              <h3 className="text-sm sm:text-base font-bold text-slate-100">
                {item.title || item.name}
              </h3>
            )}
            <p className="text-[11px] font-mono text-slate-400">
              Tap anywhere or press ESC to return to website
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
