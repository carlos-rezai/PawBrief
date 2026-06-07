# Ubiquitous Language

## People

| Term           | Definition                                         | Aliases to avoid             |
| -------------- | -------------------------------------------------- | ---------------------------- |
| **Owner**      | The person who creates and maintains a cat profile | User, parent, caretaker      |
| **Pet-sitter** | The person who receives and reads the care guide   | Caretaker, sitter, recipient |

## Profiles

| Term                 | Definition                                                     | Aliases to avoid                |
| -------------------- | -------------------------------------------------------------- | ------------------------------- |
| **Profile**          | A single cat's complete care guide data stored in IndexedDB    | Cat profile, record, entry      |
| **Draft**            | A profile where not all wizard steps have been completed       | Incomplete, partial, unfinished |
| **Complete Profile** | A profile where all wizard steps have been saved at least once | Finished profile                |

## Wizard

| Term          | Definition                                                                                       | Aliases to avoid            |
| ------------- | ------------------------------------------------------------------------------------------------ | --------------------------- |
| **Wizard**    | The linear step-by-step form used to create or edit a profile                                    | Form, survey, questionnaire |
| **Step**      | A single named screen within the wizard (Basics, Feeding, Routine, Favorites, Medical, Notes)    | Page, section, screen       |
| **Stepper**   | The navigation component that shows wizard progress and the current step; supports click-to-jump | Progress bar, tabs          |
| **Step Card** | The surface card (`surface` bg, radius 12) that wraps each wizard step body (new)                | Step container, step panel  |
| **Edit Mode** | The wizard opened on an existing profile, jumping directly to a specific step                    | Update mode, edit flow      |

## Feeding

| Term                     | Definition                                                                              | Aliases to avoid                                           |
| ------------------------ | --------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Food Entry**           | A single food item defined by Brand, Flavor, and Texture                                | Meal, food item, food record                               |
| **Brand**                | The manufacturer name of a food or supplement (e.g. "Royal Canin")                      | Make, manufacturer, label                                  |
| **Flavor**               | The protein or ingredient type of a food or supplement (e.g. "chicken", "duck", "beef") | Type, protein, ingredient                                  |
| **Texture**              | The physical form of a food (e.g. "sauce", "meat patty", "dry", "soup")                 | Consistency, format, type                                  |
| **Supplement Entry**     | A vitamin or supplement defined by Brand and Flavor                                     | Vitamin entry, medication (not a medication — see Medical) |
| **Feeding Time**         | A specific clock time (HH:MM) at which the cat is fed                                   | Meal time, schedule entry                                  |
| **Plating Instructions** | Text and optional photo explaining how to prepare or serve the cat's food               | Serving instructions, prep notes                           |

## Routine

| Term              | Definition                                                                                                              | Aliases to avoid                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| **Routine**       | The cat's 24-hour daily activity pattern, represented as a radial clock                                                 | Schedule, timetable              |
| **Activity Slot** | A named time block in the routine with a label, start time, and duration in hours                                       | Time block, routine entry, slice |
| **Routine Chart** | The 24-hour radial SVG clock that renders activity slots as arcs from their start time (updated)                        | Pie chart, donut chart, graph    |
| **Arc**           | The visual segment on the Routine Chart representing one Activity Slot, drawn from start time across its duration (new) | Slice, wedge, segment            |
| **Color Palette** | The fixed set of six design-token colors automatically assigned to activity slots by index                              | Color scheme, theme colors       |

## Favorites

| Term               | Definition                                                                | Aliases to avoid              |
| ------------------ | ------------------------------------------------------------------------- | ----------------------------- |
| **Toy Entry**      | A named toy with an optional description                                  | Toy item, play item           |
| **Treat Entry**    | A treat defined by Brand and Flavor                                       | Snack entry, reward entry     |
| **Comfort Item**   | A free-text object that provides comfort to the cat (e.g. "blue blanket") | Comfort object, security item |
| **Favourite Spot** | A free-text location the cat regularly occupies (e.g. "sunny windowsill") | Hangout, spot, location       |

## Medical

