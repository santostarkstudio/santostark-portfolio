# 3D Engineering Portfolio (React + Vite + Three.js)

A modern, glassmorphic portfolio web application built with **React**, **Vite**, **Three.js**, **@react-three/fiber**, and **@react-three/drei**.

## Features Included

1. **Interactive 3D Hero Canvas**:
   - Continuous auto-rotating metallic & wireframe 3D Cube using `@react-three/fiber` and `@react-three/drei`.
   - Mouse OrbitControls (drag to rotate, scroll to zoom).
   - Dynamic 3D controls overlay: Toggle rotation, change color themes (Indigo, Emerald, Cyan, Amber), toggle wireframe, adjust rotation speed slider.

2. **Featured Engineering Projects**:
   - **Arduino-based 4-in-1 Soil Tester**: RS485 Modbus RTU NPK probe, I2C OLED display, and C++ calibration algorithm.
   - **Sound-Activated Automatic Baby Cradle**: Electret acoustic sensor, noise threshold filtering, 5V DC motor PWM speed control, and safety timeout logic.
   - **Cloud-Based Air Quality Monitor Web App**: ESP32 IoT node, laser PM2.5 sensor, MQTT over WebSockets streaming to a real-time web telemetry dashboard.

3. **Interactive Tech Specs Modal**:
   - Click "Explore Technical Specs" on any project card to view hardware architecture, sensor specs, and multi-step execution workflows.

4. **Responsive Glassmorphism UI**:
   - Curated dark obsidian palette, backdrop blur panels, glowing badges, and mobile/desktop responsive design.

---

## How to Run

Open your terminal in this folder (`c:\Users\santo\OneDrive\Desktop\my-portfolio-new`) and run:

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev

# 3. Build static web application bundle
npm run build
```

Or simply double-click the included `run.bat` file!

Once launched, open your browser to **http://localhost:3000**.
