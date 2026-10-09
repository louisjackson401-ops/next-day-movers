# Changelog — Next Day Movers

Every change that reaches production, and every accepted QA failure, is recorded here.

Format: `YYYY-MM-DD — what changed — why — QA result`

An accepted failure must record: the finding id, who accepted it, and why.

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
