## Problem Statement

PawBrief is a fully client-side app that stores cat profile data — including photos — in IndexedDB and generates PDFs client-side with no server or backend. Before deploying to a public Vercel URL, the owner needs confidence that the app has no exploitable vulnerabilities in its client-side surface: file uploads accept browser-reported MIME types that can be spoofed, the CSP `script-src` directive includes `unsafe-inline` which may be unnecessarily permissive, and no structured audit of all input and storage surfaces has ever been completed. Without this audit, shipping to production means accepting unknown risk.

## Solution

Run a structured security audit of every client-side surface in scope — input handling, file uploads, IndexedDB storage, PDF generation, CSP headers, and dependencies — producing a written findings report in `docs/security/`. Apply low-effort inline fixes directly (magic byte validation for photo uploads, CSP `script-src` tightening). Any finding requiring significant rework is opened as a GitHub issue. The Vercel deploy is gated on no Blocking findings remaining open.

## User Stories

1. As an owner, I want photo uploads to be validated by actual file content, not just browser-reported MIME type, so that a renamed non-image file cannot be stored in IndexedDB as if it were an image.
2. As an owner, I want my profile data stored safely in IndexedDB, so that no external site or script can read or transmit it.
3. As an owner, I want the app to have a tightened Content Security Policy, so that injected scripts cannot execute even if a third-party dependency is compromised.
4. As an owner, I want all third-party dependencies to have no known high or critical vulnerabilities, so that the app is safe to use from day one.
5. As an owner, I want a documented record of what was reviewed and what was found, so that future developers can understand the security posture at launch.
6. As an owner, I want inline fixes applied for low-effort improvements, so that the app ships with the strongest reasonable security posture.
7. As an owner, I want any unfixed issue clearly labeled as Blocking, Non-blocking, or Informational in the report, so that the deploy decision is unambiguous.
8. As an owner, I want text inputs to be free from XSS risk even if a renderer or library ever surfaces their content as HTML, so that malicious input cannot execute as code.
9. As an owner, I want URL construction (vet Maps link) to use proper encoding so that a crafted vet address cannot inject query parameters or redirect to a malicious URL.
10. As an owner, I want the PDF generation data flow to be audited so that profile data cannot be exfiltrated through a malicious URL or resource load in the PDF.
11. As an owner, I want route-level parameters (profile UUIDs) to be validated as non-reflective, so that a crafted URL cannot inject content into the page.
12. As a future developer, I want a written security report on file, so that I know what was considered at launch and can reference it when making changes to security-sensitive code paths.
13. As a future developer, I want `validateMagicBytes` to have complete unit test coverage, so that I can extend it confidently if new image formats are supported.

## Implementation Decisions

### Modules to build or modify

**`validatePhoto.ts` (modify — inline fix)**
Add an async `validateMagicBytes(file: File): Promise<boolean>` function alongside the existing synchronous `validatePhoto`. It reads the first 12 bytes of the file as a `Uint8Array` and checks them against known magic byte signatures:

- JPEG: `FF D8 FF` (bytes 0–2)
- PNG: `89 50 4E 47` (bytes 0–3)
- GIF: `47 49 46 38` (bytes 0–3)
- WebP: `52 49 46 46` at bytes 0–3 AND `57 45 42 50` at bytes 8–11

Call sites that invoke `validatePhoto` must also call `validateMagicBytes` and reject the upload if it returns `false`. The function is async so call sites will need to `await` it.

**`vercel.json` (modify — inline fix, conditional)**
Test whether removing `unsafe-inline` from `script-src` breaks the Vite production build. If the prod bundle works without it, remove it. If styled-components or Vite requires it, leave `script-src` as-is and record the finding as Informational. `style-src unsafe-inline` stays regardless — styled-components runtime injection is unavoidable.

**`docs/security/security-review-2026-06-07.md` (create)**
Written findings report. One entry per finding using the structure:

```
### [AREA] Finding title
Severity: Blocking | Non-blocking | Informational
Status: Fixed inline | GitHub issue #N | Accepted by design
Description: ...
```

Areas covered: Input Handling, File Upload, IndexedDB Storage, PDF Generation, CSP Headers, Dependencies, Route Parameters.

### Audit scope decisions

- **XSS surface:** `@react-pdf/renderer` uses its own renderer, not the DOM — standard React JSX escaping applies to the web layer. The PDF layer does not interpret HTML.
- **EXIF strip:** Already implemented in `photoStorage.ts` via Canvas re-draw. Record as Accepted by design (Informational).
- **IndexedDB:** No server transmission; IndexedDB is same-origin only. Record as Informational.
- **Maps URL:** `buildMapsUrl` uses `encodeURIComponent`. Verify and record as Informational.
- **`npm audit`:** Run as a concrete pass/fail gate. High or critical findings are Blocking; moderate and below are Non-blocking.
- **Route params:** Profile IDs are UUIDs from `crypto.randomUUID()` — never reflected into innerHTML or eval. Verify in audit pass.

### Severity model

- **Blocking:** Must be resolved before the Vercel deploy proceeds.
- **Non-blocking:** Should be fixed; does not gate the deploy.
- **Informational:** Accepted design decision, noted for awareness; no action required.

## Testing Decisions

**What makes a good test:** Test external behaviour, not implementation. For `validateMagicBytes`, construct a `File` with controlled byte content and assert the return value — do not inspect internal switch statements or byte arrays.

**Coverage required:**

- Valid JPEG bytes → returns `true`
- Valid PNG bytes → returns `true`
- Valid GIF bytes → returns `true`
- Valid WebP bytes (RIFF + WEBP marker) → returns `true`
- Correct image MIME type but wrong magic bytes (the spoofing case) → returns `false`
- File too short to contain magic bytes → returns `false`
- Empty file → returns `false`

**Prior art:** The existing `validatePhoto.test.ts` constructs `File` objects with `new File([...], name, { type })` and asserts on the return value. Extend this same file — `validateMagicBytes` tests sit alongside the existing `validatePhoto` tests.

**Modules without dedicated tests:**

- `vercel.json` changes — validated manually against the Vite prod build.
- `docs/security/security-review-2026-06-07.md` — document, not code.

## Out of Scope

- Penetration testing or runtime attack simulation.
- Server-side hardening (no server exists).
- Authentication or session management (no auth layer).
- Privacy or GDPR review.
- Automated CI security scanning pipeline.
- Treating moderate or below `npm audit` findings as a deploy gate.

## Further Notes

- The `npm audit` run as of 2026-06-07 returned zero vulnerabilities across 356 dependencies. This will be recorded in the findings report as a pass.
- `style-src 'unsafe-inline'` cannot be removed without replacing styled-components with a build-time CSS solution. This is an accepted trade-off and will be recorded as Informational.
- The WebP magic byte check requires verifying both the RIFF header at bytes 0–3 and the `WEBP` marker at bytes 8–11, since RIFF is a container format and non-WebP RIFF files exist.
- The `/security-review` skill run is a separate follow-up step that validates the inline fixes after they are applied — tracked as its own GitHub issue.
