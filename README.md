# Next Siteo · sito vetrina

Il sito di Next Siteo: siti web e strumenti digitali su misura per attività locali, con tre siti dimostrativi per autoscuole.

È fatto solo di HTML, CSS e JavaScript: niente programmi da installare, niente "build". I file si caricano così come sono su **GitHub Pages**, che li pubblica gratis.

---

## Cosa c'è nella cartella

```
index.html            la home (servizi, lavori, metodo, FAQ, contatti)
privacy.html          informativa privacy (con le parti [DA COMPLETARE])
404.html              pagina per gli indirizzi sbagliati
css/style.css         colori, caratteri e impaginazione
js/main.js            menu, animazioni, anteprime e modulo contatti
assets/               favicon, immagine di anteprima per WhatsApp, illustrazioni, font
demo/
  comune/            barra "Sito dimostrativo..." e avviso "Questa è una demo", per tutte le demo
  autoscuola-pistacchio/   demo moderna: pre-iscrizione a step, «Quale patente fa per te?», WhatsApp
  autoscuola-ardesia/      demo classica: patenti, orari, documenti, mappa disegnata
  autoscuole-crocevia/     demo con gestionale: area allievi, calendario guide, lavora con noi
sitemap.xml           elenco delle pagine per Google
robots.txt            istruzioni per i motori di ricerca
.claude/              la "skill" di design usata per progettare il sito (non serve al sito)
```

Tutti i collegamenti sono **relativi**: il sito funziona sia su `nomeutente.github.io` sia su `nomeutente.github.io/nome-repo/`.

**Provarlo sul computer:** aprite un terminale nella cartella e scrivete `python3 -m http.server`, poi andate su http://localhost:8000 . (Aprire `index.html` con un doppio clic funziona quasi del tutto, ma le anteprime delle demo vanno meglio con il comando.)

---

## 1. Creare l'account GitHub

1. Andate su https://github.com e cliccate **Sign up**.
2. Inserite email, una password e un **nome utente**. Il nome utente finirà nell'indirizzo del sito (vedi il punto 2), quindi sceglietelo con calma: per esempio `nextsiteo`.
3. Confermate l'email con il codice che vi arriva.
4. Il piano gratuito (**Free**) basta e avanza.

> Avete già un account personale? Potete creare gratis un'**organizzazione** chiamata `nextsiteo` (in alto a destra: la vostra foto, poi **Your organizations**, poi **New organization**, piano **Free**). Il sito si pubblica a nome dell'organizzazione e non del vostro profilo.

---

## 2. Creare il repository

Un "repository" (o "repo") è la cartella online che contiene i file del sito.

1. In alto a destra cliccate **+**, poi **New repository**.
2. Scegliete il nome. Qui c'è una differenza importante:

| Nome del repository | Indirizzo del sito |
|---|---|
| `nomeutente.github.io` (esattamente così, con il vostro nome utente) | `https://nomeutente.github.io/` |
| qualsiasi altro nome, per esempio `sito` | `https://nomeutente.github.io/sito/` |

   **Il nostro consiglio:** usate un account o un'organizzazione `nextsiteo` e chiamate il repository **`nextsiteo.github.io`**. L'indirizzo sarà corto e pulito (`https://nextsiteo.github.io/`) e il file `robots.txt` funzionerà (i motori di ricerca lo leggono solo nella radice del dominio). Se pensate di collegare subito un dominio vostro (punto 8), il nome del repository conta poco.

3. Lasciate il repository **Public** (con il piano gratuito, GitHub Pages funziona solo con i repository pubblici).
4. Non spuntate nulla sotto ("Add a README" e simili): il README c'è già nei file.
5. Cliccate **Create repository**.

---

## 3. Caricare i file

### Dal browser, senza programmi (consigliato per iniziare)

1. Nella pagina del repository appena creato cliccate il link **uploading an existing file** (oppure **Add file**, poi **Upload files**).
2. Aprite sul computer la cartella del sito. **Selezionate il contenuto della cartella** (cioè `index.html`, `css`, `js`, `assets`, `demo` e tutti gli altri file), non la cartella intera, e trascinatelo nella pagina.
   `index.html` deve stare "in cima" al repository, non dentro un'altra cartella.
3. Aspettate che il caricamento finisca, scrivete in basso un messaggio come `Primo caricamento del sito` e cliccate **Commit changes**.

> Su Windows e Mac le cartelle che iniziano con un punto (come `.claude`) di solito sono nascoste e il browser non le carica. Va benissimo: al sito non servono.

### In alternativa, con git (per chi usa il terminale)

```bash
cd percorso/della/cartella/del/sito
git init
git add .
git commit -m "Primo caricamento del sito"
git branch -M main
git remote add origin https://github.com/NOMEUTENTE/NOMEREPO.git
git push -u origin main
```

