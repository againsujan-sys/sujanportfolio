/* ==========================================================================
   THEME SWITCHER — light / dark "Sunlit Plateau vs. Dusk Basin"
   Runs early (deferred, before main.js) and:
     · restores the saved theme (localStorage) or follows prefers-color-scheme
     · toggles [data-theme] on <html>, updates aria state + meta theme-color
     · fires document event 'strata:themechange' so canvas modules (the
       seismograph ink, hero crystal fog) can re-read CSS variables
     · adds a temporary .theming class for a smooth cross-fade of all colors
   ========================================================================== */
'use strict';

(function initThemeSwitcher() {
  const root = document.documentElement;
  /* Flag that JS is running so reveal/accordion CSS can animate safely.
     Without this flag every element remains fully visible (no-JS friendly). */
  root.classList.add('js');
  const KEY = 'strata-theme';

  /* GEO v3 ships light-first: the DEFAULT palette (no data-theme attribute)
     is the off-white earth portfolio, and "dark" / "limestone" are opt-in
     overrides. Therefore an un-saved visitor ALWAYS starts on the default
     light design — we deliberately do NOT follow prefers-color-scheme here,
     otherwise OS dark-mode users would be dropped into the legacy basalt
     "Soft Strata" palette (white text on near-black), which clashes with
     the slate sticky header and the terracotta accent system. */
  function preferred() {
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
    return saved === 'dark' ? 'dark' : 'light';
  }

  function apply(theme, animate) {
    if (animate) {
      root.classList.add('theming');
      clearTimeout(apply._t);
      apply._t = setTimeout(() => root.classList.remove('theming'), 520);
    }
    /* "light" is the DEFAULT GEO v3 palette, so we REMOVE the attribute for
       it — this keeps every `:root`-scoped card/header rule (which must not
       leak into [data-theme="dark"]) matching exactly like a static build. */
    if (theme === 'light') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#F8F9FA' : '#17151f');
    document.dispatchEvent(new CustomEvent('strata:themechange', { detail: { theme } }));
  }

  // Apply stored/system theme immediately to avoid a flash of the wrong palette.
  let current = preferred();
  apply(current, false);

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    /* Fixed-label button: JS only ever toggles aria-pressed (and title).
       "pressed" === dark mode is ON. The old code rewrote aria-label on
       every click, which fought the static HTML label and confused screen
       readers — the label now stays constant. */
    const syncBtn = theme => {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    };
    syncBtn(current);

    btn.addEventListener('click', () => {
      current = current === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, current); } catch (e) { /* ignore */ }
      apply(current, true);
      syncBtn(current);
      if (window.Seismo) window.Seismo.trigger(0.8); // little quake when the sun rises
    });

    /* OS preference changes are intentionally ignored: GEO v3 is a curated
       light-first portfolio design (slate header + terracotta accents), so
       we never override a visitor's view with the legacy basalt palette.
       Only an explicit toggle (persisted above) changes the theme. */
  });
})();
