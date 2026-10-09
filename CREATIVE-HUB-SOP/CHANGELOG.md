# Changelog — Next Day Movers

Every change that reaches production, and every accepted QA failure, is recorded here.

Format: `YYYY-MM-DD — what changed — why — QA result`

An accepted failure must record: the finding id, who accepted it, and why.

---

## 2026-10-09 — SEO/AEO quick-wins batch (from the growth audit)

Implemented the safe, high-value items from GROWTH-AUDIT.md (§K first-10):
- **Consolidated the quote journey:** deleted legacy `quote.html`; added 301
  redirects `/quote` + `/quote.html` → `/get-a-quote` in `vercel.json`; removed
  `/quote` from `sitemap.xml`; repointed every nav/footer/mobilebar/CTA link
  site-wide from `/quote` → `/get-a-quote` and relabelled nav "Instant Quote" →
  "Get a Quote". One clean conversion path.
- **SERP CTR:** trimmed over-length `<title>`/`<meta description>` on home,
  services, get-a-quote and contact so they stop truncating.
- **Schema:** added an explicit `Organization` JSON-LD (with `sameAs` → Google
  profile + Instagram) on the homepage — clears the no-Organization warning and
  strengthens the entity for knowledge-graph / AI search. (Schema category now PASS.)
- **AEO crawler access:** `robots.txt` now explicitly welcomes AI/answer-engine
  crawlers (OAI-SearchBot, GPTBot, ChatGPT-User, PerplexityBot, Google-Extended,
  Bingbot, Applebot) alongside the existing open policy.
