import React from 'react';
import { Cpu, Code, Radio, Wrench, Layers, Terminal } from 'lucide-react';

export default function SkillsSection() {
  const skillCategories = [
    {
      title: 'Hardware & Microcontrollers',
      icon: Cpu,
      iconColor: '#6366f1',
      skills: ['Arduino (Uno, Nano, Mega)', 'ESP32 / ESP8266 Wi-Fi Modules', '5V/12V DC Gear Motors & PWM', 'L298N & MOSFET Drivers', 'Electret Sound Sensors', 'RS485 Modbus NPK Sensors', 'I2C OLED & SPI Displays']
    },
    {
      title: 'Software & Frontend',
      icon: Code,
      iconColor: '#10b981',
      skills: ['C / C++ Embedded Programming', 'React.js & Vite', 'Three.js & React Three Fiber', 'JavaScript (ES6+)', 'HTML5 & CSS3 Glassmorphism', 'Component Architecture', 'Responsive UI Layouts']
    },
    {
      title: 'IoT & Protocols',
      icon: Radio,
      iconColor: '#06b6d4',
      skills: ['MQTT Protocol & Mosquitto Broker', 'WebSockets Real-time Data', 'REST API Design', 'UART / I2C / SPI Communication', 'Serial Debugging & Telemetry', 'Cloud Dashboards & Alerts']
    }
  ];

  return (
    <section id="skills" style={{ padding: '3.5rem 0', background: 'rgba(0, 0, 0, 0.2)' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <div className="badge badge-emerald" style={{ marginBottom: '0.8rem' }}>
            Technical Capabilities
          </div>
          <h2>Engineering & Tech Stack</h2>
          <p>
            Core competencies spanning hardware prototyping, sensor interfacing, embedded firmware, and modern web application development.
          </p>
        </div>

        <div className="grid-3">
          {skillCategories.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <div key={idx} className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComp size={22} color={cat.iconColor} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{cat.title}</h3>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {cat.skills.map((skill, sIdx) => (
                    <span key={sIdx} style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.85rem',
                      color: '#e5e7eb',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cat.iconColor }}></span>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
