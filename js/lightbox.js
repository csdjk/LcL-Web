/* lightbox.js — Full-screen gallery modal */

let lbOpen = false;
let lbCurrentProject = null;
let lbCurrentIndex = 0;

function openLightbox(projectId, index = 0) {
  const project = PORTFOLIO.find(p => p.id === projectId);
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

    if (media.type === 'video') {
      const vid = document.createElement('video');
      vid.src = media.src;
      vid.controls = true;
      vid.autoplay = true;
      vid.muted = false;
      vid.playsInline = true;
      vid.style.maxWidth = '90vw';
      vid.style.maxHeight = '82vh';
      wrap.appendChild(vid);
    } else {
      const img = document.createElement('img');
      img.src = media.src;
      img.alt = media.label || '';
      wrap.appendChild(img);
    }

    if (counter) {
      counter.textContent = `${lbCurrentIndex + 1} / ${lbCurrentProject.gallery.length}`;
    }
    if (titleEl) {
      titleEl.textContent = `${lbCurrentProject.title}${media.label ? ' — ' + media.label : ''}`;
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

function lbNext() {
  if (!lbCurrentProject) return;
  lbCurrentIndex = (lbCurrentIndex + 1) % lbCurrentProject.gallery.length;
  renderLbMedia();
}

function lbPrev() {
  if (!lbCurrentProject) return;
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