- **Perf:** lazy-loaded genuinely below-fold content images (hero stays eager with
  fetchpriority; reverted an over-eager pass that had lazied footer logos / a
  near-fold image — caught by the gate's LCP-lazy check).
- **Forms:** contact form now uses `type="email"`/`type="tel"` + a required field
  + autocomplete.

Not changed (deferred to roadmap): GA4 install (needs Measurement ID), location-page
differentiation, new town pages, cornerstone guides, IndexNow/Bing verification,
citations — all off-site or content work in GROWTH-AUDIT.md §J.

`chqa audit`: **APPROVED FOR PRODUCTION** (0 failures).

---

## 2026-10-09 — Before/after waste-clearance slider (genuine pairs only)

Added a reusable before/after comparison slider (`assets/compare.js` + `assets/compare.css`)
with its data in `assets/ba-data.js` (edit that file to add pairs). Placed a
"From cluttered to clear" section on `get-a-quote.html` below the quote app, with a
waste-clearance CTA that preselects Waste in the quote engine in-place
(`window.NDMStartQuote`).

- **Only genuine, same-space pairs used.** Reviewed all 118 source photos via contact
  sheets; found two real, well-aligned before/after pairs and verified them full-size:
  (1) garage full of timber → same garage cleared (IMG_0417 → IMG_0421);
  (2) side-return piled with waste → same alley cleared (IMG_3667 → IMG_3670).
  Processed to matched 1000-wide webp (171–225 KB, under budget).
  **Did NOT fabricate** the other brief categories (house/furniture/domestic); rejected
  IMG_5589/5590 as a pair because they are different rooms.
- Native slider: pointer drag + keyboard (arrows/Home/End, role=slider) + gallery
  prev/next/dots (nav separate from the drag handle, no conflict), image-fail fallback,
  reduced-motion + IntersectionObserver entrance, lazy below-fold.
- Fixed a CSP critical caught by chqa: moved slide data out of an inline
  `<script type="application/json">` into external `ba-data.js` (no inline scripts).
- **Tested (browser):** renders from external data, keyboard + gallery nav + CTA
  preselect all work, no console errors, on-brand. `chqa audit`: **APPROVED FOR PRODUCTION**.
- NEEDS CLIENT: more genuine matched before/after pairs (house clearance, furniture,
  domestic) to expand the gallery — none fabricated.

---

## 2026-10-09 — Claims confirmed by client; QA gate opened

Client (Louis Jackson, owner) confirmed in writing, in session, that every
factual claim on the site is accurate and may be published:
- Fully insured (goods-in-transit & public liability).
- Google rating 5.0, review count 14.
- Guide prices: man & van from £120; 1-bed from £300; 2-bed £500–750;
  3-bed £750–1,200; 4+ £1,200–2,000; waste from £120; +£1/mile after 20 miles;
  home-page "from £380" example.
- Free, no-obligation quotes.

Set `claimsVerifiedByClient: true`. This clears the claims-gate critical and the
15 unverified-claim failures (home/location AggregateRating + Offer nodes, insurance,
rating, price and free-quote copy). No content changed — claims were already true;
this records the sign-off.

---

## 2026-10-09 — Instant quote engine: 4 service journeys (build, not yet deployed)

Added a data-driven multi-step quote engine (`assets/quote.js` + `assets/quote.css`)
and a dedicated page (`get-a-quote.html`) with four conditional flows — House, Office,
Single Item, Waste — each asking only relevant questions, a live estimate panel, and
inline validation. Added `/get-a-quote` to `sitemap.xml`.

- **Pricing reused verbatim** from the existing sheet (mirrors `range()`/`surcharge()`
  in `site.js`): single £120–300, waste £120–320, house/flat by bedroom band (flat ×0.95),
  office ×1.35, +£1/mile after 20 miles via postcodes.io. No new prices invented.
  House/flat shown as firm; waste/office labelled "guide — confirmed after review".
- **Photo uploads (client decision: email via FormSubmit).** No-photo flows submit via
  FormSubmit AJAX (inline confirmation). Waste/single photo flows submit as a real
  multipart POST so images arrive as email attachments; client + (FormSubmit) size/type
  limits. NOT secure stored uploads — flagged; storage backend is the proper future path.
- Reuses existing service-area origin gate, Consent Mode, Google Ads conversion fire.
- **Tested locally (browser):** all 4 journeys step through; estimates correct
  (2-bed house £500–750, office £680–1010, single £120–300, waste £120–320 guide);
  validation + Manchester-origin out-of-area block fire; photo add/preview/remove works.
- **NOT YET DONE / next:** homepage hero 4-card integration; retire or redirect old
  `/quote`; `chqa audit`; real end-to-end FormSubmit submission test (sends live email);
  production Lighthouse. **Not deployed** — QA gate still closed pending claim sign-off.

QA result: NOT VERIFIED via `chqa` (audit not yet run this change); manual browser tests PASS as listed.

---

## 2026-08-20 — Placed under the Creative Hub QA gate

Installed `chqa` (engine + gate + hooks). First audit: 143 checks, 15 pages,
23 failures. Fixed in this pass:

- `quote.html` — sticky mobile "Get quote" CTA pointed at `#top`, which did not
  exist on that page. The primary mobile conversion path was dead. Added
  `id="top"` to the hero section.
- `index.html`, `quote.html`, `contact.html` — added a `_honey` honeypot to each
  form and enforced it in `assets/site.js`, so a filled hidden field is a silent
  no-op rather than an emailed lead.
- Same three forms — added a privacy notice linking to `/privacy` inside each
  form, and `role="alert" aria-live="polite"` on the status paragraph so
  validation errors are announced.
- `gallery.html` — the first tile is the LCP image and was `loading="lazy"`.
  Now `eager` with `fetchpriority="high"`.

Re-audit: **15 failures remain, 1 critical. Gate CLOSED.**

### Open blocker — needs the client, not the developer

Every remaining failure is `claimsVerifiedByClient: false`. The site states
"Rated 5.0", "Fully insured", "free quote", and prices of £380, £300 and £120,
and carries `AggregateRating` on seven pages plus six `Offer` nodes.

None of these may ship until Next Day Movers confirms each one in writing.
Once they have, set `claimsVerifiedByClient: true` in
`.creative-hub/qa.config.json`, re-run `chqa audit`, and record the confirmation
here with the date and who gave it.

**Do not flip the flag to clear a red gate.** If a claim turns out to be
unsupported, the copy and the schema come out instead.

---

## 2026-10-09 — Differentiated 6 location pages with genuine local content + AEO headings

Added a factual "Moving house in {Town}" section to all six location pages
(Bromley, Bexley, Dartford, Croydon, Maidstone, Sevenoaks): real postcode districts,
property-type mix, parking/access realities and neighbouring areas, each under two
question-form H3 headings ("What are parking and access like…", "Which areas…").

- Resolves the Content similarity warnings (bexley≈dartford, croydon≈maidstone were 81%).
- Clears the location-page `ai.no-question-headings` AEO warnings (visible Q&A headings).
- Only verifiable local geography/property facts — no fabricated business claims,
  testimonials or figures (CLAUDE.md-compliant; not town-swap).

chqa: Content PASS, Schema PASS, GATE APPROVED FOR PRODUCTION.

---

## 2026-10-09 — 4 new location pages + South-East hub + GA4

- New location pages with genuine, non-template local content (postcodes, property
  mix, access/parking, neighbours, question-form headings): /removals-beckenham,
  /removals-orpington, /removals-chislehurst, /removals-sidcup. Generated from the
  Bexley template for boilerplate fidelity, then every town-specific block replaced
  (0 "Bexley" residue; verified in-browser).
- New **/removals-south-east** hub: links all 10 location pages (SE London + Kent),
  the internal-linking spine. Footer "Areas" column expanded site-wide to link all
  areas + the hub.
- sitemap.xml: +5 URLs (now 19). chqa: 20 pages, **APPROVED FOR PRODUCTION**.
- GA4 (G-CL7VCY5L6G) installed earlier this day; these pages inherit it.

Next (needs client): GBP optimisation + reviews, Bing Webmaster, citations,
waste-carrier licence, cornerstone guides. Still no fabricated local claims.
