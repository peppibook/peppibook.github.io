/* ══════════════════════════════════════
   경시현 홈페이지 — main.js
   ══════════════════════════════════════ */

/* ─── NAV: scroll 감지 ─── */
const nav = document.getElementById('nav');

const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
};

window.addEventListener('scroll', onScroll, { passive: true });

/* ─── MOBILE NAV TOGGLE ─── */
const toggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
const menuEnglish = document.documentElement.lang.startsWith('en');

toggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
  toggle.setAttribute('aria-label', menuEnglish ? (isOpen ? 'Close menu' : 'Open menu') : (isOpen ? '메뉴 닫기' : '메뉴 열기'));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', menuEnglish ? 'Open menu' : '메뉴 열기');
    document.body.style.overflow = '';
  });
});

/* Release mobile-menu scroll lock when the desktop navigation returns. */
window.matchMedia('(min-width: 1101px)').addEventListener('change', event => {
  if (event.matches) {
    navLinks?.classList.remove('open');
    document.body.style.overflow = '';
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', menuEnglish ? 'Open menu' : '메뉴 열기');
  }
});

/* ─── REVEAL ON SCROLL ─── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

/* stagger delay for grouped elements */
const staggerGroups = [
  '.edu__list .edu__item',
  '.uni__col .uni__item',
  '.research__grid .research__card',
  '.beyond__grid .beyond__item',
  '.projects .research__card',
  '.contact__grid > *',
];

staggerGroups.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.dataset.delay = i * 80;
  });
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ─── ACTIVE NAV LINK on scroll ─── */
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(s => sectionObserver.observe(s));

/* Keep the current section when switching between the two home pages. */
document.querySelectorAll('.language-switch a, a.language-switch').forEach(link => {
  link.addEventListener('click', () => {
    if (window.location.hash) {
      const target = new URL(link.href, window.location.href);
      target.hash = window.location.hash;
      link.href = target.href;
    }
  });
});
