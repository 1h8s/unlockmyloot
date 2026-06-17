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
      { top: 8, x0: '-18vw', x1: '92vw', hit: '50vw', dur: 5.8, del: -1.2, op: 0.8, tdur: 4.6, tdel: 0, sdur: 3.7, sdel: -0.6 },
      { top: 18, x0: '86vw', x1: '-20vw', hit: '55vw', dur: 6.6, del: -3.0, op: 0.48, tdur: 5.3, tdel: -1.5, sdur: 4.2, sdel: -2.0 },
      { top: 29, x0: '-12vw', x1: '88vw', hit: '46vw', dur: 4.9, del: -2.2, op: 0.66, tdur: 4.1, tdel: -0.8, sdur: 3.4, sdel: -1.6 },
      { top: 41, x0: '94vw', x1: '-24vw', hit: '52vw', dur: 5.4, del: -0.4, op: 0.58, tdur: 5.8, tdel: -2.4, sdur: 4.7, sdel: -0.2 },
      { top: 53, x0: '-22vw', x1: '90vw', hit: '48vw', dur: 6.1, del: -4.2, op: 0.72, tdur: 4.8, tdel: -1.0, sdur: 3.9, sdel: -2.7 },
      { top: 65, x0: '78vw', x1: '-18vw', hit: '58vw', dur: 5.1, del: -1.8, op: 0.42, tdur: 5.2, tdel: -2.0, sdur: 4.1, sdel: -1.2 },
      { top: 77, x0: '-16vw', x1: '86vw', hit: '51vw', dur: 6.9, del: -5.0, op: 0.5, tdur: 6.0, tdel: -3.2, sdur: 5.0, sdel: -3.4 },
      { top: 89, x0: '90vw', x1: '-26vw', hit: '45vw', dur: 5.6, del: -2.8, op: 0.38, tdur: 4.4, tdel: -1.7, sdur: 3.6, sdel: -2.3 }
    ];

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var track = document.createElement('div');
      track.className = 'bgtrack';
      track.style.top = row.top + '%';
      track.style.setProperty('--tdur', row.tdur + 's');
      track.style.setProperty('--tdel', row.tdel + 's');
      track.style.setProperty('--sdur', row.sdur + 's');
      track.style.setProperty('--sdel', row.sdel + 's');

      var pin = document.createElement('div');
      pin.className = 'bgpin';
      pin.style.setProperty('--x0', row.x0);
      pin.style.setProperty('--x1', row.x1);
      pin.style.setProperty('--hit', row.hit);
      pin.style.setProperty('--dur', row.dur + 's');
      pin.style.setProperty('--del', row.del + 's');
      pin.style.setProperty('--op', String(row.op));

      if (reduced) {
        pin.style.opacity = '0.25';
        pin.style.transform = 'translate3d(' + row.x0 + ', -50%, 0)';
      }

      track.appendChild(pin);
      inner.appendChild(track);
    }

    root.appendChild(inner);
  }

  function syncPageBgHeight() {
    var root = document.getElementById('pagebg');
    if (!root) return;
    var h = Math.max(
      document.documentElement.scrollHeight || 0,
      document.body.scrollHeight || 0,
      window.innerHeight || 0
    );
    root.style.setProperty('--pagebg-h', h + 'px');
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
  syncPageBgHeight();
  staggerRise();
  injectThemeBtn();
  window.addEventListener('load', syncPageBgHeight);
  window.addEventListener('resize', syncPageBgHeight);
})();
