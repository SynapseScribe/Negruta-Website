const OFFSET = 20;
const container = document.querySelector(".side-panel-container");
const trigger = document.querySelector(".side-panel-trigger");
const panel = document.querySelector(".side-panel");
const themeBtn = document.getElementById("themeToggle");

if (container && trigger && panel) {
  let hideTimeout = null;

  container.addEventListener("mouseenter", (e) => {
    clearTimeout(hideTimeout);
    panel.classList.add("visible");

    let newTop = e.clientY - OFFSET;

    const panelHeight = panel.offsetHeight;
    const viewportHeight = window.innerHeight;

    if (newTop + panelHeight > viewportHeight) {
      newTop = viewportHeight - panelHeight;
    }
    if (newTop < 0) {
      newTop = 0;
    }

    trigger.style.top = `${newTop}px`;
    panel.style.top = `${newTop}px`;
    if (themeBtn) {
      themeBtn.style.top = `${newTop - 35}px`;
    }
  });

  container.addEventListener("mouseleave", () => {
    hideTimeout = setTimeout(() => {
      panel.classList.remove("visible");
    }, 1000);
  });
}
