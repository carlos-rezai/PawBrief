# Plan: Design Handoff — Sienna Design System

> Source PRD: https://github.com/carlos-rezai/pawbrief/issues/9

## Architectural decisions

Durable decisions that apply across all phases:

- **ThemeProvider**: wraps the entire app in `main.tsx`, above the router. All styled components consume the theme via `styled-components`.
- **Token shape**: namespaced (`theme.colors`, `theme.typography`, `theme.spacing`, `theme.radii`, `theme.shadows`) — not flat. Typed via `styled.d.ts` declaration merging at the project root.
- **GlobalStyles**: CSS reset + `font-family: 'Plus Jakarta Sans'` on `body` + `background: theme.colors.bg` on `body`, applied once in `src/styles/GlobalStyles.ts`.
- **Font**: Plus Jakarta Sans loaded via Google Fonts CDN `<link>` in `index.html` (weights 400/500/600/700/800).
- **Arc math**: `src/utils/routineChartArcs.ts` is a pure utility shared by the web `RoutineChart` and the future PDF renderer. No component logic lives here.
- **Toast system**: `ToastProvider` wraps the app and exposes a `useToast` hook. No third-party library.
- **Shadows**: screen-only tokens. Must never be applied in react-pdf StyleSheets.

---

## Phase 1: Token system + ThemeProvider

**User stories**: 23 (Plus Jakarta Sans typeface), 25 (Sienna color palette)

### What to build

Populate `src/tokens/` with the Sienna values from the handoff package (`colors.ts`, `typography.ts`, `spacing.ts`, `radii.ts`, `shadows.ts`, `index.ts`). Create `styled.d.ts` at the project root to type `DefaultTheme`. Wrap the app in `ThemeProvider` inside `main.tsx`. Add `GlobalStyles` to `src/styles/GlobalStyles.ts` and render it once inside `App.tsx`. Add the Plus Jakarta Sans `<link>` to `index.html`.

At the end of this phase the app canvas renders with the warm Sienna background and correct typeface, but no component styling has changed yet.

### Acceptance criteria

- [ ] `src/tokens/colors.ts`, `typography.ts`, `spacing.ts`, `radii.ts`, `shadows.ts`, and `index.ts` exist and export a typed `theme` object
- [ ] `styled.d.ts` at the project root merges `DefaultTheme` so that `theme.*` is fully typed in styled-components
- [ ] `ThemeProvider` wraps the app in `main.tsx` above the router
- [ ] `GlobalStyles` sets the CSS reset, `font-family`, and `background` on `body`
- [ ] Plus Jakarta Sans is loaded via Google Fonts CDN in `index.html`
- [ ] Running the app shows the Sienna `bg` canvas color and Plus Jakarta Sans font

---

## Phase 2: Brand Mark + Wordmark

**User stories**: 2 (branded navbar with PawBrief Wordmark)

### What to build

Build two new primitives as pure SVG: `Mark` (the document-with-folded-corner-and-paw icon) and `Wordmark` (Mark + "PawBrief" logotype text). Both accept a `size` prop and render correctly at all sizes. No raster assets. Add accessibility attributes (`role`, `aria-label`). Add tests that verify rendering without throwing and check accessibility attributes.

### Acceptance criteria

- [ ] `src/primitives/Mark/` exists with `Mark.tsx` and `Mark.test.tsx`
- [ ] `src/primitives/Wordmark/` exists with `Wordmark.tsx` and `Wordmark.test.tsx`
- [ ] Both components are pure SVG — no `<img>` tags or raster assets
- [ ] Both accept a `size` prop and scale correctly
- [ ] Both have `role` and `aria-label` attributes
- [ ] Tests pass: render without throwing; accessibility attribute assertions

---

## Phase 3: Styled primitives

**User stories**: 17 (visible focus ring), 18 (error ring + error message)

### What to build

Style all five existing primitives in-place using styled-components and the theme tokens. `Button` gains `kind` (primary/secondary/ghost/disabled) and `size` (sm/md/lg) props, plus `iconOnly` flag — fixed heights from `theme.buttonSize`. `Input`, `Textarea`, and `Select` gain `hasError` boolean and render focus and error ring states; `Select` replaces the native arrow with a custom chevron SVG. `Field` gains `label`, `optional`, `hint`, and `error` props and renders a persistent label above the input slot. Extend each existing test file to cover the new variant/size/error props without breaking current behavioral tests.

### Acceptance criteria

- [ ] `Button` renders all four `kind` variants and three `size` variants with correct heights and padding from tokens
- [ ] `Input`, `Textarea`, and `Select` render a focus ring (`theme.colors.ring`) on focus and an error ring on `hasError=true`
- [ ] `Select` uses a custom chevron SVG, not the native browser arrow
- [ ] `Field` renders label, optional flag, hint text, and error message as distinct elements
- [ ] All five existing test files are extended; no previously passing tests break
- [ ] `npm run typecheck` passes with no new errors

---

## Phase 4: Shared components + arc utility

**User stories**: 10 (Toast), 11 (ConfirmModal), 12–13 (Stepper + click-to-jump), 19 (Chips), 20 (Repeatable), 21–22 (RoutineChart + color palette)

### What to build

Build the full shared component layer. All components are verifiable in isolation before any surface wires them in.

