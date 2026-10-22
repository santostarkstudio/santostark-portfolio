import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, ShieldCheck, CheckCircle, FileText } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { fetchCollectionData, subscribeToCollection, initialCertificatesData } from '../services/firebase';

export { initialCertificatesData };

export default function Certificates() {
  const [certsList, setCertsList] = useState(initialCertificatesData);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const unsub = subscribeToCollection('certificates', (docs) => {
      if (docs) setCertsList(docs);
    }, initialCertificatesData);
    return () => unsub();
  }, []);

  const openDocumentInNewTab = (url, title) => {
    if (!url) return;
    if (window.openDocumentInNewTab) {
      window.openDocumentInNewTab(url, title);
      return;
    }
    try {
      sessionStorage.setItem('stark_viewer_doc', url);
      sessionStorage.setItem('stark_viewer_title', title || 'Certificate Document');
      localStorage.setItem('stark_viewer_doc', url);
      localStorage.setItem('stark_viewer_title', title || 'Certificate Document');
    } catch (e) {}
    const win = window.open('/viewer.html', '_blank');
    if (win) {
      try { win.starkActiveDocument = { url, title: title || 'Certificate Document' }; } catch (e) {}
    }
  };

  return (
    <PageWrapper
      title="Certificates & Credentials"
      subtitle="Publicly accessible industry accreditations in Data Science, Blockchain, AWS Cloud, and Systems Architecture."
      bgImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certsList.map((cert) => {
            const isPdf = (v) => v && (v.startsWith('data:application/pdf') || v.includes('.pdf'));
            const docToOpen = cert.doc || cert.image;
            const hasPdf = isPdf(cert.doc) || isPdf(cert.image);
            const thumbSrc = !isPdf(cert.image) ? cert.image : null;

            return (
              <motion.div
                key={cert.id || cert.title}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -4 }}
                onClick={() => docToOpen && openDocumentInNewTab(docToOpen, cert.title)}
                className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between cursor-pointer group shadow-xl relative overflow-hidden space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        {cert.category || 'Certification'}
                      </span>
                      <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-xs font-semibold text-violet-400">
                        {cert.issuer}
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex-shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                  </div>

                  {(thumbSrc || hasPdf) && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        openDocumentInNewTab(docToOpen || thumbSrc, cert.title);
                      }}
                      title="Click to open verified certificate in new tab ↗"
                      className="h-40 w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative cursor-zoom-in"
                    >
                      {thumbSrc ? (
                        <img
                          src={thumbSrc}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center space-y-2.5 bg-gradient-to-br from-slate-900 to-slate-800">
                          <span className="text-5xl select-none">📄</span>
                          <span className="text-xs font-mono text-cyan-400 font-bold">PDF Document Accreditation</span>
                          <span className="text-[10px] text-slate-400 font-mono">Click View Certificate to read</span>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
                    {cert.summary || cert.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <div className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>ID: {cert.credentialId || 'Verified Public Record'}</span>
                    </div>
                    <span>{cert.date}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (docToOpen) {
                          openDocumentInNewTab(docToOpen, cert.title);
                        }
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-slate-950 flex items-center justify-center space-x-1.5 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-slate-950" />
                      <span>🔍 View Certificate ↗</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCert(cert);
                      }}
                      className="w-full sm:w-auto py-2.5 px-4 rounded-xl glass-card border border-white/15 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1 hover:border-cyan-400 transition-all cursor-pointer"
                    >
                      <span>View Summary</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Certificate Summary Modal */}
        {selectedCert && (
          <div 
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full glass-panel rounded-3xl border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl bg-slate-950/95"
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    {selectedCert.category || 'Professional Credential'}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-100">{selectedCert.title}</h3>
                  <p className="text-xs font-semibold text-violet-400">{selectedCert.issuer}</p>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-emerald-400 font-semibold">✓ ID: {selectedCert.credentialId || 'Verified Public Record'}</span>
                <span>{selectedCert.date || 'Issued'}</span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-slate-400">Credential Learning &amp; Skill Summary</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light whitespace-pre-wrap bg-dark-900/60 p-4 rounded-2xl border border-white/10 max-h-56 overflow-y-auto">
                  {selectedCert.summary || selectedCert.description || 'Comprehensive verified industry accreditation.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                {(selectedCert.image || selectedCert.doc) && (
                  <button
                    onClick={() => {
                      const u = selectedCert.doc || selectedCert.image;
                      openDocumentInNewTab(u, selectedCert.title);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-slate-950 flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
                  >
                    <span>🔍 Open Certificate in New Tab ↗</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl glass-card border border-white/15 text-slate-300 text-xs font-semibold hover:border-cyan-400 transition-all cursor-pointer"
                >
                  ✕ Close Summary
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
