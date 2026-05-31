## Problem Statement

Issues #10–#15 completed the infrastructure layer of the design-handoff initiative: tokens, styled primitives, shared components, and behavioral wiring for both surfaces. Both surfaces are functionally correct but visually unfinished. Opening the app today shows a working skeleton with no shell layouts, no card components, and no step body organisation — it looks nothing like the design.

Two structural problems were also discovered during this review:

1. **`ActivitySlot` data model mismatch.** The production type is `{ label, durationHours }` and start times are computed cumulatively by the renderer. The design requires `{ label, start, hours, colorIndex }` where `start` is an absolute clock time (e.g., `"22:30"`). This is a critical gap: Sleep starting at 22:30 and spanning midnight cannot be represented with a cumulative model — the arc has to start at a real clock position and wrap past 00:00 naturally.

2. **`STEP_ORDER` defined in three places.** `WizardPage`, `DashboardPage`, and `getNextStep.ts` each define the same `["basics", "feeding", ...]` array. The `Stepper` component has a fourth copy as capitalised display labels. Any step change requires four edits.

## Solution

Translate the full Sienna visual layer from `src/assets/design_handoff_pawbrief/` to the production codebase — completing everything left unfinished after #10–#15 — in an order that leaves the codebase working and tested at every commit.

The work is structured in five phases:

1. Shared constants and data model corrections (non-visual, test-safe)
2. Routine Chart data and visual update
3. Wizard shell layout — navbar, Step Card, footer
4. Six step body layouts
5. Dashboard layout — navbar, header, card grid, ProfileCard, PlusCard, EmptyState, merge-select

## Commits

---

### Phase 1 — Shared constants (non-visual, no behaviour change)

**Commit 1 — Extract `wizardSteps.ts`: single source of truth for step metadata**

Create `src/utils/wizardSteps.ts` and export three constants:

- `STEP_ORDER: WizardStep[]` — the six step keys in order
- `STEP_LABELS: Record<WizardStep, string>` — display labels; update "Favorites" → "Favourites" to match the design (British spelling shown in all screenshots)
- `STEP_SUBTITLES: Record<WizardStep, string>` — per-step subtitles sourced from `pb-wizard-steps.jsx`:
  - basics → "Who are we caring for?"
  - feeding → "What and when they eat."
  - routine → "How they spend a typical day."
  - favorites → "What makes them happy."
  - medical → "Just in case."
  - notes → "Anything else worth knowing."

Remove the local `STEP_ORDER` / `ALL_STEPS` declarations from `WizardPage`, `DashboardPage`, and `getNextStep.ts`, and the hardcoded `STEPS` array from `Stepper`. All four files import from `wizardSteps.ts`. Update Stepper and WizardPage tests where they use `"Favorites"` literal to use `"Favourites"`. No visual change. All tests pass.

---

### Phase 2 — ActivitySlot data model and Routine Chart

**Commit 2 — Update `ActivitySlot` type and all direct consumers**

In `src/types/profile.ts`, change:

```
ActivitySlot: { label: string; durationHours: number }
```

to:

```
ActivitySlot: { label: string; start: string; hours: number; colorIndex: number }
```

`start` is an absolute "HH:MM" clock time. `hours` is the duration. `colorIndex` (0–5) maps to `routinePalette`.

Update `RoutineStep`: replace the six default slots with absolute start times matching the design seed (Sleep 22:30, Feeding 07:30, Playtime 09:00, Outdoor 11:00, Cuddle 18:00, Window-watching 14:00). Remove the cumulative start-time computation that was feeding into `RoutineChart` — `start` now comes directly from the slot. Keep the `colorIndex` auto-assigned as `index % palette.length` when new slots are added. Add a `start` time input (`<input type="time">`) to each slot row. The total displayed is `Xh scheduled across the day` — remove the "must equal 24h" warning, which the design does not include.

Update `RoutineChart`: it already accepts `{ start, hours, colorIndex }` per slot, so no prop change is needed. Remove the cumulative-computation wrapper that `RoutineStep` was providing.

