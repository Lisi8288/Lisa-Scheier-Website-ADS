/**
 * ═══════════════════════════════════════════════════════════════
 *  DSGVO Cookie Banner – Consent Mode v2
 *  Erstellt von Lisa Scheier | lisascheier.de
 *
 *  ✅ DSGVO / TTDSG konform
 *  ✅ Google Consent Mode v2 (4 Parameter)
 *  ✅ 12 Monate Speicherung in localStorage
 *  ✅ Widerruf jederzeit über Footer-Link möglich
 *  ✅ Keine externen Abhängigkeiten
 *  ✅ Kostenlos für alle deine Kundenprojekte
 *
 *  ─── ANLEITUNG ──────────────────────────────────────────────
 *
 *  SCHRITT 1 — Script VOR dem schließenden </head>-Tag einfügen:
 *
 *    <script src="cookie-banner.js"></script>
 *
 *  SCHRITT 2 — Farben & Texte unten in der CONFIG anpassen
 *
 *  SCHRITT 3 — Im Footer einen Widerruf-Link hinzufügen:
 *
 *    <a href="#" id="cookie-settings">Cookie-Einstellungen</a>
 *
 *  SCHRITT 4 — Google Tag Manager Code NACH diesem Script einfügen
 *    (GTM lädt erst wenn Consent erteilt wurde – Consent Mode v2)
 *
 * ═══════════════════════════════════════════════════════════════
 */

