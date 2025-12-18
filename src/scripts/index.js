'use strict';

const switcher = document.getElementById('switcher');

switcher.addEventListener('click', () => {
  const html = document.documentElement;
  const isLight = html.dataset.theme === 'light';

  if (isLight) {
    html.removeAttribute('data-theme');
  } else {
    html.dataset.theme = 'light';
  }
});

const section = document.querySelector('.division');
const background = section.querySelector('.division__background');

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

const maxOffset = 30;
const ease = 0.08;

section.addEventListener('mousemove', (e) => {
  const rect = section.getBoundingClientRect();

  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;

  targetX = -x * maxOffset;
  targetY = -y * maxOffset;
});

section.addEventListener('mouseleave', () => {
  targetX = 0;
  targetY = 0;
});

function animate() {
  currentX += (targetX - currentX) * ease;
  currentY += (targetY - currentY) * ease;

  background.style.setProperty('--parallax-x', `${currentX}px`);
  background.style.setProperty('--parallax-y', `${currentY}px`);

  requestAnimationFrame(animate);
}

animate();

const revealItems = document.querySelectorAll(
  '.description__title, .description__text',
);

const observer = new IntersectionObserver(
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

revealItems.forEach((el) => observer.observe(el));
