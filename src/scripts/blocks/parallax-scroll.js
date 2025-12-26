"use strict";

const revealItems = document.querySelectorAll(
  ".animation-left, .animation-right, .animation-bottom"
);

const observerSection = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    threshold: 0.2,
    rootMargin: "0px 0px -100px 0px",
  }
);

revealItems.forEach((el) => observerSection.observe(el));
