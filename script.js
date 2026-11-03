// ===== Textos em inglês (o português fica no próprio HTML) =====
const EN = {
  skip: 'Skip to content',
  'nav.about': 'About', 'nav.projects': 'Projects', 'nav.path': 'Journey', 'nav.stack': 'Skills', 'nav.contact': 'Contact',
  'hero.eyebrow': 'Santos, Brazil · Computer Science at UNISANTOS',
  'hero.lead': 'I study Computer Science and build mobile apps and web systems, mostly with React and React Native.',
  'hero.seeking': "I'm looking for an internship or a junior role in tech.",
  'hero.cta1': 'See projects', 'hero.cta2': 'Résumé (PDF)',
  'about.title': 'About me',
  'about.p1': "I'm a Computer Science student at the Catholic University of Santos (UNISANTOS), with a technical degree in Systems Development from ETEC Praia Grande.",
  'about.p2': "I'm interested in software development, artificial intelligence and automation. I like turning ideas into working projects and learning whatever technology each project needs.",
  'about.p3': "I'm curious, I enjoy a challenge, and I try to combine technical skill with an entrepreneurial mindset.",
  'proj.title': 'Projects',
  'proj.github': 'Code on GitHub',
  'proj.beach.kind': 'Mobile app · in progress',
  'proj.beach.desc': 'An app to connect beachgoers with street vendors on the beaches of Praia Grande. Planned features include a map with vendor locations, ratings and product discovery.',
  'proj.crm.name': 'Member management CRM', 'proj.crm.kind': 'Web system',
  'proj.crm.desc': 'A management system for a travel community. It organizes new member onboarding in stages, keeps the member base with automatically calculated yearly expiry dates and renewal alerts, and tracks who attends each event.',
  'proj.folio.name': 'This portfolio', 'proj.folio.kind': 'Personal website',
  'proj.folio.desc': "The site you're looking at. Built with HTML, CSS and JavaScript, no frameworks, with light and dark themes and Portuguese and English versions.",
  'proj.more': 'More projects and studies are on my GitHub.',
  'path.title': 'Journey',
  'path.work': 'Experience', 'path.edu': 'Education',
  'path.now': 'Current', 'path.ongoing': 'Ongoing', 'path.inprogress': 'In progress', 'path.done': 'Completed',
  'path.ti.role': 'IT Assistant',
  'path.ti.desc': 'Technical support and day-to-day information technology work.',
  'path.indep.role': 'Independent projects',
  'path.indep.desc': 'Building apps, management systems (CRM) and web interfaces, using artificial intelligence tools to speed up development.',
  'path.cc.role': 'B.Sc. in Computer Science',
  'path.etec.role': 'Technical Degree in Systems Development',
  'stack.title': 'Skills', 'stack.tools': 'AI and tools',
  'contact.title': 'Contact',
  'contact.text': 'If you want to talk about a role or a project, reach me by email or WhatsApp.',
  'contact.copy': 'Copy', 'contact.copied': 'Copied',
  'contact.cv': 'Résumé', 'contact.cvlink': 'Open PDF',
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

function applyLang() {
  root.lang = lang === 'en' ? 'en' : 'pt-BR';
  document.getElementById('langBtn').setAttribute('aria-label', lang === 'en' ? 'Mudar para português' : 'Switch to English');
  nodes.forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = lang === 'en' && EN[key] ? EN[key] : el.dataset.pt;
  });
  // As cópias do carrossel precisam ser refeitas com o texto no idioma novo.
  setupCarousel();
}

document.getElementById('langBtn').addEventListener('click', () => {
  lang = lang === 'en' ? 'pt' : 'en';
  store.set('lang', lang);
  applyLang();
});

// ===== Tema =====
const themeColor = document.querySelector('meta[name="theme-color"]');
function syncThemeColor() {
  themeColor.content = root.dataset.theme === 'dark' ? '#0e0e10' : '#ffffff';
}
document.getElementById('themeBtn').addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  store.set('theme', root.dataset.theme);
  syncThemeColor();
});
syncThemeColor();

// ===== Menu do celular =====
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuBtn');
function setMenu(open) {
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
}
menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// ===== Link ativo no menu =====
const links = [...nav.querySelectorAll('a')];
const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
function markActive() {
  const y = window.scrollY + window.innerHeight * 0.35;
  let current = -1;
  sections.forEach((s, i) => { if (s.offsetTop <= y) current = i; });
  // No fim da página a última seção pode ser curta demais para chegar ao ponto de corte.
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections.length - 1;
  links.forEach((a, i) => a.classList.toggle('active', i === current));
}
window.addEventListener('scroll', markActive, { passive: true });
markActive();

