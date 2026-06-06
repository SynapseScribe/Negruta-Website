const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Meow! Your message has been sent to Negruta's fan club!");
    contactForm.reset();
  });
}
