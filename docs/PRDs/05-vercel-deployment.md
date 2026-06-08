# Vercel Deployment: ship PawBrief's first production deploy without walking back its security posture

## Problem Statement

PawBrief is finished and has passed its pre-deployment security review, but it has
never been deployed. It lives only on the developer's machine — there is no URL the
owner can visit, nothing to share as a portfolio piece, and no way for a pull request
to be previewed before it lands. The developer wants to put PawBrief on the public
internet, but the project advertises a deliberate privacy and security stance
(strict `'self'`-only CSP, no backend, no third-party requests, no telemetry), and a
careless deploy would quietly contradict that story. Two concrete risks stand out:

1. The strict CSP blocks the Google-Fonts web UI font, so a naive deploy would render
   the live site in a system-font fallback — a visibly-broken first impression on a
   project whose whole point is polish.
2. With nothing gating a merge to the production branch, a bad commit would ship
   straight to the live URL.

## Solution

Stand up the first production deploy on Vercel using Git integration: `main` is the
production branch and auto-deploys on push, while every pull request gets its own
preview deployment. Before that first deploy, self-host Plus Jakarta Sans so the brand
typeface renders under the unchanged strict CSP (tracked as the already-open issue
#27). Harden the response surface by adding the standard security headers alongside the
existing CSP in `vercel.json`. Gate every merge to `main` behind a GitHub Actions CI
check (typecheck + test + lint) enforced by branch protection, and pin Node 22.x
everywhere to prevent build drift. Ship on the free `*.vercel.app` subdomain with zero
third-party telemetry. The result is a push-to-deploy workflow with shareable PR
previews and an A-grade header surface that backs up the documented security review —
with no host hardcoded, so a custom domain can be attached later for free.

## User Stories

1. As the owner, I want to visit a public URL and use PawBrief, so that I don't need
   the developer's local machine to create a care guide.
2. As the developer, I want PawBrief deployed on Vercel via GitHub integration, so that
   pushing to `main` automatically ships the live site.
3. As the developer, I want every pull request to get its own preview deployment URL,
   so that I can review a change in a real hosted environment before merging.
4. As the developer, I want the live web UI to render in Plus Jakarta Sans, so that the
   deployed portfolio piece looks as designed and not in a system-font fallback.
5. As the developer, I want the brand font self-hosted same-origin, so that the strict
   `'self'`-only CSP stays unchanged and no request is made to Google.
6. As a privacy-conscious owner, I want no third-party requests on the live site, so
   that my IP and browsing are not shared with Google Fonts or any analytics vendor.
7. As the developer, I want the Google Fonts `<link>` and `preconnect` tags removed
   from `index.html`, so that there is no dead external reference once the font is
   self-hosted.
8. As the developer, I want a CI check (typecheck + test + lint) to run on every PR
   into `main`, so that broken code is caught before it can merge.
9. As the developer, I want branch protection on `main` requiring that CI check to be
   green, so that a failing PR cannot be merged and auto-deployed.
10. As the developer, I want Node 22.x pinned in `package.json`, the Vercel project, and
    the CI runner, so that local, CI, and production builds all use the same runtime and
    don't drift.
11. As the developer, I want the existing CSP retained verbatim, so that the security
    decisions from the review are not silently relaxed by the deploy work.
12. As the developer, I want the standard hardening headers (HSTS, X-Content-Type-Options,
    Referrer-Policy, Permissions-Policy, X-Frame-Options) added alongside the CSP, so
    that the live response surface scores well and closes trivial gaps.
13. As the developer, I want Vite auto-detected by Vercel (`npm run build` → `dist`), so
    that I don't have to hand-configure the build command and output directory.
14. As the owner, I want deep links (e.g. a wizard step or a profile route) to resolve
    on the live site, so that refreshing or sharing a URL doesn't 404 — the SPA rewrite
    must serve `index.html`.
15. As the developer, I want zero analytics or telemetry on the live site, so that the
    documented "no network transmission" promise holds and `connect-src 'self'` is not
    breached.
16. As the developer, I want to ship on the free `*.vercel.app` subdomain first, so that
    I can launch without buying or configuring a custom domain.
17. As the developer, I want no host hardcoded in the CSP or config, so that attaching a
    custom domain later requires no rework.
18. As the developer, I want a regression guard test for the font slice, so that the
    Google Fonts tags can't silently creep back into `index.html` and the self-hosted
    `@font-face` registration can't be accidentally dropped.
19. As the developer verifying the first deploy, I want to confirm the brand font
    renders, deep links resolve, all hardening headers are present, and the network
    panel shows no third-party requests, so that I know the launch preserved the
    security and design posture.
20. As the developer, I want the font self-host to land first as its own slice, so that
    a correct-looking deploy is the very first thing proven end-to-end.
21. As the developer hitting an unexpected font-loading failure under the CSP, I want the
    `@font-face` sources to be same-origin bundled assets, so that there is no fallback
    path that reaches an external origin even on error.

## Implementation Decisions

- **Deploy mechanism:** Vercel ↔ GitHub Git integration. `main` is the production branch
  (auto-deploy on push); every PR gets a preview deployment. Manual `vercel` CLI deploys
  were rejected — no automatic PR previews and easy to forget.
- **Font self-hosting (#27) lands first:** This is the thinnest end-to-end slice and the
  only change gating a correct-looking first deploy, so it ships before the infra work.
  The five static Plus Jakarta Sans `.ttf` instances already bundled for the PDF layer
  (`src/assets/fonts/`) are reused as web assets, registered via an `@font-face` rule in
  the global stylesheet. The Google Fonts `<link>` and `preconnect` tags are removed from
  `index.html`. The CSP is unchanged — `style-src 'self' 'unsafe-inline'`,
  `font-src 'self'` already permit a same-origin web font.
- **CSP retained unchanged:** The existing `Content-Security-Policy` value in `vercel.json`
  is kept verbatim. Relaxing it to allow Google Fonts origins was explicitly rejected as
  walking back a deliberate security decision.
- **Hardening headers added to `vercel.json`:** In the same `/(.*)` header block as the
  CSP, add `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`,
  `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`, and
  `X-Frame-Options: DENY`. Shipping CSP-only was rejected as leaving trivially-closable
  gaps. (`frame-ancestors 'none'` already in the CSP plus `X-Frame-Options: DENY` is
  intentional belt-and-suspenders for older agents.)
- **CI gate:** A new GitHub Actions workflow triggered on PRs into `main`, running
  `npm ci` → `npm run typecheck` → `npm run test` → `npm run lint` on Node 22.x. Folding
  only `typecheck` into the Vercel build command was rejected — it silently skips the
  test suite.
- **Branch protection:** `main` requires the CI check to pass before a PR can merge.
- **Runtime pin:** `"engines": { "node": "22.x" }` in `package.json`, mirrored in the
  Vercel project setting and the CI runner. Vite 8 / React 19 need a modern Node;
  pinning prevents build drift across the three environments.
- **Build detection:** Rely on Vercel's Vite auto-detection (`npm run build` → `dist`).
  `dist/` stays gitignored.
- **SPA rewrite retained:** The existing `/(.*)` → `/index.html` rewrite in `vercel.json`
  is kept so client-side routes deep-link correctly.
- **Domain:** Free `*.vercel.app` subdomain now. Custom domain deferred — the CSP
  hardcodes no host, so attaching one later is rework-free.
- **Telemetry:** None. Vercel Web Analytics / Speed Insights both beacon to third-party
  origins, which would require relaxing `connect-src 'self'` and contradict the
  no-transmission promise. Zero third-party telemetry.
- **Relationship to #27:** Issue #27 (self-host Plus Jakarta Sans) was raised by the
  security review and is already an open GitHub issue. It is folded into this deployment
  initiative as its first phase rather than tracked separately — it is the prerequisite
  that gates the first production deploy.

## Testing Decisions

- **What makes a good test here:** assert externally observable outcomes, not
  implementation details. For the font slice that means asserting _what the document and
  global stylesheet contain_ (no external font origins; the brand `@font-face` family is
  registered), not how styled-components happens to inject it.
- **Font guard test (the one automated test for this initiative):** a regression test
  that asserts `index.html` contains no `fonts.googleapis.com` / `fonts.gstatic.com`
  references and that the global stylesheet registers the `Plus Jakarta Sans`
  `@font-face`. This locks in the #27 fix so the Google Fonts tags cannot silently
  return and the self-hosted registration cannot be accidentally dropped.
- **Prior art:** `src/styles/GlobalStyles.test.tsx` and `src/features/pdf/pdfFonts.test.ts`
  already test the global stylesheet and the PDF font registration respectively — the new
  guard test follows the same shape and lives beside `GlobalStyles.ts`.
- **Everything else is verified, not unit-tested:** the `vercel.json` headers, the CI
  workflow, the Node pin, the SPA rewrite, and the absence of third-party requests are
  infrastructure. They are verified on the first deploy via curl / an SSL-headers
  scanner (e.g. Mozilla Observatory) for the response headers, the browser network panel
  for third-party requests and the live brand font, and direct navigation to a deep link
  for the SPA rewrite. A headers-parsing unit test was considered and deliberately left
  out of scope for this initiative.

## Out of Scope

- **Custom domain** — ship on `*.vercel.app`; can be attached later with no rework since
  no host is hardcoded.
- **Analytics / telemetry / Speed Insights** — contradicts `connect-src 'self'` and the
  no-transmission promise.
- **Open Graph / social-share meta tags** — can be added post-launch without rework.
- **Any backend, account system, or server-side rendering** — contradicts PawBrief's
  no-backend premise.
- **An automated test of the `vercel.json` headers** — verified by curl / Observatory on
  deploy instead (see Testing Decisions).

## Further Notes

- The first three out-of-scope items can all be added after launch without rework; only
  the backend is a permanent non-goal.
- Trade-off accepted: auto-deploy on `main` means a bad merge ships, mitigated by the CI
  gate plus branch protection. Self-hosting the font is upfront work before launch, but
  it is the only path that preserves both the strict CSP and the brand typeface.
- Source design log: `docs/design-logs/05-vercel-deployment.md`. Security review that
  cleared the deploy: `docs/security/security-review-2026-06-07.md` (no Blocking findings).
- Suggested phasing for `prd-to-plan`: (1) self-host font + guard test (#27), (2) harden
  `vercel.json` headers, (3) pin Node 22.x, (4) add CI workflow, (5) configure Vercel
  project, (6) enable branch protection, (7) first production deploy + verification.
