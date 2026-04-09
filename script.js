/* =============================================
   PORTFOLIO PREMIUM — INTERACTIVE SCRIPT
   ============================================= */

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initNavbar();
  initScrollReveal();
  initHeroParallax();
  initProjectTilt();
  initContactForm();
  initSmoothScroll();
  initCountUp();
  initMobileMenu();
});

// ============================
// NAVBAR — Scroll effect
// ============================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================
// MOBILE MENU — Hamburger
// ============================
function initMobileMenu() {
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ============================
// SMOOTH SCROLL
// ============================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });
}

// ============================
// SCROLL REVEAL
// ============================
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ============================
// HERO PARALLAX (subtle)
// ============================
function initHeroParallax() {
  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');
  const grid  = document.querySelector('.hero-grid');

  if (!orb1 || !orb2) return;

  let ticking = false;
  window.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      orb1.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px) scale(1)`;
      orb2.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px) scale(1)`;
      if (grid) grid.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      ticking = false;
    });
  });
}

// ============================
// PROJECT CARDS — 3D TILT
// ============================
function initProjectTilt() {
  const cards = document.querySelectorAll('.project-card, .service-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
  });

  function handleTilt(e) {
    const rect   = this.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -7;
    const rotateY = ((x - cx) / cx) *  7;
    this.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    this.style.transition = 'transform 0.05s linear, border-color 0.4s, box-shadow 0.4s';
  }

  function resetTilt() {
    this.style.transform  = '';
    this.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.4s, box-shadow 0.4s';
  }
}

// ============================
// COUNT-UP ANIMATION (Hero Stats)
// ============================
function initCountUp() {
  const stats = document.querySelectorAll('.hero-stat-num');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent;
      // Extract the number
      const numMatch = raw.match(/[\d]+/);
      if (!numMatch) return;
      const target = parseInt(numMatch[0], 10);
      const suffix = raw.replace(/[\d]+/, '').trim();
      countUp(el, 0, target, suffix, 1200);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

function countUp(el, start, end, suffix, duration) {
  const startTime = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  function update(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(start + (end - start) * easeOut(progress));
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ============================
// CONTACT FORM — Fake Submit
// ============================
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const btn     = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    // Loading state
    btn.disabled = true;
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
      Enviando...
    `;

    // Simulate async send
    await delay(1800);

    // Show success
    form.style.display = 'none';
    success.style.display = 'block';
  });

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#f87171';
        field.focus();
        valid = false;
      }
      if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        field.style.borderColor = '#f87171';
        valid = false;
      }
    });
    return valid;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================
// TYPING ANIMATION (Hero Badge)
// ============================
(function initBadgeTyping() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;
  const text = badge.textContent.trim();
  badge.textContent = '';
  badge.style.opacity = 1;

  let i = 0;
  const interval = setInterval(() => {
    badge.textContent = text.slice(0, i);
    i++;
    if (i > text.length) clearInterval(interval);
  }, 45);
})();

// ============================
// ACTIVE NAV LINK on Scroll
// ============================
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--clr-accent)';
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
})();

// ============================
// Add spin animation style
// ============================
(function addSpinStyle() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 0.8s linear infinite; }
  `;
  document.head.appendChild(style);
})();
