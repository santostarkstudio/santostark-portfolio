import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Global Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

// Security and Telemetry
import { initSecurityListeners } from './utils/security';
import { useVisitorTracker } from './hooks/useVisitorTracker';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Education from './pages/Education';
import Work from './pages/Work';
import Projects from './pages/Projects';
import Certificates from './pages/Certificates';
import Interests from './pages/Interests';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

export default function App() {
  const location = useLocation();

  // Initialize Anti-Scraping Security (Disable right-click & image drag)
  useEffect(() => {
    const cleanup = initSecurityListeners();
    return () => cleanup();
  }, []);

  // Initialize Silent Visitor Analytics Tracker
  useVisitorTracker();

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      
      {/* Fixed Navigation Header */}
      <Navbar />

      {/* Route Transitions with Framer Motion AnimatePresence */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/education" element={<Education />} />
            <Route path="/work" element={<Work />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/interests" element={<Interests />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            {/* Fallback wildcard route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Interactive AI Assistant Widget (Bottom-Left Corner) */}
      <AIAssistant />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
