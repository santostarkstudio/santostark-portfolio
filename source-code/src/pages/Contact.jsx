import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Github, Linkedin, Shield, CheckCircle2, Clock, Globe } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { addCollectionData, subscribeToDoc, initialHeroInfo } from '../services/firebase';

export default function Contact() {
  const [heroInfo, setHeroInfo] = useState(initialHeroInfo);

  useEffect(() => {
    const unsub = subscribeToDoc('hero_info', 'main_hero', (data) => {
      if (data) setHeroInfo({ ...initialHeroInfo, ...data });
    }, initialHeroInfo);
    return () => unsub();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: ''
  });

  const [category, setCategory] = useState('💼 Job / Internship');
  const [refId, setRefId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    '💼 Job / Internship',
    '🤝 Project / Contract',
    '🛡️ Security / GRC',
    '💬 General'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', subject: '', message: '', website: '' });
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.website && formData.website.trim() !== '') {
      console.warn("Spam submission blocked by honeypot filter.");
      setSubmitted(true);
      return;
    }

    setLoading(true);
    setError('');
    const generatedRef = 'STARK-' + Math.floor(1000 + Math.random() * 9000);
    setRefId(generatedRef);

    try {
      await addCollectionData('messages', {
        name: formData.name,
        email: formData.email,
        category: category,
        subject: `[${category}] ${formData.subject || 'Portfolio Contact'}`,
        message: formData.message,
        refId: generatedRef,
        timestamp: new Date().toISOString()
      });

      const recipientEmail = heroInfo.email || 'santoshdabadiaiyyanna@gmail.com';
      await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Transmission [${category}] from ${formData.name}`,
          Category: category,
          Name: formData.name,
          Email: formData.email,
          Subject: formData.subject || 'Hiring / Portfolio Contact',
          Message: formData.message,
          Ref_ID: generatedRef,
          _captcha: "false"
        })
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Message send error:", err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper
      title="Contact & Communications"
      subtitle="Direct message terminal, dispatch hub, and security-verified transmission channel."
      bgImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Stark Studio Dispatch Hub */}
          <motion.div
            variants={{
              initial: { opacity: 0, x: -30 },
              animate: { opacity: 1, x: 0 }
            }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative overflow-hidden min-h-[460px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4">
                {/* Live Status Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Dispatch Active • Zero-Spam Protected</span>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-slate-100">Stark Dispatch Hub</h3>
                  <p className="text-xs text-slate-300 mt-1 font-light leading-relaxed">
                    Direct communication channel for opportunities, technical collaborations, and inquiries. All transmissions route securely to Santo's queue.
                  </p>
                </div>

                <div className="space-y-4 pt-2 border-t border-white/10">
                  {/* Role Focus */}
                  <div className="flex items-start space-x-3 text-xs text-slate-300">
                    <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-cyan-400 block uppercase tracking-wider">Availability & Focus</span>
                      <span className="font-semibold text-slate-100 text-xs sm:text-sm">
                        {heroInfo.badge || "Seeking Cybersecurity Internships & Cloud Roles"}
                      </span>
                    </div>
                  </div>

                  {/* Location & Timezone */}
                  <div className="flex items-start space-x-3 text-xs text-slate-300">
                    <div className="p-2.5 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-violet-400 block uppercase tracking-wider">Location & Working Hours</span>
                      <span className="font-semibold text-slate-100 text-xs sm:text-sm">
                        Bengaluru, India • IST (UTC+5:30)
                      </span>
                    </div>
                  </div>

                  {/* Response Turnaround */}
                  <div className="flex items-start space-x-3 text-xs text-slate-300">
                    <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-amber-400 block uppercase tracking-wider">Response Turnaround</span>
                      <span className="font-semibold text-slate-100 text-xs sm:text-sm">
                        Typical response within 24 hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Icons Row below card */}
            <div className="flex flex-wrap items-center justify-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-lg">
              <a href={heroInfo.github || "https://github.com/santostarkstudio"} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href={heroInfo.linkedin || "https://linkedin.com/in/santoshdabadiaiyyanna"} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-violet-500/20 text-slate-400 hover:text-violet-300 border border-white/5 hover:border-violet-500/30 transition-all cursor-pointer" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Enhanced Contact Form */}
          <motion.div
            variants={{
              initial: { opacity: 0, x: 30 },
              animate: { opacity: 1, x: 0 }
            }}
            className="lg:col-span-7"
          >
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden min-h-[460px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-slate-100">Direct Message Terminal</h3>
              </div>

              {submitted ? (
                <div className="text-center py-10 space-y-4 my-auto">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl sm:text-2xl font-bold text-slate-100">Transmission Dispatched</h4>
                    <p className="text-xs font-mono text-emerald-400">Reference: {refId || 'STARK-DISPATCH'}</p>
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed pt-1">
                      Thank you, <strong className="text-cyan-300">{formData.name}</strong>! Your inquiry has been securely routed to Santo's queue. Expect a response within 24 hours.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-cyan-300 font-semibold transition-all cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  {/* Category Selection Chips */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                      Select Inquiry Category
                    </label>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {categories.map((cat) => (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all cursor-pointer border ${
                            category === cat
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.35)]'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Honeypot hidden input */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Name Input */}
                  <div>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name*"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email Address*"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  {/* Subject Input */}
                  <div>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Organization / Subject (Optional)"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  {/* Message Textarea */}
                  <div className="relative">
                    <textarea
                      name="message"
                      required
                      rows={3}
                      maxLength={1000}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message or inquiry..."
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    />
                    <span className="absolute right-3 bottom-2 text-[10px] font-mono text-slate-500 pointer-events-none">
                      {formData.message.length}/1000
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Transmitting Message...' : 'Dispatch Message ✦'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
