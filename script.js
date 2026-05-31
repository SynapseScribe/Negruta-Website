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

const translateBtn = document.getElementById("translateBtn");
const translatorInput = document.getElementById("translatorInput");
const translationResult = document.getElementById("translationResult");

if (translateBtn && translatorInput && translationResult) {
  const meowSounds = [
    "meow_sounds/soundzee-cat-meow-361882.mp3",
    "meow_sounds/sound_garage-cat-meow-13-fx-306192.mp3",
    "meow_sounds/ribhavagrawal-cat-meowing-type-02-293290.mp3",
    "meow_sounds/freesound_community-cat-meow-99835.mp3",
    "meow_sounds/freesound_community-meow-39411.mp3",
    "meow_sounds/soulfuljamtracks-cat-meow-2-fx-323466.mp3",
    "meow_sounds/dragon-studio-kitten-sfx-405457.mp3",
    "meow_sounds/freesound_community-cat-purring-and-meow-5928.mp3",
    "meow_sounds/sound_garage-cat-meow-15-fx-306190.mp3",
    "meow_sounds/sound_garage-cat-meow-4-fx-306180.mp3",
    "meow_sounds/sound_garage-cat-meow-12-fx-306191.mp3",
    "meow_sounds/soulfuljamtracks-cat-meow-1-fx-323465.mp3",
    "meow_sounds/sound_garage-cat-meow-3-fx-306179.mp3",
    "meow_sounds/sound_garage-cat-meow-14-fx-306189.mp3",
    "meow_sounds/freesound_community-angry-cat-meow-82091.mp3",
    "meow_sounds/sound_garage-cat-meow-9-fx-306185.mp3",
    "meow_sounds/freesound_community-cat-meow-81626.mp3",
    "meow_sounds/sound_garage-cat-meow-1-fx-306178.mp3",
    "meow_sounds/scottishperson-sound-effect-cat-meow-279336.mp3",
    "meow_sounds/dragon-studio-cartoon-cat-meow-487661.mp3",
    "meow_sounds/sound_garage-cat-meow-7-fx-306186.mp3",
    "meow_sounds/u_6ekfl947a2-cat-meow-297927.mp3",
    "meow_sounds/dragon-studio-cartoon-kitten-meow-487668.mp3",
    "meow_sounds/freesound_community-cat-meow-85175.mp3",
    "meow_sounds/dragon-studio-meow-sfx-405456.mp3",
    "meow_sounds/dragon-studio-cute-cat-meow-472372.mp3",
    "meow_sounds/dragon-studio-cat-meow-401729.mp3"
  ];

  const performTranslation = () => {
    const text = translatorInput.value;
    if (!text) {
      translationResult.textContent = "Please enter some text first!";
      return;
    }
    const meowText = text
      .replace(/[aeiou]/gi, "meow ")
      .replace(/[^a-zA-Z ]/g, "") + " ...meow?";
    translationResult.textContent = meowText;

    const randomSound = meowSounds[Math.floor(Math.random() * meowSounds.length)];
    const audio = new Audio(randomSound);
    audio.play().catch(e => console.log("Audio play failed:", e));
  };

  translateBtn.addEventListener("click", performTranslation);

  translatorInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performTranslation();
    }
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
  "Cats can rotate their ears 180 degrees.",
  "A cat's brain is similar to a human's in terms of structure.",
  "Cats have five toes on their front paws and four on their back paws.",
  "Some cats are polydactyl, meaning they have more than the usual number of toes.",
  "The first cat in space was French (Félicette).",
  "Cats can run up to 30 mph.",
  "A cat's purr frequency can help improve bone density and heal tendons.",
  "Most cats only meow at humans, not other cats.",
  "Cats have a powerful sense of balance thanks to their inner ear.",
  "Ancient Egyptians worshipped cats as symbols of grace and protection.",
  "Some cats are allergic to certain plants like lilies.",
  "A cat's heart beats 110 to 140 times per minute.",
];

const floatingCats = document.querySelectorAll(".floating-cats span");

if (floatingCats.length > 0) {
  const shuffledFacts = [...catFacts].sort(() => Math.random() - 0.5);
  let factIndex = 0;

  floatingCats.forEach((cat) => {
    cat.style.left = `${Math.random() * 95}%`;
    cat.style.top = `${Math.random() * 95}vh`;

    const myFact = shuffledFacts[factIndex % shuffledFacts.length];
    factIndex++;

    cat.addEventListener("click", () => {
      alert(`Cat Fact: ${myFact}`);
    });
    cat.style.cursor = "pointer";
  });
}
