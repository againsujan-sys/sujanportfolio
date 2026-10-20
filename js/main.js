/* ==========================================================================
   STRATA MAIN — ENHANCEMENT LAYER + STATIC FALLBACKS
   Essential content (biography, qualifications, skills, experience,
   projects, research, education, fieldwork gallery, places and contact)
   is pre-rendered as static HTML in index.html — every image shown there
   points at a file that exists in the image/ folder. When JS runs normally
   this script layers interactivity on top of that markup:
     · mobile navigation (aria-expanded, Escape, close on select)
     · scroll-reveal + active-nav highlighting (with safety sweep)
     · accordion behaviour for the statically rendered project/research cards
     · wraps Fieldwork gallery images in lightbox trigger buttons
     · map legend buttons built from STRATA_DATA.mapSites
     · Leaflet map with location pins; each pin popup shows the fieldwork /
       project photographs recorded at that place (retry if CDN is slow)
     · copy buttons for email/phone
   ========================================================================== */
'use strict';

/* If data.js failed to load, keep going anyway — every other enhancement
   must still work instead of throwing at parse time. */
const D = window.STRATA_DATA || { gallery: [], mapSites: [] };

/* ---------- tiny DOM helpers ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* Safe element factory: plain text via textContent, structure via child
   elements. Never interpolates untrusted strings into innerHTML. Accepts a
   string OR an already-built Element as the third argument. */