| Term                  | Definition                                                                                                  | Aliases to avoid                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Vet**               | The veterinarian and clinic associated with a profile                                                       | Doctor, vet clinic                                                                        |
| **Vet Address**       | The physical address of the vet clinic — used only to generate the Maps URL, never stored as routing origin | Home address (never use for origin)                                                       |
| **Maps URL**          | A destination-only Google Maps URL constructed from the vet address                                         | Route, directions link, map link                                                          |
| **Emergency Contact** | A person to contact in an emergency, defined by name, phone, and relationship                               | Contact, backup contact                                                                   |
| **Medication**        | A medicine or treatment with name, dosage, frequency, and instructions                                      | Drug, supplement (distinct from Supplement Entry — medications are prescribed treatments) |

## Special Notes

| Term             | Definition                                                                              | Aliases to avoid              |
| ---------------- | --------------------------------------------------------------------------------------- | ----------------------------- |
| **Special Note** | A titled free-text note with an optional photo, for anything not covered by other steps | Note, remark, additional info |

## Care Guide (PDF)

| Term                  | Definition                                                                                                                                                                 | Aliases to avoid                          |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **Care Guide**        | The generated PDF document the owner shares with the pet-sitter                                                                                                            | PDF, document, report, guide              |
| **Single Care Guide** | A care guide generated from one profile                                                                                                                                    | Solo PDF, individual guide                |
| **Merged Care Guide** | A side-by-side care guide generated from exactly two profiles (updated — design eyebrow reads "Household Care Guide")                                                      | Combined PDF, dual guide, Household Guide |
| **Preview**           | The in-browser rendering of the care guide before download, using PDFViewer                                                                                                | Draft view, PDF view                      |
| **Cover Band**        | The sienna-background header strip at the top of any Care Guide, containing the circular photo or Mark, cat name, and wordmark (new)                                       | PDF Header, cover, title page, header     |
| **Emergency Callout** | The primary-bordered box at the top of the Care Guide body containing the vet contact and emergency contacts (new)                                                         | Emergency section, emergency box          |
| **Serving Entry**     | A single feeding event defined by a time (HH:MM) and a gram amount; rendered as a Tag (`"07:30 · 70g"`) in the Care Guide (new)                                            | Feeding time, serving, meal entry         |
| **Shared Vet**        | The condition in a Merged Care Guide where both profiles reference the same veterinarian (matched by name and phone); causes the vet block to render once full-width (new) | Common vet, same vet                      |
| **PDF Footer**        | The per-page footer on the care guide containing "Made with PawBrief" and page number                                                                                      | Page footer, branding footer              |

## Storage & Security

| Term                      | Definition                                                                                                             | Aliases to avoid                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| **Photo ID**              | A UUID string used as the IndexedDB key for a stored photo Blob                                                        | Image key, file ID               |
| **EXIF Strip**            | The process of removing all metadata from an uploaded photo by re-drawing it through an HTML5 Canvas before storage    | Metadata removal, EXIF scrub     |
| **Magic Byte Validation** | Verification of a file's actual type by reading its first 4 bytes, independent of the browser-reported MIME type (new) | File type check, MIME validation |

## Security Review

| Term                | Definition                                                                                                | Aliases to avoid         |
| ------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------ |
| **Security Review** | The structured pre-deployment audit of the client-side surface, producing a written findings report (new) | Security audit, pen test |
| **Blocking**        | A finding severity that must be resolved before the Vercel deploy proceeds (new)                          | Critical, must-fix       |
| **Non-blocking**    | A finding severity that should be fixed but does not gate the Vercel deploy (new)                         | Minor, low severity      |
| **Informational**   | A finding severity for accepted design decisions noted for awareness; no action required (new)            | FYI, advisory, low risk  |

## Dashboard

