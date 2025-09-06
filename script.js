let translations = {}; // Store all translations

// Load language JSON dynamically
async function loadLanguage(lang) {
    const response = await fetch(`${lang}.json`); // Fetch the JSON file
    translations = await response.json(); // Parse JSON
    updateText(); // Update all text elements
    loadProjects(); // Load projects section
    loadCertificates(); // Load certificates section
    loadSchoolWork(); // Load schoolWork section
    loadVoluntary(); // Load voluntary work section
    loadSkills(); // Load skills section
}

// Update all text elements
function updateText() {
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key'); // Get translation key
        if (translations[key]) el.innerText = translations[key]; // Set translated text
    });
}

// Projects
function loadProjects() {
    const projectsContainer = document.querySelector('.projects'); // Get container
    projectsContainer.innerHTML = ''; // Clear previous content
    translations.projects.forEach(p => {
        const card = document.createElement('div'); // Create project card
        card.className = 'project-card';
        card.innerHTML = `<h4>${p.title}</h4><p>${p.text}</p>`; // Add title and text

        // Make project card clickable if link exists
        card.style.cursor = 'pointer';
        if (p.link) {
            card.addEventListener('click', () => {
                window.open(p.link, '_blank'); // Open link in new tab
            });
        }

        projectsContainer.appendChild(card); // Append card
    });
}

// Certificates
function loadCertificates() {
    const certContainer = document.querySelector('.school-work'); // Get container
    certContainer.innerHTML = ''; // Clear previous content
    translations.certificates.forEach(c => {
        const li = document.createElement('li'); // Create list item
        li.innerText = c; // Set text
        certContainer.appendChild(li); // Append item
    });
}

// School Work
function loadSchoolWork() {
    const certContainer = document.querySelector('.certificates'); // Get container
    certContainer.innerHTML = ''; // Clear previous content
    translations.certificates.forEach(c => {
        const li = document.createElement('li'); // Create list item
        li.innerText = c; // Set text
        certContainer.appendChild(li); // Append item
    });
}

// Voluntary Work
function loadVoluntary() {
    const volContainer = document.querySelector('.voluntary'); // Get container
    volContainer.innerHTML = ''; // Clear previous content
    translations.voluntary.forEach(v => {
        const li = document.createElement('li'); // Create list item
        li.innerText = v; // Set text
        volContainer.appendChild(li); // Append item
    });
}

// Skills
function loadSkills() {
    const plContainer = document.querySelector('.prog-languages'); // Programming languages container
    plContainer.innerHTML = '';
    translations.skills.prog_languages.forEach(l => {
        const li = document.createElement('li');
        li.innerText = l;
        plContainer.appendChild(li);
    });

    const fwContainer = document.querySelector('.frameworks'); // Frameworks container
    fwContainer.innerHTML = '';
    translations.skills.frameworks.forEach(f => {
        const li = document.createElement('li');
        li.innerText = f;
        fwContainer.appendChild(li);
    });

    const dbContainer = document.querySelector('.databases'); // Databases container
    dbContainer.innerHTML = '';
    translations.skills.databases.forEach(d => {
        const li = document.createElement('li');
        li.innerText = d;
        dbContainer.appendChild(li);
    });

    const nlContainer = document.querySelector('.natural-languages'); // Natural languages container
    nlContainer.innerHTML = '';
    translations.skills.natural_languages.forEach(n => {
        const li = document.createElement('li');
        li.innerText = n;
        nlContainer.appendChild(li);
    });
}

// Language switcher
const langBtn = document.querySelector('.lang-btn'); // Button to toggle dropdown
const langDropdown = document.querySelector('.lang-dropdown'); // Dropdown menu
const langOptions = document.querySelectorAll('.lang-option'); // Each language option

langBtn.addEventListener('click', () => langDropdown.classList.toggle('active')); // Toggle dropdown
document.addEventListener('click', (e) => {
    if (!langDropdown.contains(e.target)) langDropdown.classList.remove('active'); // Close dropdown if clicked outside
});

langOptions.forEach(option => {
    option.addEventListener('click', async () => {
        const lang = option.getAttribute('data-lang'); // Get selected language
        langBtn.textContent = lang.toUpperCase(); // Update button text
        await loadLanguage(lang); // Load selected language
        langDropdown.classList.remove('active'); // Close dropdown
    });
});

// Load default language
document.addEventListener('DOMContentLoaded', async () => {
    langOptions[1].click(); // Click first option (default: EN)
});

// Contact buttons
document.getElementById('emailBtn').addEventListener('click', () => {
    window.location.href = 'mailto:stefan.rautner06@gmail.com'; // Open mail client
});
document.getElementById('githubBtn').addEventListener('click', () => {
    window.open('https://github.com/StefanRautner', '_blank'); // Open GitHub in new tab
});

// Smooth scrolling
document.querySelectorAll('nav a, .btn').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth' // Smooth scroll to target
        });
    });
});

function loadCards(sectionClass, items) {
    const container = document.querySelector(`.${sectionClass}`); // Get container
    container.innerHTML = ''; // Clear previous content
    items.forEach(item => {
        const card = document.createElement('div'); // Create card
        card.className = 'card';
        card.innerHTML = `<h4>${item.title}</h4><p>${item.text}</p>`; // Add content

        // Make card clickable if link exists
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            if (item.link) {
                window.open(item.link, '_blank'); // Open link in new tab
            }
        });

        container.appendChild(card); // Append card
    });
}

function loadAllSections() {
    if (translations.certificates) loadCards('certificates', translations.certificates);
    if (translations.voluntary) loadCards('voluntary', translations.voluntary);
    if (translations.schoolWork) loadCards('school-work', translations.schoolWork);
    if (translations.frameworks) loadCards('frameworks', translations.frameworks);
    if (translations.languages) loadCards('languages', translations.languages);
    if (translations.programming) loadCards('programming', translations.programming);
    if (translations.databases) loadCards('databases', translations.databases);
}

// Call inside your loadLanguage function after updating text
function loadLanguage(lang) {
    fetch(`${lang}.json`)
        .then(res => res.json()) // Parse JSON
        .then(data => {
            translations = data; // Save translations
            updateText(); // Update text content
            loadProjects(); // Load projects section
            loadAllSections(); // Load other sections
        });
}

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'block'; // Show button after scrolling
    } else {
        scrollTopBtn.style.display = 'none'; // Hide button
    }
});
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
});

// Particles effect
const particlesContainer = document.querySelector('.particles');
const particleCount = 30; // fewer particles

for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div'); // Create particle
    p.style.left = `${Math.random() * 100}vw`; // Random horizontal position
    p.style.top = `${Math.random() * 100}vh`; // Random vertical position
    p.style.animationDuration = `${6 + Math.random() * 8}s`; // Random speed
    const size = 2 + Math.random() * 3; // Random size
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    const colors = ['#4dd0e1', '#00ff99', '#ff00ff', '#ff4d00']; // Neon color variety
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.opacity = 0.6 + Math.random() * 0.4; // Twinkle effect
    particlesContainer.appendChild(p); // Add to container
}

// Smooth scrolling with header offset
document.querySelectorAll('nav a, .btn').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = document.querySelector('header').offsetHeight; // Account for fixed header
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth' // Smooth scroll
        });
    });
});

// Hamburger toggle
const hamburger = document.querySelector('.hamburger');
const menuRight = document.querySelector('.menu-right');

hamburger.addEventListener('click', () => {
    menuRight.classList.toggle('active'); // slide menu
    hamburger.classList.toggle('open'); // animate hamburger
});

// Close menu when a link or language option is clicked (mobile)
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