function make(tag, cls, content) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (content instanceof Node) n.appendChild(content);
  else if (content !== undefined && content !== null) n.textContent = content;
  return n;
}
function makeLink(href, text, opts = {}) {
  const a = make('a', opts.cls, text);
  a.href = href;
  if (opts.download) a.setAttribute('download', '');
  if (opts.external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  return a;
}
function makeImg(src, alt, w, h, lazy = true) {
  const img = make('img');
  /* Dynamically created tiles also get the lightweight thumbnail variant;
     thumbSrc/applyThumbSrcset are defined below and hoisted as function
     declarations, so they are safe to use here. */
  img.src = src;
  img.alt = alt || '';
  if (w) img.width = w;
  if (h) img.height = h;
  if (lazy) { img.loading = 'lazy'; } else { img.loading = 'eager'; }
  img.decoding = 'async';
  return img;
}
/* ---------- photo intrinsic sizes ----------
   True pixel dimensions of every file in image/ — used to reserve layout
   boxes for dynamically created <img> nodes (map popups) so nothing jumps
   around while photos stream in on slow connections.
   Generated from the actual JPEG headers; keep in sync when adding photos. */
const IMG_DIMS = {
  'image/at-cultural-event-kathmandu.jpg': [853, 1280],
  'image/at-library.jpg': [1280, 960],
  'image/at-museum.jpg': [960, 1280],
  'image/at-pashupatinath.jpg': [960, 1280],
  'image/at-tarkeshor-view-point.jpg': [963, 1280],
  'image/at-tri-chandra-campus.jpg': [1045, 1280],
  'image/at-trichandra-2.jpg': [960, 1280],
  'image/at-trichandra.jpg': [960, 1280],
  'image/behind-dakshinkali-1.jpg': [1280, 960],
  'image/behind-dakshinkali-2.jpg': [1280, 960],
  'image/behind-foreign-ministry.jpg': [960, 1280],
  'image/behind-gumba.jpg': [960, 1280],
  'image/behind-home-ministry.jpg': [1280, 960],
  'image/behind-sacred-pathibhara-temple-taplejung.jpg': [768, 1024],
  'image/birthday-celebration-at-college.jpg': [720, 960],
  'image/boudha-kathmandu.jpg': [1280, 854],
  'image/central-department-of-geology.jpg': [768, 1024],
  'image/childhood-1.jpg': [1280, 960],
  'image/childhood-2.jpg': [1280, 960],
  'image/childhood-3.jpg': [1280, 960],
  'image/childhood-4.jpg': [1280, 960],
  'image/childhood-5.jpg': [960, 1280],
  'image/discussion-about-research-tu.jpg': [1024, 768],
  'image/during-crystal-hunt.jpg': [960, 1280],
  'image/during-new-location-hunt-taplejung-manabhara.jpg': [1280, 960],
  'image/geological-event-at-tu.jpg': [1024, 768],
  'image/geological-field-visit.jpg': [960, 1280],
  'image/geology-exhibition-1.jpg': [768, 1024],
  'image/geology-exhibition-2.jpg': [1024, 768],
  'image/geology-exhibition-3.jpg': [768, 1024],
  'image/hero-me.jpg': [600, 750],
  'image/me01.jpg': [1200, 630],
  'image/mewa-site-1.jpg': [960, 1280],
  'image/mewa-site-2.jpg': [1280, 960],
  'image/mewa-site-3.jpg': [1280, 960],
  'image/mewa-site-4.jpg': [1280, 960],
  'image/mewa-site-5.jpg': [960, 1280],
  'image/mewa-site-6.jpg': [1280, 960],
  'image/mewa-site-7.jpg': [1280, 960],
  'image/professor.jpg': [1280, 960],
  'image/taplejung-helipad.jpg': [960, 1280],
  'image/with-actor-at-college.jpg': [1280, 960],
  'image/with-friends-at-campus.jpg': [836, 627],
  'image/with-friends-behind-temple.jpg': [1024, 768],
  'image/with-friends-kamalpokhari.jpg': [1280, 962],
  'image/with-mentor.jpg': [768, 1024],
  'image/with-professor.jpg': [1280, 960],
  'image/with-project-manager.jpg': [768, 1024],
  'image/with-student-president-at-campus.jpg': [1280, 958]
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================================
   1. MOBILE NAVIGATION — open/close, aria-expanded, Escape, close on select
   ========================================================================== */
function initNav() {
  const header = $('.site-header');
  const links = $$('.primary-nav a');
  const sections = $$('main section[id]');

  /* ---------- Compact current-section label (scroll-driven chip) ---------- */
  const chip      = $('#section-chip');
  const chipText  = $('#section-chip-text');
  const spyStatus = $('#scrollspy-status');
  let currentId = '';

  const sectionLabel = sec => {
    if (!sec || sec.id === 'home') return 'Geological Portfolio';
    const heading = $('.section-title', sec);
    return heading ? heading.textContent.trim() : sec.id.replace(/[-_]/g, ' ');
  };

  const setActive = id => {
    if (id === currentId) return;
    currentId = id;
    const sec = sections.find(s => s.id === id);
    const label = sectionLabel(sec);
    links.forEach(l => {
      /* The "Fieldwork Gallery" link targets the #gallery marker inside the
         field-sites section — light it up whenever that section is current. */
      const href = l.getAttribute('href');
      const active = href === `#${id}` || (id === 'field-sites' && href === '#gallery');
      l.classList.toggle('active', active);
      active ? l.setAttribute('aria-current', 'location') : l.removeAttribute('aria-current');
    });
    if (chipText && chipText.textContent !== label) chipText.textContent = label;
    if (chip) chip.setAttribute('aria-label', `Current section: ${label}. Open navigation menu.`);
    /* The visible chip is a button whose aria-label updates — announcing the
       live region too would double-speak, so only use it as a fallback when
       no chip exists in the DOM. */
    if (spyStatus && !chip) spyStatus.textContent = label;
    if (header) header.classList.toggle('has-section-title', id !== 'home');
  };

  /* Scrollspy via IntersectionObserver: a horizontal band across the middle
     of the viewport decides which section is "current". rootMargin shrinks
     the viewport to that band so callbacks fire as sections cross it. */
  if ('IntersectionObserver' in window && sections.length) {
    const visible = new Set();
    /* The observer's root is the header itself: its bottom edge defines a
       narrow "decision line" across the viewport. A section counts as
       current while it spans that line — one section at a time, no ratio
       tie-breaking needed. */
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
      });
      if (visible.size) {
        /* Prefer the topmost intersecting section in document order. */
        for (const s of sections) { if (visible.has(s)) { setActive(s.id); break; } }
      } else if (window.scrollY < 80) {
        setActive('home'); // top of page (hero fully above the line on tall screens)
      }
    }, { root: header, rootMargin: '0px 0px -98% 0px', threshold: 0 });
    sections.forEach(s => spy.observe(s));
    /* Safety net for fast jumps (hash links, End key): re-derive the current
       section from geometry after any manual anchor navigation. */
    window.addEventListener('hashchange', () => {
      const id = location.hash.slice(1);
      if (sections.some(s => s.id === id)) setActive(id);
    });
    /* Fallback sweep when IO is unavailable. */
  } else {
    window.addEventListener('scroll', () => {
      let cur = 'home';
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) cur = s.id; });
      setActive(cur);
    }, { passive: true });
  }
  setActive('home');

  /* ---------- Header state + reading-progress rail (rAF-throttled) ---------- */
  let ticking = false;
  const updateHeaderChrome = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 30);
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    if (header) header.style.setProperty('--scroll-progress', pct.toFixed(2) + '%');
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateHeaderChrome);
  }, { passive: true });
  window.addEventListener('resize', updateHeaderChrome, { passive: true });
  updateHeaderChrome();

  /* ---------- Navigation dropdown: chip button + hamburger toggle ---------- */
  const toggle = $('.nav-toggle'), nav = $('#primary-nav');
  if (!nav) return;
  /* The dropdown panel is visually hidden until opened — hide it from
     assistive tech too so its links never enter the tab order while closed. */
  nav.setAttribute('aria-hidden', 'true');
  const openers = [toggle, chip].filter(Boolean);
  const isOpen = () => nav.classList.contains('open');
  const setMenu = open => {
    nav.classList.toggle('open', open);
    nav.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('nav-open', open);
    openers.forEach(o => o.setAttribute('aria-expanded', String(open)));
    if (toggle) toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    if (open) {
      const first = $('a', nav);
      if (first) setTimeout(() => first.focus(), 60);
    }
  };
  openers.forEach(o => o.addEventListener('click', () => setMenu(!isOpen())));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen()) {
      setMenu(false);
      (chip || toggle) && (chip || toggle).focus();
    }
  });
  /* Close when clicking anywhere outside the panel/toggles. */
  document.addEventListener('click', e => {
    if (!isOpen()) return;
    if (nav.contains(e.target) || openers.some(o => o.contains(e.target))) return;
    setMenu(false);
  });
}

