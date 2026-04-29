/* nav.js — Navigation behaviors */

document.addEventListener('DOMContentLoaded', () => {
  const nav   = document.getElementById('nav');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');

  // ── Smooth section highlight ─────────────────────────────
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      const id = target.id;
      links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  // ── Smooth scroll for nav links ───────────────────────────
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Close mobile drawer if open
      document.getElementById('nav-drawer')?.classList.remove('open');
    });
  });

  // ── Mobile hamburger ──────────────────────────────────────
  const hamburger = document.getElementById('nav-hamburger');
  const drawer    = document.getElementById('nav-drawer');

  hamburger?.addEventListener('click', () => {
    const open = drawer?.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close drawer on outside click
  document.addEventListener('click', e => {
    if (drawer?.classList.contains('open') &&
        !drawer.contains(e.target) &&
        !hamburger?.contains(e.target)) {
      drawer.classList.remove('open');
    }
  });
});
