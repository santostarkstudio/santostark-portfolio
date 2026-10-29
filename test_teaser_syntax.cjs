const vm = require('vm');

const teaserCode = `
function ProjectsStudioTeaser() {
  return m.jsx("div", {
    className: "max-w-7xl mx-auto px-4 mt-8",
    children: m.jsxs("div", {
      className: "relative glass-panel rounded-3xl border border-cyan-500/30 p-6 sm:p-8 md:p-10 overflow-hidden shadow-2xl",
      children: [
        m.jsx("div", { className: "absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" }),
        m.jsx("div", { className: "absolute -bottom-16 -left-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" }),
        m.jsxs("div", {
          className: "relative flex flex-col md:flex-row md:items-center justify-between gap-6",
          children: [
            m.jsxs("div", {
              className: "space-y-3 max-w-2xl",
              children: [
                m.jsx("span", {
                  className: "inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400",
                  children: "✦ BEYOND ENGINEERING & SYSTEMS"
                }),
                m.jsx("h3", {
                  className: "text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100",
                  children: "Looking for more?"
                }),
                m.jsx("p", {
                  className: "text-xs sm:text-sm text-slate-400 leading-relaxed",
                  children: "Check out my game development highlights, VFX reels, and creative design experiments in The Studio."
                }),
                m.jsxs("div", {
                  className: "flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-slate-300",
                  children: [
                    m.jsx("span", { className: "px-2.5 py-1 rounded-full bg-white/5 border border-white/10", children: "🎮 Gaming Highlights" }),
                    m.jsx("span", { className: "px-2.5 py-1 rounded-full bg-white/5 border border-white/10", children: "🎬 VFX & Film Editing" }),
                    m.jsx("span", { className: "px-2.5 py-1 rounded-full bg-white/5 border border-white/10", children: "🎨 UI/UX & 3D Art" }),
                    m.jsx("span", { className: "px-2.5 py-1 rounded-full bg-white/5 border border-white/10", children: "🔧 Workshops & Lab" })
                  ]
                })
              ]
            }),
            m.jsx("div", {
              className: "shrink-0",
              children: m.jsx("button", {
                type: "button",
                onClick: () => { window.location.href = "/studio"; },
                className: "w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-600 to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/20 hover:scale-105 hover:shadow-cyan-500/40 transition-all cursor-pointer flex items-center justify-center gap-2",
                children: m.jsx("span", { children: "Visit The Studio ↗" })
              })
            })
          ]
        })
      ]
    })
  });
}
`;

try {
  new vm.Script(teaserCode);
  console.log('✅ ProjectsStudioTeaser syntax is clean.');
} catch (e) {
  console.error('❌ ProjectsStudioTeaser syntax error:', e);
}
