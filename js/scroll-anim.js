/* scroll-anim.js — GSAP ScrollTrigger animations + Hero sequence */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // ── Hero entrance sequence ────────────────────────────────
  const heroTag     = document.querySelector('.hero-tag');
  const heroNameEn  = document.querySelector('.hero-name-en');
  const heroNameZh  = document.querySelector('.hero-name-zh');
  const heroSubWrap = document.querySelector('.hero-subtitle');
  const heroCta     = document.querySelector('.hero-cta');
  const heroScroll  = document.querySelector('.hero-scroll');

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Tag pill
  heroTl.to(heroTag, { opacity: 1, y: 0, duration: 0.7 }, 0.3);

  // Scramble text for hero name
  heroTl.call(() => {
    const nameEl = heroNameEn;
    if (!nameEl) return;
    nameEl.textContent = 'LI CHANGLONG';
    nameEl.style.opacity = '0';
    gsap.to(nameEl, { opacity: 1, duration: 0.3 });

    if (typeof TextScramble !== 'undefined') {
      const scramble = new TextScramble(nameEl);
      scramble.setText('LI CHANGLONG', 1800);
    }
  }, [], 0.5);

  // Chinese name character stagger
  heroTl.to(heroNameZh, { opacity: 1, duration: 0.8 }, 1.0);

  // Subtitle typing
  heroTl.call(() => {
    const heroSub = document.getElementById('hero-subtitle-text');
    if (!heroSubWrap) return;
    gsap.to(heroSubWrap, { opacity: 1, duration: 0.4 });
    if (!heroSub) return;
    const full = 'Game Technical Artist · 渲染向TA';
    let i = 0;
    heroSub.textContent = '';

    const type = () => {
      if (i < full.length) {
        heroSub.textContent += full[i];
        i++;
        setTimeout(type, 45 + Math.random() * 30);
      }
    };
    setTimeout(type, 200);
  }, [], 1.5);

  // CTA button
  heroTl.to(heroCta, { opacity: 1, y: 0, duration: 0.7 }, 2.4);

  // Scroll indicator
  heroTl.to(heroScroll, { opacity: 1, duration: 0.6 }, 3.0);

  // ── Section labels (fade in with glow) ───────────────────
  document.querySelectorAll('.section-label').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
        el.classList.add('animate-label-glow');
      },
    });
  });

  // ── Section titles (scanline clip-path wipe) ─────────────
  document.querySelectorAll('.section-title').forEach(el => {
    gsap.to(el, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      },
    });
  });

  // ── About stats ───────────────────────────────────────────
  document.querySelectorAll('.stat-item').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.7,
      delay: i * 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      },
    });
  });

  // ── About bio + skills ────────────────────────────────────
  gsap.to('.about-bio', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.about-bio', start: 'top 88%' },
  });

  gsap.to('.skills-title', {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.skills-title', start: 'top 92%' },
  });

  gsap.to('.skill-tag', {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.5,
    stagger: 0.055,
    ease: 'back.out(1.4)',
    scrollTrigger: {
      trigger: '.skills-tags',
      start: 'top 88%',
    },
  });

  // ── Portfolio filter bar ──────────────────────────────────
  gsap.to('.filter-bar', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.filter-bar', start: 'top 88%' },
  });

  // ── Portfolio cards ───────────────────────────────────────
  // Cards are added dynamically; use a delayed init
  const initCardAnims = () => {
    const cards = document.querySelectorAll('.portfolio-card');
    if (!cards.length) return;

    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      stagger: { amount: 1.0, from: 'start' },
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#portfolio-grid',
        start: 'top 85%',
      },
    });
  };

  // Small delay to let portfolio-render.js finish
  setTimeout(initCardAnims, 150);

  // ── Contact links ─────────────────────────────────────────
  gsap.to('.contact-desc', {
    opacity: 1,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.contact-desc', start: 'top 88%' },
  });

  gsap.to('.contact-link', {
    opacity: 1,
    y: 0,
    duration: 0.65,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact-links',
      start: 'top 88%',
    },
  });

  // ── Nav: scroll-aware state ───────────────────────────────
  ScrollTrigger.create({
    start: 80,
    onEnter: () => document.getElementById('nav')?.classList.add('scrolled'),
    onLeaveBack: () => document.getElementById('nav')?.classList.remove('scrolled'),
  });
});
