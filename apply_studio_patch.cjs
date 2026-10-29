const fs = require('fs');
const path = require('path');

const studioCode = `
function StudioSection() {
  const [tab, setTab] = q.useState("technical");
  const [filter, setFilter] = q.useState("All");
  const [ping, setPing] = q.useState(true);

  q.useEffect(() => {
    const t = setInterval(() => setPing(p => !p), 1200);
    return () => clearInterval(t);
  }, []);

  const wings = [
    { id: "technical", label: "⚡ Technical", color: "cyan", desc: "Full-Stack Web Apps, IoT Systems, ESP32/STM32 Firmware, Python & C++" },
    { id: "entertainment", label: "🎬 Entertainment", color: "violet", desc: "Gaming Highlights, VFX Compositing, Film Production, Video Editing & Streaming" },
    { id: "arts", label: "🎨 Arts & Design", color: "amber", desc: "UI/UX Design Systems, AI Digital Art, Creative Branding & 3D Visuals" },
    { id: "other", label: "🔧 Other", color: "emerald", desc: "Technical Certifications, Student Workshops, Research & Open Source" }
  ];

  const projects = {
    technical: [
      { title: "Santo Stark Portfolio", desc: "Interactive 3D Solar System hero, Firebase Realtime CMS, glassmorphic UI, Three.js & React.", tags: ["React", "Three.js", "Firebase", "Tailwind"], status: "Live", color: "cyan", featured: true },
      { title: "IoT Smart Hardware Dashboard", desc: "ESP32 real-time telemetry streamed via MQTT to a live reactive web interface.", tags: ["ESP32", "MQTT", "Node.js", "C++"], status: "Completed", color: "cyan" },
      { title: "React Real-Time Cloud App", desc: "Full-stack web application with Firebase Firestore, user authentication, and analytics.", tags: ["React", "Firebase", "Tailwind", "Vite"], status: "Completed", color: "cyan" },
      { title: "Embedded Firmware & Robotics", desc: "STM32/ESP32 firmware architecture with FreeRTOS multitasking and custom sensor PCB.", tags: ["STM32", "FreeRTOS", "C++", "PCB"], status: "In Progress", color: "cyan" },
      { title: "C++ High-Performance Socket Server", desc: "Multi-threaded TCP/UDP server handling concurrent client packets and low-latency feeds.", tags: ["C++", "Sockets", "Threading", "Linux"], status: "Completed", color: "cyan" },
      { title: "Python Automation & ML Tooling", desc: "Data processing pipelines, automated scraping scripts, and neural experiments.", tags: ["Python", "Pandas", "Scikit-Learn", "Automation"], status: "In Progress", color: "cyan" }
    ],
    entertainment: [
      { title: "Gaming Content & Montage Reel", desc: "High-octane gaming recordings, competitive highlights, and fast-paced cinematic montages.", tags: ["Gaming", "Editing", "Montage", "Streaming"], status: "In Progress", color: "violet", featured: true },
      { title: "VFX & Motion Graphics Experiments", desc: "Visual effects compositing, 3D particle systems, screen tracking, and dynamic title design.", tags: ["VFX", "After Effects", "Motion", "Compositing"], status: "In Progress", color: "violet" },
      { title: "Cinematic Video Editing Showcase", desc: "Narrative pacing, audio soundscapes, color grading in DaVinci Resolve, and cinematic cuts.", tags: ["Premiere Pro", "DaVinci", "Color Grade", "SFX"], status: "Completed", color: "violet" },
      { title: "Short Film & Screenplay Concepts", desc: "Scriptwriting, storyboard layouts, cinematography test shoots, and narrative direction.", tags: ["Film", "Direction", "Story", "Cinematography"], status: "Concept", color: "violet" },
      { title: "3D Animation & Rigging Studies", desc: "Procedural keyframing, character motion studies, and camera animation in Blender.", tags: ["Blender", "3D", "Rigging", "Keyframes"], status: "Concept", color: "violet" },
      { title: "Live Streaming & Broadcast Production", desc: "Custom OBS scene switchers, animated overlays, audio gate mixing, and multi-stream relay.", tags: ["OBS", "Broadcast", "Audio Mix", "Twitch"], status: "Live", color: "violet" }
    ],
    arts: [
      { title: "UI/UX Design Systems & Prototypes", desc: "Figma design systems, scalable design tokens, micro-interactions, and mobile/desktop wireframes.", tags: ["Figma", "UI/UX", "Design Systems", "Prototyping"], status: "In Progress", color: "amber", featured: true },
      { title: "AI-Generated Digital Art Collection", desc: "Generative aesthetics, prompt engineering, diffusion models, and high-res digital remastering.", tags: ["AI Art", "Midjourney", "Diffusion", "Digital"], status: "In Progress", color: "amber" },
      { title: "Graphic Design & Visual Identity", desc: "Brand identities, typography exploration, posters, social assets, and vector illustrations.", tags: ["Illustrator", "Photoshop", "Branding", "Vector"], status: "Completed", color: "amber" },
      { title: "Abstract 3D Visualizations", desc: "Procedural geometry, glass shaders, emissive materials, and lighting studies.", tags: ["Three.js", "WebGL", "Blender", "Shaders"], status: "Concept", color: "amber" }
    ],
    other: [
      { title: "Technical Certifications Portfolio", desc: "15+ verified certifications in Cloud, Cybersecurity, Embedded Computing, and Web Development.", tags: ["Cybersecurity", "Cloud", "NPTEL", "DevOps"], status: "Completed", color: "emerald", featured: true },
      { title: "Peer Workshops & Tech Mentorship", desc: "Hands-on student bootcamps on ESP32 microcontroller coding and modern React frontend workflows.", tags: ["Mentorship", "ESP32", "React", "Community"], status: "Completed", color: "emerald" },
      { title: "Research & Technical Documentation", desc: "Detailed engineering journals, IEEE format project reports, and system schematics.", tags: ["Research", "IEEE", "Documentation", "LaTeX"], status: "In Progress", color: "emerald" },
      { title: "Open-Source Code Contributions", desc: "Active GitHub contributions, utility toolkits, and shared developer snippets.", tags: ["GitHub", "Open Source", "Git", "Community"], status: "In Progress", color: "emerald" }
    ]
  };

  const CM = {
    cyan:    { border: "border-cyan-500/30", bg: "bg-cyan-500/10", text: "text-cyan-400", tag: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30", btn: "bg-cyan-500 text-slate-950", glow: "shadow-cyan-500/30" },
    violet:  { border: "border-violet-500/30", bg: "bg-violet-500/10", text: "text-violet-400", tag: "bg-violet-500/15 text-violet-400 border-violet-500/30", btn: "bg-violet-500 text-white", glow: "shadow-violet-500/30" },
    amber:   { border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-400", tag: "bg-amber-500/15 text-amber-400 border-amber-500/30", btn: "bg-amber-500 text-slate-950", glow: "shadow-amber-500/30" },
    emerald: { border: "border-emerald-500/30", bg: "bg-emerald-500/10", text: "text-emerald-400", tag: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", btn: "bg-emerald-500 text-slate-950", glow: "shadow-emerald-500/30" }
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

  return m.jsx(oo, {
    title: "Santo Stark Studio",
    subtitle: "A dual-wing creative and engineering studio — Computer Science & Engineering meets Film, VFX, Gaming, and Digital Arts.",
    bgImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=2000&q=80",
    children: m.jsxs("div", {
      className: "space-y-16 max-w-6xl mx-auto px-4",
      children: [
        /* 1. Header Banner & Stats */
        m.jsxs("div", {
          className: "text-center space-y-4",
          children: [
            m.jsx("span", {
              className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400",
              children: "✦ Creative Agency & Engineering Lab"
            }),
            m.jsx("h2", {
              className: "text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-violet-400 to-amber-400 bg-clip-text text-transparent tracking-tight",
              children: "Studio at a Glance"
            }),
            m.jsx("p", {
              className: "text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed",
              children: "Bridging the gap between software algorithms, IoT embedded hardware, and cinematic multimedia storytelling."
            }),
            m.jsx("div", {
              className: "grid grid-cols-2 md:grid-cols-4 gap-4 pt-6",
              children: [
                { label: "Projects Shipped", val: "20+", c: "text-cyan-400", b: "border-cyan-500/30" },
                { label: "Certifications", val: "15+", c: "text-amber-400", b: "border-amber-500/30" },
                { label: "Years Experience", val: "3+", c: "text-violet-400", b: "border-violet-500/30" },
                { label: "Tech & Toolsets", val: "30+", c: "text-emerald-400", b: "border-emerald-500/30" }
              ].map((st, i) => m.jsxs("div", {
                key: i,
                className: "glass-card p-5 rounded-2xl border " + st.b + " flex flex-col items-center justify-center space-y-1 shadow-lg hover:scale-105 transition-transform",
                children: [
                  m.jsx("span", { className: "text-3xl md:text-4xl font-extrabold " + st.c, children: st.val }),
                  m.jsx("span", { className: "text-xs text-slate-400 font-semibold", children: st.label })
                ]
              }))
            })
          ]
        }),

        /* 2. Creative Wing Switcher Tabs */
        m.jsxs("div", {
          className: "space-y-6",
          children: [
            m.jsx("div", {
              className: "flex flex-wrap gap-2.5 sm:gap-3 justify-center",
              children: wings.map(w => {
                const c = CM[w.color];
                const active = tab === w.id;
                return m.jsx("button", {
                  key: w.id,
                  onClick: () => { setTab(w.id); setFilter("All"); },
                  className: "px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 " +
                    (active ? c.bg + " " + c.text + " " + c.border + " shadow-lg shadow-" + w.color + "-500/20 scale-105" : "glass-card border-white/10 text-slate-400 hover:text-white hover:border-white/20"),
                  children: w.label
                });
              })
            }),
            m.jsx("div", {
              className: "text-center",
              children: m.jsx("p", {
                className: "text-xs font-mono " + CM[currentWing.color].text,
                children: "↳ " + currentWing.desc
              })
            }),

            /* Featured Project Highlight */
            featured && m.jsx("div", {
              className: "relative glass-panel rounded-3xl border " + CM[featured.color].border + " p-6 sm:p-8 md:p-10 overflow-hidden shadow-2xl",
              children: m.jsxs("div", {
                className: "relative flex flex-col md:flex-row md:items-center justify-between gap-6",
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
                        children: featured.tags.map((tg, idx) => m.jsx("span", {
                          key: idx,
                          className: "px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border " + CM[featured.color].tag,
                          children: tg
                        }))
                      })
                    ]
                  }),
                  m.jsxs("div", {
                    className: "flex flex-row md:flex-col gap-3 shrink-0",
                    children: [
                      m.jsx("button", {
                        onClick: () => {
                          if (window.starkScrollTo) window.starkScrollTo("projects");
                          else document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                        },
                        className: "px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold " + CM[featured.color].btn + " shadow-xl hover:scale-105 transition-all text-center",
                        children: "Explore Portfolio ↗"
                      }),
                      m.jsx("button", {
                        onClick: () => {
                          if (window.starkScrollTo) window.starkScrollTo("contact");
                          else document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                        },
                        className: "px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold glass-card border border-white/20 text-slate-200 hover:text-white hover:border-white/40 transition-all text-center",
                        children: "Collaborate ✉"
                      })
                    ]
                  })
                ]
              })
            }),

            /* Filter Bar */
            m.jsxs("div", {
              className: "flex items-center gap-2 flex-wrap pt-4",
              children: [
                m.jsx("span", { className: "text-xs text-slate-400 font-mono font-bold mr-1", children: "Filter Status:" }),
                ["All", "Live", "In Progress", "Completed", "Concept"].map(st => m.jsx("button", {
                  key: st,
                  onClick: () => setFilter(st),
                  className: "px-3 py-1 rounded-xl text-xs font-bold transition-all border " +
                    (filter === st ? (statusStyles[st] || "bg-white/15 text-white border-white/30") : "glass-card border-white/10 text-slate-400 hover:text-white"),
                  children: st
                }))
              ]
            }),

            /* Grid of Cards */
            m.jsx("div", {
              className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
              children: filteredList.length > 0 ? filteredList.map((p, i) => {
                const c = CM[p.color] || CM.cyan;
                return m.jsxs("div", {
                  key: i,
                  className: "glass-card rounded-3xl border " + c.border + " p-5 space-y-4 shadow-xl flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl transition-all group",
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
                        m.jsx("h4", {
                          className: "text-base font-bold text-slate-100 group-hover:" + c.text + " transition-colors",
                          children: p.title
                        }),
                        m.jsx("p", {
                          className: "text-xs text-slate-400 leading-relaxed",
                          children: p.desc
                        })
                      ]
                    }),
                    m.jsx("div", {
                      className: "flex flex-wrap gap-1.5 pt-2 border-t border-white/5",
                      children: p.tags.map((tg, ti) => m.jsx("span", {
                        key: ti,
                        className: "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border " + c.tag,
                        children: tg
                      }))
                    })
                  ]
                });
              }) : m.jsx("div", {
                className: "col-span-full py-12 text-center text-slate-500 text-sm",
                children: "No projects in this category currently matching the filter."
              })
            })
          ]
        }),

        /* 3. Studio Toolkit & Daily Drivers */
        m.jsxs("div", {
          className: "space-y-6 pt-6",
          children: [
            m.jsxs("div", {
              className: "text-center space-y-2",
              children: [
                m.jsx("span", {
                  className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400",
                  children: "⚙ Hardware & Software Gear"
                }),
                m.jsx("h3", {
                  className: "text-2xl sm:text-3xl font-extrabold text-slate-100",
                  children: "Workspace & Toolkit"
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
                className: "glass-card p-3.5 sm:p-4 rounded-2xl border border-white/10 flex items-center gap-3 hover:border-cyan-500/30 transition-all",
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

        /* 4. Collaborative Call-to-Action */
        m.jsx("div", {
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
                children: "Whether you have an IoT embedded prototype in mind, need a fast full-stack web application, or want to collaborate on video, gaming, or visual media — let's connect."
              }),
              m.jsxs("div", {
                className: "flex flex-wrap items-center justify-center gap-4 pt-2",
                children: [
                  m.jsx("button", {
                    onClick: () => {
                      if (window.starkScrollTo) window.starkScrollTo("contact");
                      else document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    },
                    className: "px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all",
                    children: "Establish Contact ↗"
                  }),
                  m.jsx("button", {
                    onClick: () => {
                      if (window.starkScrollTo) window.starkScrollTo("projects");
                      else document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                    },
                    className: "px-8 py-3.5 rounded-2xl glass-card border border-white/15 text-slate-200 font-bold text-xs sm:text-sm hover:border-cyan-400/50 hover:text-cyan-400 transition-all",
                    children: "View Projects ⚡"
                  })
                ]
              })
            ]
          })
        })
      ]
    })
  });
}
`;

