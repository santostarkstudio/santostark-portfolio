import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Maximize2, Sparkles, Filter } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import LightboxModal from '../components/LightboxModal';
import { subscribeToCollection, initialGallery } from '../services/firebase';

export default function Gallery() {
  const [images, setImages] = useState(initialGallery);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = subscribeToCollection('gallery', (data) => {
      if (data) setImages(data);
      setLoading(false);
    }, initialGallery);
    return () => unsub();
  }, []);

  const categories = ['All', 'Hardware', 'Robotics', 'AI Art', 'Analytics', 'Workspace'];

  const filteredImages = filter === 'All' 
    ? images 
    : images.filter(img => img.category === filter);

  return (
    <PageWrapper
      title="Interactive Visual Gallery"
      subtitle="Hardware prototypes, bench test setups, AI digital art, and analytics dashboards."
      bgImage="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dynamic Firebase Image Sync</span>
          </div>

          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl glass-panel border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  filter === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400 font-mono text-xs animate-pulse">
            Fetching gallery records from Firebase Firestore...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1 }
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => setSelectedImage(item)}
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
                      <span>Expand Lightbox</span>
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
        )}

        <LightboxModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          item={selectedImage}
        />
      </div>
    </PageWrapper>
  );
}
