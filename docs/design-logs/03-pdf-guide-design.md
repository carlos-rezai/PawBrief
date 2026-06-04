# 03 — PDF Guide Design

## Background

The Sienna design system (02-design-handoff) has been applied to the Dashboard and Wizard
surfaces. The PDF output — `src/features/pdf/SinglePDF.tsx` and `MergedPDF.tsx` — are
unstyled data-dump placeholders: plain Helvetica text, a broken pie chart, no cover band,
no emergency callout, no numbered sections.

The design handoff package provides complete, print-ready prototypes for both guides:

- `src/assets/design_handoff_pawbrief/pb-guide.jsx` — single-cat Care Guide
- `src/assets/design_handoff_pawbrief/pb-guide-compare.jsx` — side-by-side Household Guide
- `src/assets/design_handoff_pawbrief/pb-routine-chart.jsx` — 24-hour arc clock
- `src/assets/design_handoff_pawbrief/react-pdf-mapping.md` — react-pdf porting notes

The `PreviewPage` and `MergedPreviewPage` use `PDFViewer` wrapping the same components,
so redesigning the PDF files automatically redesigns the in-app preview.

Source of truth: `src/assets/design_handoff_pawbrief/`

## Problem

Translate the Sienna Care Guide and Household Guide designs from the handoff prototypes
into `@react-pdf/renderer` components, wired to the real `CatProfile` data model.

## Questions and Answers

**Q1: Routine visualization — 24-hour arc clock or pie chart?**
24-hour arc clock. Shows _when_ things happen (not just how long), matches the wizard
preview, and is fully specced in `react-pdf-mapping.md`. The current pie chart doesn't
render correctly.

**Q2: Font loading — bundle locally or load from Google Fonts CDN?**
Bundle locally in `src/assets/fonts/`. PDF generation must not depend on network
availability. A CDN failure during generation produces a silently wrong font on a
print artifact.

**Q3: Cat photo — circular avatar in cover band or full-width hero?**
Circular avatar (92px) in the cover band, replacing the PawBrief mark when
`basics.photoId` exists. Mark shows as fallback. Full-width approach was a placeholder.

**Q4: Section photos (plating, notes) — thumbnail beside text or full-width below?**
Fixed-width thumbnail beside text. ~80px in single guide, ~60px in merged guide columns.
Photos are confirmatory (e.g. "this is how to plate the food") — content stays primary.

**Q5: Serving display — the design has `amountGrams` (one value) + time tags, but the
profile model has `servings[].grams` + `servings[].time` (per serving, can differ)?**
Each `ServingEntry` renders as a Tag: `"07:30 · 70g"`. Preserves full data when
servings have different gram amounts. Supersedes the prototype's simplified layout.

**Q6: Shared vet detection in merged guide?**
Yes. Detected by matching `vet.name === vet.name && vet.phone === vet.phone`. When
shared, vet block renders once full-width with "Shared vet for both cats" note;
both columns show only emergency contacts. Already designed in `pb-guide-compare.jsx`.

**Q7: Incomplete sections — omit or placeholder?**
Single guide: omit entirely when wizard step has no data.
Merged guide: show section row if _either_ cat has data. Empty column shows `"Not added"`
in italic muted text to keep columns row-aligned.

## Design

### Token usage

PDF components import from `src/tokens/` (no styled-components — react-pdf uses
`StyleSheet.create()`). Font family registered as `"Plus Jakarta Sans"`.

### Font registration

```ts
// src/features/pdf/pdfFonts.ts
Font.register({
  family: "Plus Jakarta Sans",
  fonts: [
    { src: plusJakartaSans400, fontWeight: 400 },
    { src: plusJakartaSans500, fontWeight: 500 },
    { src: plusJakartaSans600, fontWeight: 600 },
    { src: plusJakartaSans700, fontWeight: 700 },
    { src: plusJakartaSans800, fontWeight: 800 },
  ],
});
```

TTF files live in `src/assets/fonts/` and are imported as Vite asset URLs.

### File structure

```
src/features/pdf/
├── pdfFonts.ts          ← Font.register() call, imported once
├── pdfTokens.ts         ← StyleSheet-ready token values (colors, type scale)
├── PawBriefMark.tsx     ← SVG mark for cover band fallback
├── RoutineClock.tsx     ← 24h arc clock (<Svg> + <Path> arcs)
├── GSection.tsx         ← Numbered section header + rule divider
├── KV.tsx               ← Key-value row (label / value)
├── Tag.tsx              ← Colored chip (primary or accent tone)
├── MiniCard.tsx         ← Bordered card (title + optional sub)
├── SinglePDF.tsx        ← Single-cat Care Guide (rewritten)
└── MergedPDF.tsx        ← Household Guide (rewritten)
```

