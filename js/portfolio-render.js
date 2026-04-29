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

  // ── Media section ──
  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'card__media-wrap';

  const firstGalleryItem = project.gallery?.[0];
  const hasVideo = project.primaryVideo || firstGalleryItem?.type === 'video';

  if (hasVideo) {
    // ── Video card ──
    const videoSrc = project.primaryVideo || firstGalleryItem.src;
    const vid = document.createElement('video');
    vid.src = videoSrc;
    vid.muted = true;
    vid.loop = true;
    vid.playsInline = true;
    vid.preload = 'metadata';
    mediaWrap.appendChild(vid);

    // Play icon overlay (always visible)
    const playDiv = document.createElement('div');
    playDiv.className = 'play-icon';
    playDiv.innerHTML = PLAY_ICON;
    mediaWrap.appendChild(playDiv);

    // Hover: muted preview autoplay
    card.addEventListener('mouseenter', () => vid.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });

  } else if (project.cover) {
    // ── Image card ──
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

  // View gallery button if has gallery
  if (project.gallery && project.gallery.length > 1) {
    const btn = document.createElement('button');
    btn.className = 'card__link-btn';
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="11" height="11"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>查看图库</span>`;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(project.id, 0);
    });
    linksDiv.appendChild(btn);
  }

  body.appendChild(tagsRow);
  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(techRow);
  body.appendChild(linksDiv);

  card.appendChild(mediaWrap);
  card.appendChild(body);

  // Click: open lightbox (video-first projects open at index 0 = the video)
  mediaWrap.addEventListener('click', () => {
    if (project.gallery && project.gallery.length > 0) {
      openLightbox(project.id, 0);
    }
  });

  return card;
}

// ── Render all cards ──────────────────────────────────────
function renderPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  PORTFOLIO.forEach(project => {
    const card = buildCard(project);
    grid.appendChild(card);
  });
}

// ── Filter logic ──────────────────────────────────────────
function initFilters() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.category;
      document.querySelectorAll('.portfolio-card').forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        if (typeof gsap !== 'undefined') {
          gsap.to(card, {
            opacity: match ? 1 : 0.15,
            scale: match ? 1 : 0.94,
            duration: 0.3,
            ease: 'power2.out',
            pointerEvents: match ? 'auto' : 'none',
          });
        } else {
          card.style.opacity = match ? '1' : '0.15';
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderPortfolio();
  initFilters();
});
