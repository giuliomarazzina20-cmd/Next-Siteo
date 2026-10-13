/* ==================================================================
   AUTOSCUOLA PISTACCHIO · demo di Next Siteo (attività di fantasia)
   JavaScript vanilla, nessuna libreria. Ogni blocco parte solo se
   la pagina contiene l'elemento che gli serve.
   Nessun dato viene inviato o salvato: moduli e WhatsApp mostrano
   l'avviso "Questa è una demo" (vedi ../comune/barra-demo.js).
   ================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };
  var el = function (tag, text, cls) {
    var n = document.createElement(tag);
    if (text) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  var avviso = function (msg) {
    if (window.NextSiteoDemo) window.NextSiteoDemo.avviso(msg);
  };

  /* ---------- Anno nel footer ---------- */
  $$('[data-year]').forEach(function (n) {
    n.textContent = String(new Date().getFullYear());
  });

  /* ---------- Voce di menu della pagina corrente ---------- */
  var page = document.body.getAttribute('data-page');
  if (page) {
    $$('[data-nav="' + page + '"]').forEach(function (a) {
      a.setAttribute('aria-current', 'page');
    });
  }

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

  /* ---------- Striscia scorrevole: pausa ---------- */
  $$('[data-marquee-toggle]').forEach(function (btn) {
    var box = btn.closest('[data-marquee]');
    btn.addEventListener('click', function () {
      var paused = box.classList.toggle('is-paused');
      btn.setAttribute('aria-pressed', String(paused));
    });
  });

  /* ---------- Strada che si disegna durante lo scroll ----------
     IntersectionObserver con molte soglie: nessun listener sullo scroll.
     Con movimento ridotto la strada resta già completa. */
  var roads = $$('[data-road]');
  if (roads.length && !reduced && 'IntersectionObserver' in window) {
    var steps = [];
    for (var t = 0; t <= 50; t++) steps.push(t / 50);
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          var r = en.boundingClientRect;
          var vh = en.rootBounds ? en.rootBounds.height : window.innerHeight;
          var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.25)));
          en.target.style.setProperty('--road', p.toFixed(3));
        });
      },
      { threshold: steps }
    );
    roads.forEach(function (r) {
      r.classList.add('is-drawing');
      r.style.setProperty('--road', '0');
      io.observe(r);
    });
  }

  /* ---------- Strumento "Quale patente fa per te?" ----------
     Età minime previste dal Codice della strada (indicazione orientativa). */
  var quale = $('[data-quale]');
  if (quale) {
    var out = $('[data-quale-result]', quale);
    var risposta = function (eta, veicolo) {
      if (veicolo === 'moto') {
        if (eta < 14) return { wait: 'Lo scooter si guida con la patente AM, da 14 anni. Ancora un po\' di pazienza!' };
        if (eta < 16) return { code: 'AM', slug: 'am', text: 'Scooter 50 e minicar.' };
        if (eta < 18) return { code: 'A1', slug: 'a1', text: 'Moto fino a 125 di cilindrata.' };
        if (eta < 24) return { code: 'A2', slug: 'a2', text: 'Moto di media potenza. La A, per tutte le moto, arriva a 24 anni, oppure a 20 se hai la A2 da almeno due anni.' };
        return { code: 'A', slug: 'a', text: 'Tutte le moto, senza limiti di potenza.' };
      }
      if (veicolo === 'auto') {
        if (eta < 18) return { wait: 'L\'auto si guida con la patente B, da 18 anni.' + (eta >= 14 ? ' Intanto puoi prendere la AM per lo scooter.' : '') };
        return { code: 'B', slug: 'b', text: 'Auto fino a 3,5 tonnellate.' };
      }
      if (veicolo === 'rimorchio') {
        if (eta < 18) return { wait: 'Per l\'auto con rimorchio serve la patente BE, da 18 anni.' };
        return { code: 'BE', slug: 'be', text: 'Auto con rimorchio pesante. Serve avere già la B.' };
      }
      if (eta < 18) return { wait: 'Il camion si guida con la patente C: da 21 anni, oppure da 18 insieme alla CQC per lavoro.' };
      if (eta < 21) return { code: 'C', slug: 'c', text: 'A 18 anni si può prendere solo insieme alla CQC, la qualifica per lavorare come autista. Senza CQC, da 21 anni.' };
      return { code: 'C', slug: 'c', text: 'Camion oltre le 3,5 tonnellate. Per lavorare come autista serve anche la CQC.' };
    };

    quale.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(quale);
      var eta = fd.get('eta');
      var veicolo = fd.get('veicolo');
      out.innerHTML = '';
      out.dataset.state = '';
      if (eta === null || veicolo === null) {
        out.appendChild(el('p', 'Rispondi a tutte e due le domande per vedere il risultato.'));
        out.focus();
        return;
      }
      var r = risposta(Number(eta), String(veicolo));
      if (r.wait) {
        out.appendChild(el('p', 'Ancora un po\' di pazienza', 'tool__kicker'));
        out.appendChild(el('p', r.wait));
      } else {
        out.dataset.state = 'ok';
        var a = el('a', 'Scopri la patente ' + r.code, 'btn btn--ink');
        a.href = 'patenti.html#' + r.slug;
        out.appendChild(el('p', 'La nostra proposta', 'tool__kicker'));
        out.appendChild(el('p', 'Patente ' + r.code, 'tool__big'));
        out.appendChild(el('p', r.text));
        out.appendChild(el('p', 'Indicazione orientativa: la confermiamo insieme in segreteria.', 'tool__note'));
        out.appendChild(a);
      }
      out.focus();
    });
  }

  /* ---------- Checklist documenti ---------- */
  $$('[data-check]').forEach(function (form) {
    var progress = $('[data-check-progress]', form);
    var boxes = $$('input[type="checkbox"]', form);
    var update = function () {
      var done = boxes.filter(function (b) {
        return b.checked;
      }).length;
      progress.textContent = done === boxes.length ? 'Hai tutto: puoi passare in segreteria!' : done + ' di ' + boxes.length + ' documenti pronti';
    };
    form.addEventListener('change', update);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
    });
    update();
  });

  /* ---------- Pre-iscrizione a step ---------- */
  var wiz = $('[data-wizard]');
  if (wiz) {
    var stepsEls = $$('[data-step]', wiz);
    var bar = $$('[data-steps-bar] li');
    var back = $('[data-back]', wiz);
    var next = $('[data-next]', wiz);
    var send = $('[data-send]', wiz);
    var counter = $('[data-step-count]', wiz);
    var done = $('[data-done]');
    var current = 0;

    // Patente già scelta dal link (es. iscrizione.html?patente=b)
    var pre = new URLSearchParams(location.search).get('patente');
    if (pre) {
      var radio = $('input[name="patente"][value="' + pre.replace(/[^a-z0-9-]/gi, '') + '"]', wiz);
      if (radio) radio.checked = true;
    }

    var rules = {
      0: function (fd) {
        return fd.get('patente') ? [] : [['patente', 'Scegli la patente o il servizio che ti interessa.']];
      },
      1: function (fd) {
        var e = [];
        if (String(fd.get('nome') || '').trim().length < 2) e.push(['nome', 'Scrivi nome e cognome.']);
        var tel = String(fd.get('telefono') || '').trim();
        if (!tel) e.push(['telefono', 'Scrivi un numero di telefono.']);
        else if (!/^\+?[\d\s./-]{6,20}$/.test(tel)) e.push(['telefono', 'Il numero non sembra valido: usa solo cifre e spazi.']);
        var mail = String(fd.get('email') || '').trim();
        if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) e.push(['email', 'L\'email non sembra corretta.']);
        if (!fd.get('chi')) e.push(['chi', 'Dicci chi sta compilando il modulo.']);
        return e;
      },
      2: function (fd) {
        return fd.get('privacy') ? [] : [['privacy', 'Serve l\'ok all\'informativa privacy.']];
      }
    };

    var clearErrors = function (step) {
      $$('[data-err]', step).forEach(function (p) {
        p.hidden = true;
        p.textContent = '';
      });
      $$('[aria-invalid]', step).forEach(function (i) {
        i.removeAttribute('aria-invalid');
      });
    };

    var showErrors = function (step, errors) {
      errors.forEach(function (pair, i) {
        var p = $('[data-err="' + pair[0] + '"]', step);
        if (p) {
          p.textContent = pair[1];
          p.hidden = false;
        }
        var inputs = $$('[name="' + pair[0] + '"]', step);
        inputs.forEach(function (inp) {
          inp.setAttribute('aria-invalid', 'true');
        });
        if (i === 0 && inputs[0]) inputs[0].focus();
      });
    };

    var recap = function () {
      var fd = new FormData(wiz);
      var dl = $('[data-recap]', wiz);
      var pat = $('input[name="patente"]:checked', wiz);
      var rows = [
        ['Patente', pat ? pat.parentElement.textContent.trim() : ''],
        ['Nome', fd.get('nome')],
        ['Telefono', fd.get('telefono')],
        ['Email', fd.get('email') || 'non indicata'],
        ['Compila', fd.get('chi')],
        ['Lezioni', fd.getAll('quando').join(', ') || 'nessuna preferenza']
      ];
      dl.innerHTML = '';
      rows.forEach(function (r) {
        dl.appendChild(el('dt', r[0]));
        dl.appendChild(el('dd', String(r[1])));
      });
    };

    var go = function (i, focus) {
      current = i;
      stepsEls.forEach(function (s, n) {
        s.hidden = n !== i;
      });
      bar.forEach(function (li, n) {
        li.dataset.state = n < i ? 'done' : n === i ? 'current' : '';
        if (n === i) li.setAttribute('aria-current', 'step');
        else li.removeAttribute('aria-current');
      });
      counter.textContent = 'Passo ' + (i + 1) + ' di ' + stepsEls.length;
      back.hidden = i === 0;
      next.hidden = i === stepsEls.length - 1;
      send.hidden = i !== stepsEls.length - 1;
      if (i === stepsEls.length - 1) recap();
      if (focus) $('[data-step-title]', stepsEls[i]).focus();
    };

    next.addEventListener('click', function () {
      var step = stepsEls[current];
      clearErrors(step);
      var errors = rules[current](new FormData(wiz));
      if (errors.length) return showErrors(step, errors);
      go(current + 1, true);
    });
    back.addEventListener('click', function () {
      go(current - 1, true);
    });
    wiz.addEventListener('submit', function (e) {
      e.preventDefault();
      var step = stepsEls[current];
      if (current !== stepsEls.length - 1) {
        next.click();
        return;
      }
      clearErrors(step);
      var errors = rules[current](new FormData(wiz));
      if (errors.length) return showErrors(step, errors);
      wiz.hidden = true;
      $('[data-steps-bar]').hidden = true;
      done.hidden = false;
      done.focus();
      avviso('La pre-iscrizione non è stata inviata a nessuno.');
    });
    $('[data-restart]').addEventListener('click', function () {
      wiz.reset();
      done.hidden = true;
      wiz.hidden = false;
      $('[data-steps-bar]').hidden = false;
      go(0, true);
    });
    go(0, false);
  }
})();
