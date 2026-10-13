/* ==================================================================
   AUTOSCUOLE CROCEVIA · AREA ALLIEVI (demo di Next Siteo)
   Calendario per prenotare le guide, elenco delle guide prenotate e
   stato del percorso. Tutto vive in memoria: nessun dato viene inviato
   o salvato, ricaricando la pagina si riparte da capo.
   ================================================================== */
(function () {
  'use strict';

  var C = window.Crocevia;
  if (!C) return;

  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  var el = function (tag, text, cls) {
    var n = document.createElement(tag);
    if (text != null) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  var avviso = function (msg) {
    if (window.NextSiteoDemo) window.NextSiteoDemo.avviso(msg);
  };
  var hh = function (h) {
    return h + ':00';
  };
  var tipoNome = function (id) {
    return C.TIPI.filter(function (t) { return t.id === id; })[0].nome;
  };
  var sedeOf = function (id) {
    return C.SEDI.filter(function (s) { return s.id === id; })[0];
  };
  var oggi = new Date();
  oggi = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate());

  /* ---------- Dati dell'allievo di prova ---------- */
  var ALLIEVO = {
    iscrizione: C.addDays(oggi, -70),
    lezioni: 18,
    lezioniTot: 20,
    schede: [2, 1, 0, 1, 0],
    esameTeoria: C.addDays(oggi, -21),
    // Guide obbligatorie già fatte (ne servono 2 per tipo)
    obbligatorie: { extraurbana: 2, autostrada: 1, notturna: 0 },
    guideFatte: 5
  };

  // Una guida già prenotata: il prossimo giorno feriale alle 10
  var primo = C.addDays(oggi, 1);
  while (primo.getDay() === 0 || primo.getDay() === 6) primo = C.addDays(primo, 1);
  var state = {
    sede: 'vallefinta',
    tipo: 'citta',
    week: 0,
    day: null,
    bookings: [{ sede: 'vallefinta', date: C.iso(primo), ora: 10, tipo: 'autostrada', auto: C.auto('vallefinta', primo, 10) }]
  };

  var mine = function (date, ora) {
    return state.bookings.filter(function (b) {
      return b.date === C.iso(date) && b.ora === ora;
    })[0];
  };

  var slotState = function (date, ora) {
    var b = mine(date, ora);
    if (b && b.sede === state.sede) return 'mine';
    if (b) return 'conflict';
    if (C.passato(date, ora)) return 'past';
    if (C.occupato(state.sede, date, ora)) return 'busy';
    return 'free';
  };

  var weekDays = function (w) {
    var mon = C.addDays(C.monday(oggi), 7 * w);
    var out = [];
    for (var i = 0; i < 6; i++) out.push(C.addDays(mon, i));
    return out;
  };

  var freeCount = function (date) {
    return C.ore(date, state.tipo).filter(function (h) {
      return slotState(date, h) === 'free';
    }).length;
  };

  var selectable = function (date) {
    return date >= oggi && C.ore(date, state.tipo).length > 0;
  };

  // Primo giorno utile con posti liberi (anche nelle settimane successive)
  var pickDefault = function () {
    for (var w = 0; w < 3; w++) {
      var days = weekDays(w);
      for (var i = 0; i < days.length; i++) {
        if (selectable(days[i]) && freeCount(days[i]) > 0) {
          state.week = w;
          state.day = C.iso(days[i]);
          return;
        }
      }
    }
  };

  /* ---------- Filtri ---------- */
  var selSede = $('[data-sede]');
  var selTipo = $('[data-tipo]');
  C.SEDI.forEach(function (s) {
    var o = el('option', s.nome + ', ' + s.indirizzo);
    o.value = s.id;
    selSede.appendChild(o);
  });
  C.TIPI.forEach(function (t) {
    var o = el('option', t.nome);
    o.value = t.id;
    selTipo.appendChild(o);
  });
  selSede.addEventListener('change', function () {
    state.sede = selSede.value;
    renderCalendar();
  });
  selTipo.addEventListener('change', function () {
    state.tipo = selTipo.value;
    var d = state.day ? C.fromIso(state.day) : null;
    if (!d || !selectable(d)) pickDefault();
    renderCalendar();
  });

  /* ---------- Calendario ---------- */
  var label = $('[data-week-label]');
  var daysBox = $('[data-days]');
  var slotsBox = $('[data-slots]');
  var slotsTitle = $('[data-slots-title]');
  var prev = $('[data-week-prev]');
  var next = $('[data-week-next]');

  prev.addEventListener('click', function () {
    state.week = Math.max(0, state.week - 1);
    var d = weekDays(state.week).filter(selectable)[0];
    state.day = d ? C.iso(d) : null;
    renderCalendar();
  });
  next.addEventListener('click', function () {
    state.week = Math.min(2, state.week + 1);
    var d = weekDays(state.week).filter(selectable)[0];
    state.day = d ? C.iso(d) : null;
    renderCalendar();
  });

  function renderCalendar() {
    var days = weekDays(state.week);
    var a = days[0];
    var b = days[days.length - 1];
    label.textContent =
      a.getMonth() === b.getMonth()
        ? a.getDate() + '-' + b.getDate() + ' ' + C.MESI[b.getMonth()]
        : a.getDate() + ' ' + C.MESI[a.getMonth()] + '-' + b.getDate() + ' ' + C.MESI[b.getMonth()];
    prev.disabled = state.week === 0;
    next.disabled = state.week === 2;

    daysBox.innerHTML = '';
    days.forEach(function (d) {
      var btn = el('button', null, 'day');
      btn.type = 'button';
      var ok = selectable(d);
      var free = ok ? freeCount(d) : 0;
      btn.disabled = !ok;
      btn.setAttribute('aria-pressed', String(C.iso(d) === state.day));
      btn.setAttribute('aria-label', C.dataLunga(d) + (ok ? ', ' + free + (free === 1 ? ' orario libero' : ' orari liberi') : ', non disponibile'));
      btn.appendChild(el('span', C.GIORNI_BREVI[d.getDay()], 'day__name'));
      btn.appendChild(el('span', String(d.getDate()), 'day__num'));
      btn.appendChild(el('span', ok ? free + ' liberi' : '-', 'day__free'));
      btn.addEventListener('click', function () {
        state.day = C.iso(d);
        renderCalendar();
      });
      daysBox.appendChild(btn);
    });
    renderSlots();
  }

  function renderSlots() {
    slotsBox.innerHTML = '';
    if (!state.day) {
      slotsBox.appendChild(el('p', 'Nessun giorno disponibile in questa settimana: prova con la successiva.', 'empty'));
      return;
    }
    var d = C.fromIso(state.day);
    slotsTitle.textContent = 'Orari di ' + C.dataLunga(d);
    var hours = C.ore(d, state.tipo);
    if (!hours.length) {
      slotsBox.appendChild(el('p', 'In questo giorno non ci sono guide di questo tipo.', 'empty'));
      return;
    }
    var txt = { free: 'Libero', busy: 'Occupato', mine: 'La tua guida', past: 'Passato', conflict: 'Hai già una guida' };
    hours.forEach(function (h) {
      var s = slotState(d, h);
      var btn = el('button', null, 'slot');
      btn.type = 'button';
      btn.dataset.state = s === 'conflict' ? 'busy' : s;
      btn.appendChild(document.createTextNode(hh(h)));
      btn.appendChild(el('small', txt[s]));
      btn.setAttribute('aria-label', C.dataLunga(d) + ', ore ' + hh(h) + ': ' + txt[s].toLowerCase());
      if (s === 'free') {
        btn.addEventListener('click', function () {
          ask(d, h);
        });
      } else {
        btn.setAttribute('aria-disabled', 'true');
      }
      slotsBox.appendChild(btn);
    });
  }

  /* ---------- Conferma prenotazione ---------- */
  var dlg = $('[data-confirm]');
  var dlgList = $('[data-confirm-list]');
  var pending = null;

  function ask(d, h) {
    pending = { sede: state.sede, date: C.iso(d), ora: h, tipo: state.tipo, auto: C.auto(state.sede, d, h) };
    var rows = [
      ['Giorno', C.dataLunga(d)],
      ['Orario', hh(h) + '-' + hh(h + 1)],
      ['Sede', sedeOf(state.sede).nome + ', ' + sedeOf(state.sede).indirizzo],
      ['Guida', tipoNome(state.tipo)],
      ['Auto', pending.auto]
    ];
    dlgList.innerHTML = '';
    rows.forEach(function (r) {
      dlgList.appendChild(el('dt', r[0]));
      dlgList.appendChild(el('dd', r[1]));
    });
    if (typeof dlg.showModal === 'function') {
      dlg.returnValue = '';
      dlg.showModal();
    } else if (window.confirm('Confermi la guida di ' + C.dataLunga(d) + ' alle ' + hh(h) + '?')) {
      book();
    }
  }

  dlg.addEventListener('close', function () {
    if (dlg.returnValue === 'ok') book();
    pending = null;
  });

  function book() {
    if (!pending) return;
    state.bookings.push(pending);
    avviso('Guida prenotata per finta: ' + C.dataLunga(C.fromIso(pending.date)) + ' alle ' + hh(pending.ora) + '. Nessun dato è stato inviato.');
    renderAll();
  }

  /* ---------- Le mie guide ---------- */
  var list = $('[data-bookings]');
  var count = $('[data-count]');

  function renderBookings() {
    var sorted = state.bookings.slice().sort(function (a, b) {
      return a.date === b.date ? a.ora - b.ora : a.date < b.date ? -1 : 1;
    });
    count.textContent = String(sorted.length);
    count.hidden = sorted.length === 0;
    list.innerHTML = '';
    if (!sorted.length) {
      var li = el('li', null, 'empty');
      li.appendChild(el('p', 'Nessuna guida prenotata.'));
      var go = el('button', 'Prenota una guida', 'btn btn--sm');
      go.type = 'button';
      go.style.marginTop = '10px';
      go.addEventListener('click', function () {
        selectTab(tabs[0], true);
      });
      li.appendChild(go);
      list.appendChild(li);
      return;
    }
    sorted.forEach(function (b) {
      var d = C.fromIso(b.date);
      var li = el('li', null, 'booking');
      var box = el('span', null, 'booking__date');
      box.setAttribute('aria-hidden', 'true');
      box.appendChild(el('b', String(d.getDate())));
      box.appendChild(el('small', C.MESI[d.getMonth()].slice(0, 3)));
      var body = el('div');
      body.appendChild(el('h3', 'Guida ' + tipoNome(b.tipo).toLowerCase() + ', ' + C.GIORNI[d.getDay()] + ' ' + d.getDate() + ' alle ' + hh(b.ora)));
      body.appendChild(el('p', 'Sede ' + sedeOf(b.sede).nome + ' · ' + b.auto));
      var del = el('button', 'Disdici', 'btn btn--ghost btn--sm');
      del.type = 'button';
      del.setAttribute('aria-label', 'Disdici la guida di ' + C.dataLunga(d) + ' alle ' + hh(b.ora));
      del.addEventListener('click', function () {
        state.bookings.splice(state.bookings.indexOf(b), 1);
        avviso('Guida disdetta per finta: il posto torna libero nel calendario.');
        renderAll();
        list.focus();
      });
      li.appendChild(box);
      li.appendChild(body);
      li.appendChild(del);
      list.appendChild(li);
    });
  }
  list.tabIndex = -1;

  /* ---------- Il mio percorso ---------- */
  var summary = $('[data-summary]');
  var path = $('[data-path]');

  function data(d) {
    return d.getDate() + ' ' + C.MESI[d.getMonth()] + ' ' + d.getFullYear();
  }

  function renderPath() {
    var prenotate = { extraurbana: 0, autostrada: 0, notturna: 0, citta: 0 };
    state.bookings.forEach(function (b) {
      prenotate[b.tipo]++;
    });
    var daFare = ['extraurbana', 'autostrada', 'notturna'].reduce(function (n, t) {
      return n + Math.max(0, 2 - ALLIEVO.obbligatorie[t]);
    }, 0);
    var scadenza = C.addDays(ALLIEVO.esameTeoria, 365);

    summary.innerHTML = '';
    [
      [String(ALLIEVO.guideFatte), 'Guide fatte'],
      [String(state.bookings.length), 'Guide prenotate'],
      [String(daFare), 'Obbligatorie da fare'],
      [scadenza.getDate() + '/' + (scadenza.getMonth() + 1) + '/' + scadenza.getFullYear(), 'Foglio rosa valido fino al']
    ].forEach(function (s) {
      var box = el('div', null, 'stat');
      box.appendChild(el('b', s[0]));
      box.appendChild(el('span', s[1]));
      summary.appendChild(box);
    });

    var steps = [
      { t: 'Iscrizione', st: 'done', chip: ['Fatto', 'ok'], body: 'Iscritto il ' + data(ALLIEVO.iscrizione) + '.' },
      { t: 'Lezioni di teoria', st: 'done', chip: ['Fatto', 'ok'], body: 'Ultime cinque schede d\'esame: ' + ALLIEVO.schede.join(', ') + ' errori.',
        meter: ['Lezioni seguite', ALLIEVO.lezioni, ALLIEVO.lezioniTot] },
      { t: 'Esame di teoria', st: 'done', chip: ['Superato', 'ok'], body: 'Superato il ' + data(ALLIEVO.esameTeoria) + '.' },
      { t: 'Foglio rosa', st: 'done', chip: ['Attivo', 'ok'], body: 'Ti permette di esercitarti alla guida fino al ' + data(scadenza) + '.' },
      { t: 'Guide pratiche', st: 'now', chip: ['In corso', 'warn'], body: 'Le guide obbligatorie sono sei: due extraurbane, due in autostrada e due di notte.', req: true },
      { t: 'Esame di guida', st: '', chip: ['Da prenotare', ''], body: 'Si prenota quando hai finito le guide obbligatorie e l\'istruttore ti dà l\'ok.' }
    ];

    path.innerHTML = '';
    steps.forEach(function (s, i) {
      var li = el('li', null, 'path__step');
      li.dataset.state = s.st;
      var dot = el('span', null, 'path__dot');
      dot.setAttribute('aria-hidden', 'true');
      if (s.st === 'done') dot.innerHTML = '<svg class="icon"><use href="#i-check"/></svg>';
      else dot.textContent = String(i + 1);
      var head = el('div', null, 'path__head');
      head.appendChild(el('h3', s.t));
      head.appendChild(el('span', s.chip[0], 'chip' + (s.chip[1] ? ' chip--' + s.chip[1] : '')));
      var body = el('div', null, 'path__body');
      body.appendChild(el('p', s.body));
      if (s.meter) {
        var m = el('div', null, 'meter');
        var row = el('div', null, 'meter__row');
        row.appendChild(el('span', s.meter[0]));
        row.appendChild(el('span', s.meter[1] + ' di ' + s.meter[2]));
        var pr = document.createElement('progress');
        pr.max = s.meter[2];
        pr.value = s.meter[1];
        pr.setAttribute('aria-label', s.meter[0]);
        m.appendChild(row);
        m.appendChild(pr);
        body.appendChild(m);
      }
      if (s.req) {
        var ul = el('ul', null, 'req');
        ul.setAttribute('role', 'list');
        [['extraurbana', 'Extraurbane'], ['autostrada', 'In autostrada'], ['notturna', 'Notturne']].forEach(function (r) {
          var done = ALLIEVO.obbligatorie[r[0]];
          var item = el('li');
          item.appendChild(el('span', r[1] + ': ' + done + ' di 2'));
          var chip;
          if (done >= 2) chip = el('span', 'Fatte', 'chip chip--ok');
          else if (prenotate[r[0]]) chip = el('span', prenotate[r[0]] + (prenotate[r[0]] === 1 ? ' prenotata' : ' prenotate'), 'chip chip--accent');
          else chip = el('span', 'Da prenotare', 'chip chip--warn');
          item.appendChild(chip);
          ul.appendChild(item);
        });
        body.appendChild(ul);
      }
      li.appendChild(dot);
      li.appendChild(head);
      li.appendChild(body);
      path.appendChild(li);
    });
  }

  /* ---------- Schede (tab) ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      selectTab(t, false);
    });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) {
        e.preventDefault();
        selectTab(n, true);
      }
    });
  });

  function renderAll() {
    renderCalendar();
    renderBookings();
    renderPath();
  }

  pickDefault();
  renderAll();

  // Anteprima nel sito di Next Siteo (?vista=calendario): la pagina parte già sul calendario.
  // window.scrollTo muove solo questa pagina, non quella che la contiene.
  if (/[?&]vista=calendario/.test(location.search)) {
    var cal = document.getElementById('calendario');
    var top = cal.getBoundingClientRect().top + window.pageYOffset - 140;
    window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
  }
})();
