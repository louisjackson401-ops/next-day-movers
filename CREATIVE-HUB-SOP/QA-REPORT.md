# Creative Hub — QA Report

**Project:** Next Day Movers  
**Repository:** `/Users/louisjackson/Next Day Movers web`  
**Commit:** `49f5748`  
**Run:** 2026-10-09 18:49 UTC  
**Engine:** creative-hub-qa 1.0.0 — 99 checks across 16 page(s)

---

## Production gate: **APPROVED FOR PRODUCTION**

| | |
|---|---|
| Failures | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 9 |
| Low | 50 |
| Warnings | 59 |
| Not verified | 13 |

## Category status

| Category | Status | Fails | Warnings | Not verified |
|---|---|---|---|---|
| AI Search | WARNING | 0 | 12 | 1 |
| Accessibility | PASS | 0 | 0 | 2 |
| Code Quality | PASS | 0 | 0 | 0 |
| Content | WARNING | 0 | 2 | 0 |
| Conversion | PASS | 0 | 0 | 1 |
| Forms | WARNING | 0 | 8 | 1 |
| Images | WARNING | 0 | 27 | 0 |
| Links | PASS | 0 | 0 | 1 |
| Performance | PASS | 0 | 0 | 2 |
| Privacy | PASS | 0 | 0 | 1 |
| Robots | PASS | 0 | 0 | 0 |
| Schema | WARNING | 0 | 1 | 1 |
| Security | PASS | 0 | 0 | 2 |
| Sitemap | PASS | 0 | 0 | 1 |
| Technical SEO | WARNING | 0 | 9 | 0 |

## Warnings — below standard (59)

