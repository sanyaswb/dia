'use strict';

const preloadImage = new Image();
preloadImage.src = './images/slider/slide-img-1--theme.webp';

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

//---------------

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

//-----------------------

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

//------------------

document.addEventListener('DOMContentLoaded', () => {
  const heroSwiper = new Swiper('.hero__slider', {
    loop: true,
    speed: 800,
    grabCursor: true,
    allowTouchMove: true,

    navigation: {
      nextEl: '.js-hero-next',
      prevEl: '.js-hero-prev',
    },

    autoplay: {
      delay: 5000,
    },
  });

  heroSwiper.on('click', () => {
    heroSwiper.slideNext();
  });
});

//--------------------------

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

//-----------------------------

const page = document.querySelector('.page');
const navBarBackground = document.querySelector('.top-bg');
const menu = document.querySelector('.menu');
const menuNavLink = document.querySelectorAll('.nav-menu__link');
const menuButtonOpen = document.querySelector('.menu-btn-link');
const menuButtonClose = document.querySelector('.menu__button--close');

menuButtonOpen.addEventListener('click', () => {
  page.classList.add('page-hidden--active');
  menu.classList.add('menu--active');
  navBarBackground.classList.add('menu-bg--active');
});

menuButtonClose.addEventListener('click', () => {
  page.classList.remove('page-hidden--active');
  menu.classList.remove('menu--active');
  navBarBackground.classList.remove('menu-bg--active');
});

menuNavLink.forEach((navLink) => {
  navLink.addEventListener('click', () => {
    page.classList.remove('page-hidden--active');
    menu.classList.remove('menu--active');
    navBarBackground.classList.remove('menu-bg--active');
  });
});
