import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle2, AlertCircle, Mail, Phone, User, MessageSquare, ShieldCheck } from 'lucide-react';
import { addCollectionData } from '../services/firebase';

export default function RequestAccessModal({ isOpen, onClose, projectTitle, certTitle, itemType = 'Project File & Source Code' }) {
  const targetTitle = projectTitle || certTitle || 'Protected File / Credential';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    channel: 'WhatsApp',
    reason: ''
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
    setLoading(true);
    setError('');

    try {
      await addCollectionData('access_requests', {
        itemTitle: targetTitle,
        itemType: itemType,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        channel: formData.channel,
        reason: formData.reason || 'Request to view protected report/document',
        timestamp: new Date().toISOString()
      });

      await fetch(`https://formsubmit.co/ajax/santoshdabadiaiyyanna@gmail.com`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `🔐 ACCESS PERMISSION REQUEST for "${targetTitle}" from ${formData.name}`,
          Name: formData.name,
          Email: formData.email,
          Phone: formData.phone || 'Not Provided',
          Approval_Method: formData.channel,
          Requested_Item: `${itemType}: ${targetTitle}`,
          Reason: formData.reason,
          _captcha: "false"
        })
      });

      const whatsappMsg = `Hi Santo! My name is ${formData.name}.\nEmail: ${formData.email}\nPhone: ${formData.phone || 'N/A'}\n\n🔐 PERMISSION REQUEST: I would like access to view the ${itemType} for "${targetTitle}".\n\nReason: ${formData.reason || 'Recruiter/Client Evaluation'}\n\nPlease approve my request via ${formData.channel}!`;
      const whatsappUrl = `https://wa.me/918431069633?text=${encodeURIComponent(whatsappMsg)}`;
      window.open(whatsappUrl, '_blank');

      setSubmitted(true);
    } catch (err) {
      console.error("Access request submission error:", err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setFormData({ name: '', email: '', phone: '', channel: 'WhatsApp', reason: '' });
    setSubmitted(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl z-10 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100">Permission Request Sent!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-cyan-400">{formData.name}</span>! Your request to access <span className="text-slate-100 font-semibold">{targetTitle}</span> has been dispatched to Santosh via <strong className="text-emerald-400">Gmail, WhatsApp &amp; Admin CMS</strong>.
              </p>
              <button
                onClick={handleResetAndClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Close Dialog
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Request File Access Approval</h3>
                  <p className="text-xs font-mono text-cyan-400 truncate max-w-xs">{targetTitle}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-light">
                To view or inspect this protected file, please fill in your contact details below. Santosh will review and approve your access request via Email, WhatsApp, or Phone!
              </p>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
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

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Approval Method
                  </label>
                  <select
                    name="channel"
                    value={formData.channel}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs bg-slate-900 text-slate-100"
                  >
                    <option value="WhatsApp">💬 Approve via WhatsApp</option>
                    <option value="Email">✉️ Approve via Email</option>
                    <option value="SMS / Call">📞 Approve via SMS / Phone Call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Purpose / Reason for Request
                  </label>
                  <textarea
                    name="reason"
                    required
                    rows="3"
                    placeholder="e.g. Evaluating candidates for Senior Systems Engineer position / Project collaboration"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-violet-600 font-bold text-xs text-slate-950 shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Sending Permission Request...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Send Request to Santosh via WhatsApp &amp; Email 🚀</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
