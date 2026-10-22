import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Sparkles, Trophy, Flame, Layers, ExternalLink, Code, Rocket, Heart, BookOpen } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { subscribeToCollection, initialInterestsData } from '../services/firebase';

const ICON_MAP = {
  Cpu,
  Sparkles,
  Trophy,
  Flame,
  Layers,
  Code,
  Rocket,
  Heart,
  BookOpen
};

export default function Interests() {
  const [interestsList, setInterestsList] = useState(initialInterestsData);
  const [loading, setLoading] = useState(false);

  const openInViewer = (url, title) => {
    if (!url) return;
    const viewerUrl = `/viewer.html?src=${encodeURIComponent(url)}&title=${encodeURIComponent(title || 'Interest')}`;
    window.open(viewerUrl, '_blank', 'noopener');
  };

  useEffect(() => {
    const unsub = subscribeToCollection('interests', (data) => {
      if (data) setInterestsList(data);
      setLoading(false);
    }, initialInterestsData);
    return () => unsub();
  }, []);

  return (
    <PageWrapper
      title="Interests & Personal Pursuits"
      subtitle="Interactive showcase of hardware prototyping, AI graphic novel art, and sports analytics."
      bgImage="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Synced from Firebase Store</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Total Pursuits: {interestsList.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 font-mono text-xs animate-pulse">
            Loading interests & pursuits from Firebase...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interestsList.map((item) => {
              const Icon = (typeof item.icon === 'string' ? ICON_MAP[item.icon] : item.icon) || Sparkles;
              const tagsArr = Array.isArray(item.tags)
                ? item.tags
                : typeof item.tags === 'string'
                ? item.tags.split(/[\n,]/).map((t) => t.trim()).filter(Boolean)
                : [];

            return (
              <motion.div
                key={item.id}
                variants={{
                  initial: { opacity: 0, y: 30 },
                  animate: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between shadow-2xl relative group"
              >
                <div>
                  <div
                    className="relative h-56 w-full overflow-hidden bg-slate-900 cursor-pointer group/img"
                    onClick={() => openInViewer(item.image, item.title)}
                    title="Click to view full screen"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-transparent" />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                      <span className="px-3 py-1.5 rounded-xl bg-black/80 text-white font-semibold text-xs border border-white/20 flex items-center space-x-1.5">
                        <span>↗</span><span>Open Full Screen</span>
                      </span>
                    </div>
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 backdrop-blur-md">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.badge}</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-extrabold text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      </div>
    </PageWrapper>
  );
}
