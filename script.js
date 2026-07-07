'use strict';

/* ═══════════════════════════════════════════════════════════════════════════
   SKILL LEVEL MAP  (text value in JSON → percentage)
   ═══════════════════════════════════════════════════════════════════════════ */
const SKILL_LEVELS = {
  Advanced: 88, Fortgeschritten: 88,
  Intermediate: 60, Mittelstufe: 60,
  Native: 100, Muttersprache: 100,
  Fluent: 85, 'Fließend': 85,
  'Cross-platform': 82
};

const CHIP_COLORS = {
  Backend: '#4dd0e1', Frontend: '#a78bfa',
  'Cross-platform': '#34d399',
  Native: '#f59e0b', Muttersprache: '#f59e0b',
  Fluent: '#4dd0e1', 'Fließend': '#4dd0e1'
};

/* ═══════════════════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);
let lang  = localStorage.getItem('lang')  || 'en';
let theme = localStorage.getItem('theme') || 'dark';

// Cache loaded JSON so we don't re-fetch on language toggle
const cache = {};

/* ═══════════════════════════════════════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════════════════════════════════════ */
function applyTheme(t) {
  theme = t;
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
}
applyTheme(theme);
$('themeToggle').addEventListener('click', () => applyTheme(theme === 'dark' ? 'light' : 'dark'));

/* ═══════════════════════════════════════════════════════════════════════════
   JSON LOADER
   ═══════════════════════════════════════════════════════════════════════════ */
async function loadLang(l) {
  if (cache[l]) return cache[l];
  const res = await fetch(`${l}.json`);
  if (!res.ok) throw new Error(`Failed to load ${l}.json`);
  cache[l] = await res.json();
  return cache[l];
}

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS BACKGROUND — geometric mesh with slow-morphing triangulated fields
   ═══════════════════════════════════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = $('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, nodes;

  // Simple Delaunay-style triangulation using closest-3 neighbour approach
  // (true Delaunay is too expensive per frame; we precompute edges instead)
  const MAX_NODES    = 55;
  const EDGE_DIST    = 200;  // max px to draw an edge
  const TRI_DIST     = 240;  // max px to fill a triangle
  const SPEED        = 0.07; // px per frame

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildNodes();
  }

  function buildNodes() {
    const count = Math.min(Math.floor(W * H / 18000), MAX_NODES);
    nodes = Array.from({length: count}, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      // Slow random target drift
      tx: Math.random() * W,
      ty: Math.random() * H,
      speed: SPEED * (0.4 + Math.random() * 0.6),
    }));
  }

  function stepNode(n) {
    const dx = n.tx - n.x;
    const dy = n.ty - n.y;
    const d  = Math.sqrt(dx*dx + dy*dy);
    if (d < 2) {
      // Pick a new target near current position — slow organic drift
      n.tx = Math.max(0, Math.min(W, n.x + (Math.random() - 0.5) * W * 0.18));
      n.ty = Math.max(0, Math.min(H, n.y + (Math.random() - 0.5) * H * 0.18));
    } else {
      n.x += (dx / d) * n.speed;
      n.y += (dy / d) * n.speed;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const cr = isDark ? '77,208,225'  : '0,151,167';
    const pr = isDark ? '167,139,250' : '124,58,237';

    nodes.forEach(stepNode);

    // Draw triangles first (filled)
    for (let i = 0; i < nodes.length - 2; i++) {
      for (let j = i + 1; j < nodes.length - 1; j++) {
        const dij = dist(nodes[i], nodes[j]);
        if (dij > TRI_DIST) continue;
        for (let k = j + 1; k < nodes.length; k++) {
          const dik = dist(nodes[i], nodes[k]);
          if (dik > TRI_DIST) continue;
          const djk = dist(nodes[j], nodes[k]);
          if (djk > TRI_DIST) continue;

          // Fade by average distance
          const avgD = (dij + dik + djk) / 3;
          const alpha = (1 - avgD / TRI_DIST) * (isDark ? 0.10 : 0.13);

          // Interpolate color between cyan and purple by y position
          const cy = (nodes[i].y + nodes[j].y + nodes[k].y) / 3 / H;
          const color = cy < 0.5
            ? `rgba(${cr},${alpha})`
            : `rgba(${pr},${alpha})`;

          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.lineTo(nodes[k].x, nodes[k].y);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
    }

    // Draw edges on top
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = dist(nodes[i], nodes[j]);
        if (d > EDGE_DIST) continue;
        const t = 1 - d / EDGE_DIST;
        const alpha = t * (isDark ? 0.65 : 0.70);
        // Gradient from cyan (top) to purple (bottom) per edge midpoint
        const my = (nodes[i].y + nodes[j].y) / 2 / H;
        const edgeColor = my < 0.5 ? `rgba(${cr},${alpha})` : `rgba(${pr},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = t * 1.2 + 0.3;
        ctx.stroke();
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      const ny = n.y / H;
      const nodeColor = ny < 0.5 ? `rgba(${cr},${isDark ? 0.85 : 0.9})` : `rgba(${pr},${isDark ? 0.85 : 0.9})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  function dist(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx*dx + dy*dy);
  }

  window.addEventListener('resize', resize, {passive: true});
  resize();
  draw();
})();

/* ═══════════════════════════════════════════════════════════════════════════
   CURSOR GLOW
   ═══════════════════════════════════════════════════════════════════════════ */
(function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return;
  let tx = -1000, ty = -1000, cx = -1000, cy = -1000;
  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, {passive: true});
  (function update() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(update);
  })();
})();

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.08, rootMargin: '0px 0px -40px 0px'});

