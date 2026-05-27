# 01 — Profile Wizard

## Background

PawBrief is a fully client-side pet care guide generator. No backend, no account, no friction.
Users fill out a wizard about their cat's routine and the app generates a printable PDF care guide
for pet-sitters. This is the foundational feature — everything else builds on top of it.

## Problem

Define the full scope, data model, UX flow, storage strategy, security posture, and PDF output
format for the profile wizard before any implementation begins.

## Questions and Answers

**Q1: Cat-only or multi-pet for v1?**
Cat-only for v1. Multi-pet support would balloon the data model before we have signal on what matters.

**Q2: What does the wizard collect?**
A comprehensive pet-sitter guide: cat basics, feeding, daily routine (with pie chart), favorites,
medical/emergency info, and special notes. Includes photo uploads.

**Q3: How should uploaded photos be stored?**
✅ IndexedDB — handles large binary data, no size limit issues, no backend needed.
❌ localStorage — hard ~5MB total limit, unsuitable for images.
❌ In-memory only — lost on page refresh, bad UX.

**Q4: Should the app have a backend database?**
No. IndexedDB solves persistence (data survives for years in-browser). A backend would add
complexity without improving the product story. "No backend, no friction" is a stronger portfolio
narrative than a generic CRUD app.

**Q5: How many cat profiles does the app support?**
Multiple profiles. Hard cap of 2 profiles in a merged PDF.

**Q6: How does the merged PDF lay out two profiles?**
Side-by-side two-column layout, A4 portrait. Each section is a table row with two columns —
row height set by the taller column, guaranteeing section alignment across both cats.

**Q7: How does the wizard navigate?**
✅ Linear stepper with Back/Next. Free-jump edit mode after profile creation (wizard opens at the
specific step, not step 1).
❌ Free-form sidebar nav — too open for first-run experience.

**Q8: Does the wizard auto-save?**
Yes — auto-save to IndexedDB on every "Next" press. Closing mid-wizard creates a resumable draft.

**Q9: What are the security risks and mitigations?**

- EXIF metadata in photos: ✅ strip via canvas re-encoding on upload before storing.
- Home address exposure: ✅ never store home address. Vet directions use destination-only Maps URL.
- XSS reads IndexedDB: ✅ React JSX escaping + no `dangerouslySetInnerHTML` + CSP headers on Vercel.
- File uploads: ✅ validate MIME type (image/jpeg, image/png, image/webp only) + 5MB cap per image.
- PIN + Web Crypto encryption: ❌ rejected — data sensitivity (cat info, vet business address,
  pet photos) does not justify the UX cost.

**Q10: What fields does Cat Basics collect?**
Cat's name, breed (optional), age (number + years/months), profile photo (single, EXIF-stripped).
Owner's name excluded — the PDF belongs to the cat, not the owner.

**Q11: What fields does Feeding collect?**

- Food entries (repeatable): Brand + Flavor (e.g. chicken, duck, beef) + Texture (e.g. sauce, meat patty, dry, soup)
- Amount per serving in grams
- Feeding times (repeatable time entries)
- Vitamin/supplement entries (repeatable): Brand + Flavor
- Plating instructions: text + optional photo (EXIF-stripped)
- Special dietary notes (free text, optional)

**Q12: What does the Routine pie chart represent?**
24-hour time allocation across user-defined activity slots. 6 pre-populated defaults (all editable/deletable):
Sleep 14h, Playtime 3h, Feeding 1h, Outdoor time 2h, Cuddle time 2h, Other 2h (free-text label).
All labels and durations are free-text — no hardcoded categories.
Soft warn if total ≠ 24h; user can still proceed.
Fixed color palette from design tokens (no user color-picking).

**Q13: What does Favorites collect?**

- Toys (repeatable): name + optional description
- Treats (repeatable): Brand + Flavor
- Comfort items (repeatable): free text
- Favourite spots (repeatable): free text

**Q14: What does Medical / Emergency collect?**

- Vet: name, clinic name, phone number, address (used for Maps link only, never stored as routing origin)
- Emergency contacts (repeatable): name + phone + relationship
- Medications (repeatable): name + dosage + frequency + instructions
- Known allergies (free text, optional)
- Medical conditions (free text, optional)

**Q15: What does Special Notes collect?**
Notes (repeatable): title + free text body + optional photo (EXIF-stripped).

**Q16: What does the dashboard look like?**
Card grid, one card per cat profile. Each card: profile photo (or placeholder), cat name, breed + age,
Edit / Generate PDF / Delete actions. Draft profiles show "Continue" instead of "Generate PDF".
"Merge two profiles" button — select exactly 2 → merged preview.

