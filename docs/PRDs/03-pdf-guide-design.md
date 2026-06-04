## Problem Statement

The Care Guide — PawBrief's core deliverable — currently renders as an unstyled data dump: plain Helvetica text, hardcoded hex colors, no Cover Band, no Emergency Callout, and a broken Pie Chart instead of the specified 24-hour arc Routine Chart. The Sienna design system established in the Design Handoff initiative gave the Dashboard and Wizard surfaces a polished, consistent look; the PDF output lags behind entirely. An owner sharing this PDF with a pet-sitter today would hand over something that looks unfinished, undermining trust and the core value proposition of the app.

## Solution

Translate the complete Sienna Care Guide and Household Guide designs from the design handoff prototypes into `@react-pdf/renderer` components, wired to the real `CatProfile` data model. The redesigned PDFs render with:

- A Cover Band in the Sienna color scheme
- An Emergency Callout box prominently below the Cover Band
- A 24-hour arc Routine Chart (replacing the broken Pie Chart)
- Plus Jakarta Sans typography (bundled locally, no CDN dependency)
- All design tokens from `src/tokens/` applied consistently

Because `PreviewPage` and `MergedPreviewPage` wrap the same PDF components in `PDFViewer`, redesigning the PDF components automatically redesigns the in-browser preview.

## User Stories

1. As an owner, I want the Care Guide to open with a Cover Band containing my cat's circular photo (or the PawBrief Mark as a fallback), so that the guide is immediately identifiable.
2. As an owner, I want the Cover Band to display my cat's name, breed, and age alongside the PawBrief Wordmark, so that the guide is clearly branded and informative at a glance.
3. As an owner, I want the Emergency Callout to appear immediately after the Cover Band, so that a pet-sitter can find the vet and emergency contacts without scrolling.
4. As an owner, I want the Emergency Callout to show my vet's name, clinic name, phone number, and a Maps link, so that the pet-sitter can reach my vet in an emergency.
5. As an owner, I want the Emergency Callout to show each emergency contact's name, phone number, and relationship, so that the pet-sitter knows who to call and why.
6. As an owner, I want each food entry in the Feeding section to appear as a labeled card showing Brand, Flavor, and Texture, so that the pet-sitter knows exactly what to feed my cat.
7. As an owner, I want each serving entry to render as a Tag in "07:30 · 70g" format, so that the pet-sitter sees the exact time and gram amount for each feeding.
8. As an owner, I want my plating instructions and plating photo thumbnail to appear alongside the serving tags, so that the pet-sitter knows how to prepare the food correctly.
9. As an owner, I want supplement entries to be listed separately from food entries in the Feeding section, so that the pet-sitter does not confuse routine nutritional additions with meals.
10. As an owner, I want the Routine section to show a 24-hour arc Routine Chart with midnight at the top and arcs drawn clockwise from each activity's start time, so that the pet-sitter can see at a glance when activities happen during the day.
11. As an owner, I want the Routine Chart arcs to use the same color palette as the wizard preview, so that the colors feel consistent with what I see when editing the profile.
12. As an owner, I want the Routine Chart to include a legend listing each activity slot's label, color, and duration, so that the pet-sitter can read the chart without guessing what each arc means.
13. As an owner, I want toy entries in the Favourites section to appear as labeled cards showing name and optional description, so that the pet-sitter knows which toys my cat prefers and how to use them.
14. As an owner, I want treat entries to render as Tags (Brand and Flavor), so that the pet-sitter can quickly identify available treats.
15. As an owner, I want comfort items and favourite spots to be listed in the Favourites section, so that the pet-sitter knows how to keep my cat comfortable.
16. As an owner, I want medications to appear in the Health section as cards showing name, dosage, frequency, and instructions, so that the pet-sitter can administer them correctly.
17. As an owner, I want allergies and medical conditions listed in the Health section, so that the pet-sitter knows what to avoid or watch for.
18. As an owner, I want each Special Note to appear as a row with a left-accent border, title, body text, and optional photo thumbnail, so that the pet-sitter can read any supplemental information I have added.
19. As an owner, I want sections I have not filled in to be omitted from the Single Care Guide entirely, so that the guide only shows relevant information.
20. As an owner, I want a PDF Footer on every page showing "Made with PawBrief" and the current page number, so that the guide looks professionally produced.
21. As an owner, I want the Care Guide to use Plus Jakarta Sans (bundled in the app) as the typeface, so that the PDF looks correct even when generated offline.
22. As an owner generating a Merged Care Guide, I want the Cover Band to show "Household Care Guide" as an eyebrow label with both cats' circular photos side by side, so that it is immediately clear the guide covers two cats.
23. As an owner generating a Merged Care Guide, I want each section to display as a two-column comparison row with one column per cat, so that the pet-sitter can quickly compare the two cats' care requirements.
24. As an owner generating a Merged Care Guide where both cats share the same vet, I want the vet block to render once full-width with a "Shared vet for both cats" label, so that the same vet information is not shown twice.
25. As an owner generating a Merged Care Guide where the cats have different vets, I want each cat's vet to appear in its own column, so that the pet-sitter has the correct contact for each cat.
26. As an owner generating a Merged Care Guide, I want any section that only one cat has data for to show "Not added" in italic muted text in the empty column, so that the two columns remain visually row-aligned.
27. As an owner generating a Merged Care Guide, I want the Routine Chart to render at 156px within each column (vs. 188px in the Single Care Guide), so that both charts fit side by side without overflowing the column.
28. As an owner, I want the in-browser preview to match the downloaded PDF exactly, so that what I see in the preview is what I share with the pet-sitter.
29. As an owner, I want section photos (plating, notes) to appear as fixed-width thumbnails beside the text (80px in Single, 60px in Merged columns), so that photos are visible without overwhelming the written content.

