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

  const categories = ['All', 'Languages', 'Web', 'Hardware'];

  const filteredSkills = activeCategory === 'All' 
    ? skills 
    : skills.filter(s => s.category === activeCategory);

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

          <div className="flex items-center space-x-1.5 p-1.5 rounded-2xl glass-panel border border-white/10 self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
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
