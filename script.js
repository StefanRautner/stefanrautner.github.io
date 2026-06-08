'use strict';

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */
const SKILL_LEVELS = {
  Advanced:       88,
  Fortgeschritten:88,
  Intermediate:   60,
  Mittelstufe:    60,
  Native:        100,
  Muttersprache: 100,
  Fluent:         85,
  'Fließend':     85
};

/* Chip accent colors by category */
const CHIP_COLORS = {
  Backend:      '#4dd0e1',
  Frontend:     '#a78bfa',
  'Cross-platform': '#34d399',
  Native:       '#f59e0b',
  Muttersprache:'#f59e0b',
  Fluent:       '#4dd0e1',
  'Fließend':   '#4dd0e1',
};

const T = {
  en: {
    nav_home:'Home', nav_about:'About', nav_projects:'Projects',
    nav_certificates:'Certificates', nav_school_work:'School / Work',
    nav_voluntary:'Voluntary', nav_frameworks:'Frameworks',
    nav_languages:'Languages', nav_programming:'Programming',
    nav_databases:'Databases', nav_github_stats:'GitHub Stats',
    nav_skills:'Skills', nav_contact:'Contact',
    hero_title:'I Build Smart &amp; Secure Digital Experiences',
    hero_text:'"Debugging is like being the detective in a crime movie where you are also the murderer." — Filipe Fortes',
    hero_btn:'View Projects →', hero_contact:'Get in touch',
    about_text:"I'm Stefan Rautner, 19 years old, and I develop smart home systems & automations that are reliable, secure, and practical for everyday life.",
    contact_title:'Get In Touch',
    contact_text:'Available for collaboration and freelance projects.',
    contact_btn:'Email Me',
    footer_text:'© 2026 Stefan Rautner · All Rights Reserved.',

    projects:[
      {title:'Löschwasserförderung', text:'Multi-platform app for calculating relay lines for Austrian Fire Brigades. Used operationally in the field.', link:'https://github.com/fitforfire/loeschwasserfoerderung.at'},
      {title:'SparkNet', text:'Cross-platform smart home system integrating automation, security, AI assistance, and remote device management with voice control and image recognition.'},
      {title:'KiAuto-Windows', text:'Windows port of KiAuto — a CLI tool for exporting circuit diagrams and views from the KiCad EDA program.', link:'https://github.com/StefanRautner/KiAuto-Windows'},
      {title:'TinyWhatsApp', text:'Multi-platform chat application communicating with a central server and database.', link:'https://github.com/StefanRautner/ChatProgram'},
      {title:'MBot-Controller', text:'WebApp and intermediate server for controlling and displaying sensor data of an MBot2 over WLAN.', link:'https://github.com/StefanRautner/MBotController'},
      {title:'Loeschzeit', text:'Timing app for children\'s water-spraying competitions at volunteer fire department festivals.'},
      {title:'SnackSignal', text:'Festival ordering system supporting cash and card payments with real-time order management.'},
      {title:'Nexus', text:'Platform integrating Loeschzeit & SnackSignal with monitoring, automated tests, HTTPS, Stripe payments, and reverse tunnel.'}
    ],
    certificates:[
      {title:'Ethical Hacker', text:'Cisco', link:'https://www.credly.com/badges/4eeaf26e-0f7d-426c-9194-63369cae6859/public_url'},
      {title:'Cybersecurity Fundamentals', text:'IBM', link:'https://www.credly.com/badges/5f39a144-6c69-480e-bddc-e7c3bed59611/public_url'},
      {title:'Introduction to Cybersecurity', text:'Cisco', link:'https://www.credly.com/badges/942deac4-d986-4a12-896a-1398ab6355e3/public_url'},
      {title:'AI Fundamentals', text:'IBM', link:'https://www.credly.com/badges/0d96e592-3880-401f-a5ad-8409b9bfb312/public_url'},
      {title:'AI Fundamentals with IBM SkillsBuild', text:'Cisco', link:'https://www.credly.com/badges/02c3f148-5d9b-4848-a97e-563d11b74ac6/public_url'},
      {title:'Introduction to Modern AI', text:'Cisco', link:'https://www.credly.com/badges/a5504512-dbc1-4f31-9e7d-ad37df6a4ef0/public_url'},
      {title:'Introduction to Data Science', text:'Cisco', link:'https://www.credly.com/badges/24a7dffd-59cb-4f3c-befb-010349192ce5/public_url'},
      {title:'PCAP: Python Programming Essentials', text:'Cisco & Python Institute', link:'https://pythoninstitute.org'},
      {title:'Python Essentials 1', text:'Cisco', link:'https://www.credly.com/badges/845cac6d-01f6-4d88-a8e2-c6e3cdf9acbd/public_url'},
      {title:'SAP Core BT', text:'SAP', link:'https://www.sap.com'},
      {title:'Introduction to IoT', text:'Cisco', link:'https://www.credly.com/badges/0d991b1e-268c-4718-a8df-f84322b80c1a/public_url'},
      {title:'Networking Basics', text:'Cisco', link:'https://www.credly.com/badges/37948a25-57f0-4ccc-9364-5e88fdaba3a0/public_url'},
      {title:'Operating System Basics', text:'Cisco', link:'https://www.credly.com/badges/05e3e37e-db8e-487e-b4ee-282961d53e32/public_url'},
      {title:'Computer Hardware Basics', text:'Cisco', link:'https://www.credly.com/badges/647aa6b0-7222-4130-ab69-d88813ecba8b/public_url'},
      {title:'IT Fundamentals', text:'IBM', link:'https://www.credly.com/badges/81feb453-bf32-4d97-b922-e788b412d5a0/public_url'},
      {title:'ECDL', text:'ICDL Austria', link:'https://www.icdl.at'},
      {title:'Digital Awareness', text:'Cisco', link:'https://www.credly.com/badges/3c5808cf-b2a4-407a-8836-e5a5adf6121d/public_url'},
      {title:'UX Design Fundamentals', text:'IBM', link:'https://www.credly.com/badges/017f6df0-1982-4ada-9a22-76bf33b5018a/public_url'},
      {title:'English for IT 1', text:'Cisco', link:'https://www.credly.com/badges/fc2960c2-e7e9-4ade-a07f-b95a850bf778/public_url'},
      {title:'English for IT 2', text:'Cisco', link:'https://www.credly.com/badges/ec988248-9c44-4393-b6da-b84c959311e7/public_url'},
      {title:'Create Digital Content & Collaborate Online', text:'Cisco', link:'https://www.credly.com/badges/0b33a8b0-6b4a-4c65-b118-bc50d611f93d/public_url'},
      {title:'Using Computer and Mobile Devices', text:'Cisco', link:'https://www.credly.com/badges/567ccdac-912f-4e11-bc15-e40aa277d348/public_url'}
    ],
    schoolWork:[
      {title:'Internship: Elektro Wenger', text:'Summer 2022 · 1 month', link:'https://www.elektro-wenger.at'},
      {title:'Internship: Merkur Insurance', text:'Summer 2023 · 1 month', link:'https://www.merkur.at'},
      {title:'Internship: XDevelop', text:'Summer 2024 · 1 month', link:'https://xdevelop.at'},
      {title:'HTBLA Saalfelden — Computer Science', text:'2020 – 2025', link:'https://www.htlsaalfelden.at'},
      {title:'FH Salzburg — IT & System Management (Bachelor)', text:'2026 – present', link:'https://www.fh-salzburg.ac.at/studium/it/informationstechnik-system-management-bachelor'}
    ],
    voluntary:[
      {title:'Voluntary Firefighter', text:'Member of FF Kuchl since September 2017. Rescue · Extinguish · Salvage · Protect', link:'https://www.ff-kuchl.at'},
      {title:'Team122.at Member', text:'Supporting disaster and civil protection through hardware and software solutions. Contribution: löschwasserförderung.at (thesis project).', link:'https://www.team122.at'},
      {title:'IT Coordinator – FF Kuchl', text:'Responsible for maintenance, administration and development of IT systems, website, internal software, and digital operational support.', link:'https://www.ff-kuchl.at'}
    ],
    programming:[
      {title:'C#', text:'Advanced'},{title:'C++', text:'Advanced'},{title:'Java', text:'Advanced'},
      {title:'Dart', text:'Advanced'},{title:'Python', text:'Advanced'},{title:'MicroPython', text:'Advanced'},
      {title:'Bash', text:'Advanced'},{title:'JavaScript', text:'Intermediate'},
      {title:'PHP', text:'Intermediate'},{title:'HTML', text:'Intermediate'},{title:'CSS', text:'Intermediate'}
    ],
    databases:[
      {title:'MySQL', text:'Advanced'},{title:'SQLite', text:'Advanced'},{title:'MongoDB', text:'Advanced'},
      {title:'PostgreSQL', text:'Intermediate'},{title:'MariaDB', text:'Intermediate'}
    ],
    frameworks:[
      {title:'Spring Boot', text:'Backend'},{title:'ASP.NET', text:'Backend'},
      {title:'Flutter', text:'Cross-platform'},{title:'Bootstrap', text:'Frontend'},
      {title:'WPF', text:'Frontend'},{title:'JavaFX', text:'Frontend'}
    ],
    languages:[{title:'German', text:'Native'},{title:'English', text:'Fluent'}]
  },

  de: {
    nav_home:'Start', nav_about:'Über mich', nav_projects:'Projekte',
    nav_certificates:'Zertifikate', nav_school_work:'Schule / Arbeit',
    nav_voluntary:'Ehrenamt', nav_frameworks:'Frameworks',
    nav_languages:'Natürliche Sprachen', nav_programming:'Programmiersprachen',
    nav_databases:'Datenbanken', nav_github_stats:'GitHub Statistiken',
    nav_skills:'Fähigkeiten', nav_contact:'Kontakt',
    hero_title:'Ich entwickle intelligente &amp; sichere digitale Lösungen',
    hero_text:'"Debugging ist, als wäre man der Detektiv in einem Krimi, in dem man auch der Mörder ist." — Filipe Fortes',
    hero_btn:'Projekte ansehen →', hero_contact:'Kontakt aufnehmen',
    about_text:'Ich bin Stefan Rautner, 19 Jahre alt, und entwickle smarte Haussysteme & Automatisierungen, die zuverlässig, sicher und alltagstauglich sind.',
    contact_title:'Kontakt',
    contact_text:'Gerne für Zusammenarbeit oder Freelance-Projekte erreichbar.',
    contact_btn:'E-Mail senden',
    footer_text:'© 2026 Stefan Rautner · Alle Rechte vorbehalten.',

    projects:[
      {title:'Löschwasserförderung', text:'Multi-Plattform-App zur Berechnung von Relaisleitungen für österreichische Feuerwehren. Operativ im Einsatz.', link:'https://github.com/fitforfire/loeschwasserfoerderung.at'},
      {title:'SparkNet', text:'Plattformübergreifendes Smart-Home-System mit Automatisierung, Sicherheit, KI-Unterstützung, Sprachsteuerung und Bilderkennung.'},
      {title:'KiAuto-Windows', text:'Windows-Port von KiAuto zum Export von Schaltplänen aus dem KiCad EDA-Programm.', link:'https://github.com/StefanRautner/KiAuto-Windows'},
      {title:'TinyWhatsApp', text:'Plattformübergreifende Chat-App mit zentralem Server und Datenbank.', link:'https://github.com/StefanRautner/ChatProgram'},
      {title:'MBot-Controller', text:'WebApp und Zwischendienst zur Steuerung und Sensoranzeige eines MBot2 via WLAN.', link:'https://github.com/StefanRautner/MBotController'},
      {title:'Loeschzeit', text:'Zeitmess-App für Kinderzielspritzen auf Feuerwehrfesten.'},
      {title:'SnackSignal', text:'Bestellsystem für Vereinsfeste mit Bar- und Kartenzahlung und Echtzeit-Bestellverwaltung.'},
      {title:'Nexus', text:'Plattform mit Loeschzeit & SnackSignal, Monitoring, HTTPS, Stripe-Zahlung und Reverse-Tunnel.'}
    ],
    certificates:[
      {title:'Ethical Hacker', text:'Cisco', link:'https://www.credly.com/badges/4eeaf26e-0f7d-426c-9194-63369cae6859/public_url'},
      {title:'Grundlagen der Cybersicherheit', text:'IBM', link:'https://www.credly.com/badges/5f39a144-6c69-480e-bddc-e7c3bed59611/public_url'},
      {title:'Einführung in Cybersicherheit', text:'Cisco', link:'https://www.credly.com/badges/942deac4-d986-4a12-896a-1398ab6355e3/public_url'},
      {title:'KI-Grundlagen', text:'IBM', link:'https://www.credly.com/badges/0d96e592-3880-401f-a5ad-8409b9bfb312/public_url'},
      {title:'KI-Grundlagen mit IBM SkillsBuild', text:'Cisco', link:'https://www.credly.com/badges/02c3f148-5d9b-4848-a97e-563d11b74ac6/public_url'},
      {title:'Einführung in moderne KI', text:'Cisco', link:'https://www.credly.com/badges/a5504512-dbc1-4f31-9e7d-ad37df6a4ef0/public_url'},
      {title:'Einführung in Data Science', text:'Cisco', link:'https://www.credly.com/badges/24a7dffd-59cb-4f3c-befb-010349192ce5/public_url'},
      {title:'PCAP: Python-Grundlagen', text:'Cisco & Python Institute', link:'https://pythoninstitute.org'},
      {title:'Python Essentials 1', text:'Cisco', link:'https://www.credly.com/badges/845cac6d-01f6-4d88-a8e2-c6e3cdf9acbd/public_url'},
      {title:'SAP Core BT', text:'SAP', link:'https://www.sap.com'},
      {title:'Einführung in IoT', text:'Cisco', link:'https://www.credly.com/badges/0d991b1e-268c-4718-a8df-f84322b80c1a/public_url'},
      {title:'Netzwerkgrundlagen', text:'Cisco', link:'https://www.credly.com/badges/37948a25-57f0-4ccc-9364-5e88fdaba3a0/public_url'},
      {title:'Betriebssystemgrundlagen', text:'Cisco', link:'https://www.credly.com/badges/05e3e37e-db8e-487e-b4ee-282961d53e32/public_url'},
      {title:'Hardwaregrundlagen', text:'Cisco', link:'https://www.credly.com/badges/647aa6b0-7222-4130-ab69-d88813ecba8b/public_url'},
      {title:'IT-Grundlagen', text:'IBM', link:'https://www.credly.com/badges/81feb453-bf32-4d97-b922-e788b412d5a0/public_url'},
      {title:'ECDL', text:'ICDL Austria', link:'https://www.icdl.at'},
      {title:'Digital Awareness', text:'Cisco', link:'https://www.credly.com/badges/3c5808cf-b2a4-407a-8836-e5a5adf6121d/public_url'},
      {title:'UX Design Grundlagen', text:'IBM', link:'https://www.credly.com/badges/017f6df0-1982-4ada-9a22-76bf33b5018a/public_url'},
      {title:'Englisch für IT 1', text:'Cisco', link:'https://www.credly.com/badges/fc2960c2-e7e9-4ade-a07f-b95a850bf778/public_url'},
      {title:'Englisch für IT 2', text:'Cisco', link:'https://www.credly.com/badges/ec988248-9c44-4393-b6da-b84c959311e7/public_url'},
      {title:'Digitale Inhalte erstellen & zusammenarbeiten', text:'Cisco', link:'https://www.credly.com/badges/0b33a8b0-6b4a-4c65-b118-bc50d611f93d/public_url'},
      {title:'Computer- und Mobilgeräte nutzen', text:'Cisco', link:'https://www.credly.com/badges/567ccdac-912f-4e11-bc15-e40aa277d348/public_url'}
    ],
    schoolWork:[
      {title:'Praktikum: Elektro Wenger', text:'Sommer 2022 · 1 Monat', link:'https://www.elektro-wenger.at'},
      {title:'Praktikum: Merkur Versicherung', text:'Sommer 2023 · 1 Monat', link:'https://www.merkur.at'},
      {title:'Praktikum: XDevelop', text:'Sommer 2024 · 1 Monat', link:'https://xdevelop.at'},
      {title:'HTBLA Saalfelden — Informatik', text:'2020 – 2025', link:'https://www.htlsaalfelden.at'},
      {title:'FH Salzburg — Informationstechnik & System-Management (Bachelor)', text:'2026 – jetzt', link:'https://www.fh-salzburg.ac.at/studium/it/informationstechnik-system-management-bachelor'}
    ],
    voluntary:[
      {title:'Freiwilliger Feuerwehrmann', text:'Seit September 2017 Mitglied der FF Kuchl. Retten · Löschen · Bergen · Schützen', link:'https://www.ff-kuchl.at'},
      {title:'Team122.at Mitglied', text:'Katastrophen- und Zivilschutz durch Hard- und Softwarelösungen. Beitrag: löschwasserförderung.at (Diplomarbeit).', link:'https://www.team122.at'},
      {title:'EDV/IT Beauftragter – FF Kuchl', text:'Betreuung, Wartung und Weiterentwicklung der IT-Systeme, Webseite und interner Softwarelösungen.', link:'https://www.ff-kuchl.at'}
    ],
    programming:[
      {title:'C#', text:'Fortgeschritten'},{title:'C++', text:'Fortgeschritten'},{title:'Java', text:'Fortgeschritten'},
      {title:'Dart', text:'Fortgeschritten'},{title:'Python', text:'Fortgeschritten'},{title:'MicroPython', text:'Fortgeschritten'},
      {title:'Bash', text:'Fortgeschritten'},{title:'JavaScript', text:'Mittelstufe'},
      {title:'PHP', text:'Mittelstufe'},{title:'HTML', text:'Mittelstufe'},{title:'CSS', text:'Mittelstufe'}
    ],
    databases:[
      {title:'MySQL', text:'Fortgeschritten'},{title:'SQLite', text:'Fortgeschritten'},{title:'MongoDB', text:'Fortgeschritten'},
      {title:'PostgreSQL', text:'Mittelstufe'},{title:'MariaDB', text:'Mittelstufe'}
    ],
    frameworks:[
      {title:'Spring Boot', text:'Backend'},{title:'ASP.NET', text:'Backend'},
      {title:'Flutter', text:'Cross-platform'},{title:'Bootstrap', text:'Frontend'},
      {title:'WPF', text:'Frontend'},{title:'JavaFX', text:'Frontend'}
    ],
    languages:[{title:'Deutsch', text:'Muttersprache'},{title:'Englisch', text:'Fließend'}]
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════════════════ */
let lang  = localStorage.getItem('lang')  || 'en';
let theme = localStorage.getItem('theme') || 'dark';

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS PARTICLE SYSTEM
   Runs on its own compositing layer — no repaints to body/sections.
   Uses requestAnimationFrame with idle detection to save power.
   ═══════════════════════════════════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  const DARK_COLOR  = 'rgba(77, 208, 225,';
  const LIGHT_COLOR = 'rgba(0, 151, 167,';
  let W, H, particles;
  let raf = null;
  let lastTime = 0;

  const PARTICLE_COUNT = 55;
  const SPEED = 0.28; // px/frame at 60fps, very gentle

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    return {
      x:  Math.random() * (W || window.innerWidth),
      y:  Math.random() * (H || window.innerHeight),
      r:  Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      a:  Math.random() * 0.45 + 0.1
    };
  }

  function initParticles() {
    particles = Array.from({length: PARTICLE_COUNT}, mkParticle);
  }

  function colorStr() {
    return document.documentElement.dataset.theme === 'light' ? LIGHT_COLOR : DARK_COLOR;
  }

  function draw(ts) {
    raf = requestAnimationFrame(draw);
    // Throttle to ~45fps max to save power
    if (ts - lastTime < 22) return;
    lastTime = ts;

    ctx.clearRect(0, 0, W, H);
    const col = colorStr();

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      // Wrap around edges
      if (p.x < -4) p.x = W + 4;
      else if (p.x > W + 4) p.x = -4;
      if (p.y < -4) p.y = H + 4;
      else if (p.y > H + 4) p.y = -4;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = col + p.a + ')';
      ctx.fill();
    }
  }

  // Pause when tab is hidden, resume on visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) { lastTime = 0; raf = requestAnimationFrame(draw); }
  });

  window.addEventListener('resize', resize, {passive: true});
  resize();
  initParticles();
  raf = requestAnimationFrame(draw);
})();

