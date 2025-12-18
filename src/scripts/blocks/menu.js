'use strict';

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
