# 02 — Design Handoff: Sienna Design System

## Background

The profile wizard (01) is functionally complete — all 6 steps, IndexedDB persistence,
and @react-pdf/renderer PDF generation exist. However the entire codebase is visually
unstyled: `src/tokens/` is empty, primitives are bare HTML wrappers, and styled-components
is declared but unused.

The design handoff package (`src/assets/design_handoff_pawbrief/`) provides a complete
Sienna design system (tokens, components, and 4 prototype surfaces) as HTML/React-via-Babel
files. The task is to recreate it in the production codebase using its established patterns.

Reference: `src/assets/design_handoff_pawbrief/README.md`

## Problem

Translate the Sienna design system from the handoff prototypes into the PawBrief codebase:
establish the token system, style all primitives, build new shared components, and apply
the design to the Dashboard and Wizard surfaces.

## Questions and Answers

**Q1: Styling approach — direct token imports or ThemeProvider?**
ThemeProvider. Enables future dark/light mode switching without a rewrite.

**Q2: Theme object shape — flat or namespaced?**
Namespaced: `theme.colors`, `theme.typography`, `theme.spacing`, `theme.radii`, `theme.shadows`.
Matches the `src/tokens/` folder structure. Flat becomes unwieldy at ~40 tokens.

**Q3: What is the scope of this initiative?**
Tokens → styled primitives → Dashboard (full, including merge-select UI) → Wizard (all 6 steps).
Care Guide web views are excluded — those are reference-only for the PDF initiative.
Merge-select UI is included even though the merged PDF destination is not yet built.

**Q4: How to handle existing bare primitives (Button, Input, Field, Select, Textarea)?**
Replace in-place. Existing tests cover behavior, not appearance — they survive a styling rewrite.
Extend test files to cover new variant/size props.

**Q5: Where do new UI pieces live?**
`primitives/`: Modal, brand Mark, Wordmark (pure render, no composition).
`components/`: Stepper, Chips, Repeatable, ConfirmModal, Toast, RoutineChart (all composed).

**Q6: Toast system — custom or library?**
Custom: `useToast` hook + `ToastProvider` context + `Toast` component in `components/`.
Design only specifies one variant (simple snackbar). A library adds dependency for trivial scope.

**Q7: Routine chart — shared math or two independent implementations?**
Shared arc math in `src/utils/routineChartArcs.ts` (pure functions, no rendering).
Web renderer: `src/components/RoutineChart/` (browser SVG).
PDF renderer: `src/features/pdf/` (react-pdf `<Svg>`/`<Path>`).
Arc geometry is non-trivial; sharing it prevents drift.

**Q8: Merge-select mode — in scope or deferred?**
In scope. OK if "Create merged guide" navigates to an unbuilt destination — handled in PDF initiative.

**Q9: Font loading — Google Fonts or self-hosted?**
Google Fonts (`Plus Jakarta Sans`) via `<link>` in `index.html`. Portfolio project; external
font CDN is standard practice and zero maintenance.

## Design

### Token system

```
src/tokens/
├── colors.ts       — Sienna palette (bg, surface, ink, primary, accent, etc.)
├── typography.ts   — font family, scale (display→caption), weights, letter-spacing
├── spacing.ts      — 2px-based scale + named aliases (card padding, section gap)
├── radii.ts        — card:12, button:9, input:8, chip:6
├── shadows.ts      — shadow, shadowSoft (screen-only; never in print)
└── index.ts        — assembles DefaultTheme object; exports theme + type
```

`styled.d.ts` at project root uses declaration merging to type `DefaultTheme`.

`ThemeProvider` wraps the app in `main.tsx` (above the router).

Global styles via `createGlobalStyle` in `src/styles/GlobalStyles.ts`:

- CSS reset (box-sizing, margin/padding)
- `font-family: 'Plus Jakarta Sans'` on `body`
- `background: theme.colors.bg` on `body`

`index.html` gets a `<link>` for Plus Jakarta Sans (weights 400/500/600/700/800).

### Primitive updates (replace in-place)

| Primitive  | New props added                                                          |
| ---------- | ------------------------------------------------------------------------ |
| `Button`   | `kind` (primary/secondary/ghost/disabled), `size` (sm/md/lg), `iconOnly` |
| `Input`    | `hasError` boolean; focus/error ring states via styled-components        |
| `Textarea` | `hasError` boolean; same ring states as Input                            |
| `Select`   | `hasError` boolean; custom chevron SVG; no native arrow                  |
| `Field`    | `label`, `optional`, `hint`, `error` props; persistent label above       |

### New primitives

```
src/primitives/
├── Modal/
│   ├── Modal.tsx          — overlay + backdrop + box shell
│   ├── Modal.styles.ts
│   └── Modal.test.tsx
├── Mark/
│   ├── Mark.tsx           — "Brief" document+paw SVG mark (all sizes)
│   ├── Wordmark.tsx       — "PawBrief" logotype (Mark + text)
│   └── Mark.test.tsx
```

### New components

