const container = document.querySelector(".side-panel-container");
const trigger = document.querySelector(".side-panel-trigger");
const panel = document.querySelector(".side-panel");
const contactForm = document.getElementById("contactForm");

if (container && trigger && panel) {
  container.addEventListener("mouseenter", (e) => {
    let newTop = e.clientY - 20;

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
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Meow! Your message has been sent to Negruta's fan club!");
    contactForm.reset();
  });
}

let currentSlide = 0;
const slidesContainer = document.querySelector(".carousel-slides");
const totalSlides = document.querySelectorAll(".carousel-slides img").length;

function moveSlide(direction) {
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  if (slidesContainer) {
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
}
const catFacts = [
  "Cats can make over 100 different sounds.",
  "A group of cats is called a clowder.",
  "Cats spend about 70% of their lives sleeping.",
  "Cats have a special organ that allows them to 'taste' scents.",
  "Every cat's nose print is unique, much like a human fingerprint.",
  "Cats can jump up to six times their length.",
  "A cat's hearing is much more acute than a human's.",
  "Cats have a third eyelid called the nictitating membrane.",
  "Most cats are lactose intolerant.",
  "Cats use their whiskers to navigate in the dark.",
];

const floatingCats = document.querySelectorAll(".floating-cats span");

if (floatingCats.length > 0) {
  floatingCats.forEach((cat) => {
    cat.addEventListener("click", () => {
      const fact = catFacts[Math.floor(Math.random() * catFacts.length)];
      alert(`Cat Fact: ${fact}`);
    });
    cat.style.cursor = "pointer";
  });
}
