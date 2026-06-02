/**
 * carousel.js — Reviews carousel for Filo Fino
 * Simple, dependency-free. Auto-advances every 5 s.
 */
document.addEventListener('DOMContentLoaded', function () {
  var items = document.querySelectorAll('#rc .rc__item');
  var dots  = document.querySelectorAll('#rcDots .reviews-dots__dot');

  if (!items.length) return;

  var cur   = 0;
  var timer = null;

  function show(n) {
    items[cur].classList.remove('rc__item--active');
    dots[cur].classList.remove('reviews-dots__dot--active');
    cur = (n + items.length) % items.length;
    items[cur].classList.add('rc__item--active');
    dots[cur].classList.add('reviews-dots__dot--active');
  }

  function start() {
    timer = setInterval(function () { show(cur + 1); }, 5000);
  }

  function reset(n) {
    clearInterval(timer);
    show(n);
    start();
  }

  /* Prev / Next */
  var prevBtn = document.querySelector('.reviews-control--prev');
  var nextBtn = document.querySelector('.reviews-control--next');
  if (prevBtn) prevBtn.addEventListener('click', function () { reset(cur - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { reset(cur + 1); });

  /* Dots */
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { reset(i); });
  });

  start();
});
