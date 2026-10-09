# CLAUDE.md — Next Day Movers

Loaded on every session in this repository. This project is built to the
**Creative Hub OS** standard and policed by the **Creative Hub QA gate**.

Read `CREATIVE-HUB-SOP/MASTER-SOP.md` before changing anything. It outranks
convenience.

## Project

- **Client:** Next Day Movers
- **Business:** Removals and man-and-van across South East London, Kent and Surrey
- **Production domain:** https://nextdaymovers.co.uk
- **Vertical:** movers — see `industries/movers.md` in the `creative-hub-os` skill
- **Primary conversion:** phone call, then the quote form

## Stack

Static HTML/CSS/JS, no build step, deployed on Vercel. Clean URLs and
non-www canonical host are enforced in `vercel.json`, which also carries the
security headers and cache policy.

```bash
chqa audit                              # full QA — must pass before anything ships
chqa smoke https://nextdaymovers.co.uk  # after deployment
```

There is no bundler, so **every asset is hand-maintained**: pages are edited
directly, and shared behaviour lives in `assets/site.js`. A change to one page's
header, footer or schema usually needs the same change on the other 14.

## The gate

`git push` and deploy commands are **blocked** while the QA gate is closed, and a
session cannot be ended with a stale or failing run. Run `chqa audit`, fix what it
reports, re-run. Never describe the site as done while the gate is closed, and
never lower a check to make it pass.

## Hard rules — no exceptions

1. **Never fabricate.** No estimated Lighthouse scores, invented Core Web Vitals,
   rankings, traffic, review counts, ratings, awards or years in business. If it
   wasn't measured, it's `NOT VERIFIED`.
2. **Never mark PASS on anything not inspected or tested.**
3. **Never promise a ranking**, or inclusion in any AI assistant's answers.
4. **Never publish a claim the client hasn't confirmed.** Prices, insurance and
   accreditation claims, review counts and ratings come from the client in
   writing. `claimsVerifiedByClient` in `.creative-hub/qa.config.json` stays
   `false` until that happens — and while it is false the gate stays closed.
5. **Schema must match visible, true content.** No Review or AggregateRating
   without real reviews.
6. **No town-swap location pages.** The six `removals-*.html` pages must each earn
   their place with genuinely local content, not a find-and-replace.

## Escalate, don't decide

Stop and ask before changing pricing, service claims, insurance or accreditation
wording, guarantees, or legal copy in `privacy.html`, `terms.html`, `cookies.html`.

## Engineering standards

- One `<h1>` per page; logical heading order; `<main>` landmark on every page
- Self-referencing absolute canonical on `https://nextdaymovers.co.uk`, no `.html`
- Every `<img>`: `alt`, explicit `width`/`height`, `loading`/`fetchpriority` chosen
  deliberately — the LCP image is never `loading="lazy"`
- The CSP in `vercel.json` forbids inline `<script>`; behaviour goes in
  `assets/site.js`. Adding an inline script silently breaks the page in production
- Forms submit via JS to formsubmit.co — any new form needs a honeypot, a privacy
  notice, and an `aria-live` region for its validation errors
- Google tag fires only after consent; Consent Mode defaults stay `denied`
- `sitemap.xml` must list exactly the indexable pages, and nothing else

## Definition of done — any change

See `CREATIVE-HUB-SOP/DEFINITION-OF-DONE.md`. The automated half is `chqa audit`;
the manual half (Lighthouse, keyboard pass, real test enquiry, cross-browser) is
still yours.

## Reporting

Statuses: `PASS` · `WARNING` · `FAIL` · `NOT APPLICABLE` · `NOT VERIFIED`.
Record every change in `CREATIVE-HUB-SOP/CHANGELOG.md`.
