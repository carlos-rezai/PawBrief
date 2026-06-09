# PawBrief

> Printable pet care guides for owners who care — built with a structured Claude Code workflow

PawBrief generates clean, shareable PDF care guides for pet owners to hand to their caretakers. Answer a short wizard about your cat's routine, get a polished PDF. No backend. No account. No friction.

**🐾 [PawBrief live demo](https://paw-brief.vercel.app)**

---

## Why This Project Exists

This project has two purposes:

1. **A genuinely useful personal tool** — walk through a short wizard about your cat's feeding schedule, medications, habits, and emergency contacts, then download a ready-to-print care guide to leave with anyone looking after your pet.
2. **A portfolio demonstrating focused product engineering** — every feature was built using a structured Claude Code workflow: grill-me sessions, PRDs, TDD, and a living ubiquitous language document. Client-side PDF generation without a server is a deliberate constraint that keeps the product fast, private, and deployable anywhere.

---

## How It Works

1. **Wizard** — step-by-step questions about your cat's routine (feeding, medications, habits, emergency contacts)
2. **Preview** — live care guide preview updates as you answer
3. **PDF** — download a clean, printable PDF generated entirely in the browser
4. **Persistence** — your cat's profile is saved to IndexedDB so you can return and update it any time
   No data ever leaves your device.

---

## Tech Stack

| Layer    | Choice                          | Why                                                  |
| -------- | ------------------------------- | ---------------------------------------------------- |
| Frontend | React + TypeScript + Vite       | Production-standard, full TypeScript coverage        |
| UI       | styled-components + PawBrief DS | Custom design system, precision over convenience     |
| PDF      | @react-pdf/renderer             | Client-side PDF generation — no server required      |
| Storage  | IndexedDB (idb)                 | Zero-friction persistence, fully private, no backend |
| Testing  | Vitest + Testing Library        | Fast, Vite-native, great DX                          |
| Deploy   | Vercel                          | Instant deploys, no infrastructure to manage         |

---

## Development Methodology

This project was built using a structured Claude Code skill workflow. Every feature follows the same sequence before a line of code is written:

```
grill-me → design-log → ubiquitous-language → write-a-prd → prd-to-plan
→ prd-to-issues → tdd → build → request-refactor-plan → refactor
```

**What this means in practice:**

- Every feature starts with a grill-me session — Claude interrogates the design until every assumption is resolved
- A PRD is written and filed as a GitHub issue before implementation begins
- Tests are written before code (TDD, stopping at RED)
- All domain terminology is locked in `docs/ubiquitous-language.md`
- Design decisions are recorded in `docs/design-logs/`
  The `.claude/` folder contains all skill definitions. The `docs/` folder contains the full paper trail — PRDs, design logs, and the ubiquitous language dictionary — so the reasoning behind every decision is readable alongside the code.

---

## Project Structure

```
pawbrief/
├── .claude/
│   └── skills/
├── src/
│   ├── assets/         ← images, fonts, icons (static)
│   ├── styles/         ← global CSS reset, themes
│   ├── tokens/         ← colors, spacing, typography, breakpoints
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   ├── breakpoints.ts
│   │   └── index.ts
│   ├── primitives/     ← dumb, reusable UI atoms (Button, Input, Text, Icon)
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.test.tsx
│   │       └── Button.styles.ts
│   ├── components/     ← composed UI blocks, no business logic
│   │   └── Modal/
│   │       ├── Modal.tsx
│   │       ├── Modal.test.tsx
│   │       └── Modal.styles.ts
│   ├── features/       ← domain UI + logic co-located per domain
│   │   ├── wizard/     ← step-by-step question flow
│   │   ├── profile/    ← cat profile data + localStorage persistence
│   │   ├── pdf/        ← @react-pdf/renderer document + SVG charts
│   │   └── preview/    ← live care guide preview
│   ├── layouts/        ← page chrome
│   ├── pages/          ← route-level views, composition only, no logic
│   ├── hooks/          ← global shared hooks only
│   ├── types/          ← shared TypeScript interfaces
│   └── utils/          ← pure helper functions
└── docs/
    ├── design-logs/
    ├── PRDs/
    ├── refactor-plans/
    ├── ubiquitous-language.md
    └── dev-journal.md
```

---

## Running from Source

### Prerequisites

- Node.js 22.x

### Install

```
git clone https://github.com/carlos-rezai/PawBrief.git
cd PawBrief
npm install
```

### Dev

```
npm run dev
```

### Test

```
npm run test
```

### Build

```
npm run build
```

Output: `dist/`

### Commit message convention

```
<type>: [<initiative>] issue #<n> <description>
```

`<initiative>` is the PRD/feature initiative name (e.g. `profile-wizard`, `pdf-generation`) — not the issue title.

Examples:

```
feat: [profile-wizard] issue #3 add feeding-schedule step
fix: [pdf-generation] issue #7 correct chart slice alignment
refactor: [profile-wizard] issue #9 extract storage hook
```

Types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`

---

## Build Status

| Feature                   | Status      |
| ------------------------- | ----------- |
| Cat profile wizard        | ✅ Complete |
| Design handoff            | ✅ Complete |
| PDF care guide generation | ✅ Complete |
| SVG routine pie chart     | ✅ Complete |
| IndexedDB persistence     | ✅ Complete |
| Care guide preview        | ✅ Complete |
| PDF guide design          | ✅ Complete |
| Security review           | ✅ Complete |
| Vercel deployment         | ✅ Complete |

---

## Docs

- [Ubiquitous Language](./docs/ubiquitous-language.md)
- [Design Logs](./docs/design-logs/)
- [PRDs](./docs/PRDs/)
- [Refactor Plans](./docs/refactor-plans/)
- [Dev Journal](./docs/dev-journal.md)

---

## Author

**Carlos Rezai** — Senior Software Engineer, Berlin
Transitioning from frontend specialist to agentic AI engineering — building structured human-AI workflows and fullstack AI-powered products.

[GitHub](https://github.com/carlos-rezai)
[LinkedIn](https://www.linkedin.com/in/aryan-carlos-r-0ba21017b/)
