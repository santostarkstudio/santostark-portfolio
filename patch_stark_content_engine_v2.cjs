'use strict';
const fs   = require('fs');
const path = require('path');

const FILES = [
  path.join(__dirname, 'public', 'assets', 'stark-content-engine.js'),
  path.join(__dirname, 'assets', 'stark-content-engine.js'),
  path.join(__dirname, 'source-code', 'public', 'assets', 'stark-content-engine.js'),
];

const TARGET_START = `  function playStudioWelcome(force) {
    if (!isStudioPage() && !force) return;
    if (activeOverlay) return; // Already running`;

const REPLACEMENT_START = `  function playStudioWelcome(force) {
    if (!isStudioPage() && !force) return;
    // Remove any existing overlay from DOM first to prevent ghosting
    const existing = document.getElementById('stark-studio-welcome-overlay');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
    activeOverlay = null;`;

const TARGET_END = `    // Auto-transition after exactly 3.0 seconds
    setTimeout(finishWelcome, 3000);
  }

  // Hook into navigation events (triggers every time entering Studio from portfolio)`;

const REPLACEMENT_END = `    // Auto-transition after exactly 3.0 seconds
    setTimeout(finishWelcome, 3000);
  }

  // ⚡ Expose global API so React components and router can invoke welcome directly
  window.playStudioWelcome = playStudioWelcome;
  window.dismissStudioWelcome = function() {
    const existing = document.getElementById('stark-studio-welcome-overlay');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
    activeOverlay = null;
  };

  // Hook into navigation events (triggers every time entering Studio from portfolio)`;

FILES.forEach(function(f) {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');

  if (c.includes(TARGET_START)) {
    c = c.replace(TARGET_START, REPLACEMENT_START);
    console.log('✅ Patched start in', path.basename(f));
  } else {
    console.log('⚠ Target start not found in', path.basename(f));
  }

  if (c.includes(TARGET_END)) {
    c = c.replace(TARGET_END, REPLACEMENT_END);
    console.log('✅ Patched end in', path.basename(f));
  } else {
    console.log('⚠ Target end not found in', path.basename(f));
  }

  fs.writeFileSync(f, c, 'utf8');
});

console.log('Done stark-content-engine update.');

