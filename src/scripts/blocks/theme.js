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
