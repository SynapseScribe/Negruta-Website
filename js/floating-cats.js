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
