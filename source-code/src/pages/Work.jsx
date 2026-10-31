import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Building2, Tag, Sparkles } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { subscribeToCollection, initialWorkItems } from '../services/firebase';

export default function Work() {
  const [workItems, setWorkItems] = useState(initialWorkItems);
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
    const unsub = subscribeToCollection('work_experience', (data) => {
      if (data) setWorkItems(data);
      setLoading(false);
    }, initialWorkItems);
    return () => unsub();
  }, []);

  return (
    <PageWrapper
      title="Work Experience & Roles"
      subtitle="Technical internships, systems engineering roles, and open source contributions."
      bgImage="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-end mb-4">
          
          <span className="text-xs text-slate-400 font-mono">
            Total Records: {workItems.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 font-mono text-xs animate-pulse">
            Loading work experiences from Firebase...
          </div>
        ) : (
          {(() => {
            const visibleWork = expanded ? workItems : workItems.slice(0, displayLimit);
            const remainingCount = workItems.length - displayLimit;
            return (
              <>
                <div className="space-y-5">
                  {visibleWork.map((item, index) => (
              <motion.div
                key={item.id || index}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
                whileHover={{ x: 4 }}
                className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 to-violet-600" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        {item.type || 'Role'}
                      </span>
                      {item.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-100">{item.role}</h3>
                    <div className="flex items-center space-x-2 text-xs font-medium text-violet-400 mt-0.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{item.company}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 text-xs font-mono text-slate-400">
                    <div className="flex items-center space-x-1.5 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item.period}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light mb-4">
                  {item.description}
                </p>

                {item.doc && (
                  <div className="mb-4">
                    <a
                      href={item.doc}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-semibold hover:bg-cyan-500/30 transition-all shadow-sm"
                    >
                      <span>📄 View Experience Certificate / Document ↗</span>
                    </a>
                  </div>
                )}

                {item.skills && (
                  <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2">
                    {item.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] font-mono text-cyan-300 border border-white/10 flex items-center space-x-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-cyan-400" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {workItems.length > displayLimit && (
            <div className="flex justify-center pt-8 pb-4">
              <button
                type="button"
                onClick={() => {
                  if (expanded) {
                    const el = document.getElementById('work');
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
                    ? '▲ Collapse Work History ↑'
                    : `✦ View Full Work History (${remainingCount} More) ↓`}
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