/* ═══════════════════════════════════════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════════════════════════════════════ */
function applyTheme(t) {
  theme = t;
  document.documentElement.dataset.theme = t;
  localStorage.setItem('theme', t);
}
applyTheme(theme); // apply stored theme immediately

document.getElementById('themeToggle').addEventListener('click', () => {
  applyTheme(theme === 'dark' ? 'light' : 'dark');
});

/* ═══════════════════════════════════════════════════════════════════════════
   LANGUAGE — direct toggle (no dropdown)
   ═══════════════════════════════════════════════════════════════════════════ */
const langToggle = document.getElementById('langToggle');

function applyLang(l) {
  lang = l;
  localStorage.setItem('lang', l);
  langToggle.textContent = l.toUpperCase();
  document.documentElement.lang = l;
  renderAll();
}

langToggle.addEventListener('click', () => applyLang(lang === 'en' ? 'de' : 'en'));

/* ═══════════════════════════════════════════════════════════════════════════
   RENDER
   ═══════════════════════════════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);

function plain(s) { return s.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ''); }

function renderAll() {
  const t = T[lang];

  // Text nodes
  document.querySelectorAll('[data-key]').forEach(el => {
    const v = t[el.dataset.key];
    if (v !== undefined) el.innerHTML = v;
  });

  renderProjects(t.projects);
  renderCertificates(t.certificates);
  renderTimeline(t.schoolWork);
  renderVoluntary(t.voluntary);
  renderSkillBars('programmingBars', t.programming);
  renderSkillBars('databasesBars', t.databases);
  renderChips('frameworksChips', t.frameworks);
  renderChips('languagesChips', t.languages);
}

function renderProjects(list) {
  const g = $('projectsGrid'); g.innerHTML = '';
  list.forEach(p => {
    const el = document.createElement(p.link ? 'a' : 'div');
    el.className = 'project-card';
    if (p.link) { el.href = p.link; el.target = '_blank'; el.rel = 'noopener'; }
    el.innerHTML = `
      <div class="project-card__title">${p.title}</div>
      <div class="project-card__text">${plain(p.text)}</div>
      ${p.link ? '<div class="project-card__cta">View on GitHub →</div>' : ''}`;
    g.appendChild(el);
  });
}

function renderCertificates(list) {
  const g = $('certificatesGrid'); g.innerHTML = '';
  list.forEach(c => {
    const el = document.createElement(c.link ? 'a' : 'div');
    el.className = 'card' + (c.link ? ' card--link' : '');
    if (c.link) { el.href = c.link; el.target = '_blank'; el.rel = 'noopener'; }
    el.innerHTML = `<div class="card__title">${c.title}</div><div class="card__sub">${c.text}</div>`;
    g.appendChild(el);
  });
}

function renderTimeline(list) {
  const tl = $('schoolWorkTimeline'); tl.innerHTML = '';
  list.forEach(item => {
    const el = document.createElement(item.link ? 'a' : 'div');
    el.className = 'timeline-item';
    if (item.link) { el.href = item.link; el.target = '_blank'; el.rel = 'noopener'; }
    el.innerHTML = `
      <div class="timeline-item__title">${item.title}</div>
      <div class="timeline-item__sub">${item.text}</div>`;
    tl.appendChild(el);
  });
}

function renderVoluntary(list) {
  const g = $('voluntaryGrid'); g.innerHTML = '';
  list.forEach(item => {
    const el = document.createElement(item.link ? 'a' : 'div');
    el.className = 'card cards-grid--wide' + (item.link ? ' card--link' : '');
    if (item.link) { el.href = item.link; el.target = '_blank'; el.rel = 'noopener'; }
    el.innerHTML = `
      <div class="card__title">${item.title}</div>
      <div class="card__sub" style="margin-top:.3rem;line-height:1.6">${plain(item.text)}</div>`;
    g.appendChild(el);
  });
}

function renderSkillBars(containerId, list) {
  const c = $(containerId); c.innerHTML = '';
  list.forEach(item => {
    const pct = SKILL_LEVELS[item.text] || 50;
    const wrap = document.createElement('div');
    wrap.className = 'skill-bar';
    wrap.innerHTML = `
      <span class="skill-bar__name">${item.title}</span>
      <div class="skill-bar__track"><div class="skill-bar__fill" data-pct="${pct}"></div></div>
      <span class="skill-bar__pct">${pct}%</span>`;
    c.appendChild(wrap);
  });
  // Animate fills when section is visible
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

/* Animate bar fills via IntersectionObserver */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar__fill').forEach(fill => {
        fill.style.width = fill.dataset.pct + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.2});

function animateBarsIn(container) {
  // Reset fills
  container.querySelectorAll('.skill-bar__fill').forEach(f => f.style.width = '0');
  barObserver.observe(container);
}

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
const header = $('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
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
applyLang(lang);
