const fs = require('fs');
const path = require('path');

const dedicatedStudioCode = `
function DedicatedStudioPage() {
  const [tab, setTab] = q.useState("technical");
  const [filter, setFilter] = q.useState("All");
  const [ping, setPing] = q.useState(true);
  const [selected, setSelected] = q.useState(null);

  q.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const t = setInterval(() => setPing(p => !p), 1200);
    const onKey = (e) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => { clearInterval(t); window.removeEventListener("keydown", onKey); };
  }, []);

  const wings = [
    { id: "technical", label: "⚡ Technical Wing", color: "cyan", desc: "Computer Science, Full-Stack Web, Embedded Systems, IoT & Automation" },
    { id: "entertainment", label: "🎬 Entertainment Wing", color: "violet", desc: "Gaming Content, VFX Compositing, Film Production, Video Editing & Live Streaming" },
    { id: "arts", label: "🎨 Arts & Design Wing", color: "amber", desc: "UI/UX Design Systems, AI Digital Art, Creative Branding & 3D Visuals" },
    { id: "other", label: "🔧 Lab & Other Wing", color: "emerald", desc: "Technical Certifications, Student Workshops, Research Documentation & Open Source" }
  ];

  const projects = {
    technical: [
      { id: "tech-1", title: "Santo Stark Portfolio System", desc: "Interactive 3D Solar System hero, Firebase Realtime CMS, glassmorphic UI, Three.js & React.", details: "Built with React 18, Three.js / React Three Fiber for WebGL canvas rendering, Tailwind CSS for glassmorphic styling, and Google Firebase for live headless CMS database feeds.", tags: ["React", "Three.js", "Firebase", "Tailwind", "Vite"], status: "Live", color: "cyan", featured: true },
      { id: "tech-2", title: "IoT Smart Hardware Dashboard", desc: "ESP32 micro-controller sensor data streamed in real-time via MQTT protocol to a live reactive web interface.", details: "Features ESP32 micro-controller programmed in C++, MQTT broker pub/sub pipeline, low-latency WebSocket connection, and interactive Chart.js gauges for telemetry.", tags: ["ESP32", "MQTT", "Node.js", "C++", "Chart.js"], status: "Completed", color: "cyan" },
      { id: "tech-3", title: "React Cloud Web Application", desc: "Full-stack single page web application with Firebase Firestore backend, user authentication, and responsive views.", details: "Complete end-to-end cloud web app implementing secure Firebase Auth, Firestore real-time listeners, state management, and optimized touch-first responsive layouts.", tags: ["React", "Firebase", "Tailwind", "Auth"], status: "Completed", color: "cyan" },
      { id: "tech-4", title: "Embedded Firmware & Robotics", desc: "STM32/ESP32 firmware architecture with FreeRTOS multitasking, interrupt routines, and custom sensor PCB layout.", details: "Low-level bare-metal and RTOS firmware written in C/C++, featuring task scheduling, sensor polling queues, and hardware schematics drafted in KiCad.", tags: ["STM32", "FreeRTOS", "C++", "PCB", "KiCad"], status: "In Progress", color: "cyan" },
      { id: "tech-5", title: "C++ Socket Server & Networking", desc: "Multi-threaded TCP/UDP server handling concurrent client packets, custom network protocol, and low-latency data feeds.", details: "POSIX sockets server written in modern C++ with thread pooling, packet serialization, mutex synchronization, and high throughput under simulated connection load.", tags: ["C++", "Sockets", "Threading", "Linux", "TCP/IP"], status: "Completed", color: "cyan" },
      { id: "tech-6", title: "Python Automation & ML Tooling", desc: "Data processing pipelines, automated web scraping scripts, and neural experiments for predictive classification.", details: "Python suite leveraging Pandas, Scikit-learn, and BeautifulSoup for automated task scheduling, data sanitization, and machine learning model training.", tags: ["Python", "Pandas", "Scikit-Learn", "Automation"], status: "In Progress", color: "cyan" }
    ],
    entertainment: [
      { id: "ent-1", title: "Gaming Content & Montage Reel", desc: "High-octane gaming recordings, competitive gameplay highlights, sound design synchronization, and fast-paced montages.", details: "Produced high-framerate gameplay captures, synced beat transitions in Premiere Pro, dynamic speed ramping, and personalized audio mixing.", tags: ["Gaming", "Recording", "Editing", "Montage", "Streaming"], status: "In Progress", color: "violet", featured: true },
      { id: "ent-2", title: "VFX & Motion Graphics Experiments", desc: "Visual effects compositing, 3D particle systems, screen tracking, dynamic title design, and motion identity.", details: "After Effects compositions utilizing Boris FX, planar motion tracking, particle simulations, and seamless green-screen compositing.", tags: ["VFX", "After Effects", "Motion", "Compositing"], status: "In Progress", color: "violet" },
      { id: "ent-3", title: "Cinematic Video Editing Showcase", desc: "Narrative pacing, audio soundscapes, color grading in DaVinci Resolve, and cinematic cuts for multimedia clips.", details: "Full post-production workflow: timeline pacing, color wheel grade balances, LUT mastering, and multi-track Foley sound effects layering.", tags: ["Premiere Pro", "DaVinci", "Color Grade", "SFX"], status: "Completed", color: "violet" },
      { id: "ent-4", title: "Short Film & Screenplay Concepts", desc: "Scriptwriting, storyboard layouts, cinematography test shoots, lighting setups, and narrative direction.", details: "Pre-production script development, two-column audio/video storyboards, lens choice experimentation, and cinematic framing principles.", tags: ["Film", "Direction", "Story", "Cinematography"], status: "Concept", color: "violet" },
      { id: "ent-5", title: "3D Animation & Rigging Studies", desc: "Procedural keyframing, character motion studies, lighting aesthetics, and camera animation in Blender.", details: "Blender 3D scene creation, inverse kinematics character rigging, procedural shader nodes, and Cycles render optimization.", tags: ["Blender", "3D", "Rigging", "Keyframes", "Cycles"], status: "Concept", color: "violet" },
      { id: "ent-6", title: "Live Streaming & Broadcast Production", desc: "Custom OBS scene switchers, animated overlays, audio gate mixing, and multi-stream relay configurations.", details: "Broadcast studio setup with OBS Studio, custom HTML/CSS alert overlays, VST audio filters for noise reduction, and dual-monitor workflow.", tags: ["OBS", "Broadcast", "Audio Mix", "Twitch", "Streaming"], status: "Live", color: "violet" }
    ],
    arts: [
      { id: "art-1", title: "UI/UX Design Systems & Prototypes", desc: "Figma design systems, scalable design tokens, micro-interactions, and mobile/desktop high-fidelity wireframes.", details: "Component libraries with auto-layout, interactive variants, responsive grid constraints, and design token hierarchies ready for developer handoff.", tags: ["Figma", "UI/UX", "Design Systems", "Prototyping"], status: "In Progress", color: "amber", featured: true },
      { id: "art-2", title: "AI-Generated Digital Art Collection", desc: "Generative aesthetics, prompt engineering, diffusion models, and high-resolution digital remastering.", details: "Curated gallery exploring prompt synthesis, latent space upscaling, negative prompt balancing, and digital retouching in Adobe Photoshop.", tags: ["AI Art", "Midjourney", "Diffusion", "Digital Art"], status: "In Progress", color: "amber" },
      { id: "art-3", title: "Graphic Design & Visual Identity", desc: "Brand identities, typography exploration, posters, social assets, and vector illustrations.", details: "Vector typography, brand style guides, color palettes, and print/digital asset templates created in Adobe Illustrator.", tags: ["Illustrator", "Photoshop", "Branding", "Vector"], status: "Completed", color: "amber" },
      { id: "art-4", title: "Abstract 3D Visualizations", desc: "Procedural geometry, glass shaders, emissive materials, and real-time lighting studies in WebGL.", details: "Custom Three.js shaders, lighting passes, refractive glass physical materials, and procedural particle vortex simulations.", tags: ["Three.js", "WebGL", "Blender", "Shaders"], status: "Concept", color: "amber" }
    ],
    other: [
      { id: "oth-1", title: "Technical Certifications Portfolio", desc: "15+ verified certifications in Cloud, Cybersecurity, Embedded Computing, and Web Development.", details: "Rigorous coursework and proctored examinations across NPTEL, Coursera, Cisco, and industry institutions verifying technical mastery.", tags: ["Cybersecurity", "Cloud", "NPTEL", "DevOps"], status: "Completed", color: "emerald", featured: true },
      { id: "oth-2", title: "Peer Workshops & Tech Mentorship", desc: "Hands-on student bootcamps on ESP32 microcontroller coding and modern React frontend workflows.", details: "Conducted interactive workshops for fellow engineering students, covering hardware breadboarding, sensor interfacing, and building full-stack web dashboards.", tags: ["Mentorship", "ESP32", "React", "Community"], status: "Completed", color: "emerald" },
      { id: "oth-3", title: "Research & Technical Documentation", desc: "Detailed engineering journals, IEEE format project reports, and system architecture schematics.", details: "Comprehensive project papers typeset in LaTeX, containing circuit schematics, timing diagrams, code documentation, and performance benchmarks.", tags: ["Research", "IEEE", "Documentation", "LaTeX"], status: "In Progress", color: "emerald" },
      { id: "oth-4", title: "Open-Source Code Contributions", desc: "Active GitHub contributions, utility toolkits, and shared developer snippets for the community.", details: "Open-source repositories hosting re-usable Arduino libraries, React hooks, and automation CLI scripts with full README guides.", tags: ["GitHub", "Open Source", "Git", "Community"], status: "In Progress", color: "emerald" }
    ]
  };

  const CM = {
    cyan:    { border: "border-cyan-500/30", bg: "bg-cyan-500/10", text: "text-cyan-400", tag: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30", btn: "bg-cyan-500 text-slate-950", glow: "shadow-cyan-500/25" },
    violet:  { border: "border-violet-500/30", bg: "bg-violet-500/10", text: "text-violet-400", tag: "bg-violet-500/15 text-violet-400 border-violet-500/30", btn: "bg-violet-500 text-white", glow: "shadow-violet-500/25" },
    amber:   { border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-400", tag: "bg-amber-500/15 text-amber-400 border-amber-500/30", btn: "bg-amber-500 text-slate-950", glow: "shadow-amber-500/25" },
    emerald: { border: "border-emerald-500/30", bg: "bg-emerald-500/10", text: "text-emerald-400", tag: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", btn: "bg-emerald-500 text-slate-950", glow: "shadow-emerald-500/25" }
  };

  const statusStyles = {
    "Live": "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    "In Progress": "bg-amber-500/20 text-amber-400 border-amber-500/40",
    "Completed": "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
    "Concept": "bg-violet-500/20 text-violet-400 border-violet-500/40"
  };

  const statusDots = {
    "Live": "bg-emerald-400 animate-pulse",
    "In Progress": "bg-amber-400 animate-pulse",
    "Completed": "bg-cyan-400",
    "Concept": "bg-violet-400"
  };

  const currentWing = wings.find(w => w.id === tab) || wings[0];
  const list = projects[tab] || [];
  const featured = list.find(p => p.featured);
  const filteredList = filter === "All" ? list.filter(p => !p.featured) : list.filter(p => !p.featured && p.status === filter);

  const goHome = (targetSection) => {
    window.location.href = targetSection ? ("/#" + targetSection) : "/";
  };

  return m.jsxs("div", {
    className: "min-h-screen bg-dark-900 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black",
    children: [
      /* Top Dedicated Sticky Nav Bar */
      m.jsx("header", {
        className: "sticky top-0 z-50 px-3 sm:px-6 py-3 bg-dark-900/85 backdrop-blur-xl border-b border-white/10 shadow-2xl",
        children: m.jsxs("div", {
          className: "max-w-[1550px] w-full mx-auto flex items-center justify-between gap-4",
          children: [
            /* Prominent [ ← Back to Portfolio ] button */
            m.jsxs("button", {
              onClick: () => goHome(),
              className: "inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/50 text-cyan-300 hover:text-white hover:border-cyan-400 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/10 hover:scale-105 transition-all cursor-pointer",
              children: [
                m.jsx("span", { className: "text-base font-bold", children: "←" }),
                m.jsx("span", { children: "Back to Portfolio" })
              ]
            }),
            /* Center Studio Title */
            m.jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                m.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" }),
                m.jsx("span", { className: "text-xs sm:text-sm md:text-base font-extrabold bg-gradient-to-r from-cyan-400 via-violet-400 to-amber-400 bg-clip-text text-transparent uppercase tracking-wider", children: "Santo Stark Studio" }),
                m.jsx("span", { className: "hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-slate-300 border border-white/15", children: "HUB" })
              ]
            }),
            /* Right System Online Indicator (No Sound Icon) */
            m.jsxs("div", {
              className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold",
              children: [
                m.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 transition-opacity duration-700 " + (ping ? "opacity-100" : "opacity-30") }),
                m.jsx("span", { className: "hidden sm:inline", children: "System Online" })
              ]
            })
          ]
        })
      }),

      /* Main Page Content */
      m.jsxs("main", {
        className: "max-w-6xl mx-auto px-4 py-10 sm:py-16 space-y-16",
        children: [
          /* Hero Section */
          m.jsxs("section", {
            className: "text-center space-y-4",
            children: [
              m.jsx("span", {
                className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400",
                children: "✦ Dedicated Creative & Engineering Suite"
              }),
              m.jsxs("h1", {
                className: "text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight",
                children: [
                  "Where Computer Science Meets ",
                  m.jsx("span", { className: "bg-gradient-to-r from-cyan-400 via-violet-400 to-amber-400 bg-clip-text text-transparent", children: "Cinematic Arts" })
                ]
              }),
              m.jsx("p", {
                className: "text-slate-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed",
                children: "A dedicated creative hub uniting software algorithms, IoT embedded hardware, cinematic video editing, visual effects, and digital interactive design."
              }),
              /* Quick Metrics Bar */
              m.jsx("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6",
                children: [
                  { label: "Projects Shipped", val: "20+", c: "text-cyan-400", b: "border-cyan-500/30" },
                  { label: "Certifications", val: "15+", c: "text-amber-400", b: "border-amber-500/30" },
                  { label: "Years Experience", val: "3+", c: "text-violet-400", b: "border-violet-500/30" },
                  { label: "Tech & Toolsets", val: "30+", c: "text-emerald-400", b: "border-emerald-500/30" }
                ].map((st, i) => m.jsxs("div", {
                  key: i,
                  className: "glass-card p-4 sm:p-5 rounded-2xl border " + st.b + " flex flex-col items-center justify-center space-y-1 shadow-lg hover:scale-105 transition-all",
                  children: [
                    m.jsx("span", { className: "text-3xl sm:text-4xl font-extrabold " + st.c, children: st.val }),
                    m.jsx("span", { className: "text-xs text-slate-400 font-semibold", children: st.label })
                  ]
                }))
              })
            ]
          }),

          /* Four Creative Wings */
          m.jsxs("section", {
            className: "space-y-8",
            children: [
              /* Wing Tabs */
              m.jsx("div", {
                className: "flex flex-wrap gap-2.5 sm:gap-3 justify-center",
                children: wings.map(w => {
                  const active = tab === w.id;
                  const c = CM[w.color];
                  return m.jsx("button", {
                    key: w.id,
                    onClick: () => { setTab(w.id); setFilter("All"); },
                    className: "px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 cursor-pointer " +
                      (active ? c.bg + " " + c.text + " " + c.border + " shadow-lg " + c.glow + " scale-105" : "glass-card border-white/10 text-slate-400 hover:text-white hover:border-white/20"),
                    children: w.label
                  });
                })
              }),
              /* Description Banner */
              m.jsx("div", {
                className: "text-center",
                children: m.jsx("p", { className: "text-xs sm:text-sm font-mono " + CM[currentWing.color].text, children: "↳ " + currentWing.desc })
              }),
              /* Featured Spotlight Card */
              featured && m.jsx("div", {
                className: "relative glass-panel rounded-3xl border " + CM[featured.color].border + " p-6 sm:p-8 md:p-10 overflow-hidden shadow-2xl",
                children: m.jsxs("div", {
                  className: "flex flex-col md:flex-row md:items-center justify-between gap-6",
                  children: [
                    m.jsxs("div", {
                      className: "space-y-3 max-w-2xl",
                      children: [
                        m.jsxs("div", {
                          className: "flex items-center gap-2 flex-wrap",
                          children: [
                            m.jsxs("span", {
                              className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border " + (statusStyles[featured.status] || ""),
                              children: [
                                m.jsx("span", { className: "w-2 h-2 rounded-full " + (statusDots[featured.status] || "") }),
                                featured.status
                              ]
                            }),
                            m.jsx("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/10 text-slate-200 border border-white/20", children: "★ Featured Showcase" })
                          ]
                        }),
                        m.jsx("h3", { className: "text-2xl sm:text-3xl font-extrabold text-slate-100", children: featured.title }),
                        m.jsx("p", { className: "text-xs sm:text-sm text-slate-400 leading-relaxed", children: featured.desc }),
                        m.jsx("div", {
                          className: "flex flex-wrap gap-1.5 pt-1",
                          children: featured.tags.map((tg, i) => m.jsx("span", { key: i, className: "px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border " + CM[featured.color].tag, children: tg }))
                        })
                      ]
                    }),
                    m.jsxs("div", {
                      className: "flex flex-row md:flex-col gap-3 shrink-0",
                      children: [
                        m.jsx("button", {
                          onClick: () => setSelected(featured),
                          className: "px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold " + CM[featured.color].btn + " shadow-xl hover:scale-105 transition-all text-center cursor-pointer",
                          children: "Inspect Project 👁"
                        }),
                        m.jsx("button", {
                          onClick: () => goHome("contact"),
                          className: "px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold glass-card border border-white/20 text-slate-200 hover:text-white hover:border-white/40 transition-all text-center cursor-pointer",
                          children: "Collaborate ✉"
                        })
                      ]
                    })
                  ]
                })
              }),
              /* Status Filter Bar */
              m.jsxs("div", {
                className: "flex items-center gap-2 flex-wrap pt-2",
                children: [
                  m.jsx("span", { className: "text-xs text-slate-400 font-mono font-bold mr-1", children: "Filter Status:" }),
                  ["All", "Live", "In Progress", "Completed", "Concept"].map(st => m.jsx("button", {
                    key: st,
                    onClick: () => setFilter(st),
                    className: "px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer " +
                      (filter === st ? (statusStyles[st] || "bg-white/15 text-white border-white/30") : "glass-card border-white/10 text-slate-400 hover:text-white"),
                    children: st
                  }))
                ]
              }),
              /* Grid of Interactive Project Cards */
              m.jsx("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
                children: filteredList.length > 0 ? filteredList.map(p => {
                  const c = CM[p.color] || CM.cyan;
                  return m.jsxs("div", {
                    key: p.id,
                    onClick: () => setSelected(p),
                    className: "glass-card rounded-3xl border " + c.border + " p-5 space-y-4 shadow-xl flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl transition-all cursor-pointer group",
                    children: [
                      m.jsxs("div", {
                        className: "space-y-3",
                        children: [
                          m.jsxs("div", {
                            className: "flex items-center justify-between gap-2",
                            children: [
                              m.jsx("span", {
                                className: "w-8 h-8 rounded-xl " + c.bg + " border " + c.border + " flex items-center justify-center text-sm",
                                children: tab === "technical" ? "⚡" : tab === "entertainment" ? "🎬" : tab === "arts" ? "🎨" : "🔧"
                              }),
                              m.jsxs("span", {
                                className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border " + (statusStyles[p.status] || ""),
                                children: [
                                  m.jsx("span", { className: "w-1.5 h-1.5 rounded-full " + (statusDots[p.status] || "") }),
                                  p.status
                                ]
                              })
                            ]
                          }),
                          m.jsx("h4", { className: "text-base font-bold text-slate-100 group-hover:" + c.text + " transition-colors", children: p.title }),
                          m.jsx("p", { className: "text-xs text-slate-400 leading-relaxed line-clamp-2", children: p.desc })
                        ]
                      }),
                      m.jsxs("div", {
                        className: "space-y-3 pt-2 border-t border-white/5",
                        children: [
                          m.jsx("div", {
                            className: "flex flex-wrap gap-1.5",
                            children: p.tags.map((tg, ti) => m.jsx("span", { key: ti, className: "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border " + c.tag, children: tg }))
                          }),
                          m.jsxs("div", {
                            className: "flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-slate-200",
                            children: [
                              m.jsx("span", { children: "Inspect Project" }),
                              m.jsx("span", { children: "→" })
                            ]
                          })
                        ]
                      })
                    ]
                  });
                }) : m.jsx("div", {
                  className: "col-span-full py-16 text-center text-slate-500 text-sm glass-card rounded-2xl border border-white/5",
                  children: "No items in this category currently match the filter."
                })
              })
            ]
          }),

          /* Toolkit & Daily Drivers */
          m.jsxs("section", {
            className: "space-y-6 pt-6",
            children: [
              m.jsxs("div", {
                className: "text-center space-y-2",
                children: [
                  m.jsx("span", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400", children: "⚙ Hardware, Creative & Code Arsenal" }),
                  m.jsx("h3", { className: "text-2xl sm:text-3xl font-extrabold text-slate-100", children: "Daily Workspace & Toolkit" })
                ]
              }),
              m.jsx("div", {
                className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4",
                children: [
                  { name: "VS Code", icon: "💻", d: "IDE for Web & Firmware" },
                  { name: "Arduino / ESP-IDF", icon: "🔌", d: "Microcontroller C/C++" },
                  { name: "React + Vite", icon: "⚛️", d: "Reactive Web Architecture" },
                  { name: "Firebase Cloud", icon: "🔥", d: "Realtime Data & Auth" },
                  { name: "Three.js / WebGL", icon: "🌐", d: "3D Graphics & Canvas" },
                  { name: "Figma Studio", icon: "🎨", d: "UI/UX & Wireframing" },
                  { name: "Blender 3D", icon: "🎬", d: "Modeling & 3D Lighting" },
                  { name: "DaVinci Resolve", icon: "🎞️", d: "Color Grading & Edits" },
                  { name: "OBS Studio", icon: "📡", d: "Streaming & Audio Relay" },
                  { name: "After Effects", icon: "✨", d: "VFX & Motion Design" },
                  { name: "Python / AI", icon: "🐍", d: "Automation & Data Lab" },
                  { name: "Git & Linux", icon: "🔀", d: "Source & Server Control" }
                ].map((tl, i) => m.jsxs("div", {
                  key: i,
                  className: "glass-card p-3.5 sm:p-4 rounded-2xl border border-white/10 flex items-center gap-3 hover:border-cyan-500/30 hover:scale-[1.02] transition-all",
                  children: [
                    m.jsx("span", { className: "text-2xl select-none", children: tl.icon }),
                    m.jsxs("div", {
                      className: "min-w-0 flex-1",
                      children: [
                        m.jsx("h5", { className: "text-xs sm:text-sm font-bold text-slate-200 truncate", children: tl.name }),
                        m.jsx("p", { className: "text-[10px] text-slate-400 truncate", children: tl.d })
                      ]
                    })
                  ]
                }))
              })
            ]
          }),

          /* Collab Call-To-Action */
          m.jsx("section", {
            className: "relative glass-panel rounded-3xl border border-cyan-500/30 p-8 sm:p-12 text-center overflow-hidden shadow-2xl",
            children: m.jsxs("div", {
              className: "space-y-6 max-w-2xl mx-auto",
              children: [
                m.jsxs("div", {
                  className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold",
                  children: [
                    m.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 transition-opacity duration-700 " + (ping ? "opacity-100" : "opacity-30") }),
                    "Open for Collaborative Projects & Engineering"
                  ]
                }),
                m.jsxs("h3", {
                  className: "text-3xl sm:text-4xl font-extrabold text-slate-100",
                  children: [
                    "Let's Build Something ",
                    m.jsx("span", { className: "bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent", children: "Remarkable" })
                  ]
                }),
                m.jsx("p", {
                  className: "text-xs sm:text-sm text-slate-400 leading-relaxed",
                  children: "Whether you need an IoT embedded system, a high-performance web platform, or creative collaboration across video editing, film, VFX, or gaming — drop a message."
                }),
                m.jsxs("div", {
                  className: "flex flex-wrap items-center justify-center gap-4 pt-2",
                  children: [
                    m.jsx("button", {
                      onClick: () => goHome("contact"),
                      className: "px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all cursor-pointer",
                      children: "Establish Contact ↗"
                    }),
                    m.jsxs("button", {
                      onClick: () => goHome(),
                      className: "px-8 py-3.5 rounded-2xl glass-card border border-white/15 text-slate-200 font-bold text-xs sm:text-sm hover:border-cyan-400/50 hover:text-cyan-400 transition-all cursor-pointer flex items-center gap-2",
                      children: [
                        m.jsx("span", { children: "←" }),
                        m.jsx("span", { children: "Return to Main Portfolio" })
                      ]
                    })
                  ]
                })
              ]
            })
          })
        ]
      }),

      /* Interactive Project Detail Lightbox Modal */
      selected && m.jsx("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md",
        onClick: (e) => { if (e.target === e.currentTarget) setSelected(null); },
        children: m.jsxs("div", {
          className: "relative w-full max-w-2xl glass-panel rounded-3xl border border-cyan-500/40 p-6 sm:p-8 space-y-6 shadow-2xl bg-dark-900/95",
          children: [
            /* Close button */
            m.jsx("button", {
              onClick: () => setSelected(null),
              className: "absolute top-5 right-5 p-2 rounded-xl glass-card border border-white/15 text-slate-400 hover:text-white hover:border-white/30 transition-all cursor-pointer",
              children: "✕"
            }),
            /* Header */
            m.jsxs("div", {
              className: "space-y-2 pr-10",
              children: [
                m.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    m.jsxs("span", {
                      className: "inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border " + (statusStyles[selected.status] || ""),
                      children: [
                        m.jsx("span", { className: "w-2 h-2 rounded-full " + (statusDots[selected.status] || "") }),
                        selected.status
                      ]
                    }),
                    m.jsx("span", { className: "text-xs text-slate-400 font-mono", children: "ID: " + selected.id })
                  ]
                }),
                m.jsx("h3", { className: "text-2xl font-extrabold text-slate-100", children: selected.title })
              ]
            }),
            /* Body */
            m.jsxs("div", {
              className: "space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-y border-white/10 py-4",
              children: [
                m.jsx("p", { className: "font-semibold text-slate-200", children: selected.desc }),
                m.jsx("p", { className: "text-slate-400", children: selected.details })
              ]
            }),
            /* Tags */
            m.jsxs("div", {
              className: "space-y-2",
              children: [
                m.jsx("span", { className: "text-xs font-mono text-slate-400", children: "Architecture & Tools:" }),
                m.jsx("div", {
                  className: "flex flex-wrap gap-1.5",
                  children: selected.tags.map((t, idx) => m.jsx("span", { key: idx, className: "px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30", children: t }))
                })
              ]
            }),
            /* Modal Footer */
            m.jsxs("div", {
              className: "flex items-center justify-between pt-2",
              children: [
                m.jsx("button", {
                  onClick: () => setSelected(null),
                  className: "px-5 py-2.5 rounded-xl glass-card border border-white/15 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer",
                  children: "Close [ESC]"
                }),
                m.jsx("button", {
                  onClick: () => { setSelected(null); goHome("contact"); },
                  className: "px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-slate-950 font-extrabold text-xs shadow-lg hover:scale-105 transition-all cursor-pointer",
                  children: "Inquire About This Build ↗"
                })
              ]
            })
          ]
        })
      })
    ]
  });
}
`;

