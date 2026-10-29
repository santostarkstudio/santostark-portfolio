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
  window.StarkContentEngine = {
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
