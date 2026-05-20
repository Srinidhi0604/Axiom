# Contributing to Axiom

Axiom is the integrated version of PaperLabs. It keeps the PaperLabs dark, implementation-first design system and combines five education verticals into one Next.js app.

## Product Shape

Axiom has five core verticals:

1. **College Exam Prep** at `/college`
   - Source reference: `sanikapatil22/clgprep`
   - Flow to preserve: semester -> department -> course -> module -> topic workspace.
   - Current Axiom routes:
     - `/college`
     - `/college/semesters/[semester]`
     - `/college/semesters/[semester]/departments/[department]`
     - `/college/departments/[department]`
     - `/college/courses/[course]`
     - `/college/courses/[course]/[module]`
     - `/college/courses/[course]/[module]/[topic]`
   - Data lives in `src/data/college-course-catalog.json`.
   - Helpers live in `src/lib/college.ts`.

2. **GATE & Competitive** at `/gate`
   - Source reference: `ashutoshbhatt2609/gate`, inside `PaperLabs/src/app/gate`.
   - Preserve the original GATE command-center feature set:
     - Dashboard
     - PYQ bank
     - Mock tests
     - Formula sheets
     - Rank predictor
     - Analytics
     - Practice mode
     - Syllabus
     - AI explainer shell
   - Components live in `src/components/gate`.
   - Data lives in `src/data/gate.ts`.

3. **PaperLabs** at `/papers`
   - This is the original ML/research-paper implementation vertical.
   - Keep its paper detail page, reader, and coding terminal behavior intact.
   - Data lives in `src/data/papers.ts`.
   - Core terminal component is `src/components/CodingTerminal.tsx`.

4. **PlacePrep** at `/placement`
   - Placement vertical for DSA, company questions, system design, LLD, SQL, aptitude, and roadmap.
   - Company data mirrors CodeJeet:
     - CSVs in `data/companies`
     - Build script `scripts/build-placement-data.js`
     - Generated static JSON in `public/data/placement`
   - Run `npm run build:placement-data` when company CSVs change.
   - Main data file is `src/data/placement.ts`.

5. **Vibe Lab** at `/vibe`
   - Source reference: `Ansukr07/paperlabs-5`.
   - Preserve the original mode model:
     - Repo Scan
     - Principles Map
     - Repo Tasks
     - Attack Lab
     - Scale Plan
     - CEO Simulator
   - Current Axiom routes:
     - `/vibe`
     - `/vibe/map`
     - `/vibe/tasks/[track]`
     - `/vibe/tasks/[track]/[task]`
     - `/vibe/security`
     - `/vibe/scale`
     - `/vibe/ceo`
   - Data lives in `src/data/vibe.ts`.

## Design Rules

Do not redesign Axiom away from PaperLabs.

- Background: black / near-black.
- Text: white primary, muted gray secondary.
- Cards: `#1a1a1a` background, `1px solid #2a2a2a`, `8px` radius.
- Hover border: `rgba(6, 182, 212, 0.4)`.
- Accents:
  - Cyan `#06B6D4`
  - Purple `#8B5CF6` or existing PaperLabs purple
  - Green `#10B981`
  - Red `#EF4444`
- No Tailwind-only redesigns, no shadcn migration, no marketing-style replacement UI.
- The root landing page should remain the PaperLabs landing structure:
  - hero
  - network graphic
  - scroll/terminal research section
  - vertical cards
  - feature cards
- Use CSS modules or vanilla/global CSS consistent with the existing codebase.

## Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Build:

```bash
npm run build
```

Build placement static data only:

```bash
npm run build:placement-data
```

## Architecture Notes

- Next.js App Router is used throughout `src/app`.
- React 19 and TypeScript strict mode are enabled.
- Auth is PaperLabs-style JWT auth; do not create a separate auth system for a vertical.
- Static vertical content should be read from `src/data` or generated into `public/data`.
- Company question data must stay static and client/server-readable from generated JSON. Do not add API routes for company question browsing.
- Persisted user state, when needed, should use existing MongoDB/JWT auth patterns.

## Agent Workflow

When another agent works on this repo:

1. Read this file first.
2. Inspect the existing route/component before changing it.
3. Preserve user-visible flows from the source vertical repos.
4. Keep Axiom as one integrated app, not five unrelated apps embedded together.
5. Run `npm run build` before handing back frontend or routing changes.
6. If touching PlacePrep company data, run `npm run build:placement-data`.
7. Avoid removing existing user changes. The worktree may be dirty.

## Important Files

- `src/app/page.tsx` - Axiom landing page using PaperLabs landing structure.
- `src/components/Navbar.tsx` - unified Axiom nav.
- `src/components/Footer.tsx` - unified Axiom footer.
- `src/app/globals.css` - global design tokens and shared vertical shell CSS.
- `src/app/axiom.module.css` - shared Axiom vertical page styles.
- `src/lib/college.ts` - college catalog helpers and slug routing.
- `scripts/build-placement-data.js` - CodeJeet-style company data prebuild.

## Definition of Done

A change is done when:

- The route works directly in the browser.
- All visible buttons either navigate correctly or perform a real local interaction.
- The page matches the PaperLabs visual system.
- The source vertical's core flow is not lost.
- `npm run build` passes.