function setupReveal() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTIVE NAV
   ═══════════════════════════════════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, {threshold: 0.3, rootMargin: '-64px 0px -40% 0px'});
  sections.forEach(s => obs.observe(s));
})();

/* ═══════════════════════════════════════════════════════════════════════════
   COUNTING ANIMATION
   ═══════════════════════════════════════════════════════════════════════════ */
function animateCount(el, target, duration = 2800) {
  const start = performance.now();
  (function step(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target);
    if (t < 1) requestAnimationFrame(step);
  })(start);
}

/* ═══════════════════════════════════════════════════════════════════════════
   TYPEWRITER
   ═══════════════════════════════════════════════════════════════════════════ */
let _twTimer = null;
function typewriter(el, text, speed = 36) {
  // Cancel any in-progress typewriter to avoid mixed characters on fast lang switch
  if (_twTimer) { clearTimeout(_twTimer); _twTimer = null; }
  el.textContent = '';
  const existingCursor = el.parentElement && el.parentElement.querySelector('.typed-cursor');
  if (existingCursor) existingCursor.remove();
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  if (el.parentElement) el.parentElement.insertBefore(cursor, el.nextSibling);
  let i = 0;
  (function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      _twTimer = setTimeout(type, speed + Math.random() * 16);
    } else {
      _twTimer = null;
    }
  })();
}

/* ═══════════════════════════════════════════════════════════════════════════
   SKILL BAR OBSERVER
   ═══════════════════════════════════════════════════════════════════════════ */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar__fill').forEach(fill => {
        fill.style.width = fill.dataset.pct + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.15});

function animateBarsIn(container) {
  container.querySelectorAll('.skill-bar__fill').forEach(f => f.style.width = '0');
  barObserver.observe(container);
}

/* ═══════════════════════════════════════════════════════════════════════════
   RENDER HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */
function plain(html) {
  return (html || '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim();
}

function delayClass(i) {
  return 'reveal-delay-' + Math.min((i % 4) + 1, 5);
}

function renderProjects(list) {
  const g = $('projectsGrid'); g.innerHTML = '';
  list.forEach((p, i) => {
    const el = document.createElement(p.link ? 'a' : 'div');
    el.className = `project-card reveal ${delayClass(i)}`;
    if (p.link) { el.href = p.link; el.target = '_blank'; el.rel = 'noopener'; }
    el.innerHTML = `
      ${p.tag ? `<div class="project-card__tag">${p.tag}</div>` : ''}
      <div class="project-card__title">${p.title}</div>
      <div class="project-card__text">${plain(p.text)}</div>
      ${p.link ? '<div class="project-card__cta">View on GitHub →</div>' : ''}`;
    g.appendChild(el);
  });
}

function renderCertificates(list) {
  const g = $('certificatesGrid'); g.innerHTML = '';
  list.forEach((c, i) => {
    const el = document.createElement(c.link ? 'a' : 'div');
    el.className = `card${c.link ? ' card--link' : ''} reveal ${delayClass(i)}`;
    if (c.link) { el.href = c.link; el.target = '_blank'; el.rel = 'noopener'; }
    el.innerHTML = `<div class="card__title">${c.title}</div><div class="card__sub">${c.text}</div>`;
    g.appendChild(el);
  });
}

function renderTimeline(list) {
  const tl = $('schoolWorkTimeline'); tl.innerHTML = '';

  // Animated track line
  const track = document.createElement('div');
  track.className = 'timeline-track';
  const fill = document.createElement('div');
  fill.className = 'timeline-track__fill';
  track.appendChild(fill);
  tl.appendChild(track);

  const trackObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { fill.style.height = '100%'; trackObs.unobserve(entry.target); }
    });
  }, {threshold: 0.2});
  trackObs.observe(tl);

  list.forEach((item, i) => {
    const el = document.createElement(item.link ? 'a' : 'div');
    el.className = `timeline-item reveal reveal-delay-${Math.min(i + 1, 5)}`;
    if (item.link) { el.href = item.link; el.target = '_blank'; el.rel = 'noopener'; }

    // Extract year/date portion for the badge (last part after · or -)
    const badge = item.text || '';

    el.innerHTML = `
      <div class="timeline-item__card">
        <div class="timeline-item__body">
          <div class="timeline-item__title">${item.title}</div>
        </div>
        <div class="timeline-item__badge">${badge}</div>
      </div>`;
    tl.appendChild(el);
  });
}

