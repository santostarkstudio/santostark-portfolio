import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, ShieldCheck, CheckCircle, FileText } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import LightboxModal from '../components/LightboxModal';
import { fetchCollectionData, subscribeToCollection, initialCertificatesData } from '../services/firebase';

export { initialCertificatesData };

export default function Certificates() {
  const [certsList, setCertsList] = useState(initialCertificatesData);

  useEffect(() => {
    const unsub = subscribeToCollection('certificates', (docs) => {
      if (docs) setCertsList(docs);
    }, initialCertificatesData);
    return () => unsub();
  }, []);

  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <PageWrapper
      title="Certificates & Credentials"
      subtitle="Publicly accessible industry accreditations in Data Science, Blockchain, AWS Cloud, and Systems Architecture."
      bgImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certsList.map((cert) => (
            <motion.div
              key={cert.id || cert.title}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedCert(cert)}
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

                {cert.image && (
                  <div className="h-40 w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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
                      setSelectedCert(cert);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center space-x-1.5 hover:bg-cyan-500/30 transition-all shadow-md"
                  >
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>🔍 Open &amp; View Certificate Details ↗</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <LightboxModal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          item={selectedCert}
        />
      </div>
    </PageWrapper>
  );
}
