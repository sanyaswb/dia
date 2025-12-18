'use strict';

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
