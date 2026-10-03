/* Lisa Scheier · Interaktionen */
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');

  /* ---------- Header: Hintergrund beim Scrollen, ausblenden beim Runterscrollen ---------- */
  var header = document.querySelector('.header');
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle('is-scrolled', y > 24);
      var menuOpen = document.body.classList.contains('menu-open');
      if (menuOpen || y < 120) header.classList.remove('is-hidden');      // ganz oben / Menü offen: immer sichtbar
      else if (y > lastY + 2) header.classList.add('is-hidden');           // runterscrollen: ausblenden
      else if (y < lastY - 2) header.classList.remove('is-hidden');        // hochscrollen: einblenden
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ---------- Ladeanimation ausblenden ---------- */
  var pl = document.getElementById('preloader');
  if (pl) {
    var hidePl = function () { pl.classList.add('is-hidden'); setTimeout(function () { pl.remove(); }, 1000); };
    if (document.documentElement.classList.contains('no-intro')) pl.remove();
    else { window.addEventListener('load', function () { setTimeout(hidePl, 1100); }); setTimeout(hidePl, 4000); }
  }

  /* ---------- Mobiles Menü ---------- */
  var burger = document.querySelector('.burger');
  var mobile = document.getElementById('mobile-menu');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (mobile) mobile.setAttribute('aria-hidden', open ? 'false' : 'true');
  }
  if (burger) burger.addEventListener('click', function () {
    setMenu(!document.body.classList.contains('menu-open'));
  });
  if (mobile) mobile.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    // Sprungziel auf derselben Seite: erst Menü schließen (Seite entsperren), dann hinscrollen
    var url = new URL(a.getAttribute('href'), location.href);
    var target = url.hash && url.pathname === location.pathname ? document.getElementById(url.hash.slice(1)) : null;
    setMenu(false);
    if (target) {
      e.preventDefault();
      history.pushState(null, '', url.hash);
      requestAnimationFrame(function () { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      setMenu(false);
      document.querySelectorAll('.has-drop.is-open').forEach(function (d) { d.classList.remove('is-open'); });
    }
  });

  /* ---------- Dropdown per Klick/Tastatur ---------- */
  document.querySelectorAll('.has-drop > button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var li = btn.parentElement;
      var open = !li.classList.contains('is-open');
      li.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.has-drop.is-open').forEach(function (li) {
      if (!li.contains(e.target)) {
        li.classList.remove('is-open');
        li.querySelector('button').setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- Reveal beim Scrollen ---------- */
  var targets = document.querySelectorAll('.reveal, .reveal-img, .steps');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('is-in'); });
  }

  /* ---------- Aktiven Menüpunkt markieren (Startseite) ---------- */
  var navLinks = document.querySelectorAll('.nav__list a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    navLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = map[en.target.id];
        if (a && en.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('is-active'); });
          a.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });
  }

  /* ---------- FAQ: sanftes Auf- und Zuklappen, immer nur eine offen ---------- */
  document.querySelectorAll('.faq details').forEach(function (d) {
    var summary = d.querySelector('summary');
    var body = d.querySelector('.faq__answer');
    if (!summary || !body) return;
    summary.addEventListener('click', function (e) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      e.preventDefault();
      if (d.open) {
        body.animate([{ height: body.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' })
          .onfinish = function () { d.open = false; };
      } else {
        document.querySelectorAll('.faq details[open]').forEach(function (o) { if (o !== d) o.open = false; });
        d.open = true;
        var h = body.offsetHeight;
        body.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.2,.7,.2,1)' });
      }
    });
  });

  /* ---------- Paket-Button wählt Paket im Formular vor ---------- */
  document.querySelectorAll('[data-paket]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = document.getElementById('paket');
      if (sel) sel.value = a.getAttribute('data-paket');
      else try { sessionStorage.setItem('ls_paket', a.getAttribute('data-paket')); } catch (e) {}
    });
  });
  /* Auswahl von einer Unterseite (z. B. SICHTbar.) im Formular übernehmen */
  try {
    var pre = sessionStorage.getItem('ls_paket'), preSel = document.getElementById('paket');
    if (pre && preSel) { preSel.value = pre; sessionStorage.removeItem('ls_paket'); }
  } catch (e) {}

  /* ---------- Kontaktformular (Web3Forms) ---------- */
  var form = document.getElementById('kontaktForm');
  if (form) {
    var status = form.querySelector('.form__status');
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (el) {
        var wrap = el.closest('.field, .check');
        var ok = el.type === 'checkbox' ? el.checked : el.value.trim() !== '' && (el.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
        if (wrap) wrap.classList.toggle('is-invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        status.textContent = 'Bitte fülle die markierten Felder aus und bestätige die Datenschutzerklärung.';
        return;
      }
      status.textContent = '';
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.firstChild.textContent = 'Wird gesendet … ';
      var data = new FormData(form);
      data.append('access_key', '467744a3-6a62-4bd1-8ea4-c70820f4a45d');
      data.append('subject', 'Neue Anfrage über lisascheier.de');
      data.append('from_name', 'lisascheier.de');
      try {
        var res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
        var json = await res.json();
        if (json.success) { window.location.href = 'danke.html'; return; }
        throw new Error(json.message || 'Fehler');
      } catch (err) {
        btn.disabled = false;
        btn.firstChild.textContent = 'Anfrage senden ';
        status.textContent = 'Das hat leider nicht geklappt. Schreib mir gern direkt an info@lisascheier.de.';
      }
    });
  }

  /* ---------- Jahr im Footer ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
