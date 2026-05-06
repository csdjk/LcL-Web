/* lightbox.js — Full-screen gallery modal */

let lbOpen = false;
let lbCurrentProject = null;
let lbCurrentIndex = 0;
let lbZoomItem = null; // single-image zoom state within a compare grid

function openLightbox(projectId, index = 0) {
  const data = typeof PORTFOLIO !== 'undefined' ? PORTFOLIO : [];
  const project = data.find(p => p.id === projectId);
  if (!project || !project.gallery || !project.gallery.length) return;

  lbCurrentProject = project;
  lbCurrentIndex = index;
  lbOpen = true;

  renderLbMedia();

  const lb = document.getElementById('lightbox');
  lb.style.display = 'flex';
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
  } else {
    lb.style.opacity = '1';
  }
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lbOpen) return;
  lbOpen = false;
  lbZoomItem = null;
  const lb = document.getElementById('lightbox');
  if (typeof gsap !== 'undefined') {
    gsap.to(lb, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => { lb.style.display = 'none'; },
    });
  } else {
    lb.style.display = 'none';
  }
  document.body.style.overflow = '';
}

function renderLbMedia() {
  const media = lbCurrentProject.gallery[lbCurrentIndex];
  const wrap  = document.getElementById('lb-media-wrap');
  const counter = document.getElementById('lb-counter');
  const titleEl  = document.getElementById('lb-title');
  if (!wrap) return;

  // Fade out → swap → fade in
  const doSwap = () => {
    wrap.innerHTML = '';
    lbZoomItem = null;

    if (media.type === 'grid') {
      // ── Compare grid ──
      _renderCompareGrid(wrap, media);
      if (counter) counter.textContent = `${lbCurrentIndex + 1} / ${lbCurrentProject.gallery.length}`;
      if (titleEl) titleEl.textContent = `${lbCurrentProject.title}${media.label ? ' — ' + media.label : ''}`;

    } else if (media.type === 'video') {
      const vid = document.createElement('video');
      vid.src = media.src;
      vid.controls = true;
      vid.autoplay = true;
      vid.muted = false;
      vid.playsInline = true;
      vid.style.maxWidth = '90vw';
      vid.style.maxHeight = '82vh';
      wrap.appendChild(vid);
      if (counter) counter.textContent = `${lbCurrentIndex + 1} / ${lbCurrentProject.gallery.length}`;
      if (titleEl) titleEl.textContent = `${lbCurrentProject.title}${media.label ? ' — ' + media.label : ''}`;

    } else {
      const img = document.createElement('img');
      img.src = media.src;
      img.alt = media.label || '';
      wrap.appendChild(img);
      if (counter) counter.textContent = `${lbCurrentIndex + 1} / ${lbCurrentProject.gallery.length}`;
      if (titleEl) titleEl.textContent = `${lbCurrentProject.title}${media.label ? ' — ' + media.label : ''}`;
    }

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(wrap, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' });
    }
  };

  if (typeof gsap !== 'undefined') {
    gsap.to(wrap, { opacity: 0, duration: 0.12, onComplete: doSwap });
  } else {
    doSwap();
  }
}

// ── Render comparison grid ────────────────────────────────
function _renderCompareGrid(wrap, media) {
  const grid = document.createElement('div');
  const count = media.images.length;
  grid.className = 'lb-compare-grid';
  if (count === 2) grid.classList.add('lb-compare-grid--2');
  if (count >= 4) grid.classList.add('lb-compare-grid--4');

  media.images.forEach(imgData => {
    const item = document.createElement('figure');
    item.className = 'lb-compare-item';

    const img = document.createElement('img');
    img.src = imgData.src;
    img.alt = imgData.label || '';
    img.title = '点击放大';
    img.addEventListener('click', () => _lbZoomImage(imgData, media));

    const cap = document.createElement('figcaption');
    cap.className = 'lb-compare-label';
    cap.textContent = imgData.label || '';

    item.appendChild(img);
    item.appendChild(cap);
    grid.appendChild(item);
  });

  wrap.appendChild(grid);
}

// ── Zoom into a single image from a compare grid ──────────
function _lbZoomImage(imgData, gridMedia) {
  lbZoomItem = { imgData, gridMedia };
  const wrap = document.getElementById('lb-media-wrap');
  const titleEl = document.getElementById('lb-title');

  wrap.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.className = 'lb-back-btn';
  backBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg> 返回对比`;
  backBtn.addEventListener('click', () => {
    lbZoomItem = null;
    renderLbMedia();
  });
  wrap.appendChild(backBtn);

  const img = document.createElement('img');
  img.src = imgData.src;
  img.alt = imgData.label || '';
  img.style.maxWidth = '88vw';
  img.style.maxHeight = '78vh';
  wrap.appendChild(img);

  if (titleEl) titleEl.textContent = `${lbCurrentProject.title}${imgData.label ? ' — ' + imgData.label : ''}`;

  if (typeof gsap !== 'undefined') {
    gsap.fromTo(wrap, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' });
  }
}

function lbNext() {
  if (!lbCurrentProject) return;
  lbZoomItem = null;
  lbCurrentIndex = (lbCurrentIndex + 1) % lbCurrentProject.gallery.length;
  renderLbMedia();
}

function lbPrev() {
  if (!lbCurrentProject) return;
  lbZoomItem = null;
  lbCurrentIndex = (lbCurrentIndex - 1 + lbCurrentProject.gallery.length) % lbCurrentProject.gallery.length;
  renderLbMedia();
}

// ── Init after DOM ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const lb    = document.getElementById('lightbox');
  const close = document.getElementById('lb-close');
  const prev  = document.getElementById('lb-prev');
  const next  = document.getElementById('lb-next');

  close?.addEventListener('click', closeLightbox);
  prev?.addEventListener('click', lbPrev);
  next?.addEventListener('click', lbNext);

  // Close on overlay click (not on media)
  lb?.addEventListener('click', e => {
    if (e.target === lb) closeLightbox();
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!lbOpen) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  lbNext();
    if (e.key === 'ArrowLeft')   lbPrev();
  });

  // Touch swipe
  let touchStartX = 0;
  lb?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lb?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) lbNext();
      else lbPrev();
    }
  }, { passive: true });
});
