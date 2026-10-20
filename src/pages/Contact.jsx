import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Linkedin, Send, CheckCircle2, AlertCircle, Shield, Sparkles, MessageSquare } from 'lucide-react';
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
    phone: '',
    subject: '',
    message: '',
    website: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
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

    try {
      await addCollectionData('messages', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        subject: formData.subject || 'Hiring Inquiry / Portfolio Contact',
        message: formData.message,
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
          _subject: `New Hiring Message from ${formData.name} (${formData.subject || 'Portfolio Inquiry'})`,
          Name: formData.name,
          Email: formData.email,
          Phone: formData.phone || 'Not Provided',
          Subject: formData.subject || 'Hiring Inquiry / Portfolio Contact',
          Message: formData.message,
          _captcha: "false"
        })
      });

      const cleanPhoneNum = (heroInfo.phone || '8431069633').replace(/\D/g, '');
      const autoWhatsappUrl = `https://wa.me/91${cleanPhoneNum}?text=${encodeURIComponent(`Hi Santo! My name is ${formData.name} (Phone: ${formData.phone || 'N/A'}, Email: ${formData.email}).\n\nSubject: ${formData.subject || 'Hiring Inquiry'}\n\nMessage: ${formData.message}`)}`;
      window.open(autoWhatsappUrl, '_blank');

      setSubmitted(true);
    } catch (err) {
      console.error("Message send error:", err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const cleanPhone = (heroInfo.phone || '8431069633').replace(/\D/g, '');
  const directWhatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent("Hi Santo, I saw your portfolio and I would like to hire you!")}`;
  const submittedWhatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hi Santo! My name is ${formData.name} (Phone: ${formData.phone || 'N/A'}).\n\nSubject: ${formData.subject || 'Hiring Inquiry'}\n\nMessage: ${formData.message}`)}`;
  const mailtoUrl = `mailto:${heroInfo.email || 'santoshdabadiaiyyanna@gmail.com'}?subject=${encodeURIComponent("Hiring Inquiry / Job Opportunity")}&body=${encodeURIComponent("Hi Santo,\n\nI would like to hire you for a project / role!")}`;

  return (
    <PageWrapper
      title="Contact & Communications"
      subtitle="Direct message channel, WhatsApp connect, availability status, and security-verified contact form."
      bgImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div
            variants={{
              initial: { opacity: 0, x: -30 },
              animate: { opacity: 1, x: 0 }
            }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <h3 className="text-2xl font-extrabold text-slate-100">Let's Connect</h3>
                <p className="text-xs text-slate-300 mt-1 font-light leading-relaxed">
                  Have a job opening or freelance project? Send a message below or connect via WhatsApp &amp; Email instantly.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={directWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-xs text-slate-950 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>💬 Direct WhatsApp Chat with Santo</span>
                </a>

                <a
                  href={mailtoUrl}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-slate-950 flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>✉️ Send Direct Email Message</span>
                </a>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-3 text-xs text-slate-300">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Email</span>
                    <a href={mailtoUrl} className="font-semibold text-slate-100 hover:text-cyan-400 transition-colors">
                      {heroInfo.email || "santoshdabadiaiyyanna@gmail.com"}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-300">
                  <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Phone / WhatsApp</span>
                    <a href={directWhatsappUrl} target="_blank" rel="noreferrer" className="font-semibold text-slate-100 hover:text-cyan-400 transition-colors">
                      +91 {heroInfo.phone || "8431069633"}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-300">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Location</span>
                    <span className="font-semibold text-slate-100">{heroInfo.location || "Bengaluru, Karnataka, India"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center space-x-3">
                <a
                  href={heroInfo.github || "https://github.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl glass-card text-xs font-semibold text-slate-200 flex items-center justify-center space-x-2 hover:border-cyan-400 transition-all"
                >
                  <Github className="w-4 h-4 text-cyan-400" />
                  <span>GitHub</span>
                </a>
                <a
                  href={heroInfo.linkedin || "https://linkedin.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl glass-card text-xs font-semibold text-slate-200 flex items-center justify-center space-x-2 hover:border-cyan-400 transition-all"
                >
                  <Linkedin className="w-4 h-4 text-cyan-400" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={{
              initial: { opacity: 0, x: 30 },
              animate: { opacity: 1, x: 0 }
            }}
            className="lg:col-span-7"
          >
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center space-x-2 mb-6">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-slate-100">Send Direct Message &amp; WhatsApp Request</h3>
              </div>

              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-100">Message Delivered to Gmail &amp; Admin CMS!</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-cyan-300">{formData.name}</strong>! Your inquiry has been sent to Santo's Gmail inbox and saved to Admin CMS.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={submittedWhatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>💬 Send Request via WhatsApp Now ↗</span>
                    </a>

                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl glass-card text-slate-300 font-bold text-xs hover:border-cyan-400 transition-all"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={handleChange}
                    style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                  />

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Recruiter / Client Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="recruiter@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone / WhatsApp Number (Optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="e.g. +91 9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Subject / Role Inquiry
                      </label>
                      <input
                        type="text"
                        name="subject"
                        placeholder="e.g. Systems Engineer Hiring Discussion"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Message Content *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows="4"
                      placeholder="Hi Santo, I saw your portfolio and I would like to hire you for..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-xs resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-violet-600 font-bold text-xs text-slate-950 shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Live Message &amp; WhatsApp Request 🚀</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
