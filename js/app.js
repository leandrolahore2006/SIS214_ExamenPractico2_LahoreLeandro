const projects = [
  {
    title: "Sistema de citas médicas",
    category: "Modelado de sistemas",
    description: "Modelo entidad-relación de un sistema hospitalario. Organiza pacientes, médicos, especialidades, consultorios y citas para mostrar cómo se conectan los datos necesarios para la atención médica.",
    technologies: ["Modelo entidad-relación", "Sistema hospitalario", "Gestión de citas"],
    image: "assets/images/sistema-hospitalario.jpg",
    video: "assets/video/proyecto.mp4",
  },
  {
    title: "CV y portafolio web",
    category: "Desarrollo frontend",
    description: "CV web personal construido con HTML semántico, CSS adaptable y JavaScript. Presenta mi formación y proyectos e integra navegación móvil, temas claro y oscuro, búsqueda, validación de formularios y contenido multimedia.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Accesibilidad"],
  },
];

const projectList = document.querySelector("#project-list");
const projectSearch = document.querySelector("#project-search");
const filterStatus = document.querySelector("#filter-status");
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".hamburger");
const siteNav = document.querySelector("#site-nav");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const githubStatus = document.querySelector("#github-status");
const repoList = document.querySelector("#repo-list");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const formSubmitButton = contactForm.querySelector('button[type="submit"]');
const toast = document.querySelector("#toast");
const githubUsername = "leandrolahore2006";
let toastTimer;
let toastHideTimer;
let submitButtonTimer;

/**
 * @typedef {Object} Project
 * @property {string} title
 * @property {string} category
 * @property {string} description
 * @property {string[]} technologies
 * @property {string} [image]
 * @property {string} [video]
 */

/**
 * Builds an accessible project card from one project record.
 * @param {Project} project Project data to display.
 * @returns {HTMLElement} The rendered project card.
 */
function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "card-project";

  if (project.image) {
    const image = document.createElement("img");
    image.className = "project-image";
    image.src = project.image;
    image.alt = `Vista previa del proyecto ${project.title}`;
    image.loading = "lazy";
    card.append(image);
  }

  const category = document.createElement("p");
  category.className = "project-category";
  category.textContent = project.category;

  const title = document.createElement("h3");
  title.textContent = project.title;

  const description = document.createElement("p");
  description.textContent = project.description;

  const badges = document.createElement("ul");
  badges.className = "badge-list";
  badges.setAttribute("aria-label", "Tecnologías utilizadas");
  project.technologies.forEach((technology) => {
    const badge = document.createElement("li");
    badge.className = "badge";
    badge.textContent = technology;
    badges.append(badge);
  });

  card.append(category, title, description, badges);

  if (project.video) {
    const videoLink = document.createElement("a");
    videoLink.className = "project-video-link";
    videoLink.href = project.video;
    videoLink.target = "_blank";
    videoLink.rel = "noreferrer";
    videoLink.textContent = "Ver video del proyecto ↗";
    card.append(videoLink);
  }

  return card;
}

/**
 * Returns a new, unmodified collection of projects matching a search term.
 * @param {Project[]} projectCollection Original project records.
 * @param {string} searchTerm Text entered by the user.
 * @returns {Project[]} A copied collection of matching projects.
 */
function filterProjects(projectCollection, searchTerm) {
  const normalizedQuery = searchTerm.trim().toLocaleLowerCase("es");
  return projectCollection
    .filter((project) => {
      const searchableText = [
        project.title,
        project.category,
        project.description,
        ...project.technologies,
      ].join(" ").toLocaleLowerCase("es");
      return searchableText.includes(normalizedQuery);
    })
    .map((project) => ({ ...project, technologies: [...project.technologies] }));
}

/**
 * Renders matching projects and an explanatory empty state when none match.
 * @param {string} [query=""] Search term entered by the user.
 * @returns {void}
 */
