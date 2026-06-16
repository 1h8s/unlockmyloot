(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function buildPageBg() {
    var root = document.getElementById('pagebg');
    if (!root) return;

    var inner = document.createElement('div');
    inner.className = 'herobg-inner';
    inner.innerHTML = '<div class="centerline"></div>';

    var rows = [
      { top: 10, x0: '8vw', dur: 8.2, del: 0, op: 0.75 },
      { top: 24, x0: '82vw', dur: 9.1, del: 1.1, op: 0.5 },
      { top: 38, x0: '24vw', dur: 7.4, del: 0.6, op: 0.65 },
      { top: 52, x0: '70vw', dur: 8.8, del: 2.0, op: 0.55 },
      { top: 66, x0: '14vw', dur: 7.9, del: 1.5, op: 0.7 },
      { top: 80, x0: '58vw', dur: 9.6, del: 0.3, op: 0.45 }
    ];

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var track = document.createElement('div');
      track.className = 'bgtrack';
      track.style.top = row.top + '%';

      var pin = document.createElement('div');
      pin.className = 'bgpin';
      pin.style.setProperty('--x0', row.x0);
      pin.style.setProperty('--dur', row.dur + 's');
      pin.style.setProperty('--del', row.del + 's');
      pin.style.setProperty('--op', String(row.op));

      if (reduced) {
        pin.style.opacity = '0.25';
        pin.style.transform = 'translate3d(calc(' + row.x0 + ' * 0.5), -50%, 0)';
      }

      track.appendChild(pin);
      inner.appendChild(track);
    }

    root.appendChild(inner);
  }

  function staggerRise() {
    var nodes = document.querySelectorAll('.top, .crumb, .article > *');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].classList.add('rise');
      nodes[i].style.setProperty('--d', String(i));
    }
  }

  function applyTheme(next) {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('uml-theme', next); } catch (e) {}
  }

  function injectThemeBtn() {
    var nav = document.querySelector('.nav');
    if (!nav || nav.querySelector('.themebtn')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'themebtn';
    btn.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Toggle theme' : 'Сменить тему');
    btn.innerHTML =
      '<svg class="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">' +
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
      '<svg class="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';

    btn.addEventListener('click', function () {
      var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      if (document.startViewTransition) {
        document.startViewTransition(function () { applyTheme(next); });
      } else {
        applyTheme(next);
      }
    });

    nav.appendChild(btn);
  }

  buildPageBg();
  staggerRise();
  injectThemeBtn();
})();