/* ==========================================================================
   2. SCROLL REVEALS (all content visible without JS / reduced motion)
   ========================================================================== */
function initReveals() {
  const revealAll = () => $$('.reveal:not(.visible), .reveal-shift:not(.visible)')
    .forEach(t => t.classList.add('visible'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, .reveal-shift').forEach(t => io.observe(t));
  /* Observe any reveal elements added later by the renderers (gallery, travel photos). */
  const mo = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      if (n.classList && (n.classList.contains('reveal') || n.classList.contains('reveal-shift'))) io.observe(n);
      n.querySelectorAll && n.querySelectorAll('.reveal, .reveal-shift').forEach(el => io.observe(el));
    }));
  });
  mo.observe(document.body, { childList: true, subtree: true });

  /* Safety sweep: anything still hidden after load (e.g. elements that were
     inside a collapsed container when first observed, or missed by the
     observer on fast scrolls) is revealed once the page has settled. This
     guarantees no section can stay blank. */
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      $$('.reveal:not(.visible), .reveal-shift:not(.visible)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.2) el.classList.add('visible');
      });
    });
  });
}

/* ==========================================================================
   3. ACCORDION — statically rendered project & research case-study cards
   ========================================================================== */
function initCores() {
  $$('.core-sample').forEach(sample => {
    const triggers = $$('.core-trigger:not([hidden]), .core-summary', sample);
    const detail = $('.core-detail', sample);
    if (detail) detail.setAttribute('role', 'region');

    const setOpen = open => {
      sample.classList.toggle('is-open', open);
      triggers.forEach(t => t.setAttribute('aria-expanded', String(open)));
      if (window.Seismo) window.Seismo.trigger(open ? 1.2 : 0.5);
    };
    /* Guard: a publication PDF link (.core-pdf-link) may live inside the
       accordion card — even within the .core-summary toggle itself. Clicking
       it must open the PDF only, never expand/collapse the card, so stop the
       click from propagating to the toggle handlers below. */
    $$('.core-pdf-link', sample).forEach(link => {
      link.addEventListener('click', e => {
        e.stopPropagation();
        if (e.target.closest && e.target.closest('.core-summary, .core-trigger')) {
          e.preventDefault(); // anchor nested in a <button>: navigate manually
          window.open(link.href, link.target || '_self', 'noopener,noreferrer');
        }
      });
    });
    triggers.forEach(t => t.addEventListener('click', e => {
      if (e.target.closest('.core-pdf-link')) return; // PDF click handled above
      const willOpen = !sample.classList.contains('is-open');
      $$('.core-sample.is-open').forEach(o => {
        if (o !== sample) {
          o.classList.remove('is-open');
          $$('.core-trigger, .core-summary', o).forEach(x => x.setAttribute('aria-expanded', 'false'));
        }
      });
      setOpen(willOpen);
    }));
  });
}

/* --------------------------------------------------------------------------
   3b. PLACES I'VE TRAVELLED PHOTO GALLERY
   The full photo collection now lives as static markup in the "Photo Gallery"
   (#photo-gallery) section of index.html, grouped by place with a caption
   under every image. Nothing is injected at run time — the page works fully
   without JavaScript and no duplicate figures can ever appear. (The former
   renderTravelPhotos() injector was removed together with #travel-photos-grid.)
   -------------------------------------------------------------------------- */

/* ==========================================================================
   4. FIELDWORK GALLERY + LIGHTBOX
   The Fieldwork figures are already in index.html (static HTML, so they work
   without JS). Here we only wrap each existing image in a trigger button and
   register it with the lightbox — no duplicate markup, no missing files: an
   image is added to the lightbox set only when its <img> element exists.
   ========================================================================== */
const GALLERY = [];

