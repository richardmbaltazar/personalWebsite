const skillButtons = document.querySelectorAll(".skill-btn");
const stackSkills = document.getElementById("stack-skills");
const toolSkills = document.getElementById("tool-skills");

skillButtons.forEach((button) => {
  button.addEventListener("click", () => {
    skillButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    if (button.dataset.skill === "stack") {
      stackSkills.classList.add("active");
      toolSkills.classList.remove("active");
    } else {
      toolSkills.classList.add("active");
      stackSkills.classList.remove("active");
    }
  });
});

const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

const savedTheme = localStorage.getItem("theme") || "dark";

html.setAttribute("data-theme", savedTheme);

if (themeToggle) {
  themeToggle.textContent = savedTheme === "dark" ? "Light" : "Dark";

  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    themeToggle.textContent = newTheme === "dark" ? "Light" : "Dark";
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

const revealElements = document.querySelectorAll(".reveal");
revealElements.forEach((element) => observer.observe(element));