const BUNDLES = [
  path.join(__dirname, 'assets', 'index-BMqPMOZ-.js'),
  path.join(__dirname, 'public', 'assets', 'index-BMqPMOZ-.js'),
];

for (const b of BUNDLES) {
  console.log('\n--- Applying Dedicated Studio Patch to:', b, '---');
  let content = fs.readFileSync(b, 'utf8');

  // 1. Replace or Inject function DedicatedStudioPage() before function ContinuousMain()
  if (content.includes('function DedicatedStudioPage()')) {
    // Replace existing DedicatedStudioPage
    const pStart = content.indexOf('function DedicatedStudioPage()');
    const pEnd = content.indexOf('function ContinuousMain()');
    content = content.substring(0, pStart) + dedicatedStudioCode.trim() + '\n\n' + content.substring(pEnd);
    console.log('✅ Updated function DedicatedStudioPage()');
  } else if (content.includes('function StudioSection()')) {
    // Replace old StudioSection with DedicatedStudioPage
    const pStart = content.indexOf('function StudioSection()');
    const pEnd = content.indexOf('function ContinuousMain()');
    content = content.substring(0, pStart) + dedicatedStudioCode.trim() + '\n\n' + content.substring(pEnd);
    console.log('✅ Replaced StudioSection with function DedicatedStudioPage()');
  } else {
    const cmPattern = 'function ContinuousMain()';
    content = content.replace(cmPattern, dedicatedStudioCode.trim() + '\n\n' + cmPattern);
    console.log('✅ Injected function DedicatedStudioPage()');
  }

  // 2. Remove embedded <section id="studio"> from ContinuousMain so home page is clean
  const embeddedSecPattern = '\n      m.jsx("section", { id: "studio", className: "scroll-mt-24", children: m.jsx(StudioSection, {}) }),';
  if (content.includes(embeddedSecPattern)) {
    content = content.replace(embeddedSecPattern, '');
    console.log('✅ Removed embedded studio section from ContinuousMain (Option B)');
  }
  const altSecPattern = ',m.jsx("section",{id:"studio",className:"scroll-mt-24",children:m.jsx(StudioSection,{})})';
  if (content.includes(altSecPattern)) {
    content = content.replace(altSecPattern, '');
    console.log('✅ Removed alt embedded studio section from ContinuousMain (Option B)');
  }

  // 3. Update router: path:"/studio" should render DedicatedStudioPage
  const oldRoute = 'm.jsx(Jr,{path:"/studio",element:m.jsx(ContinuousMain,{})})';
  const newRoute = 'm.jsx(Jr,{path:"/studio",element:m.jsx(DedicatedStudioPage,{})})';
  if (content.includes(oldRoute)) {
    content = content.replace(oldRoute, newRoute);
    console.log('✅ Updated router to render DedicatedStudioPage on /studio');
  } else if (content.includes('path:"/studio",element:m.jsx(DedicatedStudioPage,{})')) {
    console.log('ℹ Router already renders DedicatedStudioPage on /studio');
  }

  // 4. Extend Navbar header container width from max-w-7xl to max-w-[1550px]
  const oldHeader = 'className:"max-w-7xl mx-auto glass-panel rounded-2xl px-5 py-3';
  const newHeader = 'className:"max-w-[1550px] w-full mx-auto glass-panel rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3';
  if (content.includes(oldHeader)) {
    content = content.replace(oldHeader, newHeader);
    console.log('✅ Extended navbar header container to 1550px width');
  } else if (content.includes('max-w-[1550px]')) {
    console.log('ℹ Navbar header container is already 1550px width');
  }

  // 5. Adjust desktop nav link spacing and padding to eliminate overflow
  const oldNav = 'hidden xl:flex items-center space-x-1';
  const newNav = 'hidden xl:flex items-center space-x-0.5 2xl:space-x-1';
  if (content.includes(oldNav)) {
    content = content.replace(oldNav, newNav);
    console.log('✅ Tightened desktop nav items spacing');
  }

  // 6. Adjust nav items padding
  const oldPad = 'relative px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors';
  const newPad = 'relative px-2 2xl:px-2.5 py-1.5 rounded-xl text-[11px] 2xl:text-xs font-semibold flex items-center space-x-1 transition-colors';
  if (content.includes(oldPad)) {
    content = content.replace(oldPad, newPad);
    console.log('✅ Adjusted nav item padding and text size');
  }

  // 7. Remove "studio" from scroll spy secs array so home page does not track studio
  const oldSecs = '["home","about","skills","education","work","projects","certificates","interests","gallery","studio","contact"]';
  const newSecs = '["home","about","skills","education","work","projects","certificates","interests","gallery","contact"]';
  if (content.includes(oldSecs)) {
    content = content.replace(oldSecs, newSecs);
    console.log('✅ Cleaned scroll spy secs array back to home sections');
  }

  // 8. Ensure navbar items have Studio item
  if (!content.includes('path:"/studio",label:"Studio"')) {
    const navSearch = '{path:"/gallery",label:"Gallery",icon:mo},{path:"/contact",label:"Contact",icon:gl}';
    const navReplace = '{path:"/gallery",label:"Gallery",icon:mo},{path:"/studio",label:"Studio",icon:Fl},{path:"/contact",label:"Contact",icon:gl}';
    if (content.includes(navSearch)) {
      content = content.replace(navSearch, navReplace);
      console.log('✅ Ensured Studio nav item in navbar');
    }
  }

  fs.writeFileSync(b, content, 'utf8');
  console.log('💾 Successfully saved:', b);
}

console.log('\n🎉 Dedicated Studio & Header Extension patch applied successfully.');
