# Plan: Vercel Deployment

> Source PRD: https://github.com/carlos-rezai/PawBrief/issues/28

## Architectural decisions

Durable decisions that apply across all phases:

- **Deploy mechanism**: Vercel ↔ GitHub Git integration. `main` is the production
  branch (auto-deploy on push); every pull request gets its own preview deployment.
  No manual `vercel` CLI deploys.
- **Build detection**: Vercel auto-detects Vite (`npm run build` → `dist`). `dist/`
  stays gitignored — no hand-configured build command or output directory.
- **CSP**: The existing `Content-Security-Policy` in `vercel.json` is retained
  **verbatim** (`default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none';
frame-ancestors 'none'`). It is never relaxed by this work.
- **SPA rewrite**: The existing `/(.*)` → `/index.html` rewrite in `vercel.json` is
  retained so client-side routes deep-link correctly.
- **No host hardcoded**: Neither the CSP nor any config hardcodes a host, so a custom
  domain can be attached later with zero rework.
- **Runtime**: Node `22.x` pinned in all three environments — `package.json` engines,
  the Vercel project setting, and the CI runner.
- **Font assets**: The five static Plus Jakarta Sans `.ttf` instances already bundled
  for the PDF layer (`src/assets/fonts/`: Regular, Medium, SemiBold, Bold, ExtraBold)
  are reused as same-origin web assets — no new files downloaded.
- **Telemetry**: None. No Vercel Web Analytics / Speed Insights — both beacon to
  third-party origins and would breach `connect-src 'self'`.
- **Domain**: Free `*.vercel.app` subdomain for the first launch. Custom domain
  deferred (out of scope).
- **Testing posture**: One automated test for the whole initiative (the font guard
  test). The `vercel.json` headers, CI workflow, Node pin, SPA rewrite, and absence of
  third-party requests are infrastructure — verified on deploy via curl / an
  SSL-headers scanner and the browser network panel, not unit-tested.

---

## Phase 1: Self-host brand font + guard test (#27)

**User stories**: 4, 5, 7, 18, 20, 21

### What to build

The thinnest end-to-end slice and the only change gating a correct-looking first
deploy — so it ships first. Register the five bundled Plus Jakarta Sans `.ttf`
instances as a same-origin web font via an `@font-face` rule in the global stylesheet,
mapped to the right weights (400/500/600/700/800). Remove the Google Fonts
`<link>` and `preconnect` tags from `index.html`. The strict CSP already permits this
(`style-src 'self' 'unsafe-inline'`, `font-src 'self'`) and is left unchanged. Add the
regression guard test that locks the fix in. After this phase the web UI renders in
Plus Jakarta Sans locally with no request to Google.

### Acceptance criteria

- [ ] The global stylesheet registers a `Plus Jakarta Sans` `@font-face` family sourced
      only from the bundled same-origin `.ttf` assets (no external origin in any `src`).
- [ ] `index.html` contains no `fonts.googleapis.com` or `fonts.gstatic.com` references
      (the `<link>` and both `preconnect` tags are gone).
- [ ] The CSP in `vercel.json` is unchanged.
- [ ] A guard test beside `GlobalStyles.ts` asserts both: no Google Fonts references in
      `index.html`, and the `Plus Jakarta Sans` `@font-face` is registered in the global
      stylesheet.
- [ ] The web UI renders in Plus Jakarta Sans when run locally (`npm run dev`), not a
      system-font fallback.
- [ ] `npm run typecheck`, `npm run test`, and `npm run lint` all pass.

---

## Phase 2: Harden `vercel.json`

**User stories**: 11, 12, 14, 17

### What to build

Add the standard hardening headers alongside the existing CSP in the same `/(.*)`
header block, raising the live response surface to an A-grade while leaving every prior
security decision intact. The CSP and the SPA rewrite are kept verbatim; no host is
hardcoded.

### Acceptance criteria

- [ ] `vercel.json` adds, in the existing `/(.*)` header block:
      `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`,
      `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`,
      `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`,
      and `X-Frame-Options: DENY`.
- [ ] The existing `Content-Security-Policy` value is unchanged.
- [ ] The `/(.*)` → `/index.html` rewrite is unchanged.
- [ ] No host or origin is hardcoded anywhere in `vercel.json`.

---

## Phase 3: Pin Node 22.x + CI gate

**User stories**: 8, 10, 13

### What to build

Pin the runtime so local, CI, and production builds don't drift, and stand up the merge
gate. Add `"engines": { "node": "22.x" }` to `package.json`. Add a GitHub Actions
workflow that triggers on pull requests into `main` and runs `npm ci` → `npm run
typecheck` → `npm run test` → `npm run lint` on Node 22.x. (Vercel's Node setting is
aligned in Phase 5 when the project is connected.)

### Acceptance criteria

- [ ] `package.json` declares `"engines": { "node": "22.x" }`.
- [ ] A GitHub Actions workflow runs on PRs targeting `main`.
- [ ] The workflow uses Node 22.x and runs `npm ci`, then typecheck, test, and lint.
- [ ] The workflow passes green on a PR built from current `main`.

---

## Phase 4: Branch protection on `main`

**User stories**: 9

### What to build

Enforce the gate: configure branch protection on `main` so a pull request cannot be
merged (and therefore cannot auto-deploy) unless the Phase 3 CI check is green. Requires
the CI check to have run at least once on a PR so GitHub can offer it as a required
status check.

### Acceptance criteria

- [ ] `main` has branch protection requiring the CI status check to pass before merge.
- [ ] A PR with a failing CI check cannot be merged.
- [ ] A PR with a green CI check can be merged.

---

## Phase 5: Connect Vercel + first production deploy + verification

**User stories**: 1, 2, 3, 6, 15, 16, 19

### What to build

Connect the GitHub repo to a Vercel project via Git integration so `main` is the
production branch (auto-deploy on push) and every PR gets its own preview URL. Rely on
Vite auto-detection, set the project's Node version to 22.x, and add no analytics or
telemetry. Ship on the free `*.vercel.app` subdomain. Then verify the launch preserved
the design and security posture.

### Acceptance criteria

- [ ] The Vercel project is connected to the GitHub repo with `main` as the production
      branch; pushing to `main` auto-deploys.
- [ ] Opening a pull request produces a preview deployment URL.
- [ ] The project uses Node 22.x and Vite auto-detection (`npm run build` → `dist`).
- [ ] The live site is reachable on a `*.vercel.app` URL and PawBrief is fully usable.
- [ ] **Font**: the live web UI renders in Plus Jakarta Sans (browser network panel /
      computed styles), not a fallback.
- [ ] **Headers**: HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy,
      X-Frame-Options, and the unchanged CSP are all present on the live response
      (curl / Mozilla Observatory).
- [ ] **Deep links**: directly navigating to / refreshing a client-side route (e.g. a
      wizard step or profile route) resolves via the SPA rewrite — no 404.
- [ ] **No third-party requests**: the browser network panel shows zero requests to
      Google Fonts, analytics, or any non-`'self'` origin.
- [ ] No analytics or telemetry is enabled on the project.
