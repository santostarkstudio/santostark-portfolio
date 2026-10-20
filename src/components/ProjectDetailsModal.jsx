import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, FileText, Lock, Video, ShieldCheck, Cpu, Code2, Globe, FileCode } from 'lucide-react';
import RequestAccessModal from './RequestAccessModal';

export default function ProjectDetailsModal({ isOpen, onClose, project }) {
  const [showAccessModal, setShowAccessModal] = useState(false);

  if (!isOpen || !project) return null;

  const techArr = Array.isArray(project.tech)
    ? project.tech
    : project.category
    ? [project.category]
    : ['React', 'Firebase', 'Systems'];

  const specsArr = Array.isArray(project.specs)
    ? project.specs
    : typeof project.specs === 'string'
    ? project.specs.split('\n').filter(Boolean)
    : [];

  const docUrl = project.doc || project.reportDoc || project.pdfUrl;
  const videoUrl = project.video || project.demoVideo;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Dark Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative max-w-5xl w-full glass-panel rounded-3xl border border-white/20 shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden my-auto"
          >
            {/* Header Toolbar */}
            <div className="p-5 md:p-6 bg-slate-950/90 border-b border-white/10 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {project.category || 'Engineering Project'}
                  </span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-100 mt-0.5 leading-tight">
                    {project.title}
                  </h2>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Body Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-8 custom-scrollbar">
              
              {/* Top Banner Media Preview */}
              {project.image && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    const imgUrl = project.image;
                    if (imgUrl.startsWith('data:')) {
                      const win = window.open('', '_blank');
                      if (win) {
                        win.document.write(`<html style="background:#090a0f;"><head><title>${project.title} High Quality Image</title></head><body style="margin:0;background:#090a0f;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="${imgUrl}" style="max-width:95vw;max-height:95vh;object-fit:contain;box-shadow:0 0 40px rgba(34,211,238,0.3);border-radius:16px;" /></body></html>`);
                      }
                    } else {
                      window.open(imgUrl, '_blank');
                    }
                  }}
                  title="Click to view high quality image in separate tab ↗"
                  className="w-full h-64 md:h-80 rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl relative group cursor-zoom-in"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
                </div>
              )}

              {/* Action Buttons Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-b border-white/10 pb-6">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-slate-950 flex items-center space-x-2 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Launch Live Interactive Demo ↗</span>
                  </a>
                )}

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-2xl glass-card text-xs font-bold text-slate-200 border border-white/15 flex items-center space-x-2 hover:border-cyan-400 transition-all"
                  >
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span>View GitHub Code ↗</span>
                  </a>
                )}

                <button
                  onClick={() => setShowAccessModal(true)}
                  className="px-5 py-3 rounded-2xl bg-violet-600/30 text-violet-300 border border-violet-500/40 text-xs font-bold flex items-center space-x-2 hover:bg-violet-600/40 transition-all"
                >
                  <Lock className="w-4 h-4 text-violet-400" />
                  <span>Request Full PCB &amp; Source Access</span>
                </button>
              </div>

              {/* Executive Summary */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span>Engineering Overview</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light whitespace-pre-wrap bg-white/5 p-5 rounded-2xl border border-white/5">
                  {project.longDescription || project.description}
                </p>
              </div>

              {/* Embedded Document / Report Reader */}
              {docUrl && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      <span>Interactive Project Report &amp; Document Viewer</span>
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                      ✓ Embedded Read-Only Mode (No Download Required)
                    </span>
                  </div>

                  <div className="w-full h-[520px] rounded-3xl overflow-hidden border border-white/15 bg-slate-950 shadow-2xl relative">
                    <iframe
                      src={docUrl}
                      title={`${project.title} Report`}
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}

              {/* Embedded Demo Video Player */}
              {videoUrl && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                    <Video className="w-5 h-5 text-violet-400" />
                    <span>Project Demonstration Video</span>
                  </h3>
                  <div className="w-full h-80 md:h-[450px] rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl">
                    <iframe
                      src={videoUrl.includes('youtube') ? videoUrl.replace('watch?v=', 'embed/') : videoUrl}
                      title={`${project.title} Video Demo`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Technical Specifications */}
              {specsArr.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-200">System Architecture Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {specsArr.map((spec, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack Pills */}
              <div className="space-y-3 pt-2">
                <h3 className="text-base font-bold text-slate-200">Technologies &amp; Frameworks Utilized</h3>
                <div className="flex flex-wrap gap-2">
                  {techArr.map((t, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Request Access Modal Nested */}
      <RequestAccessModal
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
        projectTitle={project.title}
      />
    </>
  );
}