function renderVoluntary(list) {
  const g = $('voluntaryGrid'); g.innerHTML = '';
  list.forEach((item, i) => {
    const el = document.createElement(item.link ? 'a' : 'div');
    el.className = `card${item.link ? ' card--link' : ''} reveal reveal-delay-${Math.min(i + 1, 5)}`;
    if (item.link) { el.href = item.link; el.target = '_blank'; el.rel = 'noopener'; }
    el.innerHTML = `
      <div class="card__title">${item.title}</div>
      <div class="card__sub" style="margin-top:.3rem;line-height:1.65">${plain(item.text)}</div>`;
    g.appendChild(el);
  });
}

function renderSkillBars(containerId, list) {
  const c = $(containerId); c.innerHTML = '';
  list.forEach(item => {
    const pct = SKILL_LEVELS[item.text] || 60;
    const wrap = document.createElement('div');
    wrap.className = 'skill-bar';
    wrap.innerHTML = `
      <span class="skill-bar__name">${item.title}</span>
      <div class="skill-bar__track"><div class="skill-bar__fill" data-pct="${pct}"></div></div>
      <span class="skill-bar__pct">${pct}%</span>`;
    c.appendChild(wrap);
  });
  animateBarsIn(c);
}

function renderChips(containerId, list) {
  const c = $(containerId); c.innerHTML = '';
  list.forEach(item => {
    const color = CHIP_COLORS[item.text] || '#4dd0e1';
    const span = document.createElement('span');
    span.className = 'skill-chip';
    span.innerHTML = `<span class="skill-chip__dot" style="background:${color}"></span>${item.title}`;
    c.appendChild(span);
  });
}

function renderStats(d) {
  const statsEl = $('heroStats');
  if (!statsEl) return;
  const certCount      = Array.isArray(d.certificates) ? d.certificates.length : 22;
  const projCount      = Array.isArray(d.projects)     ? d.projects.length     : 8;
  const progCount      = Array.isArray(d.programming)  ? d.programming.length  : 11;
  const spokenCount    = Array.isArray(d.languages)    ? d.languages.length    : 2;
  const frameworkCount = Array.isArray(d.frameworks)   ? d.frameworks.length   : 6;
  const dbCount        = Array.isArray(d.databases)    ? d.databases.length    : 5;

  statsEl.innerHTML = `
    <a class="hero-stat" href="#projects" aria-label="Go to projects">
      <div class="hero-stat__num"><span class="stat-num" data-target="${projCount}">0</span><span class="stat-accent">+</span></div>
      <div class="hero-stat__label">${d.stat_projects || 'Projects'}</div>
    </a>
    <a class="hero-stat" href="#certificates" aria-label="Go to certificates">
      <div class="hero-stat__num"><span class="stat-num" data-target="${certCount}">0</span><span class="stat-accent">+</span></div>
      <div class="hero-stat__label">${d.stat_certs || 'Certificates'}</div>
    </a>
    <a class="hero-stat" href="#skills" aria-label="Go to programming languages">
      <div class="hero-stat__num"><span class="stat-num" data-target="${progCount}">0</span><span class="stat-accent">+</span></div>
      <div class="hero-stat__label">${d.stat_prog_langs || 'Prog. Languages'}</div>
    </a>
    <a class="hero-stat" href="#skills" aria-label="Go to frameworks">
      <div class="hero-stat__num"><span class="stat-num" data-target="${frameworkCount}">0</span><span class="stat-accent">+</span></div>
      <div class="hero-stat__label">${d.stat_frameworks || 'Frameworks'}</div>
    </a>
    <a class="hero-stat" href="#skills" aria-label="Go to databases">
      <div class="hero-stat__num"><span class="stat-num" data-target="${dbCount}">0</span><span class="stat-accent">+</span></div>
      <div class="hero-stat__label">${d.stat_databases || 'Databases'}</div>
    </a>
    <a class="hero-stat" href="#skills" aria-label="Go to spoken languages">
      <div class="hero-stat__num"><span class="stat-num" data-target="${spokenCount}">0</span></div>
      <div class="hero-stat__label">${d.stat_spoken_langs || 'Spoken Languages'}</div>
    </a>`;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(el => animateCount(el, +el.dataset.target));
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.5});
  obs.observe(statsEl);
}

