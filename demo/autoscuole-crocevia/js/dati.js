/* ==================================================================
   AUTOSCUOLE CROCEVIA · DATI FINTI (demo di Next Siteo)
   Sedi, tipi di guida e orari occupati sono generati qui, in modo
   ripetibile: lo stesso giorno mostra sempre gli stessi posti liberi.
   In un sito vero questi dati arriverebbero dal gestionale.
   ================================================================== */
(function () {
  'use strict';

  var SEDI = [
    { id: 'vallefinta', nome: 'Vallefinta', indirizzo: 'Corso Centrale 40', auto: ['Auto 1, cambio manuale', 'Auto 2, cambio automatico'] },
    { id: 'pratofinto', nome: 'Pratofinto', indirizzo: 'Via delle Querce 8', auto: ['Auto 3, cambio manuale'] },
    { id: 'borgo-lago', nome: 'Borgo Lago', indirizzo: 'Lungolago 15', auto: ['Auto 4, cambio manuale'] }
  ];

  var TIPI = [
    { id: 'citta', nome: 'Città' },
    { id: 'extraurbana', nome: 'Extraurbana' },
    { id: 'autostrada', nome: 'Autostrada' },
    { id: 'notturna', nome: 'Notturna' }
  ];

  var GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var GIORNI_BREVI = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
  var MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

  function iso(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var g = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + g;
  }

  function fromIso(s) {
    var p = s.split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }

  function addDays(d, n) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() + n);
    return x;
  }

  // Lunedì della settimana che contiene la data
  function monday(d) {
    var day = d.getDay() || 7;
    return addDays(d, 1 - day);
  }

  // Ore di inizio delle guide: le notturne solo la sera, il sabato solo la mattina
  function ore(date, tipo) {
    var sat = date.getDay() === 6;
    if (tipo === 'notturna') return sat ? [] : [18, 19];
    var list = [];
    for (var h = 8; h <= (sat ? 12 : 17); h++) if (h !== 13) list.push(h);
    return list;
  }

  // Hash semplice e ripetibile: decide se un orario è già occupato
  function occupato(sedeId, date, h) {
    var s = sedeId + '|' + iso(date) + '|' + h;
    var x = 2166136261;
    for (var i = 0; i < s.length; i++) {
      x ^= s.charCodeAt(i);
      x = Math.imul(x, 16777619);
    }
    return ((x >>> 0) % 100) < 47;
  }

  function passato(date, h) {
    var t = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h);
    return t.getTime() <= Date.now();
  }

  function auto(sedeId, date, h) {
    var sede = SEDI.filter(function (s) { return s.id === sedeId; })[0];
    return sede.auto[(date.getDate() + h) % sede.auto.length];
  }

  function dataLunga(d) {
    return GIORNI[d.getDay()] + ' ' + d.getDate() + ' ' + MESI[d.getMonth()];
  }

  // Prossimi orari liberi, uno per sede (per la home)
  function prossimiLiberi(n) {
    var out = [];
    var d = new Date();
    SEDI.forEach(function (sede) {
      for (var i = 0; i < 14; i++) {
        var day = addDays(d, i);
        if (day.getDay() === 0) continue;
        var hours = ore(day, 'citta');
        for (var j = 0; j < hours.length; j++) {
          if (!passato(day, hours[j]) && !occupato(sede.id, day, hours[j])) {
            out.push({ date: day, ora: hours[j], sede: sede });
            return;
          }
        }
      }
    });
    out.sort(function (a, b) {
      return a.date - b.date || a.ora - b.ora;
    });
    return out.slice(0, n);
  }

  window.Crocevia = {
    SEDI: SEDI,
    TIPI: TIPI,
    GIORNI: GIORNI,
    GIORNI_BREVI: GIORNI_BREVI,
    MESI: MESI,
    iso: iso,
    fromIso: fromIso,
    addDays: addDays,
    monday: monday,
    ore: ore,
    occupato: occupato,
    passato: passato,
    auto: auto,
    dataLunga: dataLunga,
    prossimiLiberi: prossimiLiberi
  };
})();