Update `routineChartArcs.ts` if needed (function signature is already `arcPath(start: string, hours: number, size: number)` — verify it handles midnight-spanning arcs correctly; the trig is inherently periodic so `t + hours > 24` works without wrapping). Update the utility tests accordingly.

Update `RoutineStep` tests: remove the `"default slots sum to 24 hours"`, `"shows a warning when total differs from 24"`, and `"Next button stays enabled when total differs from 24"` tests — these specs no longer apply. Update the running-total test to use the new default total. Update any test that constructs an `ActivitySlot` directly to use the new shape.

All tests pass.

**Commit 3 — Update `RoutineChart` visual to match design**

The design (`pb-routine-chart.jsx`) shows a 24-hour radial clock with:

- Clock labels: `00:00` top-centre, `12:00` bottom-centre, `06:00` right-middle, `18:00` left-middle — rendered as absolutely positioned `<span>` elements outside the SVG
- `"A DAY"` centred text inside the ring (uppercase, small, `muted`)
- `strokeLinecap="butt"` (not `"round"`)
- Background track uses `theme.colors.surfaceAlt` (currently hardcoded `"#E0D2BC"`)
- The chart is wrapped in a `position: relative` container sized to `size + padding` so side labels have room to clear the ring

Update `RoutineChart.tsx` and `RoutineChart.styles.ts` to match. Existing test (`container.querySelector("svg")`) continues to pass.

---

### Phase 3 — Wizard shell layout

**Commit 4 — Add `backLabel` and `submitLabel` props to all step components; update WizardPage footer**

All six step components currently own their own Back and Next buttons. The design places these in a card footer controlled by the Wizard shell — the shell knows the step context (step index, next step name) while the step body only knows its form fields.

Add `backLabel?: React.ReactNode` to all six step components (default `"Back"`). Add `submitLabel?: React.ReactNode` to the five that don't already have it (all except `NotesStep`). Remove `disabled={!onBack}` from step components' Back buttons — `WizardPage` will now provide real `onBack` on every step, including step 1.

Update `WizardPage`:

- Step 1: `onBack={() => navigate("/")}`, `backLabel="Cancel"`, `submitLabel=<>Next: Feeding {nextIcon}</>`
- Steps 2–5: `backLabel=<>{backIcon} Back</>`, `submitLabel=<>Next: [NextStepLabel] {nextIcon}</>`
- Step 6 (Notes): `backLabel=<>{backIcon} Back</>`, `submitLabel="Finish & save"`

Back and next inline SVG icons (15×15, `strokeWidth 2`, `strokeLinecap round`) are defined in `WizardPage.tsx` alongside the component — kept co-located with their usage.

Update the WizardPage test `"the Back button is disabled on the Basics step"` → `"clicking Cancel on the Basics step navigates to the Dashboard"` (Cancel is now an active navigation, not a disabled button). All other WizardPage tests continue to pass.

**Commit 5 — WizardPage: sticky navbar and centred container**

Add `WizardPage.styles.ts`. Apply:

- Sticky navbar: `position: sticky; top: 0; z-index: 10; background: surface; border-bottom: 1px solid border; height: 60px`. Inner content: `max-width: 760px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center`. Contains `Wordmark` only (no extra links per design).
- Main container: `max-width: 760px; margin: 0 auto; padding: 30px 24px 60px`.
- Mobile (`≤640px`): container padding tightens to `20px 16px 48px`.

**Commit 6 — WizardPage: Stepper placement and "STEP X OF 6" eyebrow**

Place `Stepper` inside the main container at the top. Below it add the eyebrow: `font-size: 11px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase; color: muted; text-align: center; margin: 26px 0 16px`. Text is `"STEP {stepIndex + 1} OF 6"`.

Mobile (`≤640px`): hide the `StepLabel` text within `Stepper` (dots + eyebrow carry navigation context). The Stepper `StepperNav` gets a media query that sets `StepLabel` to `display: none`.

