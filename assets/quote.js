/* Next Day Movers — instant quote engine (4 service journeys)
   Pure static, no backend. Pricing reused verbatim from the site pricing sheet
   (mirrors range()/surcharge() in site.js — keep the two in sync).
   No-photo submissions go via FormSubmit AJAX (JSON, inline confirmation);
   photo submissions go via a real multipart form POST so images arrive as email
   attachments (full-page redirect to the thank-you anchor). */
(function () {
  'use strict';
  var root = document.getElementById('quoteApp');
  if (!root) return;

  var LEAD_EMAIL = 'nextdaymoversuk@gmail.com';
  var AJAX_ENDPOINT = 'https://formsubmit.co/ajax/' + LEAD_EMAIL;
  var FORM_ENDPOINT = 'https://formsubmit.co/' + LEAD_EMAIL;
  var WHATSAPP = 'https://wa.me/447777622437';
  var TEL = '07777622437';
  var MAX_FILE_MB = 4, MAX_FILES = 6, MAX_TOTAL_MB = 9; // FormSubmit attachment headroom

  /* ---------- pricing (identical to site.js range()/surcharge) ---------- */
  var servedAreas = { E:1,EC:1,N:1,NW:1,SE:1,SW:1,W:1,WC:1, BR:1,CR:1,DA:1,EN:1,HA:1,IG:1,KT:1,RM:1,SM:1,TW:1,UB:1,WD:1, ME:1,CT:1,TN:1, GU:1,RH:1, BN:1, SS:1,CM:1,CO:1, SL:1,RG:1,HP:1,AL:1,SG:1,LU:1,MK:1 };
  function outOfArea(pc) {
    var m = (pc || '').toUpperCase().replace(/\s+/g, '').match(/^([A-Z]{1,2})[0-9]/);
    if (!m) return false;
    return !servedAreas[m[1]];
  }
  var PER_MILE = 1, FREE_MILES = 20;
  // base bands by bedroom index 0..4 (studio..4+), as per the pricing sheet
  var BEDS_BASE = { 0:[250,400], 1:[300,500], 2:[500,750], 3:[750,1200], 4:[1200,2000] };
  function band(bi, mult) {
    var b = BEDS_BASE[bi] || BEDS_BASE[2];
    return [Math.round(b[0] * mult / 10) * 10, Math.round(b[1] * mult / 10) * 10];
  }
  // returns {range:[lo,hi]|null, mode:'firm'|'guide'} — guide = coarse, team confirms
  function priceRange(s) {
    if (s.service === 'single') return { range: [120, 300], mode: 'guide' };
    if (s.service === 'waste')  return { range: [120, 320], mode: 'guide' };
    if (s.service === 'house') {
      var bi = s.bedrooms == null ? 2 : Math.min(+s.bedrooms, 4);
      var flat = (s.propertyType === 'flat' || s.propertyType === 'maisonette');
      return { range: band(bi, flat ? 0.95 : 1), mode: 'firm' };
    }
    if (s.service === 'office') {
      var map = { small: 2, large: 4, retail: 3, commercial: 3, other: 2 };
      var obi = map[s.premises] != null ? map[s.premises] : 2;
      return { range: band(obi, 1.35), mode: 'guide' };
    }
    return { range: null, mode: 'guide' };
  }
  function surcharge(miles) { return (miles != null && miles > FREE_MILES) ? Math.round((miles - FREE_MILES) * PER_MILE) : 0; }

  /* ---------- distance via postcodes.io (reused) ---------- */
  function outcodeOf(pc) { pc = (pc || '').toUpperCase().replace(/\s+/g, ''); if (pc.length < 2) return ''; return pc.length > 3 ? pc.slice(0, -3) : pc; }
  function fetchCoords(oc) {
    return fetch('https://api.postcodes.io/outcodes/' + encodeURIComponent(oc))
      .then(function (r) { return r.json(); })
      .then(function (j) { return (j && j.result && typeof j.result.latitude === 'number') ? { lat: j.result.latitude, lon: j.result.longitude } : null; })
      .catch(function () { return null; });
  }
  function milesBetween(a, b) {
    var R = 3958.8, t = Math.PI / 180, dLat = (b.lat - a.lat) * t, dLon = (b.lon - a.lon) * t, la1 = a.lat * t, la2 = b.lat * t;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function emailOk(v) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); }
  function phoneOk(v) { return (v || '').replace(/[^\d]/g, '').length >= 7; }

  // selectable card group: returns markup; value read from [data-field].dataset.value
  function cards(field, opts, current) {
    return '<div class="q-cards" role="radiogroup" data-field="' + field + '" data-value="' + esc(current || '') + '">' +
      opts.map(function (o) {
        var sel = current === o.v ? ' selected' : '';
        return '<button type="button" class="q-card' + sel + '" role="radio" aria-checked="' + (sel ? 'true' : 'false') + '" data-v="' + esc(o.v) + '">' +
          (o.icon ? '<span class="q-ic" aria-hidden="true">' + o.icon + '</span>' : '') +
          '<span class="q-card-l">' + esc(o.l) + '</span>' +
          (o.sub ? '<span class="q-card-s">' + esc(o.sub) + '</span>' : '') + '</button>';
      }).join('') + '</div>';
  }
  function field(label, inner) { return '<label class="q-field"><span class="q-lab">' + esc(label) + '</span>' + inner + '</label>'; }
  function select(id, opts, cur) {
    return '<select id="' + id + '">' + opts.map(function (o) {
      return '<option value="' + esc(o.v) + '"' + (cur === o.v ? ' selected' : '') + '>' + esc(o.l) + '</option>';
    }).join('') + '</select>';
  }
  function textInput(id, ph, cur, type) { return '<input id="' + id + '" type="' + (type || 'text') + '" placeholder="' + esc(ph || '') + '" value="' + esc(cur || '') + '">'; }

  var BED_OPTS = [{ v: '0', l: 'Studio' }, { v: '1', l: '1 bedroom' }, { v: '2', l: '2 bedrooms' }, { v: '3', l: '3 bedrooms' }, { v: '4', l: '4 bedrooms' }, { v: '5', l: '5+ bedrooms' }];
  var FLOOR_OPTS = [{ v: 'ground', l: 'Ground floor' }, { v: '1', l: '1st floor' }, { v: '2', l: '2nd floor' }, { v: '3', l: '3rd floor' }, { v: '4+', l: '4th floor or higher' }];
  var YN = [{ v: 'yes', l: 'Yes' }, { v: 'no', l: 'No' }];

  /* ---------- service definitions ---------- */
  var SERVICES = {
    house:  { label: 'House Removals', sub: 'Moving to a new home? Get an estimate based on your property and move.', icon: svgHouse() },
    office: { label: 'Office Removals', sub: 'Moving your office, workplace or business premises?', icon: svgOffice() },
    single: { label: 'Single Item Removal', sub: 'Moving a sofa, bed, appliance or another bulky item?', icon: svgVan() },
    waste:  { label: 'Waste Removals', sub: 'Clear household waste, furniture, timber, rubble and more.', icon: svgWaste() }
  };

  // Each flow = array of steps. Step: {title, render(s)->html, read(s)->errorString|null, photos?:true}
  var FLOWS = {
    house: [
      { title: 'About the property', render: function (s) {
        return '<p class="q-q">What type of property are you moving from?</p>' +
          cards('propertyType', [{ v: 'house', l: 'House' }, { v: 'flat', l: 'Flat / apartment' }, { v: 'bungalow', l: 'Bungalow' }, { v: 'maisonette', l: 'Maisonette' }, { v: 'other', l: 'Other' }], s.propertyType) +
          '<p class="q-q">How many bedrooms?</p>' + cards('bedrooms', BED_OPTS, s.bedrooms) +
          '<p class="q-q">How furnished is it?</p>' + cards('furnished', [{ v: 'full', l: 'Fully furnished' }, { v: 'part', l: 'Partially' }, { v: 'empty', l: 'Mostly empty' }], s.furnished);
      }, read: function (s) { if (!s.propertyType) return 'Please choose a property type.'; if (s.bedrooms == null) return 'Please choose the number of bedrooms.'; return null; } },
      { title: 'Access', render: function (s) {
        var isFlat = (s.propertyType === 'flat' || s.propertyType === 'maisonette');
        if (isFlat) {
          return field('Which floor is the property on?', select('fFloor', FLOOR_OPTS, s.fFloor)) +
            '<p class="q-q">Is there a lift?</p>' + cards('lift', YN, s.lift) +
            field('Any stairs or access restrictions we should know about? (optional)', textInput('fAccess', 'e.g. narrow staircase, long carry', s.fAccess));
        }
        return '<p class="q-q">Is there convenient parking near the property?</p>' + cards('parking', YN, s.parking) +
          field('Any unusual access restrictions? (optional)', textInput('fAccess', 'e.g. narrow road, gravel drive', s.fAccess));
      }, read: function (s) {
        var isFlat = (s.propertyType === 'flat' || s.propertyType === 'maisonette');
        if (isFlat && !s.lift) return 'Please tell us if there is a lift.';
        if (!isFlat && !s.parking) return 'Please tell us about parking.';
        return null;
      } },
      routeStep(),
      { title: 'Anything extra?', render: function (s) {
        return '<p class="q-q">Do you need any of these? (optional)</p>' +
          multi('extras', [{ v: 'packing', l: 'Packing help' }, { v: 'dismantle', l: 'Furniture dismantling / reassembly' }, { v: 'heavy', l: 'Heavy / bulky items' }, { v: 'storage', l: 'Storage' }], s.extras) +
          field('Anything else we should know? (optional)', '<textarea id="notes" rows="3" placeholder="Bulky items, fragile pieces, timings…">' + esc(s.notes || '') + '</textarea>');
      }, read: function () { return null; } },
      contactStep()
    ],
    office: [
      { title: 'About the business', render: function (s) {
        return field('Business / company name', textInput('company', 'Company name', s.company)) +
          '<p class="q-q">Type of premises</p>' + cards('premises', [{ v: 'small', l: 'Small office' }, { v: 'large', l: 'Large office' }, { v: 'retail', l: 'Retail premises' }, { v: 'commercial', l: 'Commercial unit' }, { v: 'other', l: 'Other' }], s.premises) +
          field('Approx. people / workstations moving', select('workstations', [{ v: '1-5', l: '1–5' }, { v: '6-15', l: '6–15' }, { v: '16-30', l: '16–30' }, { v: '31-60', l: '31–60' }, { v: '60+', l: '60+' }], s.workstations));
      }, read: function (s) { if (!s.premises) return 'Please choose the type of premises.'; return null; } },
      { title: 'What’s moving?', render: function (s) {
        return '<p class="q-q">Select what’s involved (optional)</p>' +
          multi('equip', [{ v: 'desks', l: 'Desks & chairs' }, { v: 'tech', l: 'Computers & monitors' }, { v: 'filing', l: 'Filing & storage' }, { v: 'meeting', l: 'Meeting-room furniture' }, { v: 'shelving', l: 'Shelving & stock' }, { v: 'specialist', l: 'Heavy / specialist equipment' }], s.equip);
      }, read: function () { return null; } },
      { title: 'Locations & access', render: function (s) {
        return routeFields(s) +
          field('Current floor', select('fFloor', FLOOR_OPTS, s.fFloor)) +
          field('Destination floor', select('tFloor', FLOOR_OPTS, s.tFloor)) +
          '<p class="q-q">Lift at both locations?</p>' + cards('lift', [{ v: 'both', l: 'Both' }, { v: 'one', l: 'One' }, { v: 'none', l: 'Neither' }], s.lift) +
          '<p class="q-q">Does the move need to be out-of-hours / weekend?</p>' + cards('ooh', YN, s.ooh);
      }, read: routeRead },
      { title: 'Timing', render: function (s) {
        return field('Preferred moving date', textInput('date', '', s.date, 'date')) +
          '<p class="q-q">Packing & dismantling needed?</p>' + cards('officePack', YN, s.officePack) +
          field('Any time constraints or special requirements? (optional)', '<textarea id="notes" rows="3" placeholder="e.g. must complete over one weekend">' + esc(s.notes || '') + '</textarea>');
      }, read: function () { return null; } },
      contactStep(true)
    ],
    single: [
      { title: 'What needs moving?', render: function (s) {
        return '<p class="q-q">Choose the item</p>' +
          cards('item', [{ v: 'sofa', l: 'Sofa' }, { v: 'bed', l: 'Bed / mattress' }, { v: 'wardrobe', l: 'Wardrobe' }, { v: 'appliance', l: 'Fridge / washing machine' }, { v: 'table', l: 'Table / desk' }, { v: 'furniture', l: 'Other furniture' }, { v: 'multiple', l: 'Multiple bulky items' }, { v: 'other', l: 'Other' }], s.item) +
          '<div id="itemOther"' + (s.item === 'other' ? '' : ' hidden') + '>' + field('Tell us what it is', textInput('itemText', 'e.g. piano, treadmill', s.itemText)) + '</div>' +
          field('How many items?', select('qty', [{ v: '1', l: '1' }, { v: '2-3', l: '2–3' }, { v: '4+', l: '4+' }], s.qty)) +
          field('Rough size / dimensions (optional)', textInput('size', 'e.g. 3-seater, king size', s.size));
      }, read: function (s) { if (!s.item) return 'Please choose what needs moving.'; if (s.item === 'other' && !(s.itemText || '').trim()) return 'Please describe the item.'; return null; } },
      { title: 'Collection & delivery', render: function (s) {
        return routeFields(s) +
          field('Collection floor', select('fFloor', FLOOR_OPTS, s.fFloor)) +
          field('Delivery floor', select('tFloor', FLOOR_OPTS, s.tFloor)) +
          '<p class="q-q">Lift available where needed?</p>' + cards('lift', [{ v: 'yes', l: 'Yes' }, { v: 'no', l: 'No' }, { v: 'na', l: 'Ground only' }], s.lift) +
          '<p class="q-q">Does it need dismantling?</p>' + cards('dismantle', YN, s.dismantle) +
          field('Preferred collection date', textInput('date', '', s.date, 'date'));
      }, read: routeRead },
      photoStep('Show us the item', 'A quick photo helps us confirm size, access and the right van.'),
      contactStep()
    ],
    waste: [
      { title: 'Type of waste', render: function (s) {
        return '<p class="q-q">What type of waste do you have? (select any that apply)</p>' +
          multi('wasteTypes', [
            { v: 'domestic', l: 'Domestic waste', sub: 'Everyday household waste' },
            { v: 'household', l: 'House / household clearance', sub: 'Rooms or a full property' },
            { v: 'wood', l: 'Wood / timber' },
            { v: 'hardcore', l: 'Hardcore / rubble', sub: 'Bricks, concrete, tiles, soil' },
            { v: 'mixed', l: 'Mixed waste' },
            { v: 'furniture', l: 'Furniture & bulky items', sub: 'Sofas, mattresses, wardrobes' }
          ], s.wasteTypes) +
          field('Briefly describe the waste (optional)', '<textarea id="wasteNote" rows="2" placeholder="e.g. broken furniture + bagged garden waste; mostly clean timber">' + esc(s.wasteNote || '') + '</textarea>');
      }, read: function (s) { if (!s.wasteTypes || !s.wasteTypes.length) return 'Please choose at least one waste type.'; return null; } },
      { title: 'How much is there?', render: function (s) {
        return '<p class="q-q">Estimate the volume</p>' +
          cards('volume', [
            { v: 'bags', l: 'A few bags' }, { v: 'small', l: 'A small pile' }, { v: 'quarter', l: '¼ van load' },
            { v: 'half', l: '½ van load' }, { v: 'threeq', l: '¾ van load' }, { v: 'full', l: 'Full van load' },
            { v: 'multi', l: 'Multiple loads' }, { v: 'unsure', l: 'Not sure' }
          ], s.volume);
      }, read: function (s) { if (!s.volume) return 'Please estimate the volume.'; return null; } },
      photoStep('Upload photos of your waste', 'Photos help us judge volume, waste type and access, so we can give a more accurate estimate.', true),
      { title: 'Collection details', render: function (s) {
        return field('Collection postcode', textInput('from', 'e.g. BR1 3AA', s.from)) +
          '<p class="q-q">Where is the waste?</p>' + cards('location', [{ v: 'inside', l: 'Inside the property' }, { v: 'garden', l: 'Garden / driveway' }, { v: 'garage', l: 'Garage / shed' }, { v: 'commercial', l: 'Commercial premises' }, { v: 'other', l: 'Other' }], s.location) +
          '<p class="q-q">Is there vehicle access close to the waste?</p>' + cards('vehAccess', YN, s.vehAccess) +
          '<p class="q-q">Any stairs involved?</p>' + cards('stairs', YN, s.stairs) +
          field('Preferred collection date', textInput('date', '', s.date, 'date'));
      }, read: function (s) { if (!(s.from || '').trim()) return 'Please enter the collection postcode.'; if (outOfArea(s.from)) return 'Sorry — we cover London, Kent, Surrey and the near South East. That postcode looks outside our area.'; if (!s.location) return 'Please tell us where the waste is.'; return null; } },
      contactStep()
    ]
  };

  /* shared step factories */
  function routeStep() {
    return { title: 'Where to & when', render: function (s) {
      return routeFields(s) +
        field('Moving date', textInput('date', '', s.date, 'date')) +
        '<p class="q-q">Is the date flexible?</p>' + cards('flexible', YN, s.flexible);
    }, read: routeRead };
  }
  function routeFields(s) {
    return field('Moving from (postcode)', textInput('from', 'e.g. BR1 3AA', s.from)) +
      field('Moving to (postcode)', textInput('to', 'e.g. DA1 2BQ', s.to));
  }
  function routeRead(s) {
    if (!(s.from || '').trim()) return 'Please enter the collection postcode.';
    if (!(s.to || '').trim()) return 'Please enter the destination postcode.';
    if (outOfArea(s.from)) return 'Sorry — we only take moves starting in London, Kent, Surrey and the near South East. That start postcode looks outside our area.';
    return null;
  }
  function photoStep(title, sub, encourage) {
    return { title: title, photos: true, render: function () {
      return '<p class="q-sub">' + esc(sub) + '</p>' +
        '<div class="q-upload" id="uploader">' +
        '<label class="q-upbtn"><input type="file" id="photoInput" name="attachment" accept="image/*" multiple>' +
        '<span>' + (encourage ? '📷 Add photos' : '📷 Add a photo (optional)') + '</span></label>' +
        '<div class="q-previews" id="previews"></div>' +
        '<p class="q-uphint">JPG/PNG/HEIC · up to ' + MAX_FILES + ' photos · ' + MAX_FILE_MB + 'MB each. Optional but it speeds up your quote.</p>' +
        '<p class="q-uperr" id="upErr" role="alert" hidden></p></div>';
    }, read: function () { return null; } };
  }
  function contactStep(workEmail) {
    return { title: 'Your details', render: function (s) {
      return field('Full name', textInput('name', 'Your name', s.name)) +
        field(workEmail ? 'Work email' : 'Email', textInput('email', 'you@email.com', s.email, 'email')) +
        field('UK mobile', textInput('phone', 'So we can confirm your price', s.phone, 'tel')) +
        '<p class="q-q">Preferred contact</p>' + cards('prefer', [{ v: 'phone', l: 'Phone' }, { v: 'email', l: 'Email' }, { v: 'wa', l: 'WhatsApp' }], s.prefer) +
        '<label class="q-consent"><input type="checkbox" id="consent"' + (s.consent ? ' checked' : '') + '> I agree to be contacted about my enquiry. <a href="/privacy" target="_blank" rel="noopener">Privacy</a></label>';
    }, read: function (s) {
      if (!(s.name || '').trim()) return 'Please enter your name.';
      if (!emailOk(s.email)) return 'Please enter a valid email address.';
      if (!phoneOk(s.phone)) return 'Please enter a valid phone number.';
      if (!s.consent) return 'Please tick the box so we can contact you about your quote.';
      return null;
    } };
  }

  // multi-select card group (checkbox semantics). value stored as array in state.
  function multi(field, opts, current) {
    current = current || [];
    return '<div class="q-cards q-multi" data-multi="' + field + '">' + opts.map(function (o) {
      var sel = current.indexOf(o.v) > -1 ? ' selected' : '';
      return '<button type="button" class="q-card' + sel + '" role="checkbox" aria-checked="' + (sel ? 'true' : 'false') + '" data-v="' + esc(o.v) + '">' +
        '<span class="q-card-l">' + esc(o.l) + '</span>' + (o.sub ? '<span class="q-card-s">' + esc(o.sub) + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  }

  /* ---------- state + render ---------- */
  var state = {};
  var stepIdx = 0;
  var distMiles = null, distKey = null, distTimer = null, sending = false;

  function currentFlow() { return FLOWS[state.service] || []; }

  function reduceState() {
    // read all inputs/cards in the current step DOM into state
    var stepEl = root.querySelector('.q-step-body');
    if (!stepEl) return;
    stepEl.querySelectorAll('[data-field]').forEach(function (g) { state[g.getAttribute('data-field')] = g.getAttribute('data-value') || ''; });
    stepEl.querySelectorAll('[data-multi]').forEach(function (g) {
      var f = g.getAttribute('data-multi');
      state[f] = Array.prototype.slice.call(g.querySelectorAll('.q-card.selected')).map(function (b) { return b.getAttribute('data-v'); });
    });
    stepEl.querySelectorAll('input[id],select[id],textarea[id]').forEach(function (i) {
      if (i.type === 'checkbox') { state[i.id] = i.checked; }
      else if (i.type === 'file') { /* handled separately */ }
      else { state[i.id] = i.value; }
    });
  }

  function render() {
    if (!state.service) { renderPicker(); return; }
    var flow = currentFlow();
    var step = flow[stepIdx];
    var pct = Math.round(((stepIdx + 1) / flow.length) * 100);
    root.innerHTML = '';
    var wrap = el('<div class="q-app">' +
      '<div class="q-top"><button type="button" class="q-change" id="qChange">‹ ' + esc(SERVICES[state.service].label) + ' — change</button>' +
      '<div class="q-prog"><div class="q-prog-bar" style="width:' + pct + '%"></div></div>' +
      '<div class="q-prog-txt">Step ' + (stepIdx + 1) + ' of ' + flow.length + '</div></div>' +
      '<h2 class="q-step-title">' + esc(step.title) + '</h2>' +
      '<div class="q-step-body">' + step.render(state) + '</div>' +
      '<p class="q-err" id="qErr" role="alert" hidden></p>' +
      '<div class="q-nav">' + (stepIdx > 0 ? '<button type="button" class="btn q-back" id="qBack">Back</button>' : '<span></span>') +
      '<button type="button" class="btn btn-primary q-next" id="qNext">' + (stepIdx === flow.length - 1 ? 'See my estimate →' : 'Continue →') + '</button></div>' +
      estimatePanel() + '</div>');
    root.appendChild(wrap);
    bindStep(step);
  }

  function renderPicker() {
    root.innerHTML = '';
    var grid = '<div class="q-picker"><div class="q-svc-grid">' + Object.keys(SERVICES).map(function (k) {
      var s = SERVICES[k];
      return '<button type="button" class="q-svc" data-svc="' + k + '"><span class="q-svc-ic" aria-hidden="true">' + s.icon + '</span>' +
        '<span class="q-svc-l">' + esc(s.label) + '</span><span class="q-svc-s">' + esc(s.sub) + '</span></button>';
    }).join('') + '</div></div>';
    root.appendChild(el(grid));
    root.querySelectorAll('.q-svc').forEach(function (b) {
      b.addEventListener('click', function () { startService(b.getAttribute('data-svc')); });
    });
  }

  function startService(svc) { state = { service: svc }; stepIdx = 0; distMiles = null; distKey = null; if (window.NDMtrack) window.NDMtrack('quote_start', { service: svc }); render(); focusFirst(); }
  window.NDMStartQuote = startService; // lets the before/after CTA preselect a service in-place

  function estimatePanel() {
    var pr = priceRange(state), sc = surcharge(distMiles), out = '';
    var disclaimer = 'This is an estimate, not a confirmed booking. We’ll review your details' + (state.service === 'waste' || state.service === 'office' ? ' and photos' : '') + ' and confirm your fixed price.';
    if (pr.range) {
      var lo = pr.range[0] + sc, hi = pr.range[1] + sc;
      out = '<div class="q-est-val">£' + lo + ' – £' + hi + '</div>' +
        (distMiles != null && distMiles > FREE_MILES ? '<div class="q-est-note">Approx ' + Math.round(distMiles) + ' miles · includes £' + sc + ' long-distance</div>' : (distMiles != null ? '<div class="q-est-note">Local move</div>' : '')) +
        (pr.mode === 'guide' ? '<div class="q-est-note">Guide price — final cost confirmed after we review your details.</div>' : '');
    } else {
      out = '<div class="q-est-val q-est-tbc">We’ll confirm your price</div><div class="q-est-note">Tell us a little more and our team will review it.</div>';
    }
    return '<div class="q-est" id="qEst"><div class="q-est-h">Your estimated quote</div>' + out + '<p class="q-est-dis">' + disclaimer + '</p></div>';
  }

  function focusFirst() { var f = root.querySelector('.q-step-body button, .q-step-body input, .q-step-body select, .q-step-body textarea'); if (f) try { f.focus(); } catch (e) {} }

  function bindStep(step) {
    // single-select cards
    root.querySelectorAll('.q-cards:not(.q-multi)').forEach(function (g) {
      g.querySelectorAll('.q-card').forEach(function (b) {
        b.addEventListener('click', function () {
          g.querySelectorAll('.q-card').forEach(function (x) { x.classList.remove('selected'); x.setAttribute('aria-checked', 'false'); });
          b.classList.add('selected'); b.setAttribute('aria-checked', 'true');
          g.setAttribute('data-value', b.getAttribute('data-v'));
          onCardChange(g.getAttribute('data-field'), b.getAttribute('data-v'));
        });
      });
    });
    // multi-select cards
    root.querySelectorAll('.q-multi').forEach(function (g) {
      g.querySelectorAll('.q-card').forEach(function (b) {
        b.addEventListener('click', function () {
          var on = b.classList.toggle('selected'); b.setAttribute('aria-checked', on ? 'true' : 'false');
        });
      });
    });
    // live estimate + distance on relevant inputs
    root.querySelectorAll('#from, #to').forEach(function (i) { i.addEventListener('input', function () { reduceState(); scheduleDistance(); }); });
    root.querySelectorAll('#itemText').forEach(function () {});
    var otherWrap = root.querySelector('#itemOther');
    if (otherWrap) {
      var itemGrp = root.querySelector('[data-field="item"]');
      if (itemGrp) itemGrp.addEventListener('click', function () { otherWrap.hidden = itemGrp.getAttribute('data-value') !== 'other'; });
    }
    if (step.photos) bindUploader();
    var back = root.querySelector('#qBack'); if (back) back.addEventListener('click', function () { reduceState(); stepIdx--; render(); focusFirst(); });
    root.querySelector('#qNext').addEventListener('click', onNext);
    var ch = root.querySelector('#qChange'); if (ch) ch.addEventListener('click', function () { reduceState(); state = {}; stepIdx = 0; render(); });
    refreshEstimate();
  }

  function onCardChange(f, v) {
    state[f] = v;
    if (f === 'propertyType') { /* access step depends on it, re-render handled on Next */ }
    refreshEstimate();
  }

  function scheduleDistance() {
    var fo = outcodeOf(state.from), to = outcodeOf(state.to), key = fo + '>' + to;
    if (key === distKey) return;
    if (!fo || !to) { distMiles = null; distKey = key; refreshEstimate(); return; }
    if (fo === to) { distMiles = 0; distKey = key; refreshEstimate(); return; }
    clearTimeout(distTimer);
    distTimer = setTimeout(function () {
      distKey = key;
      Promise.all([fetchCoords(fo), fetchCoords(to)]).then(function (r) {
        if (r[0] && r[1]) distMiles = Math.round(milesBetween(r[0], r[1]) * 1.3); else distMiles = null;
        refreshEstimate();
      });
    }, 500);
  }

  function refreshEstimate() {
    var est = root.querySelector('#qEst');
    if (est) { var fresh = el(estimatePanel()); est.replaceWith(fresh); }
  }

  /* ---------- uploader ---------- */
  function bindUploader() {
    var input = root.querySelector('#photoInput'), prev = root.querySelector('#previews'), err = root.querySelector('#upErr');
    if (!input) return;
    input.addEventListener('change', function () {
      var files = Array.prototype.slice.call(input.files), keep = [], total = 0, msg = '';
      files.forEach(function (f) {
        if (!/^image\//.test(f.type) && !/\.(jpe?g|png|heic|webp)$/i.test(f.name)) { msg = 'Only image files are allowed.'; return; }
        if (f.size > MAX_FILE_MB * 1024 * 1024) { msg = f.name + ' is over ' + MAX_FILE_MB + 'MB.'; return; }
        keep.push(f);
      });
      if (keep.length > MAX_FILES) { keep = keep.slice(0, MAX_FILES); msg = 'Up to ' + MAX_FILES + ' photos.'; }
      keep.forEach(function (f) { total += f.size; });
      if (total > MAX_TOTAL_MB * 1024 * 1024) { msg = 'Total photos must be under ' + MAX_TOTAL_MB + 'MB — remove one or two.'; }
      // rebuild FileList from kept files (keeps native multipart submit working)
      try { var dt = new DataTransfer(); keep.forEach(function (f) { dt.items.add(f); }); input.files = dt.files; } catch (e) {}
      renderPreviews(input, prev);
      err.hidden = !msg; err.textContent = msg;
    });
  }
  function renderPreviews(input, prev) {
    prev.innerHTML = '';
    Array.prototype.slice.call(input.files).forEach(function (f, idx) {
      var url = URL.createObjectURL(f);
      var card = el('<div class="q-prev"><img alt="' + esc(f.name) + '" src="' + url + '"><button type="button" class="q-prev-x" aria-label="Remove ' + esc(f.name) + '" data-i="' + idx + '">×</button></div>');
      card.querySelector('img').addEventListener('load', function () { URL.revokeObjectURL(url); });
      card.querySelector('.q-prev-x').addEventListener('click', function () {
        var files = Array.prototype.slice.call(input.files); files.splice(idx, 1);
        try { var dt = new DataTransfer(); files.forEach(function (x) { dt.items.add(x); }); input.files = dt.files; } catch (e) {}
        renderPreviews(input, prev);
      });
      prev.appendChild(card);
    });
  }
  function hasPhotos() { var i = root.querySelector('#photoInput'); return !!(i && i.files && i.files.length); }
  // photos may have been added on an earlier step; stash the input element so submit can use it
  var stashedPhotoInput = null;

  /* ---------- navigation / submit ---------- */
  function onNext() {
    reduceState();
    var flow = currentFlow(), step = flow[stepIdx], errEl = root.querySelector('#qErr');
    var e = step.read ? step.read(state) : null;
    if (e) { errEl.hidden = false; errEl.textContent = e; var bad = root.querySelector('.q-step-body input, .q-step-body select'); if (bad) try { bad.focus(); } catch (x) {} return; }
    errEl.hidden = true;
    // keep a reference to a photo input before we leave its step
    var pin = root.querySelector('#photoInput'); if (pin && pin.files && pin.files.length) stashedPhotoInput = pin;
    if (stepIdx < flow.length - 1) { stepIdx++; render(); focusFirst(); }
    else { submit(); }
  }

  function summaryText() {
    var skip = { service: 1, consent: 1, prefer: 1 }, lines = [];
    Object.keys(state).forEach(function (k) {
      if (skip[k] || state[k] == null || state[k] === '') return;
      var v = Array.isArray(state[k]) ? state[k].join(', ') : state[k];
      if (!v) return;
      lines.push(label(k) + ': ' + v);
    });
    return lines;
  }
  function label(k) {
    var m = { propertyType: 'Property', bedrooms: 'Bedrooms', furnished: 'Furnished', fFloor: 'From floor', tFloor: 'To floor', lift: 'Lift', parking: 'Parking', fAccess: 'Access notes', extras: 'Extras', notes: 'Notes', from: 'From postcode', to: 'To postcode', date: 'Date', flexible: 'Flexible date', company: 'Company', premises: 'Premises', workstations: 'Workstations', equip: 'Equipment', ooh: 'Out-of-hours', officePack: 'Packing/dismantling', item: 'Item', itemText: 'Item (other)', qty: 'Quantity', size: 'Size', dismantle: 'Dismantle', wasteTypes: 'Waste types', wasteNote: 'Waste notes', volume: 'Volume', location: 'Waste location', vehAccess: 'Vehicle access', stairs: 'Stairs', name: 'Name', email: 'Email', phone: 'Phone' };
    return m[k] || k;
  }

  function payload() {
    var pr = priceRange(state), sc = surcharge(distMiles), est = pr.range ? ('£' + (pr.range[0] + sc) + ' – £' + (pr.range[1] + sc)) : 'To be confirmed';
    var data = {
      _subject: 'New ' + SERVICES[state.service].label + ' quote — Next Day Movers',
      _template: 'table', _captcha: 'false',
      Service: SERVICES[state.service].label,
      'Estimate shown': est,
      Distance: distMiles != null ? (Math.round(distMiles) + ' miles (approx)') : 'n/a',
      'Preferred contact': state.prefer || '',
      Submitted: new Date().toLocaleString('en-GB')
    };
    summaryText().forEach(function (line) { var i = line.indexOf(': '); data[line.slice(0, i)] = line.slice(i + 2); });
    return data;
  }

  function submit() {
    if (sending) return;
    var btn = root.querySelector('#qNext');
    if (stashedPhotoInput && stashedPhotoInput.files && stashedPhotoInput.files.length) { return submitMultipart(btn); }
    sending = true; btn.disabled = true; btn.textContent = 'Sending…';
    fetch(AJAX_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload()) })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (j) {
        sending = false;
        if (j && (j.success === 'true' || j.success === true)) { showThanks(); fireConv(); }
        else { btn.disabled = false; btn.textContent = 'See my estimate →'; showSubmitError(); }
      }).catch(function () { sending = false; btn.disabled = false; btn.textContent = 'See my estimate →'; showSubmitError(); });
  }

  function submitMultipart(btn) {
    // build a real multipart form so FormSubmit emails the photo attachments
    var data = payload();
    var form = document.createElement('form');
    form.method = 'POST'; form.action = FORM_ENDPOINT; form.enctype = 'multipart/form-data'; form.style.display = 'none';
    form.appendChild(hidden('_next', location.origin + '/get-a-quote?sent=1'));
    Object.keys(data).forEach(function (k) { form.appendChild(hidden(k, data[k])); });
    // move the real file input into the form
    stashedPhotoInput.name = 'attachment';
    form.appendChild(stashedPhotoInput);
    document.body.appendChild(form);
    btn.disabled = true; btn.textContent = 'Uploading…';
    form.submit(); // full-page navigation → thank-you
  }
  function hidden(n, v) { var i = document.createElement('input'); i.type = 'hidden'; i.name = n; i.value = v == null ? '' : v; return i; }

  function showThanks() {
    if (window.NDMtrack) window.NDMtrack('quote_submit', { service: state.service || '' });
    root.innerHTML = '';
    root.appendChild(el('<div class="q-done"><div class="q-done-ic">✓</div>' +
      '<h2>Thanks! Your quote request has been received.</h2>' +
      '<p>We’ll review your details and get back to you to confirm your fixed price — usually within the hour during working hours.</p>' +
      '<div class="q-done-cta"><a class="btn btn-primary" href="tel:' + TEL + '">Call us now</a>' +
      '<a class="btn btn-gold" href="' + WHATSAPP + '" target="_blank" rel="noopener">WhatsApp us</a></div></div>'));
  }
  function showSubmitError() {
    var e = root.querySelector('#qErr'); if (!e) return;
    e.hidden = false; e.innerHTML = 'Sorry — that didn’t send. Please call <a href="tel:' + TEL + '">07777 622437</a> or <a href="' + WHATSAPP + '" target="_blank" rel="noopener">WhatsApp us</a>.';
  }
  function fireConv() { if (typeof window.gtag === 'function') { try { window.gtag('event', 'conversion', { send_to: 'AW-18354289784/G5IOCPWmm9gcEPj4gLBE', value: 1.0, currency: 'GBP' }); } catch (e) {} } }

  /* ---------- icons ---------- */
  function svgHouse() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>'; }
  function svgOffice() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="12" height="18"/><path d="M16 8h4v13H4"/><path d="M8 7h0M12 7h0M8 11h0M12 11h0M8 15h0M12 15h0"/></svg>'; }
  function svgVan() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v11H3z"/><path d="M14 9h4l3 3v5h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>'; }
  function svgWaste() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 10v6M14 10v6"/></svg>'; }

  /* ---------- boot ---------- */
  var params = new URLSearchParams(location.search);
  if (params.get('sent') === '1') { showThanks(); }
  else {
    var pre = params.get('s') || params.get('service');
    if (pre && SERVICES[pre]) startService(pre); else renderPicker();
  }
})();