| Term                  | Definition                                                                                            | Aliases to avoid                  |
| --------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------- |
| **Dashboard**         | The home screen displaying all profile cards                                                          | Home, profile list, gallery       |
| **Profile Card**      | A card on the dashboard representing a single profile with its key details and actions                | Card, tile, profile tile          |
| **Photo Zone**        | The 128px-tall image area at the top of a Profile Card, rendered with `object-fit: cover` (new)       | Photo area, image slot            |
| **Scrim**             | The gradient overlay on the Photo Zone that keeps the Status Badge legible against any photo (new)    | Overlay, tint, vignette           |
| **Status Badge**      | The opaque chip on a Profile Card showing Draft or Complete status (new)                              | Status pill, state label          |
| **Plus Card**         | The dashed-border card on the Dashboard that is the sole entry point for creating a new profile (new) | Add card, create card, new button |
| **Merge**             | The action of selecting exactly two profiles to generate a Merged Care Guide                          | Combine, join, link               |
| **Merge-select Mode** | The Dashboard state where the Owner selects exactly two Complete Profiles to merge (new)              | Merge mode, selection mode        |
| **Toast**             | A transient bottom-right snackbar notification (e.g. "Draft saved") that auto-dismisses (new)         | Snackbar, alert, notification     |

## Design System

| Term             | Definition                                                                                                   | Aliases to avoid                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| **Sienna**       | The chosen visual design direction — warm, earthy, friendly-geometric, light-mode (new)                      | Theme, style, direction            |
| **Design Token** | A named constant in `src/tokens/` that encodes a single design decision (color, spacing, radius, etc.) (new) | CSS variable, design value         |
| **Theme**        | The namespaced collection of all design tokens passed through `ThemeProvider` (new)                          | Config, styles object              |
| **Mark**         | The "Brief" document-with-folded-corner-and-paw SVG symbol, used as the app logo (new)                       | Logo, icon, paw mark               |
| **Wordmark**     | The "PawBrief" logotype combining the Mark and the styled text ("Paw" + "Brief") (new)                       | Logo text, brand name, title       |
| **Primitive**    | A dumb, reusable UI atom with no business logic (Button, Input, Field, Modal, Mark) (new)                    | Base component, atom               |
| **Component**    | A composed UI block built from primitives, with no business logic (Stepper, Chips, Repeatable, etc.) (new)   | Composed component, widget         |
| **Chips**        | A composed input component for adding and removing short tag-like values below a text input (new)            | Tags, pills input, chip input      |
| **Repeatable**   | A composed component that manages an ordered list of entry cards with Add and Remove actions (new)           | Repeater, entry list, list builder |
| **ConfirmModal** | A composed modal used exclusively for destructive actions, requiring explicit confirmation (new)             | Delete dialog, confirm dialog      |

## Relationships

- A **Profile** belongs to exactly one cat and is managed by one **Owner**.
- A **Profile** has a status of either **Draft** or **Complete**.
- A **Profile** contains one or more **Food Entries**, zero or more **Supplement Entries**, one or more **Activity Slots**, and zero or more **Special Notes**.
- A **Care Guide** is generated from one **Profile** (Single) or exactly two **Profiles** (Merged).
- A **Pet-sitter** receives a **Care Guide** — they never interact with the app directly.
- A **Vet Address** generates a **Maps URL** — the owner's home address is never stored.
- A **Photo ID** references a Blob in IndexedDB — a **Profile** references photos by **Photo ID**, never inline.
- **Flavor** and **Texture** are distinct: **Flavor** is what the food is made of; **Texture** is how it is prepared or served.
- **Supplement Entry** and **Medication** are distinct: a **Supplement Entry** is a routine nutritional addition; a **Medication** is a prescribed treatment.
- A **Routine Chart** renders one **Arc** per **Activity Slot**, drawn from the slot's start time across its duration.
- The **Mark** and **Wordmark** are built in SVG code — no raster asset; the **Mark** is the symbol alone, the **Wordmark** combines Mark + text.
- A **Profile Card** has exactly one **Photo Zone**, one **Status Badge**, and one **Scrim** (when a photo is present).
- **Merge-select Mode** is only available when two or more **Complete Profiles** exist; **Draft** profiles are visible but unselectable.
- A **Care Guide** opens with a **Cover Band** followed immediately by an **Emergency Callout**, then numbered sections.
- A **Serving Entry** combines a time and a gram amount — it is not the same as a **Feeding Time** (time only) from the prototype model.
- A **Merged Care Guide** detects a **Shared Vet** by matching both `vet.name` and `vet.phone` across the two profiles.

