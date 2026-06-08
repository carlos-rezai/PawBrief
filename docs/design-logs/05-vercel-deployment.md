# 05 — Vercel Deployment

## Background

PawBrief is a fully client-side React + Vite app with no backend, no auth, and no
external APIs. The security review ([04 — Security Review](04-security-review.md))
passed with no Blocking findings, clearing the app for its first public deploy.
A `vercel.json` already exists with a strict `'self'`-only CSP and SPA rewrites,
and `dist/` is gitignored. This is the launch to Vercel.

## Problem

Stand up the first production deploy on Vercel without walking back the privacy and
security posture the project advertises, and without shipping a visibly-broken first
impression. Decide the deploy mechanism, what gates a release, the runtime, the
response-header surface, and what is explicitly out of scope.

## Questions and Answers

**Q: How should deploys happen — Git integration or manual CLI?**
A: Vercel ↔ GitHub Git integration. `main` is the production branch (auto-deploy on
push); PRs get preview deployments.

**Q: The strict CSP blocks the Google-Fonts web UI font (#27). Fix before deploy or after?**
A: Fix #27 first. Self-host Plus Jakarta Sans, remove the Google Fonts `<link>` +
`preconnect` tags, keep the strict `'self'`-only CSP. Deploying with a silent
system-font fallback on a portfolio piece is not acceptable; relaxing the CSP to allow
Google Fonts was rejected as walking back a deliberate security decision.

**Q: What gates a production deploy?**
A: A GitHub Actions CI workflow on PRs into `main` running `typecheck` + `test` +
`lint`, with branch protection requiring it green before merge. Folding only
`typecheck` into the Vercel build command was rejected — it silently skips the test
suite.

**Q: Custom domain or `*.vercel.app`?**
A: Ship on the free `*.vercel.app` subdomain (e.g. `pawbrief.vercel.app`). Custom
domain deferred — the CSP hardcodes no host, so attaching one later is rework-free.

**Q: Any analytics / telemetry on the live site?**
A: None. Vercel Web Analytics / Speed Insights both beacon to third-party origins,
which would require relaxing `connect-src 'self'` and contradict the documented
"no network transmission" promise. Zero third-party telemetry.

**Q: What Node version on Vercel?**
A: Pin Node 22.x everywhere — `"engines"` in `package.json`, Vercel project setting,
and the CI runner — to prevent build drift (Vite 8 / React 19 need a modern Node).

**Q: What response headers should the deploy send?**
A: Keep the existing CSP and add the standard hardening set (HSTS, X-Content-Type-Options,
Referrer-Policy, Permissions-Policy, X-Frame-Options). Shipping CSP-only was rejected as
leaving trivially-closable gaps on a project advertising its security review.

## Design

### Deploy mechanism

✅ Vercel ↔ GitHub Git integration; `main` = production (auto-deploy), PRs = previews
❌ Manual `vercel` CLI deploys — no auto PR previews, easy to forget

### Prerequisite work (must land before first deploy)

Issue **#27 — self-host Plus Jakarta Sans**:

- Bundle the static font instances (already present for the PDF layer) as web assets
- Register them via `@font-face` in the global stylesheet
- Remove the Google Fonts `<link>` and `preconnect` tags from `index.html`
- CSP in `vercel.json` is unchanged — stays `style-src 'self' 'unsafe-inline'`,
  `font-src 'self'`

### CI gate

New GitHub Actions workflow, triggered on PRs into `main`:

```
node: 22.x
steps: npm ci → npm run typecheck → npm run test → npm run lint
```

Branch protection on `main` requires this check to pass before merge.

### Runtime pin

```jsonc
// package.json
"engines": { "node": "22.x" }
```

Mirrored in Vercel project settings and the CI runner matrix.

### Response headers (`vercel.json`)

Existing `Content-Security-Policy` retained unchanged. Add to the same `/(.*)` header block:

| Header                      | Value                                                          |
| --------------------------- | -------------------------------------------------------------- |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload`                 |
| `X-Content-Type-Options`    | `nosniff`                                                      |
| `Referrer-Policy`           | `no-referrer`                                                  |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |
| `X-Frame-Options`           | `DENY`                                                         |

### Domain

✅ `*.vercel.app` subdomain now
❌ Custom domain — deferred, no rework cost to add later

### Telemetry

❌ Vercel Analytics / Speed Insights — would breach `connect-src 'self'` and the
no-transmission promise. Zero third-party telemetry.

## Implementation Plan

1. **Self-host the web font (#27).** Add `@font-face` for Plus Jakarta Sans from
   bundled assets, remove Google Fonts tags from `index.html`. Verify in a real
   browser that the UI renders the brand font under the strict CSP. _(Thinnest
   end-to-end slice — the only change gating a correct-looking first deploy.)_
2. **Harden `vercel.json` headers.** Add the five hardening headers alongside the
   existing CSP.
3. **Pin Node 22.x.** Add `engines` to `package.json`.
4. **Add CI workflow.** GitHub Actions running typecheck + test + lint on PRs to `main`.
5. **Configure Vercel project.** Connect the GitHub repo, confirm Vite auto-detection
   (`npm run build` → `dist`), set Node 22.x, set `main` as production branch.
6. **Enable branch protection** on `main` requiring the CI check.
7. **First production deploy** + verify: live brand font renders, deep links resolve
   (SPA rewrite), response headers present (Observatory / curl), no third-party
   requests in the network panel.

## Trade-offs

**Easier:** Push-to-deploy with shareable PR previews; a meaningful green check before
merge; an A+-grade header surface that backs up the security-review story; no host
hardcoded, so a custom domain drops in later for free.

**Harder:** Auto-deploy on `main` means a bad merge ships — mitigated by the CI gate +
branch protection. Self-hosting the font is upfront work before launch, but it is the
only path that preserves both the strict CSP and the brand typeface.

**Out of scope:** Custom domain, analytics/telemetry, Open Graph / social-share meta
tags, and any backend. The first three can be added post-launch without rework; the
last contradicts the product's no-backend premise.
