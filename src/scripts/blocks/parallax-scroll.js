'use strict';

const revealItems = document.querySelectorAll(
  '.description__title, .description__text, .division__title, .division__text',
);

const observerSection = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px',
  },
);

revealItems.forEach((el) => observerSection.observe(el));
