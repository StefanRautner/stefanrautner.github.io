// ================================================
// === LANGUAGE HANDLING / TRANSLATION SYSTEM ======
// ================================================

let translations = {}; // Holds all loaded translation data

// Dynamically load a language JSON file and update UI
async function loadLanguage(lang) {
    const response = await fetch(`${lang}.json`); // Fetch translation file
    translations = await response.json(); // Parse JSON into object
    updateText(); // Replace all text with translations
    loadProjects(); // Load project section
    loadCertificates(); // Load certificates section
    loadSchoolWork(); // Load school work section
    loadVoluntary(); // Load voluntary work section
    loadSkills(); // Load skills section
}

// Update text of all elements with "data-key" attribute
function updateText() {
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key'); // Translation key
        if (translations[key]) el.innerText = translations[key]; // Replace content
    });
}

// ================================================
// === PROJECTS SECTION ============================
// ================================================

function loadProjects() {
    const projectsContainer = document.querySelector('.projects'); // Project container
    projectsContainer.innerHTML = ''; // Clear previous items

    translations.projects.forEach(p => {
        const card = document.createElement('div'); // Create project card
        card.className = 'project-card';
        card.innerHTML = `<h4>${p.title}</h4><p>${p.text}</p>`; // Set content

        // Make card clickable if link exists
        card.style.cursor = 'pointer';
        if (p.link) {
            card.addEventListener('click', () => window.open(p.link, '_blank'));
        }

        projectsContainer.appendChild(card); // Add to DOM
    });
}

// ================================================
// === CERTIFICATES SECTION ========================
// ================================================

function loadCertificates() {
    const certContainer = document.querySelector('.school-work'); // Target container
    certContainer.innerHTML = ''; // Clear previous items

    translations.certificates.forEach(c => {
        const li = document.createElement('li');
        li.innerText = c;
        certContainer.appendChild(li);
    });
}

// ================================================
// === SCHOOL WORK SECTION =========================
// ================================================

function loadSchoolWork() {
    const certContainer = document.querySelector('.certificates'); // Target container
    certContainer.innerHTML = ''; // Clear previous items

    translations.certificates.forEach(c => {
        const li = document.createElement('li');
        li.innerText = c;
        certContainer.appendChild(li);
    });
}

// ================================================
// === VOLUNTARY WORK SECTION ======================
// ================================================

function loadVoluntary() {
    const volContainer = document.querySelector('.voluntary');
    volContainer.innerHTML = ''; // Clear previous items

    translations.voluntary.forEach(v => {
        const li = document.createElement('li');
        li.innerText = v;
        volContainer.appendChild(li);
    });
}

// ================================================
// === SKILLS SECTION ==============================
// ================================================

function loadSkills() {
    // --- Programming Languages ---
    const plContainer = document.querySelector('.prog-languages');
    plContainer.innerHTML = '';
    translations.skills.prog_languages.forEach(l => {
        const li = document.createElement('li');
        li.innerText = l;
        plContainer.appendChild(li);
    });

    // --- Frameworks ---
    const fwContainer = document.querySelector('.frameworks');
    fwContainer.innerHTML = '';
    translations.skills.frameworks.forEach(f => {
        const li = document.createElement('li');
        li.innerText = f;
        fwContainer.appendChild(li);
    });

    // --- Databases ---
    const dbContainer = document.querySelector('.databases');
    dbContainer.innerHTML = '';
    translations.skills.databases.forEach(d => {
        const li = document.createElement('li');
        li.innerText = d;
        dbContainer.appendChild(li);
    });

    // --- Natural Languages ---
    const nlContainer = document.querySelector('.natural-languages');
    nlContainer.innerHTML = '';
    translations.skills.natural_languages.forEach(n => {
        const li = document.createElement('li');
        li.innerText = n;
        nlContainer.appendChild(li);
    });
}

// ================================================
// === LANGUAGE SWITCHER ===========================
// ================================================

const langBtn = document.querySelector('.lang-btn');
const langDropdown = document.querySelector('.lang-dropdown');
const langOptions = document.querySelectorAll('.lang-option');

// Toggle dropdown on button click
langBtn.addEventListener('click', () => langDropdown.classList.toggle('active'));

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!langDropdown.contains(e.target)) langDropdown.classList.remove('active');
});

// Load selected language on option click
langOptions.forEach(option => {
    option.addEventListener('click', async () => {
        const lang = option.getAttribute('data-lang');
        langBtn.textContent = lang.toUpperCase();
        await loadLanguage(lang);
        langDropdown.classList.remove('active');
    });
});

// Load default language on startup
document.addEventListener('DOMContentLoaded', async () => {
    langOptions[1].click(); // Default: English
});

