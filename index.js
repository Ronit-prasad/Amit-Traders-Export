function initializeSite() {
  // Mobile menu toggle logic
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const body = document.body;

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
      body.style.overflow = navLinks.classList.contains("active")
        ? "hidden"
        : "auto";
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navLinks.classList.remove("active");
        body.style.overflow = "auto";
      });
    });
  }

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

  // Product card interactive style & color switcher
  const productCards = document.querySelectorAll(".product-card");
  
  productCards.forEach((card) => {
    const swatches = card.querySelectorAll(".swatch-btn");
    const imgContainer = card.querySelector(".product-img-container");
    const img = card.querySelector(".product-img");
    const colorBadge = card.querySelector(".color-badge-overlay");
    
    // Style Selector Elements
    const styleTabs = card.querySelectorAll(".style-tab-btn");
    const styleGroups = card.querySelectorAll(".color-swatches.style-group");
    const descText = card.querySelector(".product-desc-text");
    
    if (!swatches.length || !img) return;

    // Preload images to avoid flash of blank spaces
    const imageUrls = Array.from(swatches).map(s => s.dataset.image).filter(Boolean);
    imageUrls.forEach(url => {
      const tempImg = new Image();
      tempImg.src = url;
    });

    // Function to change product color
    function setProductColor(swatchBtn) {
      if (swatchBtn.classList.contains("active")) return;
      
      const newImage = swatchBtn.dataset.image;
      const newColor = swatchBtn.dataset.color;
      const newFilter = swatchBtn.dataset.filter || "none";
      
      // Update swatches active state
      swatches.forEach(btn => btn.classList.remove("active"));
      swatchBtn.classList.add("active");
      
      // Trigger smooth switching animation
      img.classList.add("switching");
      
      setTimeout(() => {
        if (newImage) img.src = newImage;
        img.style.filter = newFilter;
        if (colorBadge && newColor) {
          colorBadge.textContent = newColor;
        }
        
        // Remove animation class after image is swapped
        setTimeout(() => {
          img.classList.remove("switching");
        }, 50);
      }, 150); // Matches halfway through our transition
    }

    // Swatch click handlers
    swatches.forEach(swatch => {
      swatch.addEventListener("click", (e) => {
        e.stopPropagation(); // Avoid triggering card or image clicks
        setProductColor(swatch);
      });
    });

    // Style Tabs click handler
    if (styleTabs.length && styleGroups.length) {
      const descriptions = {
        designer: "Streetwear-focused designs featuring distressed ripped details, custom washing treatments, and statement textures.",
        casual: "Clean silhouette for everyday comfort. Features solid colors, classic washes, and premium durable stitching."
      };
      
      styleTabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
          e.stopPropagation();
          if (tab.classList.contains("active")) return;
          
          const selectedStyle = tab.dataset.style;
          
          // Toggle active class on tabs
          styleTabs.forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          
          // Toggle active class and visibility on style groups
          styleGroups.forEach(group => {
            if (group.dataset.styleGroup === selectedStyle) {
              group.style.display = "flex";
              group.classList.add("active");
              
              // Select the first swatch of this new active group
              const firstSwatch = group.querySelector(".swatch-btn");
              if (firstSwatch) {
                setProductColor(firstSwatch);
              }
            } else {
              group.style.display = "none";
              group.classList.remove("active");
            }
          });
          
          // Update description text dynamically
          if (descText && descriptions[selectedStyle]) {
            descText.textContent = descriptions[selectedStyle];
          }
        });
      });
    }

    // Image/Container click handler - cycles through colors of the active group
    if (imgContainer) {
      imgContainer.addEventListener("click", () => {
        const activeGroup = card.querySelector(".color-swatches.style-group.active") || card.querySelector(".color-swatches");
        if (!activeGroup) return;
        
        const visibleSwatches = activeGroup.querySelectorAll(".swatch-btn");
        const activeSwatch = activeGroup.querySelector(".swatch-btn.active");
        let nextSwatchIndex = 0;
        
        if (activeSwatch && visibleSwatches.length) {
          const swatchesArray = Array.from(visibleSwatches);
          const currentIndex = swatchesArray.indexOf(activeSwatch);
          nextSwatchIndex = (currentIndex + 1) % swatchesArray.length;
        }
        
        if (visibleSwatches.length) {
          setProductColor(visibleSwatches[nextSwatchIndex]);
        }
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSite);
} else {
  initializeSite();
}
