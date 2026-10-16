# Performance

## Current repository boundary · 2026-10-17

This is the independent **game PWA**, extracted from `fearnot221/evergreenbloom`.
Deploy only with Docker / Compose (Dockerfile and docker/default.conf). Own routes:
`/` redirects to `/game`; `/game`, `/play`, `/stamp/:spot` and a not-found page.
The static official website, public map, festival news and program remain in the
other repository. `VITE_WEBSITE_URL` is a build-time external-link setting.
There is no runtime dependency on the official site for collecting prototype stamps.
Offline core contains only this app's assets; map and public pages are not cached.

Copied design foundations retain v6 tokens and display-copy ownership. Earlier
inventories below refer to the combined app and are historical, not current routes.
No login, database, server-side stamp verification, photo review or redemption API
has been added. Device-local prototype records do not migrate across origins.
Docker must be served through HTTPS outside localhost for install/offline support.
See README.md for deployment, checks and unimplemented production boundaries.

## Baseline and status

The 2026-09-29 greenfield note is historical. **Measured 2026-10-17, v6** (production
build, Vite gzip sizes in kB; a build estimate, not field data):

| Home route, cold cache | Size | Budget |
| --- | --- | --- |
| Initial JavaScript (entry 119.3 + Home 4.9 + GSAP, ScrollTrigger, SplitText, ScrambleText 52.0) | ~176 kB | ≤ 150 KiB (153.6 kB): **over by ~23 kB** |
| Initial CSS | ~8 kB | ≤ 50 KiB |
| Fonts (one display subset, LXGW WenKai TC Bold, preloaded) | 75.2 KiB | ≤ 100 KiB |
| Glyph textures (cones.svg 174 KB, petals.svg 21 KB raw; ~2 + 1.4 kB gzip) | ~3.4 kB | |

The petal storm draws at most 130 petals on two canvases at device pixel ratio ≤ 2 and
stops when the hero leaves the viewport; it has not been profiled on a low-end phone.
| HTML | 0.7 KiB | |

**Known overrun (not resolved by changing the budget).** The entry chunk is React DOM and
React Router; the overrun is the GSAP bundle the user requested for the hero timeline
(SplitText) and scroll system (ScrollTrigger). Other routes load it after first paint.
Options if the budget must hold: defer ScrollTrigger until after the hero, or replace
the hero's SplitText with CSS. Needs a real-device LCP/INP measurement before deciding.

v4 (earlier the same day) loaded ~120 kB initially with GSAP deferred.

History: v3 (2026-10-16) loaded ~119 KiB initial JS (entry 113.9 + Home with WebGL
sky 5.0) and 79.4 KiB of fonts (serif 68.8 + poster 10.6).

The second 2026-10-16 pass moved to React Router's data router (route-level lazy
loading, view transitions, scroll restoration), which added about 17 KiB to the entry
chunk; it removed the Suspense skeleton flash between routes. Before the redesign the
same route loaded about 143 KiB of JavaScript (entry 90.9,
GSAP + ScrollTrigger 43.8, Bloom chunks about 8). Removing GSAP and the Bloom scroll
choreography accounts for the reduction. The Three.js renderer (146 KiB gzip) still
loads only on `/map`, after the campus JSON, and is never precached.

v3 subsets fonts from the display copy modules only, so body copy no longer grows the
font. The WebGL sky renders at half resolution and stops when no sky section is
visible; its GPU cost on low-end phones is unmeasured. The home campus sketch fetches
the 134 KB campus JSON lazily when that section approaches. Core Web Vitals, real-device INP and Safari/Firefox rendering
remain unmeasured.

The budgets below are provisional project policy for future implementation, not
claims about the existing site or universal limits. Revisit them once product
requirements and a production baseline exist. Record any exception's reason,
affected route, measured cost, fallback, and revised limit; never silently raise a
budget to make a check pass.

## Core Web Vitals targets

| Metric | Target |
| --- | --- |
| Largest Contentful Paint (LCP) | ≤ 2.5 seconds |
| Interaction to Next Paint (INP) | ≤ 200 milliseconds |
| Cumulative Layout Shift (CLS) | ≤ 0.1 |