## Example dialogue (updated)

> **Dev:** "When the **Owner** finishes the last step, do we mark the **Profile** complete immediately?"
> **Domain expert:** "Yes — once all six **Steps** in the **Wizard** have been saved, the **Profile** transitions from **Draft** to **Complete**. The **Dashboard** then shows the **Generate PDF** action on the **Profile Card**."
> **Dev:** "And if they only finish four steps and close the tab?"
> **Domain expert:** "The **Profile** stays a **Draft**. The **Profile Card** shows a 'Continue' button instead. All data is safe — the **Wizard** auto-saves to IndexedDB on every **Step** advance."
> **Dev:** "When we generate the **Merged Care Guide**, are the two **Profiles** linked in any way?"
> **Domain expert:** "No — the **Merge** is a one-time PDF generation action. The two **Profiles** remain independent. The **Merged Care Guide** is the only artifact that joins them."
> **Dev:** "Should we call the routine visualization a pie chart or something else?"
> **Domain expert:** "**Routine Chart** — it's a 24-hour radial clock, not a pie chart. Each **Arc** starts at the **Activity Slot**'s clock time and spans its duration. Calling it a pie chart implies proportional slices; **Arc** on a **Routine Chart** is the correct mental model."
> **Dev:** "What do we call the sienna header at the top of the Care Guide?"
> **Domain expert:** "**Cover Band** — it's a full-width band, not a page header or title block. It contains the circular photo (or **Mark** fallback), the cat's name, and the **Wordmark**."
> **Dev:** "In the **Merged Care Guide**, do we show the vet section twice if both cats go to the same vet?"
> **Domain expert:** "No — that's a **Shared Vet** condition. We detect it by matching name and phone, then render the vet block once full-width. Each column still shows its own emergency contacts."
> **Dev:** "The prototype had `amountGrams` and separate feeding times. Our model has `ServingEntry` with both. How do we show that?"
> **Domain expert:** "A **Serving Entry** renders as a Tag: `'07:30 · 70g'`. We don't split time and grams — the **Serving Entry** is the atomic unit, and it may differ across servings."

## Flagged ambiguities

- **"Type"** was used during the session to mean both **Flavor** (e.g. chicken, duck) and **Texture** (e.g. sauce, patty). These are distinct fields. Use **Flavor** for protein/ingredient type and **Texture** for physical form — never "type" alone.
- **"Supplement"** could refer to either a **Supplement Entry** (routine nutritional addition in the Feeding step) or a **Medication** (prescribed treatment in the Medical step). These are distinct. Use the full term in all contexts.
- **"Page"** risks conflation between a route-level page (a React component) and a **Step** (a screen within the Wizard). Use **Step** exclusively for wizard navigation; reserve **Page** for route-level components.
- **"Pie Chart"** was the prior term for the routine visualization. The correct term is **Routine Chart** — it is a radial clock where each **Activity Slot** is represented as an **Arc**, not a proportional wedge. "Pie chart" is an alias to avoid.
- **"PDF Header"** was the prior term for the sienna header strip on a Care Guide. The correct term is **Cover Band** — it is a full-bleed band, not a page header element. "PDF Header", "cover", and "title page" are aliases to avoid.
- **"Feeding Time"** in the prototype referred to a bare HH:MM string. In the codebase the unit is a **Serving Entry** (time + grams together). Never use "feeding time" to describe a **Serving Entry**.
- **"Logo"** is ambiguous: the **Mark** is the symbol alone (document + paw SVG); the **Wordmark** is the logotype that combines the Mark with the "PawBrief" text. Use the specific term, not "logo."
- **"Component"** in general programming means any React component. In this codebase it has a specific layer meaning: a composed UI block in `src/components/`. Use **Primitive** for atoms in `src/primitives/` and **Component** only for composed blocks.
