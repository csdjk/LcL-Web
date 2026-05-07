/* mouse-trail.js — 全页鼠标粒子拖尾效果
   - Canvas 全屏覆盖层，pointer-events:none 不影响交互
   - 粒子颜色在 青色→蓝紫色→品红 范围内循环，契合科技风格
   - 根据鼠标移动速度动态生成粒子数量
   - 支持 prefers-reduced-motion 自动关闭
*/
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  // ── Canvas 初始化 ─────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;' +
    'pointer-events:none;z-index:9998;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── 粒子池 ───────────────────────────────────────────────
  const particles = [];
  const MAX_PARTICLES = 120;
  let hue = 185;      // 初始色相（青色）
  let lastX = -999, lastY = -999;

  document.addEventListener('mousemove', e => {
    const x = e.clientX;
    const y = e.clientY;
    const speed = Math.hypot(x - lastX, y - lastY);
    lastX = x;
    lastY = y;

    // 色相在 160（青绿）~ 300（品红）之间循环偏移
    hue = 160 + ((hue - 160 + 1.8) % 140);

    // 移速越快，生成粒子越多（上限 6 个/帧）
    const count = Math.min(Math.ceil(speed / 6) + 1, 6);

    for (let i = 0; i < count; i++) {
      if (particles.length >= MAX_PARTICLES) break;
      particles.push({
        x:   x + (Math.random() - 0.5) * 6,
        y:   y + (Math.random() - 0.5) * 6,
        vx:  (Math.random() - 0.5) * 1.2,
        vy:  -(Math.random() * 1.6 + 0.4),   // 微微上飘
        r:   Math.random() * 2.5 + 1.2,
        opacity: 0.85 + Math.random() * 0.15,
        hue: (hue + (Math.random() - 0.5) * 50 + 360) % 360,
      });
    }
  });

  // ── RAF 渲染循环 ─────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;          // 轻微重力，粒子先上飘后落下
      p.opacity -= 0.032;
      p.r      *= 0.975;

      if (p.opacity <= 0 || p.r < 0.3) {
        particles.splice(i, 1);
        continue;
      }

      // 发光圆点：内核亮，外圈渐透明
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
      grd.addColorStop(0,   `hsla(${p.hue}, 100%, 85%, ${p.opacity})`);
      grd.addColorStop(0.4, `hsla(${p.hue}, 100%, 65%, ${p.opacity * 0.6})`);
      grd.addColorStop(1,   `hsla(${p.hue}, 100%, 55%, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
