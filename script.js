'use strict';

//TODO Selecting Elem
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabContanier = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const logo = document.getElementById('logo');
///////////////////////////////////////
//TODO: Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
console.log(btnsOpenModal);
for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
//TODO: btn Scroll
btnScroll.addEventListener('click', event => {
  const s1coords = section1.getBoundingClientRect();
  console.log(event.target.getBoundingClientRect());

  console.log('X, Y scrolling', window.pageXOffset, pageYOffset);
  //VIDEO scrollX and scrollY deprecated the above two

  console.log(
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  // TODO: Solution No. 1
  //window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);  WITHOUT SMOOTHNESS
  // window.scrollTo({
  //   left: s1coords.left + window.scrollX, //pageXOffset //BUG OLD Version
  //   top: s1coords.top + window.scrollY, //pageYOffset
  //   behavior: 'smooth',
  // });
  // TODO: Solution No. 2
  section1.scrollIntoView({ behavior: 'smooth' });
});
///////////////////////////////////////

//TODO: Page Navigation

//BUG Without Event Delegation
// document.querySelectorAll('.nav__link').forEach(ele => {
//   ele.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//VIDEO With Event Delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  console.log(e.target);
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  ) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////

//TODO: Tabbed Component

//VIDEO Event Delegation
tabContanier.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // Guard clause
  if (!clicked) return;
  //VIDEO TABS
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  //VIDEO CONTENT
  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
///////////////////////////////////////

//TODO: Nav Component Effect

// VIDEO Event Delegation
nav.addEventListener('mouseover', function (e) {
  // mouseenter Event doesn't bubble
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = nav.querySelectorAll('.nav__link');

    siblings.forEach(sib => {
      if (sib !== link) {
        sib.style.opacity = 0.5;
        logo.style.opacity = 0.5;
      }
    });
  }
});
nav.addEventListener('mouseout', function (e) {
  nav.querySelectorAll('.nav__link').forEach(ele => (ele.style.opacity = 1));
  logo.style.opacity = 1;
});

///////////////////////////////////////

//TODO: Sticky NavBar with Intersection Observer API

const header = document.querySelector('header');
const navHeight = nav.getBoundingClientRect().height;
const obsNavFunc = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const obsNavOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(obsNavFunc, obsNavOptions);

headerObserver.observe(header);

///////////////////////////////////////
//TODO: Sections Reveal with Intersection Observer API

const allSections = document.querySelectorAll('.section');

const obsSectionFunc = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const obsSectionOptions = {
  root: null,
  threshold: 0.15,
};
const sectionObserver = new IntersectionObserver(
  obsSectionFunc,
  obsSectionOptions
);

allSections.forEach(sec => {
  sectionObserver.observe(sec);
  sec.classList.add('section--hidden');
});

///////////////////////////////////////
//TODO: Lazy Img with Intersection Observer API

const allImg = document.querySelectorAll('img[data-src]');

const obsImgFunc = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const obsImgOptions = {
  root: null,
  threshold: 0,
  rootMargin: '-200px'
};
const imgObserver = new IntersectionObserver(obsImgFunc, obsImgOptions);

allImg.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
//TODO: Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

};
slider();

/*
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // Stop propagation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
  } /*, true FOR Capturing Phase*/
//);

///////////////////////////////////////
