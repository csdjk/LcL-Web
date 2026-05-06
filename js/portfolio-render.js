/* portfolio-render.js — Build DOM cards from PORTFOLIO data */

const LINK_ICONS = {
  github:  `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
  globe:   `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  video:   `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  article: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  external:`<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 0 2 2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
};

const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;

// ── Image lazy-load observer ──────────────────────────────
const imgObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (!isIntersecting) return;
    if (target.dataset.src) {
      target.src = target.dataset.src;
      target.removeAttribute('data-src');
    }
    obs.unobserve(target);
  });
}, { rootMargin: '300px 0px' });

// ── Build a single card ───────────────────────────────────
function buildCard(project) {
  const card = document.createElement('article');
  card.className = `portfolio-card card--${project.size}`;
  card.dataset.category = project.category;
  if (project.subCategory) card.dataset.subCategory = project.subCategory;

  // ── Media section ──
  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'card__media-wrap';

  const gallery = project.gallery || [];
  const firstItem = gallery[0];
  const hasVideo = project.primaryVideo || firstItem?.type === 'video';

  // Collect images (for mosaic) and all media (for viewer)
  const allImages = [];
  const allMedia  = [];
  gallery.forEach(item => {
    if (item.type === 'image') {
      allImages.push(item);
      allMedia.push({ type: 'image', src: item.src, label: item.label });
    } else if (item.type === 'video') {
      allMedia.push({ type: 'video', src: item.src, label: item.label });
    } else if (item.type === 'compare') {
      // Use before image as mosaic preview
      if (item.before?.src) allImages.push({ src: item.before.src, label: item.label });
      allMedia.push({ type: 'compare', label: item.label, before: item.before, after: item.after });
    } else if (item.type === 'grid') {
      item.images?.forEach(img => {
        allImages.push(img);
        allMedia.push({ type: 'image', src: img.src, label: img.label });
      });
    }
  });
  // primaryVideo: insert at front if not already included
  if (project.primaryVideo && !allMedia.find(m => m.src === project.primaryVideo)) {
    allMedia.unshift({ type: 'video', src: project.primaryVideo, label: project.title });
  }
  // Fallback: cover as last resort
  if (allMedia.length === 0 && project.cover) {
    allMedia.push({ type: 'image', src: project.cover, label: project.title });
  }

  // Find first compare item for card preview
  const firstCompare = !hasVideo && gallery.find(item => item.type === 'compare');

  if (hasVideo) {
    // ── Video card ──
    const videoSrc = project.primaryVideo || firstItem.src;
    const vid = document.createElement('video');
    vid.src = videoSrc;
    vid.muted = true;
    vid.loop = true;
    vid.playsInline = true;
    vid.preload = 'metadata';
    mediaWrap.appendChild(vid);

    const playDiv = document.createElement('div');
    playDiv.className = 'play-icon';
    playDiv.innerHTML = PLAY_ICON;
    mediaWrap.appendChild(playDiv);

    card.addEventListener('mouseenter', () => vid.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });

  } else if (firstCompare) {
    // ── Compare slider on card ──
    card.classList.add('card--compare');
    mediaWrap.appendChild(buildCompareSlider(firstCompare));

  } else if (allImages.length > 1) {
    // ── Mosaic grid for multi-image projects ──
    const mosaicDiv = document.createElement('div');
    mosaicDiv.className = 'card__mosaic';
    const previewImgs = allImages.slice(0, 4);
    mosaicDiv.dataset.count = previewImgs.length;   // drive grid rows via CSS
    previewImgs.forEach((imgData, idx) => {
      const img = document.createElement('img');
      img.alt = imgData.label || '';
      img.dataset.src = imgData.src;
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      if (previewImgs.length === 3 && idx === 2) img.classList.add('img--span');
      imgObserver.observe(img);
      mosaicDiv.appendChild(img);
    });
    if (allImages.length > 4) {
      const badge = document.createElement('div');
      badge.className = 'card__mosaic-badge';
      badge.textContent = `+${allImages.length - 4}`;
      mosaicDiv.appendChild(badge);
    }
    mediaWrap.appendChild(mosaicDiv);

  } else if (project.cover) {
    // ── Single image card ──
    const img = document.createElement('img');
    img.alt = project.title;
    img.dataset.src = project.cover;
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    imgObserver.observe(img);
    mediaWrap.appendChild(img);

  } else {
    const ph = document.createElement('div');
    ph.className = 'card__media-placeholder';
    ph.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
    mediaWrap.appendChild(ph);
  }

  const overlay = document.createElement('div');
  overlay.className = 'card__media-overlay';
  mediaWrap.appendChild(overlay);

  // Live Demo badge (always visible)
  if (project.webDemo) {
    const liveBtn = document.createElement('a');
    liveBtn.className = 'card__live-btn';
    liveBtn.href = project.webDemo;
    liveBtn.target = '_blank';
    liveBtn.rel = 'noopener noreferrer';
    liveBtn.textContent = 'LIVE DEMO';
    liveBtn.addEventListener('click', e => e.stopPropagation());
    mediaWrap.appendChild(liveBtn);
  }

  // ── Body ──
  const body = document.createElement('div');
  body.className = 'card__body';

  // Tags row
  const tagsRow = document.createElement('div');
  tagsRow.className = 'card__tags-row';
  tagsRow.innerHTML = `<span class="tag tag--category">${project.categoryLabel}</span>` +
    (project.featured ? `<span class="tag tag--featured">FEATURED</span>` : '');

  // Title + desc
  const title = document.createElement('h3');
  title.className = 'card__title';
  title.textContent = project.title;

  const desc = document.createElement('p');
  desc.className = 'card__desc';
  desc.textContent = project.desc;

  // Tech tags
  const techRow = document.createElement('div');
  techRow.className = 'card__tags-row';
  techRow.style.marginBottom = '12px';
  project.tags.forEach(t => {
    const span = document.createElement('span');
    span.className = 'tag tag--tech';
    span.textContent = t;
    techRow.appendChild(span);
  });

  // Links
  const linksDiv = document.createElement('div');
  linksDiv.className = 'card__links';

  if (project.links && project.links.length) {
    project.links.forEach(link => {
      const a = document.createElement('a');
      a.className = 'card__link-btn';
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = (LINK_ICONS[link.icon] || LINK_ICONS.external) + `<span>${link.label}</span>`;
      a.addEventListener('click', e => e.stopPropagation());
      linksDiv.appendChild(a);
    });
  }

  body.appendChild(tagsRow);
  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(techRow);
  body.appendChild(linksDiv);

  card.appendChild(mediaWrap);
  card.appendChild(body);

  // Click card → open viewer (skip if clicking within compare slider)
  if (allMedia.length > 0) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', e => {
      if (e.target.closest('.compare-slider')) return;
      openViewer(project.title, allMedia);
    });
  }

  return card;
}

