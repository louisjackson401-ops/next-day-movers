# MASTER SOP — Next Day Movers

**This file is the highest-priority development instruction in this repository.**
It outranks convenience, deadlines, and anything that "looks fine".

Production URL: https://nextdaymovers.co.uk

---

## The one rule

> A website is not done because it looks good, compiles, or scores well on one test.
> It is done when it has passed the gate, with evidence.

Run `chqa audit`. Read `QA-REPORT.md`. Fix. Re-run. Repeat until the gate opens.

---

## Honesty (non-negotiable)

1. **PASS requires verification.** Never mark something passed from code inspection
   alone when it could have been tested. If a tool, credential, live URL or external
   service was unavailable, the status is **NOT VERIFIED** with the access required —
   never PASS, never silence.
2. **Never fabricate.** No estimated Lighthouse scores, invented Core Web Vitals,
   rankings, traffic, review counts, ratings, awards, accreditations, addresses,
   years in business or client numbers. An *estimated* score is a fabricated score.
3. **Never promise a ranking**, and never promise inclusion in ChatGPT, AI Overviews,
   Gemini, Claude, Perplexity or Copilot.
4. **Never publish an unconfirmed claim.** Business facts come from the client in
   writing, never from us. The audit blocks on this by design — see
   `claimsVerifiedByClient` in `.creative-hub/qa.config.json`.

The five statuses, and nothing else:
`PASS` · `WARNING` · `FAIL` · `NOT APPLICABLE` · `NOT VERIFIED`

---

## The pipeline

```
BUILD → AUDIT → FIX → RE-AUDIT → … → GATE → DEPLOY → SMOKE TEST → MONITOR
                 ↑______________|
              loop until the gate opens
```

`chqa audit` covers: code quality · technical SEO · schema · links · images ·
accessibility · security · robots · sitemap · privacy & consent · forms ·
conversion · performance budgets · content claims · AI-search readiness.

`chqa smoke <url>` covers what only a live origin can prove: real response codes,
real security headers, HTTPS and www redirects, 404 behaviour, every route.

## Audit → repair → verify

Never make a batch of changes and assume they worked. After each repair category,
re-run the audit. If it still fails, keep diagnosing until it passes or a genuine
external blocker is identified and named.

Fix directly where the fix is safe, reversible and in scope. **Escalate instead of
fixing** when the change would alter pricing, service claims, credentials,
guarantees, legal copy or brand positioning.

Priority order when fixes conflict:
security → functionality → data integrity → accessibility → performance → SEO →
maintainability → visual polish.

---

## When this runs

Automatically, via the hooks installed in `.claude/settings.json`:

- **Stop hook** — Claude cannot end a session having changed the site without the
  gate being open. A stale QA run counts as closed.
- **Deploy guard** — `git push`, `vercel`, and equivalent deploy commands are
  blocked while the gate is closed.

Manually, after: initial build · design changes · functionality changes · SEO
changes · dependency changes · client revisions · production bug fixes.

---

## The gate

`APPROVED FOR PRODUCTION` requires **zero FAIL findings and zero critical issues.**

Anything less is `NOT READY FOR PRODUCTION`. A failure may only be closed by
fixing it, or by the account lead accepting it in writing and recording that
acceptance in `CHANGELOG.md`. Never by lowering the check.

---

## Depth

This file is the constitution. The full phase guides, per-vertical playbooks,
page prompts and granular checklists live in the `creative-hub-os` skill at
`~/.claude/skills/creative-hub-os/` — `references/`, `checklists/`, `prompts/`.
Load them when you enter a phase.

---

## The final quality test

Before recommending launch, for every important landing page:

> Would this page deserve to rank above the current leading results, because it is
> more useful, more trustworthy, more relevant, faster and easier to use?

If no — name the gap. Fix what is on-site. Flag what is not: content depth,
first-hand evidence, reviews, reputation, Google Business Profile, backlinks.
Do not paper over an authority gap with more markup.
