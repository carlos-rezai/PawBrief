# Plan: Profile Wizard

> Source PRD: https://github.com/carlos-rezai/PawBrief/issues/1

## Architectural decisions

Durable decisions that apply across all phases:

- **Routes**:
  - `/` → Dashboard
  - `/wizard/new` → WizardPage, step: basics
  - `/wizard/:id/step/:step` → WizardPage, edit mode at specific step
  - `/preview/:id` → PreviewPage (single profile)
  - `/preview/merge/:id1/:id2` → MergedPreviewPage

- **IndexedDB schema**:
  - Database name: `pawbrief-db`
  - Object store: `profiles` — keyPath `id` (string UUID), value: `CatProfile`
  - Object store: `photos` — keyPath `id` (string UUID), value: `Blob`

- **Key models**:
  - `CatProfile` — root data type, source of truth for all profile data
  - `WizardStep` — `'basics' | 'feeding' | 'routine' | 'favorites' | 'medical' | 'notes'`
  - `ProfileStatus` — `'draft' | 'complete'` (derived from `completedSteps.length === 6`)

- **Third-party boundaries**:
  - `idb` wraps all IndexedDB operations — no raw IndexedDB calls outside storage modules
  - `@react-pdf/renderer` used only inside `features/pdf/`
  - `react-router-dom` used only in `pages/` and `layouts/`
  - `styled-components` used only in `*.styles.ts` files co-located with their component

---

## Phase 1: App shell + project foundation

**User stories**: #13 (persistent navbar)

### What to build

Migrate the boilerplate from `.jsx` to `.tsx`/`.ts` and install all project dependencies.
Set up React Router v6 with `BrowserRouter`, nested routes under `AppLayout`. `AppLayout`
renders a persistent navbar containing the PawBrief logo (links to `/`) and an `<Outlet>`
for page content. Create empty page shells for Dashboard, Wizard, and Preview routes so
every URL resolves without error. Add `vercel.json` with Content Security Policy headers.

### Acceptance criteria

- [ ] All source files are `.tsx` or `.ts` — no `.jsx` or `.js` remain
- [ ] Dependencies installed: `react-router-dom`, `styled-components`, `idb`, `@react-pdf/renderer`, `vitest`, `@testing-library/react`, `@testing-library/user-event`, `fake-indexeddb`
- [ ] Navigating to `/`, `/wizard/new`, and `/preview/test` all render without runtime errors
- [ ] PawBrief navbar is visible on all three routes; logo links back to `/`
- [ ] `vercel.json` exists with a Content-Security-Policy header
- [ ] `npm run build` completes with no TypeScript errors

---

## Phase 2: IndexedDB + Basics step (first end-to-end profile)

**User stories**: #1, 2, 3, 4, 5 (partial — draft visible), 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 64, 65, 67

### What to build

Define the full `CatProfile` type and all sub-types. Build `profileStorage` (IndexedDB CRUD
for profiles) and `photoStorage` (IndexedDB CRUD for photo Blobs, with EXIF stripping via
canvas re-encoding and `validatePhoto` for MIME type + 5 MB enforcement). Build `useProfile`
and `useProfiles` hooks that expose profile state and persistence through a clean React
interface.

Build the Basics step form (cat name, breed, age with years/months toggle, profile photo
upload with inline error messages for invalid type or size). The wizard auto-saves to
IndexedDB on every "Next" press and tracks `completedSteps`.

Build the dashboard card grid: empty state with a "+ New Profile" call-to-action when no
profiles exist; profile cards showing name, breed, age, and profile photo (or placeholder)
with Edit, Continue (draft), and Delete actions. Navigating to a profile ID that does not
exist redirects to the dashboard.

### Acceptance criteria

