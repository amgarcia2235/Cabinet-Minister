/* ============================================================================
   cabinetminister — theme boot + toggle
   Load this in <head> BEFORE the page paints so there is no light flash on a
   dark-mode machine. Exposes window.CabTheme for the toggle control.
   ========================================================================= */
(function () {
  var KEY = 'cabplanner.v1.theme';

  function read() {
    try {
      var t = localStorage.getItem(KEY);
      if (t === 'light' || t === 'dark') return t;
    } catch (e) {}
    try {
      return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) { return 'light'; }
  }

  function apply(t) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem(KEY, t); } catch (e) {}
    window.dispatchEvent(new CustomEvent('cabthemechange', { detail: { theme: t } }));
  }

  apply(read());

  var SUN = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
    + '<circle cx="12" cy="12" r="4"></circle>'
    + '<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>';
  var MOON = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
    + '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path></svg>';

  window.CabTheme = {
    current: function () { return document.documentElement.dataset.theme || 'light'; },
    isDark: function () { return this.current() === 'dark'; },
    toggle: function () { apply(this.isDark() ? 'light' : 'dark'); return this.current(); },
    set: apply,

    // Wire an existing <button> as the toggle. Keeps its own label/icon in sync.
    bind: function (el) {
      if (!el) return;
      var self = this;
      function paint() {
        var dark = self.isDark();
        el.innerHTML = (dark ? SUN : MOON) + '<span>' + (dark ? 'Light' : 'Dark') + '</span>';
      }
      el.addEventListener('click', function () { self.toggle(); });
      addEventListener('cabthemechange', paint);
      paint();
    },
  };
})();