```
src/components/
├── Stepper/
│   ├── Stepper.tsx        — 6-step progress indicator, click-to-jump
│   ├── Stepper.styles.ts
│   └── Stepper.test.tsx
├── Chips/
│   ├── Chips.tsx          — text input + Add button + chip list
│   ├── Chips.styles.ts
│   └── Chips.test.tsx
├── Repeatable/
│   ├── Repeatable.tsx     — entry card list + dashed Add button
│   ├── Repeatable.styles.ts
│   └── Repeatable.test.tsx
├── ConfirmModal/
│   ├── ConfirmModal.tsx   — Modal + two Buttons + destructive copy
│   ├── ConfirmModal.styles.ts
│   └── ConfirmModal.test.tsx
├── Toast/
│   ├── Toast.tsx          — snackbar component
│   ├── Toast.styles.ts
│   ├── Toast.test.tsx
│   ├── ToastProvider.tsx  — context + useToast hook
│   └── ToastProvider.test.tsx
└── RoutineChart/
    ├── RoutineChart.tsx   — 24h radial SVG clock (browser)
    ├── RoutineChart.styles.ts
    └── RoutineChart.test.tsx
```

Routine chart arc math:

```
src/utils/
└── routineChartArcs.ts   — pure functions: activityToArcPath(activity, svgSize) → string
```

### Surfaces

**Dashboard** (`src/pages/DashboardPage/`): styled per design handoff.

- Sticky navbar (64px, `surface`, Mark + Wordmark)
- Header row: "Your cats" title + subtitle + "Merge guides" button
- Profile card grid: `repeat(auto-fill, minmax(280px, 1fr))`, gap 20px
- Profile card: 128px photo zone with top scrim, status badge, Edit/PDF/delete actions
- Plus card: dashed border, Brief mark, empty state
- Merge-select mode: checkbox overlays, drafts dimmed, sticky action bar
- Toast notifications (bottom-right)

**Wizard** (`src/pages/WizardPage/` + `src/features/wizard/*/`): styled per design handoff.

- Sticky navbar: logo + "Dashboard" back link
- Stepper (6 steps, click-to-jump)
- Step card: `surface` bg, radius 12, padding 30/18, title + subtitle
- Footer nav: Back/Cancel (secondary) + Next/Finish (primary)
- All 6 step bodies styled with Field, Input, Textarea, Select, Repeatable, Chips
- RoutineChart in RoutineStep
- "Draft saved" toast on Next; success dialog on Finish

### Rejected alternatives

- ❌ Direct token imports (no ThemeProvider) — ruled out: no future dark/light mode path
- ❌ Flat theme shape — ruled out: unwieldy at 40+ tokens, naming conflicts possible
- ❌ react-hot-toast — ruled out: single variant, adds dependency, harder to match Sienna tokens
- ❌ Self-hosted font — ruled out: unnecessary overhead for a portfolio project
- ❌ Care Guide web views — ruled out of scope: reference-only, real output is PDF (next initiative)
- ❌ Separate base + styled wrapper for primitives — ruled out: no shared-base benefit (PDF uses react-pdf primitives, not HTML)

## Implementation Plan

**Phase 1 — Token system + ThemeProvider**

- `src/tokens/` files (colors, typography, spacing, radii, shadows, index)
- `styled.d.ts` DefaultTheme declaration
- `ThemeProvider` in `main.tsx`
- `createGlobalStyle` in `src/styles/GlobalStyles.ts`
- Google Fonts link in `index.html`
- `npm run typecheck` passes

**Phase 2 — Brand mark**

- `src/primitives/Mark/Mark.tsx` (Brief document+paw SVG)
- `src/primitives/Mark/Wordmark.tsx`
- Renders correctly at all sizes; tests pass

**Phase 3 — Styled primitives**

- Replace Button, Input, Textarea, Select, Field in-place
- Variant/size system per design handoff spec
- All existing tests pass + new variant tests added

**Phase 4 — Shared components**

- Modal primitive
- ConfirmModal, Stepper, Chips, Repeatable
- Toast + ToastProvider
- `routineChartArcs.ts` utils + tests
- RoutineChart web component

**Phase 5 — Dashboard**

- Navbar, header row, profile card grid, plus card
- Profile card (photo scrim, status badge, actions)
- Merge-select mode (checkbox overlays, sticky bar, dimmed drafts)
- ConfirmModal on delete
- Toast on actions

**Phase 6 — Wizard**

- WizardPage layout (navbar, stepper, step card, footer nav)
- All 6 step bodies styled (BasicsStep through NotesStep)
- RoutineChart wired into RoutineStep
- "Draft saved" toast on Next; success dialog on Finish
- Mobile responsive (≤640px breakpoint)

## Trade-offs

**Easier:**

- Future dark mode: add a `darkTheme` object and swap it into ThemeProvider
- PDF token sharing: `src/tokens/` values can be imported directly into react-pdf StyleSheet
- Routine chart math: fixing arc logic once fixes both web and PDF renderers

**Harder:**

- ThemeProvider requires `styled.d.ts` boilerplate and correct Provider placement
- Styled-components adds a build step consideration (though Vite handles it)

**Out of scope:**

- Care Guide web views (HTML prototypes are reference-only; PDF is the real deliverable)
- Merged PDF navigation destination (stubbed; PDF initiative owns it)
- Dark mode implementation (ThemeProvider is the infrastructure; palette is future work)
- @react-pdf/renderer RoutineChart implementation (PDF initiative)
