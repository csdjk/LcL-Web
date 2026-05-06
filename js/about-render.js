/* about-render.js — Apply SITE_CONFIG to the About / Hero / Contact section. */
(function () {
  const cfg = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : null;
  if (!cfg) return;

  // ── Hero ──────────────────────────────────────────────────
  const heroTag = document.querySelector('.hero-tag');
  if (heroTag && cfg.hero?.tag) heroTag.textContent = cfg.hero.tag;

  const nameEn = document.querySelector('.hero-name-en');
  if (nameEn && cfg.hero?.nameEn) {
    nameEn.textContent = cfg.hero.nameEn;
    nameEn.setAttribute('aria-label', cfg.hero.nameEn);
  }

  const nameZh = document.querySelector('.hero-name-zh');
  if (nameZh && cfg.hero?.nameZh) nameZh.innerHTML = cfg.hero.nameZh;

  // ── Stats ─────────────────────────────────────────────────
  const statsEl = document.querySelector('.about-stats');
  if (statsEl && cfg.about?.stats?.length) {
    statsEl.innerHTML = cfg.about.stats.map(s =>
      `<div class="stat-item">
        <div class="stat-number">${s.number}</div>
        <div class="stat-label">${s.label}</div>
      </div>`
    ).join('');
  }

  // ── Bio ───────────────────────────────────────────────────
  const bioEl = document.querySelector('.about-bio');
  if (bioEl && cfg.about?.bio != null) bioEl.innerHTML = cfg.about.bio;

  // ── Skills ────────────────────────────────────────────────
  const skillsEl = document.querySelector('.skills-grid');
  if (skillsEl && cfg.about?.skillGroups?.length) {
    skillsEl.innerHTML = cfg.about.skillGroups.map(g =>
      `<div class="skills-group">
        <p class="skills-title">${g.title}</p>
        <div class="skills-tags">
          ${g.tags.map(t =>
            `<span class="skill-tag ${(g.highlights || []).includes(t) ? 'skill-tag--highlight' : ''}">${t}</span>`
          ).join('')}
        </div>
      </div>`
    ).join('');
  }

  // ── Contact ───────────────────────────────────────────────
  const c = cfg.contact;
  if (c) {
    const emailLink = document.querySelector('.contact-link[href^="mailto"]');
    if (emailLink && c.email) {
      emailLink.href = 'mailto:' + c.email;
      emailLink.lastChild.textContent = c.email;
    }
    const ghLink = document.querySelector('.contact-link[href*="github"]');
    if (ghLink && c.github) {
      ghLink.href = c.github;
      const span = ghLink.querySelector('span') || ghLink.lastChild;
      if (span && c.githubLabel) span.textContent = c.githubLabel;
    }
    const zhLink = document.querySelector('.contact-link[href*="zhihu"]');
    if (zhLink && c.zhihu) {
      zhLink.href = c.zhihu;
      const span = zhLink.querySelector('span') || zhLink.lastChild;
      if (span && c.zhihuLabel) span.textContent = c.zhihuLabel;
    }
  }
})();