- [ ] Creating a Basics-only profile and refreshing the page shows the profile card on the dashboard
- [ ] Profile card shows the cat's name, breed, age, and profile photo (or placeholder paw icon)
- [ ] A profile with only Basics completed shows "Continue" — not "Generate PDF"
- [ ] Deleting a profile removes it from the dashboard immediately
- [ ] Uploading a non-image file shows an inline error message; the photo is not saved
- [ ] Uploading an image over 5 MB shows an inline error message; the photo is not saved
- [ ] Valid photos have EXIF metadata removed before storage (GPS tags absent from stored Blob)
- [ ] Navigating to `/preview/nonexistent-id` redirects to `/`
- [ ] Dashboard shows a call-to-action when no profiles exist
- [ ] Clicking the dashboard logo mid-wizard returns to the dashboard without data loss
- [ ] `profileStorage` CRUD, `photoStorage` CRUD, and `validatePhoto` are covered by tests

---

## Phase 3: Feeding + Routine steps

**User stories**: #22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 66

### What to build

Build the Feeding step: a repeatable list of food entries (each with Brand, Flavor, Texture
fields and add/remove controls), a grams input for serving amount, repeatable feeding time
entries, a repeatable supplement entries list (Brand + Flavor), a plating instructions text
field, an optional plating photo upload (same EXIF strip + validation as Basics), and an
optional dietary notes field.

Build the Routine step: a list of activity slots pre-populated with six defaults (Sleep 14h,
Playtime 3h, Feeding 1h, Outdoor time 2h, Cuddle time 2h, Other 2h). Each slot has an
editable free-text label and a duration in hours. Slots can be added and removed freely.
A running total shows the sum against 24h. A soft warning appears in a distinct colour when
the total deviates from 24h, but the "Next" button remains enabled. Build `deriveFeedingSlot`
as a pure utility. Slice colors are assigned from the fixed `pdfColors` palette by index.

### Acceptance criteria

- [ ] Food entries can be added, edited, and removed; each has Brand, Flavor, Texture fields
- [ ] Serving amount is a numeric grams field
- [ ] Feeding times can be added and removed
- [ ] Supplement entries can be added and removed; each has Brand and Flavor
- [ ] Plating instructions accepts text and an optional photo (same validation as profile photo)
- [ ] Dietary notes field saves and persists
- [ ] All Feeding data auto-saves on "Next" and persists after page refresh
- [ ] Routine step opens with six pre-populated activity slots summing to 24h
- [ ] Slot labels and durations are editable; slots can be added and removed
- [ ] Running total updates in real time as durations change
- [ ] A distinct-colour warning appears when the total ≠ 24h; "Next" remains enabled
- [ ] `deriveFeedingSlot` has unit tests covering edge cases (zero feedings, multiple feedings)

---

## Phase 4: Favorites + Medical + Notes → complete profile unlocked

**User stories**: #5 (full), 6, 12, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50

### What to build

Build the Favorites step: repeatable toy entries (name + optional description), repeatable
treat entries (Brand + Flavor), repeatable comfort items (free text), repeatable favourite
spots (free text).

Build the Medical step: vet name, clinic name, phone, and address fields. The vet address
generates a tappable "Get directions" link (destination-only Maps URL) shown as a preview
beneath the address field. Repeatable emergency contact entries (name, phone, relationship).
Repeatable medication entries (name, dosage, frequency, instructions). Optional allergies
and medical conditions free-text fields. Build `buildMapsUrl` as a pure utility.

Build the Notes step: repeatable special notes, each with a title, free-text body, and an
optional photo upload (same EXIF strip + validation).

Once all six steps appear in `completedSteps`, the profile transitions from Draft to
Complete and the dashboard card swaps "Continue" for "Generate PDF". Edit mode:
navigating to `/wizard/:id/step/:step` opens the wizard at the specified step with
existing data pre-filled; saving navigates back to the referrer (dashboard or preview).

### Acceptance criteria

