# Netlify credit usage: diagnosis and fixes

**Status (Oct 12, 2026):** the code changes below are built and tested locally, not yet deployed. The Netlify team is paused: it ran out of credits on the free plan. Deploying needs the plan upgrade and the setup steps in [What's left to do](#whats-left-to-do).

## What happened

- In early October, Netlify showed "RENU Medical is now running on operational credits": production deploys and Agent Runners paused, published sites still live.
- By Oct 12 the whole site was offline ("Site not available"). On the free plan, once credits hit zero every project pauses until the next billing cycle, and extra credits can't be bought without upgrading.
- Sanity content is unaffected. Studio edits are saved and show up once the site is back.

## Diagnosis

Nothing in the build was broken. **The free plan (300 credits a month) is far too small for RENU's traffic**, and the site was making more server requests per visit than it needed to.

### What Netlify charges

From Netlify's [billing FAQ](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/billing-faq-for-credit-based-plans/):

| Usage | Credits |
|---|---|
| Production deploy (every push to `master`, every "Trigger deploy") | 15 per deploy |
| Compute (server functions: page rendering, refreshing, Next.js redirects) | 10 per GB-hour |
| Bandwidth | 20 per GB |
| Web requests | 2 per 10,000 |

| Plan | Price | Credits a month |
|---|---|---|
| Free | $0 | 300 |
| Personal | $9/month | 1,000 |
| Pro | $20/month | 3,000 |

### Where the 300 credits went

- **Deploys: about 120 credits.** There were 8 production deploys from Sept 17 to Sept 30 (the period you checked in Netlify), at 15 credits each.
- **Traffic: about 180 credits.** That left about 180 credits, enough for roughly 5,000 homepage visits. RENU had years of search rankings and steady traffic before the move. On top of that, Google re-crawls everything after a domain change, including the 350 redirected old URLs. That uses 5,000 visits within days.

### Why each visit cost more than it needed to

Measured on a local production build, homepage, cache disabled:

| | Before | After the fixes |
|---|---|---|
| Requests per homepage visit | 66 | 33 |
| Hidden background "prefetch" requests | 25–28 | 0 |
| Images resized and delivered by Netlify | all 18 | 5 small local files only |
| Page refresh from Sanity | every 60 seconds per page | on publish, plus an hourly fallback |
| Old-URL redirects | Next.js server function | Netlify edge (no function) |
| Banner image | 1.8 MB PNG | 82 KB WebP |
| Logo | 59 KB | 7 KB |

Before the fixes, four things made each visit expensive:

1. **Prefetching:** Next.js quietly preloaded every linked page as it scrolled into view, about 28 server requests per homepage visit that the visitor never saw.
2. **Images through Netlify:** every photo stored in Sanity was resized and delivered by Netlify's image service, so Netlify billed about 70% of each visit's bytes.
3. **Redirects as server code:** the 350 old-URL redirects lived in `next.config.ts`, so on Netlify each hit started the Next.js server function. Netlify's docs recommend its own redirect file because it's faster.
4. **60-second refresh:** with `revalidate = 60`, every page was re-rendered on the server up to once a minute while being visited, even when nothing in Sanity had changed.

## Changes made

| # | Change | Files |
|---|---|---|
| 1 | Links no longer prefetch by default. All links go through a wrapper with `prefetch={false}`; pass `prefetch` on a specific link to opt back in. | `src/components/Link.tsx`, plus the import line in 11 files |
| 2 | Sanity images load straight from `cdn.sanity.io` (resized, WebP/AVIF, never upscaled). Local images are served as plain static files. | `src/sanity/lib/image-loader.ts`, `next.config.ts` (`images.loader`) |
| 3 | Redirects are written to Netlify's `_redirects` file before every build, from the same `legacy-redirects.json`. The `next.config.ts` copies stay as a fallback and for local dev. | `scripts/write-netlify-redirects.mjs`, `package.json` (`prebuild`), `.gitignore` (the file is generated) |
| 4 | Pages refresh when Sanity publishes, through a signed webhook to `/api/revalidate/`; the fallback refresh went from 60 seconds to 3,600 (hourly). | `src/app/api/revalidate/route.ts`, `src/app/layout.tsx` |
| 5 | The banner was converted to WebP and the logo resized. The unused hero video and old PNG banner were deleted. | `public/assets/` |

**Tested locally:**
- Production build passes (92 pages).
- All 19 homepage images load.
- Sanity images come back as WebP from `cdn.sanity.io`.
- The webhook endpoint returns 401 for an unsigned call and 200 for a signed one.
- Visual check of the header, banner and Age in Reverse section.
- The `_redirects` file can't be tested locally (see step 5 below).

**Trade-off:** Sanity now delivers the photo bandwidth. Its free plan has its own monthly allowance; check usage at sanity.io/manage.

## What's left to do

1. **Upgrade the Netlify team to Pro ($20/month, 3,000 credits).** This brings the site back online immediately. Personal (1,000 credits) would likely run out again at this traffic level.
2. **Add the environment variable in Netlify:** `SANITY_REVALIDATE_SECRET`. Copy its value from `renu-nextjs/.env.local`. Never commit it.
3. **Create the Sanity webhook:** sanity.io/manage → RENU project → API → Webhooks → Create webhook.
   - URL: `https://renuforyou.com/api/revalidate/` (with the trailing slash)
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - HTTP method: POST
   - Secret: the same value as step 2

   Until this exists, Studio edits still appear within an hour.
4. **Commit and push, as one deploy.** This also ships the Age in Reverse layout (commit `7ad3680`), which is pushed but not yet deployed. If Netlify doesn't start a build on its own, click **Deploys → Trigger deploy**.
5. **Verify after the deploy:**
   - **Edge redirects:** `curl -sI https://renuforyou.com/kybella/` should return `301` with `location: /treatments/kybella/`, and the `server:` header should be `Netlify`. If old URLs return `308` instead, Netlify isn't reading `_redirects`, and the Next.js fallback is handling them.
   - **Webhook:** publish a small edit in the Studio. It should appear on the live site within a few seconds, and the webhook's delivery log in Sanity should show a 200.
6. **About a week later:** check **Netlify → Team → Usage** to see where credits now go (bandwidth, requests, compute, deploys).

## Keeping costs down from here

- **Batch code changes.** Every push to `master` is a production deploy at 15 credits. Work on a branch and merge when a set of changes is done. Content changes in the Sanity Studio never need a deploy.
- **Pre-size local images.** Images in `public/` are served as-is, so add them already web-sized (WebP or JPEG, under ~200 KB). Photos uploaded to Sanity are resized automatically.
- **Add old URLs to the redirect list.** Put new ones in `legacy-redirects.json`; the Netlify file regenerates on the next build.
- **Leave prefetching off.** Only use `prefetch` on a link that's clearly worth it.
