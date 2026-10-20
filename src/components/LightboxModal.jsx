import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Tag } from 'lucide-react';

export default function LightboxModal({ isOpen, onClose, item }) {
  if (!isOpen || !item) return null;

  const imageUrl = item.image || item.certImage || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Dark backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          className="relative max-w-4xl w-full glass-panel rounded-3xl overflow-hidden border border-white/20 shadow-2xl z-10 max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image preview section */}
          <div className="w-full md:w-3/5 bg-black flex items-center justify-center min-h-[300px] overflow-hidden relative">
            <img
              src={imageUrl}
              alt={item.title || item.name}
              className="w-full h-full object-contain max-h-[70vh]"
            />
          </div>

          {/* Details section */}
          <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between space-y-4 bg-dark-900/90">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  {item.category || item.issuer || 'Preview'}
                </span>
                {item.date && (
                  <span className="text-xs text-slate-400 font-mono">{item.date}</span>
                )}
              </div>

              <h2 className="text-2xl font-extrabold text-slate-100 mb-3 leading-tight">
                {item.title || item.name}
              </h2>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
                {item.description || item.summary || "Full high-resolution visual capture and engineering metadata."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
