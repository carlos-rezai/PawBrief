## Problem Statement

A pet owner leaving their cat with a pet-sitter has no reliable, structured way to
communicate everything the sitter needs to know. Verbal handoffs are forgotten. Scattered
notes leave gaps. The sitter ends up uncertain about feeding amounts, medication schedules,
emergency contacts, and where the vet is — and the owner is anxious the whole trip.

## Solution

PawBrief lets an owner build a complete, shareable care guide for their cat in a single
focused session. They answer a guided six-step wizard covering basics, feeding, daily
routine, favorites, medical info, and special notes. The result is a polished PDF the
sitter can open on their phone or print — no app, no account, no friction.

All data is stored in the browser. Profiles persist indefinitely. Owners can return
months later, edit a single detail, and regenerate the PDF in seconds.

## User Stories

### Profile management

1. As an owner, I want to create a new cat profile so that I can start building a care guide.
2. As an owner, I want to see all my cat profiles on a dashboard so that I can manage multiple cats.
3. As an owner, I want each profile card to show the cat's name, breed, age, and photo so that I can identify profiles at a glance.
4. As an owner, I want to delete a profile I no longer need so that my dashboard stays tidy.
5. As an owner, I want incomplete profiles to appear as drafts with a "Continue" button so that I can resume a wizard I did not finish.
6. As an owner, I want complete profiles to show a "Generate PDF" button so that I can only produce a guide from fully filled-out data.
7. As an owner, I want my profile data to persist after closing the browser so that I never lose work.
8. As an owner with multiple cats, I want profiles to be independent so that editing one cat's guide does not affect another.

### Wizard navigation

9. As an owner, I want the wizard to guide me through six steps in order so that I do not miss any section.
10. As an owner, I want to go back to a previous step without losing my current progress so that I can correct a mistake.
11. As an owner, I want my answers auto-saved when I advance to the next step so that closing the tab mid-wizard does not lose my work.
12. As an owner editing an existing profile, I want the wizard to open at the step I chose so that I do not have to navigate through steps I do not want to change.
13. As an owner, I want a persistent navigation bar with the PawBrief logo so that I can return to the dashboard from anywhere in the app.
14. As an owner, I want to navigate back to the dashboard mid-wizard without losing my progress so that I can freely explore the app.

### Step 1 — Cat Basics

15. As an owner, I want to enter my cat's name so that the care guide is personalised.
16. As an owner, I want to enter my cat's breed (optionally) so that the sitter has context.
17. As an owner, I want to enter my cat's age in years or months so that the sitter knows how old the cat is.
18. As an owner, I want to upload a profile photo of my cat so that the sitter immediately recognises the cat.
19. As an owner, I want uploaded photos to have their location and device metadata removed so that my privacy is protected.
20. As an owner, I want to be warned if I try to upload a file that is not an image so that I do not accidentally attach the wrong file.
21. As an owner, I want to be warned if I try to upload an image larger than 5 MB so that storage limits are respected.

### Step 2 — Feeding

22. As an owner, I want to add multiple food entries so that I can describe a varied diet.
23. As an owner, I want each food entry to have a brand, a flavor (e.g. chicken, duck), and a texture (e.g. sauce, meat patty, dry) so that the sitter knows exactly what to serve.
24. As an owner, I want to add and remove food entries freely so that the list reflects the actual diet.
25. As an owner, I want to specify the serving amount in grams so that the sitter measures correctly.
26. As an owner, I want to add multiple daily feeding times so that the sitter follows the correct schedule.
27. As an owner, I want to add multiple vitamin or supplement entries (brand + flavor) so that routine supplements are not missed.
28. As an owner, I want to add plating instructions as text so that the sitter knows how to prepare the food.
29. As an owner, I want to optionally attach a photo to the plating instructions so that visual preparation steps are clear.
30. As an owner, I want to add optional free-text dietary notes so that I can communicate any special considerations.

### Step 3 — Routine

31. As an owner, I want to see a pre-filled set of activity slots so that I do not start from scratch.
32. As an owner, I want to edit any activity slot's label and duration so that the chart reflects my cat's actual day.
33. As an owner, I want to add new activity slots with a custom label so that unusual activities are captured.
34. As an owner, I want to remove any activity slot so that irrelevant defaults do not clutter the chart.
35. As an owner, I want a running total that shows how my durations sum against 24 hours so that I can balance the chart.
36. As an owner, I want a soft warning when the total does not equal 24 hours, but still be able to proceed so that minor imprecision does not block me.
37. As an owner, I want slice colors assigned automatically so that I do not have to pick colors manually.

### Step 4 — Favorites

38. As an owner, I want to add multiple toys with a name and optional description so that the sitter knows what to play with.
39. As an owner, I want to add multiple treat entries (brand + flavor) so that the sitter gives the right treats.
40. As an owner, I want to add multiple comfort items as free text so that the sitter knows what soothes the cat.
41. As an owner, I want to add multiple favourite spots as free text so that the sitter knows where the cat likes to be.