**Q17: Is there a live preview before PDF download?**
✅ Preview page with edit shortcuts — PDFViewer, full-page scrollable. Buttons: Download PDF +
Edit Profile (jumps to specific wizard step, auto-returns to preview after save).
❌ Download immediately — no confidence check for user.
❌ Preview only — no edit shortcut increases round-trip friction.

**Q18: What page size and orientation?**
A4 portrait for both single and merged PDFs.
Merged side-by-side fits in portrait by using the two-column table layout (~250pt per column after margins).

**Q19: How are photos rendered in the PDF?**
✅ Full-width within the column — readable and useful (plating instructions need to be clear).
❌ Thumbnail inline — too small for instructional photos.

**Q20: How is the vet directions link presented in the PDF?**
✅ Tappable hyperlink via `@react-pdf/renderer` `<Link>` component: "Get directions to [Clinic Name]"
opening a destination-only Maps URL. PDF is consumed on phone — clickable link is the right UX.
❌ QR code — unusable when viewing PDF on the same device used to scan.

**Q21: Does the PDF carry PawBrief branding?**

- Page 1 header: PawBrief logo/name + cat name + profile photo (cover-style).
- Footer every page: "Made with PawBrief" + page number.
  ❌ Header on every page — wastes vertical space, feels repetitive.

**Q22: How does the user navigate back to the dashboard from within the wizard?**
Persistent top navbar with PawBrief logo → always links to dashboard. Safe to navigate away at any
point because all data is auto-saved to IndexedDB.

**Q23: What are the app's routes?**
| Route | Page |
|---|---|
| `/` | Dashboard |
| `/wizard/new` | New profile — step 1 |
| `/wizard/:id/step/:step` | Edit profile — specific step |
| `/preview/:id` | Single profile preview |
| `/preview/merge/:id1/:id2` | Merged preview |

**Q24: How are pie chart slice colors determined?**
✅ Fixed palette — predefined set of harmonious colors from design tokens, assigned automatically.
❌ User color-picking — unnecessary friction, no benefit to pet-sitter.

**Q25: How does the dashboard handle incomplete profiles?**
✅ Show as draft — "Draft" badge, "Continue" button, no "Generate PDF" until complete.
❌ Hidden until complete — confusing if user forgets they started one.
❌ Treat as complete — incomplete data would reach the PDF renderer.

**Q26: What is the photo upload size limit?**
5MB per image. Covers most phone photos (2–4MB). Adjustable later.

**Q27: What is the visual theme?**
Deferred — full redesign pass after all features are built. Placeholder tokens used during development.

## Design

### Data Model (TypeScript)

```typescript
// src/types/profile.ts

type AgeUnit = "years" | "months";

interface FoodEntry {
  id: string;
  brand: string;
  flavor: string;
  texture: string;
}

interface SupplementEntry {
  id: string;
  brand: string;
  flavor: string;
}

interface FeedingTime {
  id: string;
  time: string; // HH:MM
}

interface ActivitySlot {
  id: string;
  label: string;
  durationHours: number;
  colorIndex: number; // index into fixed palette
}

interface ToyEntry {
  id: string;
  name: string;
  description?: string;
}

interface TreatEntry {
  id: string;
  brand: string;
  flavor: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
}

interface SpecialNote {
  id: string;
  title: string;
  body: string;
  photoId?: string; // IndexedDB key
}

type WizardStep =
  | "basics"
  | "feeding"
  | "routine"
  | "favorites"
  | "medical"
  | "notes";

type ProfileStatus = "draft" | "complete";

interface CatProfile {
  id: string;
  status: ProfileStatus;
  completedSteps: WizardStep[];
  createdAt: number;
  updatedAt: number;

  // Step 1 — Basics
  name: string;
  breed?: string;
  ageValue?: number;
  ageUnit?: AgeUnit;
  profilePhotoId?: string; // IndexedDB key

  // Step 2 — Feeding
  foodEntries: FoodEntry[];
  amountGrams?: number;
  feedingTimes: FeedingTime[];
  supplements: SupplementEntry[];
  platingInstructions?: string;
  platingPhotoId?: string; // IndexedDB key
  dietaryNotes?: string;

  // Step 3 — Routine
  activitySlots: ActivitySlot[];

  // Step 4 — Favorites
  toys: ToyEntry[];
  treats: TreatEntry[];
  comfortItems: string[];
  favouriteSpots: string[];

  // Step 5 — Medical
  vetName?: string;
  vetClinic?: string;
  vetPhone?: string;
  vetAddress?: string;
  emergencyContacts: EmergencyContact[];
  medications: Medication[];
  allergies?: string;
  medicalConditions?: string;

  // Step 6 — Notes
  specialNotes: SpecialNote[];
}
```

### Storage Strategy

