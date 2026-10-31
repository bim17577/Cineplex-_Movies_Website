// HEADER

const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");

// Add a shadow to the header once the page is scrolled
const updateHeader = () => navbar.classList.toggle("is-scrolled", window.scrollY > 10);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

// Mobile menu
const setMenu = (open) => {
  navbar.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", open);
};

menuToggle.addEventListener("click", () => setMenu(!navbar.classList.contains("menu-open")));
document.querySelectorAll(".menu a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 1080) setMenu(false);
});

// Highlight the link for the current page
const currentPage = location.pathname.split("/").pop().toLowerCase() || "index.html";
document.querySelectorAll(".menu a, .signup-icon").forEach((link) => {
  const href = link.getAttribute("href").toLowerCase();
  if (href === currentPage || (currentPage === "index.html" && href === "home.html")) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

// FEATURED MOVIE SLIDER (home page)

const heroSlider = document.querySelector(".hero-slider");

if (heroSlider) {
  const slides = heroSlider.querySelectorAll(".hero-slide");
  const tabs = heroSlider.querySelectorAll(".hero-tab");
  const autoplay = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = 0;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
      slide.setAttribute("aria-hidden", i !== current);
      // Links in hidden slides shouldn't be reachable with the Tab key
      slide.querySelectorAll("a").forEach((a) => (a.tabIndex = i === current ? 0 : -1));
    });
    tabs.forEach((tab, i) => {
      tab.classList.toggle("is-active", i === current);
      tab.setAttribute("aria-selected", i === current);
    });
  };

  tabs.forEach((tab, i) => tab.addEventListener("click", () => showSlide(i)));
  heroSlider.querySelector(".hero-prev").addEventListener("click", () => showSlide(current - 1));
  heroSlider.querySelector(".hero-next").addEventListener("click", () => showSlide(current + 1));

  heroSlider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showSlide(current - 1);
    if (e.key === "ArrowRight") showSlide(current + 1);
  });

  // The active tab's progress bar is the timer: when it fills, move on
  if (autoplay) {
    tabs.forEach((tab) =>
      tab.querySelector(".hero-progress span").addEventListener("animationend", () => showSlide(current + 1))
    );
  } else {
    heroSlider.classList.add("is-paused");
  }

  // Pause while the visitor is reading or using the slider
  const pause = (paused) => autoplay && heroSlider.classList.toggle("is-paused", paused);
  heroSlider.addEventListener("mouseenter", () => pause(true));
  heroSlider.addEventListener("mouseleave", () => pause(false));
  heroSlider.addEventListener("focusin", () => pause(true));
  heroSlider.addEventListener("focusout", () => pause(false));

  // Swipe left / right on touch screens
  let touchStartX = null;
  heroSlider.addEventListener("touchstart", (e) => (touchStartX = e.touches[0].clientX), { passive: true });
  heroSlider.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const distance = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 50) showSlide(current + (distance < 0 ? 1 : -1));
    touchStartX = null;
  });

  showSlide(0);
}

// MOVIE CAROUSELS

document.querySelectorAll(".movie-list-wrapper").forEach((wrapper) => {
  const list = wrapper.querySelector(".movie-list");
  const prev = wrapper.querySelector(".arrow-prev");
  const next = wrapper.querySelector(".arrow-next");
  const step = () => list.clientWidth * 0.8;

  // Wrap around at either end, like the original arrow did
  next.addEventListener("click", () => {
    const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 4;
    list.scrollTo({ left: atEnd ? 0 : list.scrollLeft + step(), behavior: "smooth" });
  });

  prev.addEventListener("click", () => {
    const atStart = list.scrollLeft <= 4;
    list.scrollTo({ left: atStart ? list.scrollWidth : list.scrollLeft - step(), behavior: "smooth" });
  });
});

// SEARCH
// On the Movies page the search filters the list live; on every other page
// the form submits to Movies.html?q=... which applies the same filter.

const movieCards = document.querySelectorAll(".movie-details-container");
const searchInput = document.querySelector(".searchTerm");

if (movieCards.length && searchInput) {
  const noResults = document.getElementById("movies-details-content");

  const filterMovies = (term) => {
    const query = term.trim().toLowerCase();
    let visible = 0;

    movieCards.forEach((card) => {
      const title = card.querySelector(".movie-details-title").textContent.toLowerCase();
      const description = card.querySelector(".movie-details-description").textContent.toLowerCase();
      const match = title.includes(query) || description.includes(query);
      card.style.display = match ? "" : "none";
      if (match) visible++;
    });

    noResults.textContent = visible ? "" : "No movies found.";
  };

  const initialQuery = new URLSearchParams(location.search).get("q");
  if (initialQuery) {
    searchInput.value = initialQuery;
    filterMovies(initialQuery);
  }

  searchInput.addEventListener("input", () => filterMovies(searchInput.value));
  searchInput.form.addEventListener("submit", (e) => {
    e.preventDefault();
    filterMovies(searchInput.value);
    setMenu(false);
    document.querySelector(".movie-details").scrollIntoView({ behavior: "smooth" });
  });
}

// SCROLL REVEAL

const revealTargets = document.querySelectorAll(
  ".movie-list-container, .featured-banner, .movie-details-container, .card, .special-promotions-title, .promotion-item, .about-card, .food-card, .footer-content"
);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((el) => {
    // Stagger items that sit side by side in the same row
    const index = [...el.parentElement.children].indexOf(el);
    el.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
    el.classList.add("reveal");
    observer.observe(el);
  });
}

// PAYPAL (book ticket page only, and only once the PayPal SDK has loaded)

if (window.paypal && document.getElementById("paypal-button-container")) {
  paypal.Buttons({
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: '10.00' // Example price, replace it with your actual ticket price
          }
        }]
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        alert('Transaction completed by ' + details.payer.name.given_name);
      });
    }
  }).render('#paypal-button-container');
}
