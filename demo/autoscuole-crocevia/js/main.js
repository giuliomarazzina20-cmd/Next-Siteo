/* ==================================================================
   AUTOSCUOLE CROCEVIA · SITO (demo di Next Siteo)
   Menu mobile, prossime guide libere in home, candidatura "Lavora con noi".
   Nessun dato viene inviato.
   ================================================================== */
(function () {
  'use strict';

  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  var el = function (tag, text, cls) {
    var n = document.createElement(tag);
    if (text != null) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };

  /* ---------- Anno nel footer ---------- */
  document.querySelectorAll('[data-year]').forEach(function (n) {
    n.textContent = String(new Date().getFullYear());
  });

  /* ---------- Menu mobile ---------- */
  var toggle = $('[data-menu-toggle]');
  var menu = $('[data-menu]');
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

  /* ---------- Home: prossime guide libere (dati finti di dati.js) ---------- */
  var next = $('[data-next-slots]');
  if (next && window.Crocevia) {
    var C = window.Crocevia;
    var slots = C.prossimiLiberi(3);
    if (slots.length) {
      next.innerHTML = '';
      slots.forEach(function (s) {
        var li = el('li', null, 'slot-row');
        var t = el('span', null, 'slot-row__time');
        t.appendChild(el('span', C.GIORNI_BREVI[s.date.getDay()] + ' ' + s.date.getDate()));
        t.appendChild(el('b', s.ora + ':00'));
        var info = el('span');
        info.appendChild(el('strong', 'Sede ' + s.sede.nome));
        info.appendChild(document.createElement('br'));
        info.appendChild(el('span', C.auto(s.sede.id, s.date, s.ora), 'muted'));
        var a = el('a', 'Prenota', 'btn btn--ghost btn--sm');
        a.href = 'area-allievi.html';
        a.setAttribute('aria-label', 'Prenota la guida di ' + C.dataLunga(s.date) + ' alle ' + s.ora + ':00, sede ' + s.sede.nome);
        li.appendChild(t);
        li.appendChild(info);
        li.appendChild(a);
        next.appendChild(li);
      });
    }
  }

  /* ---------- Lavora con noi: candidatura ---------- */
  var job = $('[data-job]');
  if (job) {
    var box = $('[data-errors]');
    var boxList = $('[data-errors-list]');
    var success = $('[data-success]');

    var rules = [
      ['nome', 'j-nome', function (f) { return f.get('nome').trim().length < 2 ? 'Scrivi nome e cognome.' : ''; }],
      ['telefono', 'j-tel', function (f) {
        var v = f.get('telefono').trim();
        return !v ? 'Scrivi un numero di telefono.' : !/^\+?[\d\s./-]{6,20}$/.test(v) ? 'Il numero non sembra valido.' : '';
      }],
      ['email', 'j-email', function (f) {
        var v = f.get('email').trim();
        return !v ? 'Scrivi la tua email.' : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? 'L\'email non sembra corretta.' : '';
      }],
      ['ruolo', 'j-ruolo', function (f) { return f.get('ruolo') ? '' : 'Scegli il ruolo che ti interessa.'; }],
      ['sedi', 'j-sedi', function (f) { return f.getAll('sedi').length ? '' : 'Scegli almeno una sede.'; }],
      ['privacy', 'j-privacy', function (f) { return f.get('privacy') ? '' : 'Serve l\'ok all\'informativa privacy.'; }]
    ];

    job.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(job);
      var errors = [];
      rules.forEach(function (r) {
        var msg = r[2](fd);
        var err = document.getElementById(r[1] + '-err');
        err.textContent = msg;
        err.hidden = !msg;
        job.querySelectorAll('[name="' + r[0] + '"]').forEach(function (i) {
          if (msg) i.setAttribute('aria-invalid', 'true');
          else i.removeAttribute('aria-invalid');
        });
        if (msg) errors.push([r[0], msg]);
      });
      if (errors.length) {
        boxList.innerHTML = '';
        errors.forEach(function (er) {
          var li = el('li');
          var a = el('a', er[1]);
          var target = job.querySelector('[name="' + er[0] + '"]');
          a.href = '#' + (target.id || '');
          a.addEventListener('click', function (ev) {
            ev.preventDefault();
            target.focus();
          });
          li.appendChild(a);
          boxList.appendChild(li);
        });
        box.hidden = false;
        box.focus();
        return;
      }
      box.hidden = true;
      job.hidden = true;
      success.hidden = false;
      success.focus();
      if (window.NextSiteoDemo) window.NextSiteoDemo.avviso('La candidatura non è stata inviata a nessuno.');
    });

    $('[data-again]').addEventListener('click', function () {
      job.reset();
      success.hidden = true;
      job.hidden = false;
      $('#j-nome').focus();
    });
  }
})();
