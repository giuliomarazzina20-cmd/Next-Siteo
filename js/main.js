/* ==================================================================
   NEXT SITEO · SCRIPT (JavaScript vanilla, nessuna libreria)
   - menu mobile
   - bordo dell'header dopo lo scroll (IntersectionObserver)
   - comparsa delle sezioni allo scroll (rispetta prefers-reduced-motion)
   - scala delle anteprime delle demo dentro le cornici
   - modulo contatti: Formspree con fetch, oppure email già compilata
   ================================================================== */
(function () {
  'use strict';

  var EMAIL = 'nextsiteo.office@gmail.com';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Anno nel footer ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    var label = toggle.querySelector('.sr-only');
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Chiudi il menu' : 'Apri il menu';
      menu.hidden = !open;
    };
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 960px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Header: bordo e ombra appena si scorre ---------- */
  var header = document.querySelector('[data-header]');
  var sentinel = document.querySelector('.top-sentinel');
  if (header && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- Comparsa allo scroll ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-visible');
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- Anteprime delle demo: l'iframe viene scalato alla larghezza della cornice ---------- */
  var screens = document.querySelectorAll('[data-screen]');
  var fit = function (screen) {
    var frame = screen.querySelector('iframe');
    if (!frame) return;
    var w = frame.offsetWidth;
    if (w) screen.style.setProperty('--scale', String(screen.clientWidth / w));
  };
  screens.forEach(fit);
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function (entries) {
      entries.forEach(function (en) {
        fit(en.target);
      });
    });
    screens.forEach(function (s) {
      ro.observe(s);
    });
  } else {
    window.addEventListener('resize', function () {
      screens.forEach(fit);
    });
  }

  /* ---------- Modulo contatti ---------- */
  var form = document.querySelector('[data-contact-form]');
  if (!form) return;

  var status = form.querySelector('[data-form-status]');
  var summary = form.querySelector('[data-form-summary]');
  var summaryList = form.querySelector('[data-form-summary-list]');
  var submit = form.querySelector('[data-submit]');
  var endpoint = form.getAttribute('action') || '';
  var endpointReady = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(endpoint) && endpoint.indexOf('XXXXXXX') === -1;

  var rules = {
    nome: function (v) {
      return v.trim().length < 2 ? 'Scrivete il vostro nome.' : '';
    },
    attivita: function (v) {
      return v.trim().length < 2 ? 'Scrivete che attività avete.' : '';
    },
    email: function (v) {
      if (!v.trim()) return 'Scrivete il vostro indirizzo email.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : "L'indirizzo email non sembra corretto.";
    },
    telefono: function (v) {
      if (!v.trim()) return '';
      return /^\+?[\d\s./-]{6,20}$/.test(v.trim()) ? '' : 'Il numero non sembra corretto: usate solo cifre, spazi e un eventuale + iniziale.';
    },
    privacy: function (_, el) {
      return el.checked ? '' : "Per inviare la richiesta serve l'ok all'informativa privacy.";
    }
  };

  var field = function (name) {
    return form.elements.namedItem(name);
  };

  var setError = function (name, msg) {
    var el = field(name);
    var err = document.getElementById(el.id + '-err');
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) {
      err.textContent = msg;
      err.hidden = !msg;
    }
  };

  var validate = function (name) {
    var el = field(name);
    return rules[name](el.value || '', el);
  };

  var show = function (html, type) {
    status.innerHTML = html;
    status.dataset.type = type || 'ok';
    status.hidden = false;
    status.focus();
  };

  // Dopo il primo errore, il messaggio si aggiorna mentre si corregge
  form.addEventListener('input', function (e) {
    var name = e.target.name;
    if (rules[name] && e.target.getAttribute('aria-invalid') === 'true') setError(name, validate(name));
  });
  form.addEventListener('change', function (e) {
    var name = e.target.name;
    if (rules[name] && e.target.getAttribute('aria-invalid') === 'true') setError(name, validate(name));
  });

  var buildText = function (data) {
    return [
      'Nome: ' + data.get('nome'),
      'Attività: ' + data.get('attivita'),
      'Email: ' + data.get('email'),
      'Telefono: ' + (data.get('telefono') || '-'),
      '',
      String(data.get('messaggio') || '')
    ].join('\n');
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.hidden = true;

    var data = new FormData(form);

    // Campo trappola compilato: è un robot, non inviamo nulla
    if (String(data.get('_gotcha') || '')) {
      form.reset();
      show('Grazie! Vi rispondiamo al più presto.');
      return;
    }

    var errors = [];
    Object.keys(rules).forEach(function (name) {
      var msg = validate(name);
      setError(name, msg);
      if (msg) errors.push([name, msg]);
    });

    if (errors.length) {
      summaryList.innerHTML = '';
      errors.forEach(function (pair) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + field(pair[0]).id;
        a.textContent = pair[1];
        a.addEventListener('click', function (ev) {
          ev.preventDefault();
          field(pair[0]).focus();
        });
        li.appendChild(a);
        summaryList.appendChild(li);
      });
      summary.hidden = false;
      summary.focus();
      return;
    }
    summary.hidden = true;

    // Endpoint Formspree non ancora configurato: si apre un'email già compilata
    if (!endpointReady) {
      var url =
        'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent('Richiesta preventivo: ' + data.get('attivita')) +
        '&body=' + encodeURIComponent(buildText(data));
      window.location.href = url;
      show(
        'Vi abbiamo aperto un\'email già compilata: premete invio per mandarcela. ' +
          'Se non si è aperto nulla, scriveteci a <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.'
      );
      return;
    }

    submit.setAttribute('aria-busy', 'true');
    data.delete('_gotcha');
    fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        show('Grazie, richiesta inviata! Vi rispondiamo al più presto.');
      })
      .catch(function () {
        show(
          'Invio non riuscito. Riprovate tra poco oppure scriveteci a <a href="mailto:' + EMAIL + '">' + EMAIL +
            '</a> o su <a href="https://wa.me/393472261131" target="_blank" rel="noopener">WhatsApp</a>.',
          'error'
        );
      })
      .then(function () {
        submit.removeAttribute('aria-busy');
      });
  });
})();