/* ---------- thumbnail strategy ----------
   Grid tiles render at most ~500 CSS px wide, yet every <img> in index.html
   originally pointed straight at the full-size photo (~7.6 MB across 49
   files). On slow connections all those parallel downloads saturate the
   pipe and photos appear to "not load". Each tile therefore shows the tiny
   image/thumbs/*.jpg variant (max edge 560 px, ~35 KB avg — 1.7 MB for the
   whole set), and the big file is fetched ONLY when the photo is actually
   viewed (lightbox or map popup).

   IMPORTANT: the thumb is wired through data-thumb-src / data-full-src and
   swapped in with an explicit `img.src` assignment — NOT via srcset+sizes.
   The previous markup used a srcset like "thumb 560w, full 1280w" together
   with a tiny `sizes` hint (280px). That combination made browsers pick the
   FULL-resolution file for many tiles (a 280px slot on a 2x display wants a
   ~560px source, and some engines rounded up to the only ≥560 candidate —
   the 1280w original). Result: ~60 multi-hundred-KB downloads fired at once
   on first paint, the connection saturated, lazy tiles stalled below the
   fold and only finished after a refresh (when the partial responses sat in
   cache). A plain two-source swap is deterministic: grid = thumb always,
   lightbox = full only on demand. */
function thumbSrc(src) {
  return src.startsWith('image/') && !src.startsWith('image/thumbs/')
    ? src.replace('image/', 'image/thumbs/')
    : src;
}
function applyThumbSrcset(img) {
  const full = img.getAttribute('src');
  if (!full || !full.startsWith('image/') || full.startsWith('image/thumbs/')) return;
  img.setAttribute('data-full-src', full);           // remember the real file
  img.setAttribute('data-thumb-src', thumbSrc(full));
  /* Drop any legacy srcset/sizes left over from the old markup so the
     browser can never re-select the full-resolution candidate for a tile. */
  img.removeAttribute('srcset');
  img.removeAttribute('sizes');
}

/* Register one gallery figure with the lightbox set and wrap its image in a
   trigger button. Shared by the #gallery-grid section, every "Selected
   Project" photo grid and the Photo Gallery grids so clicking any portfolio
   image opens the viewer. The ⌕ VIEW overlay is suppressed on figures whose
   caption must stay fully visible (Photo Gallery). */
function registerGalleryFigure(fig) {
  const img = $('img', fig);
  const capEl = $('figcaption', fig);
  if (!img) return;
  /* Guard against double-registration: initFieldworkGallery() is called both
     directly and again from renderEnrichments() during boot — without this
     check every photo appeared twice in the lightbox slide set. */
  if (fig.dataset.galleryRegistered === 'true') return;
  fig.dataset.galleryRegistered = 'true';
  const i = GALLERY.length;
  /* Route the tile through the lightweight thumbnail variant BEFORE reading
     any source, so the lightbox registers the full file even though the
     visible tile src now points at the thumb. */
  applyThumbSrcset(img);
  const thumb = img.getAttribute('data-thumb-src');
  const fullSrc = img.getAttribute('data-full-src') || img.getAttribute('src');
  /* Lightbox always shows the FULL-resolution file, never the thumb. */
  GALLERY.push({ src: fullSrc, alt: img.alt, caption: capEl ? capEl.textContent : img.alt });
  /* Deterministic swap: point the tile at the ~35 KB thumb. Explicit src
     assignment (no srcset negotiation) guarantees the browser NEVER fetches
     the multi-hundred-KB original just to fill a small grid tile — that was
     what saturated the connection and made photos "not load" until refresh.
     Only re-assign if the current src isn't already the thumb, so an
     in-flight download of the right file is never cancelled. */
  if (thumb && img.getAttribute('src') !== thumb) img.setAttribute('src', thumb);
  /* Resilience: if a photo fails to load (flaky network / moved asset),
     fall back to the original full-size file, retry once with a cache-bust,
     and only then swap in the local placeholder instead of leaving a
     broken-image icon. */
  const IMG_FALLBACK = 'image/placeholder.svg';
  const giveUpOnce = () => {                  // final fallback for this image
    img.removeEventListener('error', onErr);
    img.removeAttribute('srcset');            // plain single-source fallback
    img.src = IMG_FALLBACK;
    img.style.objectFit = 'contain';
    img.style.background = '#e8e2d5';
  };
  function onErr() {
    const src = img.currentSrc || img.getAttribute('src') || '';
    if (src.includes('placeholder')) { giveUpOnce(); return; }
    /* If the thumbnail variant failed (e.g. image/thumbs/ missing from the
       deployment), fall back to the original full-size file rather than
       giving up. */
    if (src.includes('image/thumbs/')) {
      img.removeEventListener('error', onErr);
      img.removeAttribute('srcset');
      img.src = fullSrc;
      if (!img.complete || img.naturalWidth === 0) img.addEventListener('error', onErr);
      return;
    }
    /* Retry transient failures once — throttled connections (GitHub Pages on
       slow links) occasionally drop individual image requests when ~60 are
       queued at the same time. Cache-bust so the browser really re-issues. */
    if (!img._retried) {
      img._retried = true;
      setTimeout(() => {
        img.src = src + (src.includes('?') ? '&' : '?') + 'retry=1';
      }, 1200);
      return;
    }
    giveUpOnce();
  }
  /* Attach the error handler ONLY while the tile still needs to load; a
     fully-decoded cached image (warm reload) never fires error anyway. */
  if (!img.complete || img.naturalWidth === 0) img.addEventListener('error', onErr);
  fig.classList.add('reveal');
  const btn = make('button', 'gallery-trigger');
  btn.type = 'button';
  btn.dataset.index = String(i);
  btn.setAttribute('aria-label', `View larger image: ${img.alt || 'fieldwork photograph'}`);
  /* Keep loading="lazy" on every gallery photo. Moving an <img> into the
     trigger button preserves its lazy-loading state, so images far below the
     fold are NOT fetched all at once — that burst used to saturate the
     connection and made the photos appear "not loading". The browser still
     loads each photo as soon as its figure scrolls near the viewport. */
  btn.appendChild(img);
  if (capEl) fig.insertBefore(btn, capEl); else fig.appendChild(btn);
  /* In the Photo Gallery / slideshow the caption sits directly below (or
     over) each image and must never be covered — mark the trigger so CSS
     hides the hover overlay there. */
  if (fig.closest('.photo-gallery') || fig.closest('.photo-slideshow')) {
    btn.classList.add('no-overlay');
  }
  /* Inside the Swiper slideshow the trigger fills the whole slide area —
     mark it so CSS can size the image to the frame instead of a grid crop. */
  if (fig.closest('#places-swiper')) {
    btn.classList.add('slide-trigger');
    fig.classList.add('reveal'); // slides fade in with the section reveal
  }
}