- **Schema** · `schema.no-organization` `medium` — No Organization or LocalBusiness node found anywhere on the site
- **Forms** · `form.js-only-submit` `medium` — contact.html: form submits only via JavaScript — with JS disabled or broken, the enquiry is silently lost
- **Forms** · `form.no-required` `medium` — contact.html: no field marked required — empty submissions will pass client-side
- **Forms** · `form.js-only-submit` `medium` — index.html: form submits only via JavaScript — with JS disabled or broken, the enquiry is silently lost
- **Forms** · `form.no-required` `medium` — index.html: no field marked required — empty submissions will pass client-side
- **Forms** · `form.js-only-submit` `medium` — quote.html: form submits only via JavaScript — with JS disabled or broken, the enquiry is silently lost
- **Forms** · `form.no-required` `medium` — quote.html: no field marked required — empty submissions will pass client-side
- **Content** · `content.similar` `medium` — /removals-bexley and /removals-dartford are 81% similar — differentiate the copy
- **Content** · `content.similar` `medium` — /removals-croydon and /removals-maidstone are 81% similar — differentiate the copy
- **Technical SEO** · `seo.og-missing` `low` — 404.html: missing og:title
- **Technical SEO** · `seo.twitter-card` `low` — 404.html: no twitter:card
- **Technical SEO** · `seo.desc-long` `low` — contact.html: description 182 chars, will truncate
- **Technical SEO** · `seo.title-long` `low` — get-a-quote.html: title 70 chars, will truncate in SERPs — "Get a Quote — House, Office, Single Item &amp; Waste | Next Day Movers"
- **Technical SEO** · `seo.desc-long` `low` — get-a-quote.html: description 175 chars, will truncate
- **Technical SEO** · `seo.title-long` `low` — index.html: title 71 chars, will truncate in SERPs — "Next Day Movers — Fully insured house removals across London &amp; Kent"
- **Technical SEO** · `seo.desc-long` `low` — index.html: description 194 chars, will truncate
- **Technical SEO** · `seo.title-long` `low` — services.html: title 73 chars, will truncate in SERPs — "Services — Removals, office moves &amp; waste clearance | Next Day Movers"
- **Technical SEO** · `seo.desc-long` `low` — services.html: description 175 chars, will truncate
- **Images** · `img.no-lazy` `low` — gallery.html: below-fold <img src="assets/logo.svg"> has no loading="lazy"
- **Images** · `img.alt-empty` `low` — index.html: <img src="assets/photos/img_6841.webp"> has empty alt — correct only if purely decorative
- **Images** · `img.no-lazy` `low` — index.html: below-fold <img src="assets/photos/0a3b1b58-aa54-4844-8589-7d3b17e671f0.webp"> has no loading="lazy"
- **Images** · `img.alt-empty` `low` — index.html: <img src="assets/logo.svg"> has empty alt — correct only if purely decorative
- **Images** · `img.no-lazy` `low` — index.html: below-fold <img src="assets/logo.svg"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — index.html: below-fold <img src="assets/photos/img_3935_2.webp"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — index.html: below-fold <img src="assets/photos/img_3943.webp"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — index.html: below-fold <img src="assets/photos/7d58d0a1-3349-4f55-8c51-477e66318f38.webp"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — index.html: below-fold <img src="assets/photos/img_0246.webp"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — index.html: below-fold <img src="assets/photos/img_3941.webp"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — index.html: below-fold <img src="assets/photos/img_0238.webp"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — index.html: below-fold <img src="assets/photos/img_6059.webp"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — index.html: below-fold <img src="assets/photos/img_0337.webp"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — index.html: below-fold <img src="assets/logo.svg"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — removals-bexley.html: below-fold <img src="assets/logo.svg"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — removals-bromley.html: below-fold <img src="assets/logo.svg"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — removals-croydon.html: below-fold <img src="assets/logo.svg"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — removals-dartford.html: below-fold <img src="assets/logo.svg"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — removals-maidstone.html: below-fold <img src="assets/logo.svg"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — removals-sevenoaks.html: below-fold <img src="assets/logo.svg"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — services.html: below-fold <img src="assets/photos/3af0f409-b2aa-4e0b-ad77-0d4f444ad9d0.webp"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — services.html: below-fold <img src="assets/photos/e3e02972-acc1-449c-b66d-84de5d9d3520.webp"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — services.html: below-fold <img src="assets/photos/img_3941.webp"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — services.html: below-fold <img src="assets/photos/img_6059.webp"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — services.html: below-fold <img src="assets/photos/img_0379.webp"> has no loading="lazy"
- **Images** · `img.no-lazy` `low` — services.html: below-fold <img src="assets/logo.svg"> has no loading="lazy"
- **Images** · `img.unreferenced` `low` — 2 image file(s) totalling 75KB are not referenced by any page
- **Forms** · `form.email-type` `low` — contact.html: email field is type="text" — use type="email"
- **Forms** · `form.tel-type` `low` — contact.html: phone field is type="text" — use type="tel" for the mobile keypad
- **AI Search** · `ai.no-question-headings` `low` — contact.html: no question-form headings — answer engines extract answers from question/answer structure
- **AI Search** · `ai.no-question-headings` `low` — gallery.html: no question-form headings — answer engines extract answers from question/answer structure
- **AI Search** · `ai.no-question-headings` `low` — get-a-quote.html: no question-form headings — answer engines extract answers from question/answer structure
- **AI Search** · `ai.no-question-headings` `low` — quote.html: no question-form headings — answer engines extract answers from question/answer structure
- **AI Search** · `ai.no-question-headings` `low` — removals-bexley.html: no question-form headings — answer engines extract answers from question/answer structure
- **AI Search** · `ai.no-question-headings` `low` — removals-bromley.html: no question-form headings — answer engines extract answers from question/answer structure
- **AI Search** · `ai.no-question-headings` `low` — removals-croydon.html: no question-form headings — answer engines extract answers from question/answer structure
- **AI Search** · `ai.no-question-headings` `low` — removals-dartford.html: no question-form headings — answer engines extract answers from question/answer structure
- **AI Search** · `ai.no-question-headings` `low` — removals-maidstone.html: no question-form headings — answer engines extract answers from question/answer structure
- **AI Search** · `ai.no-question-headings` `low` — removals-sevenoaks.html: no question-form headings — answer engines extract answers from question/answer structure
- **AI Search** · `ai.no-question-headings` `low` — terms.html: no question-form headings — answer engines extract answers from question/answer structure
- **AI Search** · `ai.no-authorship` `low` — No authorship signal anywhere on the site — weakens E-E-A-T for content pages

## Not verified — needs access or a live URL (13)

_These were not checked. They are not passes. Each one names what access would settle it._

- **Schema** · `schema.google-validation` — JSON-LD syntax was validated locally; Google eligibility for rich results was not
  - _Requires:_ Run the URL through the Google Rich Results Test on the live domain
- **Links** · `links.external-http` — 42 external link(s) to 4 distinct URL(s) were found but not requested over the network
  - _Requires:_ Re-run with --network to check external links return 2xx
- **Accessibility** · `a11y.contrast` — Colour contrast ratios were not computed — they depend on rendered CSS cascade
  - _Requires:_ Run axe DevTools or Lighthouse accessibility audit against the rendered page
- **Accessibility** · `a11y.screen-reader` — Screen reader behaviour was not tested
  - _Requires:_ Manual pass with VoiceOver (Safari) and NVDA (Chrome)
- **Security** · `sec.live-headers` — Headers were read from configuration, not from live HTTP responses
  - _Requires:_ Run `chqa smoke <production-url>` after deployment, or curl -I the live domain
- **Security** · `sec.ssl` — SSL certificate validity was not checked
  - _Requires:_ Verify the certificate on the live domain after DNS propagation
