## Problem Statement

The profile-wizard feature has a complete data model, a working storage layer
(`profileStorage`, `photoStorage`, `useProfile`, `useProfiles`), and all six wizard
step components — but the integration layer connecting them is broken or absent.
The app cannot save any data, cannot navigate through the wizard, and has several
disconnected features that were built in isolation and never wired together.
Additionally, a handful of structural issues (barrel inconsistency, logic in the
wrong layer, a memory leak, a partial `MergedPDF`) will make the codebase harder
to extend as subsequent features land.

## Solution

Wire the existing building blocks into a working end-to-end flow — routing → new
profile creation → wizard step navigation → step saving → photo storage → preview
→ download — then clean up the structural issues so the codebase is in an honest,
maintainable state before the visual redesign pass begins.

## Commits

### Commit 1 — Add `StepData` union type and fix `useProfile.saveStep`

Export a `StepData` union type from `types/profile.ts`:

```
StepData = BasicsData | FeedingData | RoutineData | FavoritesData | MedicalData | NotesData
```

Update the `UseProfileReturn` interface so `saveStep` accepts `(step: WizardStep, data: StepData)`
instead of `(step: WizardStep, data: BasicsData)`. The implementation already uses a computed
key (`[step]: data`) so no logic changes are needed — only the type signature. Update the
`useProfile` test to exercise a non-basics step save to confirm the fix.

This is a purely additive type change; it fixes a compile-time error and unblocks all
subsequent commits.

### Commit 2 — Complete `wizard/index.ts` barrel

Add the three missing exports — `FavoritesStep`, `MedicalStep`, `NotesStep` — to
`features/wizard/index.ts`. Update `WizardPage` to import all six steps from the
barrel instead of mixing barrel imports with direct-path imports. No runtime
behaviour changes; housekeeping only.

### Commit 3 — Add the edit-mode wizard route to `App.tsx`

Register `/wizard/:id/step/:step` as a route in `App.tsx`, nested under `AppLayout`,
pointing to `WizardPage`. The existing `/wizard/new` route stays. No user-visible
change yet — the new route is reachable but `WizardPage` is not yet wired.

### Commit 4 — Wire `WizardPage`: new-profile creation and step navigation

`WizardPage` currently does nothing with profile creation or step transitions.
This commit makes it work end-to-end.

**New-profile flow** (`/wizard/new`):
When the `:id` param is absent or equals the literal string `"new"`, `WizardPage`
calls `createProfile()` from `useProfiles` and immediately replace-navigates to
`/wizard/:newId/step/basics`. The component then re-mounts with the real profile ID
and loads the profile via `useProfile`. No special-casing needed after the redirect.

**Step navigation**:
For each step, `WizardPage` passes an `onSave` callback that calls `saveStep(step, data)`
then navigates forward — to the next step URL if one exists, or to `/preview/:id`
after the final step (Notes). It also passes an `onBack` callback that navigates to
the previous step URL. Both use `useNavigate` from React Router.

The step order is fixed: basics → feeding → routine → favorites → medical → notes.

Update `WizardPage.test.tsx` to cover: redirect on `/wizard/new`, saving a step
persists to storage, completing the final step navigates to the preview.

### Commit 5 — Add `getNextStep` utility and wire Dashboard buttons

Add a pure utility function `getNextStep(profile: CatProfile): WizardStep | null`
to `src/utils/`. It returns the first `WizardStep` not present in
`profile.completedSteps`, or `null` if all six steps are complete. Add a unit test
covering: all incomplete, partially complete, fully complete cases.

Wire the Dashboard buttons:

- **Edit** button → `navigate('/wizard/:id/step/basics')` for complete profiles
- **Continue** button → `navigate('/wizard/:id/step/:nextStep')` using `getNextStep`
- Both only render when their precondition is met (Edit only for complete profiles,
  Continue only for drafts) — confirm the existing conditional render is correct and
  fix if not

### Commit 6 — Wire photo save in `BasicsStep`

`BasicsStep` currently validates a photo file and tracks validation errors but never
calls `savePhoto`. Fix the full upload flow:

1. When the user selects a valid file, store it in local component state as a pending `File`.
2. On form submit, if a pending file exists, call `savePhoto(file)` and await the
   returned `photoId`.
3. Include the `photoId` in the `BasicsData` passed to `onSave`.
4. If no new file was selected but the profile already has a `photoId` (edit mode),
   carry the existing `photoId` through unchanged.

Update `BasicsStep.test.tsx` to assert that submitting with a photo file results in
`onSave` being called with a non-null `photoId`.

### Commit 7 — Wire photo save in `FeedingStep`

Same pattern as Commit 6, applied to `platingPhotoId` in `FeedingStep`. Only one
photo field (plating instructions). Update `FeedingStep.test.tsx` accordingly.

### Commit 8 — Wire photo save in `NotesStep`

Same pattern, but `NotesStep` has a photo per note entry. Each note tracks its own
pending `File` in local state alongside its existing `photoId`. On submit, call
`savePhoto` for every note that has a pending file, resolve all `photoId`s, then
call `onSave` with the complete `NotesData`. Update `NotesStep.test.tsx`.

### Commit 9 — Extract `usePhotoBlobUrls` hook and fix memory leak

Create `src/features/preview/usePhotoBlobUrls.ts`. This hook accepts a
`CatProfile | null`, collects all photo IDs from the profile (basics, feeding plating,
each note), calls `getPhoto(id)` for each, creates object URLs via
`URL.createObjectURL`, and returns a `Record<string, string>` mapping photo ID to
blob URL. On cleanup (unmount or profile change), it revokes all created object URLs
via `URL.revokeObjectURL` — fixing the memory leak that currently exists in
`PreviewPage`.

