# 04 — Security Review

## Background

PawBrief is a fully client-side app with no backend, no auth, and no external APIs. It generates printable PDF care guides from user-entered cat profile data stored in IndexedDB. The security review is a pre-deployment gate before the Vercel launch.

## Problem

Before shipping to a public URL, verify there are no exploitable vulnerabilities in the client-side surface: input handling, file uploads, PDF generation, storage, CSP headers, and dependencies.

## Questions and Answers

**Q: What does "done" look like for this security review?**
A: A structured audit producing a written findings report, with inline fixes applied. Vercel deploy is gated on passing.

**Q: Where does the report live?**
A: `docs/security/security-review-2026-06-07.md` — dedicated `docs/security/` folder, date-stamped filename.

**Q: Should the review include a live `npm audit` run?**
A: Yes. Included as a concrete pass/fail gate before deploy.

**Q: When a genuine issue is found, fix inline or open a GitHub issue?**
A: Low-effort fixes applied inline. Anything requiring significant rework → GitHub issue, noted as blocking or non-blocking in the report.

**Q: What severity model for findings?**
A: Three tiers — **Blocking** (must fix before deploy), **Non-blocking** (should fix, doesn't gate deploy), **Informational** (noted by design, no action required).

**Q: Should we investigate tightening `unsafe-inline` on `script-src`?**
A: Yes — test whether Vite's production bundle works without it. `style-src unsafe-inline` stays as Informational (styled-components runtime injection is unavoidable).

**Q: Should we add magic byte validation to photo uploads?**
A: Yes — `file.type` is browser-reported and spoofable. Add magic byte check for JPEG/PNG/GIF/WebP as a non-blocking inline fix in `validatePhoto.ts`.

**Q: Where does the `/security-review` skill run fit in the workflow?**
A: Tracked as a separate GitHub issue. Run after all inline fixes are applied, as a final validation pass on our own changes.

## Design

### Scope

| Area              | What to check                                        |
| ----------------- | ---------------------------------------------------- |
| Input handling    | XSS surface, text fields, no eval/innerHTML          |
| File upload       | MIME type spoofing, magic bytes, size limit          |
| IndexedDB storage | Plaintext by design, no transmission                 |
| PDF generation    | Data flow into PDF, URL construction                 |
| CSP headers       | `vercel.json` directives, `unsafe-inline` tightening |
| Dependencies      | `npm audit` — high/critical findings are blocking    |
| Route params      | UUID keys, no reflection                             |

### Report structure

```
docs/security/
└── security-review-2026-06-07.md
```

Each finding entry:

```
### [AREA] Finding title
Severity: Blocking | Non-blocking | Informational
Status: Fixed inline | GitHub issue #N | Accepted by design
Description: ...
```

### Inline fix: magic byte validation

✅ Add `validateMagicBytes(file: File): Promise<boolean>` to `src/utils/validatePhoto.ts`  
Check first 4 bytes against: JPEG `FF D8 FF`, PNG `89 50 4E 47`, GIF `47 49 46 38`, WebP `52 49 46 46`  
❌ Rely on `file.type` alone — browser-reported, spoofable by renaming

### Inline fix: CSP `script-src`

✅ Test removing `unsafe-inline` from `script-src` in `vercel.json` against Vite prod build  
❌ Leave as-is without testing — missed hardening opportunity

## Implementation Plan

1. **Run `npm audit`** — log findings, fix any high/critical inline
2. **Static review pass** — walk every surface area in scope, note findings
3. **Apply inline fixes** — magic byte validation, CSP script-src test
4. **Write report** — `docs/security/security-review-2026-06-07.md`
5. **Open GitHub issue** — track `/security-review` skill run as follow-up validation step

## Trade-offs

**Easier:** Clear deploy gate, findings are auditable, inline fixes improve actual security posture.  
**Harder:** Nothing significant — small attack surface makes this tractable.  
**Out of scope:** Penetration testing, runtime attack simulation, server-side hardening (no server exists).
