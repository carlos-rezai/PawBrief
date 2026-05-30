## Problem Statement

The PawBrief profile wizard is functionally complete — all six steps, IndexedDB persistence, and PDF generation exist — but the entire app is visually unstyled. `src/tokens/` is empty, primitives are bare HTML wrappers, and styled-components is declared but unused. The Owner has no polished surface to interact with, and the app cannot be shared as a portfolio project in its current state.

A complete Sienna design system exists in the handoff package (`src/assets/design_handoff_pawbrief/`) as HTML/React-via-Babel prototypes. The task is to translate that system into the production codebase.

## Solution

Implement the Sienna design system end-to-end: establish the token system and ThemeProvider, style all existing primitives in-place, build all new shared components, and apply the design to both the Dashboard and Wizard surfaces.

## User Stories

1. As an Owner, I want to see a warm, polished app when I first open PawBrief, so that I feel confident sharing it with a Pet-sitter.
2. As an Owner, I want a clearly branded navbar with the PawBrief Wordmark, so that the app feels professional and cohesive.
3. As an Owner, I want the Dashboard to display all my Profile Cards in a clean grid, so that I can quickly see all my cats at a glance.
4. As an Owner, I want each Profile Card to show my cat's photo in a Photo Zone with a Scrim overlay, so that the cat's name and Status Badge remain legible against any photo.
5. As an Owner, I want a Status Badge on each Profile Card that shows "Draft" or "Complete", so that I know at a glance which profiles are ready to share.
6. As an Owner, I want a Plus Card on the Dashboard as the sole entry point for creating a new Profile, so that the action is always discoverable.
7. As an Owner, I want to enter Merge-select Mode from the Dashboard to select exactly two Complete Profiles, so that I can generate a Merged Care Guide.
8. As an Owner, I want Draft profiles to appear dimmed and unselectable in Merge-select Mode, so that I cannot accidentally merge an incomplete Profile.
9. As an Owner, I want a sticky action bar to appear in Merge-select Mode showing my selection count, so that I can confirm my choices before generating.
10. As an Owner, I want to see a Toast notification after completing actions like saving or deleting, so that I know the action succeeded without a full page reload.
11. As an Owner, I want a ConfirmModal to appear before a Profile is deleted, so that I cannot accidentally destroy data.
12. As an Owner, I want the Wizard to show a Stepper at the top with all six Steps labeled, so that I can see my progress and know what's coming.
13. As an Owner, I want to click any step in the Stepper to jump directly to it (when editing), so that I do not have to step through the entire wizard to fix one field.
14. As an Owner, I want each Wizard step to appear inside a styled Step Card with a clear title and subtitle, so that each section feels structured and readable.
15. As an Owner, I want a persistent "Draft saved" Toast to appear when I advance to the next step, so that I know my progress is saved.
16. As an Owner, I want a success dialog to appear when I finish the last step, so that I have a clear moment of completion.
17. As an Owner, I want all text inputs, selects, and textareas to show a visible focus ring, so that keyboard navigation is clear.
18. As an Owner, I want form fields to show a red error ring and an error message below, so that I can identify and fix validation errors quickly.
19. As an Owner, I want to add and remove short tag-like values using the Chips component (e.g. favourite spots), so that the input feels fluid and space-efficient.
20. As an Owner, I want to add, edit, and remove structured entries using the Repeatable component (e.g. food entries, supplements), so that repeated data feels organised.
21. As an Owner, I want to see my cat's daily Routine as a Routine Chart — a 24-hour radial SVG clock — in the Routine step, so that I can visually confirm the schedule looks correct.
22. As an Owner, I want each Activity Slot in the Routine Chart to have a distinct color from the Color Palette, so that the Arcs are easy to distinguish.
23. As an Owner, I want the app to use Plus Jakarta Sans as the typeface, so that the visual design matches the Sienna direction consistently.
24. As an Owner, I want the Wizard to be usable on a mobile screen (≤640px), so that I can fill in details from my phone.
25. As an Owner, I want the app background and surfaces to use the Sienna color palette, so that the visual experience is warm and consistent throughout.

