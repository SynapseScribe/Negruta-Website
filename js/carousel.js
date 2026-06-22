let currentSlide = 0;

function moveSlide(direction) {
  const container = document.querySelector(".carousel-slides");
  if (!container) return;

  const totalSlides = container.querySelectorAll("img").length;
  if (totalSlides === 0) return;

  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  container.style.transform = `translateX(-${currentSlide * 100}%)`;
}
