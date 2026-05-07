/* card-tilt.js — 3D perspective tilt + rainbow reflective border for portfolio cards
   - Mouse-tracked perspective rotation (rotateX / rotateY)
   - Rainbow border: CSS --p-hue variable shifts with mouse X position
   - Smooth spring-return on mouse leave
   - MutationObserver handles dynamically injected cards
   - Respects prefers-reduced-motion
*/

(function () {
  'use strict';

  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED_MOTION) return;

  const hasHover = window.matchMedia('(hover: hover)').matches;
  if (!hasHover) return;

  const state = new WeakMap();

  function getState(card) {
    if (!state.has(card)) {
      state.set(card, { rx: 0, ry: 0, txRx: 0, txRy: 0, raf: null, active: false });
    }
    return state.get(card);
  }

  function applyTransform(card, rx, ry, tz) {
    card.style.transform =
      `perspective(900px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) translateZ(${tz}px)`;
  }

  function springLoop(card) {
    const s = getState(card);
    const dx = s.txRx - s.rx;
    const dy = s.txRy - s.ry;
    s.rx += dx * 0.14;
    s.ry += dy * 0.14;
    const tz = s.active ? 14 : 0;
    if (Math.abs(dx) < 0.005 && Math.abs(dy) < 0.005 && !s.active) {
      s.rx = 0; s.ry = 0;
      applyTransform(card, 0, 0, 0);
      s.raf = null;
      return;
    }
    applyTransform(card, s.rx, s.ry, tz);
    s.raf = requestAnimationFrame(() => springLoop(card));
  }

  function onEnter(e) {
    const card = e.currentTarget;
    const s = getState(card);
    s.active = true;
    card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
    if (!s.raf) s.raf = requestAnimationFrame(() => springLoop(card));
  }

  function onMove(e) {
    const card = e.currentTarget;
    const s = getState(card);
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const nx = (x / rect.width  - 0.5) * 2;
    const ny = (y / rect.height - 0.5) * 2;

    s.txRy =  nx * 10;
    s.txRx = -ny * 8;
  }

  function onLeave(e) {
    const card = e.currentTarget;
    const s = getState(card);
    s.active = false;
    s.txRx = 0;
    s.txRy = 0;
    card.style.transition = 'box-shadow 0.5s ease, border-color 0.5s ease';
    if (!s.raf) s.raf = requestAnimationFrame(() => springLoop(card));
  }

  function initCard(card) {
    if (card._tiltInit) return;
    card._tiltInit = true;
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove',  onMove);
    card.addEventListener('mouseleave', onLeave);
  }

  function initAll() {
    document.querySelectorAll('.portfolio-card').forEach(initCard);
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.classList.contains('portfolio-card')) initCard(node);
        else node.querySelectorAll && node.querySelectorAll('.portfolio-card').forEach(initCard);
      });
    });
  });

  function startObserver() {
    const grid = document.getElementById('portfolio-grid');
    if (grid) observer.observe(grid, { childList: true, subtree: false });
    else observer.observe(document.body, { childList: true, subtree: true });
    initAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }
})();