function initFieldworkGallery() {
  /* Swiper slideshow figures first: the lightbox browsing order then follows
     the visible photo-by-photo sequence of the "Places I've Travelled" show. */
  $$('#places-swiper .gallery-item, #gallery-grid .gallery-item, .core-gallery .gallery-item, .photo-gallery .gallery-item')
    .forEach(registerGalleryFigure);
}

function initLightbox() {
  const box = $('#lightbox'), img = $('#lightbox-img'), cap = $('#lightbox-caption');
  if (!box || !GALLERY.length) return;
  let idx = -1, lastFocus = null;

  const focusables = () => $$('button, [href], input, [tabindex]:not([tabindex="-1"])', box)
    .filter(el => el.offsetParent !== null);

  function open(i) {
    const g = GALLERY[i];
    if (!g) return;
    lastFocus = document.activeElement;
    idx = i;
    /* The tile in the grid is a thumbnail, so the full file is almost always
       a cold fetch. Warm the browser cache NOW — while the visitor is still
       looking at the grid — instead of only when the viewer opens: by the
       time they click, the big image is already local and shows instantly. */
    if (!open._warm) open._warm = new Set();
    if (!open._warm.has(g.src)) {
      open._warm.add(g.src);
      const w = new Image();
      w.decoding = 'async';
      w.src = g.src;
    }
    img.src = g.src; img.alt = g.alt;
    /* Enlarged view loads a bigger version than the lazy thumbnail may have
       finished fetching — show a subtle "loading" state instead of a
       blank/broken frame while it arrives. */
    box.classList.add('loading');
    /* If the warm-up already cached this exact URL, the swap resolves from
       memory synchronously — clear the spinner without waiting for a load
       event that may have raced past our listener attachment. */
    if (img.complete && img.naturalWidth > 0 && img.currentSrc === g.src) {
      box.classList.remove('loading');
    } else {
      img.addEventListener('load', onLoad, { once: true });
      img.addEventListener('error', onLoad, { once: true });
    }
    cap.textContent = g.caption;
    box.removeAttribute('hidden');
    requestAnimationFrame(() => box.classList.add('open'));
    /* Tell the Swiper slideshow to pause autoplay while the viewer is open */
    document.dispatchEvent(new CustomEvent('lightbox:state', { detail: { open: true } }));
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const c = $('.lightbox-close', box); if (c) c.focus(); }, 80);
    if (window.Seismo) window.Seismo.trigger(0.9);
  }
  function onLoad() { box.classList.remove('loading'); }
  function close() {
    if (box.classList.contains('open')) {
      box.classList.remove('open');
      setTimeout(() => box.setAttribute('hidden', ''), 350);
    } else {
      box.setAttribute('hidden', '');
    }
    document.body.style.overflow = '';
    /* Resume slideshow autoplay (the swiper handler respects a manual pause) */
    document.dispatchEvent(new CustomEvent('lightbox:state', { detail: { open: false } }));
    idx = -1;
    if (lastFocus && lastFocus.isConnected) lastFocus.focus();
  }
  function nav(dir) {
    if (idx < 0) return;
    open((idx + dir + GALLERY.length) % GALLERY.length);
  }

  document.addEventListener('click', e => {
    const trigger = e.target.closest && e.target.closest('.gallery-trigger');
    if (trigger && trigger.dataset.index !== undefined) {
      open(parseInt(trigger.dataset.index, 10));
    }
  });
  $('.lightbox-close', box).addEventListener('click', close);
  $('.lightbox-prev', box).addEventListener('click', () => nav(-1));
  $('.lightbox-next', box).addEventListener('click', () => nav(1));
  box.addEventListener('click', e => { if (e.target === box) close(); });

  document.addEventListener('keydown', e => {
    if (box.hasAttribute('hidden')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); nav(-1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); nav(1); return; }
    if (e.key === 'Tab') {
      // Focus trap: keep Tab cycling within the dialog only
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!box.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    }
  });
}

