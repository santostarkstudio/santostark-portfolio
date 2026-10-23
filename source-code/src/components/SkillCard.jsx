import React from 'react';
import { motion } from 'framer-motion';
import { Star, Code, Cpu, Globe } from 'lucide-react';

export default function SkillCard({ name, category, description, rating = 8 }) {
  const getCategoryIcon = () => {
    switch (category) {
      case 'Languages': return <Code className="w-4 h-4 text-cyan-400" />;
      case 'Web': return <Globe className="w-4 h-4 text-violet-400" />;
      case 'Hardware': return <Cpu className="w-4 h-4 text-emerald-400" />;
      default: return <Code className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-white/10 shadow-lg relative overflow-hidden group"
    >
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
            {getCategoryIcon()}
            <span>{category}</span>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
            {rating}/10
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
          {name}
        </h3>

        <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1.5">
          <span>Proficiency</span>
          <span>{rating * 10}%</span>
        </div>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 10 }).map((_, idx) => {
            const isFilled = idx < rating;
            return (
              <Star
                key={idx}
                className={`w-3.5 h-3.5 transition-all duration-300 ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : 'text-slate-700 fill-transparent'
                }`}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