Add `src/features/preview/usePhotoBlobUrls.test.ts`.

Update `PreviewPage` to use `usePhotoBlobUrls(profile)` instead of the inline
`useEffect` + `useState` block. `PreviewPage` becomes composition-only again.

### Commit 10 — Complete `MergedPDF`

`MergedPDF` currently renders only Basics, Feeding, and Medical sections.
Add the missing sections in the two-column table layout:

- **Routine** — Render each cat's `RoutineData.slots` as a list (label + duration).
  The `PieChart` SVG component will be added as a follow-on once its rendering is
  validated in `SinglePDF` first; this commit uses a plain text slot list.
- **Favorites** — Toys, treats, comfort items, favourite spots for each cat.
- **Notes** — Special notes (title + body) for each cat. Photos are not rendered in
  `MergedPDF` (column width at ~250pt makes photo layout impractical; consistent with
  the existing design decision to omit photos from the merged layout).

Each section follows the existing flex-row pattern: left column for profile A,
right column for profile B. Update the `MergedPreviewPage.test.tsx` to assert the
new sections are present in the rendered document.

## Decision Document

**`StepData` union type lives in `types/profile.ts`**
It is the single source of truth for the profile data model. The union belongs there
alongside the types it composes, not scattered across individual feature files.

**New-profile creation lives in `WizardPage`**
`WizardPage` is the entry point for the wizard flow. Placing profile creation here
avoids leaking that concern into `DashboardPage` (which would need to know what step
to navigate to) and keeps the redirect logic co-located with the component that needs
the resulting ID.

**Photo saving lives in each step component**
Each step component owns its photo upload UX — validation feedback, error messages,
pending state. Calling `savePhoto` in the step keeps the full upload flow
self-contained and prevents `WizardPage` (a page, not a feature) from acquiring
storage concerns. `savePhoto` is a feature-layer function; calling it from a
feature-layer component (`features/wizard/*`) is correct by the layer rules.

**`usePhotoBlobUrls` lives in `features/preview/`**
`CLAUDE.md` lists `features/preview/` as an intended feature folder for live care
guide preview logic. The hook belongs there rather than in `features/profile/`
because its purpose is display (turning stored blobs into renderable URLs), not
storage. `PreviewPage` in `pages/` remains a thin wrapper.

**`getNextStep` lives in `utils/`**
It is a pure function (profile → step | null) with no side effects. It will be
shared by `WizardPage` (to advance the stepper) and `DashboardPage` (for the
Continue button), satisfying the "used across 2+ features" rule for `utils/`.

**Photos not rendered in `MergedPDF`**
At ~250pt column width, embedding full-width photos would make each column
unreadably narrow. This was an implicit constraint in the two-column layout design
and is now made explicit as a documented decision.

**Visual redesign (`.styles.ts` files) is out of scope**
The design log explicitly defers the full styled-components pass until all features
are built. Adding placeholder style files now would be work without value.

## Testing Decisions

**What makes a good test here:** test observable behaviour through the public
interface — what `onSave` receives, what navigates where, what the hook returns,
what IndexedDB contains. Never assert on internal state variables or intermediate
function calls.

**Modules to be tested or updated:**

- `useProfile` — add a test case for saving a non-basics step (e.g., `feeding`);
  assert the returned profile has the correct step data and `completedSteps` updated.

- `getNextStep` — unit test: all six steps incomplete returns `"basics"`; four steps
  complete returns the fifth; all steps complete returns `null`.

- `WizardPage` — new test cases: (1) mounting at `/wizard/new` calls `createProfile`
  and redirects; (2) submitting a step calls `saveStep` with correct step name and data;
  (3) submitting the final step navigates to `/preview/:id`.

- `BasicsStep`, `FeedingStep`, `NotesStep` — add assertions that `onSave` is called
  with a `photoId` when a photo file is submitted.

- `usePhotoBlobUrls` — render the hook with a profile containing a known photo ID;
  assert the returned map contains an object URL for that ID; assert URLs are revoked
  on unmount.

**Prior art:** `useProfile.test.tsx` and `useProfiles.test.tsx` use `renderHook` +
`fake-indexeddb` — `usePhotoBlobUrls.test.ts` should follow the same pattern.
Step component tests use `@testing-library/react` render + `userEvent` — photo
upload tests should follow the same pattern already established in those files.

## Out of Scope

- Visual redesign / styled-components — deferred per design log Q27; full pass
  planned after all features are complete.
- `PieChart` in `MergedPDF` — deferred until `SinglePDF` pie chart rendering is
  validated in the browser; the Routine section in `MergedPDF` uses a text list for now.
- Error handling and error UI — storage failures, photo load failures, and navigation
  to non-existent profile IDs will be addressed in a dedicated error-handling pass
  after the functional wiring is complete.
- Object URL revocation in `MergedPreviewPage` — `MergedPDF` does not use photos,
  so no blob URLs are created; no leak exists there.

## Further Notes

- The `useProfile` hook has a comment explaining why it avoids synchronous state
  updates (premature `act()` resolution in tests). That pattern should be preserved
  in any changes to the hook's `useEffect`.
- `WizardPage.tsx` in `pages/` should remain thin: routing, param extraction, and
  callback wiring only. Any logic that grows beyond that belongs in a hook or in
  the feature layer.
- After this refactor, the profile-wizard feature will be functionally complete.
  The next session should run `/grill-me` to scope the visual redesign before any
  styled-components work begins.