```
IndexedDB database: "pawbrief-db"
  Object store: "profiles"   — keyed by profile.id (string UUID)
  Object store: "photos"     — keyed by photoId (string UUID), value: Blob
```

Photos are stored as Blobs in their own object store. Profile records reference photos by UUID key.
EXIF is stripped before the Blob is stored (canvas re-encoding).

### File Locations

```
src/
  types/
    profile.ts          ← CatProfile + all sub-types
  features/
    profile/
      profileStorage.ts ← IndexedDB read/write (profiles store)
      photoStorage.ts   ← IndexedDB read/write (photos store) + EXIF strip
      useProfile.ts     ← hook: load/save/delete a profile
      useProfiles.ts    ← hook: list all profiles
    wizard/
      WizardPage.tsx          ← route /wizard/new and /wizard/:id/step/:step
      steps/
        BasicsStep.tsx
        FeedingStep.tsx
        RoutineStep.tsx
        FavoritesStep.tsx
        MedicalStep.tsx
        NotesStep.tsx
    pdf/
      SinglePDF.tsx     ← @react-pdf/renderer document, single profile
      MergedPDF.tsx     ← @react-pdf/renderer document, two-column merged
      PieChart.tsx      ← SVG pie chart component for PDF
      pdfColors.ts      ← fixed color palette for pie slices
    preview/
      PreviewPage.tsx         ← route /preview/:id
      MergedPreviewPage.tsx   ← route /preview/merge/:id1/:id2
  pages/
    DashboardPage.tsx         ← route /
    WizardPage.tsx            ← thin wrapper
    PreviewPage.tsx           ← thin wrapper
    MergedPreviewPage.tsx     ← thin wrapper
  layouts/
    AppLayout.tsx       ← persistent navbar + outlet
```

### Routing

```
✅ React Router v6 with nested routes under AppLayout
/                           → DashboardPage
/wizard/new                 → WizardPage (step: basics)
/wizard/:id/step/:step      → WizardPage (edit mode)
/preview/:id                → PreviewPage
/preview/merge/:id1/:id2    → MergedPreviewPage
```

### PDF Structure

```
Single PDF (A4 portrait):
  Page 1: Header (PawBrief logo + cat name + profile photo)
           Routine pie chart
  Page 2+: Feeding | Favorites | Medical | Special Notes
  Every page footer: "Made with PawBrief" | page N / total

Merged PDF (A4 portrait, two-column):
  Same structure but each section rendered as a flex row:
  [Cat A column] | [Cat B column]
  Row height = max(colA height, colB height)
```

## Implementation Plan

### Phase 1 — IndexedDB foundation + single profile round-trip

- `profileStorage.ts` + `photoStorage.ts` (IndexedDB init, CRUD, EXIF strip)
- `useProfile.ts` + `useProfiles.ts` hooks
- `CatProfile` type in `types/profile.ts`
- Dashboard shows profile cards (name only, no styling)
- Wizard: Basics step only, saves to IndexedDB, appears on dashboard
- **Slice is complete when:** user fills Basics, refreshes, sees the profile on the dashboard

### Phase 2 — Full wizard (all 6 steps)

- Implement all remaining steps: Feeding, Routine, Favorites, Medical, Notes
- Stepper navigation with Back/Next + auto-save per step
- Draft detection (completedSteps tracking)
- Photo upload with EXIF stripping + size/MIME validation

### Phase 3 — Single profile PDF

- `SinglePDF.tsx` with all sections
- `PieChart.tsx` SVG in PDF
- Preview page with PDFViewer + Download button
- "Edit Profile" shortcut from preview → wizard step → back to preview

### Phase 4 — Merged PDF

- `MergedPDF.tsx` two-column layout
- Merged preview page
- Dashboard "Merge two profiles" selector (hard cap 2)

### Phase 5 — Polish + security hardening

- CSP headers in `vercel.json`
- File validation (MIME + 5MB cap)
- Soft 24h warn on routine step
- Draft badge on dashboard cards
- Persistent navbar

### Phase 6 — Visual redesign

- Design tokens (colors, spacing, typography)
- Full styled-components pass across all layers

## Trade-offs

**Easier:**

- No backend = no auth, no infra, no migrations, no CORS
- IndexedDB handles binary data cleanly — photos just work
- Fixed route structure makes back-button and deep-linking free

**Harder:**

- No cross-device sync — profile exists only in the browser it was created in
- IndexedDB data is lost if the user clears browser storage
- Two-column PDF alignment requires discipline in the PDF component tree

**Explicitly out of scope (v1):**

- Multiple pet types (dogs, rabbits, etc.)
- More than 2 profiles in a merged PDF
- PIN / Web Crypto encryption
- Account system or cloud sync
- Push notifications or reminders
