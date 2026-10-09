/* Next Day Movers — before/after comparison gallery (reusable, native, no deps).
   Reads slide data from a JSON block so image pairs are separate from logic.
   Mount point: #baCompare  ·  data: <script type="application/json" id="baData">[…]</script>
   Each slide: {id,title,category,before,after,beforeAlt,afterAlt,caption} */
(function () {
  'use strict';
  var mount = document.getElementById('baCompare');
  if (!mount) return;
  var slides = window.NDM_BA;
  if (!slides) { var dataEl = document.getElementById('baData'); if (dataEl) { try { slides = JSON.parse(dataEl.textContent); } catch (e) {} } }
  if (!Array.isArray(slides) || !slides.length) return;

  var idx = 0, pos = 50; // pos = handle position %, 0=all after, 100=all before

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  mount.className = 'ba-wrap ba-reveal';
  mount.innerHTML =
    '<div class="ba-figbox">' +
      '<div class="ba-fallback"></div>' +
      '<figure class="ba-fig" id="baFig">' +
        '<img class="ba-before-img" alt="">' +
        '<div class="ba-after"><img class="ba-after-img" alt=""></div>' +
        '<span class="ba-tag before">Before</span><span class="ba-tag after">After</span>' +
        '<div class="ba-divider"></div>' +
        '<button type="button" class="ba-handle" role="slider" aria-label="Drag to compare before and after" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/></svg>' +
        '</button>' +
      '</figure>' +
    '</div>' +
    '<p class="ba-cap" id="baCap"></p>' +
    (slides.length > 1 ?
      '<div class="ba-nav"><button type="button" class="ba-arrow" id="baPrev" aria-label="Previous example"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>' +
      '<div class="ba-dots" id="baDots" role="tablist"></div>' +
      '<button type="button" class="ba-arrow" id="baNext" aria-label="Next example"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button></div>' : '');

  var figbox = mount.querySelector('.ba-figbox');
  var fig = mount.querySelector('#baFig');
  var beforeImg = mount.querySelector('.ba-before-img');
  var afterImg = mount.querySelector('.ba-after-img');
  var afterWrap = mount.querySelector('.ba-after');
  var divider = mount.querySelector('.ba-divider');
  var handle = mount.querySelector('.ba-handle');
  var cap = mount.querySelector('#baCap');
  var fallback = mount.querySelector('.ba-fallback');

  function apply() {
    afterWrap.style.clipPath = 'inset(0 0 0 ' + pos + '%)';
    divider.style.left = pos + '%';
    handle.style.left = pos + '%';
    handle.setAttribute('aria-valuenow', Math.round(pos));
  }
  function setPos(p) { pos = Math.max(0, Math.min(100, p)); apply(); }

  function loadSlide(i) {
    var s = slides[i]; if (!s) return;
    figbox.classList.remove('failed');
    var loaded = 0, failed = false;
    function done() { loaded++; }
    function fail() { failed = true; figbox.classList.add('failed'); fallback.textContent = s.title + ' — image unavailable'; }
    beforeImg.onload = done; afterImg.onload = done;
    beforeImg.onerror = fail; afterImg.onerror = fail;
    beforeImg.alt = s.beforeAlt || (s.title + ' before clearance');
    afterImg.alt = s.afterAlt || (s.title + ' after clearance');
    beforeImg.src = s.before; afterImg.src = s.after;
    cap.innerHTML = '<strong>' + esc(s.title) + '</strong>' + (s.caption ? ' — ' + esc(s.caption) : '');
    pos = 50; apply();
    if (dots) Array.prototype.forEach.call(dots.children, function (d, di) { d.classList.toggle('on', di === i); d.setAttribute('aria-selected', di === i ? 'true' : 'false'); });
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === slides.length - 1;
  }

  // gallery nav (separate from the drag handle — no figure-swipe, so no conflict)
  var prev = mount.querySelector('#baPrev'), next = mount.querySelector('#baNext'), dots = mount.querySelector('#baDots');
  if (dots) {
    slides.forEach(function (s, i) {
      var b = document.createElement('button');
      b.className = 'ba-dot'; b.type = 'button'; b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', s.title); b.addEventListener('click', function () { idx = i; loadSlide(idx); });
      dots.appendChild(b);
    });
  }
  if (prev) prev.addEventListener('click', function () { if (idx > 0) { idx--; loadSlide(idx); } });
  if (next) next.addEventListener('click', function () { if (idx < slides.length - 1) { idx++; loadSlide(idx); } });

  // drag (pointer events = mouse + touch unified)
  var dragging = false;
  function posFromEvent(clientX) {
    var r = fig.getBoundingClientRect();
    setPos(((clientX - r.left) / r.width) * 100);
  }
  function start(e) { dragging = true; try { handle.setPointerCapture(e.pointerId); } catch (x) {} posFromEvent(e.clientX); e.preventDefault(); }
  function move(e) { if (!dragging) return; posFromEvent(e.clientX); e.preventDefault(); }
  function end() { dragging = false; }
  // allow grabbing anywhere on the figure, and dragging via the handle
  fig.addEventListener('pointerdown', start);
  handle.addEventListener('pointerdown', start);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
  // keyboard
  handle.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { setPos(pos - 3); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { setPos(pos + 3); e.preventDefault(); }
    else if (e.key === 'Home') { setPos(0); e.preventDefault(); }
    else if (e.key === 'End') { setPos(100); e.preventDefault(); }
  });

  // waste-quote CTA: on the quote page, preselect Waste in-place; elsewhere follow the link
  var cta = document.getElementById('baCta');
  if (cta) cta.addEventListener('click', function (e) {
    if (typeof window.NDMStartQuote === 'function') {
      e.preventDefault(); window.NDMStartQuote('waste');
      var app = document.getElementById('quoteApp'); if (app) app.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // entrance animation (respects reduced-motion via CSS)
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { mount.classList.add('ba-in'); io.disconnect(); } }); }, { threshold: 0.15 });
    io.observe(mount);
  } else { mount.classList.add('ba-in'); }

  loadSlide(0);
})();
