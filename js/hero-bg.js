/* hero-bg.js — Three.js particle network for hero section */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 400;

  // ── Particle system ──────────────────────────────────────
  const COUNT = typeof window.innerWidth !== 'undefined' && window.innerWidth < 768 ? 600 : 1100;
  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);
  const phases    = new Float32Array(COUNT);

  const cCyan   = new THREE.Color(0x00d4ff);
  const cPurple = new THREE.Color(0x7b2fff);
  const cWhite  = new THREE.Color(0xffffff);

  for (let i = 0; i < COUNT; i++) {
    // Fibonacci sphere distribution for even spacing
    const theta = Math.acos(1 - 2 * (i / COUNT));
    const phi   = Math.PI * (1 + Math.sqrt(5)) * i;
    const r     = 170 + Math.random() * 100;

    positions[i * 3]     = r * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.cos(theta);

    phases[i] = Math.random() * Math.PI * 2;

    // Color gradient: purple (bottom) → cyan (top) with white highlights
    const t = (positions[i * 3 + 1] / r + 1) * 0.5; // normalize Y to [0,1]
    const col = t > 0.85
      ? cWhite
      : t > 0.5 ? cCyan : cPurple;
    const blended = new THREE.Color().lerpColors(cPurple, cCyan, t);
    colors[i * 3]     = blended.r;
    colors[i * 3 + 1] = blended.g;
    colors[i * 3 + 2] = blended.b;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ── Line connections ──────────────────────────────────────
  const LINE_DIST = 95;
  const MAX_LINES = 900;
  const linePositions = new Float32Array(MAX_LINES * 6);
  const lineColors    = new Float32Array(MAX_LINES * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

  const lineMat = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.18,
  }));
  scene.add(lineMat);

  // ── Mouse parallax ────────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize handler ────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animation loop ────────────────────────────────────────
  const posAttr = particleGeo.attributes.position;
  const basePositions = positions.slice(); // keep original
  let lineUpdateFrame = 0;
  let clock = 0;

  function animate() {
    requestAnimationFrame(animate);
    clock += 0.006;

    // Drift particles
    for (let i = 0; i < COUNT; i++) {
      const phase = phases[i];
      posAttr.array[i * 3]     = basePositions[i * 3]     + Math.sin(clock + phase) * 4;
      posAttr.array[i * 3 + 1] = basePositions[i * 3 + 1] + Math.cos(clock * 0.8 + phase) * 4;
      posAttr.array[i * 3 + 2] = basePositions[i * 3 + 2] + Math.sin(clock * 1.2 + phase) * 3;
    }
    posAttr.needsUpdate = true;

    // Update lines every 3 frames
    lineUpdateFrame++;
    if (lineUpdateFrame % 3 === 0) {
      let lineIdx = 0;
      const lPos = lineGeo.attributes.position.array;
      const lCol = lineGeo.attributes.color.array;

      outer: for (let a = 0; a < COUNT - 1 && lineIdx < MAX_LINES; a++) {
        const ax = posAttr.array[a * 3], ay = posAttr.array[a * 3 + 1], az = posAttr.array[a * 3 + 2];
        for (let b = a + 1; b < COUNT && lineIdx < MAX_LINES; b++) {
          const bx = posAttr.array[b * 3], by = posAttr.array[b * 3 + 1], bz = posAttr.array[b * 3 + 2];
          const dx = ax - bx, dy = ay - by, dz = az - bz;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist < LINE_DIST) {
            const o = lineIdx * 6;
            lPos[o]   = ax; lPos[o+1] = ay; lPos[o+2] = az;
            lPos[o+3] = bx; lPos[o+4] = by; lPos[o+5] = bz;
            const alpha = 1 - dist / LINE_DIST;
            lCol[o]   = colors[a*3]   * alpha; lCol[o+1] = colors[a*3+1] * alpha; lCol[o+2] = colors[a*3+2] * alpha;
            lCol[o+3] = colors[b*3]   * alpha; lCol[o+4] = colors[b*3+1] * alpha; lCol[o+5] = colors[b*3+2] * alpha;
            lineIdx++;
          }
        }
      }

      lineGeo.setDrawRange(0, lineIdx * 2);
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;
    }

    // Smooth camera rotation (mouse parallax)
    targetRotY += (mouseX * 0.12 - targetRotY) * 0.04;
    targetRotX += (-mouseY * 0.08 - targetRotX) * 0.04;
    scene.rotation.y = targetRotY;
    scene.rotation.x = targetRotX;

    // Slow auto-rotation
    scene.rotation.y += 0.0008;

    renderer.render(scene, camera);
  }

  animate();
})();
