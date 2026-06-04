# Plan: PDF Guide Design

> Source PRD: https://github.com/carlos-rezai/pawbrief/issues/17

## Architectural decisions

Durable decisions that apply across all phases:

- **Routes**: No route changes — `PreviewPage` and `MergedPreviewPage` already wrap `SinglePDF` and `MergedPDF` in `PDFViewer`. No page-layer work required.
- **Font delivery**: Plus Jakarta Sans TTF files (weights 400–800) bundled in `src/assets/fonts/`, imported as Vite asset URLs. Not managed by npm. Single `Font.register()` call in `pdfFonts.ts` before any PDF component renders.
- **Token access**: PDF sub-components import from `src/tokens/` directly. No `ThemeProvider` — react-pdf renders outside the React DOM tree. `pdfTokens.ts` exposes `StyleSheet.create()`-ready values.
- **Key models**: `CatProfile` is unchanged. `photoBlobUrls: Record<string, string>` passed into both PDF components (same pattern as current implementation). `ActivitySlot.start` (HH:MM string) converted to fractional hour for arc math: `hours + minutes / 60`.
- **Test scope**: Only pure utility functions are unit-tested (`arcPath`, `isSharedVet`, `formatServingTag`). PDF sub-components are validated manually in `PDFViewer` — they emit a PDF stream, not a DOM tree.

---

## Phase 1: Foundation

**User stories**: 21 (Plus Jakarta Sans typography, offline-safe)

### What to build

Download Plus Jakarta Sans TTF files (weights 400, 500, 600, 700, 800) into `src/assets/fonts/`. Create `pdfFonts.ts` with a single `Font.register()` call sourcing the bundled files as Vite asset URLs. Create `pdfTokens.ts` exposing `StyleSheet.create()`-ready values derived from `src/tokens/` (colors, type scale, six-color routine palette). Smoke-test by rendering a minimal `Document/Page/Text` in `PDFViewer` to confirm Plus Jakarta Sans displays correctly.

### Acceptance criteria

- [ ] TTF files for weights 400–800 are present in `src/assets/fonts/` and committed
- [ ] `pdfFonts.ts` registers the font family once; importing it before any PDF render is sufficient
- [ ] `pdfTokens.ts` exports color, type, and routine palette values usable in `StyleSheet.create()`
- [ ] A smoke-test render in `PDFViewer` shows Plus Jakarta Sans (visually confirmed — not Helvetica fallback)

---

## Phase 2: Sub-components + Utility Tests

**User stories**: 1–2 (PawBriefMark Cover Band fallback), 10–12 (RoutineClock arc chart)

### What to build

Implement all shared PDF primitives in `src/features/pdf/`: `PawBriefMark.tsx` (Mark SVG as react-pdf `<Svg>` primitives), `RoutineClock.tsx` (24-hour arc clock with `<Circle>` track and `<Path>` arcs per slot), `GSection.tsx` (numbered section header + ruled divider), `KV.tsx` (key-value row), `Tag.tsx` (inline chip, primary and accent variants), and `MiniCard.tsx` (bordered card with title and optional subtitle).

Alongside `RoutineClock`, extract `arcPath` as a pure utility in `src/utils/` and write tests: midnight slot, noon slot, slot crossing midnight, zero-duration slot. Also implement and test `isSharedVet` (matches on name + phone) and `formatServingTag` (`{ time, grams }` → `"HH:MM · Xg"`). Each primitive is visually spot-checked in a temporary test document in `PDFViewer`.

### Acceptance criteria

- [ ] All six sub-components (`PawBriefMark`, `RoutineClock`, `GSection`, `KV`, `Tag`, `MiniCard`) exist in `src/features/pdf/`
- [ ] `arcPath` tests pass: midnight slot, noon slot, midnight-crossing slot, zero-duration slot
- [ ] `isSharedVet` tests pass: same name + phone → true; name-only match → false; phone-only match → false
- [ ] `formatServingTag` test passes: `{ time: "07:30", grams: 70 }` → `"07:30 · 70g"`
- [ ] Visual spot-check of each primitive in `PDFViewer` confirms correct layout and font rendering

---

## Phase 3: Single Care Guide

**User stories**: 1–21 (full single-cat guide)

### What to build

Full rewrite of `SinglePDF.tsx`. Sections rendered in order: Cover Band → Emergency Callout → Feeding → Routine → Favourites → Health → Good to Know → Footer (fixed). The Cover Band shows the cat's circular photo (or `PawBriefMark` fallback), name, breed, age, and the PawBrief Wordmark. The Emergency Callout shows vet details (name, clinic, phone, Maps link) and emergency contacts. Each section uses `GSection` for headers and the appropriate primitives (`MiniCard`, `Tag`, `KV`, `RoutineClock`). Sections with no data are omitted entirely. Footer shows "Made with PawBrief" and page number on every page. Validated end-to-end in `PreviewPage` with a seed `CatProfile` covering all fields.

### Acceptance criteria

- [ ] Cover Band renders cat photo (circular) or `PawBriefMark` fallback, name, breed, age, and Wordmark
- [ ] Emergency Callout shows vet block (name, clinic, phone, Maps link) and all emergency contacts
- [ ] Feeding section: food entries as `MiniCard` (Brand, Flavor, Texture); serving entries as `Tag` ("HH:MM · Xg"); plating instructions and photo thumbnail (80px) visible; supplements listed separately
- [ ] Routine section: `RoutineClock` at 188px with arcs in routine palette colors and a legend
- [ ] Favourites section: toy entries as `MiniCard`; treat entries as `Tag` (Brand · Flavor); comfort items and favourite spots listed
- [ ] Health section: medications as `MiniCard` (name, dosage, frequency, instructions); allergies and conditions listed
- [ ] Good to Know section: each Special Note shows left-accent border, title, body, and optional photo thumbnail (80px)
- [ ] Sections with no data are omitted from the rendered PDF
- [ ] Footer appears on every page with "Made with PawBrief" and current page number
- [ ] `PreviewPage` renders the rewritten PDF correctly using Plus Jakarta Sans

---

## Phase 4: Merged Household Guide

**User stories**: 22–29 (two-cat comparison guide, shared vet, column layout, photo thumbnails)

### What to build

Full rewrite of `MergedPDF.tsx`. Cover Band shows "Household Care Guide" eyebrow label and both cats' circular photos side by side. Each content section renders as a `CmpRow`: a flex-row `<View>` with two `flex:1` columns separated by a center border. Empty columns show "Not added" in italic muted text. Emergency Callout applies Shared Vet detection — when both cats share the same vet (matched by name + phone via `isSharedVet`), the vet block renders full-width with a "Shared vet for both cats" label; each column still shows its own emergency contacts. `RoutineClock` renders at 156px within each column. Photo thumbnails render at 60px in merged columns. Validated in `MergedPreviewPage` with two seed profiles: one shared-vet case, one different-vet case.

### Acceptance criteria

- [ ] Cover Band shows "Household Care Guide" eyebrow, both cats' circular photos side by side, and Wordmark
- [ ] All content sections render as two-column `CmpRow` layout with a center divider
- [ ] Columns with no data show "Not added" in italic muted text, keeping row alignment intact
- [ ] Shared vet renders full-width with "Shared vet for both cats" label; different vets render in separate columns
- [ ] Each column's emergency contacts render independently regardless of shared vet status
- [ ] `RoutineClock` renders at 156px in each column
- [ ] Photo thumbnails (plating, notes) render at 60px in merged columns
- [ ] `MergedPreviewPage` renders correctly for both shared-vet and different-vet seed profiles
- [ ] In-browser preview matches the downloaded PDF (story 28)
