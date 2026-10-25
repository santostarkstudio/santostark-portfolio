import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Sparkles, Filter } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import SkillCard from '../components/SkillCard';
import { subscribeToCollection, initialSkills } from '../services/firebase';

export default function Skills() {
  const [skills, setSkills] = useState(initialSkills);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const unsub = subscribeToCollection('skills', (data) => {
      if (data) setSkills(data);
    }, initialSkills);
    return () => unsub();
  }, []);

  const [sortBy, setSortBy] = useState('rating-desc');

  const categories = ['All', 'Languages', 'Web', 'Hardware'];

  let filteredSkills = activeCategory === 'All' 
    ? skills 
    : skills.filter(s => s.category === activeCategory);

  filteredSkills = [...filteredSkills].sort((a, b) => {
    const ra = Number(a.rating || 0);
    const rb = Number(b.rating || 0);
    if (sortBy === 'rating-desc') return rb - ra || (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'rating-asc') return ra - rb || (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '');
    return 0;
  });

  return (
    <PageWrapper
      title="Technical Skills Matrix"
      subtitle="Interactive 10-star rating visualizer for core engineering domains, programming languages, and hardware stacks."
      bgImage="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Skill Matrix Catalog</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Filtered proficiency ratings &amp; tech stack breakdown
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl glass-panel border border-white/10 overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full touch-pan-x -mx-1 px-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    activeCategory === cat
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <span className="text-[11px] font-mono text-slate-400 shrink-0">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-cyan-300 text-xs font-mono font-medium border border-cyan-500/30 shadow-md focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="rating-desc">⭐ Rating: High → Low</option>
                <option value="rating-asc">📉 Rating: Low → High</option>
                <option value="name-asc">🔤 Name: A → Z</option>
                <option value="name-desc">🔤 Name: Z → A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id || skill.name}
              name={skill.name}
              category={skill.category}
              description={skill.description}
              rating={skill.rating}
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