/* ==========================================================================
   5. TESTIMONIALS + MAP LEGEND (enrichment from data.js)
   Shared builders are also reused for the <noscript> static fallbacks in
   index.html so both versions look identical. (The former "Mentors and
   Guidance" strip was removed — no #mentor-strip exists in the markup.)
   ========================================================================== */
function buildTestimonialCard(t) {
  const card = make('article', 'testimonial-card reveal');
  card.appendChild(make('span', 'testimonial-badge', t.badge));
  const bq = make('blockquote', 'testimonial-content');
  bq.appendChild(make('p', 'testimonial-text', `“${t.text}”`));
  card.appendChild(bq);
  const footer = make('footer', 'testimonial-author');
  const avatar = make('span', 'author-avatar', t.initials);
  avatar.setAttribute('aria-hidden', 'true');
  const info = make('span', 'author-info');
  info.appendChild(make('span', 'author-name', t.name));
  if (t.role) info.appendChild(make('span', 'author-role', t.role));
  footer.append(avatar, info);
  card.appendChild(footer);
  return card;
}

function buildLegendItem(s) {
  const li = document.createElement('li');
  const btn = make('button', 'map-legend-item');
  btn.type = 'button';
  btn.dataset.site = s.id;
  btn.setAttribute('aria-pressed', 'false');
  const dot = make('span', `legend-dot legend-dot--${s.type}`);
  dot.setAttribute('aria-hidden', 'true');
  const txt = make('span', 'legend-text');
  txt.appendChild(make('strong', null, s.name));
  txt.appendChild(make('em', null, s.org));
  btn.append(dot, txt);
  li.appendChild(btn);
  return li;
}

function renderEnrichments() {
  if (!window.STRATA_DATA) return;

  /* Testimonials */
  const tgrid = $('#testimonials-grid');
  if (tgrid && !tgrid.children.length) {
    (D.testimonials || []).forEach(t => tgrid.appendChild(buildTestimonialCard(t)));
  }

  /* Map legend buttons */
  const legendList = $('#map-legend-list');
  if (legendList) {
    (D.mapSites || []).forEach(s => legendList.appendChild(buildLegendItem(s)));
  }

  /* Fieldwork gallery: lightbox triggers are already wired by
     initFieldworkGallery() earlier in boot (registerGalleryFigure is
     idempotent, so calling it again here would be harmless but pointless). */
  const grid = $('#gallery-grid');
  const fieldHead = $('#gallery-heading');
  if (grid && fieldHead) {
    const follows = !!(fieldHead.compareDocumentPosition(grid) & Node.DOCUMENT_POSITION_FOLLOWING);
    if (!follows) fieldHead.parentElement.insertBefore(grid, fieldHead.nextSibling);
  }
}

/* ==========================================================================
   5b. PLACES I'VE TRAVELLED — SWIPER SLIDESHOW
   The carousel markup is static HTML (one .swiper-slide per photo, ordered by
   place). If the Swiper CDN loaded (defer ⇒ available at DOMContentLoaded) we
   build a real slider: swipe/drag, ‹ › navigation, autoplay with pause/play,
   keyboard browsing and dynamic pagination bullets (one per place group).
   If Swiper is unavailable (offline / blocked CDN) we add .no-swiper so CSS
   stacks every slide as a plain grid — the photos stay visible either way.
   ========================================================================== */
const GROUP_SITES = { taplejung: ['taplejung'], kathmandu: ['kathmandu'],
                      madhyaphawa: ['madhyaphawa'], more: ['manakhmai', 'bhadrapal', 'rasuwagadhi', 'jajarkot'] };