// ===== Copiar e-mail =====
const copyBtn = document.getElementById('copyBtn');
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
  } catch (e) {
    window.location.href = `mailto:${copyBtn.dataset.email}`;
    return;
  }
  copyBtn.textContent = lang === 'en' ? EN['contact.copied'] : 'Copiado';
  setTimeout(() => {
    copyBtn.textContent = lang === 'en' ? EN['contact.copy'] : copyBtn.dataset.pt;
  }, 1800);
});

// ===== Carrossel infinito de projetos (só no celular) =====
// Ideia: uma cópia do último card vai para o início e uma cópia do primeiro vai para o fim.
// Quando a pessoa para numa cópia, pulamos sem animação para o card verdadeiro igual,
// e assim dá para arrastar para sempre nos dois sentidos.
const projectList = document.getElementById('projects');
const dotsBox = document.getElementById('carouselDots');
const realCards = [...projectList.querySelectorAll('.project')];
const isMobile = window.matchMedia('(max-width: 720px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentCard = 0; // índice do card verdadeiro na tela (0, 1, 2...)
let scrollTimer;

// Largura de um card mais o espaço entre os cards
function cardWidth() {
  return realCards[0].offsetWidth + parseFloat(getComputedStyle(projectList).gap);
}

// Posição na fila: 0 é a cópia do último, 1 a N são os verdadeiros, N+1 é a cópia do primeiro
function scrollToPosition(position, smooth) {
  projectList.scrollTo({
    left: position * cardWidth(),
    behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant',
  });
}

function makeClone(card) {
  const clone = card.cloneNode(true);
  clone.classList.add('clone');
  clone.setAttribute('aria-hidden', 'true'); // leitores de tela ignoram a cópia
  clone.inert = true;                        // e o Tab também não entra nela
  return clone;
}

function updateDots() {
  dotsBox.querySelectorAll('button').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentCard);
  });
}

// A caixa do carrossel fica com a altura do card na tela, para não sobrar espaço
// vazio embaixo de um card mais baixo. No meio de um arrasto, usa o maior dos dois
// cards visíveis, para nenhum ficar cortado.
function fitHeight() {
  const cards = projectList.children;
  const position = projectList.scrollLeft / cardWidth();
  const left = cards[Math.floor(position)];
  const right = cards[Math.ceil(position)] || left;
  projectList.style.height = `${Math.max(left.offsetHeight, right.offsetHeight)}px`;
}

function setupCarousel() {
  // Começa limpo: tira cópias, bolinhas antigas e a altura fixa
  projectList.querySelectorAll('.clone').forEach((clone) => clone.remove());
  dotsBox.innerHTML = '';
  projectList.style.height = '';

  // No computador os projetos ficam em lista normal
  if (!isMobile.matches) return;

  projectList.prepend(makeClone(realCards[realCards.length - 1]));
  projectList.append(makeClone(realCards[0]));

  realCards.forEach((card, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `${lang === 'en' ? 'Project' : 'Projeto'} ${i + 1}`);
    dot.addEventListener('click', () => scrollToPosition(i + 1, true));
    dotsBox.append(dot);
  });

  scrollToPosition(currentCard + 1, false);
  updateDots();
  fitHeight();
}

projectList.addEventListener('scroll', () => {
  if (!isMobile.matches) return;
  fitHeight();
  // Espera a rolagem parar antes de decidir onde estamos
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const total = realCards.length;
    const position = Math.round(projectList.scrollLeft / cardWidth());
    if (position === 0) {
      scrollToPosition(total, false); // estava na cópia do último: vai para o último verdadeiro
      currentCard = total - 1;
    } else if (position === total + 1) {
      scrollToPosition(1, false);     // estava na cópia do primeiro: vai para o primeiro verdadeiro
      currentCard = 0;
    } else {
      currentCard = position - 1;
    }
    updateDots();
  }, 120);
});

// Ao virar o celular ou mudar o tamanho da janela, liga ou desliga o carrossel
isMobile.addEventListener('change', setupCarousel);

// A altura dos cards muda quando a fonte termina de carregar ou a tela muda de largura
document.fonts.ready.then(() => { if (isMobile.matches) fitHeight(); });
window.addEventListener('resize', () => { if (isMobile.matches) fitHeight(); });

document.getElementById('year').textContent = new Date().getFullYear();
applyLang();
