import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, Loader2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { askGemini } from '../services/gemini';

// ── Holographic AI Icon ───────────────────────────────────────────────────────
function HolographicIcon({ className = 'w-10 h-10' }) {
  return (
    <div className={`relative ${className} rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-cyan-400/80 shadow-[0_0_22px_rgba(0,240,255,0.7)] group bg-slate-950`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent animate-[scan_2.5s_ease-in-out_infinite] pointer-events-none z-20" />
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/30 to-violet-600/30">
        <Bot className="w-6 h-6 text-cyan-400 group-hover:scale-125 transition-transform duration-300 z-10" />
      </div>
      <div className="absolute inset-0 rounded-full border border-cyan-400/50 shadow-[inset_0_0_12px_rgba(0,240,255,0.5)] pointer-events-none z-10" />
    </div>
  );
}

// ── Suggested quick questions ─────────────────────────────────────────────────
const QUICK_QUESTIONS = [
  "Is Santo available for hire?",
  "What are his top skills?",
  "Tell me about his projects",
  "What's his tech stack?",
  "How can I contact him?",
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function AIAssistant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "👋 Hi! I'm Santo's AI assistant powered by Gemini. Ask me anything about his skills, projects, or how to hire him!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    setHasApiKey(!!key && key.length > 10 && key !== 'paste_your_new_key_here');
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [messages, isOpen]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || isLoading) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text: userText, time }]);
    setInput('');
    setIsLoading(true);

    const history = messages.slice(1); // skip greeting
    const reply = await askGemini(userText, history);

    setMessages(prev => [
      ...prev,
      { role: 'model', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* ── Floating Trigger Button ─────────────────────────────────────────── */}
      <motion.button
        id="ai-assistant-toggle"
        onClick={() => setIsOpen(p => !p)}
        className="fixed bottom-6 left-6 z-50 group"
        whileTap={{ scale: 0.92 }}
        title="Chat with Santosh's AI"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-rose-500/30"
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
              className="relative"
            >
              <HolographicIcon className="w-14 h-14" />
              {/* Gemini live dot */}
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-950 flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-slate-950" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Panel ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-assistant-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed bottom-24 left-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[520px] flex flex-col rounded-3xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
            style={{
              background: 'linear-gradient(135deg, rgba(10,15,30,0.97) 0%, rgba(15,20,40,0.97) 100%)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center space-x-3 px-4 py-3.5 border-b border-cyan-500/15 bg-gradient-to-r from-cyan-500/8 to-violet-500/8 flex-shrink-0">
              <HolographicIcon className="w-9 h-9" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-100 leading-none font-mono">SANTO.AI</p>
                <p className="text-[10px] mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                  <span className="text-emerald-400 font-mono">
                    {hasApiKey ? 'Gemini 1.5 Flash · Live' : 'Setup required'}
                  </span>
                </p>
              </div>
              <button
                onClick={() => navigate('/contact')}
                className="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 rounded-full px-2.5 py-1 hover:bg-cyan-500/10 transition-colors"
              >
                Hire Me →
              </button>
            </div>

            {/* API Key warning */}
            {!hasApiKey && (
              <div className="mx-3 mt-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono flex-shrink-0">
                ⚙️ Add <code className="bg-black/30 px-1 rounded">VITE_GEMINI_API_KEY</code> to your <code className="bg-black/30 px-1 rounded">.env</code> to activate AI
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'user'
                      ? 'bg-cyan-500/20 border border-cyan-500/40'
                      : 'bg-violet-500/20 border border-cyan-400/40'
                  }`}>
                    {msg.role === 'user'
                      ? <User className="w-3 h-3 text-cyan-400" />
                      : <Bot className="w-3 h-3 text-cyan-400" />
                    }
                  </div>
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-500 to-emerald-500 text-slate-950 font-medium rounded-br-sm'
                      : 'bg-white/5 border border-cyan-500/10 text-slate-200 rounded-bl-sm'
                  }`}>
                    <p className="whitespace-pre-wrap text-[13px]">{msg.text}</p>
                    <p className={`text-[9px] mt-1 ${msg.role === 'user' ? 'text-slate-700' : 'text-slate-500'}`}>{msg.time}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-cyan-400/40 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-cyan-400" />
                  </div>
                  <div className="bg-white/5 border border-cyan-500/10 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex space-x-1">
                      {[0,1,2].map(i => (
                        <motion.div key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions (only at the very start) */}
            {messages.length === 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-cyan-500/25 text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/15 transition-colors font-mono">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <div className="flex items-center gap-2 px-3 pb-3 pt-2 border-t border-cyan-500/15 flex-shrink-0 bg-black/20">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={hasApiKey ? "Ask anything about Santosh..." : "Configure API key to chat..."}
                disabled={isLoading || !hasApiKey}
                className="flex-1 bg-white/5 border border-cyan-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-40"
              />
              <motion.button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading || !hasApiKey}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
