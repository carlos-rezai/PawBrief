# Plan: Security Review

> Source PRD: https://github.com/carlos-rezai/PawBrief/issues/23

## Architectural decisions

- **No routes added** — audit-only work; no new pages or URL patterns.
- **No schema changes** — `validateMagicBytes` is a pure utility; IndexedDB shape is unchanged.
- **Key model:** `validateMagicBytes(file: File): Promise<boolean>` — async, reads first 12 bytes, returns `true` only for JPEG/PNG/GIF/WebP magic bytes.
- **Report location:** `docs/security/security-review-2026-06-07.md` — date-stamped, dedicated folder.
- **Severity model:** Blocking (deploy gate) / Non-blocking (should fix) / Informational (accepted by design).

---

## Phase 1: Magic byte validation

**User stories**: 1, 6, 13

### What to build

Extend `validatePhoto.ts` with a `validateMagicBytes` function that reads the first 12 bytes of an uploaded file and checks them against the magic byte signatures for JPEG, PNG, GIF, and WebP (WebP requires both the RIFF header at bytes 0–3 and the WEBP marker at bytes 8–11). Wire the new check into the photo upload call site so that a file with a valid image MIME type but wrong magic bytes is rejected before it reaches IndexedDB.

### Acceptance criteria

- [ ] `validateMagicBytes` returns `true` for a file with valid JPEG magic bytes
- [ ] `validateMagicBytes` returns `true` for a file with valid PNG magic bytes
- [ ] `validateMagicBytes` returns `true` for a file with valid GIF magic bytes
- [ ] `validateMagicBytes` returns `true` for a file with valid WebP magic bytes (RIFF + WEBP marker)
- [ ] `validateMagicBytes` returns `false` for a file with a valid image MIME type but wrong magic bytes (the spoofing case)
- [ ] `validateMagicBytes` returns `false` for a file shorter than 4 bytes
- [ ] `validateMagicBytes` returns `false` for an empty file
- [ ] The photo upload call site rejects a file when `validateMagicBytes` returns `false`, surfacing an error to the owner
- [ ] All existing `validatePhoto` tests still pass

---

## Phase 2: Dependency audit + CSP tightening

**User stories**: 3, 4, 6

### What to build

Run `npm audit` and record the result as a pass/fail gate. Build the Vite production bundle and test it with `unsafe-inline` removed from `script-src` in `vercel.json`. If the app loads correctly without it, remove it and commit the change. If Vite or styled-components requires it, leave `script-src` unchanged — that finding will be recorded as Informational in Phase 3. `style-src unsafe-inline` is not touched regardless.

### Acceptance criteria

- [ ] `npm audit` has been run and the result is recorded (zero high/critical findings is a pass)
- [ ] The Vite prod build has been tested against a CSP with `unsafe-inline` removed from `script-src`
- [ ] `vercel.json` is updated to remove `unsafe-inline` from `script-src` if the prod build passes without it
- [ ] If `unsafe-inline` cannot be removed, the reason is noted and the finding is ready to be recorded as Informational in Phase 3

---

## Phase 3: Static audit pass + findings report

**User stories**: 2, 5, 7, 8, 9, 10, 11, 12

### What to build

Walk every surface in the audit scope and write `docs/security/security-review-2026-06-07.md`. Each finding gets a severity (Blocking / Non-blocking / Informational) and a status (Fixed inline / GitHub issue #N / Accepted by design). Surface areas to cover:

- **Input handling** — scan all text inputs for XSS risk; verify no `innerHTML`, `dangerouslySetInnerHTML`, or `eval` anywhere in the codebase
- **File upload** — record the magic byte fix from Phase 1 and the EXIF strip as Informational
- **IndexedDB storage** — verify same-origin guarantee; no transmission to external endpoints
- **PDF generation** — verify `@react-pdf/renderer` data flow; confirm no URL or resource load is derived from raw user input without sanitisation
- **Maps URL** — verify `buildMapsUrl` uses `encodeURIComponent`; record as Informational
- **CSP headers** — record Phase 2 outcome; record `style-src unsafe-inline` as Informational
- **Dependencies** — record `npm audit` result from Phase 2
- **Route parameters** — verify profile UUIDs from `crypto.randomUUID()` are never reflected into the DOM unsanitised

Any finding that requires significant rework beyond this initiative is opened as a separate GitHub issue and referenced in the report.

### Acceptance criteria

- [ ] `docs/security/security-review-2026-06-07.md` exists with one entry per finding area
- [ ] Every finding entry has a Severity and a Status
- [ ] No Blocking findings are open (either fixed inline or a GitHub issue is open tracking them)
- [ ] Input handling, File upload, IndexedDB, PDF generation, Maps URL, CSP, Dependencies, and Route parameters are all covered in the report
- [ ] The report is readable as a standalone audit record — a future developer can understand the security posture at launch from the document alone
