// Full-screen site menu for phone-width screens.
(function () {
  var menu = document.getElementById('site-menu');
  var opener = document.querySelector('[data-menu-open]');
  if (!menu || !opener) return;
  var closer = menu.querySelector('[data-menu-close]');

  function open() {
    menu.hidden = false;
    opener.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    closer.focus();
  }

  function close() {
    if (menu.hidden) return;
    menu.hidden = true;
    opener.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    opener.focus();
  }

  opener.addEventListener('click', open);
  closer.addEventListener('click', close);

  menu.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    // Keep focus inside the open menu.
    var items = menu.querySelectorAll('a[href], button');
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Close if the screen grows past the phone breakpoint while open.
  window.matchMedia('(min-width: 900px)').addEventListener('change', function (mq) {
    if (mq.matches) close();
  });
})();