- [ ] All four Favorites fields support repeatable add/remove and persist after refresh
- [ ] Vet address field generates a Maps URL preview link beneath it
- [ ] Emergency contacts, medications can be added and removed with all fields saved
- [ ] Allergies and medical conditions persist after refresh
- [ ] Special notes can be added and removed; each saves title, body, and optional photo
- [ ] Completing all 6 steps transitions the dashboard card from "Continue" to "Generate PDF"
- [ ] Navigating to `/wizard/:id/step/feeding` opens the wizard at the Feeding step with existing data pre-filled
- [ ] `buildMapsUrl` has unit tests for standard address inputs

---

## Phase 5: Single profile PDF + preview

**User stories**: #51, 52, 53, 54, 55, 56, 57, 58

### What to build

Build the `SinglePDF` document using `@react-pdf/renderer`. Page 1 has a header with the
PawBrief logo, cat name, and profile photo. Every page has a footer with "Made with
PawBrief" and the page number. Sections follow the wizard order: Basics, Feeding, Routine,
Favorites, Medical, Notes. Photos are rendered full column-width. The vet address section
includes a `<Link>` component with "Get directions to [Clinic Name]" pointing to the
destination-only Maps URL. Build `PieChart` as an SVG component using
`@react-pdf/renderer` SVG primitives, using the fixed `pdfColors` palette.

Build the `PreviewPage`: renders `PDFViewer` full-page with the `SinglePDF` document,
pre-fetching all photo Blobs from `photoStorage` before rendering. Two buttons at the top:
"Download PDF" (triggers `PDFDownloadLink`) and "Edit Profile" (navigates to the wizard
at step 1 with `?returnTo=preview` so the wizard returns to the preview page on save).
Build `formatAge` as a pure utility.

### Acceptance criteria

- [ ] Clicking "Generate PDF" on a complete profile card navigates to the preview page
- [ ] The preview renders the full care guide with all sections populated
- [ ] Page 1 shows the PawBrief logo, cat name, and profile photo
- [ ] Every page footer shows "Made with PawBrief" and the correct page number
- [ ] Photos appear full column-width in the relevant sections
- [ ] The vet section contains a tappable "Get directions to [Clinic Name]" link
- [ ] The pie chart renders with correct slice proportions and fixed palette colors
- [ ] "Download PDF" produces a downloadable `.pdf` file
- [ ] "Edit Profile" navigates to the wizard and returns to the preview after saving
- [ ] `formatAge` has unit tests for years and months inputs

---

## Phase 6: Merged care guide

**User stories**: #59, 60, 61, 62, 63

### What to build

Add merge selection to the dashboard: a "Merge two profiles" mode that lets the owner
select exactly two complete profile cards. Once two are selected, "Preview Merge" navigates
to `/preview/merge/:id1/:id2`. Attempting to select a third deselects the first.

Build `MergedPDF` using `@react-pdf/renderer`. The document uses A4 portrait. Each section
is a flex row with two equal columns (≈250pt each after margins). Row height is set by the
taller column, guaranteeing alignment across both cats. The page 1 header spans both
columns and shows both cats' names and photos side by side. The footer is identical to the
single PDF.

Build `MergedPreviewPage`: renders `PDFViewer` with the `MergedPDF` document. Three
buttons: "Download PDF", "Edit [Cat A]", "Edit [Cat B]" — each edit button follows the
same return-to-preview flow as the single preview.

### Acceptance criteria

- [ ] Dashboard shows a "Merge two profiles" action that activates selection mode
- [ ] Selecting two complete profiles and clicking "Preview Merge" navigates to the merged preview
- [ ] The merged preview renders both cats' sections in aligned side-by-side columns
- [ ] Sections from both profiles are vertically aligned — same section always at the same vertical position
- [ ] "Download PDF" produces a downloadable merged `.pdf` file
- [ ] "Edit [Cat A]" and "Edit [Cat B]" navigate to the respective wizard and return to the merged preview after saving
- [ ] Only complete profiles are selectable for merging
