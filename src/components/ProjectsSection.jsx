import React from 'react';
import ProjectCard from './ProjectCard';
import { Cpu, Bot, CloudRain } from 'lucide-react';

export default function ProjectsSection() {
  const projects = [
    {
      id: 'soil-tester',
      category: 'EMBEDDED ELECTRONICS',
      badgeClass: 'badge-emerald',
      iconColor: '#10b981',
      accentGradient: 'linear-gradient(90deg, #10b981, #06b6d4)',
      status: 'Tested Hardware Prototype',
      title: 'Arduino 4-in-1 Soil Tester',
      shortDesc: 'Precision multi-parameter soil analysis probe measuring Nitrogen (N), Phosphorus (P), Potassium (K), pH, and Moisture for real-time agricultural telemetry.',
      highlights: [
        'RS485 Modbus NPK sensor probe integration with Modbus RTU protocol',
        'High-contrast 0.96" I2C OLED display for live field diagnostics',
        'Embedded C++ algorithm calibrating soil electrical conductivity & pH compensation'
      ],
      tags: ['Arduino', 'C/C++', 'RS485 Modbus', 'I2C OLED', 'NPK Probe', 'Circuit Design'],
      fullDesc: 'An embedded agricultural monitoring device built on an Arduino microcontroller. It communicates with an industrial RS485 soil probe over Modbus RTU using a MAX485 transceiver. The firmware samples soil Nitrogen, Phosphorus, Potassium, pH level, and volumetric water content, calculating instant nutrient metrics and displaying them on an onboard OLED display.',
      specs: [
        { label: 'Probe Interface', value: 'RS485 Modbus RTU (MAX485 Converter)' },
        { label: 'Sensors Integrated', value: 'NPK Soil Probe + pH + Moisture' },
        { label: 'Display Output', value: '0.96" 128x64 I2C OLED (SSD1306)' },
        { label: 'Power Management', value: '3.7V Li-ion + 5V Step-Up Converter' }
      ],
      detailedSteps: [
        { title: 'RS485 Communication', description: 'Formulates Modbus query hex frames (0x01 0x03 0x00 0x1E) over SoftwareSerial to request NPK data registers.' },
        { title: 'Signal Processing', description: 'Filters analog electrical noise & applies temperature/pH drift calibration equations in C++.' },
        { title: 'Visual Telemetry', description: 'Renders real-time bar graphs & numeric values on the low-power OLED display.' }
      ]
    },
    {
      id: 'baby-cradle',
      category: 'AUTOMATION & ROBOTICS',
      badgeClass: 'badge-amber',
      iconColor: '#f59e0b',
      accentGradient: 'linear-gradient(90deg, #f59e0b, #ef4444)',
      status: 'Functional Prototype',
      title: 'Sound-Activated Baby Cradle',
      shortDesc: 'Smart electro-mechanical cradle system using an acoustic sound sensor to detect infant crying and automatically engage a gentle 5V motor rocking motion.',
      highlights: [
        'High-sensitivity electret microphone module with acoustic frequency threshold detection',
        'Smooth PWM speed ramping (Soft Start / Soft Stop) driving a high-torque 5V DC gear motor',
        'Auto-shutoff timer (3-minute rocking cycle) and piezo alarm for extended crying'
      ],
      tags: ['Microcontroller', '5V DC Gear Motor', 'PWM Speed Control', 'Sound Sensor', 'L298N Driver', 'C++'],
      fullDesc: 'An automated newborn care system designed to comfort infants when acoustic crying frequencies are registered. The system uses an electret sound sensor module with adjustable potentiometric gain connected to an Arduino. Upon sound detection, an H-Bridge motor driver energizes a low-RPM 5V DC gear motor using PWM speed control to gently swing the cradle arm, ensuring safe and smooth movement.',
      specs: [
        { label: 'Sound Sensor', value: 'Electret Microphone + LM393 Comparator' },
        { label: 'Actuator Motor', value: '5V High-Torque Metal Gearbox DC Motor' },
        { label: 'Motor Driver', value: 'L298N H-Bridge / Transistor PWM' },
        { label: 'Safety Cutoff', value: 'Automatic 180s timeout & Piezo Alert' }
      ],
      detailedSteps: [
        { title: 'Acoustic Frequency Filtering', description: 'Analyzes ambient decibel levels over a 500ms sliding window to eliminate background noise false triggers.' },
        { title: 'PWM Soft Start', description: 'Gradually ramps motor PWM duty cycle from 0% to 65% for gentle, non-jarring cradle acceleration.' },
        { title: 'Mechanical Linkage', description: 'Uses a mechanical crank-and-slider assembly to convert 30 RPM motor rotation into smooth pendulum cradle swinging.' }
      ]
    },
    {
      id: 'air-quality',
      category: 'FULL-STACK IoT TELEMETRY',
      badgeClass: 'badge-cyan',
      iconColor: '#06b6d4',
      accentGradient: 'linear-gradient(90deg, #06b6d4, #6366f1)',
      status: 'Live Web App Dashboard',
      title: 'Cloud Air Quality Monitor Web App',
      shortDesc: 'IoT environmental monitoring web application pulling real-time particulate matter (PM2.5/PM10), CO2, temperature, and humidity data to a cloud dashboard.',
      highlights: [
        'ESP32 microcontroller node streaming sensor data over MQTT/HTTP to cloud endpoints',
        'Interactive React web interface featuring live telemetry graphs & AQI index calculation',
        'Automated alert trigger sending instant push notifications when air pollution thresholds are breached'
      ],
      tags: ['React', 'Vite', 'ESP32 Wi-Fi', 'MQTT Protocol', 'PMS5003 Sensor', 'WebSockets', 'Chart.js'],
      fullDesc: 'An end-to-end IoT environmental monitoring system consisting of an ESP32 edge node connected to a laser PM2.5 sensor (PMS5003) and DHT22 environment sensor. The ESP32 publishes JSON payloads to a cloud MQTT broker. A React web application subscribes to live MQTT topics via WebSockets, rendering real-time Air Quality Index (AQI) gauges and historical trend charts.',
      specs: [
        { label: 'IoT Microcontroller', value: 'ESP32 Wi-Fi + Bluetooth Dual-Core' },
        { label: 'Sensors Integrated', value: 'PMS5003 Dust PM2.5 + DHT22 Temp/Humidity' },
        { label: 'Telemetry Protocol', value: 'MQTT over WebSockets & REST API' },
        { label: 'Frontend Stack', value: 'React + Vite + Recharts Live UI' }
      ],
      detailedSteps: [
        { title: 'Edge Sensor Ingestion', description: 'Reads UART serial data packets from PMS5003 laser dust sensor and calculates US-EPA AQI values.' },
        { title: 'Cloud Broker Stream', description: 'Transmits encrypted JSON payloads over Wi-Fi every 5 seconds to HiveMQ/Mosquitto cloud MQTT broker.' },
        { title: 'Interactive Dashboard', description: 'Renders live gauge meters, dynamic color status (Good, Moderate, Unhealthy), and historical CSV export.' }
      ]
    }
  ];

  return (
    <section id="projects" style={{ padding: '4rem 0' }}>
      <div className="container">
        
        {/* Section Title */}
        <div className="section-header">
          <div className="badge badge-cyan" style={{ marginBottom: '0.8rem' }}>
            Engineering Work & Prototypes
          </div>
          <h2>Featured Engineering Projects</h2>
          <p>
            Demonstrating hands-on circuit design, microcontroller programming, hardware motor actuation, and full-stack cloud IoT telemetry.
          </p>
        </div>

        {/* 3 Projects Grid */}
        <div className="grid-3">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>

      </div>
    </section>
  );
}
