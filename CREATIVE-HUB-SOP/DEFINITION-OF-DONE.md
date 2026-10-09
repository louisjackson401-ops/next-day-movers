# Definition of Done — Next Day Movers

A website is not done because the client likes the design.

Items marked **auto** are checked by `chqa audit` and enforced by the gate.
Items marked **manual** are yours — the engine records them as NOT VERIFIED
until a human does them, and a NOT VERIFIED is not a pass.

## Automated gate — `chqa audit` must exit clean
- [ ] auto · No FAIL findings, no critical issues
- [ ] auto · No broken internal links, no orphan pages, no dead `#` CTAs
- [ ] auto · Unique title, description and self-referencing canonical on every indexable page
- [ ] auto · One `<h1>` per page, logical heading order, `<main>` landmark
- [ ] auto · robots.txt crawlable and declaring the sitemap
- [ ] auto · sitemap.xml lists exactly the indexable pages, https, canonical host
- [ ] auto · JSON-LD parses; FAQ answers exist in visible text; no unconfirmed Review/Rating/Offer
- [ ] auto · Every image has alt, dimensions, a lazy/priority decision and sits within budget
- [ ] auto · Form controls labelled, buttons and links named, zoom not blocked, focus not suppressed
- [ ] auto · No secrets in the repo; security headers configured; no mixed content
- [ ] auto · Privacy, cookie and terms pages exist and are linked from every page
- [ ] auto · No tracker fires before consent; Consent Mode defaults to denied
- [ ] auto · Every form has a handler, spam protection and a privacy notice
- [ ] auto · Clickable phone number and a CTA above the fold on every commercial page
- [ ] auto · No near-duplicate town-swap pages
- [ ] auto · No unconfirmed factual claims in the copy

## Live origin — `chqa smoke <url>` after deployment
- [ ] auto · Every route returns 200
- [ ] auto · Security headers present on the real response
- [ ] auto · http → https and www → canonical host both 301/308
- [ ] auto · Unknown URL returns a real 404
- [ ] auto · robots.txt and sitemap.xml served

## Manual — the engine cannot do these for you
- [ ] manual · Lighthouse run against the deployed URL, mobile and desktop, numbers recorded
- [ ] manual · Core Web Vitals reviewed from field data (PSI / CrUX / Search Console)
- [ ] manual · Colour contrast checked with axe or Lighthouse on the rendered page
- [ ] manual · Keyboard-only pass through every interactive element
- [ ] manual · Screen reader pass (VoiceOver + NVDA)
- [ ] manual · Responsive check at 320 / 375 / 390 / 768 / 1024 / 1280 / 1920
- [ ] manual · Chrome, Safari, Firefox, Edge — desktop; iOS Safari and Android Chrome
- [ ] manual · Real test enquiry submitted and the email confirmed as received
- [ ] manual · Rich Results Test run on the live URLs
- [ ] manual · Analytics confirmed as receiving data, conversion event fired end to end
- [ ] manual · Search Console verified, sitemap submitted, homepage inspected
- [ ] manual · SSL certificate valid on the production domain
- [ ] manual · Every factual claim confirmed by the client in writing
- [ ] manual · Client approval recorded

Sign-off is the account lead's, not the engine's. The engine only reports what it
measured.
