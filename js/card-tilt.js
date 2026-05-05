/* card-tilt.js — 3D perspective tilt + holographic glare for portfolio cards
   - Mouse-tracked perspective rotation (rotateX / rotateY)
   - Holographic glare overlay that tracks cursor
   - Smooth spring-return on mouse leave
   - MutationObserver handles dynamically injected cards
   - Respects prefers-reduced-motion
*/

(function () {
  'use strict';

  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED_MOTION) return;

  // Skip on touch-only devices (no hover)
  const hasHover = window.matchMedia('(hover: hover)').matches;
  if (!hasHover) return;

  // ── Per-card state (keyed by card element) ──────────────
  const state = new WeakMap();

  function getState(card) {
    if (!state.has(card)) {
      state.set(card, {
        rx: 0, ry: 0,           // current rotation (degrees)
        txRx: 0, txRy: 0,       // target rotation
        raf: null,
        active: false,
      });
    }
    return state.get(card);
  }

  // ── Create and attach a glare element ───────────────────
  function addGlare(card) {
    if (card.querySelector('.card-glare')) return;
    const g = document.createElement('div');
    g.className = 'card-glare';
    g.setAttribute('aria-hidden', 'true');
    card.appendChild(g);
  }

  // ── Apply tilt transform ─────────────────────────────────
  function applyTransform(card, rx, ry, tz) {
    card.style.transform =
      `perspective(900px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) translateZ(${tz}px)`;
  }

  // ── Animation spring loop ────────────────────────────────
  function springLoop(card) {
    const s = getState(card);

    const dx = s.txRx - s.rx;
    const dy = s.txRy - s.ry;

    s.rx += dx * 0.14;
    s.ry += dy * 0.14;

    const tz = s.active ? 14 : 0;

    if (Math.abs(dx) < 0.005 && Math.abs(dy) < 0.005 && !s.active) {
      // Settled — clear residual and stop loop
      s.rx = 0; s.ry = 0;
      applyTransform(card, 0, 0, 0);
      s.raf = null;
      return;
    }

    applyTransform(card, s.rx, s.ry, tz);
    s.raf = requestAnimationFrame(() => springLoop(card));
  }

  // ── Card event handlers ─────────────────────────────────
  function onEnter(e) {
    const card = e.currentTarget;
    const s    = getState(card);
    s.active   = true;
    card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
    if (!s.raf) s.raf = requestAnimationFrame(() => springLoop(card));
  }

  function onMove(e) {
    const card = e.currentTarget;
    const s    = getState(card);
    const rect = card.getBoundingClientRect();

    const x  = e.clientX - rect.left;
    const y  = e.clientY - rect.top;
    const nx = (x / rect.width  - 0.5) * 2;   // −1 … +1
    const ny = (y / rect.height - 0.5) * 2;   // −1 … +1

    // Max tilt: 10 deg horizontal, 8 deg vertical
    s.txRy =  nx * 10;
    s.txRx = -ny * 8;

    // Update glare position
    const glare = card.querySelector('.card-glare');
    if (glare) {
      const gx = (x / rect.width)  * 100;
      const gy = (y / rect.height) * 100;
      // Diagonal rainbow-foil gradient following cursor
      glare.style.background =
        `radial-gradient(circle at ${gx.toFixed(1)}% ${gy.toFixed(1)}%,
          rgba(255,255,255,0.18) 0%,
          rgba(0,212,255,0.10)   30%,
          rgba(123,47,255,0.06)  55%,
          transparent            72%)`;
      glare.style.opacity = '1';
    }
  }

  function onLeave(e) {
    const card = e.currentTarget;
    const s    = getState(card);
    s.active   = false;
    s.txRx     = 0;
    s.txRy     = 0;

    const glare = card.querySelector('.card-glare');
    if (glare) glare.style.opacity = '0';

    card.style.transition = 'box-shadow 0.5s ease, border-color 0.5s ease';

    if (!s.raf) s.raf = requestAnimationFrame(() => springLoop(card));
  }

  // ── Attach tilt to a card ────────────────────────────────
  function initCard(card) {
    if (card._tiltInit) return;
    card._tiltInit = true;

    addGlare(card);

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove',  onMove);
    card.addEventListener('mouseleave', onLeave);
  }

  // ── Init existing cards ──────────────────────────────────
  function initAll() {
    document.querySelectorAll('.portfolio-card').forEach(initCard);
  }

  // ── Watch for dynamically added cards ───────────────────
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.classList.contains('portfolio-card')) {
          initCard(node);
        } else {
          node.querySelectorAll && node.querySelectorAll('.portfolio-card').forEach(initCard);
        }
      });
    });
  });

  // Start observing once the grid container is available
  function startObserver() {
    const grid = document.getElementById('portfolio-grid');
    if (grid) {
      observer.observe(grid, { childList: true, subtree: false });
    } else {
      // Fallback: observe full body
      observer.observe(document.body, { childList: true, subtree: true });
    }
    initAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }

})();