## Implementation Decisions

### Token system

- Tokens are organised in `src/tokens/` as separate files: `colors.ts`, `typography.ts`, `spacing.ts`, `radii.ts`, `shadows.ts`, and an `index.ts` that assembles the `DefaultTheme` object.
- Token shape is namespaced (`theme.colors`, `theme.typography`, `theme.spacing`, `theme.radii`, `theme.shadows`) — not flat — to avoid naming conflicts as the token set grows.
- `styled.d.ts` at the project root uses declaration merging to type `DefaultTheme`.
- `ThemeProvider` wraps the entire app in `main.tsx`, above the router.
- Global styles via `createGlobalStyle` in `src/styles/GlobalStyles.ts`: CSS reset, `font-family: 'Plus Jakarta Sans'` on `body`, `background: theme.colors.bg` on `body`.
- `index.html` gets a `<link>` for Plus Jakarta Sans (weights 400/500/600/700/800) via Google Fonts CDN.

### Primitive updates (replace in-place)

- `Button`: gains `kind` prop (primary/secondary/ghost/disabled) and `size` prop (sm/md/lg), plus `iconOnly` flag.
- `Input`: gains `hasError` boolean; renders focus and error ring states via styled-components.
- `Textarea`: gains `hasError` boolean; same ring states as Input.
- `Select`: gains `hasError` boolean; renders a custom chevron SVG — no native arrow.
- `Field`: gains `label`, `optional`, `hint`, and `error` props; renders a persistent label above the input.
- Existing tests cover behavior, not appearance — they survive the styling rewrite. Each test file is extended to cover new variant and size props.

### New primitives

- `Modal`: overlay + backdrop + box shell. Accepts children; no built-in buttons.
- `Mark`: the "Brief" document-with-folded-corner-and-paw SVG, built entirely in SVG code — no raster asset. Accepts a `size` prop.
- `Wordmark`: combines the Mark and the "PawBrief" logotype text. Built in SVG.

### New components

- `Stepper`: renders all six wizard steps as labeled stops with a progress line; supports click-to-jump.
- `Chips`: a text input + Add button + horizontal chip list. Chips are individually removable.
- `Repeatable`: manages an ordered list of entry cards. Each card has a Remove action; a dashed Add button appends a new blank entry.
- `ConfirmModal`: composes Modal with two Buttons and destructive copy. Used exclusively for delete confirmation.
- `Toast` + `ToastProvider`: custom snackbar system. `ToastProvider` wraps the app and provides a `useToast` hook. Toast auto-dismisses. One variant (simple snackbar). No third-party library.
- `RoutineChart`: a 24-hour radial SVG clock rendered in the browser. Each Activity Slot is an Arc drawn from its start time across its duration.

### Arc math

- `src/utils/routineChartArcs.ts` contains pure functions that convert Activity Slots to SVG arc path strings (`activityToArcPath(activity, svgSize) → string`).
- The web `RoutineChart` component and the PDF renderer (in the PDF initiative) both consume this utility — arc geometry is shared to prevent drift between renderers.

### Dashboard surface

- Sticky navbar: 64px, `surface` background, Mark + Wordmark left-aligned.
- Header row: "Your cats" title + subtitle + "Merge guides" button (disabled when fewer than two Complete Profiles exist).
- Profile card grid: `repeat(auto-fill, minmax(280px, 1fr))`, 20px gap.
- Profile Card: 128px Photo Zone with top Scrim gradient, Status Badge (Draft/Complete), Edit / Generate PDF / Delete actions.
- Plus Card: dashed border, Mark centered, empty-state label.
- Merge-select Mode: checkbox overlay on each card, Drafts dimmed, sticky bottom action bar showing selection count and "Create merged guide" CTA.
- ConfirmModal on delete.
- Toast notifications (bottom-right, auto-dismiss).

### Wizard surface

