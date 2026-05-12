/* Theme Toggle */
(function () {
  const THEME_KEY = 'site-theme';
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');

  const saved = localStorage.getItem(THEME_KEY);
  root.dataset.theme = (saved === 'light' || saved === 'dark') ? saved : 'dark';

  root.classList.add('js-enabled');

  function applyTheme(next) {
    root.dataset.theme = next;
    localStorage.setItem(THEME_KEY, next);
  }

  toggleBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    if (document.startViewTransition) {
      document.startViewTransition(() => applyTheme(next));
    } else {
      applyTheme(next);
    }
  });
})();

/* Project Card Web Component */
class ProjectCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'Untitled';
    const image = this.getAttribute('image') || '';
    const alt   = this.getAttribute('alt') || '';
    const desc  = this.getAttribute('description') || '';
    const link  = this.getAttribute('link') || '#';

    this.innerHTML = `
      <article class="card">
        <img class="card__img" src="${image}" alt="${alt}" loading="lazy">
        <div class="card__body">
          <h2 class="card__title">${title}</h2>
          <p class="card__desc">${desc}</p>
          <a class="card__link" href="${link}">View more →</a>
        </div>
      </article>
    `;
  }
}

customElements.define('project-card', ProjectCard);

/* Project Data */
const localProjects = [
  {
    title: 'About Me',
    image: '../images/about.jpg',
    alt: 'About me',
    description: 'A Computer Science major at UC San Diego with a passion for analyzing patterns, exploring tech, and building meaningful experiences.',
    link: 'about.html'
  },
  {
    title: 'Technical Skills',
    image: '../images/skills.jpg',
    alt: 'Skills',
    description: 'Proficient in Python, JavaScript, HTML, CSS, SQL, and Excel. Experienced with VS Code, Figma, and Photoshop.',
    link: 'skill.html'
  },
  {
    title: 'Intern Experience',
    image: '../images/sdsc.jpg',
    alt: 'SDSC',
    description: 'Software Engineer & Business Development Analyst Intern at the San Diego Supercomputer Center.',
    link: 'about.html'
  }
];

/* Render Cards */
function renderCards(data) {
  const container = document.getElementById('project-container');
  container.innerHTML = '';
  data.forEach(item => {
    const card = document.createElement('project-card');
    Object.entries(item).forEach(([k, v]) => card.setAttribute(k, v));
    container.appendChild(card);
  });
}

/* Button Handlers */
document.getElementById('load-local').addEventListener('click', () => {
  renderCards(localProjects);
});

document.getElementById('load-remote').addEventListener('click', () => {
  fetch('https://my-json-server.typicode.com/ribaltazar/rb-data/db')
    .then(res => res.json())
    .then(data => renderCards(data.projects))
    .catch(err => console.error('Remote fetch failed:', err));
});
