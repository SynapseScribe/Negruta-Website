let currentSlide = 0;
const slidesContainer = document.querySelector(".carousel-slides");
const totalSlides = document.querySelectorAll(".carousel-slides img").length;

function moveSlide(direction) {
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  if (slidesContainer) {
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
}
