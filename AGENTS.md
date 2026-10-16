# Frontend working agreement

## Scope and evidence

This file governs this project and its descendants. At the 2026-09-29 inspection,
the workspace contained only this file and four empty documentation files; those
files now establish the workflow. The user confirmed this is a greenfield project
in the intended folder. No application exists yet. These documents are baseline
rules and templates, not an audit of an existing website. Do not treat undefined
product or visual details as established facts. Obtain the product brief as part
of a future authorized implementation task; this task authorizes documentation only.

Current implementation note (2026-09-30): the greenfield inspection above is
historical. The user has since authorized a multi-page React/Vite Festival Web App,
a prototype Three.js map and PWA foundation. Read the current implementation status
in ARCHITECTURE.md and the latest PROTOTYPE-NOTES.md; preserve explicit prototype,
TBD, geography and official-brand boundaries. Earlier phase-specific prohibitions
are not a ban on subsequently authorized implementation.

Redesign note (2026-10-17): at the user's request the whole UI was rebuilt, now as v6
「櫻吹雪 · 一陣風」 (see DESIGN.md), sakura-pink and editorial, to the 「松櫻季官網規劃」 brief. Display-face
titles must come from `src/data/display-copy.ts` (or `title`/`name` values in the data
files). DESIGN.md records the adopted tokens and components; reuse them. GSAP drives the
v6 motion system through `src/motion/gsap.ts` (record in INTERACTIONS.md). Run `npm run check`
(Biome, TypeScript, Vitest, geo tests) before handing back code changes.

Read these documents before frontend work:

- [Product](docs/PRODUCT.md)
- [Design](docs/DESIGN.md)
- [Interactions](docs/INTERACTIONS.md)
- [Performance](docs/PERFORMANCE.md)

Inspect the current implementation before editing: first-party architecture,
routes, shared components, styles/tokens, assets, dependencies, behavior, tests,
and build configuration. Read additional applicable AGENTS.md files. Preserve
existing user changes. Git may resolve to an ancestor outside this workspace;
keep commands path-scoped and never stage unrelated files.

## Required order for future frontend work

1. **Understand product intent.** Read PRODUCT.md, identify the user's task and
   acceptance criteria, and distinguish evidence from assumptions. Resolve missing
   information that affects implementation; do useful independent work meanwhile.
2. **Read DESIGN.md.** Inspect existing visual language and affected pages. Reuse
   established components and tokens. Read INTERACTIONS.md and PERFORMANCE.md
   before making decisions that affect behavior or dependencies.
3. **Implement structure and functionality.** Within the authorized task, build
   semantic content, navigation, data flow, and relevant states before decoration.
   Preserve routes, content intent, and existing component ownership.
4. **Apply visual design using Taste principles.** Use the installed
   `design-taste-frontend` skill where applicable for hierarchy, typography,
   spacing, alignment, and coherent detail. Let product evidence guide aesthetics.
