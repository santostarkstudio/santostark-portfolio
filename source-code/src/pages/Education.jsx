import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award, BookOpen, CheckCircle, FileText, ExternalLink, Sparkles } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { subscribeToCollection, initialEducationData } from '../services/firebase';

export default function Education() {
  const [educationList, setEducationList] = useState(initialEducationData);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(3);

  useEffect(() => {
    const updateLimit = () => {
      const w = window.innerWidth;
      setDisplayLimit(w < 768 ? 1 : w < 1024 ? 2 : 3);
    };
    updateLimit();
    window.addEventListener('resize', updateLimit);
    return () => window.removeEventListener('resize', updateLimit);
  }, []);

  useEffect(() => {
    const unsub = subscribeToCollection('education', (data) => {
      if (data) setEducationList(data);
      setLoading(false);
    }, initialEducationData);
    return () => unsub();
  }, []);

  return (
    <PageWrapper
      title="Academic Education"
      subtitle="Degree milestones, VTU Computer Science curriculum, and academic achievements."
      bgImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="relative max-w-4xl mx-auto py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Synced from Firebase Store</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Total Milestones: {educationList.length}
          </span>
        </div>

        <div className="absolute left-4 md:left-1/2 top-14 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-violet-500 to-transparent -translate-x-1/2 hidden md:block" />

        {loading ? (
          <div className="text-center py-12 text-slate-400 font-mono text-xs animate-pulse">
            Loading education milestones from Firebase...
          </div>
        ) : (
          {(() => {
            const visibleList = expanded ? educationList : educationList.slice(0, displayLimit);
            const remainingCount = educationList.length - displayLimit;
            return (
              <>
                <div className="space-y-10">
                  {visibleList.map((item, index) => {
              const isEven = index % 2 === 0;
              const highlightsArr = Array.isArray(item.highlights)
                ? item.highlights
                : typeof item.highlights === 'string'
                ? item.highlights.split(/[\n,]/).map((h) => h.trim()).filter(Boolean)
                : [];

            return (
              <motion.div
                key={item.id}
                variants={{
                  initial: { opacity: 0, y: 30 },
                  animate: { opacity: 1, y: 0 }
                }}
                className={`relative flex flex-col md:flex-row items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-dark-900 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 z-10 hidden md:flex">
                  <GraduationCap className="w-4 h-4" />
                </div>

                <div className="w-full md:w-[46%]">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="glass-card p-6 rounded-3xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        {item.badge}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                        {item.grade}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-100 leading-snug">
                        {item.degree}
                      </h3>
                      <p className="text-xs font-semibold text-violet-400 mt-1 flex items-center space-x-1">
                        <span>{item.institution}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-slate-400 font-mono pt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{item.period}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-2">
                      {highlightsArr.map((h, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    {item.doc && (
                      <div className="pt-2">
                        <a
                          href={item.doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
                        >
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View Academic Certificate / Document</span>
                          <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                        </a>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {educationList.length > displayLimit && (
          <div className="flex justify-center pt-8 pb-4">
            <button
              type="button"
              onClick={() => {
                if (expanded) {
                  const el = document.getElementById('education');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
                setExpanded(!expanded);
              }}
              className="group relative inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-300 hover:text-white transition-all cursor-pointer shadow-lg active:scale-95"
              style={{
                background: 'rgba(5, 7, 17, 0.88)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(34, 211, 238, 0.35)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(34, 211, 238, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0"
                style={{ boxShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee' }}
              />
              <span>
                {expanded
                  ? '▲ Collapse Journey ↑'
                  : `✦ View Full Academic Journey (${remainingCount} More) ↓`}
              </span>
            </button>
          </div>
        )}
      </>
    );
  })()}
      )}
      </div>
    </PageWrapper>
  );
}