### Step 5 — Medical

42. As an owner, I want to record the vet's name, clinic name, and phone number so that the sitter can contact the vet.
43. As an owner, I want to enter the vet's address so that the care guide can provide directions without storing my home address.
44. As an owner, I want a tappable "Get directions" link generated from the vet address so that the sitter can navigate on their phone.
45. As an owner, I want to add multiple emergency contacts (name, phone, relationship) so that the sitter has backup people to call.
46. As an owner, I want to add multiple medications (name, dosage, frequency, instructions) so that treatments are not missed.
47. As an owner, I want to record known allergies so that the sitter avoids dangerous substances.
48. As an owner, I want to record medical conditions so that the sitter is aware of health context.

### Step 6 — Special Notes

49. As an owner, I want to add multiple special notes, each with a title and free-text body, so that any unusual information has a home.
50. As an owner, I want to optionally attach a photo to each special note so that visual context can be provided.

### PDF preview and download

51. As an owner, I want to preview the full care guide before downloading so that I can check it looks correct.
52. As an owner, I want to jump from the preview directly to the wizard step that contains a mistake so that I can fix it quickly.
53. As an owner, I want to be automatically returned to the preview after saving an edit so that I can continue reviewing.
54. As an owner, I want a "Download PDF" button on the preview page so that I can save and share the guide.
55. As an owner, I want the PDF to open on page 1 with the PawBrief logo, cat name, and profile photo so that it reads as a polished document.
56. As an owner, I want a footer on every PDF page showing "Made with PawBrief" and the page number so that the document feels complete.
57. As an owner, I want photos embedded in the PDF at full column width so that plating instructions and notes are clearly visible.
58. As an owner, I want the vet directions to appear as a tappable link (not a QR code) so that the sitter can open it on the phone they are reading the PDF on.

### Merged care guide

59. As an owner with two cats, I want to select exactly two profiles and generate a side-by-side merged care guide so that the sitter gets one document for both cats.
60. As an owner, I want both cats' sections to be vertically aligned in the merged PDF so that the sitter can compare routines at a glance.
61. As an owner, I want to preview the merged guide before downloading so that I can check both columns.
62. As an owner, I want to edit either cat's profile from the merged preview so that I can fix mistakes without leaving the preview flow.
63. As an owner, I want the merge to be capped at two profiles so that the layout stays readable.

### Empty states and error states

64. As an owner with no profiles yet, I want the dashboard to show a clear call-to-action so that I know how to get started.
65. As an owner, I want photo upload errors (wrong type, too large) to show an inline message so that I know what went wrong.
66. As an owner, I want the routine step to show a soft warning in a distinct colour when the total deviates from 24 hours so that the issue is obvious.
67. As an owner navigating to a profile ID that does not exist, I want to be redirected to the dashboard so that the app does not break.

## Implementation Decisions

### Prerequisite: TypeScript and dependency setup

The current codebase is a plain Vite + React boilerplate using `.jsx` files. Before feature
work begins, the project must be migrated to TypeScript (`.tsx` / `.ts`) and the following
packages installed:

- `react-router-dom` — client-side routing
- `styled-components` — component styling
- `idb` — IndexedDB wrapper (typed, Promise-based)
- `@react-pdf/renderer` — client-side PDF generation
- `vitest` + `@testing-library/react` + `@testing-library/user-event` — testing
- `fake-indexeddb` — in-memory IndexedDB for tests

### Deep modules

**`profileStorage`**
The single gateway to IndexedDB for profile data. Manages the `profiles` object store
(keyed by UUID). Exposes: `getProfile`, `getAllProfiles`, `saveProfile`, `deleteProfile`.
Callers never interact with IndexedDB directly. Database initialisation and schema
versioning are implementation details hidden behind this interface.

**`photoStorage`**
The single gateway to IndexedDB for photo Blobs. Manages the `photos` object store
(keyed by UUID). Exposes: `savePhoto(file) → Promise<string>` (strips EXIF then stores,
returns UUID), `getPhoto(id) → Promise<Blob | null>`, `deletePhoto(id)`.
EXIF stripping via HTML5 Canvas is an internal implementation detail.

**`useProfile(id)`**
React hook. Loads a single profile from `profileStorage`, exposes `profile` state and
a `saveStep(step, data)` function that merges step data into the profile, updates
`completedSteps`, and persists to `profileStorage`. All wizard components interact
with the profile exclusively through this hook.

**`useProfiles()`**
React hook. Loads all profiles from `profileStorage`, exposes `profiles`, `createProfile()`,
and `deleteProfile(id)`. Used by the dashboard.

### Utility functions (pure, fully testable)

