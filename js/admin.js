/* admin.js — LCL Admin Panel logic */
(function () {
  'use strict';

  const SESSION_KEY = 'lcl_admin_auth';

  // Auth guard — redirect to login page if not authenticated
  if (localStorage.getItem(SESSION_KEY) !== '1') {
    window.location.replace('admin-login.html');
    return;
  }

  const CAT_OPTIONS = [
    { value: 'character',   label: '角色渲染' },
    { value: 'material',    label: '普通材质' },
    { value: 'postprocess', label: '后处理' },
    { value: 'tools',       label: '工具' },
    { value: 'graphics',    label: '图形学' },
  ];
  const SIZE_OPTIONS = ['standard', 'featured', 'wide', 'video'];
  const ICON_OPTIONS = ['github', 'globe', 'video', 'article', 'external'];

  // ── State ─────────────────────────────────────────────────────────────────
  let cfg  = loadCfg();
  let port = loadPort();
  let editingIdx = -1; // index into port[] being edited in modal

  function loadCfg() {
    return JSON.parse(JSON.stringify(SITE_CONFIG));
  }

  function loadPort() {
    const data  = JSON.parse(JSON.stringify(PORTFOLIO));
    const order = typeof PORTFOLIO_ORDER !== 'undefined' ? PORTFOLIO_ORDER : [];
    const indexMap = new Map(order.map((id, i) => [id, i]));
    return data.sort((a, b) => {
      const ia = indexMap.has(a.id) ? indexMap.get(a.id) : 9999;
      const ib = indexMap.has(b.id) ? indexMap.get(b.id) : 9999;
      return ia - ib;
    });
  }

  // ── File System Access (upload to assets/) ───────────────────────────────
  let rootDirHandle = null;

  // IndexedDB helpers — persist the directory handle across sessions
  function idbOpen() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('lcl-admin-fs', 1);
      req.onupgradeneeded = e => e.target.result.createObjectStore('handles');
      req.onsuccess = e => resolve(e.target.result);
      req.onerror   = () => reject(req.error);
    });
  }
  async function idbSaveHandle(handle) {
    try {
      const db = await idbOpen();
      const tx = db.transaction('handles', 'readwrite');
      tx.objectStore('handles').put(handle, 'root');
      await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = rej; });
    } catch(e) { /* ignore */ }
  }
  async function idbLoadHandle() {
    try {
      const db = await idbOpen();
      const tx = db.transaction('handles', 'readonly');
      return await new Promise((res, rej) => {
        const req = tx.objectStore('handles').get('root');
        req.onsuccess = () => res(req.result || null);
        req.onerror   = () => res(null);
      });
    } catch(e) { return null; }
  }

  function updateDirAuthBtn() {
    const btn = document.getElementById('btn-dir-auth');
    if (!btn) return;
    if (rootDirHandle) {
      btn.textContent = '✓ 已授权: ' + (rootDirHandle.name || '项目目录');
      btn.classList.add('authorized');
    } else {
      btn.textContent = '📁 授权项目目录';
      btn.classList.remove('authorized');
    }
  }

  // Try to restore handle from IDB on startup (no user gesture needed if permission is still 'granted')
  async function tryRestoreHandle() {
    const saved = await idbLoadHandle();
    if (!saved) return;
    try {
      const perm = await saved.queryPermission({ mode: 'readwrite' });
      if (perm === 'granted') {
        rootDirHandle = saved;
        updateDirAuthBtn();
        return;
      }
      // Permission was 'prompt' — try silent requestPermission (will fail if no user gesture, that's fine)
      const perm2 = await saved.requestPermission({ mode: 'readwrite' }).catch(() => 'prompt');
      if (perm2 === 'granted') {
        rootDirHandle = saved;
        updateDirAuthBtn();
      }
    } catch(e) { /* handle may be stale */ }
  }
  tryRestoreHandle();

  async function ensureRootDir(interactive) {
    if (rootDirHandle) return rootDirHandle;
    if (!interactive) return null;
    try {
      const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
      rootDirHandle = handle;
      await idbSaveHandle(handle);
      updateDirAuthBtn();
      return rootDirHandle;
    } catch(e) { return null; }
  }

  async function fsCopyFile(file) {
    const root = rootDirHandle;
    if (!root) throw new Error('请先点击顶栏「📁 授权项目目录」按钮，选择 LcL-Web 根目录');
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|avi)$/i.test(file.name);
    const sd = isVideo ? 'videos' : 'images';
    try {
      const assetsH = await root.getDirectoryHandle('assets');
      const subH    = await assetsH.getDirectoryHandle(sd, { create: true });
      const fh      = await subH.getFileHandle(file.name, { create: true });
      const writable = await fh.createWritable();
      await writable.write(file);
      await writable.close();
      return `assets/${sd}/${file.name}`;
    } catch(e) {
      throw new Error(`写入失败: ${e.message}`);
    }
  }

  // ── Asset browser overlay ─────────────────────────────────────────────────
  async function fsListAssets(filterType) {
    const root = await ensureRootDir(true);
    if (!root) return [];
    const result = [];
    try {
      const assetsH = await root.getDirectoryHandle('assets');
      const dirs = filterType === 'video'
        ? [{ name: 'videos', type: 'video' }]
        : filterType === 'image-animated'
          ? [{ name: 'images-animated', type: 'image' }]
          : filterType === 'image-static'
            ? [{ name: 'images', type: 'image' }]
            : filterType === 'image'
              ? [{ name: 'images', type: 'image' }, { name: 'images-animated', type: 'image' }]
              : [{ name: 'images', type: 'image' }, { name: 'images-animated', type: 'image' }, { name: 'videos', type: 'video' }];
      for (const { name, type } of dirs) {
        try {
          const dirH = await assetsH.getDirectoryHandle(name);
          for await (const [fname, fh] of dirH.entries()) {
            if (fh.kind !== 'file') continue;
            const ext = fname.split('.').pop().toLowerCase();
            const isVid     = /^(mp4|webm|mov|avi)$/.test(ext);
            const isAnimImg = /^(gif|avif)$/.test(ext);
            const isStatImg = /^(png|jpg|jpeg|webp|svg)$/.test(ext);
            if (!isVid && !isAnimImg && !isStatImg) continue;
            const subtype = isVid ? 'video' : isAnimImg ? 'image-animated' : 'image-static';
            result.push({ name: fname, path: `assets/${name}/${fname}`, type: isVid ? 'video' : 'image', subtype, ext });
          }
        } catch(e) { /* subdir may not exist */ }
      }
    } catch(e) { /* assets dir may not exist */ }
    return result;
  }

  let _assetBrowserEl = null;

  function openAssetBrowser(onSelect, filterType) {
    filterType = filterType || 'all';
    if (!_assetBrowserEl) {
      _assetBrowserEl = document.createElement('div');
      _assetBrowserEl.id = 'asset-browser-overlay';
      document.body.appendChild(_assetBrowserEl);
    }
    const ov = _assetBrowserEl;
    ov.innerHTML = `
      <div class="ab-box">
        <div class="ab-head">
          <span class="ab-title">📂 选择资源</span>
          <div class="ab-tabs">
            <button class="ab-tab" data-type="all">全部</button>
            <button class="ab-tab" data-type="image-static">静态图</button>
            <button class="ab-tab" data-type="image-animated">动态图</button>
            <button class="ab-tab" data-type="video">视频</button>
          </div>
          <button class="ab-close">✕</button>
        </div>
        <div class="ab-search-wrap">
          <input class="ab-search" type="text" placeholder="搜索文件名…">
        </div>
        <div class="ab-body"><div class="ab-loading">正在扫描 assets/ 目录…</div></div>
      </div>`;
    ov.classList.add('open');

    const abBody = ov.querySelector('.ab-body');
    const abSearch = ov.querySelector('.ab-search');
    let activeType = filterType === 'image' ? 'image-static' : filterType;
    let allItems = [];
    let searchQ = '';

    abSearch.addEventListener('input', () => { searchQ = abSearch.value.toLowerCase(); renderGrid(); });

    ov.querySelectorAll('.ab-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === activeType);
      btn.addEventListener('click', () => {
        activeType = btn.dataset.type;
        ov.querySelectorAll('.ab-tab').forEach(b => b.classList.toggle('active', b.dataset.type === activeType));
        renderGrid();
      });
    });
    ov.querySelector('.ab-close').addEventListener('click', () => ov.classList.remove('open'));
    ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('open'); });

    function renderGrid() {
      const list = allItems.filter(it => {
        const typeMatch = activeType === 'all' || it.subtype === activeType;
        const nameMatch = !searchQ || it.name.toLowerCase().includes(searchQ);
        return typeMatch && nameMatch;
      });
      abBody.innerHTML = '';
      if (!list.length) {
        abBody.innerHTML = '<div class="ab-empty">该目录下暂无资源文件<br><small>请先通过拖拽上传文件后刷新</small></div>';
        return;
      }
      const grid = document.createElement('div');
      grid.className = 'ab-grid';
      list.forEach(item => {
        const card = document.createElement('div');
        card.className = 'ab-card';
        if (item.type === 'video') {
          const v = document.createElement('video');
          v.src = item.path; v.muted = true; v.preload = 'metadata';
          v.addEventListener('mouseenter', () => v.play().catch(() => {}));
          v.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
          card.appendChild(v);
        } else {
          const img = document.createElement('img');
          img.src = item.path; img.alt = item.name; img.decoding = 'async';
          card.appendChild(img);
        }
        const badge = document.createElement('span');
        badge.className = 'ab-type-badge';
        badge.textContent = item.subtype === 'video' ? '▶' : item.subtype === 'image-animated' ? 'GIF' : item.ext?.toUpperCase() || '■';
        card.appendChild(badge);
        const nm = document.createElement('span');
        nm.className = 'ab-card-name';
        nm.textContent = item.name;
        card.appendChild(nm);
        card.addEventListener('click', () => {
          onSelect(item.path, item.type);
          ov.classList.remove('open');
        });
        grid.appendChild(card);
      });
      abBody.appendChild(grid);
    }

    fsListAssets(filterType).then(items => {
      allItems = items;
      renderGrid();
    }).catch(() => {
      abBody.innerHTML = '<div class="ab-empty">扫描失败，请先拖拽一个文件以授权项目目录</div>';
    });
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      item.classList.add('active');
      document.getElementById('page-' + item.dataset.page).classList.add('active');
    });
  });

  // ── Dir auth button ────────────────────────────────────────────────────────
  // Prevent browser from navigating to dropped files anywhere on the page
  document.addEventListener('dragover', e => e.preventDefault());
  document.addEventListener('drop',     e => e.preventDefault());

  const dirAuthBtn = document.getElementById('btn-dir-auth');
  if (dirAuthBtn) {
    dirAuthBtn.addEventListener('click', async () => {
      dirAuthBtn.textContent = '选择中…';
      await ensureRootDir(true);
      if (!rootDirHandle) {
        updateDirAuthBtn();
        toast('已取消授权', '#ff9944');
      } else {
        toast('✓ 目录已授权，下次打开将自动恢复');
      }
    });
  }

  // ── Logout ─────────────────────────────────────────────────────────
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(SESSION_KEY);
      window.location.replace('admin-login.html');
    });
  }

  // ── Toast ─────────────────────────────────────────────────────────────────
  function toast(msg, color = '#00e5a0') {
    const el = document.createElement('div');
    el.className = 'toast';
    el.style.background = color;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  // ── Status text ───────────────────────────────────────────────────────────
  function setStatus(msg) {
    document.getElementById('status-text').textContent = msg;
  }
  const hasOverride = false;

  // ── Hero page ─────────────────────────────────────────────────────────────
  function initHero() {
    document.getElementById('h-tag').value      = cfg.hero?.tag    || '';
    document.getElementById('h-name-en').value  = cfg.hero?.nameEn || '';
    document.getElementById('h-name-zh').value  = cfg.hero?.nameZh || '';
  }

  function collectHero() {
    if (!cfg.hero) cfg.hero = {};
    cfg.hero.tag    = document.getElementById('h-tag').value;
    cfg.hero.nameEn = document.getElementById('h-name-en').value;
    cfg.hero.nameZh = document.getElementById('h-name-zh').value;
  }

  // ── About: stats ──────────────────────────────────────────────────────────
  function renderStats() {
    const c = document.getElementById('stats-container');
    c.innerHTML = '';
    (cfg.about?.stats || []).forEach((s, i) => {
      const row = document.createElement('div');
      row.className = 'form-row cols3';
      row.style.alignItems = 'flex-end';
      row.innerHTML = `
        <div class="field"><label>数字</label><input class="stat-num" data-i="${i}" value="${s.number}"></div>
        <div class="field"><label>说明</label><input class="stat-lbl" data-i="${i}" value="${s.label}"></div>
        <div class="field" style="flex-direction:row;gap:6px;align-self:flex-end;">
          <button class="btn-icon del stat-del" data-i="${i}" title="删除">✕</button>
        </div>`;
      c.appendChild(row);
    });
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-add';
    addBtn.style.marginTop = '10px';
    addBtn.textContent = '+ 添加统计项';
    addBtn.addEventListener('click', () => {
      cfg.about.stats.push({ number: '0+', label: '描述' });
      renderStats();
    });
    c.appendChild(addBtn);
    c.querySelectorAll('.stat-num').forEach(el => el.addEventListener('input', () => { cfg.about.stats[+el.dataset.i].number = el.value; }));
    c.querySelectorAll('.stat-lbl').forEach(el => el.addEventListener('input', () => { cfg.about.stats[+el.dataset.i].label  = el.value; }));
    c.querySelectorAll('.stat-del').forEach(el => el.addEventListener('click', () => { cfg.about.stats.splice(+el.dataset.i, 1); renderStats(); }));
  }

  function initAbout() {
    renderStats();
    document.getElementById('about-bio').value = cfg.about?.bio || '';
    renderSkillGroups();
  }

  function collectAbout() {
    if (!cfg.about) cfg.about = {};
    cfg.about.bio = document.getElementById('about-bio').value;
    // stats & skillGroups are live-synced via event listeners
  }

  // ── About: skills ─────────────────────────────────────────────────────────
  function renderSkillGroups() {
    const c = document.getElementById('skills-container');
    c.innerHTML = '';
    (cfg.about?.skillGroups || []).forEach((g, gi) => {
      const card = document.createElement('div');
      card.className = 'skill-group-card';

      const head = document.createElement('div');
      head.className = 'skill-group-head';
      head.innerHTML = `
        <input class="sg-title" data-gi="${gi}" value="${g.title}"
          style="flex:1;background:var(--bg);border:1px solid var(--border);color:var(--cyan);
                 padding:5px 8px;border-radius:4px;font-size:12px;outline:none;font-weight:600;">
        <button class="btn-icon del sg-del" data-gi="${gi}" style="margin-left:10px;" title="删除分组">✕</button>`;
      card.appendChild(head);

      // Tags pills
      const tagsLabel = document.createElement('div');
      tagsLabel.style.cssText = 'font-size:11px;color:var(--text2);margin-bottom:5px;';
      tagsLabel.textContent = '标签（点 × 删除，输入框添加）';
      card.appendChild(tagsLabel);

      const pills = document.createElement('div');
      pills.className = 'tag-pills';
      pills.id = `sg-pills-${gi}`;
      card.appendChild(pills);

      const tagRow = document.createElement('div');
      tagRow.className = 'tag-input-row';
      tagRow.innerHTML = `<input id="sg-input-${gi}" placeholder="输入标签名 + 回车"><button data-gi="${gi}" class="sg-add-tag">添加</button>`;
      card.appendChild(tagRow);

      // Highlights
      const hlLabel = document.createElement('div');
      hlLabel.style.cssText = 'font-size:11px;color:var(--text2);margin:10px 0 4px;';
      hlLabel.textContent = '高亮标签（逗号分隔）';
      card.appendChild(hlLabel);
      const hlInput = document.createElement('input');
      hlInput.className = 'sg-hl';
      hlInput.dataset.gi = gi;
      hlInput.value = (g.highlights || []).join(', ');
      hlInput.style.cssText = 'width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:6px 10px;border-radius:4px;font-size:12px;outline:none;margin-top:2px;';
      card.appendChild(hlInput);

      c.appendChild(card);
      renderTagPills(gi);

      // Events
      head.querySelector('.sg-title').addEventListener('input', e => { g.title = e.target.value; });
      head.querySelector('.sg-del').addEventListener('click', () => { cfg.about.skillGroups.splice(gi, 1); renderSkillGroups(); });
      hlInput.addEventListener('input', () => { g.highlights = hlInput.value.split(',').map(s=>s.trim()).filter(Boolean); });
      tagRow.querySelector('.sg-add-tag').addEventListener('click', () => addTagToGroup(gi));
      tagRow.querySelector('input').addEventListener('keydown', e => { if (e.key === 'Enter') addTagToGroup(gi); });
    });
  }

  function renderTagPills(gi) {
    const g = cfg.about.skillGroups[gi];
    const container = document.getElementById(`sg-pills-${gi}`);
    if (!container) return;
    container.innerHTML = '';
    (g.tags || []).forEach((t, ti) => {
      const pill = document.createElement('span');
      pill.className = 'tag-pill';
      pill.innerHTML = `${t} <span class="rm" data-gi="${gi}" data-ti="${ti}">×</span>`;
      pill.querySelector('.rm').addEventListener('click', () => { g.tags.splice(ti, 1); renderTagPills(gi); });
      container.appendChild(pill);
    });
  }

  function addTagToGroup(gi) {
    const input = document.getElementById(`sg-input-${gi}`);
    const val = input.value.trim();
    if (!val) return;
    if (!cfg.about.skillGroups[gi].tags) cfg.about.skillGroups[gi].tags = [];
    cfg.about.skillGroups[gi].tags.push(val);
    input.value = '';
    renderTagPills(gi);
  }

  document.getElementById('btn-add-skill-group').addEventListener('click', () => {
    if (!cfg.about.skillGroups) cfg.about.skillGroups = [];
    cfg.about.skillGroups.push({ title: '// 新分组', tags: [], highlights: [] });
    renderSkillGroups();
  });

  // ── Contact page ──────────────────────────────────────────────────────────
  function initContact() {
    const c = cfg.contact || {};
    document.getElementById('c-email').value        = c.email        || '';
    document.getElementById('c-github').value       = c.github       || '';
    document.getElementById('c-github-label').value = c.githubLabel  || '';
    document.getElementById('c-zhihu').value        = c.zhihu        || '';
    document.getElementById('c-zhihu-label').value  = c.zhihuLabel   || '';
  }

  function collectContact() {
    if (!cfg.contact) cfg.contact = {};
    cfg.contact.email       = document.getElementById('c-email').value;
    cfg.contact.github      = document.getElementById('c-github').value;
    cfg.contact.githubLabel = document.getElementById('c-github-label').value;
    cfg.contact.zhihu       = document.getElementById('c-zhihu').value;
    cfg.contact.zhihuLabel  = document.getElementById('c-zhihu-label').value;
  }

  // ── Portfolio list ────────────────────────────────────────────────────────
  function renderPortfolioList(filter = '') {
    const _t0 = performance.now();
    const c = document.getElementById('portfolio-list');
    c.innerHTML = '';
    const q = filter.toLowerCase();

    // Track drag state at container level to avoid per-card querySelectorAll
    let dragSrcIdx = null;
    let dragOverCard = null;

    // Build visible index map: visibleCards[vi] = { portIdx, cardEl }
    const visibleCards = [];

    const _tDomStart = performance.now();
    port.forEach((p, i) => {
      if (q && !p.title.toLowerCase().includes(q) && !(p.id||'').toLowerCase().includes(q)) return;
      const catLabel = CAT_OPTIONS.find(o => o.value === p.category)?.label || p.category;

      const card = document.createElement('div');
      card.className = 'p-item';
      card.draggable = true;
      const vi = visibleCards.length; // visible index for this card
      visibleCards.push({ portIdx: i, cardEl: card });

      // Thumbnail — prefer static image; fall back to video (load on hover to avoid scroll jank)
      const thumbSrc = p.gallery?.find(g => g.type === 'image')?.src
                    || p.gallery?.find(g => g.type === 'compare')?.before?.src
                    || null;
      const thumbVideoSrc = !thumbSrc ? (p.gallery?.find(g => g.type === 'video')?.src || null) : null;
      if (thumbSrc) {
        const img = document.createElement('img');
        img.className = 'p-item-thumb'; img.alt = ''; img.decoding = 'async';
        img.onerror = () => { img.style.opacity = '0.15'; };
        // Use 1px placeholder + IntersectionObserver — same as index.html
        // Prevents all avif files from decoding simultaneously on load
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        img.dataset.src = thumbSrc;
        card.appendChild(img);
      } else if (thumbVideoSrc) {
        const v = document.createElement('video');
        v.className = 'p-item-thumb'; v.muted = true; v.preload = 'metadata';
        v.src = thumbVideoSrc;
        card.appendChild(v);
      } else {
        const nd = document.createElement('div');
        nd.className = 'p-item-nothumb'; nd.textContent = '▤';
        card.appendChild(nd);
      }

      // Body
      const body = document.createElement('div');
      body.className = 'p-item-body';
      body.innerHTML = `<span class="p-item-cat">${catLabel}</span>
        <span class="p-item-title">${p.title}</span>
        <span class="p-item-id">${p.id}</span>`;

      const actions = document.createElement('div');
      actions.className = 'p-item-actions';
      const editBtn = document.createElement('button');
      editBtn.className = 'btn-icon edit'; editBtn.title = '编辑'; editBtn.textContent = '✎';
      editBtn.addEventListener('click', e => { e.stopPropagation(); openModal(i); });
      const delBtn = document.createElement('button');
      delBtn.className = 'btn-icon del'; delBtn.title = '删除'; delBtn.textContent = '✕';
      delBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (confirm(`确认删除「${p.title}」？`)) { port.splice(i, 1); renderPortfolioList(filter); }
      });
      actions.appendChild(editBtn); actions.appendChild(delBtn);
      body.appendChild(actions);
      card.appendChild(body);

      // Drag-and-drop (use vi for visible-list reorder, then rebuild port order)
      card.addEventListener('dragstart', e => {
        dragSrcIdx = vi;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      card.addEventListener('dragend', () => {
        dragSrcIdx = null;
        card.classList.remove('dragging');
        if (dragOverCard) { dragOverCard.classList.remove('drag-over'); dragOverCard = null; }
      });
      card.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragSrcIdx !== null && dragSrcIdx !== vi) {
          if (dragOverCard && dragOverCard !== card) dragOverCard.classList.remove('drag-over');
          dragOverCard = card;
          card.classList.add('drag-over');
        }
      });
      card.addEventListener('dragleave', e => {
        // Only remove if truly leaving this card (not entering a child)
        if (!card.contains(e.relatedTarget)) {
          card.classList.remove('drag-over');
          if (dragOverCard === card) dragOverCard = null;
        }
      });
      card.addEventListener('drop', e => {
        e.preventDefault();
        card.classList.remove('drag-over');
        if (dragOverCard === card) dragOverCard = null;
        if (dragSrcIdx === null || dragSrcIdx === vi) return;
        // Reorder port[] using the visible card mapping
        const srcPortIdx  = visibleCards[dragSrcIdx].portIdx;
        const dstPortIdx  = visibleCards[vi].portIdx;
        const item = port.splice(srcPortIdx, 1)[0];
        const newDst = srcPortIdx < dstPortIdx ? dstPortIdx - 1 : dstPortIdx;
        port.splice(newDst, 0, item);
        renderPortfolioList(filter);
      });

      c.appendChild(card);
    });
    console.log(`[perf] renderPortfolioList — DOM build: ${(performance.now()-_tDomStart).toFixed(1)}ms | total items: ${port.length} | visible: ${visibleCards.length}`);

    if (!c.children.length) {
      c.innerHTML = '<div style="color:var(--text3);padding:20px;text-align:center;grid-column:1/-1;">暂无匹配作品</div>';
      console.log(`[perf] renderPortfolioList — total (no results): ${(performance.now()-_t0).toFixed(1)}ms`);
      return;
    }

    // Lazy-load thumbnails via IntersectionObserver (same strategy as index.html)
    // Prevents all avif animations from decoding simultaneously
    const lazyImgs = c.querySelectorAll('img[data-src]');
    if (lazyImgs.length) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          img.src = img.dataset.src;
          delete img.dataset.src;
          obs.unobserve(img);
        });
      }, { rootMargin: '120px' });
      lazyImgs.forEach(img => obs.observe(img));
    }
    console.log(`[perf] renderPortfolioList — TOTAL: ${(performance.now()-_t0).toFixed(1)}ms`);
  }

  document.getElementById('portfolio-search').addEventListener('input', e => renderPortfolioList(e.target.value));
  document.getElementById('btn-new-project').addEventListener('click', () => openModal(-1));

  // ── Portfolio modal ────────────────────────────────────────────────────────
  function openModal(idx) {
    const _t0 = performance.now();
    editingIdx = idx;
    const p = idx >= 0 ? JSON.parse(JSON.stringify(port[idx])) : {
      id: '', category: 'character', categoryLabel: '角色渲染', size: 'standard',
      title: '', titleEn: '', desc: '', primaryVideo: '',
      webDemo: '', gallery: [], links: [], tags: [], featured: false,
    };
    console.log(`[perf] openModal(${idx}) — deepClone: ${(performance.now()-_t0).toFixed(1)}ms | gallery items: ${p.gallery?.length ?? 0}`);
    document.getElementById('modal-title').textContent = idx >= 0 ? '编辑作品' : '新建作品';
    buildModalForm(p);
    document.getElementById('edit-modal').classList.add('open');
    console.log(`[perf] openModal(${idx}) — TOTAL: ${(performance.now()-_t0).toFixed(1)}ms`);
  }

  function closeModal() { document.getElementById('edit-modal').classList.remove('open'); }
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('edit-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

  function buildModalForm(p) {
    const _t0 = performance.now();
    const body = document.getElementById('modal-body');
    body.innerHTML = '';

    // ── Top preview strip (drag-drop + delete) ─────────────────────────────
    const previewSection = document.createElement('div');
    previewSection.className = 'preview-strip-wrap';
    const previewHead = document.createElement('div');
    previewHead.className = 'preview-strip-head';
    previewHead.innerHTML = '<span>媒体预览</span><span class="strip-hint">拖拽图片/视频到此处导入 · 悬停缩略图可删除</span>';
    previewSection.appendChild(previewHead);

    const strip = document.createElement('div');
    strip.className = 'preview-strip';

    // Hidden file input for click-to-upload
    const filePickerInp = document.createElement('input');
    filePickerInp.type = 'file';
    filePickerInp.accept = 'image/*,video/*';
    filePickerInp.multiple = true;
    filePickerInp.style.display = 'none';

    // Drop placeholder slot (always at end)
    const dropSlot = document.createElement('div');
    dropSlot.className = 'strip-drop-slot';
    dropSlot.innerHTML = '<span class="strip-drop-icon">+</span><span>拖拽或点击上传</span>';
    dropSlot.addEventListener('click', () => filePickerInp.click());

    previewSection.appendChild(strip);
    previewSection.appendChild(filePickerInp);
    body.appendChild(previewSection);

    // galleryListRef will be assigned after buildGalleryList is called
    let galleryListRef = null;

    function makeThumb(src, type, label, onDelete) {
      const div = document.createElement('div');
      div.className = 'preview-thumb';
      div.title = `${label}\n${src}`;
      const badge = document.createElement('span');
      badge.className = 'pt-type';
      badge.textContent = type === 'video' ? '▶' : '■';
      if (type === 'video') {
        const v = document.createElement('video');
        // Defer src until first hover to avoid loading all videos upfront
        v.muted = true; v.loop = true; v.preload = 'none';
        v.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
        let srcLoaded = false;
        v.addEventListener('mouseenter', () => {
          if (!srcLoaded) { v.src = src; srcLoaded = true; }
          v.play().catch(() => {});
        });
        v.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
        div.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.src = src; img.alt = label; img.decoding = 'async';
        img.onerror = () => { img.style.opacity = '0.15'; };
        div.appendChild(img);
      }
      const lbl = document.createElement('span');
      lbl.className = 'pt-label'; lbl.textContent = label;
      div.appendChild(badge); div.appendChild(lbl);

      if (onDelete) {
        const delBtn = document.createElement('button');
        delBtn.className = 'pt-del';
        delBtn.textContent = '×';
        delBtn.title = '删除';
        delBtn.addEventListener('click', e => { e.stopPropagation(); onDelete(); });
        div.appendChild(delBtn);
      }

      div.addEventListener('click', () => window.open(src, '_blank'));
      return div;
    }

    async function handleDroppedFiles(files) {
      const mediaFiles = [...files].filter(f =>
        /\.(png|jpg|jpeg|gif|webp|mp4|webm|mov|avi)$/i.test(f.name));
      if (!mediaFiles.length) return;
      let ok = 0;
      for (const file of mediaFiles) {
        try {
          const path = await fsCopyFile(file);
          const isVideo = /\.(mp4|webm|mov|avi)$/i.test(file.name);
          const label = file.name.replace(/\.[^.]+$/, '');
          galleryListRef.addRow({ type: isVideo ? 'video' : 'image', src: path, label });
          ok++;
        } catch(err) { toast(`✗ ${err.message}`); }
      }
      if (ok) { toast(`✓ 已导入 ${ok} 个文件`); refreshPreview(); }
    }

    filePickerInp.addEventListener('change', () => handleDroppedFiles(filePickerInp.files));

    // Strip drag-and-drop
    // stopPropagation prevents the drop from bubbling to document and causing page navigation
    strip.addEventListener('dragover', e => {
      if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); e.stopPropagation(); strip.classList.add('strip-drag-active'); }
    });
    strip.addEventListener('dragleave', e => {
      if (!strip.contains(e.relatedTarget)) strip.classList.remove('strip-drag-active');
    });
    strip.addEventListener('drop', async e => {
      e.preventDefault(); e.stopPropagation(); strip.classList.remove('strip-drag-active');
      await handleDroppedFiles(e.dataTransfer.files);
    });
    dropSlot.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation(); dropSlot.classList.add('strip-drag-active'); });
    dropSlot.addEventListener('dragleave', () => dropSlot.classList.remove('strip-drag-active'));
    dropSlot.addEventListener('drop', async e => {
      e.preventDefault(); e.stopPropagation(); dropSlot.classList.remove('strip-drag-active');
      await handleDroppedFiles(e.dataTransfer.files);
    });

    function refreshPreview() {
      const _tp = performance.now();
      strip.innerHTML = '';
      const gRows = galleryListRef ? galleryListRef.getRows() : (p.gallery || []);

      gRows.forEach((item, idx) => {
        if (item.type === 'grid') {
          // For grid items, show first image as thumb with grid badge
          const firstImg = item.images && item.images[0];
          if (!firstImg || !firstImg.src) return;
          const thumb = makeThumb(firstImg.src, 'image', item.label || `对比组 #${idx + 1}`, () => {
            galleryListRef.removeRow(idx);
            refreshPreview();
          });
          // Add a small "grid" badge overlay
          const gridBadge = document.createElement('span');
          gridBadge.className = 'pt-type';
          gridBadge.style.cssText = 'background:rgba(180,100,255,0.85);right:20px;left:auto;';
          gridBadge.textContent = '⊞';
          gridBadge.title = `对比图组 — ${item.images.length} 张`;
          thumb.appendChild(gridBadge);
          strip.appendChild(thumb);
        } else {
          if (!item.src) return;
          strip.appendChild(makeThumb(item.src, item.type || 'image', item.label || `#${idx + 1}`, () => {
            galleryListRef.removeRow(idx);
            refreshPreview();
          }));
        }
      });

      strip.appendChild(dropSlot);
      console.log(`[perf] refreshPreview — ${gRows.length} items: ${(performance.now()-_tp).toFixed(1)}ms`);
    }

    // Basic info
    addSep(body, '基本信息');
    const r1 = addRow(body, 'cols2');
    addField(r1, 'ID（唯一标识）', 'f-id', 'text', p.id);

    // 分类字段 + 新增分类按钮
    const catField = document.createElement('div');
    catField.className = 'field';
    catField.innerHTML = `<label>分类</label>`;
    const catRow = document.createElement('div');
    catRow.style.cssText = 'display:flex;gap:6px;align-items:center;';
    const catSel = document.createElement('select');
    catSel.id = 'f-cat';
    catSel.style.flex = '1';
    CAT_OPTIONS.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.value; opt.textContent = o.label;
      if (o.value === p.category) opt.selected = true;
      catSel.appendChild(opt);
    });
    const btnAddCat = document.createElement('button');
    btnAddCat.type = 'button';
    btnAddCat.textContent = '+ 新增';
    btnAddCat.style.cssText = 'padding:5px 10px;font-size:11px;cursor:pointer;border-radius:5px;border:1px solid var(--border-h);background:var(--cyan-dim);color:var(--cyan);white-space:nowrap;flex-shrink:0;';
    btnAddCat.addEventListener('click', () => {
      const val = prompt('分类 value（英文，如 vfx）');
      if (!val || !val.trim()) return;
      const label = prompt('分类显示名称（中文，如 特效）');
      if (!label || !label.trim()) return;
      const newOpt = { value: val.trim(), label: label.trim() };
      CAT_OPTIONS.push(newOpt);
      const opt = document.createElement('option');
      opt.value = newOpt.value; opt.textContent = newOpt.label;
      opt.selected = true;
      catSel.appendChild(opt);
    });
    catRow.appendChild(catSel);
    catRow.appendChild(btnAddCat);
    catField.appendChild(catRow);
    r1.appendChild(catField);

    const r2 = addRow(body, 'cols2');
    addField(r2, '中文标题', 'f-title',   'text', p.title);
    addField(r2, '英文标题', 'f-title-en','text', p.titleEn || '');
    const r3 = addRow(body, '');
    addField(r3, '描述', 'f-desc', 'textarea', p.desc);
    const r4 = addRow(body, 'cols3');
    addField(r4, '卡片尺寸', 'f-size', 'select', p.size, SIZE_OPTIONS.map(v=>({value:v,label:v})));
    const fFeatured = document.createElement('div');
    fFeatured.className = 'field';
    fFeatured.innerHTML = `<label>精选</label>
      <label style="display:flex;align-items:center;gap:8px;margin-top:6px;">
        <input type="checkbox" id="f-featured" ${p.featured ? 'checked' : ''}> FEATURED 标签
      </label>`;
    r4.appendChild(fFeatured);

    // Gallery → 资源库（移到描述下方）
    addSep(body, '资源库 (gallery)');
    const _tGallery = performance.now();
    galleryListRef = buildGalleryList(body, p.gallery || []);
    console.log(`[perf] buildModalForm — buildGalleryList (${(p.gallery||[]).length} items): ${(performance.now()-_tGallery).toFixed(1)}ms`);
    const galleryList = () => galleryListRef.getRows();

    // Links
    addSep(body, '链接按钮 (links)');
    // Web Demo 链接移到这里
    const r6 = addRow(body, '');
    addField(r6, 'Web Demo 链接', 'f-web-demo', 'text', p.webDemo || '');
    const linksList = buildDynList(body, 'links', p.links || [], [
      { key: 'label', label: '文字', type: 'text',   width: '100px' },
      { key: 'url',   label: 'URL',  type: 'text',   flex: 1 },
      { key: 'icon',  label: '图标', type: 'select', options: ICON_OPTIONS.map(v=>({value:v,label:v})), width: '90px' },
    ]);

    // Tags
    addSep(body, '技术标签 (tags)');
    const tagsWrap = document.createElement('div');
    const tagPills = document.createElement('div');
    tagPills.className = 'tag-pills';
    tagPills.id = 'modal-tag-pills';
    const tagInputRow = document.createElement('div');
    tagInputRow.className = 'tag-input-row';
    tagInputRow.innerHTML = `<input id="modal-tag-input" placeholder="输入标签 + 回车 / 点添加"><button id="modal-tag-add">添加</button>`;
    tagsWrap.appendChild(tagPills);
    tagsWrap.appendChild(tagInputRow);
    body.appendChild(tagsWrap);

    let modalTags = [...(p.tags || [])];
    function renderModalTags() {
      tagPills.innerHTML = '';
      modalTags.forEach((t, ti) => {
        const pill = document.createElement('span');
        pill.className = 'tag-pill';
        pill.innerHTML = `${t} <span class="rm">×</span>`;
        pill.querySelector('.rm').addEventListener('click', () => { modalTags.splice(ti, 1); renderModalTags(); });
        tagPills.appendChild(pill);
      });
    }
    renderModalTags();
    const addModalTag = () => {
      const inp = document.getElementById('modal-tag-input');
      const val = inp.value.trim();
      if (val) { modalTags.push(val); inp.value = ''; renderModalTags(); }
    };
    document.getElementById('modal-tag-add').addEventListener('click', addModalTag);
    document.getElementById('modal-tag-input').addEventListener('keydown', e => { if (e.key === 'Enter') addModalTag(); });

    // Save
    document.getElementById('modal-save').onclick = () => {
      const catVal = document.getElementById('f-cat').value;
      const catLabel = CAT_OPTIONS.find(o => o.value === catVal)?.label || catVal;
      const updated = {
        id:            document.getElementById('f-id').value.trim(),
        category:      catVal,
        categoryLabel: catLabel,
        size:          document.getElementById('f-size').value,
        title:         document.getElementById('f-title').value,
        titleEn:       document.getElementById('f-title-en').value,
        desc:          document.getElementById('f-desc').value,
        primaryVideo:  p.primaryVideo || undefined,
        webDemo:       document.getElementById('f-web-demo').value || undefined,
        gallery:       galleryList(),
        links:         linksList(),
        tags:          modalTags,
        featured:      document.getElementById('f-featured').checked,
      };
      if (!updated.id) { alert('请填写 ID'); return; }
      if (!updated.title) { alert('请填写标题'); return; }
      if (editingIdx >= 0) {
        port[editingIdx] = updated;
      } else {
        port.push(updated);
      }
      closeModal();
      renderPortfolioList(document.getElementById('portfolio-search').value);
      toast('作品已保存（未同步）');
    };

    // Initial preview (build after galleryListRef is set)
    const _tPreview = performance.now();
    refreshPreview();
    console.log(`[perf] buildModalForm — refreshPreview: ${(performance.now()-_tPreview).toFixed(1)}ms`);
    console.log(`[perf] buildModalForm — TOTAL: ${(performance.now()-_t0).toFixed(1)}ms`);
  }

  // ── Modal form helpers ────────────────────────────────────────────────────
  function addSep(parent, text) {
    const d = document.createElement('div');
    d.className = 'section-sep';
    d.textContent = text;
    parent.appendChild(d);
  }

  function addRow(parent, cls) {
    const d = document.createElement('div');
    d.className = 'form-row' + (cls ? ' ' + cls : '');
    parent.appendChild(d);
    return d;
  }

  function addField(parent, label, id, type, value, options) {
    const f = document.createElement('div');
    f.className = 'field';
    if (type === 'select') {
      const opts = (options || []).map(o => {
        const v = typeof o === 'string' ? o : o.value;
        const l = typeof o === 'string' ? o : o.label;
        return `<option value="${v}" ${v===value?'selected':''}>${l}</option>`;
      }).join('');
      f.innerHTML = `<label>${label}</label><select id="${id}">${opts}</select>`;
    } else if (type === 'textarea') {
      f.innerHTML = `<label>${label}</label><textarea id="${id}">${value || ''}</textarea>`;
    } else {
      f.innerHTML = `<label>${label}</label><input id="${id}" type="text" value="${(value||'').replace(/"/g,'&quot;')}">`;
    }
    parent.appendChild(f);
    return f;
  }

  // Attach a 📂 browse button to an addField result
  function addFieldBrowseBtn(fieldEl, inputId, filterType, onPick) {
    fieldEl.style.position = 'relative';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-field-browse';
    btn.title = '从 assets 目录中选取';
    btn.textContent = '📂';
    btn.addEventListener('click', () => {
      openAssetBrowser((path, type) => {
        const inp = document.getElementById(inputId);
        if (inp) inp.value = path;
        if (onPick) onPick(path, type);
      }, filterType);
    });
    fieldEl.appendChild(btn);
  }

  function buildDynList(parent, key, items, cols) {
    // Returns a function that collects the current rows
    const wrap = document.createElement('div');
    wrap.className = 'dyn-list';
    parent.appendChild(wrap);

    let rows = items.map(item => Object.assign({}, item));

    function render() {
      wrap.innerHTML = '';
      rows.forEach((row, ri) => {
        const rowEl = document.createElement('div');
        rowEl.className = 'dyn-row';
        cols.forEach(col => {
          if (col.type === 'select') {
            const sel = document.createElement('select');
            sel.style.width = col.width || '80px';
            col.options.forEach(o => {
              const opt = document.createElement('option');
              opt.value = o.value; opt.textContent = o.label;
              if (o.value === row[col.key]) opt.selected = true;
              sel.appendChild(opt);
            });
            sel.addEventListener('change', () => { rows[ri][col.key] = sel.value; });
            rowEl.appendChild(sel);
          } else {
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.value = row[col.key] || '';
            inp.placeholder = col.label;
            inp.style.flex = col.flex || '';
            inp.style.width = col.width || '';
            inp.addEventListener('input', () => { rows[ri][col.key] = inp.value; });
            rowEl.appendChild(inp);
          }
        });
        const delBtn = document.createElement('button');
        delBtn.className = 'btn-icon del';
        delBtn.textContent = '✕';
        delBtn.addEventListener('click', () => { rows.splice(ri, 1); render(); });
        rowEl.appendChild(delBtn);
        wrap.appendChild(rowEl);
      });
      const addEl = document.createElement('div');
      addEl.className = 'dyn-add';
      addEl.textContent = `+ 添加一行`;
      addEl.addEventListener('click', () => {
        const empty = {};
        cols.forEach(c => { empty[c.key] = c.type === 'select' ? c.options[0].value : ''; });
        rows.push(empty);
        render();
      });
      wrap.appendChild(addEl);
    }

    render();
    return () => rows.map(r => Object.assign({}, r));
  }

  // ── Gallery list (with inline mini-preview) ──────────────────────────────
  function buildGalleryList(parent, items) {
    const wrap = document.createElement('div');
    wrap.className = 'dyn-list';
    parent.appendChild(wrap);
    let rows = items.map(item => {
      const r = Object.assign({}, item);
      if (r.type === 'grid')    r.images = (r.images || []).map(img => Object.assign({}, img));
      if (r.type === 'compare') { r.before = Object.assign({}, r.before); r.after = Object.assign({}, r.after); }
      return r;
    });

    function makeMiniPreview(src, type) {
      const div = document.createElement('div');
      div.className = 'dyn-mini-preview';
      if (!src) { div.title = '无预览'; div.textContent = '▤'; return div; }
      div.title = '点击查看';
      if (type === 'video') {
        const v = document.createElement('video');
        v.src = src; v.muted = true; v.preload = 'metadata';
        v.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
        v.addEventListener('mouseenter', () => v.play().catch(() => {}));
        v.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
        div.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.src = src; img.alt = ''; img.decoding = 'async';
        img.onerror = () => { img.style.opacity = '0.15'; };
        div.appendChild(img);
      }
      div.addEventListener('click', () => window.open(src, '_blank'));
      return div;
    }

    // Render a sub-list of images inside a grid row
    function buildGridImages(gridRow, imagesWrap) {
      imagesWrap.innerHTML = '';
      (gridRow.images || []).forEach((imgData, ii) => {
        const imgRow = document.createElement('div');
        imgRow.className = 'dyn-row dyn-grid-img-row';

        const srcInp = document.createElement('input');
        srcInp.type = 'text'; srcInp.value = imgData.src || '';
        srcInp.placeholder = '图片路径'; srcInp.style.flex = '1'; srcInp.style.minWidth = '0';
        srcInp.addEventListener('input', () => { gridRow.images[ii].src = srcInp.value; });
        srcInp.addEventListener('blur', () => {
          miniPv.innerHTML = '';
          miniPv.appendChild(makeMiniPreview(imgData.src, 'image'));
        });

        const browseBtn = document.createElement('button');
        browseBtn.type = 'button';
        browseBtn.className = 'btn-field-browse';
        browseBtn.style.cssText = 'position:static;width:26px;height:26px;flex-shrink:0;';
        browseBtn.title = '从 assets 选取图片';
        browseBtn.textContent = '📂';
        browseBtn.addEventListener('click', () => {
          openAssetBrowser((path) => {
            srcInp.value = path; gridRow.images[ii].src = path;
            miniPv.innerHTML = '';
            miniPv.appendChild(makeMiniPreview(path, 'image'));
          }, 'image');
        });

        const lblInp = document.createElement('input');
        lblInp.type = 'text'; lblInp.value = imgData.label || '';
        lblInp.placeholder = '标签名'; lblInp.style.width = '100px';
        lblInp.addEventListener('input', () => { gridRow.images[ii].label = lblInp.value; });

        const miniPv = document.createElement('div');
        miniPv.style.cssText = 'display:flex;align-items:center;';
        miniPv.appendChild(makeMiniPreview(imgData.src, 'image'));

        const delBtn = document.createElement('button');
        delBtn.className = 'btn-icon del';
        delBtn.textContent = '✕';
        delBtn.addEventListener('click', () => { gridRow.images.splice(ii, 1); buildGridImages(gridRow, imagesWrap); });

        imgRow.appendChild(srcInp);
        imgRow.appendChild(browseBtn);
        imgRow.appendChild(lblInp);
        imgRow.appendChild(miniPv);
        imgRow.appendChild(delBtn);
        imagesWrap.appendChild(imgRow);
      });

      const addImgEl = document.createElement('div');
      addImgEl.className = 'dyn-add dyn-add-sm';
      addImgEl.textContent = '+ 添加图片';
      addImgEl.addEventListener('click', () => {
        gridRow.images.push({ src: '', label: '' });
        buildGridImages(gridRow, imagesWrap);
      });
      imagesWrap.appendChild(addImgEl);
    }

    function render() {
      wrap.innerHTML = '';
      rows.forEach((row, ri) => {
        const isGrid    = row.type === 'grid';
        const isCompare = row.type === 'compare';
        const rowEl = document.createElement('div');
        rowEl.className = isGrid ? 'dyn-row dyn-row--grid-parent' : isCompare ? 'dyn-row dyn-row--compare-parent' : 'dyn-row';

        const topLine = document.createElement('div');
        topLine.className = 'dyn-row-topline';

        // Type select
        const typeSelect = document.createElement('select');
        typeSelect.style.width = '76px';
        ['image', 'video', 'grid', 'compare'].forEach(v => {
          const opt = document.createElement('option');
          opt.value = v; opt.textContent = v;
          if (v === (row.type || 'image')) opt.selected = true;
          typeSelect.appendChild(opt);
        });

        // Grid-specific label input (shown for all types, but more prominent for grid)
        const lblInp = document.createElement('input');
        lblInp.type = 'text'; lblInp.value = row.label || '';
        lblInp.placeholder = isGrid ? '对比组标题' : isCompare ? '对比标题' : '标题'; lblInp.style.width = '110px';
        lblInp.addEventListener('input', () => { rows[ri].label = lblInp.value; });

        // Src input (hidden for grid)
        const srcInp = document.createElement('input');
        srcInp.type = 'text'; srcInp.value = row.src || '';
        srcInp.placeholder = '路径 / URL'; srcInp.style.flex = '1'; srcInp.style.minWidth = '0';
        srcInp.style.display = (isGrid || isCompare) ? 'none' : '';
        srcInp.addEventListener('input', () => { rows[ri].src = srcInp.value; });

        const preview = document.createElement('div');
        preview.style.cssText = 'display:flex;align-items:center;';
        if (!isGrid && !isCompare) {
          srcInp.addEventListener('blur', () => {
            preview.innerHTML = '';
            preview.appendChild(makeMiniPreview(rows[ri].src, rows[ri].type));
          });
          preview.appendChild(makeMiniPreview(row.src, row.type));
        }

        // Browse from assets (hidden for grid)
        const browseBtn = document.createElement('button');
        browseBtn.type = 'button';
        browseBtn.className = 'btn-field-browse';
        browseBtn.style.cssText = `position:static;width:26px;height:26px;flex-shrink:0;${(isGrid || isCompare) ? 'display:none;' : ''}`;
        browseBtn.title = '从 assets 目录中选取';
        browseBtn.textContent = '📂';
        browseBtn.addEventListener('click', () => {
          openAssetBrowser((path, type) => {
            srcInp.value = path; rows[ri].src = path;
            if (type) { rows[ri].type = type; typeSelect.value = type; }
            preview.innerHTML = '';
            preview.appendChild(makeMiniPreview(path, rows[ri].type));
          }, rows[ri].type || 'all');
        });

        // Delete
        const delBtn = document.createElement('button');
        delBtn.className = 'btn-icon del';
        delBtn.textContent = '✕';
        delBtn.addEventListener('click', () => { rows.splice(ri, 1); render(); });

        // Type change handler
        typeSelect.addEventListener('change', () => {
          const newType = typeSelect.value;
          const wasGrid    = rows[ri].type === 'grid';
          const wasCompare = rows[ri].type === 'compare';
          rows[ri].type = newType;
          if (newType === 'grid') {
            if (!rows[ri].images) rows[ri].images = [];
            delete rows[ri].src; delete rows[ri].before; delete rows[ri].after;
          } else if (newType === 'compare') {
            if (!rows[ri].before) rows[ri].before = { src: '', label: '前' };
            if (!rows[ri].after)  rows[ri].after  = { src: '', label: '后' };
            delete rows[ri].src; delete rows[ri].images;
          } else {
            if (wasGrid)    delete rows[ri].images;
            if (wasCompare) { delete rows[ri].before; delete rows[ri].after; }
            if (!rows[ri].src) rows[ri].src = '';
          }
          render();
        });

        topLine.appendChild(typeSelect);
        topLine.appendChild(srcInp);
        topLine.appendChild(browseBtn);
        topLine.appendChild(lblInp);
        topLine.appendChild(preview);
        topLine.appendChild(delBtn);
        rowEl.appendChild(topLine);

        // Images sub-list for grid type
        if (isGrid) {
          const imagesWrap = document.createElement('div');
          imagesWrap.className = 'dyn-grid-images';
          buildGridImages(rows[ri], imagesWrap);
          rowEl.appendChild(imagesWrap);
        }

        // Before/After inputs for compare type
        if (isCompare) {
          const compareWrap = document.createElement('div');
          compareWrap.className = 'dyn-compare-images';

          ['before', 'after'].forEach(side => {
            const sideData = rows[ri][side] || { src: '', label: '' };
            const sideEl = document.createElement('div');
            sideEl.className = 'dyn-compare-side';

            const sideLbl = document.createElement('span');
            sideLbl.className = 'dyn-compare-side__tag';
            sideLbl.textContent = side === 'before' ? '前 (Before)' : '后 (After)';

            const sideSrc = document.createElement('input');
            sideSrc.type = 'text'; sideSrc.value = sideData.src || '';
            sideSrc.placeholder = '图片路径'; sideSrc.style.flex = '1'; sideSrc.style.minWidth = '0';
            sideSrc.addEventListener('input', () => { rows[ri][side].src = sideSrc.value; });

            const sideLabel = document.createElement('input');
            sideLabel.type = 'text'; sideLabel.value = sideData.label || '';
            sideLabel.placeholder = '标签'; sideLabel.style.width = '80px';
            sideLabel.addEventListener('input', () => { rows[ri][side].label = sideLabel.value; });

            const browseCompare = document.createElement('button');
            browseCompare.type = 'button';
            browseCompare.className = 'btn-field-browse';
            browseCompare.style.cssText = 'position:static;width:26px;height:26px;flex-shrink:0;';
            browseCompare.textContent = '📂';
            browseCompare.addEventListener('click', () => {
              openAssetBrowser((path) => {
                sideSrc.value = path;
                rows[ri][side].src = path;
                const prev = sideEl.querySelector('.mini-preview');
                if (prev) prev.remove();
                sideEl.appendChild(makeMiniPreview(path, 'image'));
              }, 'image');
            });

            const preview = makeMiniPreview(sideData.src, 'image');

            sideSrc.addEventListener('blur', () => {
              const prev = sideEl.querySelector('.mini-preview');
              if (prev) prev.remove();
              sideEl.appendChild(makeMiniPreview(rows[ri][side].src, 'image'));
            });

            sideEl.append(sideLbl, sideSrc, browseCompare, sideLabel, preview);
            compareWrap.appendChild(sideEl);
          });

          rowEl.appendChild(compareWrap);
        }

        wrap.appendChild(rowEl);
      });

      const addEl = document.createElement('div');
      addEl.className = 'dyn-add';
      addEl.innerHTML = `
        <span class="dyn-add-opt" data-type="image">+ 图片/视频</span>
        <span class="dyn-add-sep">·</span>
        <span class="dyn-add-opt" data-type="grid">⊞ 对比图组</span>
        <span class="dyn-add-sep">·</span>
        <span class="dyn-add-opt" data-type="compare">⇄ 前后对比</span>`;
      addEl.querySelector('[data-type="image"]').addEventListener('click', () => {
        rows.push({ type: 'image', src: '', label: '' }); render();
      });
      addEl.querySelector('[data-type="grid"]').addEventListener('click', () => {
        rows.push({ type: 'grid', label: '对比', images: [{ src: '', label: '' }] }); render();
      });
      addEl.querySelector('[data-type="compare"]').addEventListener('click', () => {
        rows.push({ type: 'compare', label: '效果对比', before: { src: '', label: '前' }, after: { src: '', label: '后' } }); render();
      });
      wrap.appendChild(addEl);
    }

    render();
    return {
      getRows:   () => rows.map(r => {
        const copy = Object.assign({}, r);
        if (copy.type === 'grid') copy.images = (copy.images || []).map(img => Object.assign({}, img));
        return copy;
      }),
      addRow:    (row) => { rows.push(Object.assign({}, row)); render(); },
      removeRow: (idx) => { rows.splice(idx, 1); render(); },
    };
  }

  // ── Background settings ───────────────────────────────────────────────────
  function initBgSettings() {
    const body = document.getElementById('bg-body');
    if (!body) return;

    const BG_OPTIONS = [
      {
        id:'starNest', label:'✦ 星巢', icon:'✦', name:'星巢', accent:'#00d4ff', rgb:'0,212,255',
        params:[
          {key:'speed',      label:'飞行速度', min:0.001, max:0.05,  step:0.001,  def:0.010},
          {key:'zoom',       label:'缩放',     min:0.3,   max:3.0,   step:0.01,   def:2.000},
          {key:'formuparam', label:'分形参数', min:0.1,   max:0.9,   step:0.01,   def:0.530},
          {key:'brightness', label:'亮度',     min:0.0005,max:0.005, step:0.0001, def:0.0015},
          {key:'darkmatter', label:'暗物质',   min:0.0,   max:1.0,   step:0.01,   def:0.300},
          {key:'distfading', label:'距离衰减', min:0.3,   max:1.0,   step:0.01,   def:0.730},
          {key:'saturation', label:'饱和度',   min:0.0,   max:1.0,   step:0.01,   def:0.850},
          {key:'tonemap',    label:'色调映射', min:1.0,   max:150.0, step:1.0,    def:30.0},
        ],
      },
      {
        id:'clouds', label:'☁ 云彩', icon:'☁', name:'云彩', accent:'#ffb347', rgb:'255,179,71',
        params:[
          {key:'speed',          label:'飞行速度',   min:0.5, max:8.0, step:0.1, def:3.0},
          {key:'mouseInfluence', label:'鼠标影响力', min:0.0, max:3.0, step:0.1, def:1.0},
        ],
      },
      {
        id:'hyperspace', label:'⚡ 超空间', icon:'⚡', name:'超空间', accent:'#ff9944', rgb:'255,153,68',
        params:[
          {key:'speed',       label:'飞行速度', min:0.1, max:2.0,  step:0.05, def:0.40},
          {key:'streak',      label:'拖尾长度', min:0.0, max:3.0,  step:0.05, def:1.0},
          {key:'glow',        label:'发光强度', min:0.2, max:3.0,  step:0.05, def:1.0},
          {key:'colorSpread', label:'色彩范围', min:0.0, max:2.0,  step:0.05, def:1.0},
        ],
      },
    ];

    let bgCfg;
    try { bgCfg = JSON.parse(localStorage.getItem('lcl_bg_config') || '{}'); } catch(e) { bgCfg = {}; }
    if (!bgCfg.bgId)     bgCfg.bgId = 'clouds';
    if (!bgCfg.params)   bgCfg.params = {};

    // Ensure saved params have all keys (fill missing with defaults)
    BG_OPTIONS.forEach(opt => {
      if (!bgCfg.params[opt.id]) bgCfg.params[opt.id] = {};
      opt.params.forEach(p => {
        if (bgCfg.params[opt.id][p.key] == null) bgCfg.params[opt.id][p.key] = p.def;
      });
    });

    body.innerHTML = '';
    let syncPreview = () => {};

    // ── Selector cards ──────────────────────────────────────────────────────
    const selLabel = document.createElement('div');
    selLabel.className = 'bg-section-label';
    selLabel.textContent = '背景类型';
    body.appendChild(selLabel);

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;';

    function refreshCards() {
      grid.querySelectorAll('[data-bgid]').forEach(card => {
        const opt = BG_OPTIONS.find(o => o.id === card.dataset.bgid);
        const active = card.dataset.bgid === bgCfg.bgId;
        card.style.border     = active ? `2px solid ${opt.accent}` : '2px solid var(--border)';
        card.style.background = active ? `rgba(${opt.rgb},0.13)`   : 'var(--bg)';
        card.style.color      = active ? opt.accent                 : 'var(--text2)';
        card.style.fontWeight = active ? '600'                      : '400';
      });
      renderParamPanel();
    }

    BG_OPTIONS.forEach(opt => {
      const card = document.createElement('button');
      card.dataset.bgid = opt.id;
      card.style.cssText = 'padding:18px 8px 14px;border-radius:10px;cursor:pointer;font-size:12px;' +
        'display:flex;flex-direction:column;align-items:center;gap:8px;transition:all .18s;' +
        'border:2px solid var(--border);background:var(--bg);color:var(--text2);';
      card.innerHTML = `<span style="font-size:26px;line-height:1">${opt.icon}</span><span>${opt.name}</span>`;
      card.addEventListener('click', () => { bgCfg.bgId = opt.id; refreshCards(); syncPreview(); });
      grid.appendChild(card);
    });
    body.appendChild(grid);

    // ── Param panel ──────────────────────────────────────────────────────────
    const paramWrap = document.createElement('div');
    paramWrap.id = 'bg-param-wrap';
    body.appendChild(paramWrap);

    function fmt(v, step) { return v.toFixed(step < 0.01 ? 4 : step < 0.1 ? 2 : 1); }

    function renderParamPanel() {
      paramWrap.innerHTML = '';
      const opt = BG_OPTIONS.find(o => o.id === bgCfg.bgId);
      if (!opt) return;

      const pLabel = document.createElement('div');
      pLabel.className = 'bg-section-label';
      pLabel.style.cssText += `color:${opt.accent};`;
      pLabel.textContent = `${opt.icon} ${opt.name} 默认参数`;
      paramWrap.appendChild(pLabel);

      const sliderGrid = document.createElement('div');
      sliderGrid.style.cssText = 'display:grid;grid-template-columns:repeat(2,1fr);gap:10px 20px;margin-bottom:14px;';

      opt.params.forEach(p => {
        const row = document.createElement('div');
        const top = document.createElement('div');
        top.style.cssText = 'display:flex;justify-content:space-between;margin-bottom:4px;';
        const lbl = document.createElement('span');
        lbl.style.cssText = 'font-size:11px;color:var(--text3);';
        lbl.textContent = p.label;
        const valEl = document.createElement('span');
        valEl.style.cssText = `font-size:11px;font-weight:600;color:${opt.accent};font-variant-numeric:tabular-nums;`;
        valEl.textContent = fmt(bgCfg.params[opt.id][p.key], p.step);
        top.appendChild(lbl); top.appendChild(valEl);

        const slider = document.createElement('input');
        slider.type = 'range'; slider.min = p.min; slider.max = p.max;
        slider.step = p.step; slider.value = bgCfg.params[opt.id][p.key];
        slider.style.cssText = `width:100%;accent-color:${opt.accent};cursor:pointer;display:block;height:3px;`;
        slider.addEventListener('input', () => {
          const v = parseFloat(slider.value);
          bgCfg.params[opt.id][p.key] = v;
          valEl.textContent = fmt(v, p.step);
          syncPreview();
        });

        row.appendChild(top); row.appendChild(slider);
        sliderGrid.appendChild(row);
      });
      paramWrap.appendChild(sliderGrid);

      // Reset defaults button
      const resetBtn = document.createElement('button');
      resetBtn.className = 'btn-secondary';
      resetBtn.style.cssText = 'font-size:11px;padding:5px 14px;margin-bottom:14px;';
      resetBtn.textContent = '↺ 恢复该背景默认值';
      resetBtn.addEventListener('click', () => {
        opt.params.forEach(p => { bgCfg.params[opt.id][p.key] = p.def; });
        renderParamPanel();
      });
      paramWrap.appendChild(resetBtn);
    }

    refreshCards();

    // ── Section opacity + blur ──────────────────────────────────────────
    if (bgCfg.sectionOpacity == null) bgCfg.sectionOpacity = 0.88;
    if (bgCfg.sectionBlur    == null) bgCfg.sectionBlur    = 16;

    const opLabel = document.createElement('div');
    opLabel.className = 'bg-section-label';
    opLabel.textContent = '页面遮罩';
    body.appendChild(opLabel);

    function makeSliderRow(labelText, min, max, step, initVal, color, onChange) {
      const row = document.createElement('div');
      row.style.cssText = 'margin-bottom:12px;';
      const top = document.createElement('div');
      top.style.cssText = 'display:flex;justify-content:space-between;margin-bottom:4px;';
      const lbl = document.createElement('span');
      lbl.style.cssText = 'font-size:11px;color:var(--text3);';
      lbl.textContent = labelText;
      const valEl = document.createElement('span');
      valEl.style.cssText = `font-size:11px;font-weight:600;color:${color};font-variant-numeric:tabular-nums;`;
      valEl.textContent = step < 0.1 ? initVal.toFixed(2) : initVal.toFixed(0);
      top.appendChild(lbl); top.appendChild(valEl);
      const slider = document.createElement('input');
      slider.type = 'range'; slider.min = min; slider.max = max;
      slider.step = step; slider.value = initVal;
      slider.style.cssText = `width:100%;accent-color:${color};cursor:pointer;display:block;height:3px;`;
      slider.addEventListener('input', () => {
        const v = parseFloat(slider.value);
        valEl.textContent = step < 0.1 ? v.toFixed(2) : v.toFixed(0);
        onChange(v);
      });
      row.appendChild(top); row.appendChild(slider);
      return row;
    }

    body.appendChild(makeSliderRow('内容区背景透明度（越大越不透明）', 0, 1, 0.01, bgCfg.sectionOpacity, 'var(--cyan)', v => { bgCfg.sectionOpacity = v; syncPreview(); }));
    body.appendChild(makeSliderRow('内容区模糊度 (px)', 0, 40, 1, bgCfg.sectionBlur, 'var(--cyan)', v => { bgCfg.sectionBlur = v; syncPreview(); }));

    // ── Save button ──────────────────────────────────────────────────────────
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-primary';
    saveBtn.textContent = '💾 保存背景设置';
    saveBtn.addEventListener('click', () => {
      localStorage.setItem('lcl_bg_config', JSON.stringify(bgCfg));
      toast('✓ 已保存 — 刷新主页后生效');
    });
    body.appendChild(saveBtn);

    // ── Live preview iframe (lazy-loaded on demand) ───────────────────
    const pvLabel = document.createElement('div');
    pvLabel.className = 'bg-section-label';
    pvLabel.style.marginTop = '24px';
    pvLabel.textContent = '实时预览';
    body.appendChild(pvLabel);

    const pvWrap = document.createElement('div');
    pvWrap.style.cssText = 'position:relative;width:100%;height:260px;border-radius:12px;overflow:hidden;' +
      'border:1px solid var(--border);background:#050510;display:flex;align-items:center;justify-content:center;';

    // Placeholder until user clicks load
    const pvPlaceholder = document.createElement('button');
    pvPlaceholder.className = 'btn-secondary';
    pvPlaceholder.textContent = '▶ 点击加载预览';
    pvPlaceholder.style.cssText = 'font-size:12px;padding:8px 20px;cursor:pointer;';
    pvWrap.appendChild(pvPlaceholder);

    let pvIframe = null;

    pvPlaceholder.addEventListener('click', () => {
      pvPlaceholder.remove();
      pvIframe = document.createElement('iframe');
      pvIframe.src = 'index.html';
      pvIframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;pointer-events:none;display:block;';
      pvIframe.setAttribute('scrolling', 'no');
      pvWrap.appendChild(pvIframe);
      pvIframe.addEventListener('load', () => { setTimeout(syncPreview, 700); });
    });

    const pvHint = document.createElement('div');
    pvHint.style.cssText = 'position:absolute;bottom:0;left:0;right:0;padding:6px 12px;' +
      'background:rgba(0,0,0,0.55);backdrop-filter:blur(6px);' +
      'font-size:10px;color:rgba(255,255,255,0.45);letter-spacing:.06em;pointer-events:none;';
    pvHint.textContent = '可实时预览背景和Shader参数效果，保存后刷新主页生效';
    pvWrap.appendChild(pvHint);
    body.appendChild(pvWrap);

    // Define the real syncPreview after iframe is created
    syncPreview = () => {
      if (!pvIframe) return;
      try {
        pvIframe.contentWindow.postMessage(
          { type: 'lcl-bg-preview', cfg: JSON.parse(JSON.stringify(bgCfg)) }, '*'
        );
      } catch(e) {}
    };
    // No auto-load: user triggers it
  }

  // ── Security / change password ────────────────────────────────────────────
  function initSecurity() {    const btn = document.getElementById('sec-change-btn');
    const msgEl = document.getElementById('sec-msg');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      const curPwd     = document.getElementById('sec-cur-pwd').value;
      const newPwd     = document.getElementById('sec-new-pwd').value;
      const confirmPwd = document.getElementById('sec-confirm-pwd').value;

      msgEl.style.color = 'var(--red)';
      if (!curPwd)     { msgEl.textContent = '请输入当前密码'; return; }
      if (!newPwd)     { msgEl.textContent = '请输入新密码'; return; }
      if (newPwd.length < 6) { msgEl.textContent = '新密码至少 6 位'; return; }
      if (newPwd !== confirmPwd) { msgEl.textContent = '两次输入的新密码不一致'; return; }

      const curHash = await sha256(curPwd);
      if (curHash !== getPwdHash()) {
        msgEl.textContent = '当前密码错误';
        document.getElementById('sec-cur-pwd').value = '';
        return;
      }

      const newHash = await sha256(newPwd);
      localStorage.setItem(STORED_HASH_KEY, newHash);
      document.getElementById('sec-cur-pwd').value     = '';
      document.getElementById('sec-new-pwd').value     = '';
      document.getElementById('sec-confirm-pwd').value = '';
      msgEl.style.color = 'var(--green)';
      msgEl.textContent = '✓ 密码已修改，下次登录使用新密码';
      toast('密码已更新');
    });
  }

  // ── Save JS + Preview ────────────────────────────────────────────────────
  document.getElementById('btn-save').addEventListener('click', async () => {
    if (!rootDirHandle) {
      toast('请先点击顶栏「📁 授权项目目录」按钮，选择 LcL-Web 根目录', '#ff9944');
      return;
    }
    collectHero(); collectAbout(); collectContact();
    await Promise.all([
      exportJsFile('site-config.js', `const SITE_CONFIG = ${JSON.stringify(cfg, null, 2)};\n`),
      exportJsFile('portfolio-data.js', `const PORTFOLIO = ${JSON.stringify(port, null, 2)};\n`),
    ]);
    toast('✓ 已保存！正在打开预览…');
    window.open('index.html', '_blank');
  });

  // ── Reset to defaults ─────────────────────────────────────────────────────
  document.getElementById('btn-reset').addEventListener('click', () => {
    if (!confirm('重置所有内容为 JS 默认值？')) return;
    cfg  = loadCfg();
    port = loadPort();
    initHero(); initAbout(); initContact();
    renderPortfolioList();
    setStatus('已重置为默认数据');
    toast('已重置', '#ff9944');
  });

  // ── Export JS files to js/ ────────────────────────────────────────────────
  async function exportJsFile(filename, content) {
    if (rootDirHandle) {
      try {
        const jsDir = await rootDirHandle.getDirectoryHandle('js', { create: false });
        const fh = await jsDir.getFileHandle(filename, { create: true });
        const writable = await fh.createWritable();
        await writable.write(content);
        await writable.close();
        toast(`✓ 已写入 js/${filename}`);
        return;
      } catch(e) {
        toast(`写入失败，改为下载: ${e.message}`, '#ff9944');
      }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/javascript' }));
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`↓ 已下载 ${filename}，上传到服务器 js/ 目录覆盖即可`);
  }

  document.getElementById('btn-export-site').addEventListener('click', () => {
    collectHero(); collectAbout(); collectContact();
    exportJsFile('site-config.js', `const SITE_CONFIG = ${JSON.stringify(cfg, null, 2)};\n`);
  });

  document.getElementById('btn-export-portfolio').addEventListener('click', () => {
    exportJsFile('portfolio-data.js', `const PORTFOLIO = ${JSON.stringify(port, null, 2)};\n`);
  });

  function downloadFile(filename, content) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/javascript' }));
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`↓ 已下载 ${filename}（未授权目录，请手动覆盖项目文件）`);
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  initHero();
  initAbout();
  initContact();
  initSecurity();
  initBgSettings();
  renderPortfolioList();

  // ── Scroll perf probe ─────────────────────────────────────────────────────
  // Detects long frames during scroll; remove after diagnosis
  (function installScrollProbe() {
    const scroller = document.querySelector('.content') || document.documentElement;
    let scrollRafId = null;
    let lastScrollT = 0;
    scroller.addEventListener('scroll', () => {
      const now = performance.now();
      if (now - lastScrollT > 16) {
        // Gap > 16ms between scroll events → frame drop
        console.log(`[perf] scroll frame gap: ${(now - lastScrollT).toFixed(1)}ms`);
      }
      lastScrollT = now;

      if (scrollRafId) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = null;
        // Use PerformanceObserver for long tasks (> 50ms)
      });
    }, { passive: true });

    // Long task observer — fires whenever JS blocks >50ms
    if (window.PerformanceObserver) {
      try {
        const po = new PerformanceObserver(list => {
          list.getEntries().forEach(e => {
            console.warn(`[perf] ⚠ LONG TASK: ${e.duration.toFixed(1)}ms @ ${e.startTime.toFixed(0)}ms — attribution:`, e.attribution?.[0]?.name || 'unknown');
          });
        });
        po.observe({ type: 'longtask', buffered: true });
        console.log('[perf] PerformanceObserver (longtask) installed');
      } catch(e) { /* not supported */ }
    }
  })();

})();