function initPlacesSwiper() {
  const el = $('#places-swiper');
  if (!el || el.dataset.swiperReady === 'true') return;
  el.dataset.swiperReady = 'true';

  const slides = $$('.swiper-slide.place-slide', el);
  if (!slides.length) return;

  const counter  = $('#slideshow-counter');
  const placeBar = $('#slideshow-place-bar');
  const playBtn  = $('#slideshow-play');
  const btns     = $$('#slideshow-buttons .slideshow-btn');

  /* First slide index of each place group + which group a slide belongs to */
  const groupStart = {};
  slides.forEach((s, i) => {
    for (const [g, sites] of Object.entries(GROUP_SITES)) {
      if (sites.includes(s.dataset.site) && groupStart[g] === undefined) groupStart[g] = i;
    }
  });
  const groupOf = s => {
    for (const [g, sites] of Object.entries(GROUP_SITES)) if (sites.includes(s.dataset.site)) return g;
    return null;
  };

  const syncUI = idx => {
    const s = slides[idx];
    if (!s) return;
    if (counter)  counter.textContent = `Photo ${idx + 1} of ${slides.length}`;
    if (placeBar) placeBar.textContent = s.dataset.place || '';
    const g = groupOf(s);
    btns.forEach(b => {
      const on = b.dataset.group === g;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
  };

  if (typeof window.Swiper !== 'function') {
    /* CDN blocked/offline — degrade to a stacked, fully-visible grid. */
    el.classList.add('no-swiper');
    if (playBtn) playBtn.hidden = true;
    return;
  }

  const interval = parseInt(el.dataset.interval || '5000', 10);
  const swiper = new window.Swiper(el, {
    loop: slides.length > 3,
    speed: reduceMotion ? 0 : 600,
    spaceBetween: 24,
    grabCursor: true,
    autoHeight: false,
    keyboard: { enabled: true },
    navigation: { nextEl: '.slideshow-next', prevEl: '.slideshow-prev' },
    pagination: { el: '.places-pagination', clickable: true, dynamicBullets: true },
    autoplay: el.dataset.autoplay === 'true' && !reduceMotion
      ? { delay: interval, disableOnInteraction: false, pauseOnMouseEnter: true }
      : false,
    a11y: { enabled: true },
    on: {
      init: sw => syncUI(sw.realIndex),
      slideChange: sw => syncUI(sw.realIndex),
    },
  });
  el.classList.add('places-swiper-ready');

  /* Place buttons jump to the first photo of that group */
  btns.forEach(b => b.addEventListener('click', () => {
    const start = groupStart[b.dataset.group];
    if (start !== undefined) swiper.slideToLoop(start, reduceMotion ? 0 : 600);
  }));

  /* Pause / play toggle */
  let userPaused = false;
  if (playBtn) {
    if (!swiper.autoplay) { playBtn.hidden = true; }
    else {
      const setLabel = () => {
        playBtn.textContent = userPaused ? 'Play slideshow' : 'Pause slideshow';
        playBtn.setAttribute('aria-pressed', String(!userPaused));
      };
      playBtn.addEventListener('click', () => {
        userPaused = !userPaused;
        userPaused ? swiper.autoplay.stop() : swiper.autoplay.start();
        setLabel();
      });
      setLabel();
      /* While the lightbox is open, pause autoplay; resume when it closes
         (unless the visitor had paused it manually). */
      document.addEventListener('lightbox:state', e => {
        if (e.detail && e.detail.open) swiper.autoplay.stop();
        else if (!userPaused) swiper.autoplay.start();
      });
    }
  }
}

/* ==========================================================================
   6. NEPAL MAP (Leaflet) — the "Places I've Travelled" map is shown inline;
   initialised once Leaflet is available, and fits itself to Nepal's extent.
   Text list of places is in the HTML.
   ========================================================================== */
let mapInited = false, mapInstance = null;

function initMap() {
  const mapEl = $('#travelMap');
  if (!mapEl || mapInited || !window.STRATA_DATA) return;
  // Leaflet may still be loading (CDN script) or blocked (offline/ad-block) —
  // retry briefly, then show a graceful message instead of an empty grey box.
  if (typeof L === 'undefined') {
    if (!(initMap._tries > 20)) {
      initMap._tries = (initMap._tries || 0) + 1;
      setTimeout(initMap, 250);
    } else if (mapEl && !mapEl.dataset.mapUnavailable) {
      mapEl.dataset.mapUnavailable = 'true';
      mapEl.classList.add('map-unavailable');
      mapEl.textContent = 'The interactive map could not load (no network connection). All places are listed above with their coordinates.';
    }
    return;
  }
  mapInited = true;

  // Pin colours match the legend dots in css/strata.css
  const PIN_COLORS = { work: '#52b788', research: '#6aaee6', study: '#d8b25f', travel: '#e07aa5' };

  try {
    mapInstance = L.map(mapEl, {
      center: [28.3949, 83.9], zoom: 7, minZoom: 5, maxZoom: 17,
      scrollWheelZoom: false, keyboard: true, zoomControl: true
    });
  } catch (e) { mapInited = false; return; }

  // Tile layer with two CDN fallbacks so the map still works if one host fails
  const TILE_SOURCES = [
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
  ];
  let tileIndex = 0, tilesFailed = 0;
  function addTileLayer(url) {
    L.tileLayer(url, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
      .on('tileerror', function () {
        tilesFailed += 1;
        // Switch source only if this layer keeps failing (avoid flapping on
        // the occasional single missing tile)
        if (tileIndex < TILE_SOURCES.length - 1 && tilesFailed >= 6) {
          tileIndex += 1;
          tilesFailed = 0;
          mapInstance.removeLayer(this);
          addTileLayer(TILE_SOURCES[tileIndex]);
        }
      })
      .addTo(mapInstance);
  }
  addTileLayer(TILE_SOURCES[0]);

  /* Nepal country boundary — bundled locally (no network dependency), drawn
     as a warm ochre outline that matches the site palette, with a soft fill
     inside the border so the shape clearly reads as "the map of Nepal".
     The map view is then fitted exactly to the country's extent. */
  try {
    fetch('nepal.geojson')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('boundary unavailable'))))
      .then(geo => {
        if (!mapInstance) return;
        const boundary = L.geoJSON(geo, {
          style: { color: '#cf9768', weight: 3, opacity: 0.95, fillColor: '#cf9768', fillOpacity: 0.10 },
          interactive: false
        }).addTo(mapInstance);
        boundary.bringToBack();
        // Fit the whole of Nepal into view (with room for the pins)
        mapInstance.fitBounds(boundary.getBounds().pad(0.06));
      })
      .catch(() => { /* boundary is decorative — tiles already show Nepal */ });
  } catch (e) { /* fetch unsupported — ignore */ }

  const markers = {};
  const legendBtns = $$('.map-legend-item');
  const setActive = id => legendBtns.forEach(b => {
    const on = b.dataset.site === id;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', String(on));
  });

  (D.mapSites || []).forEach(site => {
    const pinSpan = document.createElement('span');
    pinSpan.style.color = PIN_COLORS[site.type] || PIN_COLORS.work;
    pinSpan.style.fontSize = '30px';
    pinSpan.style.lineHeight = '1';
    pinSpan.setAttribute('aria-hidden', 'true');
    pinSpan.textContent = '📍';
    const icon = L.divIcon({
      html: pinSpan.outerHTML,
      className: 'custom-map-pin',
      iconSize: [34, 34], iconAnchor: [17, 30], popupAnchor: [0, -28]
    });
    const m = L.marker(site.coords, {
      icon, title: site.name, alt: `${site.name} — ${site.org}`, riseOnHover: true, keyboard: true
    }).addTo(mapInstance);

    // Accessible popup built with explicit DOM nodes (no innerHTML interpolation)
    const pop = document.createElement('div');
    pop.className = 'map-popup';
    const role = document.createElement('span'); role.className = 'map-popup-role'; role.textContent = site.role;
    const name = document.createElement('strong'); name.className = 'map-popup-title'; name.textContent = site.name;
    const org = document.createElement('span'); org.className = 'map-popup-org'; org.textContent = site.org;
    pop.append(role, name, org);
    /* Pinpoints only — per request the map carries no photographs any more.
       Popups show the place name, role and organisation; every photo lives in
       the Swiper slideshow above, opened full-size via the lightbox there. */

    m.bindPopup(pop, { maxWidth: 320 });

    m.on('click', () => setActive(site.id));
    markers[site.id] = m;
  });

  legendBtns.forEach(btn => btn.addEventListener('click', () => {
    const site = (D.mapSites || []).find(s => s.id === btn.dataset.site);
    if (!site || !markers[site.id]) return;
    mapInstance.flyTo(site.coords, site.zoom, { duration: reduceMotion ? 0 : 0.9 });
    markers[site.id].openPopup();
    setActive(site.id);
    if (window.Seismo) window.Seismo.trigger(0.6);
  }));

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => mapInstance && mapInstance.invalidateSize(), 250);
  });
}

