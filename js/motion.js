// Motion layer: scroll effects, figures and interactive pieces.
// Content stays fully visible without JavaScript or with reduced motion.
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var easeInOut = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  // Run fn once when el scrolls into view.
  function onView(el, fn, opts) {
    if (!('IntersectionObserver' in window)) { fn(el); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); fn(el); } });
    }, opts || { threshold: .2, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
  }

  /* ---------- Scroll progress + header ---------- */
  var bar = document.createElement('div');
  bar.className = 'mx-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var header = $('header.hdr-in');
  var lastY = window.scrollY, ticking = false;
  var scrollHooks = [];

  function onScroll() {
    ticking = false;
    var y = window.scrollY, max = root.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? clamp(y / max, 0, 1) : 0) + ')';
    if (header) {
      header.classList.toggle('mx-scrolled', y > 8);
      if (Math.abs(y - lastY) > 6) {
        header.classList.toggle('mx-hide', y > lastY && y > 200 && !header.contains(document.activeElement));
        lastY = y;
      }
    }
    scrollHooks.forEach(function (fn) { fn(); });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  if (header) header.addEventListener('focusin', function () { header.classList.remove('mx-hide'); });

  /* ---------- Buttons: shine + magnetic pull ---------- */
  $$('a[style*="background: #4F246E"]').forEach(function (b) {
    if (b.closest('#site-menu')) return;
    b.classList.add('mx-btn');
    if (!fine || reduce) return;
    b.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect();
      b.style.translate = ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + 'px ' + ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + 'px';
    });
    b.addEventListener('pointerleave', function () { b.style.translate = ''; });
  });

  /* ---------- Scroll reveal with stagger ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var targets = $$('main h2, main li, main dl > div, main dl > dt, main dl > dd, main figure, main [data-reveal], footer .wrap > div > div')
      .filter(function (el) {
        return !el.closest('.panel, [class*="pg-"], .mx-marquee, .mx-journey, #site-menu, .mx-cal, .mx-hrow') &&
          el.getBoundingClientRect().top > window.innerHeight * .92;
      });
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('mx-in'); rio.unobserve(e.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) {
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (s) { return targets.indexOf(s) > -1; });
      el.style.setProperty('--d', (Math.min(sibs.indexOf(el), 6) * .08) + 's');
      el.classList.add('mx-rv');
      rio.observe(el);
    });
  }

  /* ---------- Generic "in view" flags (figures, steps, calendar) ---------- */
  $$('[data-io]').forEach(function (el) { onView(el, function () { el.classList.add('mx-in'); }); });
  $$('.mx-fig').forEach(function (el) { onView(el, function () { el.classList.add('mx-figs-on'); }, { threshold: .3 }); });

  /* ---------- Counters ---------- */
  $$('[data-count]').forEach(function (el) {
    var to = el.hasAttribute('data-since') ? new Date().getFullYear() - +el.getAttribute('data-since') : +el.getAttribute('data-count');
    var from = +(el.getAttribute('data-from') || 0);
    var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    var show = function (v) { el.textContent = pre + Math.round(v) + suf; };
    if (reduce) { show(to); return; }
    show(from);
    onView(el, function () {
      var t0 = null, dur = 1800;
      requestAnimationFrame(function step(t) {
        if (t0 === null) t0 = t;
        var k = clamp((t - t0) / dur, 0, 1);
        show(from + (to - from) * easeOut(k));
        if (k < 1) requestAnimationFrame(step);
      });
    }, { threshold: .6 });
  });

  /* ---------- Tilt cards ---------- */
  if (fine && !reduce) {
    $$('[data-tilt]').forEach(function (el) {
      var timer;
      el.addEventListener('pointermove', function (e) {
        clearTimeout(timer);
        // A finished page-load animation would otherwise pin transform; its end state is "none" anyway.
        if (!el._freed) { el.style.animation = 'none'; el._freed = true; }
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.transition = 'transform .15s ease-out';
        el.style.transform = 'perspective(900px) rotateX(' + (-py * 7).toFixed(2) + 'deg) rotateY(' + (px * 9).toFixed(2) + 'deg) translateY(-4px)';
      });
      el.addEventListener('pointerleave', function () {
        el.style.transition = 'transform .8s cubic-bezier(.16,.8,.2,1)';
        el.style.transform = '';
        timer = setTimeout(function () { el.style.transition = ''; }, 800);
      });
    });
  }

  /* ---------- Home: hero parallax ---------- */
  var p1 = $('.p1');
  if (p1 && fine && !reduce) {
    var layers = [[$('.w1'), -34, -18], [$('.w2'), 34, 18], [$('.por'), 14, 8]];
    var tx = 0, ty = 0, cx = 0, cy = 0, running = false;
    var loop = function () {
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      layers.forEach(function (l) { if (l[0]) l[0].style.translate = (cx * l[1]).toFixed(1) + 'px ' + (cy * l[2]).toFixed(1) + 'px'; });
      if (Math.abs(tx - cx) > .001 || Math.abs(ty - cy) > .001) requestAnimationFrame(loop); else running = false;
    };
    p1.addEventListener('pointermove', function (e) {
      tx = e.clientX / window.innerWidth - .5; ty = e.clientY / window.innerHeight - .5;
      if (!running) { running = true; requestAnimationFrame(loop); }
    });
  }

  /* ---------- Home: seal tilt + gold dust ---------- */
  var sealWrap = $('.mx-sealwrap');
  if (sealWrap && fine && !reduce) {
    var p2 = sealWrap.closest('section');
    p2.addEventListener('pointermove', function (e) {
      var r = p2.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      sealWrap.style.transform = 'perspective(1000px) rotateX(' + (-py * 14).toFixed(2) + 'deg) rotateY(' + (px * 14).toFixed(2) + 'deg)';
    });
    p2.addEventListener('pointerleave', function () { sealWrap.style.transform = ''; });
  }
  $$('canvas.mx-motes').forEach(function (cv) {
    if (reduce || !cv.getContext) return;
    var ctx = cv.getContext('2d'), parts = [], w = 0, h = 0, raf = 0, live = false;
    var size = function () {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    var make = function (anyY) {
      return { x: Math.random() * w, y: anyY ? Math.random() * h : h + 6, r: Math.random() * 1.9 + .4,
        vy: -(Math.random() * .4 + .1), vx: (Math.random() - .5) * .16, a: Math.random() * 6.28, s: Math.random() * .02 + .006 };
    };
    size();
    for (var i = 0; i < 80; i++) parts.push(make(true));
    var frame = function () {
      ctx.clearRect(0, 0, w, h);
      parts.forEach(function (p, i) {
        p.a += p.s; p.x += p.vx + Math.sin(p.a) * .18; p.y += p.vy;
        if (p.y < -6) parts[i] = make(false);
        var alpha = .2 + .6 * Math.pow(Math.sin(p.a * 1.7), 2);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = 'rgba(212,176,98,' + alpha.toFixed(3) + ')'; ctx.fill();
      });
      raf = live ? requestAnimationFrame(frame) : 0;
    };
    new IntersectionObserver(function (es) {
      live = es[0].isIntersecting;
      if (live && !raf) raf = requestAnimationFrame(frame);
    }).observe(cv);
    window.addEventListener('resize', size);
  });

  /* ---------- Martha Briggs: timeline draws as you scroll ---------- */
  $$('.mx-tl').forEach(function (tl) {
    if (reduce) { $$('li', tl).forEach(function (li) { li.classList.add('mx-on'); }); return; }
    var items = $$(':scope > li', tl);
    var update = function () {
      var r = tl.getBoundingClientRect(), mark = window.innerHeight * .62;
      tl.style.setProperty('--tl', clamp((mark - r.top) / r.height, 0, 1).toFixed(4));
      items.forEach(function (li) { li.classList.toggle('mx-on', li.getBoundingClientRect().top + 34 < mark); });
    };
    scrollHooks.push(update);
    update();
  });

  /* ---------- Martha Briggs: journey map ---------- */
  $$('.mx-journey').forEach(function (j) {
    var line = $('.mx-jline', j), trav = $('.mx-traveler', j), scroller = $('.mx-jscroll', j);
    var stops = $$('.mx-stop', j), panels = $$('.mx-jpanel', j);
    var VW = 1000, VH = 300, N = 600, L = line.getTotalLength(), cur = 0, anim = 0, auto = true;
    // Sample the route once. The gold line and the travelling dot are both drawn from these
    // points, so the line always ends exactly where the dot (and the selected stop) is.
    var pts = [];
    for (var i = 0; i <= N; i++) { var q = line.getPointAtLength(L * i / N); pts.push({ x: q.x, y: q.y }); }
    stops.forEach(function (s) {
      var sx = +s.dataset.x, sy = +s.dataset.y;
      s.style.left = (sx / VW * 100) + '%';
      s.style.top = (sy / VH * 100) + '%';
      var best = 0, bd = Infinity;
      pts.forEach(function (p, k) {
        var d = (p.x - sx) * (p.x - sx) + (p.y - sy) * (p.y - sy);
        if (d < bd) { bd = d; best = k; }
      });
      pts[best] = { x: sx, y: sy }; // snap the route onto the stop itself
      s._f = best / N;
    });
    var pointAt = function (p) {
      var k = clamp(p, 0, 1) * N, a = Math.floor(k), b = Math.min(a + 1, N), t = k - a;
      return { x: pts[a].x + (pts[b].x - pts[a].x) * t, y: pts[a].y + (pts[b].y - pts[a].y) * t, a: a };
    };
    var select = function (idx) {
      stops.forEach(function (s, k) { s.setAttribute('aria-pressed', k === idx ? 'true' : 'false'); });
      panels.forEach(function (p, k) { p.classList.toggle('mx-act', k === idx); });
    };
    var setP = function (p) {
      cur = p;
      var pt = pointAt(p), d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
      for (var k = 1; k <= pt.a; k++) d += 'L' + pts[k].x.toFixed(1) + ' ' + pts[k].y.toFixed(1);
      line.setAttribute('d', d + 'L' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1));
      trav.style.left = (pt.x / VW * 100) + '%';
      trav.style.top = (pt.y / VH * 100) + '%';
      // On narrow screens the map scrolls sideways: keep the travelling dot in view.
      if (scroller.scrollWidth > scroller.clientWidth + 1) {
        scroller.scrollLeft = pt.x / VW * scroller.scrollWidth - scroller.clientWidth / 2;
      }
      var lastLit = 0;
      stops.forEach(function (s, k) { var lit = s._f <= p + .002; s.classList.toggle('mx-lit', lit); if (lit) lastLit = k; });
      if (auto) select(lastLit);
    };
    var go = function (target, dur) {
      cancelAnimationFrame(anim);
      var from = cur, t0 = null;
      anim = requestAnimationFrame(function step(t) {
        if (t0 === null) t0 = t;
        var k = clamp((t - t0) / dur, 0, 1);
        setP(from + (target - from) * easeInOut(k));
        if (k < 1) anim = requestAnimationFrame(step);
      });
    };
    stops.forEach(function (s, k) {
      s.addEventListener('click', function () {
        auto = false; select(k);
        if (reduce) setP(Math.max(cur, s._f)); else go(s._f, 500 + Math.abs(s._f - cur) * 1800);
      });
      s.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? k + 1 : e.key === 'ArrowLeft' ? k - 1 : -1;
        if (n >= 0 && n < stops.length) { e.preventDefault(); stops[n].focus(); stops[n].click(); }
      });
    });
    trav.classList.add('mx-on');
    if (reduce) { setP(1); auto = false; select(0); return; }
    setP(0);
    onView(j, function () { go(1, 6500); }, { threshold: .45 });
  });

  /* ---------- Scholarships: deadline countdown ---------- */
  $$('.mx-countdown[data-deadline]').forEach(function (el) {
    // Accepts "2027-04-16" (and tolerates extra time text after it); counts down to the end of that day.
    var m = el.getAttribute('data-deadline').trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    var end = m ? new Date(+m[1], +m[2] - 1, +m[3], 23, 59, 59) : null;
    if (!end || isNaN(end)) return;
    var tick = function () {
      var ms = end - new Date();
      if (ms <= 0) { el.textContent = 'Applications closed'; return; }
      var days = Math.floor(ms / 864e5), hrs = Math.floor(ms / 36e5) % 24, mins = Math.floor(ms / 6e4) % 60;
      el.textContent = days > 0 ? days + (days === 1 ? ' day ' : ' days ') + hrs + (hrs === 1 ? ' hour left' : ' hours left')
        : hrs + 'h ' + mins + 'm left';
      setTimeout(tick, 30000);
    };
    el.hidden = false;
    tick();
  });

  /* ---------- Membership: next meeting calendar ---------- */
  $$('.mx-next').forEach(function (box) {
    var now = new Date(), next = null;
    var firstSat = function (y, m) { var d = new Date(y, m, 1); return new Date(y, m, 1 + (6 - d.getDay() + 7) % 7, 11, 0); };
    for (var k = 0; k < 14 && !next; k++) {
      var mm = (now.getMonth() + k) % 12, yy = now.getFullYear() + Math.floor((now.getMonth() + k) / 12);
      if (mm === 6 || mm === 7) continue; // no meetings in July and August
      var d = firstSat(yy, mm);
      if (d > now) next = d;
    }
    if (!next) return;
    $('.mx-nextdate', box).textContent = next.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) + ', 11:00 AM';
    $('.mx-calmonth', box).textContent = next.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    var cal = $('.mx-cal', box), html = '';
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(function (h) { html += '<span class="h">' + h + '</span>'; });
    var start = new Date(next.getFullYear(), next.getMonth(), 1).getDay();
    var days = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    for (var b = 0; b < start; b++) html += '<span></span>';
    for (var day = 1; day <= days; day++) {
      var past = next.getMonth() === now.getMonth() && next.getFullYear() === now.getFullYear() && day < now.getDate();
      html += '<span class="d' + (day === next.getDate() ? ' meet' : '') + (past ? ' past' : '') + '">' + day + '</span>';
    }
    cal.innerHTML = html;
    box.hidden = false;
    onView(cal, function () { cal.classList.add('mx-in'); });
  });

  /* ---------- Contact: copy email + envelope ---------- */
  $$('.mx-copy').forEach(function (btn) {
    var label = btn.querySelector('span'), orig = label.textContent;
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        btn.classList.add('mx-done'); label.textContent = 'Copied';
        setTimeout(function () { btn.classList.remove('mx-done'); label.textContent = orig; }, 2200);
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, function () {});
      else {
        var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        ta.remove();
      }
    });
  });
  $$('.mx-env').forEach(function (env) {
    onView(env, function () { setTimeout(function () { env.classList.add('mx-open'); }, 500); });
    env.addEventListener('pointerenter', function () {
      env.classList.remove('mx-open');
      setTimeout(function () { env.classList.add('mx-open'); }, 650);
    });
  });

  /* ---------- Scholarships: cap toss ---------- */
  $$('.mx-cap').forEach(function (cap) {
    if (reduce) return;
    cap.addEventListener('pointerenter', function () { cap.classList.add('mx-toss'); });
    cap.addEventListener('animationend', function (e) { if (e.animationName === 'mxToss') cap.classList.remove('mx-toss'); });
  });

  onScroll();
})();