function renderProjects(query = "") {
  const filteredProjects = filterProjects(projects, query);
  const cards = filteredProjects.map(createProjectCard);

  if (cards.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No se encontraron proyectos que coincidan con tu búsqueda.";
    cards.push(emptyState);
  }

  projectList.replaceChildren(...cards);
  filterStatus.textContent = `${filteredProjects.length} de ${projects.length} ${
    filteredProjects.length === 1 ? "proyecto encontrado." : "proyectos encontrados."
  }`;
}

/**
 * Applies the selected theme and synchronizes theme-control accessibility.
 * @param {"light"|"dark"} theme Theme to activate.
 * @returns {void}
 */
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeColorMeta.content = isDark ? "#17201b" : "#f5f2ea";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Activar modo claro" : "Activar modo oscuro",
  );
  const icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = isDark ? "☼" : "☾";
  themeToggle.replaceChildren(icon);
}

/**
 * Restores the saved theme, falling back to light mode if storage is unavailable.
 * @returns {void}
 */
function loadTheme() {
  let savedTheme = "light";

  try {
    savedTheme = JSON.parse(localStorage.getItem("portfolio-theme")) || "light";
  } catch (error) {
    console.error("No se pudo leer el tema guardado en el navegador.", error);
  }

  setTheme(savedTheme === "dark" ? "dark" : "light");
}

/**
 * Closes the responsive navigation and resets its accessible state.
 * @returns {void}
 */
function closeMenu() {
  siteNav.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
}

/**
 * Returns the validation message for a form field.
 * @param {HTMLInputElement|HTMLTextAreaElement} input Field to validate.
 * @returns {string} Validation message, or an empty string when valid.
 */
function getFieldError(input) {
  if (input.validity.valueMissing) return "Este campo es obligatorio.";
  if (input.validity.typeMismatch) return "Ingresa un correo electrónico válido.";
  if (input.validity.tooShort) return `Escribe al menos ${input.minLength} caracteres.`;
  return "";
}

/**
 * Updates a field's visible and accessible validation feedback.
 * @param {HTMLInputElement|HTMLTextAreaElement} input Field to validate.
 * @returns {boolean} Whether the field is valid.
 */
function updateFieldValidation(input) {
  const errorElement = document.querySelector(`#${input.id}-error`);
  const error = getFieldError(input);
  errorElement.textContent = error;
  input.setAttribute("aria-invalid", String(Boolean(error)));
  return !error;
}

/**
 * Loads public repositories and reports loading, success, or HTTP errors.
 * @returns {Promise<void>}
 */
