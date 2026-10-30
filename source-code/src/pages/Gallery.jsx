import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Maximize2, Sparkles, Filter } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { subscribeToCollection, initialGallery } from '../services/firebase';

export default function Gallery() {
  const [images, setImages] = useState(initialGallery);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  const openInViewer = (url, title) => {
    if (!url) return;
    const viewerUrl = `/viewer.html?src=${encodeURIComponent(url)}&title=${encodeURIComponent(title || 'Gallery Image')}`;
    window.open(viewerUrl, '_blank', 'noopener');
  };

  useEffect(() => {
    const unsub = subscribeToCollection('gallery', (data) => {
      if (data) setImages(data);
      setLoading(false);
    }, initialGallery);
    return () => unsub();
  }, []);

  const [expanded, setExpanded] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(6);
  const sectionRef = React.useRef(null);

  useEffect(() => {
    const updateLimit = () => {
      const w = window.innerWidth;
      setDisplayLimit(w < 768 ? 4 : w < 1024 ? 6 : Infinity);
    };
    updateLimit();
    window.addEventListener('resize', updateLimit);
    return () => window.removeEventListener('resize', updateLimit);
  }, []);

  const [sortBy, setSortBy] = useState('newest');

  const categories = ['All', 'Hardware', 'Robotics', 'AI Art', 'Analytics', 'Workspace'];

  let filteredImages = filter === 'All' 
    ? images 
    : images.filter(img => img.category === filter);

  filteredImages = [...filteredImages].sort((a, b) => {
    const ya = Number(a.year || (a.date ? a.date.match(/\d{4}/)?.[0] : 0) || 0);
    const yb = Number(b.year || (b.date ? b.date.match(/\d{4}/)?.[0] : 0) || 0);
    if (sortBy === 'newest') return yb - ya || (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'oldest') return ya - yb || (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'name-asc') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'name-desc') return (b.title || '').localeCompare(a.title || '');
    return 0;
  });

  return (
    <PageWrapper
      title="Interactive Visual Gallery"
      subtitle="Hardware prototypes, bench test setups, AI digital art, and analytics dashboards."
      bgImage="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="space-y-8">
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 rounded-2xl glass-panel border border-white/10 overflow-hidden">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full touch-pan-x -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  filter === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <span className="text-[11px] font-mono text-slate-400 shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-cyan-300 text-xs font-mono font-medium border border-cyan-500/30 shadow-md focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="newest">🕒 Date: Newest First</option>
              <option value="oldest">⏳ Date: Oldest First</option>
              <option value="name-asc">🔤 Title: A → Z</option>
              <option value="name-desc">🔤 Title: Z → A</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400 font-mono text-xs animate-pulse">
            Fetching gallery records from Firebase Firestore...
          </div>
        ) : (
          <>
          <div ref={sectionRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(expanded ? filteredImages : filteredImages.slice(0, displayLimit)).map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1 }
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => openInViewer(item.image, item.title)}
                className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-xl cursor-pointer group relative"
              >
                <div className="relative h-64 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent group-hover:via-dark-900/40 transition-colors" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-4 py-2 rounded-2xl bg-black/80 text-white font-semibold text-xs border border-white/20 flex items-center space-x-2 backdrop-blur-md shadow-xl">
                      <Maximize2 className="w-4 h-4 text-cyan-400" />
                      <span>Open Full Screen ↗</span>
                    </span>
                  </div>

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 backdrop-blur-md">
                    {item.category}
                  </span>
                </div>

                <div className="p-5">
                  <h4 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          {filteredImages.length > displayLimit && (
            <div className="flex justify-center pt-4 pb-2">
              <button
                type="button"
                onClick={() => {
                  if (expanded && sectionRef.current) {
                    sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  setExpanded(!expanded);
                }}
                className="group relative inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-300 hover:text-white transition-all cursor-pointer shadow-lg active:scale-95"
                style={{
                  background: 'rgba(5, 7, 17, 0.88)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(34, 211, 238, 0.35)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 20px rgba(34,211,238,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" style={{ boxShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee' }} />
                <span>
                  {expanded
                    ? '▲ Collapse Gallery ↑'
                    : `✦ View Full Gallery (${filteredImages.length - displayLimit} More) ↓`}
                </span>
              </button>
            </div>
          )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