## Implementation Decisions

### Sub-components (new files in `src/features/pdf/`)

- **`pdfFonts.ts`** — Single `Font.register()` call for Plus Jakarta Sans weights 400–800, sourced from TTF files bundled in `src/assets/fonts/` and imported as Vite asset URLs. Imported once before any PDF component renders.
- **`pdfTokens.ts`** — StyleSheet-ready values derived from `src/tokens/` (colors, type scale, six-color routine palette). Uses `StyleSheet.create()` — no styled-components.
- **`PawBriefMark.tsx`** — The Mark SVG translated to react-pdf `<Svg>` primitives. Used as the Cover Band fallback when `basics.photoId` is absent.
- **`RoutineClock.tsx`** — 24-hour arc clock. Track: `<Circle>` in `surfaceAlt`. Arcs: `<Path>` per slot in `routinePalette[colorIndex % 6]`. Labels at 00:00/06:00/12:00/18:00. Pure arc-path function extracted for testability.
- **`GSection.tsx`** — Numbered section header and ruled divider. Props: `n` (section number), `title` (string).
- **`KV.tsx`** — Key-value row. Props: `label`, `value`.
- **`Tag.tsx`** — Inline colored chip. Props: `label`, `variant` (primary | accent). Used for Serving Entries, Treat Entries, and similar short values.
- **`MiniCard.tsx`** — Bordered card with title and optional subtitle. Used for Food Entries, Toy Entries, and Medications.

### `SinglePDF.tsx` (full rewrite)

Sections rendered in order: Cover Band → Emergency Callout → Feeding → Routine → Favourites → Health → Good to know → Footer (fixed). Sections with no data are omitted entirely.

### `MergedPDF.tsx` (full rewrite)

Each section rendered as a `CmpRow`: a flex-row `<View>` with two `flex:1` columns separated by a center border. Empty columns display "Not added" in italic muted text. Emergency Callout includes Shared Vet detection.

### Key data mappings