- Sticky navbar: Wordmark + "Dashboard" back link.
- Stepper below navbar, six labeled steps, click-to-jump in Edit Mode.
- Step Card: `surface` background, `radius: 12`, padding 30px (desktop) / 18px (mobile), step title + subtitle above the form body.
- Footer nav: Back / Cancel (secondary) on the left; Next / Finish (primary) on the right.
- All six step bodies styled with Field, Input, Textarea, Select, Repeatable, and Chips as appropriate.
- RoutineChart wired into the Routine step.
- "Draft saved" Toast fires on Next.
- Success dialog on Finish.
- Mobile responsive at ≤640px breakpoint.

### Implementation phases

1. Token system + ThemeProvider
2. Brand Mark + Wordmark primitives
3. Styled primitives (Button, Input, Textarea, Select, Field)
4. Shared components (Modal, ConfirmModal, Stepper, Chips, Repeatable, Toast + ToastProvider, RoutineChart) + `routineChartArcs.ts`
5. Dashboard surface
6. Wizard surface

## Testing Decisions

A good test verifies external behaviour — what the component renders and how it responds to user interaction — not implementation details like class names or styled-components internals.

### Modules to test

- **`routineChartArcs.ts`** (utils): pure function tests — given an Activity Slot and SVG size, assert the output path string represents the correct arc geometry. Every function in `src/utils/` must have a test (project rule).
- **`Stepper`**: renders the correct number of steps; marks the active step; fires the click-to-jump callback with the correct step index.
- **`Chips`**: adding a chip via the input + button; removing a chip; rendering the current chip list.
- **`Repeatable`**: adding a new blank entry; removing an entry; rendering the entry list.
- **`ConfirmModal`**: renders title and body copy; fires confirm callback; fires cancel callback.
- **`Toast` / `ToastProvider`**: `useToast` enqueues a message that appears in the DOM; the Toast auto-dismisses after the timeout.
- **`RoutineChart`**: renders one `<path>` element per Activity Slot; uses the correct color from the Color Palette by index.
- **Styled primitives** (`Button`, `Input`, `Textarea`, `Select`, `Field`): extend existing test files to cover new variant/size/error props without breaking existing behavioral tests.
- **`Modal`** + **`Mark`** / **`Wordmark`**: render without throwing; snapshot or attribute checks for accessibility (role, aria labels).

### Prior art

Existing primitive tests in `src/primitives/` (`Button.test.tsx`, `Input.test.tsx`, etc.) serve as the pattern: render with Testing Library, assert on visible output and user events, avoid asserting on CSS.

## Out of Scope

- Care Guide web views (HTML prototypes in the handoff are reference-only; the real deliverable is the PDF, owned by the PDF initiative).
- Merged Care Guide navigation destination (the "Create merged guide" CTA may navigate to an unbuilt route; the PDF initiative owns that destination).
- Dark mode implementation (ThemeProvider provides the infrastructure; the dark palette is future work).
- `@react-pdf/renderer` RoutineChart implementation (PDF initiative owns the print renderer; only the shared arc math utility is in scope here).
- localStorage — all persistence uses IndexedDB (already implemented in the wizard).

## Further Notes

- The handoff package (`src/assets/design_handoff_pawbrief/`) contains a `tokens.ts` file and several JSX prototype files. These are the authoritative visual reference — read them before implementing any token or component.
- The `react-pdf-mapping.md` file in the handoff package documents how design tokens map to `@react-pdf/renderer` StyleSheet values. It is reference material for the PDF initiative, not this one.
- The Merge-select Mode "Create merged guide" CTA intentionally navigates to an unbuilt destination. This is a known stub — no placeholder page is required; a no-op or console warning is acceptable until the PDF initiative is complete.
- Shadows (`shadow`, `shadowSoft`) are screen-only design tokens. They must never be applied inside react-pdf StyleSheets (react-pdf does not support box-shadow).
- The Mark and Wordmark are pure SVG — no raster asset. They must render correctly at all sizes by accepting a `size` prop.