// ================================================
// === CONTACT BUTTONS =============================
// ================================================

document.getElementById('emailBtn').addEventListener('click', () => {
    window.location.href = 'mailto:stefan.rautner06@gmail.com';
});

document.getElementById('githubBtn').addEventListener('click', () => {
    window.open('https://github.com/StefanRautner', '_blank');
});

// ================================================
// === SMOOTH SCROLLING ============================
// ================================================

document.querySelectorAll('nav a, .btn').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// ================================================
// === GENERIC CARD LOADER =========================
// ================================================

function loadCards(sectionClass, items) {
    const container = document.querySelector(`.${sectionClass}`);
    container.innerHTML = ''; // Clear previous

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h4>${item.title}</h4><p>${item.text}</p>`;

        // Open link in new tab if available
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            if (item.link) window.open(item.link, '_blank');
        });

        container.appendChild(card);
    });
}

// Load all sections after language update
function loadAllSections() {
    if (translations.certificates) loadCards('certificates', translations.certificates);
    if (translations.voluntary) loadCards('voluntary', translations.voluntary);
    if (translations.schoolWork) loadCards('school-work', translations.schoolWork);
    if (translations.frameworks) loadCards('frameworks', translations.frameworks);
    if (translations.languages) loadCards('languages', translations.languages);
    if (translations.programming) loadCards('programming', translations.programming);
    if (translations.databases) loadCards('databases', translations.databases);
}

// ================================================
// === REDEFINED LANGUAGE LOADER (MERGED LOGIC) ====
// ================================================

function loadLanguage(lang) {
    fetch(`${lang}.json`)
        .then(res => res.json())
        .then(data => {
            translations = data;
            updateText();
            loadProjects();
            loadAllSections();
        });
}

// ================================================
// === SCROLL TO TOP BUTTON ========================
// ================================================

const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ================================================
// === FAST FUTURISTIC NEURAL NETWORK BACKGROUND ===
// ================================================

const particlesContainer = document.querySelector('.particles');
particlesContainer.innerHTML = ''; // Clear previous canvas

const canvas = document.createElement('canvas');
particlesContainer.appendChild(canvas);
const ctx = canvas.getContext('2d');

// --- Device Performance Detection ---
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// --- Network parameters (dynamic for performance) ---
const nodeCount = isMobile ? 35 : 100; // fewer points on mobile
const connectionDistance = isMobile ? 120 : 240; // shorter links on mobile
const maxFPS = isMobile ? 30 : 60; // limit framerate for weak CPUs
const colors = ['#00ffff', '#00ff99'];

let nodes = [];
let lastFrameTime = 0;

// --- Resize canvas for device pixel ratio ---
function resizeCanvas() {
    const scale = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- Create nodes ---
function createNodes() {
    nodes = [];
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.8, // slower on mobile
            vy: (Math.random() - 0.5) * 0.8,
            radius: 1.5 + Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}
createNodes();

// --- Draw function ---
function draw(timestamp) {
    // Limit frame rate on mobile
    if (isMobile && timestamp - lastFrameTime < 1000 / maxFPS) {
        requestAnimationFrame(draw);
        return;
    }
    lastFrameTime = timestamp;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw connecting lines
    for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = dx * dx + dy * dy;

            // Use squared distance for faster comparison
            if (dist < connectionDistance * connectionDistance) {
                const opacity = 1 - Math.sqrt(dist) / connectionDistance;
                ctx.beginPath();
                const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                gradient.addColorStop(0, `rgba(0,255,255,${opacity * 0.3})`);
                gradient.addColorStop(1, `rgba(0,255,153,${opacity * 0.3})`);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1;
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00ffff';
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    }

    // Draw nodes and update positions
    for (let node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = node.color;
        ctx.fill();

        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
        if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;
    }

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);


// ================================================
// === SMOOTH SCROLLING (WITH HEADER OFFSET) =======
// ================================================

document.querySelectorAll('nav a, .btn').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = document.querySelector('header').offsetHeight;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// ================================================
// === HAMBURGER MENU HANDLING =====================
// ================================================

const hamburger = document.querySelector('.hamburger');
const menuRight = document.querySelector('.menu-right');

// Toggle menu visibility
hamburger.addEventListener('click', () => {
    menuRight.classList.toggle('active');
    hamburger.classList.toggle('open');
});

// Close menu when clicking a link or language option
menuRight.querySelectorAll('a, .lang-option').forEach(el => {
    el.addEventListener('click', () => {
        if (menuRight.classList.contains('active')) {
            menuRight.classList.remove('active');
            hamburger.classList.remove('open');
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuRight.contains(e.target) && !hamburger.contains(e.target)) {
        menuRight.classList.remove('active');
        hamburger.classList.remove('open');
    }
});