Al primo `git push` GitHub chiede di accedere: seguite le istruzioni a schermo (di solito si apre il browser).

---

## 4. Attivare GitHub Pages

1. Nel repository cliccate **Settings** (l'icona a ingranaggio, in alto).
2. Nel menu a sinistra cliccate **Pages**.
3. Sotto **Build and deployment**, alla voce **Source** scegliete **Deploy from a branch**.
4. Alla voce **Branch** scegliete **main** e, accanto, la cartella **/ (root)**. Cliccate **Save**.

---

## 5. Trovare l'indirizzo del sito

Dopo il salvataggio, GitHub impiega **qualche minuto** (di solito da 1 a 5) per pubblicare il sito.

- Tornate su **Settings**, poi **Pages**: in alto comparirà "Your site is live at `https://...`". Quello è l'indirizzo del sito.
- Potete seguire l'avanzamento nella scheda **Actions** del repository: quando la riga "pages build and deployment" ha la spunta verde, il sito è online.
- Ogni volta che modificate un file, la nuova versione arriva online dopo qualche minuto. Se vedete ancora la vecchia, ricaricate la pagina (sul telefono, a volte serve chiudere e riaprire la scheda).

---

## 6. Collegare il modulo contatti (Formspree)

GitHub Pages pubblica solo pagine "statiche": per ricevere i messaggi del modulo serve un servizio esterno. Usiamo **Formspree**, che inoltra ogni messaggio alla vostra email.

1. Andate su https://formspree.io e create un account gratuito con l'email `nextsiteo.office@gmail.com`.
2. Cliccate **+ New Form**, date un nome (per esempio `Sito Next Siteo`) e indicate l'email a cui ricevere i messaggi.
3. Formspree vi mostra l'indirizzo del modulo, simile a `https://formspree.io/f/abcdwxyz`. Copiatelo.
4. Su GitHub aprite il file `index.html`, cliccate la **matita** (Edit) in alto a destra, premete Ctrl+F (Cmd+F su Mac) e cercate `XXXXXXX`.
5. Sostituite `https://formspree.io/f/XXXXXXX` con il vostro indirizzo. Cliccate **Commit changes**.
6. Dopo qualche minuto, inviate un messaggio di prova dal sito. La prima volta Formspree vi chiede di confermare l'email: confermate e controllate che il messaggio arrivi.

Finché l'indirizzo resta `XXXXXXX`, il pulsante **Invia la richiesta** apre un'email già compilata: nessun messaggio va perso, ma è meno comodo per chi scrive.

> Il piano gratuito di Formspree ha un limite di invii al mese: controllate quello attuale sul loro sito. Ricordatevi di indicare Formspree nella privacy (c'è già, va solo completata).

---

## 7. Sostituire gli indirizzi segnaposto

Per l'anteprima del link su WhatsApp, per Google e per la sitemap servono gli indirizzi **completi** del sito. Nei file c'è un segnaposto da sostituire ovunque:

```
https://NOMEUTENTE.github.io/NOMEREPO/
```

Va sostituito con l'indirizzo vero del sito, **con la barra finale**, per esempio `https://nextsiteo.github.io/` oppure `https://www.nextsiteo.it/`.

Il segnaposto si trova in questi file:

| File | Dove |
|---|---|
| `index.html` | `canonical`, `og:url`, `og:image` e nei dati strutturati (`url`, `logo`, `image`) |
| `privacy.html` | `canonical`, `og:url`, `og:image` |
| `404.html` | il pulsante "Torna alla home" |
| `sitemap.xml` | i due indirizzi delle pagine |
| `robots.txt` | la riga `Sitemap:` |

Per ogni file: aprite il file su GitHub, cliccate la **matita**, cercate `NOMEUTENTE` con Ctrl+F, sostituite tutte le volte che compare, poi **Commit changes**.

**Controllare l'anteprima su WhatsApp:** mandate il link del sito a voi stessi. Deve comparire l'immagine con "Siti e strumenti su misura per attività locali". WhatsApp memorizza le anteprime: se avete mandato il link prima di sostituire gli indirizzi, potrebbe servire qualche giorno (o aggiungere `?v=2` in fondo al link) per vedere quella nuova.

---

## 8. (Facoltativo) Collegare un dominio, per esempio nextsiteo.it

1. **Comprate il dominio** presso un registrar (Aruba, Register.it, OVH, Namecheap e simili). Costa qualche euro all'anno.
2. Su GitHub: **Settings**, poi **Pages**, alla voce **Custom domain** scrivete `www.nextsiteo.it` e cliccate **Save**. GitHub aggiunge da solo al repository un file chiamato `CNAME` che contiene il dominio: non cancellatelo.
3. **Nel pannello DNS del registrar** create questi record:

   | Tipo | Nome | Valore |
   |---|---|---|
   | CNAME | `www` | `nomeutente.github.io` (il vostro nome utente o organizzazione, senza il nome del repository) |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |

   I record A fanno funzionare anche l'indirizzo senza `www` (`nextsiteo.it`). Se il registrar li supporta, potete aggiungere anche i record AAAA `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153` e `2606:50c0:8003::153`. Gli indirizzi aggiornati sono nella guida ufficiale: https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site
4. La propagazione dei DNS può richiedere da qualche minuto a 24 ore. Quando GitHub mostra il controllo verde, spuntate **Enforce HTTPS**.
5. Rifate il **punto 7** usando il nuovo indirizzo (`https://www.nextsiteo.it/`).

---

## 9. Fare modifiche in futuro

**Cambiare un testo:** aprite il file su GitHub (quasi tutti i testi sono in `index.html`), cliccate la **matita**, modificate, poi **Commit changes**. Dopo qualche minuto la modifica è online.

**Sostituire un file intero** (per esempio un'immagine): **Add file**, poi **Upload files**, trascinate il file con lo stesso nome e nella stessa cartella. GitHub sovrascrive quello vecchio.

**Colori e caratteri:** sono all'inizio di `css/style.css`, nella sezione `:root`. Per esempio `--accent` è il blu dei pulsanti.

**Dati fiscali (P.IVA):** in fondo a `index.html`, nel footer, c'è un commento `DATI FISCALI [DA COMPLETARE]` con il testo da inserire.

**Aggiungere una nuova demo** (per esempio un barbiere):
1. Create la cartella `demo/nome-della-demo/` con la sua `index.html`, i suoi `css/` e `js/`.
2. Nell'`<head>` della pagina mettete `<meta name="robots" content="noindex, nofollow">` e i collegamenti alla barra comune:
   ```html
   <link rel="stylesheet" href="../comune/barra-demo.css">
   <script src="../comune/barra-demo.js" defer></script>
   ```
   La barra "Sito dimostrativo realizzato da Next Siteo" compare da sola. Per moduli e pulsanti finti basta aggiungere l'attributo `data-demo-avviso` (vedi le demo esistenti).
3. In `index.html`, nella sezione **Lavori**, copiate un blocco `<article class="work">` e cambiate titolo, testi e i due percorsi `demo/...`.

**Regole da rispettare anche nelle prossime demo:** attività di fantasia, telefoni tipo `000 000 0000`, nessuna recensione, testimonianza o numero inventato, e l'etichetta "Progetto dimostrativo" ben visibile.

---

## Checklist prima di inviare le email

- [ ] Il sito è online e si apre dall'indirizzo giusto, anche dal telefono.
- [ ] Gli indirizzi segnaposto `NOMEUTENTE.github.io/NOMEREPO` sono stati sostituiti in tutti i file del punto 7 (cercate `NOMEUTENTE`: non deve comparire più).
- [ ] L'endpoint Formspree è inserito (cercate `XXXXXXX`: non deve comparire più) e un messaggio di prova vi è arrivato.
- [ ] La privacy è completa: nessun `[DA COMPLETARE]` rimasto in `privacy.html`, data di aggiornamento inserita.
- [ ] I dati fiscali (P.IVA e ragione sociale) sono nel footer, se dovete mostrarli.
- [ ] I tre pulsanti di contatto funzionano dal telefono: WhatsApp apre la chat con il messaggio già scritto, il telefono chiama il numero giusto, l'email si apre con l'oggetto.
- [ ] Le tre demo si aprono dalla sezione **Lavori** e da ognuna "Torna a Next Siteo" riporta indietro.
- [ ] Mandando il link su WhatsApp compaiono titolo, descrizione e immagine di anteprima.
- [ ] Avete letto la home dall'inizio alla fine sul telefono, cercando errori di battitura.

---

## Note tecniche

- **Font:** Manrope (sito), Bricolage Grotesque e Figtree (demo Pistacchio), Playfair Display (demo Ardesia). Sono font di Google Fonts con licenza SIL Open Font License, scaricati e serviti dal sito stesso: il browser non contatta Google. Le licenze sono accanto ai file dei font.
- **Nessun cookie** e nessuno strumento di statistica: per questo non c'è il banner dei cookie. Se in futuro aggiungete Google Analytics o simili, servono banner e aggiornamento della privacy.
- **Animazioni:** discrete, e disattivate per chi ha attivato "riduci movimento" nelle impostazioni del telefono o del computer.
- **Accessibilità:** contrasti verificati, navigazione da tastiera, etichette nei moduli, testo alternativo per le immagini.
