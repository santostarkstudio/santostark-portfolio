import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Youtube, 
  Code2, 
  FileText, 
  Mail, 
  ShieldCheck 
} from 'lucide-react';
import { subscribeToDoc, initialHeroInfo } from '../services/firebase';

export default function Footer() {
  const [heroInfo, setHeroInfo] = useState(initialHeroInfo);

  useEffect(() => {
    const unsub = subscribeToDoc('hero_info', 'main_hero', (data) => {
      if (data) setHeroInfo({ ...initialHeroInfo, ...data });
    }, initialHeroInfo);
    return () => unsub();
  }, []);

  const socialLinks = [
    { name: 'GitHub', href: heroInfo.github || 'https://github.com', icon: Github, color: 'hover:text-cyan-400' },
    { name: 'LinkedIn', href: heroInfo.linkedin || 'https://linkedin.com', icon: Linkedin, color: 'hover:text-cyan-400' },
    { name: 'Twitter / X', href: heroInfo.twitter || 'https://x.com', icon: Twitter, color: 'hover:text-cyan-400' },
    { name: 'Instagram', href: heroInfo.instagram || 'https://instagram.com', icon: Instagram, color: 'hover:text-pink-400' },
    { name: 'YouTube', href: heroInfo.youtube || 'https://youtube.com', icon: Youtube, color: 'hover:text-rose-400' },
    { name: 'LeetCode / Coding', href: heroInfo.leetcode || 'https://leetcode.com', icon: Code2, color: 'hover:text-amber-400' },
    { name: 'Resume / CV', href: heroInfo.resume || '#', icon: FileText, color: 'hover:text-emerald-400' },
  ];

  return (
    <footer className="w-full bg-dark-900/90 border-t border-white/10 py-6 px-4 mt-auto relative z-10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Expanded Social & Media Links */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {socialLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={`p-2 rounded-xl glass-card text-slate-300 ${item.color} hover:border-cyan-500/40 transition-all hover:scale-110`}
                title={item.name}
                aria-label={item.name}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}

          <Link 
            to="/contact" 
            className="p-2 rounded-xl glass-card text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all hover:scale-110"
            title="Contact Direct Email"
            aria-label="Contact"
          >
            <Mail className="w-4 h-4" />
          </Link>
        </div>

        {/* Copyright & Admin Portal Toggle */}
        <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3 text-xs text-slate-400 font-mono">
          <p>&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
          <span className="hidden sm:inline text-slate-600">&bull;</span>
          <div className="flex items-center space-x-2">
            <span>Built with React &amp; Three.js</span>
            <Link 
              to="/admin" 
              className="text-slate-500 hover:text-violet-400 transition-colors flex items-center space-x-1"
              title="Admin CMS Login"
            >
              <ShieldCheck className="w-3.5 h-3.5 inline" />
              <span className="text-[10px]">Admin</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