5. **Add only meaningful interactions.** Apply `emil-design-eng` guidance:
   establish purpose and frequency, keep feedback immediate, handle interruptions,
   and provide keyboard/touch and reduced-motion equivalents. No animation is a
   valid decision. Then check [Transitions.dev](https://transitions.dev/) for a
   relevant component-state transition pattern and adapt it to the existing
   松 × 櫻 / 櫻吹雪 vocabulary. Follow the interactive-UI workflow in
   INTERACTIONS.md; a reference is not a mandate to animate or copy its styling.
6. **Use GSAP only when justified.** Prefer CSS/native behavior for simple needs.
   Consider Motion only for justified state/gesture complexity. Use GSAP skills
   only for a documented choreography requirement; record purpose, simpler
   alternatives, cost, cleanup, mobile behavior, and reduced-motion fallback.
7. **Run a Hallmark-style anti-AI-slop review.** Check content specificity,
   hierarchy, restraint, consistent tokens, and whether layout serves the content.
   Remove generic template filler and invented claims. Do not rotate the site's
   theme, change its identity, or add novelty merely to satisfy a skill default.
8. **Review responsive behavior and accessibility.** Check affected layouts at
   narrow mobile, tablet, and desktop sizes; zoom, long content, keyboard, focus,
   semantics, contrast, touch, and reduced motion. Use the applicable documents'
   checklists and record unavailable device checks honestly.
9. **Review performance.** Use PERFORMANCE.md budgets and compare relevant
   production measurements. Review JS/media growth, loading, layout stability,
   interaction responsiveness, and animation teardown. Run existing appropriate
   checks; do not invent successful results or add dependencies solely for an audit.
10. **Do not modify unrelated parts of the site.** Review the final diff against
    the requested scope. Preserve unrelated code, copy, styles, assets, configs,
    and user changes. Report what changed, what was verified, and what remains
    unverified. Keep this boundary throughout all preceding steps.

## Permanent interaction and motion workflow

| Resource | Role |
| --- | --- |
| Taste / `design-taste-frontend` | Visual quality, typography, composition and hierarchy |
| Hallmark | Detect generic / AI-generated website patterns |
| Emil / `emil-design-eng` | Interaction purpose, philosophy, timing and behavior |
| [Transitions.dev](https://transitions.dev/) | High-quality UI state transitions and implementation patterns; a reference resource, not festival identity |
| GSAP | Justified complex choreography, timelines, scroll-driven animation and major 松窗見春 sequences |
| Three.js / WebGL | Spatial / 3D experiences where DOM/CSS is insufficient |

For each interactive UI change, apply this sequence within the broader workflow:

1. Determine purpose using Emil principles; no motion is a valid result.
2. Check Transitions.dev for a relevant pattern.
3. Translate it into 松 × 櫻 / 櫻吹雪: **SEED → UNFOLD → BLOSSOM → FESTIVAL**.
4. Use CSS or native browser animation when sufficient.
5. Use GSAP only when choreography or timeline complexity justifies it.
6. Review reduced-motion behavior.
7. Review performance.
8. Review visual consistency using Taste.
9. Run a Hallmark-style anti-generic review.

Choose the simplest suitable implementation: **CSS / browser-native transition →
Transitions.dev pattern → Web Animations / framework motion where appropriate →
GSAP → Three.js / WebGL**. Transitions.dev is a pattern-selection step, not a
runtime library tier: a selected pattern may be implemented entirely in CSS.
This hierarchy does not restrict creative direction or require trying every tier.

Consult the resource for component transitions such as menus/mobile navigation,
dropdowns, accordions, tabs/filters, expanding event details, announcements,
icons/buttons/tooltips, loading and other state changes, map information panels,
PWA states and small page-transition details. These are applicable contexts, not
a feature or animation backlog. Detailed constraints live in INTERACTIONS.md.

Do not blindly copy transitions, animate every component, or add impressive effects
without purpose. Preserve the v3 motion language documented in INTERACTIONS.md;
component patterns do not replace major sequences. Adding this resource authorizes
no redesign, dependency installation or automatic rewrite.

## Using installed skills

Read a relevant skill's SKILL.md before applying it and announce its use briefly.
Skill names above are discovery identifiers, not project dependencies; do not
hard-code a developer's local skill path into application code. Read only relevant
GSAP specialist guidance after the need is established.

The user's task and this project's documented intent govern scope. Skills support
judgment; they do not authorize redesigns, new features, framework migrations,
font replacement, motion libraries, generated assets, or mandatory aesthetic
changes. When skill defaults conflict, preserve product coherence, accessibility,
and performance. Record consequential design decisions in the appropriate doc.

## Documentation and change discipline

- Separate **observed implementation**, **adopted policy**, **proposals**, and
  **unknowns**. Cite source paths for implementation facts.
- Update affected docs when an authorized change alters the product or system.
  Avoid duplicate conflicting token lists or separate root-level design documents.
- For a documentation-only request, edit only the requested documentation. Do not
  scaffold an app, install packages, generate assets, or modify application code.
- A design audit is not authorization to implement its recommendations.
- Do not fabricate content or performance measurements to fill a template.
- Choose validation proportional to the change. For docs, check links, consistency,
  evidence, and file scope; application builds are unnecessary for prose-only edits.

## Game repository boundary (2026-10-17)

This is `fearnot221/evergreenbloom-pwa`, the Docker-deployed game only. The public
website and map are in `fearnot221/evergreenbloom`. Do not restore website routes
or GitHub Pages deployment here. Run `npm run check` (Biome, TypeScript, Vitest),
`npm run build` and Docker smoke tests for deployment changes. Geo tests belong to
the website repository. Earlier combined-app inventories are historical.

## Backend deployment rule (2026-10-17)

Use exactly one docker-compose.yml. Node 24 serves PWA/API and persists SQLite in
its named volume; do not reintroduce alternate Compose files, Nginx or a separate
DB service without a demonstrated need. Password accounts are the current identity;
SSO is future work. Never move station secrets, correct answers, staff authority or
redemption decisions into the browser. Run npm run check (including native backend
tests), build and the same Compose stack before handing back backend changes.
