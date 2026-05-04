document.addEventListener("DOMContentLoaded", () => {
  // Reveal animations on scroll
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");

        // If it's a grid, stagger the children
        if (entry.target.classList.contains("stagger-container")) {
          const children = entry.target.querySelectorAll(".animate-on-scroll");
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add("revealed");
            }, index * 150);
          });
        }
      }
    });
  }, observerOptions);

  // Observe all elements with the animation class
  const animatedElements = document.querySelectorAll(
    ".animate-on-scroll, .stagger-container",
  );
  animatedElements.forEach((el) => observer.observe(el));

  // Parallax effect for images
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll(".parallax-img").forEach((img) => {
      const speed = img.dataset.speed || 0.1;
      img.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
