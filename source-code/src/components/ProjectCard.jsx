import React, { useState } from 'react';
import { Cpu, ChevronRight, CheckCircle2, X, ExternalLink, Zap, Layers, Server, Activity } from 'lucide-react';

export default function ProjectCard({ project }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Card Container */}
      <div className="glass-panel" style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Top Accent Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: project.accentGradient || 'linear-gradient(90deg, #6366f1, #8b5cf6)'
        }} />

        <div>
          {/* Badge & Category */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <span className={`badge ${project.badgeClass || ''}`}>
              {project.category}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              {project.status}
            </span>
          </div>

          {/* Project Title */}
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.6rem', color: '#ffffff', lineHeight: 1.25 }}>
            {project.title}
          </h3>

          {/* Tagline */}
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            {project.shortDesc}
          </p>

          {/* Key Bullet Features */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.6rem' }}>
              Key Innovations
            </span>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {project.highlights.slice(0, 3).map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#e5e7eb' }}>
                  <CheckCircle2 size={16} color={project.iconColor || "#6366f1"} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          {/* Tech Stack Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
            {project.tags.map((tag, idx) => (
              <span key={idx} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '6px',
                padding: '0.2rem 0.55rem',
                fontSize: '0.75rem',
                color: '#9ca3af',
                fontWeight: 500
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={() => setShowModal(true)}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem' }}
          >
            <span>Explore Technical Specs</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Detailed Spec Modal Dialog */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <span className={`badge ${project.badgeClass || ''}`} style={{ marginBottom: '0.5rem' }}>
                  {project.category}
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{project.title}</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#ffffff',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Comprehensive Description */}
            <p style={{ color: '#d1d5db', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {project.fullDesc}
            </p>

            {/* System Architecture Grid */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={18} color={project.iconColor || "#6366f1"} />
                Hardware & System Architecture Specs
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {project.specs.map((spec, idx) => (
                  <div key={idx} style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '0.8rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', fontWeight: 600 }}>{spec.label}</span>
                    <span style={{ fontSize: '0.92rem', color: '#f3f4f6', fontWeight: 600 }}>{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware & Software Details */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color={project.iconColor || "#6366f1"} />
                Key System Components & Implementation
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {project.detailedSteps.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: '#d1d5db' }}>
                    <div style={{
                      minWidth: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#a5b4fc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {idx + 1}
                    </div>
                    <div>
                      <strong style={{ color: '#ffffff' }}>{step.title}:</strong> {step.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', pt: '1rem', borderTop: '1px solid var(--glass-border)' }}>
              <button
                onClick={() => setShowModal(false)}
                className="btn-primary"
              >
                Close Spec Sheet
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