async function loadGithubRepositories() {
  const apiUrl = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`;
  const profileLink = document.querySelector("#github-profile");
  profileLink.href = `https://github.com/${githubUsername}`;
  githubStatus.dataset.state = "loading";
  githubStatus.textContent = "Cargando repositorios de GitHub…";
  repoList.setAttribute("aria-busy", "true");

  try {
    const response = await fetch(apiUrl, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (response.status === 400) {
      throw new Error("GitHub rechazó la solicitud (400 Bad Request).");
    }
    if (response.status === 404) {
      throw new Error("No se encontró el perfil de GitHub (404 Not Found).");
    }
    if (response.status === 500) {
      throw new Error("GitHub presenta un error interno (500 Internal Server Error).");
    }
    if (response.status >= 500) {
      throw new Error(`GitHub presenta un error de servidor (${response.status}).`);
    }
    if (!response.ok) {
      throw new Error(`GitHub respondió con el estado HTTP ${response.status}.`);
    }
    if (response.status !== 200) {
      throw new Error(`GitHub devolvió un estado inesperado (${response.status}).`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("GitHub devolvió una respuesta con formato inesperado.");
    }

    const repositoryCards = repositories.map((repository) => {
      const item = document.createElement("li");
      item.className = "repo-card";

      const language = document.createElement("p");
      language.className = "card-overline";
      language.textContent = repository.language || "Repositorio público";

      const title = document.createElement("h3");
      title.textContent = repository.name;

      const description = document.createElement("p");
      description.textContent = repository.description || "Este repositorio no tiene descripción.";

      const metadata = document.createElement("p");
      metadata.className = "repo-meta";
      metadata.textContent = `★ ${repository.stargazers_count} · Forks: ${repository.forks_count}`;

      const link = document.createElement("a");
      link.href = repository.html_url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = "Ver repositorio ↗";

      item.append(language, title, description, metadata, link);
      return item;
    });

    repoList.replaceChildren(...repositoryCards);
    repoList.setAttribute("aria-busy", "false");
    githubStatus.dataset.state = "success";
    githubStatus.textContent = repositoryCards.length
      ? `${repositoryCards.length} repositorios cargados correctamente.`
      : "Este perfil todavía no tiene repositorios públicos.";
  } catch (error) {
    repoList.setAttribute("aria-busy", "false");
    githubStatus.dataset.state = "error";
    const message = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
    githubStatus.textContent = `No se pudieron cargar los repositorios: ${message}`;
  }
}

/**
 * Shows a polite, temporary notification without claiming a demo message was sent.
 * @param {string} message Notification text.
 * @param {number} [duration=3000] Time in milliseconds before the notification hides.
 * @returns {void}
 */
function showToast(message, duration = 3000) {
  window.clearTimeout(toastTimer);
  window.clearTimeout(toastHideTimer);
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.remove("is-hiding");
  toast.classList.add("is-visible");

  toastTimer = window.setTimeout(() => {
    toast.classList.add("is-hiding");
    toastHideTimer = window.setTimeout(() => {
      toast.hidden = true;
      toast.classList.remove("is-visible", "is-hiding");
    }, 300);
  }, Math.max(0, duration - 300));
}

/**
 * Re-enables the submit button after brief feedback to prevent duplicate submits.
 * @returns {void}
 */
function restoreSubmitButton() {
  window.clearTimeout(submitButtonTimer);
  formSubmitButton.disabled = false;
  formSubmitButton.replaceChildren("Enviar mensaje ");
  const icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "↗";
  formSubmitButton.append(icon);
}

projectSearch.addEventListener("input", (event) => {
  renderProjects(event.currentTarget.value);
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  try {
    localStorage.setItem("portfolio-theme", JSON.stringify(nextTheme));
  } catch (error) {
    console.error("No se pudo guardar la preferencia de tema en el navegador.", error);
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  siteNav.classList.toggle("active", !isOpen);
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Abrir menú de navegación" : "Cerrar menú de navegación",
  );
});

window.matchMedia("(min-width: 1025px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

contactForm.querySelectorAll("input, textarea").forEach((input) => {
  input.addEventListener("input", () => {
    updateFieldValidation(input);
    formStatus.textContent = "";
  });
  input.addEventListener("blur", () => updateFieldValidation(input));
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...contactForm.querySelectorAll(".form-group input, .form-group textarea")];
  const isValid = fields.map(updateFieldValidation).every(Boolean);

  if (!isValid) {
    restoreSubmitButton();
    contactForm.reportValidity();
    formStatus.textContent = "Revisa los campos marcados antes de continuar.";
    return;
  }

  window.clearTimeout(submitButtonTimer);
  formSubmitButton.disabled = true;
  formSubmitButton.textContent = "Validando…";
  formStatus.textContent =
    "Validación correcta. Este formulario de demostración no envía ni guarda mensajes.";
  showToast("¡Formulario validado con éxito! Esta demostración no envió ningún mensaje.");
  contactForm.reset();
  fields.forEach((field) => {
    field.setAttribute("aria-invalid", "false");
    document.querySelector(`#${field.id}-error`).textContent = "";
  });
  submitButtonTimer = window.setTimeout(restoreSubmitButton, 1000);
});

document.querySelector("#year").textContent = new Date().getFullYear();
renderProjects();
loadTheme();
loadGithubRepositories();
