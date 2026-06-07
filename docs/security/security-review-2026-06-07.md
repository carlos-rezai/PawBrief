# PawBrief Security Review — 2026-06-07

A pre-deployment audit of PawBrief's client-side surface, completed before the
first Vercel deploy. PawBrief is fully client-side: cat profile data and photos
are stored in IndexedDB and Care Guides are generated as PDFs in the browser.
There is no server, no account, and no network transmission of user data.

This document is the standalone record of what was reviewed and what was found.
Each finding carries a **Severity** (Blocking / Non-blocking / Informational) and
a **Status** (Fixed inline / GitHub issue #N / Accepted by design).

- **Blocking** — must be resolved before the Vercel deploy proceeds.
- **Non-blocking** — should be fixed; does not gate the deploy.
- **Informational** — accepted design decision, noted for awareness; no action required.

**Outcome:** No Blocking findings remain open. The app is cleared to deploy.

Related work: magic byte validation (#24), CSP `script-src` tightening + dependency
audit (#25), self-host web fonts (#27, Non-blocking, open).

---

## Input Handling

### [Input Handling] Free-text fields are not surfaced as HTML

Severity: Informational
Status: Accepted by design

All user input (cat name, brand/flavor, notes, addresses, contact details) is
rendered through standard React JSX, which escapes text content by default. A
repository-wide search found **no** use of `dangerouslySetInnerHTML`, `innerHTML`,
`eval`, or `new Function` anywhere in `src/`. There is no code path that interprets
user input as HTML or executable code, on either the web layer or the PDF layer.

---

## File Upload

### [File Upload] MIME type alone was spoofable; magic byte validation added

Severity: Non-blocking
Status: Fixed inline (#24)

`validatePhoto` checks only `file.type` (the browser-reported MIME type), which a
renamed non-image file can spoof. `validateMagicBytes` (`src/utils/validatePhoto.ts`)
now reads the first 12 bytes of every upload and verifies them against known JPEG,
PNG, GIF, and WebP signatures (WebP requires both the `RIFF` header and the `WEBP`
marker). It is wired into all three upload call sites — `BasicsStep`, `FeedingStep`,
and `NotesStep` — each of which rejects the file if validation returns `false`.
Covered by unit tests in `validatePhoto.test.ts`.

### [File Upload] EXIF metadata is stripped before storage

Severity: Informational
Status: Accepted by design

`photoStorage.ts` re-draws every uploaded image through an HTML5 Canvas
(`stripExif`) before persisting it, discarding all original file metadata
(including EXIF GPS). Only the re-encoded pixel buffer is stored.

---

## IndexedDB Storage

### [IndexedDB Storage] Same-origin storage, no transmission

Severity: Informational
Status: Accepted by design

Profiles and photo blobs are stored in IndexedDB (`pawbrief` database, `profiles`
and `photos` stores; `src/features/profile/db.ts`). IndexedDB is same-origin only —
no other site or script can read it — and PawBrief never transmits this data
anywhere (`connect-src 'self'`). Photo keys are generated with `crypto.randomUUID()`.

---

## PDF Generation

### [PDF Generation] No remote resource loads in the PDF data flow

Severity: Informational
Status: Accepted by design

`@react-pdf/renderer` uses its own renderer, not the DOM, and does not interpret
HTML. Fonts are registered from locally bundled `.ttf` assets (`pdfFonts.ts`), not
fetched remotely. PDF `Image` elements are sourced exclusively from same-origin
`blob:` object URLs created from IndexedDB data. The only outbound `Link` in a Care
Guide is the vet Maps URL (see below). There is no vector to exfiltrate profile data
through a crafted URL or resource load in the PDF.

---

## Maps URL

### [Maps URL] Vet address is properly URL-encoded

Severity: Informational
Status: Accepted by design

`buildMapsUrl` (`src/utils/buildMapsUrl.ts`) constructs a destination-only Google
Maps search URL and passes the vet address through `encodeURIComponent`, so a
crafted address cannot inject additional query parameters or alter the URL
structure. The owner's home address is never used as a routing origin.

---

## CSP Headers

### [CSP Headers] `script-src 'unsafe-inline'` removed

Severity: Non-blocking
Status: Fixed inline (#25)

The Vite production build emits all application code as external, same-origin module
scripts — the built `index.html` contains no inline `<script>` content and no inline
event handlers. `'unsafe-inline'` was therefore unnecessary in `script-src` and has
been removed in `vercel.json`; `script-src` is now `'self'` only.

### [CSP Headers] `style-src 'unsafe-inline'` retained

Severity: Informational
Status: Accepted by design

styled-components injects styles as inline `<style>` tags at runtime, which requires
`style-src 'unsafe-inline'`. Removing it would require migrating to a build-time CSS
solution. This is an accepted trade-off and is left in place.

### [CSP Headers] Google Fonts blocked by the strict CSP

Severity: Non-blocking
Status: GitHub issue #27

`index.html` loads the web UI font from `fonts.googleapis.com` / `fonts.gstatic.com`,
but `style-src 'self'` and `font-src 'self'` block both. In production the web UI
silently falls back to system fonts. The app remains fully functional, so this is
Non-blocking. Recommended fix (#27): self-host Plus Jakarta Sans — the static
instances are already bundled for the PDF layer — and remove the Google Fonts
`<link>` tags, keeping the `'self'`-only CSP and removing a third-party request.

---

## Dependencies

### [Dependencies] `npm audit` clean

Severity: Informational
Status: Accepted by design

`npm audit` on 2026-06-07 reported **0 vulnerabilities** across the dependency tree.
No high or critical findings, so the dependency gate passes. (High/critical findings
would be Blocking; moderate and below would be Non-blocking.)

---

## Route Parameters

### [Route Parameters] Profile IDs are non-reflective UUIDs

Severity: Informational
Status: Accepted by design

Route parameters (`id`, `id1`, `id2`, `step`) are read via `useParams` and used only
as IndexedDB key lookups through `useProfile(id)`. Profile IDs are UUIDs generated by
`crypto.randomUUID()`. No route parameter is reflected into `innerHTML`, passed to
`eval`, or otherwise rendered as markup — an unknown or crafted ID simply resolves to
no profile and is handled by the not-found path.

---

## Summary

| Area             | Severity      | Status             |
| ---------------- | ------------- | ------------------ |
| Input Handling   | Informational | Accepted by design |
| File Upload      | Non-blocking  | Fixed inline (#24) |
| File Upload      | Informational | Accepted by design |
| IndexedDB        | Informational | Accepted by design |
| PDF Generation   | Informational | Accepted by design |
| Maps URL         | Informational | Accepted by design |
| CSP Headers      | Non-blocking  | Fixed inline (#25) |
| CSP Headers      | Informational | Accepted by design |
| CSP Headers      | Non-blocking  | GitHub issue #27   |
| Dependencies     | Informational | Pass (0 vulns)     |
| Route Parameters | Informational | Accepted by design |

**No Blocking findings.** Two Non-blocking findings were fixed inline (#24, #25);
one Non-blocking finding (#27, web fonts) is tracked and does not gate the deploy.
PawBrief is cleared for the Vercel deploy.
