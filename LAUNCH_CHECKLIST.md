# Next Day Movers — Go-Live Checklist

Everything needed before pointing **nextdaymovers.co.uk** at this site. Items marked ✅ are already done in the code; ⬜ are actions for you (or things to confirm).

---

## ✅ Already done (in the code)

- ✅ **5 pages built & linked** — Home, Services, Gallery, Instant Quote, Contact (nav + footer consistent, mobile menu works).
- ✅ **No broken links or missing images** — full audit passed (146 photos, all references valid).
- ✅ **Unique SEO title + meta description** on every page.
- ✅ **Open Graph + Twitter cards** on every page (nice link previews in WhatsApp / Facebook / iMessage / X) + branded share image at `assets/og-image.png` (1200×630).
- ✅ **Canonical URLs** on every page (prevents duplicate-content issues).
- ✅ **Structured data (JSON-LD)** — `MovingCompany` schema on the homepage (name, phone, hours, area served, 5.0 rating) → helps Google show rich local results.
- ✅ **sitemap.xml** and **robots.txt** (robots points crawlers to the sitemap).
- ✅ **Custom 404 page** (branded, with links back).
- ✅ **Favicon** (gold-truck tile) in SVG + PNG for tabs and phone home-screens.
- ✅ **Forms email you** at nextdaymoversuk@gmail.com via FormSubmit (quote + contact).
- ✅ **Image orientation baked in** so photos display correctly in every browser.
- ✅ **Responsive** (desktop / tablet / mobile) with a sticky call/quote bar on mobile.

---

## ⬜ Before you flip the domain — REQUIRED

1. ⬜ **Pick a host & deploy the site.** It's a plain static site (HTML/CSS/JS + images), so any of these work — all free tier, all support custom domains + free HTTPS:
   - **Netlify** or **Vercel** — drag-and-drop the `Next Day Movers web` folder, or connect a GitHub repo.
   - **Cloudflare Pages** or **GitHub Pages** — also fine.
2. ⬜ **Point the domain.** In your domain registrar's DNS, add the records your host gives you (usually a CNAME/A record). Then add `nextdaymovers.co.uk` as a custom domain in the host dashboard.
3. ⬜ **Force HTTPS** and **pick www _or_ non-www** (redirect the other). This site uses **non-www** (`https://nextdaymovers.co.uk/`) everywhere — so set the host to redirect `www → non-www`. (If you'd rather use www, tell me and I'll flip the canonical/sitemap URLs.)
4. ⬜ **Activate the form on the live domain.** The first time the live site's quote form is submitted, FormSubmit emails you an *"Activate Form"* link (check Spam/Promotions) — click it once. After that all quote + contact submissions arrive in your inbox. *(Already activated for the nextdaymovers.co.uk address during testing, so this may already be live.)*
5. ⬜ **Hide your email from scrapers.** Right now `nextdaymoversuk@gmail.com` is visible in the site's JS. After activating, get your FormSubmit **random alias** (from your dashboard) and I'll swap it in so the address isn't exposed.

> ⚠️ **If you deploy to a URL other than `nextdaymovers.co.uk`** (e.g. a Netlify preview or a different domain), tell me the final URL — I need to update the domain in: canonical tags, OG/Twitter tags, `sitemap.xml`, `robots.txt`, and the JSON-LD. It's a 2-minute find-and-replace once you know the address.

---

## ⬜ SEO — do these right after launch

6. ⬜ **Google Search Console** (free) — add & verify the site, then **submit `sitemap.xml`**. This gets you indexed fast and shows any crawl errors.
7. ⬜ **Bing Webmaster Tools** — same idea (cheap extra traffic).
8. ⬜ **Google Business Profile** — claim/refresh your listing (address, hours, phone, photos, service areas). For a local mover this is the single biggest SEO lever, alongside reviews.
9. ⬜ **Confirm the review count** — the homepage schema currently says `reviewCount: 7` (the reviews shown on the page). Tell me your real Google review total and I'll update it (don't inflate it — Google can penalise mismatches).
10. ⬜ **Add a real business address** if you have one — a full `PostalAddress` (street, town, postcode) in the schema strengthens local ranking. Right now it's just region "Kent, GB".

**Target keywords the site is already optimised for** (in titles, H1s, and body — note: the old "meta keywords" tag is ignored by Google, so it's deliberately not used):
`house removals London` · `removals Kent` · `flat / apartment removals` · `office removals` · `man and van London/Kent` · `waste clearance London/Kent` · `next day removals` · plus town pages' worth of `Bromley / Croydon / Dartford / Bexley / Gravesend / Maidstone / Sevenoaks`.

> ✅ **Location pages — DONE:** 6 town landing pages live with unique copy each — `removals-bromley`, `removals-croydon`, `removals-dartford`, `removals-sevenoaks`, `removals-maidstone`, `removals-bexley`. Each has its own title/meta/H1, local `MovingCompany` schema, and is internally linked (homepage "Areas we cover" section + footer on every page) and in the sitemap. **Want more towns?** Just give me the list and I'll add them (Orpington, Beckenham, Gravesend, Swanley, etc.).

---

## ⬜ Content to double-check (yours to confirm)

11. ⬜ **Phone** `07777 622437` and **WhatsApp** `+44 7777 622437` — correct?
12. ⬜ **Email** shown on Contact is `hello@nextdaymovers.co.uk` — is that a real inbox, or should it be `nextdaymoversuk@gmail.com`?
13. ⬜ **Prices** — the instant-quote estimate ranges are ballpark figures I set (e.g. 2-bed ≈ £380–£560). Confirm they're in the right zone, or give me your real pricing and I'll tune the calculator.
14. ⬜ **Google review links** — the "Read our reviews / Review us on Google" links use share URLs; confirm they open your listing.

---

## ⬜ Nice-to-have (not blockers)

15. ⬜ **Analytics** — add Google Analytics 4 (or privacy-friendly Plausible/Fathom) so you can see traffic & which pages convert. I can drop the snippet in.
16. ⬜ **Cookie/consent banner** — only needed if you add analytics/marketing cookies (GA4 counts). I can add a lightweight one.
17. ✅ **Unused photos trimmed** — `assets/photos/` pruned to the 37 in use; deploy is now ~12 MB (was ~65 MB). Originals remain on your Desktop.
18. ⬜ **Auto-reply to customers** — FormSubmit can send an automatic "thanks, we'll be in touch" email to whoever submits. Easy add.

---

## Final pre-flip QA (I can run this for you)

- ⬜ Every page loads with no console errors
- ⬜ All nav + footer links work on every page
- ⬜ Quote form + contact form submit and email through
- ⬜ Looks right on a real phone (or emulated mobile)
- ⬜ Favicon shows in the tab
- ⬜ Link preview looks right (test at opengraph.xyz once live)

*Last updated: 2026-07-16*
