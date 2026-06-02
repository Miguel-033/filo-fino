/**
 * infinite-video-carousel.js
 * Makes .blog-grid--videos an infinite cyclic carousel on mobile.
 *
 * Strategy: add one clone of the last item before the first,
 * and one clone of the first item after the last.
 *
 *   DOM:  [ C'  |  A  B  C  |  A' ]
 *
 * Start positioned at A.
 * Swipe right past C → land on A' → instantly jump to real A.
 * Swipe left  past A → land on C' → instantly jump to real C.
 */
(function () {
  'use strict';

  function initGrid(grid) {
    if (window.innerWidth > 767) return;

    var items = Array.from(grid.children);
    var n = items.length;
    if (n < 2) return;

    /* Prepend clone of last item, append clone of first */
    var cloneLast  = items[n - 1].cloneNode(true);
    var cloneFirst = items[0].cloneNode(true);
    grid.insertBefore(cloneLast, grid.firstChild);
    grid.appendChild(cloneFirst);

    /* Width of one item + gap = how far to scroll per slide */
    function stride() {
      var item = grid.querySelector('.videoBlogWrap');
      if (!item) return 0;
      var gap = parseFloat(window.getComputedStyle(grid).columnGap) || 16;
      return item.offsetWidth + gap;
    }

    /* Start at real item A (index 1 — skip the prepended clone) */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        grid.scrollLeft = stride();
      });
    });

    /* After each scroll settles: loop if we landed on a clone */
    function loopCheck() {
      var s  = stride();
      if (!s) return;
      var sl = grid.scrollLeft;

      if (sl < s * 0.5) {
        /* landed on C' → jump to real C (index n) */
        grid.style.scrollSnapType = 'none';
        grid.scrollLeft = s * n;
        requestAnimationFrame(function () { grid.style.scrollSnapType = ''; });

      } else if (sl > s * n + s * 0.5) {
        /* landed on A' → jump to real A (index 1) */
        grid.style.scrollSnapType = 'none';
        grid.scrollLeft = s;
        requestAnimationFrame(function () { grid.style.scrollSnapType = ''; });
      }
    }

    /* Use scrollend when available; debounce as fallback */
    if ('onscrollend' in window) {
      grid.addEventListener('scrollend', loopCheck);
    } else {
      var t;
      grid.addEventListener('scroll', function () {
        clearTimeout(t);
        t = setTimeout(loopCheck, 80);
      }, { passive: true });
    }
  }

  function init() {
    document.querySelectorAll('.blog-grid--videos').forEach(initGrid);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
