const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

if (savedTheme === "light" || (!savedTheme && prefersLight)) {
  document.documentElement.setAttribute("data-theme", "light");
  themeToggle.textContent = "🌙";
}

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");

  if (currentTheme === "light") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  }
});

window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      if (e.matches) {
        document.documentElement.setAttribute("data-theme", "light");
        themeToggle.textContent = "🌙";
      } else {
        document.documentElement.removeAttribute("data-theme");
        themeToggle.textContent = "☀️";
      }
    }
  });