**Commit 7 — WizardPage: Step Card wrapper with step title and subtitle**

Wrap each rendered step component in a Step Card:

- `background: surface; border-radius: 12px; border: 1px solid border; box-shadow: shadow; padding: 30px` desktop / `18px` mobile.
- Step header above the step body: step title (27px / 700 / `letterSpacing: -0.5px` / `ink`, sourced from `STEP_LABELS`) and step subtitle (14.5px / `inkSoft` / `margin-top: 4px`, sourced from `STEP_SUBTITLES`). Margin below header before body: 22px.

**Commit 8 — WizardPage: Step Card footer styles**

Style the footer row at the bottom of the Step Card (already rendered via step component's Back + submit buttons):

- `display: flex; align-items: center; gap: 12px; margin-top: 28px; padding-top: 20px; border-top: 1px solid border`
- Back/Cancel button: kind `secondary`, left side
- Spacer: `flex: 1`
- Next/Finish button: kind `primary`, right side

---

### Phase 4 — Step body layouts

All six step bodies get a `*.styles.ts` file. A shared `StepSection` component (or styled block) is added to `src/features/wizard/` for the repeating section-block pattern: section title (15px / 700 / `ink` / `letterSpacing: -0.2`) + optional hint (12.5px / `muted`) with 26px top margin between sections (0 for the first).

**Commit 9 — BasicsStep body layout**

Horizontal flex layout: `display: flex; gap: 22px; align-items: flex-start; flex-wrap: wrap`.

Left column (`flex: 0 0 auto; width: 124px`): round photo upload field — a 124×124px circle with `border-radius: 50%`, `border: 1.5px dashed border`, `background: surfaceAlt`, centred camera icon (`muted`), "Add photo" label (12.5px / 700 / `inkSoft`). On hover: border switches to `primary`, icon and label switch to `primary`, background to `surface`.

Right column (`flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 16px`): Cat's name field, Breed field (optional), Age field (two-column `1fr 1fr` grid: numeric Input + unit Select).

Mobile (`≤640px`): columns stack vertically; photo circle centres.

**Commit 10 — FeedingStep body layout**

Add `StepSection` blocks:

- **Food** (hint: "What you serve, and how it's prepared.") — Repeatable entries in a `1fr 1fr 1fr` column grid (Brand, Flavor, Texture).
- **Serving** — two-column `1fr 1fr`: Amount per serving (numeric Input, hint "grams") + Feeding times (Chips, with clock icon prefix on each chip).
- **Supplements** (hint: "Vitamins or routine additions — not prescribed medications.") — Repeatable entries in a `1fr 1fr` grid (Brand, Flavor).
- **Plating instructions** (hint: "How to prepare or serve — add a photo if it helps.") — Textarea + photo upload field (not round, `height: 108px`).
- **Dietary notes** — Textarea (2 rows), placeholder "Allergies, sensitivities, anything to avoid…".

Mobile (`≤640px`): all multi-column grids collapse to one column.

**Commit 11 — RoutineStep body layout**

Chart block: `display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 22px`. Caption text below chart: 12.5px / `muted` / `text-align: center` / `max-width: 360px` — "Midnight sits at the top. Each block shows **when** it happens — overlaps and gaps are fine. Colours are assigned automatically."

Column headers row (hidden mobile): `Activity` | `Starts at` | `Duration` — 11px / 700 / uppercase / `muted`.

Slot rows: `display: flex; flex-wrap: wrap; align-items: center; gap: 10px; background: surfaceAlt; border: 1px solid border; border-radius: 8px; padding: 8px 10px`. Contents:

- 14px square colour dot (`border-radius: 4px`, background from `routinePalette[colorIndex]`)
- Flex-grow activity label Input (transparent background, no border — inline edit feel)
- 104px wide `<input type="time">` for start time (styled to match other Inputs)
- 78px wide numeric Input for hours + "h" suffix label
- Round 28px remove button (existing `Repeatable` pattern)

"Add activity" dashed-border button: full-width, `primary` text, `+` icon.

Total line: `Xh scheduled across the day` — right-aligned, 12.5px, `muted`. No warning for non-24h totals.

Mobile (`≤640px`): column headers hidden; slot rows wrap so name is on line 1, time/hours/remove on line 2.

**Commit 12 — FavoritesStep body layout**

Section blocks:

- **Toys** — Repeatable in `1fr 1.4fr` grid (Name, Description optional).
- **Treats** — Repeatable in `1fr 1fr` grid (Brand, Flavor).
- **Comfort items** (hint: "Blankets, beds, anything that soothes them.") — Chips.
- **Favourite spots** — Chips.

Mobile: grids collapse to one column.

**Commit 13 — MedicalStep body layout**

Section blocks:

- **Vet** — two rows of `1fr 1fr` (Name + Clinic, Phone + Address). Privacy note below: 11.5px / `muted` — "The address is only used to generate a 'Get directions' link in the guide. Your home address is never stored."
- **Emergency contacts** — Repeatable in `1.2fr 1fr 1fr` grid (Name, Phone, Relationship).
- **Medications** (hint: "Prescribed treatments — name, dosage, frequency, how to give it.") — Repeatable: top row `1.3fr 1fr 1fr` (Name, Dosage, Frequency), second row full-width Instructions Input.
- **Health notes** — two-column `1fr 1fr` (Known allergies optional Textarea 2-row, Medical conditions optional Textarea 2-row).

Mobile: all grids collapse to one column.

**Commit 14 — NotesStep body layout**

Single section block: **Special notes** (hint: "Anything the other steps didn't cover — quirks, house rules, do's and don'ts."). Repeatable entries with: Title Input, Details Textarea (2 rows, placeholder "What should the sitter know?"), photo upload field (height 96px, not round).

---

### Phase 5 — Dashboard

**Commit 15 — DashboardPage: sticky navbar and header row**

Add `DashboardPage.styles.ts`. Apply:

- Sticky navbar: `position: sticky; top: 0; z-index: 10; background: surface; border-bottom: 1px solid border; height: 64px`. Inner: `max-width: 1080px; margin: 0 auto; padding: 0 28px; display: flex; align-items: center`. Contains `Wordmark` only.
- Content wrapper: `max-width: 1080px; margin: 0 auto; padding: 34px 28px 120px`.
- Header row: `display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px`.
  - Left: "Your cats" title (33px / 700 / `letterSpacing: -0.7px` / `ink`) + subtitle `"{n} profiles · {m} ready to print"` (14.5px / `inkSoft` / `margin-top: 5px`). In merge-select mode the title changes to "Select two cats to merge" and subtitle to "Their guides will sit side-by-side in one PDF."
  - Right: "Merge guides" button (secondary, with inline merge SVG icon, `gap: 7px`). In merge-select mode replaced by a "Cancel" secondary button.
- Mobile (`≤640px`): navbar padding tightens; content padding tightens; single-column header row.

**Commit 16 — Extract `ProfileCard` component**

Create `src/components/ProfileCard/ProfileCard.tsx` and `ProfileCard.styles.ts`.

Props: `profile: CatProfile`, `mergeMode: boolean`, `selected: boolean`, `selectable: boolean`, `onEdit: () => void`, `onAction: () => void` (Generate PDF or Continue depending on status), `onDelete: () => void`, `onSelect: () => void`.

Visual structure:

- Card outer: `background: surface; border-radius: 12px; overflow: hidden; position: relative`. Border: `1.5px solid primary` when selected, `1.5px solid border` otherwise. Shadow: ring + shadow when selected; `shadow` on hover; `shadowSoft` default. Hover: `translateY(-2px)`, `transition: all 0.16s`.
- **Photo Zone** (128px tall): if photo, `<img>` with `object-fit: cover; width: 100%; height: 100%`. If no photo, centred `Mark` on `surfaceAlt` tinted background.
- **Top Scrim** (when photo present): `position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.10) 34%, transparent 56%); pointer-events: none`.
- **Status Badge** (top-left, position absolute, 12px from edges): uppercase chip, 11px / 700 / `letterSpacing: 0.4`. Draft: `surface` bg / `inkSoft` text / `1px solid border` / `shadowSoft`. Complete: `primary` bg / `primaryInk` text.
- **Merge checkbox** (top-right, position absolute, only in merge mode): 24px circle — filled `primary` with white check when selected, semi-transparent dark ring when unselectable.
- **Card body** (padding 18px):
  - Name: 22px / 700 / display font / `letterSpacing: -0.4px` / `ink`
  - Breed · age: 13.5px / `inkSoft` / `margin-top: 4px`. Format age as `"N yrs"` / `"N months"`.
  - Meta: 12px / `muted` / `margin-top: 8px`
  - Action row (hidden in merge mode): `display: flex; gap: 8px; margin-top: 16px`
    - Edit button: secondary sm, pencil SVG icon, `gap: 6px`
    - Generate PDF / Continue button: primary sm, `flex: 1` (fills remaining space)
    - Delete button: secondary sm, iconOnly, trash SVG icon

In merge mode: card is clickable (calls `onSelect`). Cursor `pointer` if selectable or selected, `not-allowed` otherwise. Opacity `0.5` if `mergeMode && !selectable && !selected`.

Icons (pencil edit, trash delete) are inline SVGs defined in `ProfileCard.tsx`, 14–15px.

**Commit 17 — Extract `PlusCard` component**

Create `src/components/PlusCard/PlusCard.tsx` and `PlusCard.styles.ts`.

Props: `onClick: () => void`.

Visual: full-height card matching the grid; `background: transparent; border: 1.5px dashed border; border-radius: 12px; min-height: 270px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: all 0.16s`. On hover: background `surfaceAlt`, border `primary`.

Contents: 52px circle (`primarySoft` bg, `+` svg icon in `primary`) + "New cat profile" (16px / 700 / display font / `ink`) + "Start the care-guide wizard" (12.5px / `muted`).

**Commit 18 — DashboardPage: card grid, EmptyState, ProfileCard and PlusCard integration**

Card grid: `display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px`.

EmptyState (shown when profiles list is empty): centred column, `padding: 80px 20px`. Brief `Mark` (84px) + "No care guides yet" title (26px / 700 / `letterSpacing: -0.4`) + description (15px / `inkSoft` / `max-width: 380px` / `line-height: 1.5`) + "Create your first profile" primary lg button (with `+` icon, `gap: 8px`).

Replace inline profile list rendering with `ProfileCard` components. Add `PlusCard` at the end of the grid (hidden in merge-select mode).

Mobile (`≤640px`): grid collapses to one column.

**Commit 19 — DashboardPage: merge-select mode styles**

Sticky action bar at the bottom of the viewport (visible only in merge-select mode): `position: fixed; bottom: 0; left: 0; right: 0; z-index: 30; background: surface; border-top: 1px solid border; box-shadow: 0 -8px 28px rgba(44,36,29,0.08)`. Inner: `max-width: 1080px; margin: 0 auto; padding: 16px 28px; display: flex; align-items: center; justify-content: space-between; gap: 16px`.

Left side: `"{selectedIds.length} of 2 selected"` (17px / 700 / display font / `ink`) + hint text `"Pick one more"` / `"Ready"` (13px / `muted`) side by side with `gap: 10px`.

Right side: "Create merged guide" button — `kind="primary"` when exactly 2 selected, `kind="disabled"` (styled, not truly disabled) otherwise.

---

## Decision Document

**Architecture: step components retain their footer**
Step components keep their `<form>` with Back and Next buttons. `WizardPage` wraps them in the styled Step Card shell and supplies `backLabel` and `submitLabel` as props. This avoids rewriting all step component tests and keeps each step independently testable.

**`backLabel` and `submitLabel` as `React.ReactNode`**
Both props accept `ReactNode` so icons can be embedded alongside text labels without introducing an `icon` prop on `Button`. Icons are inline SVGs defined where they are used.

**Cancel on step 1 is active navigation, not a disabled button**
The design navigates to Dashboard on Cancel (step 1 back action). `WizardPage` passes `onBack={() => navigate("/")}` for step 1. The disabled-Back pattern from the build phase is replaced.

**`ActivitySlot.start` is an absolute "HH:MM" clock time**
Not a computed offset. The arc math in `routineChartArcs.ts` handles midnight-spanning naturally (trig functions are periodic over 24h). No explicit modulo wrapping needed.

**No "must equal 24h" constraint on Routine step**
The design shows the total as informational only (`Xh scheduled across the day`). The warning and the corresponding tests are removed.

**`ProfileCard` and `PlusCard` live in `src/components/`**
Both are composed UI blocks with no business logic — they receive all callbacks as props. Domain types (`CatProfile`) appear in their prop interfaces but they own no domain logic. This follows the same decision as `ConfirmModal`.

**`StepSection` lives in `src/features/wizard/`**
It is only used inside wizard step bodies. Per CLAUDE.md, `features/` own their own components. It is a small styled block — title + optional hint + children — with no logic.

**"Favourites" (British spelling)**
The design consistently uses British spelling in all screenshots and reference files. All occurrences of "Favorites" in labels, tests, and constants are updated to "Favourites".

**Photo scrim toggle (prototype-only) is not shipped**
The bottom-left scrim toggle in `pb-dashboard.jsx` is explicitly called out in the README as a prototype-only demo control.

## Testing Decisions

Good tests cover external observable behaviour, not internal implementation or visual styling. Styled-components changes are transparent to tests. Layout wrapper additions are safe unless they change accessible names or ARIA roles.

**What to test:**

- `routineChartArcs.ts`: unit tests for `arcPath` — verify correct SVG path string for normal arcs, midnight-spanning arcs (start + hours > 24), and edge cases (exactly 24h, 0h).
- `RoutineStep`: test the new form fields (start time input, colorIndex assignment, total display). Remove the three tests that asserted 24h-sum behaviour. Update the running-total assertion to use the new default total.
- `WizardPage`: update the one test whose assertion changes ("Back disabled on Basics" → "Cancel navigates to Dashboard"). All other WizardPage tests remain unchanged.
- Stepper and WizardPage tests that reference `"Favorites"` as a literal string are updated to `"Favourites"`.
- `ProfileCard` and `PlusCard`: new unit tests following the pattern established by `ConfirmModal` and `Stepper` tests — render with controlled props, assert accessible structure (status badge text, button labels, aria roles), verify callbacks fire.

**Prior art for new tests:**

- `ConfirmModal.test.tsx` — confirms/cancels with callbacks, role="dialog" assertion
- `Stepper.test.tsx` — aria-current, button labels, click callbacks
- `Chips.test.tsx` — add/remove interactions

## Out of Scope

- Care Guide surfaces (single and merged PDF) — next initiative
- `@react-pdf/renderer` `RoutineChart` implementation — PDF initiative
- Dark mode palette — ThemeProvider infrastructure is ready; palette is future work
- Photo preview / EXIF strip — already implemented
- Merged Care Guide navigation destination — already stubbed; PDF initiative owns it

## Further Notes

The `src/assets/design_handoff_pawbrief/` folder is the single source of truth for visual decisions. When any pixel is ambiguous, open the relevant HTML file in a browser and measure. The README explicitly marks the bottom-left "Photo scrim" toggle as a demo control — it does not ship.

The `react-pdf-mapping.md` in the handoff folder documents how to port the Care Guide and Routine Chart to `@react-pdf/renderer`. That work is deferred to the PDF initiative but the shared arc math in `routineChartArcs.ts` is the bridge — keep that utility pure and well-tested.
