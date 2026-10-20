import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Cpu, ExternalLink, FileText, ChevronRight } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import RequestAccessModal from '../components/RequestAccessModal';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import { subscribeToCollection, initialProjects } from '../services/firebase';

export default function Projects() {
  const [projectsList, setProjectsList] = useState(initialProjects);

  useEffect(() => {
    const unsub = subscribeToCollection('projects', (docs) => {
      if (docs) setProjectsList(docs);
    }, initialProjects);
    return () => unsub();
  }, []);

  const [selectedAccessProject, setSelectedAccessProject] = useState(null);
  const [activeDetailsProject, setActiveDetailsProject] = useState(null);

  return (
    <PageWrapper
      title="Engineering & Project Portfolio"
      subtitle="Interactive Web3D applications, distributed backend microservices, and embedded hardware architectures."
      bgImage="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projectsList.map((project) => {
            const specsArr = Array.isArray(project.specs) 
              ? project.specs 
              : typeof project.specs === 'string'
              ? project.specs.split('\n').filter(Boolean)
              : [];

            const techArr = Array.isArray(project.tech)
              ? project.tech
              : project.category
              ? [project.category]
              : ['React', 'Firebase'];

            return (
              <motion.div
                key={project.id || project.title}
                variants={{
                  initial: { opacity: 0, y: 25 },
                  animate: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -6 }}
                className="glass-card rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between shadow-2xl relative group cursor-pointer"
                onClick={() => setActiveDetailsProject(project)}
              >
                <div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      const imgUrl = project.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80";
                      if (imgUrl.startsWith('data:')) {
                        const win = window.open('', '_blank');
                        if (win) {
                          win.document.write(`<html style="background:#090a0f;"><head><title>${project.title} Image</title></head><body style="margin:0;background:#090a0f;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="${imgUrl}" style="max-width:95vw;max-height:95vh;object-fit:contain;box-shadow:0 0 40px rgba(34,211,238,0.3);border-radius:16px;" /></body></html>`);
                        }
                      } else {
                        window.open(imgUrl, '_blank');
                      }
                    }}
                    title="Click to view high quality image in separate tab ↗"
                    className="relative h-48 w-full overflow-hidden bg-slate-900 group cursor-zoom-in"
                  >
                    <img
                      src={project.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
                    
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 backdrop-blur-md">
                      {project.category || "Engineering"}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
                      {project.description}
                    </p>

                    {specsArr.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        {specsArr.slice(0, 2).map((spec, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                            <span className="line-clamp-1">{spec}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {techArr.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDetailsProject(project);
                    }}
                    className="w-full py-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center space-x-2 hover:bg-cyan-500/30 transition-all shadow-md"
                  >
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>📖 Read Full Report &amp; View Media ↗</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAccessProject(project.title);
                    }}
                    className="w-full py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 text-slate-300 font-semibold text-xs flex items-center justify-center space-x-2 hover:text-violet-300 transition-all"
                  >
                    <Lock className="w-4 h-4 text-violet-400" />
                    <span>Request PCB &amp; Source Access</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <ProjectDetailsModal
          isOpen={!!activeDetailsProject}
          onClose={() => setActiveDetailsProject(null)}
          project={activeDetailsProject}
        />

        <RequestAccessModal
          isOpen={!!selectedAccessProject}
          onClose={() => setSelectedAccessProject(null)}
          projectTitle={selectedAccessProject}
        />
      </div>
    </PageWrapper>
  );
}