function initMapOnDemand() {
  // Map is displayed inline (no <details> toggle any more) — initialise directly.
  initMap();
}

/* ==========================================================================
   7. COPY BUTTONS for email / phone (accessible feedback)
   ========================================================================== */
function initCopyButtons() {
  $$('#contact-details a[href^="mailto:"], #contact-details a[href^="tel:"]').forEach(link => {
    if (link.nextElementSibling && link.nextElementSibling.classList.contains('copy-btn')) return;
    const value = link.textContent.trim();
    const btn = make('button', 'copy-btn', 'Copy');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Copy ${value} to clipboard`);
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(value);
        btn.textContent = 'Copied ✓';
        const live = make('span', 'sr-only', `Copied ${value} to clipboard`);
        live.setAttribute('role', 'status');
        live.setAttribute('aria-live', 'polite');
        btn.appendChild(live);
      } catch (e) { btn.textContent = 'Ctrl+C'; }
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
    link.insertAdjacentElement('afterend', btn);
  });
}

/* ==========================================================================
   BOOT — enhancement only; wrapped so one failure cannot break the rest
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  [initNav, initReveals, initCores, initFieldworkGallery, initLightbox, initPlacesSwiper,
   renderEnrichments, initMapOnDemand, initCopyButtons]
    .forEach(fn => { try { fn(); } catch (err) { console.warn('Optional enhancement skipped:', fn.name, err); } });
});
