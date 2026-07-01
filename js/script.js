/* ============================================================
   CURUPIRA — Main JavaScript
   ============================================================ */

'use strict';

/* ── Navbar: Scroll Effect + Active Link ─────────────────────── */
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');

function updateNavbar() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}

function updateActiveLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
  });
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();
updateActiveLink();

/* ── Mobile Menu ─────────────────────────────────────────────── */
const hamburger   = document.querySelector('.hamburger');
const mobileNav   = document.querySelector('.mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link, .mobile-nav .btn');

function toggleMenu(open) {
  hamburger?.classList.toggle('open', open);
  mobileNav?.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger?.addEventListener('click', () => {
  const isOpen = hamburger.classList.contains('open');
  toggleMenu(!isOpen);
});

mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') toggleMenu(false);
});

/* ── Scroll Reveal ───────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Demo Tabs ───────────────────────────────────────────────── */
const demoTabs   = document.querySelectorAll('.demo-tab');
const demoPanels = document.querySelectorAll('.demo-panel');

demoTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    demoTabs.forEach(t => t.classList.remove('active'));
    demoPanels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    document.querySelector(`.demo-panel[data-tab="${target}"]`)?.classList.add('active');
  });
});

/* ── Contact Form ────────────────────────────────────────────── */
const contactForm = document.querySelector('.contact-form');

contactForm?.addEventListener('submit', function (e) {
  e.preventDefault();

  const btn = this.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;

  btn.innerHTML = '✓ Mensagem Enviada!';
  btn.disabled = true;
  btn.style.background = 'var(--green-dark)';

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
    btn.style.background = '';
    this.reset();
  }, 3500);
});

/* ── Smooth scroll for anchor links ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar ? navbar.offsetHeight + 16 : 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ── Animated counter on hero stats ─────────────────────────── */
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const isDecimal = String(target).includes('.');

  function step(now) {
    const elapsed = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3); // ease-out cubic
    const current = isDecimal
      ? (eased * target).toFixed(1)
      : Math.floor(eased * target);
    el.textContent = el.dataset.suffix ? current + el.dataset.suffix : current;
    if (elapsed < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    animateCounter(el, target);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