- `ServingEntry` renders as a `Tag` with label `"HH:MM · Xg"` (preserves per-serving gram differences).
- `ActivitySlot.start` (HH:MM string) parsed to a fractional hour for the arc clock: `hours + minutes / 60`.
- `photoBlobUrls: Record<string, string>` passed into both PDF components (same pattern as current implementation).

### Shared vet detection

Extracted as a pure utility function in `src/utils/`. Matches on both `vet.name` and `vet.phone`. When matched, the Emergency Callout renders the vet block full-width; each column still shows its own emergency contacts.

### Token access

PDF sub-components import token values from `src/tokens/` directly. No `ThemeProvider` — react-pdf renders outside the React DOM tree.

### Implementation phases

1. **Foundation** — download Plus Jakarta Sans TTF (weights 400–800) into `src/assets/fonts/`; create `pdfFonts.ts` and `pdfTokens.ts`; smoke-test font rendering in a minimal Document/Page/Text.
2. **Sub-components** — implement `PawBriefMark.tsx`, `RoutineClock.tsx`, `GSection.tsx`, `KV.tsx`, `Tag.tsx`, `MiniCard.tsx`.
3. **SinglePDF** — rewrite `SinglePDF.tsx` section by section; wire all `CatProfile` fields; validate in `PDFViewer` with a seed profile.
4. **MergedPDF** — rewrite `MergedPDF.tsx`; implement `CmpRow`, Shared Vet detection, and "Not added" placeholders; validate with two seed profiles (shared-vet and different-vet cases).

## Testing Decisions

A good test here checks external behaviour — inputs map to the right outputs — without testing implementation details or internal render structure.

**What to test:**

- **Arc path math** (`src/utils/arcPath.ts`) — Extract the arc-path calculation as a pure function: `arcPath(start, hours, cx, cy, R) → string`. Test cases: midnight slot, noon slot, slot crossing midnight, zero-hour slot (should produce no visible arc). This function is non-obvious and silently produces a broken SVG if wrong. Prior art: `src/tokens/tokens.test.ts`.
- **Shared vet detection** (`src/utils/isSharedVet.ts`) — Pure function `isSharedVet(vetA, vetB) → boolean`. Test: same name and phone → true; different name only → false; different phone only → false.
- **Serving tag formatting** (`src/utils/formatServingTag.ts`) — Pure function `formatServingTag(serving) → string`. Test: `{ time: "07:30", grams: 70 }` produces `"07:30 · 70g"`.

**What not to test:**

PDF sub-components (`RoutineClock`, `GSection`, etc.) are not compatible with `@testing-library/react` — they emit a PDF stream, not a DOM tree. Visual correctness is validated manually in the `PDFViewer` with seed profiles.

## Out of Scope

- Dark mode or theme switching within PDFs — react-pdf has no dynamic theming; PDF colors are always the Sienna light tokens.
- Photo cropping UI — photos are rendered as-is, clipped to the circular or thumbnail bounding box.
- Multi-page pagination controls — react-pdf handles automatic pagination; `wrap={false}` on section Views prevents mid-card splits.
- Any changes to the wizard data model or `src/types/profile.ts`.
- WCAG/PDF-UA accessibility tagging — react-pdf does not support tagged PDFs.
- Paper sizes other than A4.

## Further Notes

- The design handoff prototypes (`pb-guide.jsx`, `pb-guide-compare.jsx`, `pb-routine-chart.jsx`) in `src/assets/design_handoff_pawbrief/` remain the visual source of truth for exact spacing, color values, and layout decisions. The `react-pdf-mapping.md` file documents all porting considerations.
- Font TTF files are bundled assets imported as Vite asset URLs; they are not managed by npm. Any weight additions must be added manually.
- `PreviewPage` and `MergedPreviewPage` wrap the same `SinglePDF` and `MergedPDF` components — no changes to the page layer are required.
- react-pdf defaults `flexDirection` to `column`; every horizontal layout must set `flexDirection: 'row'` explicitly.
