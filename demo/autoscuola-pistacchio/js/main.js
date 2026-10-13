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

  /* ---------- Quiz patente B ---------- */
  var quiz = $('[data-quiz]');
  if (quiz) {
    // Domande d'esempio (Codice della strada). v = risposta corretta.
    var DOMANDE = [
      { q: 'Allo STOP ci si deve fermare sempre, anche se l\'incrocio è libero.', v: true, sign: 'stop',
        e: 'Allo STOP ci si ferma sempre, si dà la precedenza e solo dopo si riparte.' },
      { q: 'Alla guida si può usare il telefono tenendolo in mano, se si va piano.', v: false,
        e: 'Il telefono in mano non si usa mai mentre si guida: solo con vivavoce o auricolare.' },
      { q: 'In autostrada il limite generale di velocità è 150 km/h.', v: false,
        e: 'Il limite generale in autostrada è 130 km/h, che scende a 110 con pioggia o neve.' },
      { q: 'Nei primi tre anni di patente B, in autostrada non si possono superare i 100 km/h.', v: true,
        e: 'Per i neopatentati il limite è 100 km/h in autostrada e 90 km/h sulle strade extraurbane principali.' },
      { q: 'Il triangolo bordato di rosso con la punta verso il basso significa «dare precedenza».', v: true, sign: 'precedenza',
        e: 'È il segnale di dare precedenza: si rallenta e, se serve, ci si ferma per far passare chi arriva.' },
      { q: 'Le cinture di sicurezza sono obbligatorie solo per chi siede davanti.', v: false,
        e: 'Le cinture vanno allacciate da tutti, anche da chi siede dietro.' },
      { q: 'Per chi ha la patente da meno di tre anni il tasso alcolemico consentito è zero.', v: true,
        e: 'Neopatentati e conducenti sotto i 21 anni devono avere tasso alcolemico zero.' },
      { q: 'Con il semaforo giallo fisso si può passare sempre, perché il rosso non è ancora scattato.', v: false, sign: 'semaforo',
        e: 'Con il giallo ci si deve fermare, a meno di essere così vicini alla linea da non poterlo fare in sicurezza.' },
      { q: 'In città, se la strada è ben illuminata, si possono usare gli abbaglianti.', v: false,
        e: 'Nei centri abitati con illuminazione sufficiente gli abbaglianti non si usano: si tengono gli anabbaglianti.' },
      { q: 'Di regola il sorpasso si fa a sinistra.', v: true,
        e: 'Si sorpassa a sinistra. A destra solo in casi precisi, per esempio se chi sta davanti svolta a sinistra.' }
    ];

    var SIGNS = {
      stop: '<svg class="quiz__sign" viewBox="0 0 100 100" aria-hidden="true"><path d="M30 4h40l26 26v40L70 96H30L4 70V30z" fill="#c8102e" stroke="#fff" stroke-width="4"/><text x="50" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="26" fill="#fff">STOP</text></svg>',
      precedenza: '<svg class="quiz__sign" viewBox="0 0 100 100" aria-hidden="true"><path d="M6 12h88L50 92z" fill="#fff" stroke="#c8102e" stroke-width="10" stroke-linejoin="round"/></svg>',
      semaforo: '<svg class="quiz__sign" viewBox="0 0 100 100" aria-hidden="true"><rect x="30" y="4" width="40" height="92" rx="12" fill="#10231e"/><circle cx="50" cy="24" r="10" fill="#4a5a55"/><circle cx="50" cy="50" r="10" fill="#f7c600"/><circle cx="50" cy="76" r="10" fill="#4a5a55"/></svg>'
    };

    var stage = $('[data-quiz-stage]', quiz);
    var meta = $('[data-quiz-meta]', quiz);
    var dots = $('[data-quiz-dots]', quiz);
    var answers = [];
    var idx = 0;

    var drawDots = function () {
      dots.innerHTML = '';
      DOMANDE.forEach(function (_, i) {
        var s = document.createElement('span');
        s.dataset.r = i < answers.length ? (answers[i] === DOMANDE[i].v ? 'ok' : 'ko') : i === idx ? 'now' : '';
        dots.appendChild(s);
      });
    };

    var showQuestion = function (focus) {
      var d = DOMANDE[idx];
      meta.firstElementChild.textContent = 'Domanda ' + (idx + 1) + ' di ' + DOMANDE.length;
      drawDots();
      stage.innerHTML =
        '<div class="card quiz__card">' +
        (d.sign ? SIGNS[d.sign] : '') +
        '<p class="quiz__q" tabindex="-1"></p>' +
        '<div class="quiz__answers" role="group" aria-label="Risposta">' +
        '<button type="button" class="btn btn--white" data-ans="true">Vero</button>' +
        '<button type="button" class="btn btn--white" data-ans="false">Falso</button>' +
        '</div><div data-feedback aria-live="polite"></div></div>';
      $('.quiz__q', stage).textContent = d.q;
      if (focus) $('.quiz__q', stage).focus();
    };

    var showFeedback = function (picked) {
      var d = DOMANDE[idx];
      var ok = picked === d.v;
      answers.push(picked);
      $$('[data-ans]', stage).forEach(function (b) {
        b.disabled = true;
        if ((b.getAttribute('data-ans') === 'true') === picked) b.dataset.picked = 'true';
      });
      var box = $('[data-feedback]', stage);
      box.className = 'quiz__feedback';
      box.dataset.r = ok ? 'ok' : 'ko';
      box.appendChild(el('strong', ok ? 'Giusto!' : 'Sbagliato'));
      box.appendChild(el('p', 'La risposta corretta è ' + (d.v ? 'VERO' : 'FALSO') + '. ' + d.e));
      var last = idx === DOMANDE.length - 1;
      var nextBtn = el('button', last ? 'Vedi il risultato' : 'Prossima domanda', 'btn btn--ink');
      nextBtn.type = 'button';
      nextBtn.addEventListener('click', function () {
        if (last) return showResult();
        idx++;
        showQuestion(true);
      });
      box.appendChild(nextBtn);
      drawDots();
      nextBtn.focus();
    };

    var showResult = function () {
      var score = answers.filter(function (a, i) {
        return a === DOMANDE[i].v;
      }).length;
      var errors = DOMANDE.length - score;
      idx = DOMANDE.length;
      meta.firstElementChild.textContent = 'Risultato';
      drawDots();
      var msg =
        errors === 0 ? 'Perfetto, nessun errore. Sei pronto per allenarti sulle schede complete!' :
        errors <= 2 ? 'Ottimo! All\'esame vero, su 30 domande, si possono sbagliare al massimo 3 risposte.' :
        'Ci sei quasi. Rileggi le spiegazioni qui sotto e riprova: con l\'allenamento si migliora in fretta.';
      stage.innerHTML =
        '<div class="card quiz__card"><p class="tool__kicker">Il tuo punteggio</p>' +
        '<p class="quiz__score" tabindex="-1"></p><p data-msg></p>' +
        '<div class="btn-row"><button type="button" class="btn btn--ink" data-restart-quiz>Rifai il quiz</button>' +
        '<a class="btn" href="iscrizione.html">Pre-iscriviti</a></div></div>' +
        '<h2 class="h3">Le tue risposte</h2><ol class="quiz__review" data-review></ol>';
      $('.quiz__score', stage).textContent = score + '/' + DOMANDE.length;
      $('[data-msg]', stage).textContent = msg;
      var list = $('[data-review]', stage);
      DOMANDE.forEach(function (d, i) {
        var ok = answers[i] === d.v;
        var li = document.createElement('li');
        li.innerHTML = '<svg class="icon ' + (ok ? 'ok' : 'ko') + '" aria-hidden="true"><use href="#i-' + (ok ? 'check' : 'x') + '"/></svg>';
        var body = document.createElement('div');
        body.appendChild(el('p', (i + 1) + '. ' + d.q));
        body.appendChild(el('p', (ok ? 'Giusto. ' : 'Sbagliato. ') + 'Risposta: ' + (d.v ? 'vero' : 'falso') + '. ' + d.e, 'muted'));
        li.appendChild(body);
        list.appendChild(li);
      });
      $('[data-restart-quiz]', stage).addEventListener('click', function () {
        answers = [];
        idx = 0;
        showQuestion(true);
      });
      $('.quiz__score', stage).focus();
    };

    stage.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ans]');
      if (!b || b.disabled) return;
      showFeedback(b.getAttribute('data-ans') === 'true');
    });

    quiz.hidden = false;
    showQuestion(false);
  }
})();