- **`routineChartArcs.ts`** (`src/utils/`): pure functions that convert an Activity Slot to an SVG arc path string given SVG size. Shared by the web renderer and the future PDF renderer.
- **`Modal`** (`src/primitives/`): overlay + backdrop + box shell. Accepts `children`; no built-in buttons.
- **`ConfirmModal`** (`src/components/`): composes `Modal` with two `Button`s and destructive copy. Fires `onConfirm` and `onCancel` callbacks.
- **`Stepper`** (`src/components/`): renders six labeled step stops with a progress line. Accepts `currentStep` and `onStepClick` (click-to-jump).
- **`Chips`** (`src/components/`): text input + Add button + horizontal removable chip list.
- **`Repeatable`** (`src/components/`): ordered list of entry cards with Remove per entry and a dashed Add button for new blank entries.
- **`Toast` + `ToastProvider`** (`src/components/`): `ToastProvider` wraps the app and exposes `useToast`. Toast auto-dismisses. One snackbar variant.
- **`RoutineChart`** (`src/components/`): 24-hour radial SVG clock. Each Activity Slot renders as an Arc using `routineChartArcs.ts`. Colors assigned by index from `routinePalette`.

Each new component/utility has its own co-located test file.

### Acceptance criteria

- [ ] `routineChartArcs.ts` exists in `src/utils/` with a co-located test covering arc geometry output
- [ ] `Modal` renders `children` inside an overlay; closes on backdrop click
- [ ] `ConfirmModal` fires `onConfirm` and `onCancel` callbacks; tests confirm both paths
- [ ] `Stepper` renders 6 step labels; marks the active step; fires `onStepClick` with the correct index
- [ ] `Chips` adds a chip on submit; removes a chip on dismiss; renders the current list
- [ ] `Repeatable` adds a blank entry on Add; removes an entry on Remove; renders the entry list
- [ ] `useToast` enqueues a message that appears in the DOM; Toast auto-dismisses after timeout
- [ ] `RoutineChart` renders one `<path>` per Activity Slot; applies `routinePalette` colors by index
- [ ] All new test files pass; `npm run typecheck` passes

---

## Phase 5: Dashboard surface

**User stories**: 1 (polished app), 3 (Profile Card grid), 4 (Photo Zone + Scrim), 5 (Status Badge), 6 (Plus Card), 7 (Merge-select Mode), 8 (Drafts dimmed), 9 (sticky action bar), 10 (Toast), 11 (ConfirmModal on delete)

### What to build

Wire the full styled Dashboard by updating `src/pages/DashboardPage/DashboardPage.tsx` and any Dashboard-scoped components in `src/features/`. The Dashboard renders:

- Sticky 64px navbar with `surface` background, `Wordmark` left-aligned
- Header row: "Your cats" title/subtitle + "Merge guides" button (disabled if fewer than two Complete Profiles)
- Profile card grid: `repeat(auto-fill, minmax(280px, 1fr))`, 20px gap
- Profile Card: 128px Photo Zone with top Scrim gradient, Status Badge (Draft/Complete), Edit / Generate PDF / Delete actions
- Plus Card: dashed border, `Mark` centered, empty-state label — sole entry point for new profiles
- Merge-select Mode: checkbox overlay on Complete cards, Draft cards dimmed and unselectable, sticky bottom action bar with selection count and "Create merged guide" CTA (stub navigation)
- `ConfirmModal` on Delete
- `Toast` notifications (bottom-right, auto-dismiss) wired to save/delete actions

### Acceptance criteria

- [ ] Navbar is sticky at 64px with `Wordmark` visible
- [ ] Profile cards render in the correct auto-fill grid
- [ ] Each Profile Card shows the Photo Zone with Scrim, Status Badge, and all three action buttons
- [ ] Plus Card navigates to the Wizard on click
- [ ] "Merge guides" button is disabled with fewer than two Complete Profiles
- [ ] Merge-select Mode activates on "Merge guides" click; Draft cards are visually dimmed and cannot be selected
- [ ] Sticky action bar appears in Merge-select Mode showing live selection count
- [ ] Delete triggers `ConfirmModal`; confirming fires the delete action; cancelling dismisses the modal
- [ ] Toast appears after successful save and delete actions and auto-dismisses

---

## Phase 6: Wizard surface

**User stories**: 12 (Stepper), 13 (click-to-jump), 14 (Step Card), 15 ("Draft saved" Toast), 16 (success dialog), 17 (focus ring), 18 (error ring), 19 (Chips), 20 (Repeatable), 21–22 (RoutineChart), 24 (mobile ≤640px)

### What to build

Wire the full styled Wizard by updating `src/pages/WizardPage/WizardPage.tsx` and each of the six step feature components. The Wizard renders:

- Sticky navbar: `Wordmark` + "Dashboard" back link
- `Stepper` below the navbar; click-to-jump enabled in Edit Mode
- Step Card shell around each step: `surface` background, `radius: 12`, padding 30px desktop / 18px mobile, step title + subtitle
- Footer nav: Back/Cancel (secondary) on the left; Next/Finish (primary) on the right
- All six step bodies styled using `Field`, `Input`, `Textarea`, `Select`, `Repeatable`, and `Chips` as appropriate per step
- `RoutineChart` wired into the Routine step displaying live Activity Slot data
- "Draft saved" `Toast` fires on Next
- Success dialog (`Modal`) on Finish
- Mobile responsive at ≤640px breakpoint throughout

### Acceptance criteria

- [ ] `Stepper` is visible below the sticky navbar on all steps
- [ ] Click-to-jump works in Edit Mode; does not work when creating a new profile (forward-only)
- [ ] Each step renders inside a Step Card with the correct title, subtitle, and padding
- [ ] Footer nav renders correct button labels and variants at each step (Back disabled on step 1, Finish on step 6)
- [ ] All six step form bodies use the styled primitives and components
- [ ] `RoutineChart` renders in the Routine step and updates as Activity Slots change
- [ ] "Draft saved" Toast fires each time Next is clicked
- [ ] Success dialog appears on Finish; dismissing it navigates back to the Dashboard
- [ ] At ≤640px the layout is usable: Step Card padding reduces, no horizontal overflow
- [ ] `npm run typecheck` and `npm test` pass
