const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    contactForm.reset();
    const msg = document.createElement("p");
    msg.className = "success-message";
    msg.setAttribute("role", "status");
    msg.textContent = "Meow! Your message has been sent to Negruta's fan club!";
    contactForm.insertAdjacentElement("afterend", msg);
    setTimeout(() => msg.remove(), 3500);
  });
}