Evaluate all three at the 75th percentile, segmented by mobile and desktop, using
representative real-user data when available. These targets follow Google's
[Web Vitals guidance](https://web.dev/articles/vitals), checked 2026-09-29.
A Lighthouse score or simulated page load does not prove field compliance.
Lighthouse TBT is a diagnostic proxy, not an INP measurement.

## Initial resource budgets

Per representative route, with a cold cache, count all resources requested before
the initial page is usable and settled, including third parties. Use compressed
response-body transfer sizes (gzip/Brotli where applicable); 1 KiB = 1024 bytes.
Later route transitions and user-requested media are measured separately.

| Resource / behavior | Provisional limit |
| --- | --- |
| Total initial transfer, all resource types | ≤ 1,024 KiB |
| Initial JavaScript, including framework and third parties | ≤ 150 KiB |
| Initial CSS | ≤ 50 KiB |
| Initial fonts | ≤ 100 KiB total |
| Primary above-the-fold image | ≤ 200 KiB at its delivered responsive size |
| Decorative animation JavaScript by default | 0 KiB |
| Routine UI animation | Normally ≤ 300 ms; see INTERACTIONS.md |
| Main-thread tasks during interaction | Avoid tasks exceeding 50 ms |

These are simultaneous ceilings, not allocations to fill. Necessary language font
coverage or a media-intensive product may require a documented adjusted budget.
Measure dependency cost in the built route, not from package download size.

## Animation performance rules

- Prefer transform and opacity; confirm the browser's actual rendering behavior.
- Avoid per-frame layout reads mixed with writes. Batch reads before writes.
- Avoid per-frame framework state updates for pointer or scroll values.
- Use event-driven updates; use requestAnimationFrame only for active visual work.
- Avoid large animated blurs, shadows, filters, masks, and full-screen repaints.
- Add `will-change` only where measurement supports it and remove it afterward.
- Stop offscreen/hidden loops and dispose listeners, observers, timelines, and timers.
- Profile on representative mobile hardware. At 60 Hz the whole frame has about
  16.7 ms; the app must leave room for browser work, not consume the full interval.
- Reduced motion must avoid initializing unnecessary animation work.

## Image and media rules

Use correctly sized responsive images with explicit dimensions or aspect ratios.
Prefer efficient formats such as AVIF/WebP where appropriate, preserving a
compatible fallback and visual quality. Use SVG for suitable vector assets.
Do not serve oversized desktop media to phones.

Do not lazy-load the likely LCP image. Prioritize only genuinely critical media;
lazy-load below-the-fold media. Avoid speculative preloads of multiple variants.
Reserve space for images, embeds, and async content to prevent layout shifts.

Use posters and deliberate preload settings for video. Load heavy players on
intent when possible. No unsolicited audio or decorative autoplay video. Provide
accessible alternatives and preserve image rights and attribution. Load only
necessary font weights/subsets without excluding supported languages; use a
fallback strategy that preserves readability and limits reflow.

## JavaScript constraints

Prefer platform features and the existing stack. Do not install a framework,
component suite, animation engine, or analytics package merely because a skill
suggests it. Inspect the manifest and lockfile before dependency decisions.

Keep static content static and isolate interactive code. Where the architecture
supports server rendering, avoid turning entire pages into client components for
one interaction. Split optional heavy features by route or intent. Avoid duplicate
libraries, unnecessary polyfills, global scroll listeners, and eager third-party
scripts. Profile expensive computation and move justified work off the interaction
path. Preserve useful fallback content if optional JavaScript fails.

## WebGL and Canvas constraints

Default allocation: none. Use only for a confirmed need such as an interactive
visualization that DOM/SVG cannot reasonably serve. A decorative background alone
is insufficient justification.

Before adoption, document download, CPU/GPU and memory cost, device support, and
accessible DOM/static fallback. Load on intent or visibility, cap effective pixel
ratio (start at 2 or lower on constrained devices), resize deliberately, stop
hidden rendering, and dispose contexts/resources. Handle context loss and reduced
motion. Essential text, navigation, and controls must remain accessible outside
the drawing surface. Never require Canvas/WebGL for core content access.

## Mobile considerations

Test constrained CPU and network conditions as well as a real mid-range phone when
available. Check touch responsiveness, virtual keyboards, safe areas, orientation,
and dynamic browser chrome. Avoid fixed viewport assumptions that obscure content.
Reserve layout space and do not block native scrolling. Ensure touch targets are
comfortably usable, do not require hover, and do not disable pinch zoom. A desktop
emulator does not establish mobile GPU performance or battery behavior.

## Measurement and release review

Once a runnable project exists:

1. Discover documented build/test commands; use a production build for profiling.
2. Select the landing route, each distinct page template, and critical user journeys.
3. Record commit/build, route, tool version, viewport/device, CPU/network settings,
   cache state, and whether results are lab or field data.
4. Run at least three comparable cold-cache lab samples; report the median and
   range. Inspect resource transfers and trace important interactions, not just load.
5. Compare before/after budgets, LCP candidates, layout shifts, main-thread work,
   and teardown behavior. Investigate regressions rather than averaging them away.
6. Review representative field percentiles after deployment when data exists;
   mark them unavailable when traffic or measurement is insufficient.

Use existing project checks once discovered. No build, test, audit script, or
monitoring integration is introduced by this documentation-only task.