- `buildMapsUrl(vetAddress)` — constructs a destination-only Google Maps URL
- `stripExif(file)` — draws image onto Canvas, exports as Blob (EXIF-free); internal to `photoStorage`
- `validatePhoto(file)` — checks MIME type and size, returns a validation error string or null
- `deriveFeedingSlot(feedingTimes)` — produces a default Feeding activity slot from the feeding step data
- `formatAge(value, unit)` — formats age as a readable string (e.g. "2 years", "6 months")

### Wizard

`WizardPage` is the orchestrator. It reads `:id` and `:step` from the URL, delegates
rendering to the appropriate step component, and drives the stepper UI. It calls
`saveStep` from `useProfile` on every "Next" press before advancing the URL.

Each step component (BasicsStep, FeedingStep, RoutineStep, FavoritesStep, MedicalStep,
NotesStep) is a controlled form that receives the current profile data and an `onSave`
callback. Step components own no persistence logic.

### Dashboard

`DashboardPage` uses `useProfiles` to render the card grid. Merge selection is managed
with local UI state (at most 2 profiles selected). Navigates to `/preview/merge/:id1/:id2`
when both are chosen.

### PDF documents

`SinglePDF` and `MergedPDF` are `@react-pdf/renderer` Document components. They accept
resolved profile data (with photo Blobs pre-fetched) and produce the PDF structure.
`MergedPDF` uses a flex-row table structure — each section is a row with two equal columns,
row height determined by the taller column.

`PieChart` is an SVG component used inside the PDF, built from `@react-pdf/renderer`'s
SVG primitives. Colors are drawn from `pdfColors`, a fixed ordered palette.

### Routing

React Router v6 with `BrowserRouter`. All routes are nested under `AppLayout` (persistent
navbar). Route params: `:id` (UUID string), `:step` (WizardStep string literal).

### Data model

The `CatProfile` type and all sub-types (`FoodEntry`, `ActivitySlot`, `Medication`, etc.)
are defined once in `src/types/profile.ts` and imported everywhere.

### Security

- EXIF stripped on every photo upload before storage (canvas re-encoding in `photoStorage`)
- Home address never collected or stored; vet directions use destination-only Maps URL
- No `dangerouslySetInnerHTML` anywhere in the codebase
- Content Security Policy headers declared in `vercel.json`
- Photo validation: MIME type allowlist (`image/jpeg`, `image/png`, `image/webp`) + 5 MB cap

## Testing Decisions

**What makes a good test here:** test observable behaviour through the public interface —
what the function returns, what it writes to IndexedDB, what the user sees in the DOM.
Never assert on internal implementation details (private variables, intermediate states,
internal function calls).

**Modules to test:**

- `profileStorage` — CRUD operations against a real IndexedDB instance (using `fake-indexeddb`).
  Verify: save persists data; get returns it; delete removes it; getAll returns the correct set.

- `photoStorage` / `validatePhoto` — verify MIME rejection, size rejection, and that a valid
  image passes validation. EXIF strip: write a known JPEG with GPS EXIF, read back the stored
  Blob, confirm GPS tags are absent.

- `buildMapsUrl`, `formatAge`, `deriveFeedingSlot` — pure function unit tests; input/output only.

- `useProfile` / `useProfiles` — hook tests using `renderHook`. Verify that `saveStep` triggers
  a persist and updates `completedSteps`; that `createProfile` adds to the list; that
  `deleteProfile` removes from the list.

- Step components — render the component with partial profile data, simulate user input,
  assert the `onSave` callback receives the correct shape. Test required-field validation:
  ensure "Next" is blocked when mandatory fields are empty.

**No prior art** — this is the first feature. Tests live co-located with the module they test
(`Foo.test.tsx` beside `Foo.tsx`).

## Out of Scope

- Multiple pet types (dogs, rabbits, etc.) — cat-only for v1
- More than 2 profiles in a merged care guide
- Cloud sync or cross-device access — IndexedDB is browser-local
- User accounts or authentication
- PIN or Web Crypto encryption of stored data
- Push notifications or reminders
- Visual redesign — placeholder design tokens will be used; a full redesign pass is planned
  after all features are built
- Offline-first service worker

## Further Notes

- The merged care guide targets A4 portrait. With standard margins, each column is
  approximately 250pt wide. PDF components must be designed with this constraint in mind —
  no wide tables or multi-column layouts within a single column.
- The profile wizard auto-save model means a profile is always in a valid partial state.
  There is no "discard changes" concept — every step advance is permanent.
- `completedSteps` on the profile drives the Draft/Complete status displayed on the
  dashboard. A profile is Complete when all six step keys are present in `completedSteps`.
- The design log for this feature lives at `docs/design-logs/01-profile-wizard.md` and is
  the authoritative record of every decision made and rejected during design.