// ── Render all cards ──────────────────────────────────────
function getPortfolioData() {
  return typeof PORTFOLIO !== 'undefined' ? PORTFOLIO : [];
}

function renderPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  getPortfolioData().forEach(project => {
    const card = buildCard(project);
    grid.appendChild(card);
  });
}

// ── Compare Slider ────────────────────────────────────────
function buildCompareSlider(item) {
  const wrap = document.createElement('div');
  wrap.className = 'compare-slider';

  const imgAfter = document.createElement('img');
  imgAfter.className = 'compare-slider__after';
  imgAfter.src = item.after?.src || '';
  imgAfter.alt = item.after?.label || 'After';

  const imgBefore = document.createElement('img');
  imgBefore.className = 'compare-slider__before';
  imgBefore.src = item.before?.src || '';
  imgBefore.alt = item.before?.label || 'Before';

  const line = document.createElement('div');
  line.className = 'compare-slider__line';

  const handle = document.createElement('div');
  handle.className = 'compare-slider__handle';

  const lblBefore = document.createElement('span');
  lblBefore.className = 'compare-slider__label compare-slider__label--before';
  lblBefore.textContent = item.before?.label || 'Before';

  const lblAfter = document.createElement('span');
  lblAfter.className = 'compare-slider__label compare-slider__label--after';
  lblAfter.textContent = item.after?.label || 'After';

  wrap.append(imgAfter, imgBefore, line, handle, lblBefore, lblAfter);

  // ── Drag logic ──
  function setPos(x) {
    const rect = wrap.getBoundingClientRect();
    const pct = Math.max(0, Math.min((x - rect.left) / rect.width, 1));
    const pctRight = (1 - pct) * 100;
    imgBefore.style.clipPath = `inset(0 ${pctRight}% 0 0)`;
    line.style.left = `${pct * 100}%`;
    handle.style.left = `${pct * 100}%`;
  }

  let dragging = false;
  handle.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
  wrap.addEventListener('mousedown',   e => { dragging = true; setPos(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
  window.addEventListener('mouseup',   () => { dragging = false; });

  handle.addEventListener('touchstart', e => { dragging = true; e.preventDefault(); }, { passive: false });
  window.addEventListener('touchmove',  e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend',   () => { dragging = false; });

  return wrap;
}

// ── Image / Video Viewer ──────────────────────────────────
function openViewer(title, mediaItems) {
  const viewer  = document.getElementById('img-viewer');
  const titleEl = document.getElementById('img-viewer__title');
  const grid    = document.getElementById('img-viewer__grid');
  if (!viewer) return;

  titleEl.textContent = title;
  grid.innerHTML = '';

  mediaItems.forEach(item => {
    const figure = document.createElement('figure');
    figure.className = 'viewer-item';

    if (item.type === 'compare') {
      figure.classList.add('viewer-item--compare');
      figure.appendChild(buildCompareSlider(item));
    } else if (item.type === 'video') {
      const vid = document.createElement('video');
      vid.src = item.src;
      vid.controls = true;
      vid.autoplay = true;
      vid.muted = false;
      vid.playsInline = true;
      figure.appendChild(vid);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.label || '';
      figure.appendChild(img);
    }

    if (item.label) {
      const cap = document.createElement('figcaption');
      cap.className = 'viewer-item__caption';
      cap.textContent = item.label;
      figure.appendChild(cap);
    }

    grid.appendChild(figure);
  });

  viewer.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  if (typeof gsap !== 'undefined') {
    gsap.fromTo('#img-viewer__panel',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
    );
  }
}

function closeViewer() {
  const viewer = document.getElementById('img-viewer');
  if (!viewer) return;
  // Pause any playing videos
  viewer.querySelectorAll('video').forEach(v => v.pause());
  viewer.classList.remove('is-open');
  document.body.style.overflow = '';
}

function initViewer() {
  const viewer = document.getElementById('img-viewer');
  if (!viewer) return;

  document.getElementById('img-viewer__close')?.addEventListener('click', closeViewer);

  // Click backdrop to close
  viewer.addEventListener('click', e => {
    if (e.target === viewer) closeViewer();
  });

  // ESC to close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && viewer.classList.contains('is-open')) closeViewer();
  });
}

// ── Filter logic ──────────────────────────────────────────
function applyFilters(cat, subCat) {
  document.querySelectorAll('.portfolio-card').forEach(card => {
    const catMatch = cat === 'all' || card.dataset.category === cat;
    const subMatch = subCat === 'all' || !card.dataset.subCategory || card.dataset.subCategory === subCat;
    const match = catMatch && subMatch;
    if (typeof gsap !== 'undefined') {
      if (match) {
        card.style.display = '';
        gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', pointerEvents: 'auto' });
      } else {
        gsap.to(card, { opacity: 0, y: 10, duration: 0.2, ease: 'power2.in', onComplete: () => { card.style.display = 'none'; }, pointerEvents: 'none' });
      }
    } else {
      card.style.display = match ? '' : 'none';
    }
  });
}

function initFilters() {
  let activeCat = 'all';
  let activeSubCat = 'all';

  const subFilterBar = document.getElementById('sub-filter-bar');

  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCat = tab.dataset.category;

      // Show/hide sub-filter bar
      if (subFilterBar) {
        if (activeCat === 'material') {
          subFilterBar.style.display = '';
        } else {
          subFilterBar.style.display = 'none';
          // Reset sub-filter when leaving material category
          activeSubCat = 'all';
          document.querySelectorAll('.filter-subtab').forEach(t => t.classList.toggle('active', t.dataset.subcategory === 'all'));
        }
      }

      applyFilters(activeCat, activeSubCat);
    });
  });

  document.querySelectorAll('.filter-subtab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-subtab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeSubCat = tab.dataset.subcategory;
      applyFilters(activeCat, activeSubCat);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderPortfolio();
  initFilters();
  initViewer();
});
