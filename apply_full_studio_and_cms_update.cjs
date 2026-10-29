const fs = require('fs');
const path = require('path');

const dedicatedStudioCode = `
function DedicatedStudioPage() {
  const [tab, setTab] = q.useState("technical");
  const [filter, setFilter] = q.useState("All");
  const [ping, setPing] = q.useState(true);
  const [selected, setSelected] = q.useState(null);
  const [dbProjects, setDbProjects] = q.useState([]);

  q.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const t = setInterval(() => setPing(p => !p), 1200);
    const onKey = (e) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    (async () => {
      try {
        const docs = await ni("studio_projects", []);
        if (docs && docs.length > 0) setDbProjects(docs);
      } catch(e) {}
    })();
    let cleanup3D = null;
    const timer3D = setTimeout(() => {
      if (window.initStarkIronMan) {
        cleanup3D = window.initStarkIronMan("stark-ironman-container");
      }
    }, 150);
    return () => {
      clearInterval(t);
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer3D);
      if (cleanup3D) cleanup3D();
    };
  }, []);

  const wings = [
    { id: "technical", label: "⚡ Technical Wing", color: "cyan", desc: "Computer Science, Full-Stack Web, Embedded Systems, IoT & Automation" },
    { id: "entertainment", label: "🎬 Entertainment Wing", color: "violet", desc: "Gaming Content, VFX Compositing, Film Production, Video Editing & Live Streaming" },
    { id: "arts", label: "🎨 Arts & Design Wing", color: "amber", desc: "UI/UX Design Systems, AI Digital Art, Creative Branding & 3D Visuals" },
    { id: "other", label: "🔧 Lab & Other Wing", color: "emerald", desc: "Technical Certifications, Student Workshops, Research Documentation & Open Source" }
  ];

  const staticProjects = {
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
  const dbWingProjects = dbProjects.filter(p => p.wing === tab).map(p => ({
    ...p,
    color: currentWing.color,
    tags: Array.isArray(p.tags) ? p.tags : (typeof p.tags === "string" ? p.tags.split(",").map(t => t.trim()).filter(Boolean) : []),
    desc: p.summary || p.desc || "",
    details: p.summary || p.details || "",
    isFromDB: true
  }));
  const list = [...(staticProjects[tab] || []), ...dbWingProjects];
  const featured = list.find(p => p.featured);
  const filteredList = filter === "All" ? list.filter(p => !p.featured) : list.filter(p => !p.featured && p.status === filter);

  return m.jsxs("div", {
    className: "relative min-h-screen bg-dark-900 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black",
    children: [
      /* 1. Stark Lab Background (Fixed to Viewport - Crisp Lab Lighting & Vignette) */
      m.jsx("div", {
        id: "studio-bg-layer", className: "fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none -z-20 transition-opacity duration-300",
        style: { backgroundImage: "url('/assets/studio-bg.jpg')", filter: "contrast(1.08) brightness(0.96) saturate(1.06)" }
      }),
      m.jsx("div", {
        className: "fixed inset-0 pointer-events-none -z-10",
        style: { background: "radial-gradient(ellipse at 50% 55%, transparent 45%, rgba(9, 10, 15, 0.40) 80%, rgba(9, 10, 15, 0.85) 100%)" }
      }),

      /* 2. Fixed 3D Diorama Stage (Fixed to Viewport alongside Background - 0px vertical movement) */
      m.jsxs("div", {
        id: "studio-3d-stage",
        className: "fixed inset-0 z-0 flex items-center justify-center transition-opacity duration-300 pointer-events-auto",
        children: [
          m.jsx("div", {
            id: "stark-ironman-container",
            className: "w-full h-full cursor-grab active:cursor-grabbing pointer-events-auto"
          }),
          /* Forefront Atmospheric Veil (Depth Sandwich - soft mist wrapping pedestal & boots) */
          m.jsx("div", {
            className: "absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-dark-900/85 via-cyan-950/20 to-transparent"
          })
        ]
      }),

      /* 3. Hero Scroll Trigger (100vh spacer with Scroll Indicator Button) */
      m.jsxs("section", {
        id: "studio-hero-wrapper",
        className: "relative w-full min-h-screen flex flex-col justify-end items-center pb-2 z-10 pointer-events-none",
        /* 3. Hero Scroll Trigger: Clean, Single Explore Wings Indicator Button */
        children: [
          m.jsxs("button", {
            type: "button",
            onClick: () => {
              const wings = document.getElementById("studio-wings-section");
              if (wings) {
                wings.scrollIntoView({ behavior: "smooth" });
              } else {
                window.scrollTo({ top: window.innerHeight * 0.98, behavior: "smooth" });
              }
            },
            className: "relative z-30 group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/60 hover:bg-cyan-500/15 border border-cyan-400/30 hover:border-cyan-400/80 shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/25 transition-all cursor-pointer backdrop-blur-md mb-1 pointer-events-auto",
            title: "Scroll Down to Explore",
            children: [
              m.jsx("span", {
                className: "w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
              }),
              m.jsx("span", {
                className: "text-[10px] font-mono tracking-wider text-cyan-300 font-semibold uppercase",
                children: "Explore Wings"
              }),
              m.jsx("span", {
                className: "text-cyan-400 text-xs font-bold group-hover:translate-y-0.5 transition-transform",
                children: "↓"
              })
            ]
          })
        ]
      }),

      /* 4. Main Page Content (Wings, Stats, Projects, Lab) */
      m.jsxs("main", {
        id: "studio-wings-section",
        className: "relative z-10 max-w-6xl mx-auto px-4 pt-10 pb-20 space-y-16",
        children: [
          /* Quick Metrics Bar */
          m.jsx("div", {
            className: "grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4",
            children: [
              { label: "Projects Shipped", val: "20+", c: "text-cyan-400", b: "border-cyan-500/30" },
              { label: "Certifications", val: "15+", c: "text-amber-400", b: "border-amber-500/30" },
              { label: "Years Experience", val: "3+", c: "text-violet-400", b: "border-violet-500/30" },
              { label: "Tech & Toolsets", val: "30+", c: "text-emerald-400", b: "border-emerald-500/30" }
            ].map((s, i) => m.jsxs("div", {
              key: i,
              className: "glass-card p-4 sm:p-5 rounded-2xl border " + s.b + " flex flex-col items-center justify-center space-y-1 shadow-lg hover:scale-105 transition-all",
              children: [
                m.jsx("span", { className: "text-3xl sm:text-4xl font-extrabold " + s.c, children: s.val }),
                m.jsx("span", { className: "text-xs text-slate-400 font-semibold", children: s.label })
              ]
            }))
          }),

          /* 2. Four Creative Wings (Tabs) */
          m.jsxs("section", {
            className: "space-y-8",
            children: [
              /* Wing Buttons (Touch-scrollable rail on mobile, centered on desktop) */
              m.jsx("div", {
                className: "flex flex-nowrap sm:flex-wrap gap-2 sm:gap-3 justify-start sm:justify-center overflow-x-auto no-scrollbar pb-2 px-1 touch-pan-x",
                children: wings.map((w) => {
                  const active = tab === w.id;
                  const c = CM[w.color];
                  return m.jsx("button", {
                    key: w.id,
                    onClick: () => {
                      setTab(w.id);
                      setFilter("All");
                      if (typeof window !== "undefined" && window.starkTriggerWingReaction) {
                        window.starkTriggerWingReaction(w.id);
                      }
                    },
                    className: "shrink-0 px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 cursor-pointer active:scale-95 " +
                      (active
                        ? (c.bg + " " + c.text + " " + c.border + " shadow-lg " + c.glow + " scale-105")
                        : "glass-card border-white/10 text-slate-400 hover:text-white hover:border-white/20"),
                    children: m.jsx("span", { children: w.label })
                  });
                })
              }),

              /* Wing Description */
              m.jsx("div", {
                className: "text-center",
                children: m.jsx("p", {
                  className: "text-xs sm:text-sm font-mono " + CM[currentWing.color].text,
                  children: "↳ " + currentWing.desc
                })
              }),

              /* Featured Project Spotlight */
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
                              className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border " + statusStyles[featured.status],
                              children: [
                                m.jsx("span", { className: "w-2 h-2 rounded-full " + statusDots[featured.status] }),
                                featured.status
                              ]
                            }),
                            m.jsx("span", {
                              className: "px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/10 text-slate-200 border border-white/20",
                              children: "★ Featured Showcase"
                            })
                          ]
                        }),
                        m.jsx("h3", {
                          className: "text-2xl sm:text-3xl font-extrabold text-slate-100",
                          children: featured.title
                        }),
                        m.jsx("p", {
                          className: "text-xs sm:text-sm text-slate-400 leading-relaxed",
                          children: featured.desc
                        }),
                        m.jsx("div", {
                          className: "flex flex-wrap gap-1.5 pt-1",
                          children: (featured.tags || []).map((tg, i) => m.jsx("span", {
                            key: i,
                            className: "px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border " + CM[featured.color].tag,
                            children: tg
                          }))
                        })
                      ]
                    }),
                    m.jsxs("div", {
                      className: "flex flex-row md:flex-col gap-3 shrink-0",
                      children: [
                        m.jsxs("button", {
                          onClick: () => setSelected(featured),
                          className: "px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold " + CM[featured.color].btn + " shadow-xl hover:scale-105 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
                          children: [
                            m.jsx(AR, { className: "w-4 h-4" }),
                            "Inspect Project"
                          ]
                        }),
                        m.jsx("a", {
                          href: "/#contact",
                          onClick: (e) => { e.preventDefault(); window.location.href = "/#contact"; },
                          className: "px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold glass-card border border-white/20 text-slate-200 hover:text-white hover:border-white/40 transition-all text-center flex items-center justify-center gap-1.5",
                          children: "Collaborate ✉"
                        })
                      ]
                    })
                  ]
                })
              }),

              /* Filter Chips */
              m.jsxs("div", {
                className: "flex items-center gap-2 flex-wrap pt-2",
                children: [
                  m.jsx("span", { className: "text-xs text-slate-400 font-mono font-bold mr-1", children: "Filter:" }),
                  ["All", "Live", "In Progress", "Completed", "Concept"].map(st => m.jsx("button", {
                    key: st,
                    onClick: () => setFilter(st),
                    className: "px-3 py-1 rounded-xl text-xs font-bold transition-all border " +
                      (filter === st
                        ? (statusStyles[st] || "bg-white/15 text-white border-white/30")
                        : "glass-card border-white/10 text-slate-400 hover:text-white"),
                    children: st
                  }))
                ]
              }),

              /* Grid of Projects (Responsive: 1-col mobile, 2-col tablet, 3-col desktop, 4-col ultrawide) */
              m.jsx("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5",
                children: filteredList.length > 0 ? filteredList.map((p) => {
                  const c = CM[p.color] || CM.cyan;
                  return m.jsxs("div", {
                    key: p.id || p.title,
                    onClick: () => setSelected(p),
                    className: "glass-card rounded-3xl border " + c.border + " p-4 sm:p-5 space-y-4 shadow-xl flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl hover:border-cyan-400/40 active:scale-[0.98] transition-all cursor-pointer group",
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
                                className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border " + statusStyles[p.status],
                                children: [
                                  m.jsx("span", { className: "w-1.5 h-1.5 rounded-full " + statusDots[p.status] }),
                                  p.status
                                ]
                              })
                            ]
                          }),
                          m.jsx("h4", {
                            className: "text-base font-bold text-slate-100 group-hover:" + c.text + " transition-colors",
                            children: p.title
                          }),
                          m.jsx("p", {
                            className: "text-xs text-slate-400 leading-relaxed line-clamp-2",
                            children: p.desc
                          })
                        ]
                      }),
                      m.jsxs("div", {
                        className: "space-y-3 pt-2 border-t border-white/5",
                        children: [
                          m.jsx("div", {
                            className: "flex flex-wrap gap-1.5",
                            children: (p.tags || []).map((tg, ti) => m.jsx("span", {
                              key: ti,
                              className: "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border " + c.tag,
                              children: tg
                            }))
                          }),
                          m.jsxs("div", {
                            className: "flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-slate-200",
                            children: [
                              m.jsx("span", { children: p.isFromDB && (p.demoUrl || p.fileLink) ? "🔗 Links Available" : "Click to view details" }),
                              m.jsx(x_, { className: "w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" })
                            ]
                          })
                        ]
                      })
                    ]
                  });
                }) : m.jsx("div", {
                  className: "col-span-full py-16 text-center text-slate-500 text-sm glass-card rounded-2xl border border-white/5",
                  children: 'No items in this category currently match the "' + filter + '" status filter.'
                })
              })
            ]
          }),

          /* 3. Daily Driver Toolkit */
          m.jsxs("section", {
            className: "space-y-6 pt-6",
            children: [
              m.jsxs("div", {
                className: "text-center space-y-2",
                children: [
                  m.jsx("span", {
                    className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400",
                    children: "⚙ Hardware, Creative & Code Arsenal"
                  }),
                  m.jsx("h3", {
                    className: "text-2xl sm:text-3xl font-extrabold text-slate-100",
                    children: "Daily Workspace & Toolkit"
                  })
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

          /* 4. Collab Call-To-Action Box */
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
                    m.jsx("span", {
                      className: "bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent",
                      children: "Remarkable"
                    })
                  ]
                }),
                m.jsx("p", {
                  className: "text-xs sm:text-sm text-slate-400 leading-relaxed",
                  children: "Whether you need an IoT embedded system, a high-performance web platform, or creative collaboration across video editing, film, VFX, or gaming — drop a message."
                }),
                m.jsxs("div", {
                  className: "flex flex-wrap items-center justify-center gap-4 pt-2",
                  children: [
                    m.jsx("a", {
                      href: "/#contact",
                      onClick: (e) => { e.preventDefault(); window.location.href = "/#contact"; },
                      className: "px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all cursor-pointer",
                      children: "Establish Contact ↗"
                    }),
                    m.jsxs("a", {
                      href: "/",
                      onClick: (e) => { e.preventDefault(); window.location.href = "/"; },
                      className: "px-8 py-3.5 rounded-2xl glass-card border border-white/15 text-slate-200 font-bold text-xs sm:text-sm hover:border-cyan-400/50 hover:text-cyan-400 transition-all flex items-center gap-2 cursor-pointer",
                      children: [
                        m.jsx("span", { className: "font-bold", children: "←" }),
                        "Return to Main Portfolio"
                      ]
                    })
                  ]
                })
              ]
            })
          })
        ]
      }),

      /* Lightbox Detail Modal (Mobile-responsive max-height & touch scroll) */
      selected && m.jsx("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md",
        children: m.jsxs("div", {
          className: "relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-cyan-500/40 p-5 sm:p-8 space-y-5 shadow-2xl bg-dark-900/95",
          children: [
            m.jsx("button", {
              onClick: () => setSelected(null),
              className: "absolute top-5 right-5 p-2 rounded-xl glass-card border border-white/15 text-slate-400 hover:text-white hover:border-white/30 transition-all cursor-pointer",
              children: "✕"
            }),
            m.jsxs("div", {
              className: "space-y-2 pr-10",
              children: [
                m.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    m.jsxs("span", {
                      className: "inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border " + statusStyles[selected.status],
                      children: [
                        m.jsx("span", { className: "w-2 h-2 rounded-full " + statusDots[selected.status] }),
                        selected.status
                      ]
                    }),
                    m.jsx("span", { className: "text-xs text-slate-400 font-mono", children: "ID: " + (selected.id || "item") })
                  ]
                }),
                m.jsx("h3", { className: "text-2xl font-extrabold text-slate-100", children: selected.title })
              ]
            }),
            m.jsxs("div", {
              className: "space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-y border-white/10 py-4",
              children: [
                m.jsx("p", { className: "font-semibold text-slate-200", children: selected.desc }),
                m.jsx("p", { className: "text-slate-400", children: selected.details })
              ]
            }),
            m.jsxs("div", {
              className: "space-y-2",
              children: [
                m.jsx("span", { className: "text-xs font-mono text-slate-400", children: "Architecture & Tools:" }),
                m.jsx("div", {
                  className: "flex flex-wrap gap-1.5",
                  children: (selected.tags || []).map((t, idx) => m.jsx("span", {
                    key: idx,
                    className: "px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
                    children: t
                  }))
                })
              ]
            }),
            /* Live Demo and File Links */
            (selected.demoUrl || selected.fileLink) && m.jsxs("div", {
              className: "flex flex-wrap gap-2 pt-1 border-t border-white/10",
              children: [
                m.jsx("span", { className: "text-xs font-mono text-slate-400 w-full", children: "Project Links:" }),
                selected.demoUrl && m.jsx("a", {
                  href: selected.demoUrl,
                  target: "_blank",
                  rel: "noreferrer",
                  className: "px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:bg-cyan-500/30 transition-all flex items-center gap-1.5",
                  children: "🔗 Live Demo ↗"
                }),
                selected.fileLink && m.jsx("a", {
                  href: selected.fileLink,
                  target: "_blank",
                  rel: "noreferrer",
                  className: "px-4 py-2 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 font-bold text-xs hover:bg-violet-500/30 transition-all flex items-center gap-1.5",
                  children: "📁 Download / View File ↗"
                })
              ]
            }),
            m.jsxs("div", {
              className: "flex items-center justify-between pt-2",
              children: [
                m.jsx("button", {
                  onClick: () => setSelected(null),
                  className: "px-5 py-2.5 rounded-xl glass-card border border-white/15 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer",
                  children: "Close [ESC]"
                }),
                m.jsx("a", {
                  href: "/#contact",
                  onClick: () => { setSelected(null); window.location.href = "/#contact"; },
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
  if (!fs.existsSync(b)) continue;
  console.log('\n--- Processing Bundle:', b, '---');
  let content = fs.readFileSync(b, 'utf8');

  // ==========================================
  // 1. UPDATE NAVBAR (GJ) TO TRANSFORM ON /studio
  // ==========================================
  const navbarStudioCheck = 'if(n.pathname==="/studio"){return m.jsx("header"';
  if (!content.includes(navbarStudioCheck)) {
    const gjStart = 'function GJ(){const n=Ru(),';
    const gjReplace = 'function GJ(){const n=Ru();if(n&&n.pathname==="/studio"){return m.jsx("header",{className:"fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 py-2.5 transition-all duration-300",children:m.jsxs("div",{className:"max-w-[1550px] w-full mx-auto glass-panel rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border border-white/10 shadow-2xl backdrop-blur-xl",children:[m.jsxs("a",{href:"/",onClick:e=>{e.preventDefault();window.location.href="/";},className:"inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/50 text-cyan-300 hover:text-white hover:border-cyan-400 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/10 hover:scale-105 transition-all cursor-pointer",children:[m.jsx("span",{className:"text-base font-bold",children:"←"}),m.jsx("span",{children:"Back to Portfolio"})]}),m.jsxs("div",{className:"flex items-center gap-2",children:[m.jsx("span",{className:"w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"}),m.jsx("span",{className:"text-xs sm:text-sm md:text-base font-extrabold bg-gradient-to-r from-cyan-400 via-violet-400 to-amber-400 bg-clip-text text-transparent uppercase tracking-wider",children:"SANTO STARK STUDIO"}),m.jsx("span",{className:"hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-slate-300 border border-white/15",children:"HUB"})]}),m.jsxs("div",{className:"inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold",children:[m.jsx("span",{className:"w-2 h-2 rounded-full bg-emerald-400 animate-pulse"}),m.jsx("span",{className:"hidden sm:inline",children:"System Online"})]})]})});}const ';
    if (content.includes(gjStart)) {
      content = content.replace(gjStart, gjReplace);
      console.log('✅ Injected Navbar Studio transformation into GJ()');
    }
  } else {
    console.log('ℹ Navbar Studio transformation already present in GJ()');
  }

  // ==========================================
  // 2. INJECT/REPLACE DedicatedStudioPage()
  // ==========================================
  if (content.includes('function DedicatedStudioPage()')) {
    const pStart = content.indexOf('function DedicatedStudioPage()');
    const pEnd = content.indexOf('function ContinuousMain()');
    content = content.substring(0, pStart) + dedicatedStudioCode.trim() + '\n\n' + content.substring(pEnd);
    console.log('✅ Replaced DedicatedStudioPage with custom Stark Lab background & single header');
  } else if (content.includes('function StudioSection()')) {
    const pStart = content.indexOf('function StudioSection()');
    const pEnd = content.indexOf('function ContinuousMain()');
    content = content.substring(0, pStart) + dedicatedStudioCode.trim() + '\n\n' + content.substring(pEnd);
    console.log('✅ Replaced StudioSection with DedicatedStudioPage');
  }

  // ==========================================
  // 3. INJECT IDEA 4 TEASER BANNER INTO PROJECTS SECTION
  // ==========================================
  const teaserMarker = '✦ BEYOND CODE & SYSTEMS';
  if (!content.includes(teaserMarker)) {
    const targetSearch = 'Request PCB & Source Access"})]})]},o.id||o.title)})}),';
    const teaserBannerCode = `Request PCB & Source Access"})]})]},o.id||o.title)})}),m.jsxs("div",{className:"mt-12 relative glass-panel rounded-3xl border border-cyan-500/30 p-6 sm:p-8 md:p-10 overflow-hidden shadow-2xl",children:[m.jsx("div",{className:"absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"}),m.jsx("div",{className:"absolute -bottom-16 -left-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"}),m.jsxs("div",{className:"relative flex flex-col md:flex-row md:items-center justify-between gap-6",children:[m.jsxs("div",{className:"space-y-3 max-w-2xl",children:[m.jsx("span",{className:"inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400",children:"✦ BEYOND CODE & SYSTEMS"}),m.jsx("h3",{className:"text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100",children:"Looking for more?"}),m.jsx("p",{className:"text-xs sm:text-sm text-slate-400 leading-relaxed",children:"Check out my game development highlights, VFX reels, and creative design experiments in The Studio."}),m.jsxs("div",{className:"flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-slate-300",children:[m.jsx("span",{className:"px-2.5 py-1 rounded-full bg-white/5 border border-white/10",children:"🎮 Gaming Highlights"}),m.jsx("span",{className:"px-2.5 py-1 rounded-full bg-white/5 border border-white/10",children:"🎬 VFX & Film Editing"}),m.jsx("span",{className:"px-2.5 py-1 rounded-full bg-white/5 border border-white/10",children:"🎨 UI/UX & 3D Art"}),m.jsx("span",{className:"px-2.5 py-1 rounded-full bg-white/5 border border-white/10",children:"🔧 Workshops & Lab"})]})]}),m.jsx("div",{className:"shrink-0",children:m.jsx("button",{type:"button",onClick:()=>{window.location.href="/studio";},className:"w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-600 to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/20 hover:scale-105 hover:shadow-cyan-500/40 transition-all cursor-pointer flex items-center justify-center gap-2",children:m.jsx("span",{children:"Visit The Studio ↗"})})})]})]}),`;
    if (content.includes(targetSearch)) {
      content = content.replace(targetSearch, teaserBannerCode);
      console.log('✅ Injected Idea 4 Explore More Teaser Banner at bottom of Projects');
    }
  } else {
    console.log('ℹ Idea 4 Explore More Teaser Banner already present');
  }

  // ==========================================
  // 4. INJECT STUDIO HUB CMS INTO ADMIN (Cle)
  // ==========================================
  if (!content.includes('Studio Hub CMS 🎬')) {
    // 4a. Add state & handlers inside Cle()
    const adminStateTarget = 'const[W,Z]=q.useState(null),';
    const adminStateInjection = 'const[W,Z]=q.useState(null),[studioList,setStudioList]=q.useState([]),[studioForm,setStudioForm]=q.useState({title:"",wing:"technical",summary:"",image:"",fileLink:"",demoUrl:"",tags:"",status:"In Progress"}),';
    if (content.includes(adminStateTarget)) {
      content = content.replace(adminStateTarget, adminStateInjection);
      console.log('✅ Injected studio CMS state hooks into Admin');
    }

    // 4b. Fetch studio_projects in G()
    const fetchTarget = 'const _it=await ni("interests",Ele);setIntList(_it)};';
    const fetchInjection = 'const _it=await ni("interests",Ele);setIntList(_it);const _sp=await ni("studio_projects",[]);setStudioList(_sp)};';
    if (content.includes(fetchTarget)) {
      content = content.replace(fetchTarget, fetchInjection);
      console.log('✅ Injected studio_projects fetch into Admin G()');
    }

    // 4c. Add handlers before the return in Cle()
    const handlerTarget = 'delInt=async B=>{window.confirm("Delete this Interest item from Firebase?")&&(await $f("interests",B),We("Interest item removed!"),G(),setTimeout(()=>We(""),4e3))};';
    const handlerInjection = 'delInt=async B=>{window.confirm("Delete this Interest item from Firebase?")&&(await $f("interests",B),We("Interest item removed!"),G(),setTimeout(()=>We(""),4e3))},saveStudioProj=async B=>{B.preventDefault();const tagArr=Array.isArray(studioForm.tags)?studioForm.tags:(studioForm.tags||"").split(",").map(st=>st.trim()).filter(Boolean);const payload={...studioForm,tags:tagArr};W?(await xc("studio_projects",W.id,payload),We("Updated Studio project in Firebase!"),Z(null)):(await hl("studio_projects",payload),We("Published new Studio project to Firebase!"));setStudioForm({title:"",wing:"technical",summary:"",image:"",fileLink:"",demoUrl:"",tags:"",status:"In Progress"});G();setTimeout(()=>We(""),4e3)},delStudioProj=async B=>{window.confirm("Delete this Studio project from Firebase?")&&(await $f("studio_projects",B),We("Studio project removed!"),G(),setTimeout(()=>We(""),4e3))};';
    if (content.includes(handlerTarget)) {
      content = content.replace(handlerTarget, handlerInjection);
      console.log('✅ Injected saveStudioProj and delStudioProj handlers into Admin');
    }

    // 4d. Add Studio tab to tabs list
    const tabTarget = '{id:"security",label:"Change Password",icon:qS}';
    const tabInjection = '{id:"studio",label:"Studio Hub CMS 🎬",icon:Fl},{id:"security",label:"Change Password",icon:qS}';
    if (content.includes(tabTarget)) {
      content = content.replace(tabTarget, tabInjection);
      console.log('✅ Injected Studio Hub CMS 🎬 tab to Admin tabs');
    }

    // 4e. Render Studio CMS panel when l === "studio"
    const panelTarget = 'l==="security"&&m.jsxs(Rt.div,{initial:{opacity:0},animate:{opacity:1},className:"glass-panel p-6 rounded-3xl border border-white/10 space-y-6"';
    const studioPanelCode = `l==="studio"&&m.jsxs(Rt.div,{initial:{opacity:0},animate:{opacity:1},className:"space-y-6",children:[m.jsxs("div",{className:"glass-panel p-6 rounded-3xl border border-violet-500/30 space-y-5",children:[m.jsxs("div",{className:"flex items-center justify-between border-b border-slate-800 pb-3",children:[m.jsxs("h4",{className:"text-base font-bold text-violet-300 flex items-center gap-2",children:[m.jsx(Fl,{className:"w-5 h-5 text-violet-400"}),"Studio Hub CMS",m.jsx("span",{className:"text-xs font-mono text-slate-400 ml-2",children:"— Add / Edit / Delete Projects in The Studio"})]}),m.jsx("span",{className:"text-[11px] text-emerald-400 font-mono",children:"Live Firebase Sync"})]}),m.jsxs("div",{className:"flex flex-wrap gap-2 text-[11px] font-mono",children:[m.jsx("span",{className:"px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400",children:"⚡ technical"}),m.jsx("span",{className:"px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400",children:"🎬 entertainment"}),m.jsx("span",{className:"px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400",children:"🎨 arts"}),m.jsx("span",{className:"px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400",children:"🔧 other"})]}),m.jsxs("form",{onSubmit:saveStudioProj,className:"space-y-4",children:[m.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[m.jsxs("div",{children:[m.jsx("label",{className:"block text-xs text-slate-300 mb-1",children:"Project Title *"}),m.jsx("input",{type:"text",required:true,placeholder:"e.g. Gaming Montage Reel 2025",value:studioForm.title,onChange:e=>setStudioForm({...studioForm,title:e.target.value}),className:"w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"})]}),m.jsxs("div",{children:[m.jsx("label",{className:"block text-xs text-slate-300 mb-1",children:"Wing (Category) *"}),m.jsxs("select",{value:studioForm.wing,onChange:e=>setStudioForm({...studioForm,wing:e.target.value}),className:"w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 text-slate-100 text-xs border border-white/10 outline-none focus:border-violet-400",children:[m.jsx("option",{value:"technical",children:"⚡ Technical Wing"}),m.jsx("option",{value:"entertainment",children:"🎬 Entertainment Wing"}),m.jsx("option",{value:"arts",children:"🎨 Arts & Design Wing"}),m.jsx("option",{value:"other",children:"🔧 Lab & Other Wing"})]})]}),m.jsxs("div",{children:[m.jsx("label",{className:"block text-xs text-slate-300 mb-1",children:"Status"}),m.jsxs("select",{value:studioForm.status,onChange:e=>setStudioForm({...studioForm,status:e.target.value}),className:"w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 text-slate-100 text-xs border border-white/10 outline-none focus:border-violet-400",children:[m.jsx("option",{value:"Live",children:"🟢 Live"}),m.jsx("option",{value:"In Progress",children:"🟡 In Progress"}),m.jsx("option",{value:"Completed",children:"🔵 Completed"}),m.jsx("option",{value:"Concept",children:"🟣 Concept"})]})]}),m.jsxs("div",{children:[m.jsx("label",{className:"block text-xs text-slate-300 mb-1",children:"Tags (comma-separated)"}),m.jsx("input",{type:"text",placeholder:"e.g. React, Three.js, Firebase",value:studioForm.tags,onChange:e=>setStudioForm({...studioForm,tags:e.target.value}),className:"w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"})]})]}),m.jsxs("div",{children:[m.jsx("label",{className:"block text-xs text-slate-300 mb-1",children:"Summary / Description *"}),m.jsx("textarea",{rows:3,required:true,placeholder:"Brief description of the project...",value:studioForm.summary,onChange:e=>setStudioForm({...studioForm,summary:e.target.value}),className:"w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"})]}),m.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[m.jsxs("div",{children:[m.jsx("label",{className:"block text-xs text-slate-300 mb-1",children:"Thumbnail Image (Upload File or URL)"}),m.jsx("input",{type:"file",accept:"image/*",onChange:e=>{const f=e.target.files&&e.target.files[0];if(f){const rd=new FileReader();rd.onloadend=()=>setStudioForm({...studioForm,image:rd.result});rd.readAsDataURL(f);}},className:"w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-violet-500/20 file:text-violet-300 hover:file:bg-violet-500/30 cursor-pointer glass-card mb-2"}),m.jsx("input",{type:"text",placeholder:"OR paste image URL https://...",value:studioForm.image&&!studioForm.image.startsWith("data:")?studioForm.image:"",onChange:e=>setStudioForm({...studioForm,image:e.target.value}),className:"w-full px-3 py-2 rounded-xl glass-input text-xs"}),studioForm.image&&m.jsxs("div",{className:"mt-2 flex items-center space-x-2",children:[m.jsx("img",{src:studioForm.image,alt:"Preview",className:"w-12 h-12 object-cover rounded-xl border border-violet-400/40"}),m.jsx("span",{className:"text-[10px] text-emerald-400 font-mono",children:"✓ Thumbnail set"})]})]}),m.jsxs("div",{className:"space-y-3",children:[m.jsxs("div",{children:[m.jsx("label",{className:"block text-xs text-slate-300 mb-1",children:"Demo / Live Link"}),m.jsx("input",{type:"text",placeholder:"https://...",value:studioForm.demoUrl,onChange:e=>setStudioForm({...studioForm,demoUrl:e.target.value}),className:"w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"})]}),m.jsxs("div",{children:[m.jsx("label",{className:"block text-xs text-slate-300 mb-1",children:"File / Download Link"}),m.jsx("input",{type:"text",placeholder:"https://drive.google.com/...",value:studioForm.fileLink,onChange:e=>setStudioForm({...studioForm,fileLink:e.target.value}),className:"w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"})]})]})]}),m.jsxs("div",{className:"flex items-center gap-3 pt-2",children:[m.jsxs("button",{type:"submit",className:"px-6 py-2.5 bg-gradient-to-r from-violet-500 to-cyan-500 text-slate-950 font-extrabold rounded-xl text-xs shadow-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer",children:[m.jsx(AR,{className:"w-4 h-4"}),W?"Update Studio Project":"➕ Publish Studio Project"]}),W&&m.jsx("button",{type:"button",onClick:()=>{Z(null);setStudioForm({title:"",wing:"technical",summary:"",image:"",fileLink:"",demoUrl:"",tags:"",status:"In Progress"});},className:"px-5 py-2.5 glass-card border border-white/15 text-slate-300 rounded-xl text-xs font-bold hover:text-white transition-all cursor-pointer",children:"Cancel Edit"})]})]})]}),m.jsxs("div",{className:"glass-panel p-6 rounded-3xl border border-white/10 space-y-4",children:[m.jsxs("h4",{className:"text-sm font-bold text-slate-200 flex items-center gap-2",children:[m.jsx(Fl,{className:"w-4 h-4 text-violet-400"}),"Studio Projects in Firebase ("+studioList.length+")"]}),studioList.length===0?m.jsxs("div",{className:"text-center py-10 text-slate-500 text-xs",children:[m.jsx(Fl,{className:"w-8 h-8 mx-auto mb-2 opacity-30"}),"No Studio projects added yet. Use the form above to publish your first one."]}):m.jsx("div",{className:"space-y-3",children:studioList.map(proj=>{const tagsArr=Array.isArray(proj.tags)?proj.tags:(typeof proj.tags==="string"?proj.tags.split(",").map(t=>t.trim()).filter(Boolean):[]);return m.jsxs("div",{key:proj.id,className:"glass-card rounded-2xl border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[m.jsxs("div",{className:"flex items-start gap-3 min-w-0",children:[proj.image&&m.jsx("img",{src:proj.image,alt:proj.title,className:"w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0"}),m.jsxs("div",{className:"min-w-0",children:[m.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[m.jsx("span",{className:"text-xs font-bold px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400",children:proj.wing}),m.jsx("span",{className:"text-[10px] font-mono text-slate-400",children:proj.status})]}),m.jsx("p",{className:"text-sm font-bold text-slate-100 mt-0.5 truncate",children:proj.title}),m.jsx("p",{className:"text-[11px] text-slate-400 line-clamp-1 mt-0.5",children:proj.summary}),m.jsx("div",{className:"flex flex-wrap gap-1 mt-1",children:tagsArr.slice(0,4).map((t,i)=>m.jsx("span",{key:i,className:"px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/5 text-slate-300 border border-white/10",children:t}))})]})]}),m.jsxs("div",{className:"flex items-center gap-2 shrink-0",children:[m.jsx("button",{onClick:()=>{Z(proj);setStudioForm({title:proj.title||"",wing:proj.wing||"technical",summary:proj.summary||"",image:proj.image||"",fileLink:proj.fileLink||"",demoUrl:proj.demoUrl||"",tags:Array.isArray(proj.tags)?proj.tags.join(", "):(proj.tags||""),status:proj.status||"In Progress"});window.scrollTo({top:0,behavior:"smooth"});},className:"px-3 py-1.5 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 text-[11px] font-bold hover:bg-violet-500/30 transition-all flex items-center gap-1 cursor-pointer",children:"Edit"}),m.jsx("button",{onClick:()=>delStudioProj(proj.id),className:"px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-bold hover:bg-rose-500/30 transition-all flex items-center gap-1 cursor-pointer",children:"Delete"})]})]});})})]}),m.jsxs("div",{className:"p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 text-violet-200 text-xs space-y-1.5",children:[m.jsx("p",{className:"font-bold text-violet-300",children:"✦ Studio Hub CMS Information:"}),m.jsx("p",{children:"Projects published here are saved to Firebase and instantly display on /studio under their assigned Wing tab."}),m.jsx("p",{children:"Choose Wing: Technical ⚡, Entertainment 🎬, Arts 🎨, or Lab 🔧."})]})]}),` + panelTarget;
    if (content.includes(panelTarget)) {
      content = content.replace(panelTarget, studioPanelCode);
      console.log('✅ Injected Studio CMS panel into Admin UI');
    }
  } else {
    console.log('ℹ Studio Hub CMS already present in Admin');
  }

    // Remove AI Assistant widget from all pages
  const aiWidget = 'm.jsx(KJ,{})';
  if (content.includes(aiWidget)) {
    content = content.replace(aiWidget, 'null');
    console.log('✅ Removed AIAssistant widget from Ple()');
  }

  // 5. Restore Original Stark Dark Glass Floating Capsule on Homepage
  const navHeaderTransparent = 'bg-transparent rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border-0 shadow-none backdrop-blur-none';
  const navHeaderDarkGlass = 'glass-panel rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border border-white/10 shadow-2xl backdrop-blur-xl';
  // Note: Only replace if outside the studio check
  if (content.includes(navHeaderTransparent) && !content.includes(navHeaderDarkGlass)) {
    // Preserve studio transparent header while restoring homepage dark glass
    const studioHeaderSnippet = 'if(n&&n.pathname==="/studio"){return m.jsx("header",{className:"fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 py-2.5 transition-all duration-300",children:m.jsxs("div",{className:"max-w-[1550px] w-full mx-auto bg-transparent rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border-0 shadow-none backdrop-blur-none"';
    if (!content.includes(studioHeaderSnippet)) {
      content = content.replace(navHeaderTransparent, navHeaderDarkGlass);
      console.log('✅ Restored original Stark dark glass floating capsule on homepage');
    }
  }

  // 5b. Remove top gap from homepage navbar (pt-0 instead of py-3)
  if (content.includes('fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300')) {
    content = content.replace('fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300', 'fixed top-0 left-0 right-0 z-50 px-4 pt-0 pb-3 transition-all duration-300');
    console.log('✅ Removed top gap from homepage navbar (pt-0)');
  }

  // 6. INJECT SITE TEXT & COPY CMS TAB INTO ADMIN
  const textCmsTab = '{id:"textcms",label:"Site Text & Copy 📝",icon:AR},';
  if (!content.includes('id:"textcms"')) {
    const studioTabMarker = '{id:"studio",label:"Studio Hub CMS 🎬",icon:Fl},';
    if (content.includes(studioTabMarker)) {
      content = content.replace(studioTabMarker, studioTabMarker + textCmsTab);
      console.log('✅ Injected Site Text & Copy 📝 tab into Admin tabs list');
    }
  }

  const textCmsPanelMarker = 'l==="textcms"&&';
  if (!content.includes(textCmsPanelMarker)) {
    const secPanelTarget = 'l==="security"&&m.jsxs(Rt.div,{initial:{opacity:0},animate:{opacity:1},className:"glass-panel p-6 rounded-3xl border border-white/10 space-y-6"';
    const textCmsPanelCode = `l==="textcms"&&m.jsxs(Rt.div,{initial:{opacity:0},animate:{opacity:1},className:"space-y-6",children:[m.jsxs("div",{className:"glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-5",children:[m.jsxs("div",{className:"flex items-center justify-between border-b border-slate-800 pb-3",children:[m.jsxs("h4",{className:"text-base font-bold text-cyan-300 flex items-center gap-2",children:[m.jsx(AR,{className:"w-5 h-5 text-cyan-400"}),"Universal Site Text & Copy CMS",m.jsx("span",{className:"text-xs font-mono text-slate-400 ml-2",children:"— Option A (Tabbed Manager) & Option B (Live In-Context Edit)"})]}),m.jsx("span",{className:"text-[11px] text-emerald-400 font-mono",children:"Universal Engine Ready"})]}),m.jsx("p",{className:"text-xs text-slate-300 leading-relaxed",children:"Manage and edit every single heading, button label, badge, tagline, bio, and quote across the entire website. Changes sync automatically to Cloud Firestore and the live site simultaneously."}),m.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 pt-2",children:[m.jsxs("div",{className:"p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/30 space-y-3",children:[m.jsxs("h5",{className:"text-sm font-bold text-cyan-300 flex items-center gap-2",children:[m.jsx("span",{children:"📑"}),"Option A: Tabbed Text & Copy Manager"]}),m.jsx("p",{className:"text-xs text-slate-400",children:"Structured dashboard organized by pages and sections with instant live search, category tabs, and character counters."}),m.jsx("button",{type:"button",onClick:()=>{if(window.StarkContentEngine)window.StarkContentEngine.openAdminCMSModal();},className:"w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs shadow-lg hover:scale-[1.02] transition-all cursor-pointer",children:"Launch Tabbed Copy Manager ↗"})]}),m.jsxs("div",{className:"p-5 rounded-2xl bg-slate-900/60 border border-violet-500/30 space-y-3",children:[m.jsxs("h5",{className:"text-sm font-bold text-violet-300 flex items-center gap-2",children:[m.jsx("span",{children:"⚡"}),"Option B: Visual In-Context Live Edit"]}),m.jsx("p",{className:"text-xs text-slate-400",children:"Click and type directly on any heading, badge, or paragraph on the live website. Saves directly to Cloud."}),m.jsx("button",{type:"button",onClick:()=>{window.location.href="/";setTimeout(()=>{if(window.StarkContentEngine)window.StarkContentEngine.toggleLiveEdit(true);},400);},className:"w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-600 text-white font-extrabold text-xs shadow-lg hover:scale-[1.02] transition-all cursor-pointer",children:"Go to Site in Live Edit Mode ⚡"})]})]})]}),m.jsxs("div",{className:"p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-cyan-200 text-xs space-y-1.5",children:[m.jsx("p",{className:"font-bold text-cyan-300",children:"✦ Quick Tip:"}),m.jsx("p",{children:"You can also trigger Live Edit Mode anytime from ANY page using the floating ⚡ button at the bottom-right corner of your screen."})]})]}),` + secPanelTarget;
    if (content.includes(secPanelTarget)) {
      content = content.replace(secPanelTarget, textCmsPanelCode);
      console.log('✅ Injected Site Text & Copy 📝 panel into Admin UI');
    }
  }

  fs.writeFileSync(b, content, 'utf8');
  console.log('💾 Successfully saved:', b);
}

console.log('\n🎉 ALL 4 FEATURES FULLY APPLIED TO LIVE BUNDLES!');