function renderBadges(badges) {
  const el = $('aboutBadges');
  if (!el || !Array.isArray(badges)) return;
  el.innerHTML = badges.map(b =>
    `<span class="about-badge"><span class="badge-icon">${b.icon}</span>${b.label}</span>`
  ).join('');
}

/* ═══════════════════════════════════════════════════════════════════════════
   AGE CALCULATOR HELPER
   ═══════════════════════════════════════════════════════════════════════════ */
function calculateAge(birthDateStr) {
  if (!birthDateStr) return '';
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/* ═══════════════════════════════════════════════════════════════════════════
   APPLY LANGUAGE  — fetches JSON, populates every element
   ═══════════════════════════════════════════════════════════════════════════ */
async function applyLang(l) {
  lang = l;
  localStorage.setItem('lang', l);

  let d;
  try {
    d = await loadLang(l);
  } catch (e) {
    console.error(e);
    return;
  }

  // ── Static text nodes (data-key elements) ───────────────────────────────
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (typeof d[key] === 'string') {
      let textValue = d[key];
      
      // Dynamically calculate and inject age if it's the about_text
      if (key === 'about_text' && d.birth_date) {
        const currentAge = calculateAge(d.birth_date);
        textValue = textValue.replace('{age}', currentAge);
      }
      
      el.textContent = textValue;
    }
  });

  // ── Hero title: typewriter ───────────────────────────────────────────────
  const heroTitleEl = document.querySelector('.hero-title');
  if (heroTitleEl && d.hero_title) typewriter(heroTitleEl, d.hero_title);

  // ── Hero eyebrow ─────────────────────────────────────────────────────────
  const eyebrow = document.querySelector('.hero-eyebrow');
  if (eyebrow && d.hero_eyebrow) eyebrow.textContent = d.hero_eyebrow;

  // ── Hero buttons ─────────────────────────────────────────────────────────
  const heroBtn = document.querySelector('.hero-actions .btn:not(.btn--ghost)');
  if (heroBtn && d.hero_btn) heroBtn.textContent = d.hero_btn;
  const heroGhost = document.querySelector('.hero-actions .btn--ghost');
  if (heroGhost && d.hero_contact) heroGhost.textContent = d.hero_contact;

  // ── Contact buttons ──────────────────────────────────────────────────────
  const emailBtn = $('emailBtn');
  if (emailBtn && d.contact_btn) emailBtn.textContent = d.contact_btn;
  const githubBtn = $('githubBtn');
  if (githubBtn && d.github_btn) githubBtn.textContent = d.github_btn;

  // ── Dynamic sections ─────────────────────────────────────────────────────
  renderStats(d);
  renderBadges(d.about_badges);
  if (d.projects)     renderProjects(d.projects);
  if (d.certificates) renderCertificates(d.certificates);
  if (d.schoolWork)   renderTimeline(d.schoolWork);
  if (d.voluntary)    renderVoluntary(d.voluntary);
  if (d.programming)  renderSkillBars('programmingBars', d.programming);
  if (d.databases)    renderSkillBars('databasesBars', d.databases);
  if (d.frameworks)   renderChips('frameworksChips', d.frameworks);
  if (d.languages)    renderChips('languagesChips', d.languages);

  // ── Language toggle button label ─────────────────────────────────────────
  const btn = $('langToggle');
  if (btn) btn.textContent = l === 'en' ? 'DE' : 'EN';

  // ── Page lang attribute ──────────────────────────────────────────────────
  document.documentElement.lang = l;

  // ── Re-run reveal observer on newly rendered cards ───────────────────────
  setTimeout(setupReveal, 60);
}

$('langToggle').addEventListener('click', () => applyLang(lang === 'en' ? 'de' : 'en'));

/* ═══════════════════════════════════════════════════════════════════════════
   HAMBURGER
   ═══════════════════════════════════════════════════════════════════════════ */
const hamburger = $('hamburger');
const menuRight  = $('menuRight');

hamburger.addEventListener('click', () => {
  const open = menuRight.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    menuRight.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
   HEADER SCROLL
   ═══════════════════════════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  $('header').classList.toggle('scrolled', window.scrollY > 10);
}, {passive: true});

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL TO TOP
   ═══════════════════════════════════════════════════════════════════════════ */
const scrollBtn = $('scrollTopBtn');
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('visible', window.scrollY > 400);
}, {passive: true});
scrollBtn.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

/* ═══════════════════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════════════════ */

// Section title reveals
document.querySelectorAll('.section-title').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// GitHub card reveals
document.querySelectorAll('.github-card').forEach(el => {
  revealObserver.observe(el);
});

// Hero entrance — stagger children in
document.querySelectorAll('.hero-inner > *').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i * 0.1) + 's';
  // Force trigger after a short delay (they're above the fold)
  setTimeout(() => el.classList.add('visible'), 120 + i * 90);
});

// Load initial language from JSON
applyLang(lang);