### SinglePDF layout

```
Page (A4, surface bg, Plus Jakarta Sans)
├── CoverBand            ← sienna bg; circular photo or mark; cat name + breed/age; wordmark
├── EmergencyCallout     ← bordered box; vet left | contacts right
├── GSection n=1 "Feeding"
│   ├── food MiniCards + plating thumbnail   left column
│   └── serving Tags + supplements + notes  right column
├── GSection n=2 "A typical day"
│   ├── RoutineClock (188px)
│   └── legend (two flex columns of slot rows)
├── GSection n=3 "Favourites"
│   ├── toy MiniCards                        left
│   └── treat/comfort/spot Tags              right
├── GSection n=4 "Health"   (omit if no medical step)
│   ├── medication cards                     left
│   └── allergies + conditions               right
├── GSection n=5 "Good to know"  (omit if no notes step)
│   └── note rows (olive left-border + title + body + thumbnail)
└── Footer               ← "Made with PawBrief · keep this handy…" | date
```

### MergedPDF layout

```
Page (A4)
├── CoverBand            ← "Household Care Guide" eyebrow; CatHead × 2 side by side
├── EmergencyCallout
│   ├── SharedVet row (full-width, if shared)
│   └── [ContactsCol A | ContactsCol B]
├── CmpRow n=1 "Feeding"       [FeedingCol A | FeedingCol B]
├── CmpRow n=2 "A typical day" [RoutineCol A | RoutineCol B]  (RoutineClock 156px)
├── CmpRow n=3 "Favourites"    [FavouritesCol A | FavouritesCol B]
├── CmpRow n=4 "Health"        (if either cat has data)
└── CmpRow n=5 "Good to know"  (if either cat has data)
    └── empty column → "Not added" italic muted
```

### Photo handling

| Context                  | Placement                              | Size (single) | Size (merged col) |
| ------------------------ | -------------------------------------- | ------------- | ----------------- |
| `basics.photoId`         | Cover band, circular clip              | 92×92px       | 58×58px           |
| `feeding.platingPhotoId` | Feeding section, beside serving column | 80px wide     | 60px wide         |
| `notes[].photoId`        | Note row, beside body text             | 80px wide     | 60px wide         |

### Routine clock (react-pdf)

✅ SVG arc clock from `react-pdf-mapping.md`:

- Track: `<Circle>` stroke in `colors.surfaceAlt`
- Arcs: `<Path>` per slot, stroke in `routinePalette[colorIndex % 6]`, `fill="none"`
- Labels: `<Text>` at 00:00 (top), 06:00 (right), 12:00 (bottom), 18:00 (left)
- Center label: "A day" in caps muted

❌ Pie chart — rejected. Doesn't convey time-of-day; current implementation broken.

### Serving tags

✅ `"07:30 · 70g"` per `ServingEntry` — preserves per-serving gram differences
❌ `amountGrams` + separate time tags — prototype simplification, loses data

## Implementation Plan

**Phase 1 — Foundation**

- Download Plus Jakarta Sans TTF (weights 400–800) into `src/assets/fonts/`
- Create `src/features/pdf/pdfFonts.ts` and `pdfTokens.ts`
- Verify font renders in a minimal `<Document><Page><Text>` smoke test

**Phase 2 — Sub-components**

- `PawBriefMark.tsx` — SVG paths translated to react-pdf `<Svg>`
- `RoutineClock.tsx` — arc clock with exact math from `react-pdf-mapping.md`
- `GSection.tsx`, `KV.tsx`, `Tag.tsx`, `MiniCard.tsx`

**Phase 3 — SinglePDF**

- Rewrite `SinglePDF.tsx` section by section (cover → emergency → sections → footer)
- Wire all `CatProfile` fields; handle photo blob URLs for cover + plating + notes
- Validate in `PDFViewer` with a seed profile

**Phase 4 — MergedPDF**

- Rewrite `MergedPDF.tsx`: `CmpRow` layout, shared-vet detection, `"Not added"` placeholders
- Validate in `PDFViewer` with two seed profiles (shared vet + different vet cases)

## Trade-offs

**Easier:** Print output matches the Sienna system exactly; preview and download are in sync
by default; sub-components are reusable if a third PDF format is needed later.

**Harder:** Font bundling adds ~500KB to the build. TTF files must be kept up to date
manually (no npm-managed font package).

**Out of scope:**

- Dark mode / theme switching in PDFs (react-pdf has no dynamic theming)
- Photo cropping UI — photos are rendered as-is, clipped to the circle/thumbnail box
- Multi-page pagination controls — react-pdf handles this automatically with `wrap={false}`
  on section Views
