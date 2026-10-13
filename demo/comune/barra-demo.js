/* ==================================================================
   BARRA DEMO (comune a tutte le demo di Next Siteo)
   Uso nella pagina della demo:
     <link rel="stylesheet" href="../comune/barra-demo.css">
     <script src="../comune/barra-demo.js" defer></script>
   La barra viene inserita in cima al <body>.
   Per mostrare l'avviso da uno script della demo:
     window.NextSiteoDemo.avviso('Testo facoltativo');
   Ogni elemento con [data-demo-avviso] mostra l'avviso al click
   (o all'invio, se è un <form>), senza inviare nulla.
   ================================================================== */
(function () {
  'use strict';

  var HOME = '../../index.html#lavori';

  // Barra fissa in alto
  var bar = document.createElement('div');
  bar.className = 'demo-bar';
  bar.setAttribute('role', 'note');
  bar.innerHTML =
    '<p>Sito dimostrativo realizzato da Next Siteo, attività di fantasia · ' +
    '<a href="' + HOME + '" target="_top">Torna a Next Siteo</a></p>';
  document.body.insertBefore(bar, document.body.firstChild);

  // Avviso
  var toast = null;
  var timer = 0;
  function avviso(testo) {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'demo-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.dataset.state = 'hidden';
      document.body.appendChild(toast);
    }
    toast.innerHTML = '';
    var t = document.createElement('strong');
    t.textContent = 'Questa è una demo';
    var p = document.createElement('span');
    p.textContent = testo || 'Nessun dato è stato inviato: in un sito vero qui arriverebbe la richiesta.';
    toast.appendChild(t);
    toast.appendChild(p);
    requestAnimationFrame(function () {
      toast.dataset.state = 'visible';
    });
    clearTimeout(timer);
    timer = setTimeout(function () {
      toast.dataset.state = 'hidden';
    }, 5000);
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('a[data-demo-avviso], button[data-demo-avviso]');
    if (!el) return;
    e.preventDefault();
    avviso(el.getAttribute('data-demo-avviso') || '');
  });

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.hasAttribute('data-demo-avviso')) return;
    e.preventDefault();
    avviso(form.getAttribute('data-demo-avviso') || '');
  });

  window.NextSiteoDemo = { avviso: avviso };
})();
