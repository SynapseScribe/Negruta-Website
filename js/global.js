document.addEventListener(
  "keydown",
  function (e) {
    // Match Space across browsers
    if (e.code === "Space" || e.key === " " || e.keyCode === 32) {
      const el = document.activeElement;
      const tag = el && el.tagName;
      // Allow typing and normal interactive elements:
      const isEditable =
        el && (el.isContentEditable || tag === "INPUT" || tag === "TEXTAREA");
      const isInteractive =
        el &&
        (tag === "BUTTON" ||
          (tag === "A" && el.hasAttribute("href")) ||
          tag === "SELECT" ||
          (el.getAttribute && el.getAttribute("role") === "button"));
      // If focus is NOT on an editable or interactive element, prevent Space scroll
      if (!isEditable && !isInteractive) {
        // Use passive:false so preventDefault() is allowed
        e.preventDefault();
      }
    }
  },
  {
    passive: false,
  },
);
