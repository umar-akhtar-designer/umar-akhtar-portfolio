/* ============================================================
   Umar Akhtar — Portfolio JS
   ============================================================ */

const nav = document.getElementById('nav');
const backTop = document.getElementById('backTop');
const progress = document.getElementById('scrollProgress');

/* ---------- Scroll: nav state, progress bar, back-to-top ---------- */
function onScroll() {
  const y = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  nav.classList.toggle('scrolled', y > 20);
  backTop.classList.toggle('show', y > 500);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---------- Active nav link on scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const linkMap = {};
document.querySelectorAll('.nav-links a').forEach((a) => {
  linkMap[a.getAttribute('href').slice(1)] = a;
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-links a').forEach((a) => a.classList.remove('active'));
        const link = linkMap[entry.target.id];
        if (link) link.classList.add('active');
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);
sections.forEach((s) => sectionObserver.observe(s));

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ---------- Animated counters (decimal aware) ---------- */
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
counters.forEach((c) => counterObserver.observe(c));

/* ---------- Hero portrait parallax ---------- */
const parallax = document.querySelector('[data-parallax]');
if (parallax) {
  window.addEventListener('scroll', () => {
    const rect = parallax.getBoundingClientRect();
    const shift = Math.max(-26, Math.min(26, (window.innerHeight / 2 - rect.top) * 0.04));
    parallax.style.transform = `translate3d(0, ${shift}px, 0) scale(1.06)`;
  }, { passive: true });
}

/* ---------- Experience accordion: close others ---------- */
document.querySelectorAll('.exp-row').forEach((row) => {
  row.addEventListener('toggle', () => {
    if (row.open) {
      document.querySelectorAll('.exp-row[open]').forEach((other) => {
        if (other !== row) other.open = false;
      });
    }
  });
});

/* ---------- Back to top ---------- */
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));