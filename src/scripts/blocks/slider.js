'use strict';

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
