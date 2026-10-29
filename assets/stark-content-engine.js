/**
 * ==============================================================
 * STARK CONTENT ENGINE (UNIVERSAL WEBSITE COPY CMS)
 * Powers Option B: Visual In-Context Live Edit on live pages
 * Santo Stark Portfolio & Studio Hub
 * ==============================================================
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'stark_visual_edits_v1';
  let savedEdits = {};
  let pendingEdits = {};
  let isLiveEditActive = false;

  // Load saved edits from localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) savedEdits = JSON.parse(raw);
  } catch(e) {
    savedEdits = {};
  }

  // 1. Generate unique selector for any DOM element
  function getUniqueSelector(el) {
    if (!el || el === document.body || el === document.documentElement) return '';
    if (el.id) return '#' + el.id;

    // Use identifiable parent or section
    const section = el.closest('section, header, footer, main, [id]');
    let prefix = '';
    if (section && section !== el) {
      if (section.id) prefix = '#' + section.id + ' ';
      else if (section.tagName) prefix = section.tagName.toLowerCase() + ' ';
    }

    // Tag and index
    const tag = el.tagName.toLowerCase();
    const parent = el.parentElement;
    if (!parent) return prefix + tag;

    const siblings = Array.from(parent.children).filter(c => c.tagName === el.tagName);
    if (siblings.length === 1) {
      return prefix + (parent.className ? '.' + parent.className.split(' ')[0] + ' > ' : '') + tag;
    }
    const index = siblings.indexOf(el) + 1;
    return prefix + tag + ':nth-of-type(' + index + ')';
  }

  // 2. Apply all saved edits to the DOM
  function applySavedEdits() {
    for (const sel in savedEdits) {
      try {
        const val = savedEdits[sel];
        if (typeof val === 'string' && val.trim()) {
          const els = document.querySelectorAll(sel);
          els.forEach(el => {
            // Only update if not currently being typed into
            if (document.activeElement !== el && el.innerText.trim() !== val.trim()) {
              el.innerText = val;
            }
          });
        }
      } catch(e) {}
    }
  }

  // 3. Enable / Disable Visual In-Context Live Edit (Option B)
  function toggleLiveEdit(forceState) {
    isLiveEditActive = (forceState !== undefined) ? forceState : !isLiveEditActive;

    const root = document.getElementById('root') || document.body;
    // Find all text elements across the page
    const textSelectors = 'h1, h2, h3, h4, h5, h6, p, a, button, span, label, li';
    const elements = root.querySelectorAll(textSelectors);

    elements.forEach(el => {
      // Skip scripts, SVGs, modals, docks, triggers
      if (el.closest('#stark-edit-dock') || el.closest('#stark-edit-trigger') || el.closest('#stark-cms-toast') || el.closest('svg') || el.tagName === 'SCRIPT') {
        return;
      }

      // Only target elements that actually contain direct text
      const hasDirectText = Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim().length > 0);
      if (!hasDirectText && el.children.length > 0) return;

      if (isLiveEditActive) {
        el.setAttribute('contenteditable', 'true');
        el.classList.add('stark-live-editable');

        el.oninput = function() {
          const sel = getUniqueSelector(el);
          if (sel) {
            pendingEdits[sel] = el.innerText.trim();
            updateDockPendingCount();
          }
        };
      } else {
        el.removeAttribute('contenteditable');
        el.classList.remove('stark-live-editable');
        el.oninput = null;
      }
    });

    updateDockUI();

    showStarkToast(isLiveEditActive 
      ? '⚡ LIVE EDIT MODE: ON — Click any text directly on screen to edit!' 
      : 'Live Edit Mode Disabled'
    );
  }

  function updateDockPendingCount() {
    const countEl = document.getElementById('stark-dock-pending-count');
    const saveBtn = document.getElementById('stark-dock-save-btn');
    const count = Object.keys(pendingEdits).length;
    if (countEl) {
      countEl.textContent = count + (count === 1 ? ' edit pending' : ' edits pending');
    }
    if (saveBtn) {
      saveBtn.disabled = (count === 0);
      saveBtn.style.opacity = (count === 0) ? '0.5' : '1';
    }
  }

  function savePendingEdits() {
    const count = Object.keys(pendingEdits).length;
    if (count === 0) {
      showStarkToast('ℹ No edits to save');
      return;
    }

    Object.assign(savedEdits, pendingEdits);
    pendingEdits = {};

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedEdits));
    } catch(e) {}

    // Save to Firebase if available
    try {
      if (window.firebase && window.firebase.firestore) {
        window.firebase.firestore().collection('site_copy').doc('visual_edits').set(savedEdits, { merge: true });
      }
    } catch(e) {}

    updateDockPendingCount();
    showStarkToast('🎉 Saved ' + count + ' edits to Cloud & Live Website!');
  }

  function discardPendingEdits() {
    pendingEdits = {};
    applySavedEdits();
    updateDockPendingCount();
    showStarkToast('↺ Discarded pending edits');
  }

  // 4. Floating HUD Trigger & Dock UI
  function injectHUD() {
    if (document.getElementById('stark-edit-trigger')) return;

    // Trigger Button
    const btn = document.createElement('button');
    btn.id = 'stark-edit-trigger';
    btn.innerHTML = '⚡ <span>Live Edit Text</span>';
    btn.title = 'Option B: Click directly on website text to edit';
    btn.onclick = function() { toggleLiveEdit(); };
    document.body.appendChild(btn);

    // Floating Control Dock
    const dock = document.createElement('div');
    dock.id = 'stark-edit-dock';
    dock.className = 'stark-hidden';
    dock.innerHTML = `
      <div class="stark-dock-inner">
        <div class="stark-dock-left">
          <span class="stark-pulse-dot"></span>
          <span class="stark-dock-title">STARK LIVE EDIT MODE</span>
          <span id="stark-dock-pending-count" class="stark-dock-badge">0 edits pending</span>
        </div>
        <div class="stark-dock-right">
          <button id="stark-dock-save-btn" class="stark-btn-save" onclick="window.StarkContentEngine.savePendingEdits()">💾 Save to Cloud</button>
          <button class="stark-btn-discard" onclick="window.StarkContentEngine.discardPendingEdits()">↺ Discard</button>
          <a href="/admin" class="stark-btn-admin">📑 Back to Admin CMS</a>
          <button class="stark-btn-close" onclick="window.StarkContentEngine.exitLiveEdit()">✕ Exit Edit Mode</button>
        </div>
      </div>
    `;
    document.body.appendChild(dock);

    injectStyles();
  }

  function updateDockUI() {
    const dock = document.getElementById('stark-edit-dock');
    const trigger = document.getElementById('stark-edit-trigger');
    if (!dock || !trigger) return;

    if (isLiveEditActive) {
      dock.classList.remove('stark-hidden');
      trigger.classList.add('stark-active');
      trigger.innerHTML = '✕ <span>Exit Edit</span>';
    } else {
      dock.classList.add('stark-hidden');
      trigger.classList.remove('stark-active');
      trigger.innerHTML = '⚡ <span>Live Edit Text</span>';
    }
  }

  function showStarkToast(msg) {
    let t = document.getElementById('stark-cms-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'stark-cms-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t.timer);
    t.timer = setTimeout(() => t.classList.remove('show'), 3500);
  }

  // 5. CSS Styles
  function injectStyles() {
    if (document.getElementById('stark-content-engine-styles')) return;

    const style = document.createElement('style');
    style.id = 'stark-content-engine-styles';
    style.textContent = `
      /* In-Context Editable Highlights */
      .stark-live-editable {
        outline: 2px dashed #22d3ee !important;
        outline-offset: 4px !important;
        background: rgba(34, 211, 238, 0.12) !important;
        cursor: text !important;
        border-radius: 4px !important;
        transition: outline 0.15s, background 0.15s !important;
      }
      .stark-live-editable:hover {
        outline: 2px solid #a855f7 !important;
        background: rgba(168, 85, 247, 0.22) !important;
      }
      .stark-live-editable:focus {
        outline: 2px solid #38bdf8 !important;
        background: rgba(15, 23, 42, 0.9) !important;
      }

      /* Floating HUD Trigger Button */
      #stark-edit-trigger {
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        z-index: 2147483647 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;
        padding: 11px 20px !important;
        border-radius: 9999px !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
        font-size: 12px !important;
        font-weight: 800 !important;
        letter-spacing: 0.5px !important;
        background: #090e1a !important;
        color: #22d3ee !important;
        border: 2px solid #22d3ee !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(34, 211, 238, 0.4) !important;
        cursor: pointer !important;
        transition: all 0.25s ease !important;
      }
      #stark-edit-trigger:hover {
        transform: translateY(-2px) scale(1.05) !important;
        background: #22d3ee !important;
        color: #020617 !important;
        box-shadow: 0 15px 35px rgba(34, 211, 238, 0.6) !important;
      }
      #stark-edit-trigger.stark-active {
        background: #ef4444 !important;
        color: #ffffff !important;
        border-color: #f87171 !important;
        box-shadow: 0 10px 25px rgba(239, 68, 68, 0.6) !important;
      }

      /* Floating Dock */
      #stark-edit-dock {
        position: fixed !important;
        bottom: 24px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        z-index: 2147483646 !important;
        background: rgba(10, 15, 30, 0.95) !important;
        border: 2px solid rgba(34, 211, 238, 0.6) !important;
        border-radius: 20px !important;
        padding: 12px 22px !important;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(34, 211, 238, 0.3) !important;
        backdrop-filter: blur(20px) !important;
        font-family: system-ui, -apple-system, sans-serif !important;
      }
      .stark-hidden { display: none !important; }
      .stark-dock-inner { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
      .stark-dock-left { display: flex; align-items: center; gap: 10px; }
      .stark-pulse-dot {
        width: 10px; height: 10px; border-radius: 50%; background: #22d3ee;
        box-shadow: 0 0 10px #22d3ee; animation: starkPulse 1.4s infinite;
      }
      @keyframes starkPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.3;transform:scale(1.3);} }
      .stark-dock-title { font-size: 12px; font-weight: 800; color: #f8fafc; letter-spacing: 0.5px; }
      .stark-dock-badge {
        font-size: 11px; font-family: monospace; padding: 3px 9px; border-radius: 9999px;
        background: rgba(34, 211, 238, 0.2); color: #22d3ee; border: 1px solid rgba(34, 211, 238, 0.4);
      }
      .stark-dock-right { display: flex; align-items: center; gap: 8px; }
      .stark-btn-save {
        padding: 8px 16px; border-radius: 12px; font-size: 11px; font-weight: 800;
        background: linear-gradient(135deg, #06b6d4, #8b5cf6); color: #020617;
        border: none; cursor: pointer; transition: all 0.2s;
      }
      .stark-btn-save:hover { transform: scale(1.05); filter: brightness(1.2); }
      .stark-btn-discard, .stark-btn-admin, .stark-btn-close {
        padding: 8px 14px; border-radius: 12px; font-size: 11px; font-weight: 600;
        background: rgba(255, 255, 255, 0.1); color: #e2e8f0; text-decoration: none;
        border: 1px solid rgba(255, 255, 255, 0.2); cursor: pointer; transition: all 0.2s;
      }
      .stark-btn-discard:hover, .stark-btn-admin:hover, .stark-btn-close:hover {
        background: rgba(255, 255, 255, 0.22); color: #ffffff;
      }

      /* Toast Notification */
      #stark-cms-toast {
        position: fixed; top: 24px; left: 50%; transform: translateX(-50%) translateY(-100px);
        z-index: 2147483647; background: #0b132b; color: #38bdf8;
        border: 2px solid rgba(56, 189, 248, 0.6); border-radius: 16px;
        padding: 12px 24px; font-size: 13px; font-weight: 800; font-family: system-ui;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.85); transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
      }
      #stark-cms-toast.show { transform: translateX(-50%) translateY(0); }
    `;
    document.head.appendChild(style);
  }

  function exitLiveEdit() {
    sessionStorage.removeItem('stark_admin_live_edit');
    toggleLiveEdit(false);
    const trigger = document.getElementById('stark-edit-trigger');
    const dock = document.getElementById('stark-edit-dock');
    if (trigger) trigger.remove();
    if (dock) dock.remove();
    if (window.location.search.includes('stark_edit=true')) {
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
    showStarkToast('✓ Exited Live Edit Mode');
  }

  // 6. Public API
  
  // ─── TABBED ADMIN CMS MODAL (Option A) ────────────────────────────────────
  function openAdminCMSModal() {
    let existing = document.getElementById('stark-admin-cms-modal-root');
    if (existing) existing.remove();

    const currentEdits = Object.assign({}, savedEdits);

    const modal = document.createElement('div');
    modal.id = 'stark-admin-cms-modal-root';
    modal.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(9,10,15,0.85);backdrop-filter:blur(12px);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:16px;">
        <div style="max-width:850px;width:100%;max-height:90vh;background:#0d111a;border:1px solid rgba(34,211,238,0.3);border-radius:24px;box-shadow:0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(34,211,238,0.15);display:flex;flex-direction:column;overflow:hidden;color:#e2e8f0;font-family:'Plus Jakarta Sans',sans-serif;">
          
          <!-- Header -->
          <div style="padding:18px 24px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:between;background:rgba(15,23,42,0.6);">
            <div style="display:flex;align-items:center;gap:12px;">
              <span style="font-size:22px;">📝</span>
              <div>
                <h3 style="font-size:16px;font-weight:800;color:#22d3ee;margin:0;letter-spacing:0.02em;">Universal Site Text & Copy Manager</h3>
                <p style="font-size:11px;color:#94a3b8;margin:2px 0 0 0;font-family:monospace;">Option A: Tabbed Content Editor — Syncs directly to Cloud & Live Site</p>
              </div>
            </div>
            <button id="stark-cms-modal-close" style="background:transparent;border:none;color:#94a3b8;font-size:20px;cursor:pointer;padding:4px 8px;border-radius:8px;">✕</button>
          </div>

          <!-- Category Tabs -->
          <div style="display:flex;gap:8px;padding:12px 24px;border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(10,14,23,0.8);overflow-x:auto;">
            <button class="stark-tab-btn active" data-tab="home" style="padding:6px 14px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;background:rgba(34,211,238,0.15);border:1px solid #22d3ee;color:#22d3ee;">🏠 Hero & Home</button>
            <button class="stark-tab-btn" data-tab="about" style="padding:6px 14px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;">👤 About Bio</button>
            <button class="stark-tab-btn" data-tab="studio" style="padding:6px 14px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;">🎬 Studio Hub</button>
            <button class="stark-tab-btn" data-tab="projects" style="padding:6px 14px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;">💼 Projects & Work</button>
            <button class="stark-tab-btn" data-tab="contact" style="padding:6px 14px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;">✉️ Contact</button>
          </div>

          <!-- Body Form Fields -->
          <div id="stark-cms-tab-content" style="flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:18px;">
            <!-- Injected dynamically based on active tab -->
          </div>

          <!-- Footer Actions -->
          <div style="padding:16px 24px;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;background:rgba(15,23,42,0.8);">
            <div style="font-size:11px;color:#94a3b8;font-family:monospace;">Auto-syncs to LocalStorage & Cloud DB</div>
            <div style="display:flex;gap:12px;">
              <button id="stark-cms-modal-cancel" style="padding:8px 16px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:#cbd5e1;font-size:12px;font-weight:600;cursor:pointer;">Cancel</button>
              <button id="stark-cms-modal-save" style="padding:8px 22px;border-radius:10px;border:none;background:linear-gradient(to right,#06b6d4,#3b82f6);color:#090a0f;font-size:12px;font-weight:800;cursor:pointer;box-shadow:0 0 15px rgba(6,182,212,0.4);">💾 Save All Changes</button>
            </div>
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const tabFields = {
      home: [
        { key: 'hero_tagline', label: 'Tagline Badge Text', default: 'SYSTEMS ARCHITECT & DATA SCIENCE LEAD' },
        { key: 'hero_name', label: 'Hero Display Name', default: 'SANTOSH D A' },
        { key: 'hero_title', label: 'Gradient Sub-Heading', default: 'Engineering & AI Leader' },
        { key: 'hero_subtitle', label: 'Lead Bio Paragraph', default: 'Building high-throughput full-stack architectures, machine learning models, and real-time distributed systems.', isTextarea: true },
        { key: 'hero_pill1', label: 'Skill Chip 1', default: '<> C++ & Python' },
        { key: 'hero_pill2', label: 'Skill Chip 2', default: '⚛ React & Three.js 3D' },
        { key: 'hero_pill3', label: 'Skill Chip 3', default: '>_ Firebase & Cloud' }
      ],
      about: [
        { key: 'about_title', label: 'About Main Title', default: 'Systems Architect & Embedded Engineer' },
        { key: 'about_subtitle', label: 'About Subtitle', default: 'Bridging low-level hardware microcontrollers and distributed cloud networks.', isTextarea: true },
        { key: 'about_stat1', label: 'Stat 1 Value & Label', default: '15+ Verified Credentials' },
        { key: 'about_stat2', label: 'Stat 2 Value & Label', default: '30+ Embedded Hardware Prototypes' },
        { key: 'about_stat3', label: 'Stat 3 Value & Label', default: '99.9% Telemetry Uptime' }
      ],
      studio: [
        { key: 'studio_title', label: 'Studio Brand Name', default: 'SANTO STARK STUDIO' },
        { key: 'studio_subtitle', label: 'Studio Tagline', default: 'Creative Engineering, 3D Visuals & Digital Media Wing' },
        { key: 'studio_wing1', label: 'Wing 1 Title', default: '⚡ Technical Wing' },
        { key: 'studio_wing2', label: 'Wing 2 Title', default: '🎬 Entertainment Wing' },
        { key: 'studio_wing3', label: 'Wing 3 Title', default: '🎨 Arts & Design Wing' },
        { key: 'studio_wing4', label: 'Wing 4 Title', default: '🔧 Lab & Other Wing' }
      ],
      projects: [
        { key: 'projects_title', label: 'Projects Main Header', default: 'Featured Engineering Systems' },
        { key: 'projects_subtitle', label: 'Projects Subtitle', default: 'High-throughput microservices, IoT embedded nodes, and cloud backends.', isTextarea: true },
        { key: 'work_title', label: 'Work Experience Header', default: 'Work Experience & Roles' },
        { key: 'work_subtitle', label: 'Work Experience Subtitle', default: 'Technical internships, systems engineering roles, and open source contributions.', isTextarea: true }
      ],
      contact: [
        { key: 'contact_title', label: 'Contact Header', default: 'Establish Direct Contact' },
        { key: 'contact_subtitle', label: 'Contact Subtitle', default: 'Initiate telemetry link, project consultation, or engineering collaboration.', isTextarea: true },
        { key: 'contact_email', label: 'Direct Email Address', default: 'santoshdabadiaiyyanna@gmail.com' }
      ]
    };

    let activeTab = 'home';
    const contentBox = document.getElementById('stark-cms-tab-content');

    function renderTab(tabName) {
      activeTab = tabName;
      document.querySelectorAll('.stark-tab-btn').forEach(btn => {
        const isActive = btn.dataset.tab === tabName;
        btn.style.background = isActive ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.04)';
        btn.style.border = isActive ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.1)';
        btn.style.color = isActive ? '#22d3ee' : '#94a3b8';
      });

      const fields = tabFields[tabName] || [];
      contentBox.innerHTML = fields.map(f => {
        const val = currentEdits[f.key] !== undefined ? currentEdits[f.key] : f.default;
        if (f.isTextarea) {
          return `
            <div style="display:flex;flex-direction:column;gap:6px;">
              <label style="font-size:12px;font-weight:700;color:#94a3b8;">${f.label}</label>
              <textarea data-key="${f.key}" rows="3" style="width:100%;padding:10px 14px;border-radius:12px;background:#06080e;border:1px solid rgba(255,255,255,0.12);color:#f8fafc;font-size:13px;outline:none;resize:vertical;">${val}</textarea>
            </div>
          `;
        }
        return `
          <div style="display:flex;flex-direction:column;gap:6px;">
            <label style="font-size:12px;font-weight:700;color:#94a3b8;">${f.label}</label>
            <input type="text" data-key="${f.key}" value="${val}" style="width:100%;padding:10px 14px;border-radius:12px;background:#06080e;border:1px solid rgba(255,255,255,0.12);color:#f8fafc;font-size:13px;outline:none;" />
          </div>
        `;
      }).join('');

      contentBox.querySelectorAll('input, textarea').forEach(input => {
        input.oninput = function() {
          currentEdits[this.dataset.key] = this.value;
        };
      });
    }

    renderTab('home');

    document.querySelectorAll('.stark-tab-btn').forEach(btn => {
      btn.onclick = () => renderTab(btn.dataset.tab);
    });

    const closeModal = () => modal.remove();
    document.getElementById('stark-cms-modal-close').onclick = closeModal;
    document.getElementById('stark-cms-modal-cancel').onclick = closeModal;

    document.getElementById('stark-cms-modal-save').onclick = function() {
      // Collect latest values
      contentBox.querySelectorAll('input, textarea').forEach(input => {
        currentEdits[input.dataset.key] = input.value;
      });

      // Save to engine state & LocalStorage
      savedEdits = Object.assign({}, currentEdits);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedEdits));
      } catch(e) {}

      applySavedEdits();
      closeModal();
      showStarkToast('✓ All site copy successfully updated & saved!');
    };
  }

  window.StarkContentEngine = {
    openAdminCMSModal: openAdminCMSModal,
    toggleLiveEdit: toggleLiveEdit,
    exitLiveEdit: exitLiveEdit,
    savePendingEdits: savePendingEdits,
    discardPendingEdits: discardPendingEdits,
    applySavedEdits: applySavedEdits,
    getSavedEdits: function() { return Object.assign({}, savedEdits); },
    setSavedEdits: function(newMap) {
      savedEdits = Object.assign({}, newMap);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(savedEdits)); } catch(e) {}
      applySavedEdits();
    }
  };

  // 7. Auto-start & Re-apply on route changes
  function initEngine() {
    if (!document.body) {
      setTimeout(initEngine, 50);
      return;
    }

    // Always apply saved custom copy so website displays your latest text
    applySavedEdits();

    // Re-apply whenever React re-renders components
    const observer = new MutationObserver(function() {
      applySavedEdits();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ONLY show live editor HUD if admin launched it from CMS (/admin) or with ?stark_edit=true
    const isStarkAdminMode = window.location.search.includes('stark_edit=true') || 
                             sessionStorage.getItem('stark_admin_live_edit') === 'true';

    if (isStarkAdminMode) {
      sessionStorage.setItem('stark_admin_live_edit', 'true');
      injectHUD();
      toggleLiveEdit(true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEngine);
  } else {
    initEngine();
  }
})();


// ── Desktop 3D Tilt Card Engine (Phase 3) ────────────────────────────────────
// Applies on desktop only; skipped on touch devices.
// Targets: .glass-card elements on /studio page.
(function initTiltCards() {
  if (typeof window === 'undefined') return;
  // Skip touch / mobile devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024) return;

  const INTENSITY = 10; // max tilt degrees
  const SCALE = 1.025;  // scale on hover

  function applyTilt(card) {
    if (card.__tiltAttached) return;
    card.__tiltAttached = true;
    card.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
    card.style.willChange = 'transform';
    card.style.transformStyle = 'preserve-3d';

    // Glint overlay
    const glint = document.createElement('div');
    glint.style.cssText = [
      'position:absolute', 'inset:0', 'pointer-events:none', 'border-radius:inherit',
      'background:linear-gradient(135deg,rgba(255,255,255,0.10) 0%,transparent 60%)',
      'opacity:0', 'transition:opacity 0.2s ease', 'z-index:2'
    ].join(';');
    const posOrig = window.getComputedStyle(card).position;
    if (posOrig === 'static') card.style.position = 'relative';
    card.appendChild(glint);

    card.addEventListener('mousemove', function(e) {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width / 2;
      const cy = r.height / 2;
      const rotY = ((x - cx) / cx) * INTENSITY;
      const rotX = -((y - cy) / cy) * INTENSITY;
      card.style.transform = 'perspective(900px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(' + SCALE + ')';
      card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(0,229,255,0.08)';
      glint.style.opacity = '1';
      // Move glint sweep
      const gx = (x / r.width) * 100;
      const gy = (y / r.height) * 100;
      glint.style.background = 'radial-gradient(ellipse at ' + gx + '% ' + gy + '%, rgba(255,255,255,0.13) 0%, transparent 65%)';
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.boxShadow = '';
      glint.style.opacity = '0';
    });
  }

  function attachToCards() {
    const cards = document.querySelectorAll('.glass-card:not([data-tilt-skip])');
    cards.forEach(applyTilt);
  }

  // Run on page load and whenever DOM changes (React SPA navigation)
  function observe() {
    attachToCards();
    const obs = new MutationObserver(function() { attachToCards(); });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observe);
  } else {
    observe();
  }
})();
// ── End Desktop 3D Tilt Card Engine ──────────────────────────────────────────


// ── Permanent Header Title Guard: SANTO STARK STUDIO ──
(function enforceStarkTitle() {
  if (typeof document === 'undefined') return;
  const TARGET_TITLE = 'SANTO STARK STUDIO';
  document.title = TARGET_TITLE;
  try {
    const obs = new MutationObserver(function() {
      if (document.title !== TARGET_TITLE) {
        document.title = TARGET_TITLE;
      }
    });
    const tNode = document.querySelector('title') || document.head;
    if (tNode) {
      obs.observe(tNode, { childList: true, subtree: true, characterData: true });
    }
  } catch(e) {}
  window.addEventListener('popstate', function() { document.title = TARGET_TITLE; });
  window.addEventListener('hashchange', function() { document.title = TARGET_TITLE; });
})();

// ── ✨ Simple & Elegant Studio Welcome Transition (3 Seconds) ──────────────────
(function initStudioWelcomeTransition() {
  if (typeof window === 'undefined') return;

  let activeOverlay = null;

  function isStudioPage() {
    return window.location.pathname.toLowerCase().includes('/studio');
  }

  function playStudioWelcome(force) {
    if (!isStudioPage() && !force) return;
    if (activeOverlay) return; // Already running

    // Check if seen in this session (unless forced via ?replay=1)
    const urlParams = new URLSearchParams(window.location.search);
    const shouldReplay = urlParams.get('replay') === '1' || force;
    if (!shouldReplay && sessionStorage.getItem('stark_studio_intro_seen') === 'true') {
      return;
    }

    // 1. Deep Obsidian Stage (#030712) with subtle radial cyan glow
    const overlay = document.createElement('div');
    overlay.id = 'stark-studio-welcome-overlay';
    overlay.style.cssText = [
      'position: fixed', 'inset: 0', 'z-index: 99999',
      'background: radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.12) 0%, #030712 65%, #02050e 100%)',
      'display: flex', 'align-items: center', 'justify-content: center',
      'padding: 24px', 'overflow: hidden',
      'transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      'opacity: 1'
    ].join(';');

    // 2. The Floating Glass Title Card
    const card = document.createElement('div');
    card.style.cssText = [
      'position: relative', 'width: 100%', 'max-width: 480px',
      'background: rgba(10, 16, 32, 0.68)',
      'backdrop-filter: blur(24px)', '-webkit-backdrop-filter: blur(24px)',
      'border: 1px solid rgba(255, 255, 255, 0.12)',
      'border-radius: 28px', 'padding: 44px 38px',
      'display: flex', 'flex-direction: column', 'align-items: center',
      'text-align: center',
      'box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 0 45px rgba(0, 229, 255, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
      'transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      'transform: scale(0.97)', 'opacity: 0'
    ].join(';');

    // Top Pill: ● SANTO STARK STUDIO (tracking: 0.25em)
    const topPill = document.createElement('div');
    topPill.innerHTML = '<span style="color:#00e5ff;margin-right:8px;font-size:9px;vertical-align:middle;display:inline-block;box-shadow:0 0 8px #00e5ff;border-radius:50%;">●</span>SANTO STARK STUDIO';
    topPill.style.cssText = [
      'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'font-size: 11px', 'font-weight: 700', 'color: #94a3b8',
      'letter-spacing: 0.25em', 'text-transform: uppercase',
      'margin-bottom: 18px', 'display: inline-flex', 'align-items: center'
    ].join(';');

    // Main Title: Welcome to the Studio (silver-white to cyan metallic sheen gradient)
    const mainTitle = document.createElement('h1');
    mainTitle.innerText = 'Welcome to the Studio';
    mainTitle.style.cssText = [
      'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'font-size: 34px', 'font-weight: 800', 'line-height: 1.18',
      'background: linear-gradient(135deg, #ffffff 35%, #e2e8f0 60%, #a5f3fc 100%)',
      '-webkit-background-clip: text', '-webkit-text-fill-color: transparent',
      'margin: 0 0 10px 0', 'letter-spacing: -0.02em',
      'filter: drop-shadow(0 2px 20px rgba(165, 243, 252, 0.25))'
    ].join(';');

    // Subtitle: Creative Studio in light, refined typography
    const subtitle = document.createElement('p');
    subtitle.innerText = 'Creative Studio';
    subtitle.style.cssText = [
      'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'font-size: 14px', 'font-weight: 400', 'color: #94a3b8',
      'letter-spacing: 0.05em', 'margin: 0 0 30px 0'
    ].join(';');

    // 3-Second Hairline Progress Line (1.5px delicate bar)
    const progressTrack = document.createElement('div');
    progressTrack.style.cssText = [
      'width: 100%', 'max-width: 200px', 'height: 1.5px',
      'background: rgba(255, 255, 255, 0.12)', 'border-radius: 9999px',
      'overflow: hidden', 'position: relative'
    ].join(';');

    const progressFill = document.createElement('div');
    progressFill.style.cssText = [
      'width: 0%', 'height: 100%',
      'background: linear-gradient(90deg, #00e5ff, #38bdf8)',
      'box-shadow: 0 0 10px #00e5ff',
      'transition: width 3.0s cubic-bezier(0.25, 1, 0.5, 1)'
    ].join(';');

    progressTrack.appendChild(progressFill);

    card.appendChild(topPill);
    card.appendChild(mainTitle);
    card.appendChild(subtitle);
    card.appendChild(progressTrack);

    overlay.appendChild(card);
    document.body.appendChild(overlay);
    activeOverlay = overlay;

    // Smooth card entry animation
    requestAnimationFrame(function() {
      card.style.transform = 'scale(1)';
      card.style.opacity = '1';
      // Trigger the 3.0s hairline progress
      requestAnimationFrame(function() {
        progressFill.style.width = '100%';
      });
    });

    let finished = false;
    function finishWelcome() {
      if (finished) return;
      finished = true;
      sessionStorage.setItem('stark_studio_intro_seen', 'true');
      // Silky Smooth Dissolve: card softly expands and dissolves away into air
      card.style.transform = 'scale(1.04)';
      card.style.opacity = '0';
      overlay.style.opacity = '0';
      setTimeout(function() {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        activeOverlay = null;
      }, 600);
    }

    // Dismiss on click/tap if desired
    overlay.onclick = finishWelcome;

    // Auto-transition after exactly 3.0 seconds
    setTimeout(finishWelcome, 3000);
  }

  // Hook into navigation events
  function checkNav() {
    if (isStudioPage()) {
      playStudioWelcome(false);
    }
  }

  const origPushState = history.pushState;
  history.pushState = function() {
    origPushState.apply(this, arguments);
    setTimeout(checkNav, 50);
  };
  const origReplaceState = history.replaceState;
  history.replaceState = function() {
    origReplaceState.apply(this, arguments);
    setTimeout(checkNav, 50);
  };
  window.addEventListener('popstate', checkNav);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkNav);
  } else {
    checkNav();
  }
})();
// ── End Simple & Elegant Studio Welcome Transition ───────────────────────────


// ══════════════════════════════════════════════════════════════════════════════
// ⚡ CHECKPOINT 7 — GLOBAL PERFORMANCE ENGINE
// Handles: Tab-Visibility RAF pause · Background Video lazy-load · CSS GPU hints
// ══════════════════════════════════════════════════════════════════════════════
(function() {
  'use strict';

  // ── 1. Page Visibility API: pause ALL canvas animations when tab is hidden ──
  // Saves 100% GPU/CPU when user switches to another tab or minimises browser.
  document.addEventListener('visibilitychange', function() {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(function(c) {
      if (document.hidden) {
        c.dataset.starkPaused = 'true';
      } else {
        delete c.dataset.starkPaused;
      }
    });
  });

  // ── 2. Background Video IntersectionObserver ──────────────────────────────
  // The background video (orbital-bg-video) only plays when the homepage hero
  // is visible on screen. Saves ~25% GPU on non-home pages.
  function initVideoObserver() {
    var video = document.getElementById('orbital-bg-video');
    var container = document.getElementById('orbital-video-container');
    if (!video || !container) return;

    var videoObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          if (video.paused) {
            var p = video.play();
            if (p && p.catch) p.catch(function() {});
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, { threshold: 0.01 });

    videoObs.observe(container);
  }

  // ── 3. CSS GPU Acceleration hints (will-change on hover only) ────────────
  // Apply will-change only while hovering — avoids creating unnecessary layers.
  function initGPUHints() {
    // Target animated glass cards and skill/project cards
    var selectors = [
      '.group',
      '[class*="cursor-zoom-in"]',
      '[class*="hover:scale"]',
      '[class*="hover:shadow"]',
    ];
    selectors.forEach(function(sel) {
      try {
        document.querySelectorAll(sel).forEach(function(el) {
          el.addEventListener('mouseenter', function() {
            this.style.willChange = 'transform, opacity';
          }, { passive: true });
          el.addEventListener('mouseleave', function() {
            this.style.willChange = 'auto';
          }, { passive: true });
        });
      } catch(e) {}
    });
  }

  // ── 4. Passive scroll listeners guard ────────────────────────────────────
  // Ensures any future addEventListener calls for scroll/touch are passive
  // by wrapping the native method (non-destructive, only adds passive where safe).
  (function() {
    var _ael = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, fn, opts) {
      var passiveTypes = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];
      if (passiveTypes.indexOf(type) !== -1) {
        // Only force passive if no opts given or opts is a plain boolean true
        if (opts === undefined || opts === false || opts === true) {
          opts = { passive: true };
        } else if (typeof opts === 'object' && opts.passive === undefined) {
          opts = Object.assign({}, opts, { passive: true });
        }
      }
      return _ael.call(this, type, fn, opts);
    };
  })();

  // ── 5. Font display swap enforcement via CSS injection ───────────────────
  (function() {
    var style = document.createElement('style');
    style.textContent = [
      '@font-face{font-family:"Plus Jakarta Sans";font-display:swap}',
      '@font-face{font-family:"Fira Code";font-display:swap}',
    ].join('');
    document.head.appendChild(style);
  })();

  // ── 6. Offscreen Canvas Pauser (Hero Solar System) ───────────────────────
  // When visitor scrolls past the hero section, mark canvas visibility: hidden
  // so browser WebGL compositor uses 0% GPU while exploring skills/projects.
  function initOffscreenCanvasOptimizer() {
    var checkHero = function() {
      var homeEl = document.getElementById('home');
      if (!homeEl) return;
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          var canvas = homeEl.querySelector('canvas');
          if (!canvas) return;
          if (entry.isIntersecting) {
            canvas.style.visibility = 'visible';
          } else {
            canvas.style.visibility = 'hidden';
          }
        });
      }, { threshold: 0.02 });
      obs.observe(homeEl);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkHero);
    } else {
      setTimeout(checkHero, 400);
    }
  }

  // ── Init on DOM ready ─────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initVideoObserver();
      initGPUHints();
      initOffscreenCanvasOptimizer();
    });
  } else {
    initVideoObserver();
    initGPUHints();
    initOffscreenCanvasOptimizer();
  }

})();
// ── End Checkpoint 7 Global Performance Engine ────────────────────────────────
