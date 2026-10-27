document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  const closeMenu = () => {
    if (!menuToggle || !navLinks) return;
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  };

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        // Keep dropdown links usable; close the mobile menu after navigation starts.
        if (window.matchMedia("(max-width: 800px)").matches) closeMenu();
      });
    });

    document.addEventListener("click", (event) => {
      if (window.matchMedia("(max-width: 800px)").matches &&
          !navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        document.querySelectorAll(".has-dropdown.open").forEach((item) => item.classList.remove("open"));
        document.querySelectorAll(".nav-dropdown-toggle").forEach((button) => button.setAttribute("aria-expanded", "false"));
      }
    });
  }

  // Submenu toggles remain available on touch devices although arrow icons are hidden.
  document.querySelectorAll(".nav-dropdown-toggle").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const parent = button.closest(".has-dropdown");
      if (!parent) return;
      const isOpen = parent.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  // Homepage hero slider (only exists on index.html).
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".slider-dot"));
  const prev = document.querySelector(".slider-prev");
  const next = document.querySelector(".slider-next");
  let current = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
      dot.setAttribute("aria-current", i === current ? "true" : "false");
    });
  }
  function restartTimer() {
    if (timer) window.clearInterval(timer);
    if (slides.length > 1) timer = window.setInterval(() => showSlide(current + 1), 5000);
  }
  if (slides.length) {
    showSlide(0);
    restartTimer();
    next?.addEventListener("click", () => { showSlide(current + 1); restartTimer(); });
    prev?.addEventListener("click", () => { showSlide(current - 1); restartTimer(); });
    dots.forEach((dot, index) => dot.addEventListener("click", () => { showSlide(index); restartTimer(); }));
    const hero = document.querySelector(".hero");
    hero?.addEventListener("mouseenter", () => timer && window.clearInterval(timer));
    hero?.addEventListener("mouseleave", restartTimer);
  }

  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();
});
