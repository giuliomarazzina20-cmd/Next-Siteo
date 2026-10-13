/* ==================================================================
   AUTOSCUOLA ARDESIA · demo di Next Siteo (attività di fantasia)
   Menu mobile, orario di oggi, schede dei documenti. Nessuna libreria.
   ================================================================== */
(function () {
  'use strict';

  /* ---------- Anno nel footer ---------- */
  document.querySelectorAll('[data-year]').forEach(function (n) {
    n.textContent = String(new Date().getFullYear());
  });

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    var set = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
    };
    toggle.addEventListener('click', function () {
      set(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) set(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        set(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Orario di oggi: evidenziato in tabella e scritto in alto ---------- */
  var ORARI = {
    0: null,
    1: '9:00-12:30 e 15:30-19:00',
    2: '9:00-12:30 e 15:30-19:00',
    3: '9:00-12:30 e 15:30-19:00',
    4: '9:00-12:30 e 15:30-19:00',
    5: '9:00-12:30 e 15:30-19:00',
    6: '9:00-12:00'
  };
  var day = new Date().getDay();
  var row = document.querySelector('[data-timetable] tr[data-day="' + day + '"]');
  if (row) {
    row.classList.add('is-today');
    var tag = document.createElement('span');
    tag.className = 'today-tag';
    tag.textContent = 'Oggi';
    row.querySelector('th').appendChild(tag);
  }
  var today = document.querySelector('[data-today-text]');
  if (today) {
    today.textContent = ORARI[day]
      ? 'Oggi la segreteria è aperta: ' + ORARI[day]
      : 'Oggi la segreteria è chiusa. Riapre lunedì alle 9:00';
  }

  /* ---------- Schede dei documenti (tab accessibili, frecce da tastiera) ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        select(t, false);
      });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) {
          e.preventDefault();
          select(n, true);
        }
      });
    });
  });
})();