(function () {

  /* ─── CONFIG — hier anpassen ──────────────────────────────── */
  var CONFIG = {

    /* Eindeutiger Schlüssel pro Website (verhindert Konflikte) */
    storageKey: 'ls_cookie_consent',     // z.B. 'muster_gmbh_consent'

    /* Farben — HEX oder CSS-Werte */
    colors: {
      background:   '#182E25',          // Hintergrund Banner
      backgroundEnd:'#2E5443',          // Hintergrund Banner (Verlauf-Ende)
      border:       'rgba(201,168,76,.4)', // Rahmen
      text:         '#9BBCAD',          // Fließtext
      textStrong:   '#F0E0A0',          // Fetter Text / Überschrift
      link:         '#C9A84C',          // Links (Datenschutz, Impressum)
      btnAcceptBg:  '#3D2D00',          // Akzeptieren-Button Hintergrund
      btnAcceptBgEnd:'#5A4200',         // Akzeptieren-Button Hintergrund Ende
      btnAcceptBorder:'#C9A84C',        // Akzeptieren-Button Rahmen
      btnAcceptText: '#E2C97E',         // Akzeptieren-Button Text
      btnDeclineText:'#9BBCAD',         // Ablehnen-Button Text
      btnDeclineBorder:'rgba(155,188,173,.3)', // Ablehnen-Button Rahmen
    },

    /* Texte */
    text: {
      headline:    'Diese Website verwendet Cookies.',
      body:        'Ich nutze Google Ads, Analytics und Tag Manager, um mein Angebot zu verbessern und Kampagnen zu messen. Du kannst selbst entscheiden, ob du das zulässt.',
      linkPrivacy:  'Datenschutzerklärung',
      linkImprint:  'Impressum',
      btnAccept:    'Alle akzeptieren',
      btnDecline:   'Ablehnen',
    },

    /* Links */
    links: {
      privacy: 'datenschutz.html',      // Pfad zur Datenschutzseite
      imprint: 'impressum.html',        // Pfad zum Impressum
    },

    /* ID des Footer-Links für Widerruf */
    settingsLinkId: 'cookie-settings',

    /* Gültigkeitsdauer in Millisekunden (Standard: 12 Monate) */
    maxAgeMs: 365 * 24 * 60 * 60 * 1000,
  };
  /* ─── Ende CONFIG ─────────────────────────────────────────── */


  /* ══════════════════════════════════════════════════════════
     AB HIER NICHTS MEHR ÄNDERN — AUSSER DU WEISST WAS DU TUST
     ══════════════════════════════════════════════════════════ */

  var STORAGE_KEY      = CONFIG.storageKey;
  var STORAGE_DATE_KEY = CONFIG.storageKey + '_date';
  var C                = CONFIG.colors;
  var T                = CONFIG.text;
  var L                = CONFIG.links;

  /* ─── Consent Mode v2 Setup ───────────────────────────────── */
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }

  // Alle Google-Dienste standardmäßig VERWEIGERN
  gtag('consent', 'default', {
    analytics_storage:  'denied',
    ad_storage:         'denied',
    ad_user_data:       'denied',
    ad_personalization: 'denied',
    wait_for_update:    500,
  });

  // Gespeicherte Einwilligung prüfen (läuft vor GTM)
  var _consentAlreadySet = false;
  try {
    var _saved     = localStorage.getItem(STORAGE_KEY);
    var _savedDate = localStorage.getItem(STORAGE_DATE_KEY);
    if (_saved && _savedDate && (Date.now() - parseInt(_savedDate)) < CONFIG.maxAgeMs) {
      if (_saved === 'accepted') {
        gtag('consent', 'update', {
          analytics_storage:  'granted',
          ad_storage:         'granted',
          ad_user_data:       'granted',
          ad_personalization: 'granted',
        });
      }
      _consentAlreadySet = true;
    }
  } catch (e) {}

  /* ─── CSS in den <head> injizieren ───────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '#cc-banner{',
      'display:none;position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);z-index:99999;',
      'width:min(720px,calc(100% - 2rem));',
      'background:linear-gradient(135deg,' + C.background + ' 0%,' + C.backgroundEnd + ' 100%);',
      'border:1.5px solid ' + C.border + ';border-radius:16px;padding:1.75rem 2rem;',
      'box-shadow:0 8px 40px rgba(0,0,0,.35);',
      'display:none;gap:1.5rem;align-items:center;flex-wrap:wrap;',
      'font-family:system-ui,sans-serif;',
    '}',
    '#cc-banner.cc-visible{display:flex}',
    '.cc-text{flex:1;min-width:240px}',
    '.cc-text p{font-size:.88rem;color:' + C.text + ';line-height:1.6;margin:0}',
    '.cc-text strong{color:' + C.textStrong + '}',
    '.cc-text a{color:' + C.link + ';text-decoration:underline;font-size:.82rem}',
    '.cc-btns{display:flex;gap:.75rem;flex-shrink:0;flex-wrap:wrap}',
    '#cc-accept{',
      'padding:.65rem 1.5rem;',
      'background:linear-gradient(160deg,' + C.btnAcceptBg + ' 0%,' + C.btnAcceptBgEnd + ' 100%);',
      'color:' + C.btnAcceptText + ';',
      'border:1.5px solid ' + C.btnAcceptBorder + ';border-radius:100px;',
      'font-size:.85rem;font-weight:500;cursor:pointer;',
      'transition:all .3s ease;white-space:nowrap;',
    '}',
    '#cc-accept:hover{opacity:.85}',
    '#cc-decline{',
      'padding:.65rem 1.5rem;background:transparent;',
      'color:' + C.btnDeclineText + ';',
      'border:1.5px solid ' + C.btnDeclineBorder + ';border-radius:100px;',
      'font-size:.85rem;font-weight:400;cursor:pointer;',
      'transition:all .3s ease;white-space:nowrap;',
    '}',
    '#cc-decline:hover{border-color:' + C.btnDeclineText + ';opacity:.85}',
    '@media(max-width:600px){',
      '#cc-banner{bottom:0;left:0;right:0;transform:none;width:100%;border-radius:16px 16px 0 0}',
      '.cc-btns{width:100%}',
      '#cc-accept,#cc-decline{flex:1;text-align:center}',
    '}',
  ].join('');
  document.head.appendChild(style);

  /* ─── Banner-HTML erzeugen ───────────────────────────────── */
  var banner = document.createElement('div');
  banner.id = 'cc-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie-Einstellungen');
  banner.innerHTML = [
    '<div class="cc-text">',
      '<p><strong>' + T.headline + '</strong> ' + T.body + '</p>',
      '<p style="margin-top:.5rem">',
        '<a href="' + L.privacy + '">' + T.linkPrivacy + '</a>',
        ' &nbsp;·&nbsp; ',
        '<a href="' + L.imprint + '">' + T.linkImprint + '</a>',
      '</p>',
    '</div>',
    '<div class="cc-btns">',
      '<button id="cc-decline">' + T.btnDecline + '</button>',
      '<button id="cc-accept">' + T.btnAccept + '</button>',
    '</div>',
  ].join('');

  /* ─── Banner ins DOM einfügen (sobald Body bereit) ───────── */
  function mount() {
    document.body.appendChild(banner);
    if (!_consentAlreadySet) {
      banner.classList.add('cc-visible');
    }
    attachListeners();
  }

  /* ─── Einwilligung speichern & Consent Mode updaten ───────── */
  function setConsent(decision) {
    try {
      localStorage.setItem(STORAGE_KEY, decision);
      localStorage.setItem(STORAGE_DATE_KEY, Date.now().toString());
    } catch (e) {}
    if (decision === 'accepted') {
      gtag('consent', 'update', {
        analytics_storage:  'granted',
        ad_storage:         'granted',
        ad_user_data:       'granted',
        ad_personalization: 'granted',
      });
    }
    banner.classList.remove('cc-visible');
  }

  /* ─── Event Listener ───────────────────────────────────────── */
  function attachListeners() {
    document.getElementById('cc-accept').addEventListener('click', function () {
      setConsent('accepted');
    });
    document.getElementById('cc-decline').addEventListener('click', function () {
      setConsent('declined');
    });

    // Footer-Link für Widerruf
    var settingsLink = document.getElementById(CONFIG.settingsLinkId);
    if (settingsLink) {
      settingsLink.addEventListener('click', function (e) {
        e.preventDefault();
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_DATE_KEY);
        } catch (e) {}
        banner.classList.add('cc-visible');
      });
    }
  }

  /* ─── Starten wenn DOM bereit ─────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

})();
