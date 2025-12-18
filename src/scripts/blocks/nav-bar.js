'use strict';

const header = document.getElementById('header');
const headerTop = document.querySelector('.header__top');
const scrollTopBtn = document.querySelector('.scroll-top');

let lastScrollY = window.scrollY;
let isHidden = false;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  const headerBottom = header.offsetHeight - headerTop.offsetHeight;

  if (currentScroll > 0) {
    headerTop.classList.add('top-height');
  } else {
    headerTop.classList.remove('top-height');
  }

  if (currentScroll <= headerBottom) {
    headerTop.classList.remove('hidden');
    scrollTopBtn.classList.remove('visible');

    isHidden = false;
    return;
  }

  if (currentScroll > lastScrollY && !isHidden) {
    headerTop.classList.add('hidden');
    scrollTopBtn.classList.add('visible');

    isHidden = true;
  }

  if (currentScroll < lastScrollY && isHidden) {
    headerTop.classList.remove('hidden');
    headerTop.classList.add('top-height');

    isHidden = false;
  }

  lastScrollY = currentScroll;
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0 });
});