const BUNDLES = [
  path.join(__dirname, 'assets', 'index-BMqPMOZ-.js'),
  path.join(__dirname, 'public', 'assets', 'index-BMqPMOZ-.js'),
];

for (const b of BUNDLES) {
  console.log('\n--- Patching', b, '---');
  let content = fs.readFileSync(b, 'utf8');

  // 1. Inject StudioSection definition before function ContinuousMain()
  if (!content.includes('function StudioSection()')) {
    const cmPattern = 'function ContinuousMain()';
    if (!content.includes(cmPattern)) {
      console.error('❌ Could not find function ContinuousMain() in', b);
      continue;
    }
    content = content.replace(cmPattern, studioCode + '\n\n' + cmPattern);
    console.log('✅ Injected function StudioSection()');
  } else {
    console.log('ℹ function StudioSection() already present');
  }

  // 2. Add navbar item between gallery and contact
  const navSearch = '{path:"/gallery",label:"Gallery",icon:mo},{path:"/contact",label:"Contact",icon:gl}';
  const navReplace = '{path:"/gallery",label:"Gallery",icon:mo},{path:"/studio",label:"Studio",icon:Fl},{path:"/contact",label:"Contact",icon:gl}';
  if (content.includes(navSearch)) {
    content = content.replace(navSearch, navReplace);
    console.log('✅ Injected Studio nav item into navbar');
  } else if (content.includes('/studio",label:"Studio"')) {
    console.log('ℹ Studio nav item already present');
  } else {
    console.warn('⚠ Could not match navSearch');
  }

  // 3. Add studio to secs array in Navbar GJ()
  const secsSearch = '["home","about","skills","education","work","projects","certificates","interests","gallery","contact"]';
  const secsReplace = '["home","about","skills","education","work","projects","certificates","interests","gallery","studio","contact"]';
  if (content.includes(secsSearch)) {
    content = content.replace(secsSearch, secsReplace);
    console.log('✅ Injected "studio" into navbar scroll-spy secs array');
  } else if (content.includes('"gallery","studio","contact"')) {
    console.log('ℹ "studio" already in secs array');
  } else {
    console.warn('⚠ Could not match secsSearch');
  }

  // 4. In ContinuousMain, add <section id="studio"> between gallery and contact
  const secSearch = 'm.jsx("section", { id: "gallery", className: "scroll-mt-24", children: m.jsx(Tle, {}) }),\n      m.jsx("section", { id: "contact", className: "scroll-mt-24", children: m.jsx(Mle, {}) })';
  const secReplace = 'm.jsx("section", { id: "gallery", className: "scroll-mt-24", children: m.jsx(Tle, {}) }),\n      m.jsx("section", { id: "studio", className: "scroll-mt-24", children: m.jsx(StudioSection, {}) }),\n      m.jsx("section", { id: "contact", className: "scroll-mt-24", children: m.jsx(Mle, {}) })';

  if (content.includes(secSearch)) {
    content = content.replace(secSearch, secReplace);
    console.log('✅ Injected <section id="studio"> between gallery and contact in ContinuousMain');
  } else {
    // Try single-line match if formatted differently
    const singleSecSearch = 'm.jsx("section",{id:"gallery",className:"scroll-mt-24",children:m.jsx(Tle,{})}),m.jsx("section",{id:"contact",className:"scroll-mt-24",children:m.jsx(Mle,{})})';
    const singleSecReplace = 'm.jsx("section",{id:"gallery",className:"scroll-mt-24",children:m.jsx(Tle,{})}),m.jsx("section",{id:"studio",className:"scroll-mt-24",children:m.jsx(StudioSection,{})}),m.jsx("section",{id:"contact",className:"scroll-mt-24",children:m.jsx(Mle,{})})';
    if (content.includes(singleSecSearch)) {
      content = content.replace(singleSecSearch, singleSecReplace);
      console.log('✅ Injected <section id="studio"> (single-line match)');
    } else if (content.includes('id: "studio"')) {
      console.log('ℹ <section id="studio"> already present');
    } else {
      console.warn('⚠ Could not match secSearch');
    }
  }

  // 5. In Routes router, add /studio route
  const routeSearch = 'm.jsx(Jr,{path:"/gallery",element:m.jsx(ContinuousMain,{})}),m.jsx(Jr,{path:"/contact",element:m.jsx(ContinuousMain,{})})';
  const routeReplace = 'm.jsx(Jr,{path:"/gallery",element:m.jsx(ContinuousMain,{})}),m.jsx(Jr,{path:"/studio",element:m.jsx(ContinuousMain,{})}),m.jsx(Jr,{path:"/contact",element:m.jsx(ContinuousMain,{})})';
  if (content.includes(routeSearch)) {
    content = content.replace(routeSearch, routeReplace);
    console.log('✅ Injected /studio route into router');
  } else if (content.includes('path:"/studio"')) {
    console.log('ℹ /studio route already present');
  } else {
    console.warn('⚠ Could not match routeSearch');
  }

  fs.writeFileSync(b, content, 'utf8');
  console.log('💾 Successfully saved', b);
}

console.log('\n🎉 Patch script execution complete.');
