/* Next Day Movers — shared site behaviour */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---- Lead delivery (emailed via FormSubmit — no backend needed) ---- */
  var LEAD_ENDPOINT = 'https://formsubmit.co/ajax/nextdaymoversuk@gmail.com';
  function postLead(data) {
    return fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (j) { return !!j && (j.success === 'true' || j.success === true); })
      .catch(function () { return false; });
  }

  /* ---- Mobile nav ---- */
  function initNav() {
    var t = $('.nav-toggle');
    if (!t) return;
    t.addEventListener('click', function () { document.body.classList.toggle('menu-open'); });
    $$('.mobile-menu a').forEach(function (a) { a.addEventListener('click', function () { document.body.classList.remove('menu-open'); }); });
  }

  /* ---- Scroll reveal ---- */
  var revealObserver;
  function revealAll() { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }
  function initReveal() {
    if (!('IntersectionObserver' in window)) { revealAll(); return; }
    revealObserver = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el) { revealObserver.observe(el); });
    setTimeout(revealAll, 2600);
  }

  /* ---- Animated counter ---- */
  function initCounter() {
    var el = $('[data-counter]');
    if (!el) return;
    var target = Number(el.getAttribute('data-counter')) || 500;
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; io.disconnect();
      var t0 = performance.now();
      (function tick(t) {
        var p = Math.min(1, (t - t0) / 1400);
        var v = Math.round(target * (1 - Math.pow(1 - p, 3)));
        el.textContent = v >= target ? target + '+' : String(v);
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
    }, { threshold: 0.4 });
    io.observe(el);
  }

  /* ---- Quote estimate (home + quote page) ---- */
  function initQuote() {
    var form = $('#quoteForm');
    if (!form) return;
    var g = function (id) { return $('#' + id); };
    function range() {
      var p = g('qProperty').value, b = g('qBeds').value;
      if (p === 'van') return [90, 180];
      if (p === 'waste') return [120, 320];
      var base = { '0': [180, 280], '1': [260, 400], '2': [380, 560], '3': [540, 780], '4': [760, 1150] }[b];
      var m = p === 'office' ? 1.35 : p === 'flat' ? 0.95 : 1;
      return [Math.round(base[0] * m / 10) * 10, Math.round(base[1] * m / 10) * 10];
    }
    function refresh() {
      var submitted = g('quoteBtn').dataset.submitted === '1';
      var show = g('qFrom').value.trim().length > 2 || submitted;
      var box = g('estimateBox');
      if (show) { var r = range(); g('estimateVal').textContent = '£' + r[0] + ' – £' + r[1]; box.style.display = 'flex'; }
      else box.style.display = 'none';
    }
    ['qProperty', 'qBeds', 'qFrom', 'qTo', 'qName', 'qDate', 'qContact'].forEach(function (id) {
      var el = g(id); if (!el) return;
      el.addEventListener('input', refresh); el.addEventListener('change', refresh);
    });
    g('quoteBtn').addEventListener('click', function () {
      var btn = g('quoteBtn');
      if (btn.dataset.sending === '1' || btn.dataset.submitted === '1') return;
      var contact = g('qContact').value.trim();
      if (contact.length < 3) { g('qContact').focus(); return; }
      btn.dataset.sending = '1';
      var orig = btn.textContent;
      btn.textContent = 'Sending…';
      postLead({
        _subject: 'New quote request — Next Day Movers',
        _template: 'table', _captcha: 'false',
        Form: 'Instant quote',
        'Property type': g('qProperty').value,
        Bedrooms: g('qBeds').value,
        'Moving from': g('qFrom').value,
        'Moving to': g('qTo').value,
        'Moving date': g('qDate').value,
        Name: g('qName').value,
        'Phone or email': contact,
        'Estimated range': g('estimateVal') ? g('estimateVal').textContent : ''
      }).then(function (ok) {
        btn.dataset.sending = '';
        var th = g('quoteThanks');
        if (ok) {
          btn.dataset.submitted = '1';
          btn.textContent = 'Request received ✓';
          if (th) th.style.display = 'block';
        } else {
          btn.textContent = orig;
          if (th) { th.style.color = '#FB8A3C'; th.innerHTML = 'Sorry — that didn’t send. Please call <a href="tel:07777622437">07777 622437</a> or <a href="https://wa.me/447777622437">WhatsApp us</a>.'; th.style.display = 'block'; }
        }
        refresh();
      });
    });
  }

  /* ---- Reviews ---- */
  var baseReviews = [
    { name: 'Saul J Luboff', loc: 'Google review', text: 'These are the best service in the area! Top class professionalism and timeliness. Made our recent move an easy endeavour! Couldn’t thank the team enough.' },
    { name: 'Matt Bosly', loc: 'Google review', text: 'Brilliant service on all fronts. Quick response after requesting a quote via their website, the guys came the next day and did a great job. Careful and efficient, friendly and enthusiastic and at a great price. Highly highly recommend.' },
    { name: 'S Y', loc: 'Google review', text: 'Johnny and his colleagues are super friendly and helpful with the move! They are very careful with my furniture and taking care in case of hitting walls, wrapping up individually! They arrived on time and are super efficient! High recommended' },
    { name: 'Connor Webb', loc: 'Google review', text: 'Brilliant service from Next Day Movers! They helped me clear out a pile of garden waste and old furniture after a renovation project. Turned up exactly when they said they would, worked efficiently, and had everything cleared in no time. Friendly team, great communication, and very reasonably priced. Highly recommend!' },
    { name: 'Rusty Nart', loc: 'Google review', text: 'Contacted these boys and heard back from them immediately. Next day they removed all of the bits from my garden and front drive and had it looking brilliant. Would definitely recommend' },
    { name: 'Abby Hancock', loc: 'Google review', text: 'Had a brilliant service from Next Day Movers, they came and collected all the rubbish within 2 days, they were both so lovely and friendly nothing was too much hassle, they left the property clear and tidy after, would highly recommend' },
    { name: 'Sam Court', loc: 'Google review', text: 'Had some timber that needed removing — the boys done an excellent job. Asked them if they could help and on the same day they delivered. They were very polite and tidied up all mess, couldn’t fault them' }
  ];
  var reviewState = { idx: 0, user: [] };
  function allReviews() { return reviewState.user.concat(baseReviews); }
  function renderReviews() {
    var grid = $('#reviewsGrid'); if (!grid) return;
    var rv = allReviews();
    grid.innerHTML = [0, 1, 2].map(function (i) {
      var r = rv[(reviewState.idx + i) % rv.length];
      return '<figure class="review-card"><div class="stars">★★★★★</div>' +
        '<blockquote>“' + esc(r.text) + '”</blockquote>' +
        '<figcaption><span class="avatar">' + esc(r.name[0]) + '</span><span><span class="rv-name">' + esc(r.name) + '</span><span class="rv-loc">' + esc(r.loc) + '</span></span></figcaption></figure>';
    }).join('');
  }
  function initReviews() {
    if (!$('#reviewsGrid')) return;
    renderReviews();
    var prev = $('#prevReview'), next = $('#nextReview');
    if (prev) prev.addEventListener('click', function () { var n = allReviews().length; reviewState.idx = (reviewState.idx + n - 1) % n; renderReviews(); });
    if (next) next.addEventListener('click', function () { var n = allReviews().length; reviewState.idx = (reviewState.idx + 1) % n; renderReviews(); });
    // review submit
    var sp = $('#starPicker');
    if (sp) {
      var stars = 5;
      function renderStars() { sp.innerHTML = [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-star="' + n + '" style="color:' + (n <= stars ? 'var(--gold)' : '#D8D8D6') + '">★</button>'; }).join(''); }
      renderStars();
      sp.addEventListener('click', function (e) { var b = e.target.closest('[data-star]'); if (!b) return; stars = Number(b.dataset.star); renderStars(); });
      var btn = $('#submitReview');
      if (btn) btn.addEventListener('click', function () {
        var name = $('#revName').value.trim(), text = $('#revText').value.trim();
        if (!name || !text) return;
        reviewState.user.unshift({ name: name, loc: $('#revLoc').value.trim() || 'Verified customer', text: text });
        reviewState.idx = 0;
        $('#revForm').style.display = 'none';
        $('#revThanksName').textContent = 'Thank you, ' + name + '!';
        $('#revThanks').style.display = 'flex';
        renderReviews();
      });
    }
  }

  /* ---- FAQ ---- */
  function initFaq() {
    var list = $('#faqList'); if (!list) return;
    list.addEventListener('click', function (e) {
      var q = e.target.closest('.faq-q'); if (!q) return;
      var item = q.parentElement, open = item.classList.contains('open');
      $$('.faq-item.open', list).forEach(function (el) { el.classList.remove('open'); el.querySelector('.faq-mark').textContent = '+'; });
      if (!open) { item.classList.add('open'); q.querySelector('.faq-mark').textContent = '−'; }
    });
  }

  /* ---- Lightbox (gallery) ---- */
  function initLightbox() {
    var items = $$('[data-lightbox]');
    if (!items.length) return;
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = '<button class="lb-close" aria-label="Close">✕</button><button class="lb-nav lb-prev" aria-label="Previous">‹</button><img alt=""><button class="lb-nav lb-next" aria-label="Next">›</button>';
    document.body.appendChild(box);
    var img = box.querySelector('img'), cur = 0;
    var srcs = items.map(function (el) { return el.getAttribute('href') || el.getAttribute('data-full') || el.querySelector('img').src; });
    function show(i) { cur = (i + srcs.length) % srcs.length; img.src = srcs[cur]; box.classList.add('open'); }
    items.forEach(function (el, i) { el.addEventListener('click', function (e) { e.preventDefault(); show(i); }); });
    box.querySelector('.lb-close').addEventListener('click', function () { box.classList.remove('open'); });
    box.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(cur - 1); });
    box.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(cur + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) box.classList.remove('open'); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') box.classList.remove('open');
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  /* ---- Contact form ---- */
  function initContact() {
    var btn = $('#cSubmit');
    if (!btn) return;
    var g = function (id) { return $('#' + id); };
    btn.addEventListener('click', function () {
      if (btn.dataset.sending === '1') return;
      var name = g('cName').value.trim(), phone = g('cPhone').value.trim(), email = g('cEmail').value.trim();
      if (!name) { g('cName').focus(); return; }
      if (!phone && !email) { g('cPhone').focus(); return; }
      btn.dataset.sending = '1';
      var orig = btn.textContent;
      btn.textContent = 'Sending…';
      postLead({
        _subject: 'New contact message — Next Day Movers',
        _template: 'table', _captcha: 'false',
        Form: 'Contact page',
        Name: name, Phone: phone, Email: email,
        'Help with': g('cType').value, Message: g('cMsg').value
      }).then(function (ok) {
        btn.dataset.sending = '';
        var th = g('cThanks');
        if (ok) {
          var grid = $('#contactForm .q-grid'); if (grid) grid.style.display = 'none';
          btn.style.display = 'none';
          th.style.display = 'block';
        } else {
          btn.textContent = orig;
          th.style.color = '#FB8A3C';
          th.innerHTML = 'Sorry — that didn’t send. Please call <a href="tel:07777622437">07777 622437</a>.';
          th.style.display = 'block';
        }
      });
    });
  }

  function init() {
    initNav(); initReveal(); initCounter(); initQuote(); initReviews(); initFaq(); initLightbox(); initContact();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
