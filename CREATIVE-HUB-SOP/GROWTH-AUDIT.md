# Next Day Movers — Growth Audit (SEO · Performance · Local · CRO · Competitors)

**Date:** 2026-10-09 · **Site:** https://nextdaymovers.co.uk · **Commit:** c75e1c3
**Status labels:** VERIFIED · OBSERVED · ESTIMATED · NOT VERIFIED · RECOMMENDED
**Scope note:** This is an audit + roadmap (per the brief's §17). No production changes were made to run it — only read-only diagnostics (`chqa audit`, live `curl`, web research).

---

## A. Executive summary

The **website itself is in good technical health** — fast, secure, indexable, schema-rich, and it passes the Creative Hub QA gate with **0 failures** (VERIFIED, `chqa` 2026-10-09). The new 4-service instant-quote engine and the before/after waste slider are live and tested. So the foundation is strong; the growth ceiling right now is **not** code quality — it's three things:

1. **Measurement is half-built.** Google Ads conversion tag is live; **GA4 is not installed** and there's **no form-funnel tracking** — so you can't yet see where quote-journeys drop off or which pages/sources produce leads. (OBSERVED.)
2. **Local visibility is early-stage.** As of the GSC data you shared (OBSERVED, ~Jul 2026): **~957 impressions / 8 clicks, avg position ~54.7** — you're indexed and appearing, but on page 4–5 for the money terms. Climbing that is **off-site** (Google Business Profile reviews + citations) plus **deeper, differentiated local pages**, not more markup.
3. **Two self-inflicted issues to clean up:** a **duplicate quote page** (`/quote` and `/get-a-quote` both live + in sitemap) and **near-duplicate location pages** (bexley≈dartford 81%, croydon≈maidstone 81%).

Biggest barriers to more impressions/clicks/enquiries, in order: **(a)** no GA4/funnel tracking → flying blind; **(b)** GBP review volume + citations → the local-pack lever; **(c)** thin/duplicated location copy capping relevance; **(d)** a few SERP-CTR issues (titles truncating). None are emergencies; all are addressable.

---

## B. Website health report (page-by-page)

Live check 2026-10-09: **all 15 URLs return HTTP 200**, TTFB 0.18–0.35s via Cloudflare; `/quote.html` → 308 → `/quote` (clean URLs working). (VERIFIED.)

| URL | Purpose | Main issue(s) | Priority |
|---|---|---|---|
| `/` | Home | Title 71 chars (truncates in SERP); hero `<img>` empty alt (OK-decorative); several below-fold imgs not lazy; legacy hero quote form has no `required` + JS-only submit | P2 |
| `/services` | Service hub | Title 73 chars truncates; desc 175; some imgs not lazy; single page for 6 services (deep per-service pages could target more intent) | P2/P3 |
| `/quote` | **Legacy** quote form | **Duplicate of `/get-a-quote`** — both indexable + in sitemap → competing intent; legacy form no `required`, JS-only | **P1** |
| `/get-a-quote` | New 4-service quote engine + before/after slider | Title 70 chars truncates; desc 175; otherwise strong | P2 |
| `/gallery` | Portfolio | No question-form headings (AEO); logo img not lazy | P3 |
| `/contact` | Contact | Desc 182 chars; form fields `type="text"` not `email`/`tel`; no `required`; JS-only submit | P2 |
| `/removals-bromley` | Location | Good (1,090 words, FAQ) but shares structure with siblings | P2 |
| `/removals-bexley` | Location | **81% similar to /removals-dartford** — differentiate | P2 |
| `/removals-dartford` | Location | see above | P2 |
| `/removals-croydon` | Location | **81% similar to /removals-maidstone** — differentiate | P2 |
| `/removals-maidstone` | Location | see above | P2 |
| `/removals-sevenoaks` | Location | OK; add unique local detail | P3 |
| `/privacy` `/terms` `/cookies` | Legal | Present, linked sitewide (PASS) | — |
| `404.html` | Not-found | Missing og:title + twitter:card (minor) | P3 |

No broken internal links (539 resolved, VERIFIED). No orphan pages detected. No mixed content (CSP `upgrade-insecure-requests`, VERIFIED live).

## C. Google visibility report

- **GSC performance** (OBSERVED from your screenshots, ~Jul 2026; **now stale — re-pull for current**): sitemap **Success, 14 pages indexed**; **957 impressions / 8 clicks / CTR ~1.7% / avg pos ~54.7**. Top queries: `removals bexley` (6 impr), `removals bromley` (5), `removals sevenoaks` (5), `moving companies sevenoaks` (4), `house removals maidstone` (3), `same day removals` (3), `next day movers` (branded, 1 click). Top pages: home, `/removals-bromley`, `/services`.
- **Interpretation:** you rank but on page 4–5 — hence impressions without clicks. The location pages are *already* earning impressions, which validates the local-page strategy. CTR will rise when (a) positions improve and (b) titles stop truncating.
- **`/get-a-quote` is new (Oct 2026)** and won't be indexed yet → **submit updated sitemap + Request Indexing** (RECOMMENDED).
- **NOT VERIFIED:** current impressions/clicks/positions, rich-result eligibility, indexing status of the new page — all need live GSC access (you have it; I don't).

## D. Google Business Profile & reviews

- **Rating 5.0, 14 reviews** — OBSERVED earlier + **confirmed by client in writing** (2026-10-09). Hours 7:30am–9pm, 7 days (matches site). Profile URL on file (share.google link in footer).
- **NOT VERIFIED (needs GBP dashboard):** categories, service-area setup, photo count, posts, calls/direction/website-click metrics, review responses.
- **Highest-ROI free lever you have.** The local pack sits *above* ads and organic. Actions (RECOMMENDED): confirm primary category = "Mover" + secondary "Rubbish removal/Garbage collection service"; set service-area (not an address — you're service-area based); add 15–20 real job photos (you have them); post weekly; **respond to every review**; and run a **review-growth routine** (see §H).

## E. Competitor report (OBSERVED, web research 2026-10-09 — platform-reported ratings, NOT independently verified)

| Competitor | Focus | Signal | Where they win | Gap you can exploit |
|---|---|---|---|---|
| The Removals Hub (Gumtree) | Man & van / house, Bromley | 5.0 × 176 (Gumtree-reported) | Review volume | You have a real site + instant quote + before/after proof; they rely on a marketplace listing |
| SSK Transport (Gumtree) | Man & van / house, Bromley | 4.9 × 149 (Gumtree-reported) | Review volume | Same — own-site experience + schema |
| 2nd Chances Ltd (BR3) | Waste/house clearance | TrustATrader listing, "licensed & insured" | On TrustATrader | Display your **waste-carrier licence no.**; your before/after slider is stronger proof |
| AAA Waste Management (BR3) | Waste, S.London & Kent | TrustATrader, "punctual" reviews | Directory presence | Citations + GBP reviews |
| REMOVO (Beckenham) | House/garden/waste clearance | Own site, area pages, "same-day 6am–11pm" | **Dedicated area pages + same-day messaging** | Match with your differentiated location pages + same/next-day USP |
| Directories: TrustATrader, Housekeep, Checkatrade, Find My Man & Van, Compare The Man & Van | lead-gen | — | They capture "near me" + comparison intent | **Get listed** (citations) so you appear in these funnels too |

**What the strongest are doing that you aren't (yet):** (1) sitting on review-rich marketplace/directory listings (TrustATrader, Checkatrade, Gumtree); (2) REMOVO runs genuine per-area pages with same-day messaging. **What you can out-do them on:** a genuinely premium own-site quote experience, real before/after proof, fixed-price clarity, and proper schema — most local competitors have none of these. Sources: [Gumtree removals Bromley](https://www.gumtree.com/p/removal-services/-man-and-van-removals-service-rubbish-removals-house-removals-office-flat-removals-services/1800452507), [Compare The Man And Van — Bromley](https://www.comparethemanandvan.co.uk/bromley), [TrustATrader — Bromley clearance](https://www.trustatrader.com/rubbish-waste-clearance-in-bromley), [Housekeep — Beckenham waste](https://housekeep.com/tradespeople/waste-removal/regions-local/london/beckenham/), [REMOVO — Beckenham](https://clear-trash-joy.lovable.app/areas/beckenham). (ESTIMATED/OBSERVED: ratings & claims are platform self-reports, not verified against official registers or Google.)

## F. Keyword & location strategy

Grouped by intent (volumes NOT fabricated — validate in GSC/Keyword Planner):
- **Ready-to-book / local:** `house removals {bromley,beckenham,orpington,croydon,sidcup,chislehurst}`, `removal company {town}`, `man and van {town}`.
- **Waste:** `waste clearance {town}`, `house clearance {town}`, `rubbish removal {town}`, `builders waste removal`.
- **Urgent:** `same day removals`, `next day removals`, `last minute removals london`.
- **Cost/informational (AEO):** `how much do removals cost in bromley`, `3 bedroom house move cost`, `is man and van cheaper than a removal company`, `what size van do I need`.
- **Branded:** `next day movers`.

**Location-page plan** (ties to the earlier architecture note): keep the 6 live pages but **differentiate the 2 near-duplicate pairs**; add **Beckenham, Orpington, Chislehurst, Sidcup** + a **South-East hub** — each with genuinely local content (postcodes, access/parking realities, neighbouring areas), FAQ, and LocalBusiness/Breadcrumb schema. **No town-swap pages.** (RECOMMENDED; CLAUDE.md-compliant.)

## G. Technical SEO report (from `chqa`, VERIFIED on build c75e1c3)

Gate **APPROVED** — 0 fail/critical/high. Remaining items by severity:
- **Medium:** `schema.no-organization` (no explicit Organization/LocalBusiness node detected site-wide — add one, or confirm the MovingCompany node is recognised); 3× legacy forms `no-required` + `js-only-submit` (index/quote/contact); 2× location-page content similarity (81%).
- **Low:** titles > 60 chars truncating (index 71, services 73, get-a-quote 70); meta descriptions > 160 (index 194, contact 182, services/get-a-quote 175); ~20 below-fold `<img>` missing `loading="lazy"`; contact form `type="text"` for email/phone; 404 missing OG/twitter.
- **AEO:** most pages lack **question-form headings** and there's **no authorship/E-E-A-T** signal.
- **Housekeeping:** 8 unreferenced images (~1,041KB) in the repo — not served, but prune.
- **NOT VERIFIED (need live tools):** Lighthouse score, Core Web Vitals field data (CrUX), Google Rich Results eligibility, external-link health, SSL cert, screen-reader pass.

## H. Conversion report

- **Strong:** new `/get-a-quote` 4-service engine (house/office/single/waste), live estimate reusing your pricing, inline validation, sticky mobile CTA, click-to-call, WhatsApp FAB, before/after proof slider, cookie consent. (VERIFIED by in-browser tests.)
- **Fix:** retire/redirect **legacy `/quote`** and point **all nav "Instant Quote" links → `/get-a-quote`** (currently nav on other pages still points at the old page) — one clear path, no split.
- **Legacy forms** (index hero, contact) lack `required` + proper input types + no-JS fallback → tighten or replace with the new engine's patterns.
- **Review-growth routine (RECOMMENDED, ethical):** after each completed job, send one SMS/email with your Google review short-link; ask **every** customer (not only happy ones); respond to all reviews; never buy/incentivise. A 5.0×14 → 5.0×40+ over a quarter would materially lift local-pack trust.

## I. Measurement report

| Signal | Status |
|---|---|
| Google Search Console | ✅ connected (you have it); submit updated sitemap + index `/get-a-quote` |
| Google Ads conversion tag `AW-18354289784` | ✅ live (quote-form submit, £1 GBP) |
| Consent Mode v2 + banner | ✅ live |
| **GA4** | ❌ **not installed** — no sessions, source, or landing-page data |
| **Form funnel events** (quote start/step/estimate/submit/call/WhatsApp/upload) | ❌ not tracked |
| Microsoft Clarity (heatmaps/recordings) | ❌ not installed |
| Call tracking | ❌ (Ads call-reporting optional) |

**Recommendation:** install **GA4** (send me the Measurement ID) wired to the existing Consent Mode, and add funnel events (`quote_start`, `service_selected`, `step_complete`, `estimate_shown`, `quote_submit`, `click_to_call`, `whatsapp_click`). Then you can actually see drop-off and source quality. **Do not** count button clicks as leads — only successful submissions.

## J. Prioritised 30/60/90-day roadmap

**Days 0–30 — fix leaks + see the data**
1. Redirect legacy `/quote` → `/get-a-quote`; unify nav sitewide. *(P1, code, safe)*
2. Install **GA4** + funnel events (needs your Measurement ID). *(P1)*
3. Trim titles/meta descriptions on home/services/get-a-quote/contact for SERP CTR. *(P2, code)*
4. Submit updated sitemap + Request Indexing for `/get-a-quote` in GSC. *(P1, you)*
5. **GBP:** categories, service-area, 15–20 photos, start weekly posts, respond to all reviews. *(P1, you)*
6. Lazy-load below-fold images; fix contact form input types + `required`. *(P2, code)*

**Days 30–60 — local depth + reputation**
7. Differentiate the 2 near-duplicate location pairs; add **Beckenham, Orpington, Chislehurst, Sidcup** + SE hub with unique local content + schema. *(P3, code)*
8. Add explicit **Organization/LocalBusiness** schema; add waste-carrier licence no. (NEEDS CLIENT). *(P2)*
9. Launch the **review-growth routine** (SMS/email template + short-link). *(P2, you)*
10. **Citations:** Bing Places, Apple Business Connect, Yell, Checkatrade/TrustATrader, consistent NAP. *(P3, you)*

**Days 60–90 — content + measure**
11. 4–6 cornerstone AEO guides (removal costs, van size, man-and-van vs firm, moving checklist) with question headings. *(P3)*
12. Add question-form FAQ headings across pages for answer engines. *(P3)*
13. Re-run PSI/Lighthouse + read CrUX; re-pull GSC to measure movement. *(P2, you+me)*
14. Add more genuine before/after pairs (house/domestic/hardcore) as supplied. *(P3)*

## K. First 10 actions (do these next)

1. **Redirect `/quote` → `/get-a-quote`** in `vercel.json` + repoint all nav/footer "Instant Quote" links. *(I can do now; safe, gate-checked.)*
2. **Send me your GA4 Measurement ID** → I install GA4 + funnel events under the existing Consent Mode.
3. **Trim SERP titles/descriptions** (home/services/get-a-quote/contact). *(I can do now.)*
4. **GSC:** submit `sitemap.xml`, Request Indexing for `/get-a-quote`. *(You.)*
5. **GBP:** set categories + service-area, upload ~15 real photos. *(You.)*
6. **Lazy-load below-fold images** + fix contact form `type`/`required`. *(I can do now.)*
7. **Add Organization/LocalBusiness schema** + (if you give it) your **waste-carrier licence number**. *(I can do; licence = you.)*
8. **Start review requests** on completed jobs (template below). *(You.)*
9. **Differentiate** removals-bexley/dartford and croydon/maidstone copy. *(I can do with real local detail.)*
10. **Re-pull current GSC + run fresh PSI** so we measure from a real baseline. *(You/me.)*

## L. Implementation backlog (Claude Code checklist)

- [ ] `vercel.json`: 308/301 `/quote` → `/get-a-quote`; update nav+footer links on all pages
- [ ] GA4 gtag + events in `site.js`/`quote.js` (Consent-Mode gated) — needs Measurement ID
- [ ] Shorten `<title>`/`<meta description>` on 4 pages
- [ ] Add `loading="lazy"` to below-fold imgs; `type="email"`/`type="tel"` + `required` on contact form
- [ ] Add Organization/LocalBusiness JSON-LD (+ waste-carrier licence when supplied)
- [ ] Differentiate 2 near-duplicate location-page pairs
- [ ] Build Beckenham/Orpington/Chislehurst/Sidcup + SE hub (unique local content)
- [ ] Add question-form FAQ headings sitewide; author 4–6 cornerstone guides
- [ ] Prune 8 unreferenced images (~1MB)
- [ ] 404: add og:title + twitter:card
- [ ] Re-run `chqa audit` after each batch; keep the gate green

## Missing access / integrations (needed to complete the verified picture)
- **GA4** (not installed) — I need the Measurement ID to wire it.
- **Google Search Console** — you have it; I don't. Re-share current query/page/position export for VERIFIED numbers.
- **Google Business Profile dashboard** — to verify categories, photos, and calls/clicks metrics.
- **Live Lighthouse / CrUX** — run PSI on the deployed URL (I can't run Lighthouse here).
- **Waste-carrier licence number / insurance figures** — client-supplied, to strengthen trust + schema.
