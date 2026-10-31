// ===== Textos em inglês (o português fica no próprio HTML) =====
const EN = {
  skip: 'Skip to content',
  'nav.about': 'About', 'nav.projects': 'Projects', 'nav.path': 'Journey', 'nav.contact': 'Contact',
  'hero.status': 'Open to opportunities',
  'hero.lead': 'I turn ideas into apps, web systems and automations that solve real problems.',
  'hero.cta1': 'See projects', 'hero.cta2': 'View résumé ↗',
  'hero.chip': 'CS @ UNISANTOS', 'hero.bar': 'Santos · BRT',
  'about.title': 'Curious by nature, builder by choice.',
  'about.p1': "I'm a Computer Science student at the Catholic University of Santos (UNISANTOS), with a technical degree in Systems Development from ETEC Praia Grande.",
  'about.p2': "I'm into software development, artificial intelligence, automation and building digital products that solve real problems. I like turning ideas into working projects, exploring new technologies and learning all the time.",
  'about.p3': "I'm curious, I enjoy a challenge, and I try to combine technical skill with an entrepreneurial mindset.",
  'stack.front': 'front-end', 'stack.mobile': 'mobile', 'stack.back': 'back-end & data', 'stack.ai': 'ai & tools',
  'proj.title': 'Things I’ve built.',
  'proj.maps': 'Maps',
  'proj.beach.kind': 'mobile app · in progress',
  'proj.beach.desc': 'An app that connects beachgoers with street vendors on the beaches of Praia Grande. It shows nearby vendors on an interactive map, with ratings and product discovery.',
  'proj.crm.kind': 'web system', 'proj.crm.name': 'CRM — Member management',
  'proj.crm.desc': 'A custom system for a travel community: a step-by-step onboarding pipeline, a member base with automatic expiry dates and renewal alerts, and event tracking.',
  'proj.portal.kind': 'pwa · mobile first', 'proj.portal.name': 'Members Portal',
  'proj.portal.desc': 'An installable mobile portal for a community: login with ID number, profile with membership expiry and document status, events calendar and a staff dashboard.',
  'proj.more.kind': 'always building', 'proj.more.name': 'Other projects',
  'proj.more.desc': 'Websites and interfaces in HTML, CSS and JavaScript, plus new solutions using automation and artificial intelligence.',
  'proj.more.link': 'See everything on GitHub ↗',
  'path.title': 'Where I come from and where I’m going.',
  'path.work': 'experience', 'path.edu': 'education',
  'path.ti.when': 'current', 'path.ti.role': 'IT Assistant',
  'path.ti.desc': 'Technical support and day-to-day information technology work.',
  'path.indep.when': 'ongoing', 'path.indep.role': 'Independent projects',
  'path.indep.desc': 'Building apps, management systems (CRM) and web interfaces, using AI tools to ship faster.',
  'path.cc.when': 'in progress', 'path.cc.role': 'B.Sc. in Computer Science',
  'path.etec.when': 'completed', 'path.etec.role': 'Technical Degree in Systems Development',
  'contact.title': 'Got an idea or an opening? Let’s talk.',
  'contact.text': 'I reply fast by email or WhatsApp.',
  'contact.copy': 'copy', 'contact.copied': 'copied!', 'contact.cv': 'Résumé ↗',
  footer: 'handmade with HTML, CSS & JS',
};

const ROLES = {
  pt: ['Desenvolvedor de Software', 'Estudante de Ciência da Computação', 'Apps, web e automação com IA'],
  en: ['Software Developer', 'Computer Science Student', 'Apps, web & AI automation'],
};

const root = document.documentElement;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
};

// Guarda o português original de cada elemento traduzível.
const nodes = [...document.querySelectorAll('[data-i18n]')];
nodes.forEach((el) => { el.dataset.pt = el.textContent; });

let lang = root.lang === 'en' ? 'en' : 'pt';

function t(key) {
  if (lang === 'en' && EN[key]) return EN[key];
  const el = document.querySelector(`[data-i18n="${key}"]`);
  return el ? el.dataset.pt : key;
}

function applyLang() {
  root.lang = lang === 'en' ? 'en' : 'pt-BR';
  document.getElementById('langBtn').setAttribute('aria-label', lang === 'en' ? 'Mudar para português' : 'Switch to English');
  nodes.forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = lang === 'en' && EN[key] ? EN[key] : el.dataset.pt;
  });
  restartTyping();
}

document.getElementById('langBtn').addEventListener('click', () => {
  lang = lang === 'en' ? 'pt' : 'en';
  store.set('lang', lang);
  applyLang();
});

// ===== Tema =====
document.getElementById('themeBtn').addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  store.set('theme', next);
  document.querySelector('meta[name="theme-color"]').content = next === 'dark' ? '#0b0f17' : '#f6f8fc';
});

// ===== Efeito de digitação no cargo =====
const typed = document.getElementById('typed');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let typingTimer;

function restartTyping() {
  clearTimeout(typingTimer);
  const list = ROLES[lang];
  if (reduced) { typed.textContent = list[0]; return; }
  let i = 0, pos = 0, deleting = false;
  (function tick() {
    const word = list[i];
    pos += deleting ? -1 : 1;
    typed.textContent = word.slice(0, pos);
    let delay = deleting ? 35 : 70;
    if (!deleting && pos === word.length) { deleting = true; delay = 1800; }
    else if (deleting && pos === 0) { deleting = false; i = (i + 1) % list.length; delay = 300; }
    typingTimer = setTimeout(tick, delay);
  })();
}

// ===== Relógio de Santos na barra de status =====
const clock = document.getElementById('clock');
function updateClock() {
  clock.textContent = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
  });
}
updateClock();
setInterval(updateClock, 30000);

// ===== Aparecer ao rolar =====
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  if (el.closest('.hero')) el.style.transitionDelay = `${Math.min(i, 6) * 80}ms`;
  io.observe(el);
});

// ===== Menu, link ativo e barra ao rolar =====
const topbar = document.querySelector('.topbar');
const nav = document.querySelector('.nav');
const menuBtn = document.getElementById('menuBtn');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
});

const links = [...nav.querySelectorAll('a')];
const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
function onScroll() {
  topbar.classList.toggle('scrolled', window.scrollY > 10);
  const y = window.scrollY + window.innerHeight * 0.35;
  let current = -1;
  sections.forEach((s, i) => { if (s.offsetTop <= y) current = i; });
  links.forEach((a, i) => a.classList.toggle('active', i === current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Brilho que segue o mouse no topo =====
const grid = document.querySelector('.hero-grid');
if (!reduced && window.matchMedia('(pointer: fine)').matches) {
  document.querySelector('.hero').addEventListener('pointermove', (e) => {
    const r = grid.getBoundingClientRect();
    grid.style.setProperty('--mx', `${e.clientX - r.left}px`);
    grid.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}

// ===== Copiar e-mail =====
const copyBtn = document.getElementById('copyBtn');
const copyHint = document.getElementById('copyHint');
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
    copyHint.textContent = lang === 'en' ? EN['contact.copied'] : 'copiado!';
  } catch (e) {
    window.location.href = `mailto:${copyBtn.dataset.email}`;
    return;
  }
  setTimeout(() => { copyHint.textContent = t('contact.copy'); }, 1800);
});

document.getElementById('year').textContent = new Date().getFullYear();
applyLang();