- **Sitemap** · `sitemap.submitted` — Sitemap submission and indexing status in Google Search Console were not checked
  - _Requires:_ Needs Search Console access for the property
- **Privacy** · `privacy.legal-review` — Technical consent controls were inspected; legal adequacy of the policies was not assessed
  - _Requires:_ Client or their solicitor must confirm the policy text reflects actual data processing
- **Forms** · `form.end-to-end` — No test submission was made, so backend delivery, success state and duplicate handling are unproven
  - _Requires:_ Submit a real test enquiry against the deployed site and confirm the email arrives
- **Conversion** · `cro.real-behaviour` — Actual conversion rate, scroll depth and form abandonment were not measured
  - _Requires:_ Needs GA4 / Clarity data from the live site over a meaningful traffic window
- **Performance** · `perf.lighthouse` — No Lighthouse run was performed, so there is no performance score for this build
  - _Requires:_ Run `npx lighthouse <url> --preset=desktop` and `--form-factor=mobile` against the deployed URL, or PageSpeed Insights
- **Performance** · `perf.core-web-vitals` — LCP, INP and CLS were not measured — static analysis cannot produce them
  - _Requires:_ Read field data from the CrUX report in PageSpeed Insights or Search Console once the site has traffic
- **AI Search** · `ai.citation` — Whether ChatGPT, AI Overviews, Gemini, Claude, Perplexity or Copilot cite this site was not tested and cannot be guaranteed
  - _Requires:_ Manually query the assistants for the target questions after the site has been live and indexed

## Not applicable (1)

- **Privacy** · `privacy.no-trackers` — No third-party tracking technology detected in the markup

## Passed (26)

_Each of these was actually inspected or measured in this run._

- **Code Quality** · `html.structure` — 16 page(s) parsed: doctype, lang, ids, headings and landmarks all clean
- **Technical SEO** · `seo.title-unique-count` — 15 indexable page(s) carry a <title>
- **Schema** · `schema.parsed` — 247 JSON-LD node(s) parsed successfully across 16 page(s)
- **Links** · `links.internal-resolved` — 538 internal link(s) resolved across 16 page(s)
- **Images** · `img.inspected` — 95 image reference(s) resolved to real files and measured
- **Accessibility** · `a11y.static-checks` — Static accessibility checks run across 16 page(s): control labels, accessible names, focus order, zoom, motion
- **Security** · `sec.secret-scan` — 26 text file(s) scanned against 11 credential patterns
- **Security** · `sec.header` — vercel.json sets strict-transport-security
- **Security** · `sec.header` — vercel.json sets x-content-type-options
- **Security** · `sec.header` — vercel.json sets content-security-policy
- **Security** · `sec.header` — vercel.json sets referrer-policy
- **Security** · `sec.header` — vercel.json sets x-frame-options
- **Security** · `sec.header` — vercel.json sets permissions-policy
- **Robots** · `robots.sitemap-declared` — robots.txt declares https://nextdaymovers.co.uk/sitemap.xml
- **Robots** · `robots.crawlable` — robots.txt permits crawling of the site
- **Sitemap** · `sitemap.matches-site` — sitemap.xml lists exactly the 15 indexable page(s) in the build
- **Privacy** · `privacy.policy-page` — Privacy Policy page present at /privacy
- **Privacy** · `privacy.policy-page` — Cookie Policy page present at /cookies
- **Privacy** · `privacy.policy-page` — Terms page present at /terms
- **Forms** · `form.inspected` — 3 form(s) inspected for method, handler, spam protection, privacy notice and validation
- **Conversion** · `cro.static-checks` — Conversion path checked on 16 page(s): phone reachability, CTA presence and position, value proposition, trust signals
- **Performance** · `perf.css-weight` — Total CSS 26KB (budget 120KB)
- **Performance** · `perf.js-weight` — Total JS 59KB (budget 180KB)
- **Performance** · `perf.asset-caching` — vercel.json sets immutable long-lived caching for static assets
- **Content** · `content.claims-confirmed` — 7 factual claim(s) present; claimsVerifiedByClient is true, so the client has signed these off: insurance/accreditation claim: "Fully insured"; rating claim: "Rated 5.0"; free-offer claim: "free quote"; price claim: "£1"; price claim: "£380"; price claim: "£300,"; …
- **AI Search** · `ai.structure-checked` — Answer-engine readiness checked on 15 indexable page(s): question headings, semantic landmarks, schema-backed entities

---

### Honesty statement

Every line above is the output of a check that ran against this build. Nothing in this report is estimated.
No Lighthouse score, Core Web Vitals figure, ranking, traffic number or indexing status appears here unless it was measured — where it could not be, the item is recorded as NOT VERIFIED with the access required to settle it.
