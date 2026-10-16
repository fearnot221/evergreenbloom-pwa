# Prototype notes and historical records

## Current pass · account-backed stamps and redemption (2026-10-17)

Implemented in server/app.mjs, server/index.mjs and src/game/. The user clarified
password accounts now, later SSO; staff privileges come from account roles rather
than management keys. Public signup creates players only. The trusted staff account
is bootstrapped from private runtime environment, with rotation revoking old sessions.

There is exactly one docker-compose.yml. The prior compose.yaml and Nginx config
are removed. One unprivileged Node 24 container serves static PWA + API; SQLite WAL
and the persistent game-data volume hold users, hashed sessions, stamps, photos and
receipts. No runtime dependency, ORM, auxiliary service, override or profile was added.

Server verification checks private per-spot codes and quiz answers. Photo upload is
bounded, consented and reviewed by staff; no client flag or file presence earns a
stamp. Reuploads change review IDs to prevent approving an unseen replacement.
Review removes current image bytes; an expiry task handles overdue pending photos.
Server transactions and UNIQUE(user_id) enforce one redemption per account, with
server time, staff identity and stamp count in an immutable-via-API receipt.

Verified locally:
- npm run check: Biome, TypeScript, 18 frontend tests and 8 native backend integration
  tests. The backend cases exercise authentication, unauthorized role escalation,
  CSRF, Secure/HttpOnly cookies, JSON/upload limits, invalid answers/codes, private
  file isolation, photo review/reupload races, duplicate stamps and concurrent
  once-only redemption, expiry/rotation, restart persistence and consistent backup.
- npm run build, service-worker generation (21 public core resources); API is
  explicitly excluded from service-worker handling and every API response is no-store.
- The canonical Compose configuration builds and starts a healthy container.
  HTTP integration created a test player, logged in as staff, completed all tasks,
  approved a photo and submitted four concurrent redemptions: one 201, three 409.
  Force-recreating the container retained the account, all three stamps and receipt.
- Desktop browser through the local Vite proxy: login loaded the persisted 3/3
  progress and receipt; player access to staff functions was refused; staff login
  exposed review and redemption records. No management-key form exists.
- git diff --check and one-Compose-file regression check.

The ignored local .env contains random verification credentials and station codes;
the local volume contains a clearly named compose-* smoke-test account and receipt.
Neither belongs in an actual event deployment. CI fixture credentials are intentionally
public and are not deployment defaults. Local Docker builds use the classic builder
because of this machine's previously observed BuildKit credential transport issue.

Not verified: real installed iOS/Android, narrow/tablet/zoom, screen readers,
reduced-motion sessions, production HTTPS/domain, throughput/load and SSO. Existing
motion is retained; no new animation/dependency was introduced. No per-person
deduplication, password recovery or prize inventory is implemented. Official tasks,
placements, privacy policy and prize terms remain unconfirmed.
Earlier passes below are historical and do not describe the current backend.


## Current pass · independent Docker game PWA (2026-10-17)

Extracted into `fearnot221/evergreenbloom-pwa`. Only game, install/privacy guide,
QR entry and not-found routes remain. The official map is an external link. The
public-site pages, Three.js and geographic pipeline are not part of this build.
Existing design tokens, display font, tasks and client-side game behavior are retained.
Dockerfile, Compose and Nginx configuration provide the deployment; no GitHub Pages
workflow exists in this repository. The public origin is not selected yet.

Verified locally: Biome, TypeScript, all 19 Vitest tests, production build and
service-worker generation (19 core files). Route tests cover QR transfer, install
instructions, invalid keys and the browser-tab gate. `npm audit` reports zero
vulnerabilities after a source-map-js patch lock update. Biome's inherited config
deprecation is unchanged. Docker image build also ran all 19 tests successfully with a single Vitest worker
(to avoid SIGKILL from concurrent workers on the constrained local Docker VM).
Compose started the Nginx image; `nginx -t`, health, SPA/QR deep links, manifest MIME,
no-cache headers, immutable hashed assets, missing-asset 404 and all 19 core resources
passed HTTP smoke checks. Desktop browser confirmed QR redirection and its preserved
claim. Saving core succeeded; stopping the container and navigating to `/game` still
loaded the saved page and installed-app gate. This checks cached loading, not installed
mobile gameplay. Local Docker BuildKit/credential-helper transport failed, so the
local image was built with Docker's classic builder; CI builds with standard Docker.

This is still a device-local prototype: no identity, database, trusted verification,
photo review or prize redemption. A new origin cannot import previous localStorage.
No real iOS/Android install, screen-reader, camera or production-HTTPS test has been
performed. Historical combined-app records below are provenance, not current routes.

## Current pass · v6 「櫻吹雪 · 一陣風」 main handoff (2026-10-17)

This snapshot promotes the current `claude/songying-season-website-91487a`
worktree to `main`. Earlier passes below are historical. The current visual system
is documented in DESIGN.md: sakura-pink editorial typography, textured 松 / 櫻
glyphs, a canvas petal storm and GSAP motion in `src/motion/`.

The snapshot also includes `/partners`, `/donate`, `/play`, `/game` and
`/stamp/:spot` (`src/app/router.tsx`), device-local prototype stamp storage
(`src/game/stamp-store.ts`), and revised PWA install/core-save behavior. Login,
server-validated stamps, donation channels and confirmed festival placements remain
unavailable; prototype content and geography boundaries remain in force.

**Verified for this handoff:** `npm run check` passed (Biome, TypeScript, Vitest
33/33 and geo tests 6/6); `npm run build` passed and generated the service worker
with 37 core files. Biome reports an existing configuration deprecation notice.
`git diff --check` passed. No browser, installed-PWA, screen-reader, real-device or
cross-browser checks were performed during this handoff. The initial-JavaScript
budget overrun recorded in PERFORMANCE.md remains unresolved.

## Previous pass · v3 「松窗見春」 full re-composition (2026-10-16)

The user judged the 春空 versions worse than the original Bloom site and asked for a
new, fully re-composed version at Awwwards top-prize level, reviewed and iterated until
it had no obvious weak point. The original (a37e655) was run side by side first. It
won on typography-led storytelling, contrast and a strict grid. The 春空 versions lost
on pastel cards, pills and edge decoration. v3 is built from that diagnosis; see
[DESIGN.md](DESIGN.md).

**Built:** a raw WebGL2 spring sky (clouds and petals). A pine-ink window with the
wordmark cut out, zooming into the sky. A vertical serif statement. 松/櫻 split
panels. Hanging-scroll posters that unroll. A 貳 numeral filled with sky. A pinned
horizontal ticket strip. A campus line sketch drawn from OpenStreetMap. A full-screen
menu with circle reveal. A pine-ink footer with a full-width wordmark. An inner-page
vertical title spine. Two display-font subsets (serif and poster) fed by copy modules.

| Review finding | Fix |
| --- | --- |
| Sky invisible in development | StrictMode remount reused a context the cleanup had lost; cleanup no longer calls `loseContext` |
| Poster lettering wrapped (說明/會) | Each scroll is its own size container; lettering sized in `cqi` of the poster |
| Scroll sheet and bottom rod drifted apart | Both run on one named per-scroll view timeline |
| Fresh page loads restored another page's scroll | `ScrollRestoration` keyed by path, because fresh loads all share the key `default` |
| Window opened slightly zoomed; meta hidden by the tab bar | Zoom holds for the first 8% of the track; meta lifted above the tab bar on phones |
| Pine cone covered the 松 glyph; tablet panels mostly empty | Motif moved off the glyph; panels only forced to near-full height from 860 px |
| Plain (dynamic) titles got a vertical mark | Vertical setting applies to serif spines only |
| Scroll posters too small on phones | Swipeable row at 64vw per scroll |

**Verified:** Biome, TypeScript, Vitest 19/19, geo 6/6, build. Browser: home chapters at
1440 × 900 (light and night), 820 × 1180 and 375 × 812; program, about, news detail, map
and the menu at 1440; menu focus moves to close and Escape works; no horizontal
overflow at 375 or 820. **Not verified:** real phones (GPU cost of the sky), Safari and
Firefox (Firefox lacks scroll timelines and gets the static layout), screen readers,
reduced motion in a browser, the production offline flow after this change.

## Previous pass · award-level polish (2026-10-16, second pass)

Skills applied: Taste, Hallmark, Emil and `make-interfaces-feel-better` (layered
shadows, punctuation, hit areas, transition specificity), with Transitions.dev as
the pattern reference. Audit first, then fixes, then a second browser review.

| Audit finding | Change |
| --- | --- |
| Hero was flat: motifs floated beside the title with no depth | Scroll-driven parallax per motif depth, pointer depth on mouse devices, cloud bank closing the hero, larger title cap (15.5rem) |
| Route changes cut hard and showed a skeleton flash | Data router with route-level lazy loading, View Transitions cross-fade, shared title morph from tiles/cards to detail pages, delayed pending bar, initial-load fallback |
| Event rail showed a raw scrollbar and cut a card at tablet width | Rail only under 700 px with hidden scrollbar; three-up grid above |
| Surfaces relied on hard 1 px borders | Layered `--shadow-surface` in both themes |
| Footer offline panel was heavy on every page | Collapsed disclosure beside the footer navigation; the 更多 sheet link opens it |
| Big CJK headlines had wide punctuation gaps | `palt` on display type |
| Announcement tiles had no pointer response beyond lift | Soft light that follows the mouse inside each tile |

Verified: lint, typecheck, Vitest 19/19 (new router coverage test), geo tests 6/6,
build clean. In-browser at 1440 × 900 (light and dark), 820 × 1180 and 375 × 812:
hero, triptych, story, ledger, events grid/rail, footer, events page, news detail via
tile click (route, title, focus on `main`, scroll reset). The morph itself was not
frame-inspected because the pane's screenshots lag a frame. Not verified: Safari and
Firefox view-transition fallbacks, real devices, reduced motion in a browser.

## Previous pass · 春空 Spring Sky redesign (2026-10-16)

The user supplied a screenshot of the second-edition (第二屆) official social grid and
asked for a full UI/UX redesign in that style, the clean-up items from the project
analysis, and preparation for a later architecture change. Skills applied: Taste
(`design-taste-frontend`) for hierarchy and the pre-flight checklist, Hallmark for the
anti-slop review and studied-DNA extraction (image mode, no pixels copied), Emil
(`emil-design-eng`) for motion purpose, timing and reduced motion, and Transitions.dev
for the sheet, accordion and skeleton patterns.

**Design read:** event companion for students and campus visitors, poster-like and
soft, built from the posts' lavender sky, blush clouds, heavy rose display type,
grey-violet identity line, sparkles, sakura and pine cones. Dials: variance 7,
motion 5, density 4. Decisions are recorded in [DESIGN.md](DESIGN.md).

### What changed

- Code: the dense one-line sources were reformatted (Biome) and the app split into
  `src/app`, `src/pages` (one lazy chunk per route), `src/components`, `src/styles`,
  `src/pwa`; the map modules were renamed (`MapPage.tsx`, `FlatMap.tsx`,
  `RoutingDebug.tsx`) and re-coloured through a shared palette.
- Removed: Direction E home, Bloom/seed components, the `/motion` lab, four global
  stylesheets (about 90 KB raw), and the GSAP dependency. Recoverable from a37e655.
- Added: self-hosted Noto Sans TC Black subset and its build script, Phosphor icons,
  hand-built motif SVGs, new app icons, dark (夜櫻) theme, offline page restyle.
- Content: edition copy now says 第二屆; three announcements (活動說明會, 工人招募,
  特約商店) record only what the posts show, with source and pending status. Events
  and program slots remain fictional and labelled.
- Tooling: `npm run lint|format|typecheck|test|check|fonts`, Vitest suites in `tests/`,
  GitHub Actions CI. Package renamed `songying-festival-app`.

### Verification performed

- `npm run lint` (Biome) clean; `tsc --noEmit` clean; Vitest 18/18 (content integrity,
  font coverage, no em/en dashes or stray hex colours in `src`, every route renders one
  `main` and one `h1`, program URL filters, detail and not-found routes); geo node tests
  6/6; `npm run build` succeeds with no warnings.
- Browser (in-app Chromium, dev server): all 12 representative routes rendered with
  one `main`/`h1`, a route title and no horizontal overflow at 1440 px; no console
  errors. Home, Program, News, About, Events, Team and Map inspected at 1440 × 900;
  Home, Program and News at 375 × 812; Home and News in the dark theme.
- Keyboard: skip link and header focus rings visible; route changes move focus to
  `main`; the 更多 sheet opens with focus on 關閉, closes on Escape and returns focus
  to 更多.
- Contrast (computed from tokens): display rose on the lightest sky about 3.3:1
  (large text), on paper 5.2:1; ink on sky above 7:1; white on rose about 5.2:1.

### Iterations made from the review

| Found | Change |
| --- | --- |
| Display rose read brown and failed 3:1 on the darker sky | Lightened the sky top, moved rose to `oklch(54% 0.16 355)` |
| Announcement tile byline overlapped at 375 px | Container query drops 國立中央大學 under 560 px tile strip width |
| Header text collided with scrolled content | Scroll-driven frosted header bar |
| Events bento left an empty cell | 2+1 / 1+2 rhythm on a fixed three-column grid |
| Sheet stayed off-screen | Nested `@starting-style` was not honoured; moved to top-level rules |
| Duplicate CTA labels for the same destination | One label per intent (最新消息, 校園地圖) |
| Letter-by-letter title and infinite loops conflicted with INTERACTIONS.md | Whole-title entrance; sparkles and petals stop after finite passes |

### Not verified

Real phones, Safari/Firefox, screen readers, 200% zoom, the reduced-motion and
reduced-transparency media queries in a browser (reviewed in CSS only), the
production service-worker save/offline flow after this change, Core Web Vitals,
and tablet widths between 768 and 960 px. The hands from the posts are not
reproduced; official artwork and logo are still needed.

## Historical pass — E2 full-site creative refinement

2026-09-30. Implemented against the working multi-page app, after inspecting and
scrolling all eight principal routes plus representative event/news details at
1440 × 1000 and 390 × 844. This is a provisional digital art direction, not an
approved official logo, festival key visual, or final DESIGN.md. Product facts,
fixtures, route names, publishing provenance, localization boundaries, navigation
architecture and pedestrian-routing scope are unchanged.

Open the built application at **http://127.0.0.1:4173/**. Development/HMR remains
http://127.0.0.1:5173/. The built preview is the place to test the service worker.

### What the initial rendered audit found

The opening had the most coherent relationship between large Chinese type,
layered geometry and scroll. After it, the page shifted into ordinary lists.
Inner routes repeated the same oversized-left-title/right-paragraph composition.
Events gave every item an equally large numbered rectangle; the number was more
prominent than the event. Team was mostly a role grid. Map markers were all open
flowers before any selection; selection was just uniform enlargement. News
used an unremarkable date string, and route entry was another fade/translate.
Mobile preserved those same compositions by stacking them, with little change
in rhythm. Functional flows already worked and were retained.

Evidence is in the local scratch directory `/tmp/songying-e2-review/`: `before-*`
and `final-*` full-page captures, contact sheets, interaction logs and performance
results. These are local QA artifacts, not published festival materials. Full-page
captures cannot show every sticky/scroll state; viewport captures and interactive
scrolling were also used, including the home program and people sequences.

### Graphic grammar and typography

- `src/bloom-grammar.tsx` supplies `BloomMark`, `BloomPrint`, `BloomDivider`, honest
  `MaterialSlot` placeholders and `PartnerSpace`. The five-way mark uses the same
  notched `scalePath()` as `SeedArt`; large prints reuse the existing 15-scale
  compact/radial geometry. They are not independently drawn floral decorations.
- `src/bloom-refinement.css` is the scoped E2 layer over the established Bloom
  styles. Existing luminous pink, rose, sky and warm-white roles continue, with
  a brighter flat pink for the featured print. No gradients, glass, blur fields,
  new font requests, textures, stock photos or fake sponsor marks were added.
- Chinese display type is now composition: the About name crosses layers;
  松 / 櫻 explain the story; 聲 / 集 / 遊 / 聚 distinguish the event studies;
  一起 is the collective anchor; News separates a small phrase from a much
  larger 消息. Decorative duplicates are hidden from assistive technology.
- Utility headings, times, labels, body copy and source notes remain readable
  and stable. Program uses tabular time numerals and a continuous ordering line.
  System TC font fallbacks remain in use. No final custom font has been chosen.

### Route-by-route result

| Route | E2 implementation |
| --- | --- |
| Home | Core Bloom entrance, timings, aperture and scroll relationship preserved. Featured items now share large botanical/type prints with differing scale, followed by the existing news seam, rebloom, schedule, shoreline and closing. Shared divider and collective print connect the added sections. |
| About | Full-width 松櫻祭 cover, reading deck, large meaning glyphs, sticky compact-to-open study on desktop, clearly labelled future campus-art slot, and sky-colored 2026 history spread. Mobile gets a deliberately stacked/cropped typographic cover and normal-flow reading. |
| Program | Quieter, shorter title; native URL-backed filters; day/time hierarchy; one timeline spine; compact markers open when participation details expand; prominent map action. Mobile preamble shortened to bring the first time into view sooner. |
| Events | One large featured composition, a market cut-paper spread, an arched activity print and a compact final entry. Event titles/locations remain links to the same records. Arrow placement no longer wraps onto a line by itself. Detail pages use the same glyph/scale composition beside calm practical information. |
| Map | Restrained building outlines/facade rhythm, shallow graphic scale markers, numbered projected labels matching the DOM list, compact-to-open selection, better controls and information panel. All original arbitrary geometry and disclaimers remain; no campus paths were invented. |
| News | A typographic news desk, oversized month/day, separate year and provenance rule. The detail page uses the actual announcement headline as its h1. The supplied test announcement remains explicitly non-official. |
| Team | Individual compact/open forms gather behind 一起. Staggered editorial role spreads have explicit future portrait locations instead of profile cards. No people or organizations were invented. |
| Visit | Calm type, a restrained divider, numbered in-page navigation, consistent practical rows and a native FAQ with an open/close sign. No reading text or essential guidance moves. |

Partner layouts include wide and square material positions, intrinsic-ratio
image containment and honest pending text. These are not sponsor counts or tiers.
Approved color/monochrome artwork can enter as supplied; do not automatically
recolor official logos. Actual logo/portrait fit still requires the real assets.

### Motion decisions and costs

| Before | After | Why |
| --- | --- | --- |
| Page content fades and shifts on every route | Information appears immediately; a small shared header mark unfolds/rotates for 200 ms on pointer navigation | Maintains continuity without gating reading. Rapid navigation cancels the previous mark animation. Keyboard navigation and reduced motion skip it. |
| No collective assembly | Three Team forms assemble from different directions once when visible | Explains individual → group; does not animate role descriptions. Scoped SVG transforms, no per-frame React updates or loop. |
| Static decorative dividers | Selected story/home rules expand with viewport progress when native CSS timelines are supported | Carries a graphic into the next composition. Unsupported browsers receive complete static rules. |
| Uniform event rectangles | Different print/type compositions with subtle fine-pointer rotation | Indicates exploration, while the real event link remains available to touch and keyboard. No scaling of the complete UI card. |
| All POIs already flowers | Unselected compact scales, selected five-way opening over 240 ms | Communicates destination selection. DOM list and URL update immediately; no animation must finish to use the map. |
| FAQ state only in a native triangle | Native disclosure plus a plus-to-close sign | Confirms expansion without animating long copy or relying on animation-end events. |

The original GSAP opening, masks, type dispersion, seed morph, rebloom, path draw
and closing remain. No new animation engine or GSAP plugin was added. About's
small type movement uses native CSS scroll timelines with a static fallback.
The 2D study still allows direct range input and resume-scroll control. Native
CSS motion obeys reduced motion and the home static toggle. Essential content
is never hidden behind intersection observers. Reduced-motion changes at runtime
remove/recreate the appropriate existing ScrollTriggers.

Measured trigger teardown: Home 8 → About 1 → Program 0, repeated with the same
counts. About reduced motion 0; changing back to ordinary motion 1. Map renders
on interaction and during its bounded selection transition, then stops; idle
WebGL draw counts were unchanged across a 250 ms sample at both primary widths.
Offscreen/hidden rendering is gated and listeners/resources are disposed.

### One expressive Three.js experiment: rejected for the live story

Compared the existing isolated pinecone-to-blossom study at phase 0 and 100 in
2D and 3D (`study-2D-*`, `study-3D-*`). The 3D version added soft depth but read
more like a candy form and was less crisp against the editorial type. It did not
justify another public Three.js use. The public 3D switch/import was removed
from `src/seed-art.tsx`; `src/seed-three.ts` is retained as explicitly archived
experimental source, unreferenced by the live app and absent from the build.
The functional campus renderer remains independently lazy-loaded.

### Validation and performance

- `npm run build`: TypeScript and production/PWA generation pass. The existing
  React Router client-directive advisory and large lazy map-chunk warning remain.
- Every principal route plus `/events/lake-study` and `/news/next-spring` was
  scrolled and visually reviewed at 1440 and 390. Additional layout checks cover
  320, 375, 414 and 768. The 320px Team assembly briefly extended 1px past its art
  area; clipping was scoped to that decorative composition and the 10-frame
  retest reported zero horizontal overflow. About's inherited fixed study height also
  widened its square art beyond 320/375px; an explicit 100% width and automatic
  height corrected the art itself without hiding content. The final 48-route/width
  layout sweep reported no overflow or console/runtime errors; keyboard skip,
  dialog Escape/focus return and the open-dialog axe check also passed.
- Day/category filters, event → location selection, map list/URL/Back, canvas
  raycast selection, map zoom, touch opt-in, leave-route cleanup, mobile More,
  FAQ, English disclosure/Escape and reduced-motion behavior remain working.
- axe WCAG A/AA/2.1/2.2 checks report no violations on the eight principal routes
  at 1440 and 390. This is automated coverage, not a full accessibility claim.
- WebGL loss and absence retain readable DOM locations. Explicit PWA core saving
  still supports offline event/visit content and map-list selection; unsaved
  offline navigation shows the fallback. The map engine is not in the core cache.
  Normal-profile Chrome installability reports no errors. Actual installed
  standalone mode, Safari, physical phones and screen-reader sessions are untested.
- No normal-route runtime/console errors were observed. Intentional WebGL failure
  checks are separate from normal-console checks.

Cold-cache production lab: Chrome 154, 4× CPU, 40 ms network latency,
200,000 B/s download, three samples per route/width. Values below are lab results,
not field INP or field Core Web Vitals compliance.

| Route / viewport | LCP median (range), ms | CLS, all samples | Initial JS, gzip |
| --- | --- | --- | --- |
| Home / 1440 | 1140 (1128–1140) | 0 | 142,035 B / 138.7 KiB |
| Home / 390 | 1136 (1128–1144) | 0 | 142,035 B / 138.7 KiB |
| Program / 1440 | 1020 (1016–1024) | 0 | 95,413 B / 93.2 KiB |
| Program / 390 | 1028 (1024–1028) | 0 | 95,413 B / 93.2 KiB |

Prior pass: Home 142,096 B JS, Program 94,523 B; Home LCP medians 1108/1112 ms,
Program 992/1004 ms. The small LCP differences are within a local lab comparison,
not proof of a field regression or improvement. Initial CSS is approximately
17.46 kB gzip (about 4.6 kB more than the previous pass), below the 50 KiB budget.
The independent map-engine chunk is 147.49 kB gzip, including Three.js; it is
larger than the prior combined map/Three payload of about 139 kB. It is requested
only on Map, not Home/Program, and is not precached. Program does not load GSAP.
No fonts/media downloads were added. Home had 54–63 ms initial long tasks in
some throttled samples; Program had none. These are loading tasks, not measured
interaction INP. Mobile GPU/battery and field responsiveness remain unverified.

### Final creative review and remaining limits

**Strongest overall: Home**, because it retains the recognizable opening and now
carries a related graphic language into activity/people content. **Strongest
editorial inner page: About.** **Weakest overall: Team**, because the intended
portrait rhythm still depends on approved images; its hierarchy is now distinct,
but placeholders cannot provide the specificity of actual student work.

The initially weak News page received an additional type/date/provenance pass
rather than more ornament. Deliberately removed: giant decorative event numbers,
the repeated equal-weight event layout, generic whole-page fade/translate entry,
public expressive-3D switch and default-open map flowers. No glass, gradients,
rounded-card system, bento, particles or continuous decorative loops were added.

Remaining visual issues: no approved photography, portraits, key visual or logo;
local TC font shapes differ across platforms; the compact seed can still read as
an abstract bud rather than an unmistakable pinecone; Map remains a stylized
arbitrary model rather than a place-specific NCU landscape. These are recorded
limits, not permission to invent official material or geography. Sponsor/logo
handling needs checking with the eventual real files. No DESIGN.md finalization,
new product feature, navigation implementation or product-definition edit occurred.

---

## Historical baseline — multi-page Festival Web App

2026-09-30. The user explicitly moved from architecture to implementation. This
pass builds the application; the older E-only studies below are historical.
Official branding and future festival facts remain unconfirmed. Final DESIGN.md
is unchanged. Product/architecture status paragraphs now reflect what exists.

**Open the complete PWA preview:** [http://127.0.0.1:4173/](http://127.0.0.1:4173/).
Development/HMR runs at [http://127.0.0.1:5173/](http://127.0.0.1:5173/), without a
service worker. See README for build and hosting requirements.

### Implemented routes and shared application

- `/`: preserved Bloom shutter/aperture/type opening and scroll choreography;
  festival story, pending edition, linked featured examples, program highlights,
  announcements, lightweight campus preview, organizer/partner context and closing.
  The bright-pink activity sequence, sky campus field and layered closing continue
  the visual world rather than switching to a generic card layout after the hero.
- `/about`: Chinese editorial display, shared pinecone-to-blossom study, festival
  meanings, campus history and concise 2026 origins. `/events` uses alternating
  oversized numbered compositions; `/events/:id` connects description, sessions,
  location and visit information. Fixtures are clearly labelled fictional.
- `/program`: URL-backed day/category filters, chronological day grouping, times,
  native participation disclosures, event details and “在地圖查看”. No actual
  future festival date is assigned to the two test days.
- `/news`, `/news/:id`: editorial announcements, explicit test/publication context
  and source; `/team`: clustered prototype role descriptions with no invented
  personal names; `/visit`: calm arrival, campus, participation and native FAQ.
- `/map`: a functional, lazy 3D prototype and independently usable location list.
- `/e` redirects to `/`. `/motion` remains a reference. A/B/C/D remain removed.

React Router owns navigation. Desktop exposes all eight principal destinations;
mobile has Home / Program / Map / More, with a native modal dialog for remaining
routes. Browser Back/Forward, route focus, saved scroll positions, visible focus,
a skip link and a short 180ms route entrance are implemented. Reduced motion
bypasses the entrance and resolves Bloom. Native hash links remain available.
English availability is stated honestly instead of rendering a misleading mixed
English page. Translation content has not been fabricated.

`src/data/model.ts` defines Event, ProgramEntry, Location, Announcement, Organizer,
Sponsor and renderer-independent NavigationNode/NavigationEdge/RouteResult types.
`src/data/festival.ts` is the single revisioned fixture snapshot, including status,
edition IDs and Location references. Existing factual history remains in
`src/content.ts`; fixtures refer to it instead of replacing it. This first snapshot
ships with the build; there is no CMS, backend or separate mutable content API.

### Three.js that actually runs

`src/map/engine.ts` builds five placeholder buildings, arbitrary prototype paths,
a lake-like surface and four selectable POIs. These are **not measured NCU campus
geometry**. `map-data.ts` owns the replaceable visual dataset and frame ID;
Location has geographic nulls and arbitrary world positions, not mesh IDs.

OrbitControls provides bounded zoom/tilt plus rotation and panning. Buttons provide
keyboard-accessible zoom/rotation/reset. Raycasting selects markers, the location
list selects the same domain entity, and the active marker changes color/scale.
`/map?location=lake-plaza` focuses/selects that location and shows linked events.
Unknown IDs explain the missing selection. Reduced motion does not disable the
functional map; camera selection is immediate, without a cinematic flight.

Mobile begins with normal page scrolling; an explicit control enables map gestures
and another returns to scrolling. The drawing buffer caps DPR at 1 on coarse
pointers / 1.5 otherwise, with a 1.2-million-pixel area cap. Rendering happens on
input/resize/selection, not a permanent RAF loop. Visibility gates rendering;
unmount disposes controls, geometry, materials, renderer and context. Context loss
and unsupported WebGL retain the complete location UI and retry action.

The decorative pinecone/blossom experiment remains a separate optional renderer,
loaded only by its own 3D comparison button. The functional campus engine never
loads for that experiment. The Three.js library may be shared by the bundler only
when one of these explicitly requested 3D branches is used. Ordinary pages do not
fetch it. Program/Visit no longer fetch GSAP just to display static shape artwork.

No pedestrian route engine/graph, AR, geolocation permission, real distances,
entrance verification, or accessible-route claim was implemented. Types preserve
these future boundaries without inventing geographic evidence.

### PWA and offline behavior

The manifest supplies scope/start URL, Traditional Chinese app name, standalone
display, theme/background colors, Program/Map shortcuts, normal PNG icons at
192/512px and a maskable 512px icon. Icons are temporary digital artwork and are
not represented as official festival branding.

The lightweight build-generated service worker derives an explicit allowlist from
the Vite manifest. Installation saves only a small readable offline fallback.
**儲存核心頁面** explicitly saves compatible shell HTML, ordinary route code and the
revisioned data snapshot. Successful completion and saved time are displayed;
partial/failing saves do not claim success. Initial/uncached offline visits explain
that core content is unavailable. Once saved, even an unvisited core detail route
can open offline. Offline status warns about stale content.

Three.js, campus/decorative renderers and the development lab are excluded from
core storage. The cached `/map` page can select Locations and open linked content
without WebGL. No third-party runtime cache, automatic large model download or
live offline-positioning promise. Core cache footprint is approximately **500 KiB
uncompressed** in this build (before browser overhead); it includes ordinary page
code and icons, not just JSON.

New workers wait for prior clients to close; there is no forced reload or
`skipWaiting`. UI indicates a pending update. Versioned shell/code/data are kept
together; activation removes only this app's obsolete caches. Saving the new build
is explicit. This first version uses build snapshots, not real-time mutable event
updates. Storage eviction, first-ever offline use and future live-data freshness
still need production policy. SPA fallback and HTTPS remain hosting requirements.

API references used while implementing:
[React Router routing](https://reactrouter.com/start/declarative/routing),
[Three.js OrbitControls](https://threejs.org/docs/pages/OrbitControls.html), and
[MDN offline/background operation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation).
These informed implementation, not copied art direction.

### Browser verification and fixes

Tests ran against the built preview in Chrome 154 headless, not just source files.
Local scripts/results/screenshots are in `/tmp/songying-app-review/`.

- All eight main routes plus activity/announcement detail routes opened at
  **1440×1000 and 390×844** with no page runtime exceptions or horizontal overflow.
  Additional Program/Map/Team checks at 320, 768 and 1024px had no overflow; final
  title/anchor checks also cover Home/About/Events/Team/News/Visit at 320px.
- Desktop links and mobile More dialog navigation work; dialog closes after
  navigation and main content receives focus. Day/category filtering leaves the
  expected one-row result. Program → Map selects the referenced Location. Map
  selection updates the URL; browser Back restores the previous selected ID.
- A projected click on the actual Three.js marker was raycast to `demo-stage`.
  Zoom causes a draw; measured idle counts stay constant. Leaving the route removes
  the canvas. Real `WEBGL_lose_context` testing leaves the location fallback usable;
  context-creation failure and unknown IDs also show useful states.
- Native disclosures, English notice/Escape, map gesture toggle and reduced-motion
  home state pass. Controls remain available without animated delivery of content.
- WCAG 2 A/AA, 2.1 AA and 2.2 AA automated checks covered all eight main routes at
  both widths. Home's small map links initially failed target size; they now have
  44px targets and the targeted recheck reports **zero violations**, matching the
  other routes. Illustration contrast remains an automated incomplete item, not
  an accessibility certification or screen-reader sign-off.
- PWA manifest parsing has no errors. In a normal temporary Chrome profile,
  installability inspection returns **no installation errors**. The first isolated
  test profile reported only the expected incognito restriction. No OS installation
  was performed. This test environment did not support standalone display-mode
  emulation, so native standalone viewport/safe-area behavior remains unverified
  on actual hardware; CSS safe-area and dynamic-viewport handling are implemented.
- Successful core save was verified, followed by offline direct navigation to an
  unvisited event detail and Visit. Offline Map explains the absent 3D bundle,
  selects a different Location and updates its URL/content. A separate unsaved
  profile correctly shows the readable offline fallback. Cached URL inspection
  confirms no Three.js, map engine or decorative renderer entries.

### Performance observations

Ordinary cold-load network checks confirm **no Three.js requests**. Program has
**no GSAP requests**. The production build passes TypeScript and Vite; it retains a
large optional Three.js-chunk advisory (~533 kB minified / ~133 kB gzip) and React
Router's browser-only `use client` bundling advisory. Neither warning was hidden
by increasing thresholds; SSR is not part of this Vite prototype.

After correcting route-loading layout shifts, three cold samples per viewport and
route used 4× CPU throttling, 40ms latency and 200,000 B/s download:

| Route / viewport | LCP median (range), ms | CLS | Initial JS, local gzip estimate |
| --- | --- | --- | --- |
| Home / 1440 | 1108 (1104–1112) | 0 | 142,096 B ≈ 138.8 KiB |
| Home / 390 | 1112 (1096–1120) | 0 | 142,096 B ≈ 138.8 KiB |
| Program / 1440 | 992 (988–1012) | 0 | 94,523 B ≈ 92.3 KiB |
| Program / 390 | 1004 (1000–1008) | 0 | 94,523 B ≈ 92.3 KiB |

The measurement pass preceded the final below-fold target-padding, title line-break
and unused-state cleanup. These are lab observations, not field CWV or an INP claim.
Home desktop startup long tasks were 54–56ms; the other sampled combinations had
none >50ms. Initial shared CSS is ~13 kB gzip, with no downloaded fonts or photos.
The functional map adds roughly 139 kB gzip of renderer/library code after entering
`/map`, within the architecture's proposed map-specific incremental allowance;
it is not hidden inside the ordinary-page 150 KiB budget. No postprocessing,
large textures, models, blur fields or autoplay media were added.

### Taste / Hallmark / Emil review

| Before | After | Why |
| --- | --- | --- |
| Only `/e` and a reference lab | Shared route shell with purposeful inner-page hierarchy | A persistent companion needs direct information destinations, not repeated homepage entrances |
| Generic decorative geometry and isolated study | Same scales/type vocabulary in editorial, event, team and quiet utility contexts | Continuity comes from composition and state, not a repeated card template |
| Short loading placeholder moved the visible footer | Viewport-height loading reserve | The measured initial CLS fell from 0.154/0.244 on Program to 0 |
| Small homepage location links | 44px link targets | Touch and keyboard utility matters more than compressed metadata |
| Decorative glyph in More's accessible name | Glyph hidden from assistive technology | The action has the predictable name “更多” |
| Implicit awkward CJK wrapping | Clause-based display line breaks | Oversized type remains intentional on narrow screens |
| Utility pages inherited story-motion imports | Pure SVG separated from lazy story motion | Program/Visit remain calm and avoid unnecessary animation JS |

No generic SaaS hero/CTA pair, card-grid default, rounded panel system, gradient
field, glass layer, fake sponsor logos or repeated paragraph reveals. Chinese type
and chapter-like composition carry identity; Home and About have motion peaks,
Program/Visit prioritize stable reading. Route entrance is short and does not gate
navigation; frequent map/filter actions update immediately.

Remaining limitations: real-phone/Safari and screen-reader checks, actual native
installation/standalone safe areas, GPU/battery profiling, service-worker upgrade
and storage-pressure tests across multiple real tabs/devices, verified English
content, official assets, approved organizer/sponsor identities and surveyed campus
data. The site remains explicitly a prototype; no production publication occurred.

---

## Historical iteration — Seed → Unfold → Blossom → Festival

2026-09-30. The user explicitly authorized this refinement after the architecture
pause. **E / Bloom remains the working direction.** This is a digital prototype,
not an official key visual, logo, or botanical description. Product facts,
`PRODUCT.md`, `ARCHITECTURE.md`, `RESEARCH.md`, and `DESIGN.md` are unchanged.
The previous “complete scene sequence” section below is historical; its raw
WebGL aperture and generic leaf artwork have now been superseded in E.

Open [/e](http://127.0.0.1:5173/e). In the story section, switch **2D / 3D** and use
the **收攏 → 展開 → 綻放** slider to compare the same structure at the same phase.
Dragging or using the keyboard holds the selected phase; **隨捲動展開** resumes the
scroll relationship. In static/reduced-motion mode that action is disabled and
labelled 靜態構圖. No extra comparison route or old A/B/C/D/index was restored.

### What changed, and what is deliberately retained

- **One shape family, two behaviors.** Fifteen overlapping scales collect into a
  compact, vertically tapered form, then separate into five radial groups of
  three layers. A shallow cleft develops in the 2D shape as it opens. Compactness,
  overlap and weight refer to pinecone structure; radial spacing, clefts and
  openness refer to blossom behavior. This is an abstract transformation, not a
  claim that a pinecone biologically becomes a cherry blossom.
- **Opening:** the original shutter, expanding aperture and Chinese-character
  animation retain their timings and easing. The new scale transformation runs
  inside this opening; it does not add another intro to wait through. Large 松櫻祭
  remains the identity carrier. The open radial field sits behind 櫻 and 祭, while
  松 gives the composition a more compact starting edge. Essential information
  and the skip action remain independent of the graphic.
- **Story:** 松 and 櫻 frame the same compact-to-open structure; desktop scroll
  changes the art around stable paragraphs. The comparison control can hold any
  intermediate phase. Mobile has its own portrait composition in normal flow,
  with a native slider instead of a pointer-only interaction.
- **Rebloom/current edition:** the same layered geometry replaces the generic
  procedural rings behind 再相聚. A second compact-to-open gesture accompanies
  the existing typography transition. The actual date/venue ledger stays still.
- **Closing:** a partially unfolded cluster replaces the generic leaf next to
  the large 春. It connects the end of the page back to the seed/opening state.
- **Small states:** navigation underlines expand from their center; the selected
  prototype mode has a tapered lower edge; the news rule uses a restrained taper;
  the selected campus relationship button gains a small expanded corner accent.
  These are state cues, not repeated blossom icons. Native details still expose
  information directly, with the existing short reveal. No endless petal fall,
  animated flower cursor, route pulse, scroll hijack, or generic reveal series.
- **Palette:** existing clear pink, warm white, rose, lavender and sky roles are
  retained. No automatic green/brown theme, new display font, official logo, or
  synthesized official artwork. The existing provisional scenery remains an
  illustration, not a geographically accurate campus depiction.

The E-only shader files `bloom-depth.tsx` and `bloom-field.ts` were removed. Shared
Bloom components now accept an opt-out for the old leaves; `/motion` keeps the
original default artwork and choreography. The current refinement is implemented
in [direction-e.tsx](../src/direction-e.tsx), [direction-e.css](../src/direction-e.css),
[seed-form.ts](../src/seed-form.ts), [seed-art.tsx](../src/seed-art.tsx), and the optional
[seed-three.ts](../src/seed-three.ts).

### Three.js comparison and decision

**Built:** an abstract, matte scale object with fifteen curved meshes, a shared
geometry, three Lambert materials, orthographic projection, modest directional
lighting, separation/rotation of individual scales, and a surface morph toward
petals. Fine mouse movement changes the view slightly so front/back overlap can
be inspected. No photographic textures, metallic materials, particles, shadows,
postprocessing, or permanent render loop.

The 2D and 3D studies share IDs, compact/open positions, fivefold grouping,
rotation and phase in `seed-form.ts`. Their surface representations differ:
SVG Bézier outlines versus a curved mesh grid with a morph target. This makes
comparison coherent without pretending that their silhouettes match pixel for
pixel. Meshes here represent decorative scales only; they have no relationship
to the future shared Location model, campus meshes, routing graph or geolocation.

**Decision for this iteration:** retain **2D as the main website treatment** and
keep 3D as an explicit comparison, loaded only after the reviewer chooses it.
The rendered 3D version communicates overlap, folding and thickness; it does not
yet communicate the name or information more clearly than 2D, and its added
payload is substantial. Its existence is not a requirement to ship Three.js in
the homepage or to use this art renderer for the campus map.

Implementation references: [Three.js BufferGeometry](https://threejs.org/docs/pages/BufferGeometry.html),
[MeshLambertMaterial](https://threejs.org/docs/pages/MeshLambertMaterial.html), and
[WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html). These were API
references, not visual sources to copy. The forms are procedural local artwork,
not copied reference artwork or a recreation of an official asset.

### Interaction purpose / without it / cost

| Interaction | Purpose | Without it | Cost and limits |
| --- | --- | --- | --- |
| Opening scales → petals with type | Give Bloom an accumulation-to-opening relationship specific to this brief | Static typography and the expanded composition still communicate identity; no facts are withheld | Fifteen SVG paths updated during the finite entrance; same skip/interrupt behavior as the existing intro; static resolves immediately |
| Story scroll transformation | Relate compact 松 and expansive 櫻 through one object | The slider and stable story copy preserve the explanation | One additional scoped ScrollTrigger; imperative art updates, no React render per scroll frame; native scrolling remains intact |
| 2D/3D switch and native phase slider | Evaluate whether depth actually improves the transformation, including on touch and keyboard | The 2D website remains complete; these are prototype review controls | Optional Three.js payload, GPU resources, error/status handling; explicit intent required; no canvas in reduced/static mode |
| Fine-pointer 3D response | Reveal which scales sit in front and how curved they are | Phase control still works and the composition is readable | Bounded angle, mouse-only, render on input only; no pointer lock, dragging requirement, control movement or touch gesture interception |
| Center-out nav underline / selected corner | Indicate current location or selected item using the same outward vocabulary | `aria-current`, `aria-pressed`, color and content changes still identify state | Short transform only; keyboard/reduced/static states resolve immediately; no repeated pulse |
| Native announcement / fixture detail | Reveal optional reading and participation information on demand | All expanded content is still available via native HTML semantics | Existing short reveal; no 3D, auto-close, hover-only access, or animated facts |

### Application beyond the home page

The current app still has an E prototype, not the full multi-page product.
**Implemented:** home transformation, story art, quiet news rule and disclosure,
program hierarchy, selected campus relationship state, calm visit information,
and the closing composition. The relationship diagram is explicitly labelled
non-geographic; no accurate campus map or navigation has been invented.

**Future applications, not implemented pages or approved final design:**

| Surface | Use of this vocabulary | Boundary |
| --- | --- | --- |
| About | Editorial images and compact/open compositions tied to the story | No motion gate in front of historical text |
| Program | Layered grouping, small selected states, calm time/location hierarchy | Keep repeated rows and real schedules easy to scan; no fifteen-petal decoration on every item |
| Events | An expressive event heading or image reveal derived from scale separation | No event content or official materials are fabricated |
| Map | Restrained selected POI, festival-zone overlay and destination state | Preserve measured campus geometry, Location IDs and route legibility; do not turn roads/buildings into petals or imply an accessible route is verified |
| Team | Clustering and shared alignment to express people gathering | Clear names/roles and reading order; no orbiting portraits |
| News | Small editorial edge/state accents | Source/context and publication information take priority |
| Visit | Minimal state vocabulary | Transportation, entrances and attendee instructions remain stable and clear |

A reduced compact/open silhouette could be tested later at favicon/app-icon size,
but **no icon, PWA launch screen, loading animation or official logo was created**.
An icon study would need legibility and official-brand compatibility checks.

### Required ten-point review

| Question | Result and remaining judgment |
| --- | --- |
| 1. Both 松 and 櫻 without repeated literal icons? | The same fifteen pieces shift from overlapped compactness to fivefold openness. No scattered pinecone/flower stickers. Recognition of “pinecone” still needs human review; the object is intentionally abstract. |
| 2. Recognizable pinecone structure? | Staggered rows, taper, overlap and a compact core are visible in the closed state. The 3D view makes front/back depth more explicit; this is structural evidence rather than a claim of botanical accuracy. |
| 3. Still the chosen Bloom? | The shutter/aperture/type opening, native scroll dispersal, bright pink and calm information beats remain. This is an evolution of E, not another direction. |
| 4. Coherent transformation? | Scale IDs persist, positions interpolate to five groups, and shape/spacing change together. The slider permits inspection in either direction, rather than hiding a swap behind a fade. |
| 5. More distinctive, not more decorative? | Generic leaves and the separate ring shader were replaced by one shared form system. It has a small number of composition roles; details and text do not each receive a flower. A remaining risk is reading the fully open form as a large flower illustration, so compact and intermediate phases matter. |
| 6. Typography integration? | Hero petals sit behind the 櫻/祭 grouping; story characters frame and overlap the shape; 再相聚 occupies the same field on rebloom. Chinese text remains larger and more important than the motif. No logo letterforms are claimed. |
| 7. Quiet inner surfaces? | Existing news, program and visit keep stable content with small state/rule changes. Separate About/Events/Map/Team pages do not exist yet; their proposed application above is not a claim of tested implementation. |
| 8. Mobile concept? | A portrait word/shape arrangement and touch/keyboard phase slider preserve compact → open. No pointer dependency or long sticky story stage. A small rotated-character overflow found in testing was corrected. |
| 9. Is 3D meaningful? | It demonstrates layered depth, curvature and scale separation, but does not yet outperform 2D sufficiently to justify default loading. Keep as a comparison, with no production adoption implied. |
| 10. Strong reduced-motion composition? | Fully open hero/rebloom plus an intermediate story/closing arrangement retain the concept. Scrolling no longer animates art, Three.js is not loaded initially, active canvases are disposed, and the range changes the 2D state directly on user input. |

Taste review: large TC type carries hierarchy; whitespace separates story from
attendee utility; asymmetry has a content/shape relationship instead of random
rotation. Hallmark review: no SaaS hero/CTA pair, card-grid default, pill system,
glass, decorative gradient field, blob collection, or repeated scroll reveals.
Emil review: motion explains unfolding and selected state; essential text is
stable; frequent utility interactions remain immediate and interruptible.

### Verification and performance

- `npm run build` passes TypeScript and Vite. The optional Three.js chunk still
  triggers Vite's >500 kB minified-chunk advisory; it was not hidden by raising
  the limit. Build gzip sizes: initial JS approximately **124.30 kB decimal
  (121.4 KiB)** across entry/shared/E chunks; CSS **10.39 kB (10.1 KiB)**; optional
  Three.js study **132.09 kB (129.0 KiB)**. No downloaded font or image assets.
  The initial JS stays within the documented 150 KiB baseline. Loading 3D brings
  cumulative JS beyond that baseline; this is an explicitly requested experiment,
  not a silent revision of the production budget.
- Production Chrome 154 headless, desktop 1440×1000 and mobile 390×844: skip link
  focuses edition information; range works with keyboard End; compact/open states
  change; switching renderers preserves phase; returning to scroll restores its
  phase; announcement and fixture details, English notice/Escape focus and campus
  selection pass. No page exceptions. Existing `/motion` opens and A/B/C/D remain
  unavailable.
- Automated WCAG A/AA checks returned **zero violations** at desktop and mobile.
  Contrast over illustration remains an automated incomplete result, requiring
  visual judgment. This is not a screen-reader or full accessibility certification.
- Initial page visit fetches **zero** Three.js study chunks. Both tested sizes
  show stable draw counts during idle/offscreen intervals and a new draw on phase
  input. Repeated 2D/3D switches leave one canvas; static/reduced modes leave none.
  Failed import, unavailable WebGL2 and actual context loss retain the SVG fallback
  and expose a status message. Reduced-motion initial visits do not fetch Three.js,
  even when the 3D comparison is selected.
- Before the final small mobile-position/control-label adjustment, three cold-load
  production samples per size with 4× CPU throttling, 40 ms network latency and
  200,000 B/s download produced desktop LCP median **972 ms** (960–1144), mobile
  **972 ms** (972–980), and **CLS 0**. Initial longest tasks ranged 56–64 ms desktop
  and 52–65 ms mobile. Each 5.5-second scripted full-page scroll recorded no >50 ms
  long task and no frame interval >34 ms. These measure the default 2D path only;
  they are lab observations, not field Core Web Vitals or proof of real GPU speed.
- Final responsive recheck: no horizontal overflow at 320, 375, 390, 414, 768,
  1024 or 1440 px, including the scrolled story state. A 390 px emulated touch
  swipe over the 3D illustration scrolls the page (225 px in the test); the static
  mode correctly disables the resume-scroll action.
- 3D uses fifteen meshes, one shared low-resolution surface, capped drawing-buffer
  area (900,000 pixels), DPR ≤1 on coarse pointers / ≤1.5 otherwise, visibility and
  document-hidden gates, and event-driven rendering. Geometry/materials/renderer
  are disposed on mode change or unmount. No perpetual rotation/render loop.
- Real phones, Safari, assistive-technology reading, GPU/battery profiling and
  production PWA behavior remain unverified. No navigation accuracy, geolocation,
  offline routing or accessible campus-path claims are introduced.

Review scripts/captures are local disposable evidence in
`/tmp/songying-seed-review/`; no QA dependency was added to the project.

---

## Historical iteration — Bloom as a complete scene sequence

2026-09-30. The user's latest brief makes **E / Bloom the working direction** and
explicitly authorizes motion, color, typography, and an isolated WebGL experiment.
This is a prototype continuation, not a new direction or official brand system.
`PRODUCT.md`, `RESEARCH.md`, `DESIGN.md`, and the shared `/motion` implementation
remain unchanged. The earlier E record below describes the previous iteration;
its dusty palette, limited story motion, and “no WebGL” statements are historical.

Open [/e](http://127.0.0.1:5173/e). [/motion](http://127.0.0.1:5173/motion) remains
the original four-study reference. A/B/C/D and the old index remain removed.

### Scope, intent, and visual changes

The preserved opening and hero scroll timeline still use the shared
[bloom-motion.ts](../src/bloom-motion.ts) and [bloom-art.tsx](../src/bloom-art.tsx).
No entrance timing, shutter choreography, or hero dispersal parameter was changed.
The E-only palette changes the appearance of that shared art, not the lab palette.

The sequence is now opening → story → announcements → rebloom/current edition →
program → campus/visit → closing. Its energy rises and settles rather than applying
entrance effects to every paragraph. Native scrolling and direct section anchors
remain available throughout.

- Clear pink `#ffe0ee`, luminous pale pink `#fff0f6`, rose `#a51e59`, stronger pink
  `#ff6ea6`, sky `#b8ceff`/`#c9dcff`, and warm white `#fffbfd` replace the dusty E
  relationships. These are **temporary digital exploration colors**, not festival
  branding. Shader edge shading describes folded surfaces; no gradient text,
  animated gradient background, glass, or decorative blob system was added.
- Chinese display is treated as composition: tightly spaced two-line story title,
  oversized separated 松/櫻 with a sticky illustration, a cropped moving news
  phrase, staggered 再相聚, and an oversized 春 at the closing. Semantic headings
  and prose remain whole; repeated purely graphical characters are aria-hidden.
- The existing local TC sans stack remains. Scale, crop, weight, line breaks, and
  placement provide the typography pass without inventing an official display
  typeface. Rendering remains dependent on the installed Chinese fonts. Dates and
  schedule times use Latin/tabular numerals; metadata has a separate small-text role.
- Approved artwork can replace the botanical and landscape roles later. The shader
  is an optional digital transition, not a proposed logo, key visual, or depiction
  of the actual campus. No missing official assets were synthesized.

### Six creative technology studies and decisions

These were developed as scoped systems inside E and an isolated lazy renderer;
there is no additional comparison-index route. Review captures are in
`/tmp/songying-world-review/` (local, disposable evidence, not shipped assets).

| Study | Investigated / observed | Decision and reason |
| --- | --- | --- |
| GSAP typography | Independent display-character transforms around stable story prose; 再相聚 assembles over the second opening | Keep. Makes Bloom a behavior beyond the hero, while paragraphs remain readable without reaching an animation threshold |
| ScrollTrigger composition | Sticky desktop story art, moving news seam, a horizontal strip opening into the edition composition, closing aperture | Keep. Native scroll changes the composition; no smooth-scroll library, snapping, or forced scroll position |
| WebGL depth | Built a texture-free fragment shader with nested nonconcentric openings, edge light, scroll-dependent radius, and layer-dependent pointer offset | Keep the second version as an isolated prototype enhancement. It combines contour deformation and depth in one surface; a handful of translated DOM ellipses did not express the same folding behavior |
| Mask / reveal | News-rule-to-field inset reveal and a closing iris; compared with the shader's changing contour | Keep the small number of structural masks. Essential prose and controls never depend on them. Static layouts remove the masks |
| Pointer composition | GSAP quickTo moves the story illustration by at most ±9 px / ±7 px; shader layers react with different depth offsets | Keep on fine-pointer desktop only. No pointer-following text, magnetic controls, custom cursor, or cursor trail |
| Mobile composition | 390px diagonal 再相聚, standalone story-art beat instead of a long sticky stage, smaller type displacement, three shader layers | Keep. A different portrait arrangement preserves identity with less simultaneous movement and no pointer dependency |

**Implemented variants rejected:** the first shader used nearly concentric openings
and small contour changes; the first screenshot comparison looked too much like
flat stacked rings. The retained version increases nonconcentric folding, layer
shape differences, and scroll expansion. First/second-version captures and the
first renderer source are retained in the local review directory. Also removed
the tested 160 ms foreground/background color interpolation on campus selectors:
intermediate colors failed contrast checks. Selection now switches immediately.

**Considered, not built:** a Three.js scene graph, particle atmosphere, permanent
ambient loop, post-processing, and a full-page WebGL world. This single procedural
transition does not need meshes, lighting infrastructure, textures, or continuous
simulation. Raw WebGL satisfies the requested serious GPU experiment with a much
smaller isolated module. No claim is made that these unbuilt alternatives were
benchmarked or prototyped.

### Scene handoffs

| Handoff | Survives | Transforms | Leaves | Arrives / purpose |
| --- | --- | --- | --- | --- |
| Key visual → story | Pink ground, character scale, botanical material | Existing three-character dispersal and story window | Hero shutters and foreground title | Meaning of the festival name; preserve the liked transition |
| Story → announcements | 生長 wording, rose type and thin rule, pale ground | Oversized seam phrase moves laterally; pale curved field resolves to paper | Sticky story pairing | Source-labeled editorial strip; shift from identity to reading |
| Announcements → current edition | Horizontal strip/rule and “下一次” link | A narrow field unfolds vertically; contour layers open and 再相聚 assembles | Quiet white field | Strong pink rebloom plus an unambiguous pending state |
| Current edition → program | Pale inner surface, compact labels, ledger rules | Visual opening settles into a short vertical timeline rule | GPU surface and monumental characters | Stable, scannable TBD state and optional fictional schedule |
| Program → visit | Rule language, calm factual copy | A curved blue field and outlined relationship loop introduce campus context | Schedule column structure | Selectable campus relationships and practical visitor rows |
| Visit → closing | Blue field and landscape vocabulary | Pink aperture expands; 春 rises into the composition | Visitor rows | Quiet return to the opening atmosphere, then practical colophon and top link |

The hero uses the same scene elements across its transition. Later seams reuse
words, shapes, alignment, and color relationships; they are not all literal
shared-element morphs. No claim of continuous 3D geography or a real campus route.

### Interaction purpose, alternative, and cost

| Interaction | Purpose | Without it | Cost / safeguard |
| --- | --- | --- | --- |
| Preserved Bloom opening and dispersal | Establish identity, then make space for the story | Resolved static artwork still gives access to every destination | Existing GSAP choreography; input/skip completes entrance; reduced motion has no runway |
| Story display transformation | Connect rooted 松 and growing 櫻 with the narrative | Both characters and meanings remain visible in a static composition | A desktop sticky stage and three decorative transforms; never animate paragraph positions/opacity |
| News seam and native disclosure | Connect story to updates and separate summary from detail | Full summary/source remain immediately available; detail can open instantly | Short mask on disclosure, native keyboard semantics, refresh scroll measurements when content height changes |
| Edition rebloom / shader | Reintroduce festival energy after the reading valley; make the opening visibly deepen | SVG preserves the composition; pending edition facts remain independent | Lazy GPU module, bounded canvas, no clock loop, complete failure fallback |
| Section-aware navigation | Show current location and provide direct access to practical information | Links still work without active state | IntersectionObserver and native anchors; five short visible destinations on mobile |
| Program disclosure | Test schedule density and additional attendee information without presenting fictional data as real | Current “待公布” state remains useful and honest | Native details; explicit fictional label before opening and inside; no animated times or rows |
| Campus relationship selection | Explain the NCU/lake/student connection | Default campus explanation remains visible | Three native pressed-state buttons; polite text update; stable reading space; diagram expressly is not a map |
| Language notice | Make unavailable translation predictable | There is no usable English edition to imply | Inline English notice, explicit Chinese return action, Escape and trigger-focus return |
| Pointer response | Make existing layers perceptibly related in depth | No content, navigation, or state is lost | Fine pointer only, small range, finite quickTo tweens / event-driven shader draws |
| Closing aperture and top link | Return to the visual world after practical reading and mark completion | Complete static closing and link remain | One decorative masked surface plus a display transform; no repeated entrance playback |

Routine UI behavior remains immediate or ≤200 ms (language 180 ms, disclosure
200 ms, nav underline 180 ms). Large scene transformations follow scroll rather
than a timed playback gate. There is no autoplay loop, sound, drag requirement,
scroll hijacking, card grid, fake countdown, or invented social proof.

### Mobile, reduced motion, and WebGL isolation

Implementation: [direction-e.tsx](../src/direction-e.tsx),
[direction-e.css](../src/direction-e.css),
[bloom-depth.tsx](../src/bloom-depth.tsx), and
[bloom-field.ts](../src/bloom-field.ts).

- 390px has a five-item persistent navigation row, portrait opening, story artwork
  in normal flow, diagonal edition title, stacked information, and an independent
  closing crop. Program and visitor text remain 14–15px with comfortable leading.
- Desktop gets five shader layers and at most 1.5 DPR; mobile gets three layers
  and at most 1 DPR. Both additionally cap output width at 1,440 and height at
  1,000 pixels. No textures, framebuffers for effects, post-processing, or asset
  downloads are introduced by this experiment.
- The shader module loads only within 180px of its scene. A separate visibility
  observer permits rendering only while the canvas host is onscreen. Scroll,
  pointer, resize, and visibility events coalesce into one requested frame. There
  is no self-rescheduling RAF and no time uniform.
- Hidden tabs cancel pending frames. Context loss permanently exposes SVG for
  that mount; context creation failure, import failure, and shader-link failure
  also retain the SVG. All text/controls are sibling DOM content, never GPU text.
- Cleanup disconnects observers, removes listeners/canvas, cancels frames, deletes
  buffers/program/shaders, and releases the context when possible. A generation
  guard prevents stale async imports from mounting after preference changes.
- Reduced motion, including runtime changes, and the explicit static control
  disable GSAP scene choreography and the canvas. Reduced initial entry does not
  request the GPU module. Static mode retains the complete reading sequence.
- WebGL lifecycle decisions follow [MDN best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
  and [context-loss guidance](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event).

### Taste / Emil / Hallmark review

| Before | After | Assessment |
| --- | --- | --- |
| Ordinary story layout after a strong opening | Oversized Chinese material and illustration persist beside stable narrative fragments | More continuity and an intentional second-screen composition |
| Muted pink and beige relationships | Clear pink, near-white pink, sky blue, stronger rose, concentrated saturated rebloom | Freshness comes from color-field proportion rather than a SaaS gradient |
| Similar section layouts and restrained footer | Story stage, editorial news strip, GPU/type peak, schedule, campus relationships, landscape closing | Distinct structures with clear peaks and reading valleys |
| Only the hero had substantial transformation | Different unfolding, assembling, dispersing, settling, and return behaviors | No repeated batch of scroll reveals |
| Campus selector color interpolation | Immediate pressed-state contrast | Fixes the measured transient contrast failure and improves feedback |

Hallmark is used as a review, not a theme generator: no switch to its unrelated
catalog “Bloom” theme; no automatic font replacement, catalog rotation, or invented
content. The user's selected Bloom study and supplied poster context govern this
iteration. No generic SaaS hero stack, equal rounded card grid, excessive pills,
glass, meaningless blobs, or testimonial/metric filler. The normal-flow calm
information areas are intentional; they are not expected to continually animate.

### Verification and measured costs

- Production TypeScript/Vite build passes. No dependencies were added.
- Reviewed opening, story states, news, edition, program, campus, and closing at
  1440 × 1000 and 390 × 844. Also checked 320, 375, 414, 768, and 1024px overflow;
  zero horizontal overflow in those checks.
- Keyboard skip moves focus to edition. Native disclosures work, English Escape
  returns focus, campus selection updates its explanation, and anchor navigation
  reaches each destination. Simulated touch swipes on story, edition, and visit
  moved native scroll by >250px. No touch gesture was captured by the artwork.
- Desktop/mobile axe WCAG A/AA checks report zero violations **after** the selector
  transition correction. Color-contrast checks over layered artwork still include
  incomplete results; this is not accessibility certification. Inspected actual
  illustrated compositions manually; real screen-reader review remains pending.
- Confirmed: initial page has no shader request, idle draw count is stable,
  offscreen draw count remains stable, desktop pointer adds a draw, touch pointer
  does not. At the tested size output is 1440 × 650 desktop / 390 × 490 mobile.
- Forced null WebGL context, blocked module request, and actual
  `WEBGL_lose_context` loss all retain the static graphic and readable edition
  ledger. Reduced initial entry has zero GPU requests/canvases. Static and runtime
  reduced mode remove the canvas. Rapid preference changes do not duplicate it.
- Opening remains resolved after full-page capture/remeasurement. Retired routes
  remain unavailable and `/motion` still opens its original Bloom study. No
  uncaught page exceptions in the review runs.

Vite-reported initial E gzip JS ≈ **123.21 decimal kB / 120.32 KiB** (entry 69.66 + shared
GSAP/art/content 47.66 + E 5.89). CSS ≈ **9.65 kB / 9.42 KiB**. Optional shader
module adds **1.93 kB / 1.88 KiB** only near the edition scene. No font or image
requests were added. Both initial JS and CSS remain within the provisional 150 /
50 KiB budgets. This does not turn the explicit decorative-motion/GPU exception
into a default requirement for future pages.

Compared with the preceding E build: about **+2.52 kB initial gzip JS**, **+2.16 kB
CSS**, plus the optional shader. GPU memory and real-device power use are not
measured. The tested desktop canvas has 936,000 pixels; mobile has 191,100.
One RGBA8 surface at those sizes represents approximately 3.57 / 0.73 MiB, **not**
a measurement of total browser/GPU memory (buffering and driver overhead differ).
The benefit of the retained shader remains a prototype judgment; static fallback
is already available if production device testing does not justify the cost.

Production diagnostic: three cold-context runs at each viewport, Chrome 154.0.8037.58 headless,
4× CPU slowdown, 40 ms network latency and 200,000 bytes/s download (local preview
serves uncompressed assets). Each run then scrolls the page over 5.5 seconds.

| Diagnostic | 1440 × 1000 | 390 × 844 |
| --- | --- | --- |
| Initial LCP median (range), seconds | 1.000 (0.976–1.012) | 0.980 (0.976–0.988) |
| Recorded CLS, all three runs | 0 | 0 |
| Longest startup task median (range), ms | 61 (60–74) | 60 (59–63) |
| >50 ms tasks recorded during the scroll exercise | 0 | 0 |
| RAF intervals >34 ms in the synthetic scroll exercise | 0 | 0 |

These are bounded lab diagnostics, not measured field INP or a promise of 60 FPS
on phones. GPU completion time is not represented by RAF timestamps. Startup still
has a >50 ms main-thread task; motion has not eliminated the framework's startup
cost. Matching the provisional header height to its responsive layout removed
the header remeasurement shift seen in the first pass (mobile ≈0.0402 CLS).

Three static/animated cycles retained exactly seven active ScrollTriggers and one
canvas in animated mode, zero of each in static mode. No growing count was observed.
Browser resources were inspected using the exact loaded Vite module identity;
an initial diagnostic imported a duplicate ScrollTrigger module and was corrected
before recording these counts.

Local evidence: `check.mjs`/`check.json`, `visual.mjs`, `lifecycle.mjs`/
`lifecycle.json`, `perf.mjs`/`perf.json`, and screenshots in
`/tmp/songying-world-review/`. These diagnostics are not an application test suite.
Physical phone/Safari, assistive-technology, field INP/CWV, GPU timing, and battery
measurements remain unverified. They are prerequisites to a production claim,
not reasons to withhold this requested prototype.

---

## Historical record — first Direction E and route cleanup

The user selected **Motion 01 — Bloom as the preferred motion-language anchor**.
The supplied reference remains the visual/taste anchor. This is not approval of a
final logo, official palette, production architecture, or complete visual system.

Open [Direction E](http://127.0.0.1:5173/e). The root `/` now redirects in the client
to `/e`. The original index and A/B/C/D implementations have been **removed** at the
user's explicit request. `/a`, `/b`, `/c`, and `/d` display an unavailable-page
message; they no longer render old prototypes. Vite's `index.html` is retained only
as the application bootstrap. [Motion Lab](http://127.0.0.1:5173/motion?study=bloom)
remains available, with its navigation updated to E.

Removed `src/exploration.tsx`, `src/exploration.css`, `src/direction-d.tsx`, and
`src/direction-d.css`; removed the old route/index components from `main.tsx`,
retired styles from `styles.css`, and obsolete direction metadata from `content.ts`.
Kept the factual/test festival dataset intact. Historical research and evaluation
records remain below; their retired routes and removed source references are not
current instructions or runnable artifacts.

### What E preserves from Bloom

The lab's artwork and entrance were extracted without redesign into
[bloom-art.tsx](../src/bloom-art.tsx) and [bloom-motion.ts](../src/bloom-motion.ts),
shared by `/motion` and `/e`. Preserved characteristics:

- Iris opens from `ellipse(9% 34%)` to `ellipse(85% 100%)` in 1.55 s.
- Two graphic shutters separate by 110% and rotate ±16° over 1.45 s.
- Characters begin compressed to 0.35× width, displaced by 80%, and rotated ±24°;
  they assemble over 1.2 s with 80 ms spacing, starting 250 ms into the sequence.
- Botanical fragments begin at 0.45× scale, 90% vertical displacement, and ±80°
  rotation, entering over 1.35 s with 100 ms spacing. Full sequence ≈1.7 s.
- `power3.inOut` coordinates the fields; `power3.out` resolves the typography.
- Lavender sky, pink ground, dusty rose type, original illustrative silhouettes,
  and foreground/background separation remain the visual anchor.

E adds a short identity-label reveal without extending the main entrance. Wheel,
pointer interaction, keyboard navigation, and the skip button complete it
immediately. The entrance does not replay merely because layout is recalculated;
only first entry and explicit Replay request it. The lab remains a reference,
including its original four studies and scroll behaviors.

### Full experience and motion vocabulary

Implementation: [direction-e.tsx](../src/direction-e.tsx) and
[direction-e.css](../src/direction-e.css).

| Vocabulary | E application | Purpose / intensity |
| --- | --- | --- |
| Bloom in | Preserved iris and foreground entrance | Establish the festival visual world; strongest motion |
| Assemble | Original three-character choreography | Form the festival name from coordinated pieces |
| Disperse | Separate wrappers carry characters outward as foreground layers leave | Make room for story without competing with entrance transforms |
| Unfold | Story window opens within the same pink field; native announcement disclosure uses a short clip reveal | Hero-to-story continuity, then a much smaller detail interaction |
| Settle | Pink story ground gives way to a quiet paper information ledger | Lower visual density and movement as information becomes practical |
| Respond | Navigation underline grows in 180 ms; language availability opens in 180 ms; announcement detail in 220 ms | Small local feedback, without miniature hero sequences |

Native scrolling drives the sticky hero-to-story composition with 350 ms scrub
smoothing. It does not hijack, snap, or auto-scroll the page. Large title pieces
move apart; a pink field and story statement take their place. The actual story
then follows in normal flow: name meanings, campus connection, and clearly dated
2026 history. Story reading text is never hidden behind a scroll trigger. Its one
additional scroll effect is a growing divider, not a batch of fade-up reveals.

Edition facts, source-labeled test announcement, visitor guidance, and a deliberately
labeled fictional attendance example complete the experience. Practical text is
static. The example opens only on request. No performers, future dates, venues,
registration rules, sponsors, or other unsupported event details were invented.

The information-access link stays visible in the key visual, alongside persistent
navigation and a keyboard skip link. English explicitly explains unavailability,
with a Chinese-content return action, Escape handling, and trigger focus return.

### Mobile, static interpretation, and asset roles

At 390 px the name forms a staggered portrait composition; foreground crop,
landscape scale, identity label, navigation row, and quick-information access are
recomposed. The Bloom opening remains. Meaning/history sections, edition ledger,
and attendee rows become a single-column reading sequence.

Reduced motion or static preview shows the resolved hero immediately, removes the
sticky runway and scroll choreography, and retains all story and practical content.
No endless effects, WebGL, Canvas, custom cursor, or pointer-only functionality.
Keyboard-driven small disclosures/feedback avoid CSS animation.

The sky/landscape and foreground frames are replaceable roles for approved festival
illustration or campus imagery. Story passages can later accommodate approved
photography and student work without making facts part of an image. Current SVGs,
font treatment, and colors remain explicitly temporary; none is official branding.

### Taste / Emil / Hallmark review

| Before / observed risk | Result / correction | Why |
| --- | --- | --- |
| Lab separated a motion scene from its readings | E disperses the same composition into a story field before practical information | Evaluate continuity at website scale |
| Entrance and scroll could compete over character transforms | Nested character wrappers separate ownership | Preserve the chosen entrance and allow reversible dispersal |
| Layout changes could replay an already-completed entrance | Completed entrance is remembered until explicit Replay | Avoid interrupting reading on resize or remeasurement |
| Experimental gestures could spread into every section | Motion tapers to native disclosure and stable practical rows | Information clarity has priority |
| Retired prototypes remained in navigation and bundles | Removed old code/routes/styles and index; updated remaining links | Honor the new scope and avoid stale entry points |

Taste: large Chinese display remains the identity element, with a calmer body
measure and increasing information density. Hallmark: no centered SaaS stack,
rounded card grid, glass, gradient text/blob field, pill navigation, invented proof,
or repetitive reveal system. Emil: entrance has an explicit bypass, transitions
preserve spatial meaning, routine state updates stay immediate, and reduced motion
has a complete composition. These are prototype judgments, not final acceptance.

### Validation

- TypeScript/Vite production build passes.
- Inspected 1440 × 1000 desktop and 390 × 844 mobile: settled opening,
  intermediate/end scroll transition, story/information layout, and reduced motion.
- No horizontal overflow at 320, 375, 390, 414, 768, or 1440 px in route checks.
- Axe A/AA checks at desktop/mobile reported zero violations. Illustrated overlap
  still causes incomplete automated contrast checks; it is not a full accessibility
  certification. Functional text and controls were separately visually reviewed.
- Announcement and fictional-example disclosures operate; English Escape returns
  focus; keyboard skip targets the edition section. Replay/skip and mid-session
  reduced-motion changes work. Settled iris remains open across full-page
  screenshot/viewport remeasurement after the replay correction.
- Root resolves to `/e`; A/B/C/D show unavailable; source scan found no legacy
  prototype classes/imports/index or live links to those routes. `/motion` still
  starts with Bloom and has no links to D. No page exceptions in the route checks.

Build gzip sizes (decimal kB): entry JS 69.65, shared motion/art/content 47.66,
E JS 3.38; E total approximately **120.69 kB**. Entry CSS 0.84, shared lab/art CSS
3.63, E CSS 3.02; total approximately **7.49 kB**. Old A/B/C/D code is no longer in
the bundle. No new dependency was required for E; it retains the approved GSAP
choreography. Shared CSS still includes the separate lab's study styles, which is
acceptable for this disposable experiment rather than production architecture.

Two local production diagnostics (1440 and 390 px, Chrome, 4× CPU throttle,
no network throttle) observed the entrance and stepped native-scroll transition
without >50 ms tasks in those windows. These are single-run diagnostics per size,
not FPS guarantees or a field-performance certification.

Real-device scrolling/GPU behavior, screen-reader review, real artwork load cost,
and final font coverage remain unverified. Large masks and layer scaling still
have a painting/compositing cost; removing the old prototypes is not a claim of
field Core Web Vitals compliance. QA evidence lives in `/tmp/songying-e-review/`.
DESIGN.md, PRODUCT.md, RESEARCH.md, INTERACTIONS.md, and PERFORMANCE.md are unchanged.

---

## Motion Lab — Earlier experiment, retained as reference

Open [Motion Lab](http://127.0.0.1:5173/motion). This is a separately authorized,
disposable investigation of behavior, not a polish pass on D, a production
architecture, or selection of a motion direction. A/B/C remain rejected; D and
DESIGN.md are unchanged. The user explicitly requested a more ambitious experiment
than earlier restraint-first prototypes.

Implementation: [motion-lab.tsx](../src/motion-lab.tsx),
[motion-lab.css](../src/motion-lab.css), and lazy route wiring in
[main.tsx](../src/main.tsx). Added `gsap` 3.15.0 and its bundled ScrollTrigger plugin;
no Motion, WebGL, Canvas, map library, or external asset service.

### Shared art direction and controls

The user's supplied image remains the taste anchor: lavender/pale blue, dusty
rose, warm pink, heavy Chinese type, quiet atmospheric space, and illustrated
foreground/background relationships. Original vector botanical paper fragments,
a symbolic landscape, and abstract poster layers are temporary lab material.
They do not trace the reference illustration, constitute an official logo, or
represent exact campus geography. Festival facts still come from shared content;
future details remain pending.

The four named buttons switch studies without changing the product. Direct links:

- [01 Bloom](http://127.0.0.1:5173/motion?study=bloom)
- [02 Layers](http://127.0.0.1:5173/motion?study=layers)
- [03 Type](http://127.0.0.1:5173/motion?study=type)
- [04 Play](http://127.0.0.1:5173/motion?study=play)

Replay restarts the current experiment; skip-entrance completes the initial
sequence immediately. Static preview removes the scroll runway and presents a
complete still composition. OS reduced motion overrides normal motion. Content
links and a keyboard skip link bypass the experiment to persistent, ordinary
festival readings. There is no loading gate, automatic scrolling, snapping,
scroll-jacking, sound, cursor trail, or perpetual ambient loop.

### 01 — Bloom

**Principle:** reveal by opening a composition, not by fading a page upward.
A narrow iris, two folding fields, compressed/rotated characters, and entering
botanical fragments unfold into a large spring scene. Continuing to scroll opens
its spacing and scale and changes the relationship between sky and rose ground.
Native reverse scrolling reverses the second phase.

**Distinctive:** the frame itself opens; letters and near/far pieces have different
origins and timing. Pink is initially a closed field, then a boundary around sky.
The entrance lasts approximately 1.7 seconds, not an indefinite preloader.

**Excess:** the mask can dominate the experience; the enlarged final letters crop
at the edge; foreground botanical pieces can compete with the name. These are
intentional stress tests, not automatically acceptable production behavior.

**Could survive:** one shorter first-visit opening, a single layer crossing, or a
compact masked key visual. A repeat visitor should be able to reach information
without replaying a long spatial sequence. No production selection is made here.

**Desktop:** broad diagonal type, large off-frame leaf shapes, iris/folding entrance,
and reversible ScrollTrigger composition over a native CSS sticky scene.
**390 px:** type is rearranged into a staggered portrait composition; the same iris,
expansion, cropped fragments, and scroll response remain.
**Reduced motion:** complete open scene, no entrance/ScrollTrigger/runway; direct
links still reach the same readings.
**Likely cost:** the large animated `clip-path` can repaint; transform scale expands
layer raster bounds. No blur, animated image, or per-frame React state. GSAP owns
the sequence; the scene is bounded and disposable.

### 02 — Layers

**Principle:** move through a flat illustrated poster using several independent
planes. Background scenery, festival typography, and foreground paper fragments
travel at different rates. The entrance assembles these planes from different
edges; scrolling changes their relative scale and offset.

**Distinctive:** mouse position affects near and far wrappers differently while
scroll controls separate parent wrappers, so the two inputs do not fight over one
transform. The foreground can cross the type. This is composited 2D, not a fake
3D campus model.

**Excess:** 100 px pointer travel on the nearest plane, enlarged foreground shapes,
and overlap can obscure too much of the festival name. The depth controls make
this excess inspectable rather than hiding it behind a mouse-only interaction.

**Could survive:** a reduced range of pointer depth in the key visual and one
foreground transition. Readable information should remain on a stable plane.

**Desktop:** pointer offsets use reusable `quickTo` tweens with a 650 ms ease-out
response; leaving the scene recenters them. Scroll travels through layers. Far /
closer / foreground buttons adjust composition over 800 ms.
**390 px:** portrait type and scene crop are recomposed; depth buttons and scroll
retain the concept without requiring hover or device orientation.
**Reduced motion:** no pointer/scroll/entrance movement; depth buttons change their
selected state and composition immediately.
**Likely cost:** several large composited surfaces plus short simultaneous
transforms. No global pointer loop, continuous physics, or per-frame React state;
mouse bounds are read on entry and tweens are reused.

### 03 — Type

**Principle:** characters become interface objects. Upper/lower clipped character
halves enter from opposite directions, assemble, then the large characters shrink
and relocate through scroll. Reading labels and small descriptions resolve below
them; each character is a real destination link throughout.

**Distinctive:** the same type units perform identity and navigation roles. The
transition exposes a path from expressive opening to useful content rather than
adding movement to an otherwise unchanged heading.

**Excess:** splitting characters can interrupt recognition; extreme initial scale
and the long scroll runway may feel like work on repeat visits. The horizontal
split is visibly artificial and should not be mistaken for commissioned lettering.

**Could survive:** a shorter giant-title-to-section-anchor transition with full
character forms and normal destination labels available sooner.

**Desktop:** approximately 1.5-second opposing-half entrance; scroll interpolates
from 3.1× characters into a three-destination reading system.
**390 px:** starts at 2.6× smaller base glyphs so the horizontal title fits; the
three compact links remain usable and descriptions wrap below them.
**Reduced motion:** shows the final compact link system and descriptions with no
scrub or entrance. The same content also exists below the scene.
**Likely cost:** six clipped glyph halves plus transform/opacity timelines; dynamic
clip reveal for descriptions, but no font-size, width, or letter-spacing animation.
A future actual display font would add a separate loading and shaping cost.

### 04 — Play

**Principle:** let the visitor influence a poster's arrangement. A botanical paper
fragment can be moved within a bounded area; its tilt and nearby character angles
respond to placement. Selecting a large character changes a stable explanatory
passage. The movement acknowledges authorship of the composition, not game progress.

**Distinctive:** a direct manipulation experiment rather than another scroll
sequence. Positions are ephemeral; nothing is collected, unlocked, scored, or saved.

**Excess:** arranging a paper fragment is optional expression, not an attendee
need. Arbitrary placements can cover part of a character. The default resting
position was corrected to keep the middle character's click target available.

**Could survive:** small tactile type feedback or a very limited optional poster
interaction. Free dragging should not reach production unless user testing gives
it a clear communication role; it must never gate essential information.

**Desktop:** drag uses pointer capture and bounded `quickTo` movement; title hover
uses CSS, and selected meanings update immediately. Position buttons give explicit
left/center/right arrangements. Arrow keys move the focused fragment by 32 px;
Home centers it. Keyboard placement is immediate and a concise status announces
its position on completion.
**390 px:** smaller fragment, staggered type, touch dragging, and all three position
buttons. Only the fragment owns `touch-action: none`; the surrounding page scrolls
normally. Real touch events were tested through Chrome's input protocol.
**Reduced motion:** placement and reading changes remain immediate; no springy
movement, letter tilting, or hover animation is necessary to use the study.
**Likely cost:** a few reusable tweens during active input and one small static
shadow. No free-running simulation, inertia loop, or pointer trail.

### Engineering and interaction review

GSAP is justified by shared timeline control, opposite-direction glyph masking,
reversible scroll choreography, coordinated layers, and interruptible pointer
responses. Simple hover/press states remain CSS. Native CSS handles the sticky
frames; ScrollTrigger controls children without intercepting wheel or touch scroll.

Setup is scoped through `gsap.matchMedia`; preferences, breakpoint changes,
static preview, study switching, and replay revert the old context. Event listeners,
observers, captured pointers, and programmatic tweens are cleaned up. Scroll and
pointer transforms have separate wrappers. Ordinary keyboard navigation completes
entrances; explicit Replay remains an intentional request to see the experiment.

| Before inspection | After inspection | Reason |
| --- | --- | --- |
| Iris opened against the same sky value | Closed field is pink, opening reveals sky | Make opening legible as an art-direction change |
| Layers caption crossed dark foreground | Caption has a stable paper reading surface | Keep functional text readable amid experimental occlusion |
| Type's lower caption faded to low contrast | Caption stays fully opaque | Subordination should not make text illegible |
| Play's default fragment covered a character click target | Lower, smaller mobile resting position | Support reading and arranging at the same time |
| General button touch rule overrode the fragment | Scoped `touch-action: none` on draggable surface | Prevent native pan from cancelling an intended drag while retaining page scroll elsewhere |
| Toolbar height could change scroll calculations | ResizeObserver refreshes ScrollTrigger after layout | Keep mobile endpoints aligned without polling |

### Verification and limits

Ran all four studies at **1440 × 1000** and **390 × 844** in Chrome. Inspected
entrance, settled, intermediate-scroll, end-scroll, and reduced-motion screenshots.
Tested skip entrance, replay/switching, native content links, pointer depth, depth
buttons, character selection, placement buttons, keyboard placement, and dragging.
A synthetic touch drag completed at `translate(72px, -24px)` with a right-side
position announcement after the touch-rule correction.

Axe A/AA checks on all eight desktop/mobile end states reported **zero violations**.
Bloom, Layers, and Play still produce incomplete checks for overlapping art/text;
these are not automatic passes. Plain controls/readings use strong text pairs.
Intentional display-type occlusion remains an explicit experiment risk, not a
claim of full visual-accessibility compliance. No real screen reader or physical
phone was available for this pass.

Also checked 320, 414, and 768 px with reduced motion: no horizontal overflow.
Reduced motion removes sticky runways and leaves all readings/controls available.
Repeated three-cycle switching left consistent ScrollTrigger counts (Bloom 1,
Layers 1, Type 1, Play 0) and stable timeline-child counts (15/22/13/8 respectively)
in the observed setup snapshots, rather than accumulating old studies. Reduced
motion left zero ScrollTriggers. No page exceptions in the interaction pass.

Build passes TypeScript and Vite. Route-level lazy loading keeps the approximately
**50.36 kB gzip** motion JS chunk (including GSAP/ScrollTrigger) off A/B/C/D routes.
Shared JS is **80.46 kB gzip**; combined lab JS is approximately **130.82 kB gzip**.
Shared CSS is **12.84 kB gzip**, plus approximately **3.63 kB gzip** for the lab.
Values use Vite's decimal kB. No external images, fonts, or media downloads added.
These experiments expressly exceed the default 0 KiB decorative-JS preference;
the user authorized evaluating a motion engine. Permanent budgets are unchanged.

One local production diagnostic per study: Chrome 154.0.8037.58, 390 × 844, 4× CPU
throttle, no network throttle. Observed load plus scroll/placement windows reported
no >50 ms tasks. CLS observations: Bloom 0.0290, Layers 0.0211, Type 0.0123,
Play 0.0033. These are narrow lab observations, not field CWV, an FPS guarantee,
a three-run performance certification, or real-device battery/GPU evidence.
Masks and large composited layers still need profiling on actual target phones.

Evidence and disposable scripts are in `/tmp/songying-motion-review/`.
No motion direction is chosen. Direction D and DESIGN.md remain unchanged.

---

## Direction D — Earlier experiment, unchanged by Motion Lab

Open D — Spring landscape（已移除：`/d`）.
Implementation: `direction-d.tsx`（已移除） and
`direction-d.css`（已移除）, routed through [main.tsx](../src/main.tsx).
Full rationale and interaction checks: [DIRECTIONS.md](DIRECTIONS.md#direction-d--spring-landscape--illustrated-typographic-world).

### Hypothesis

A soft illustrated spring world and emphatic Chinese typography can establish a
recognizable opening, while a continuous ground plane leads into a much clearer
information system. This is a new reference-led direction, not an A/B/C blend.

The supplied recruitment-poster image informs color relationships, visual mass,
calm space, and layered depth. The screenshot, source lettering, floral rendering,
hand, sparkle, and composition are not copied or embedded. Visible poster text
is not used to confirm an edition, date, or recruitment announcement.

### What the prototype contains

- A staggered, three-character desktop composition; a different two-column
  portrait arrangement. Chinese display uses heavy local system type rather than
  claiming a new logo or the reference's unidentified typeface.
- Temporary lavender-blue, warm pink, dusty rose, muted purple, and off-white roles.
  Darker text pairs preserve legibility; pink is expressly authorized for D.
- One original SVG lakeside illustration, with distant scenery, people, path,
  water, and a foreground flowering branch. It is labeled a prototype creation,
  not official art, real NCU architecture, or navigable campus geography.
- Ground color continuing into the edition-status ledger, followed by an off-white
  news/visit reading area. A local sticky navigation appears in document flow.
- The same source-labeled test announcement, pending facts, historical 2026 story,
  and honest English-unavailable notice used in earlier prototypes.
- A labeled test selector beside practical information exposes the existing
  fictional attendee fixture. No future dates, places, or programs are invented.

Illustration layers can be replaced without replacing semantic text/navigation.
Approved artwork may change the visual result considerably; this does not establish
its final quality, palette, or licensing. Final branding remains pending.

### Motion and interaction

| Behavior | Purpose | Implementation / fallback |
| --- | --- | --- |
| Title assembles once, scenery settles | Establish type order and near/far layers | Small transform-only entrances: type 720 ms with 60 ms offsets; scene 850 ms. Essential content never starts transparent or waits to unlock |
| Leaving the opening slightly displaces the scene | Maintain continuity toward the information area | IntersectionObserver threshold, 18 px / 650 ms; no per-frame scroll handler, no pinned content |
| Information-link arrow responds to hover | Acknowledge the destination | 4 px / 220 ms, fine pointers only; no hover-only content |
| Native links, announcement disclosure, language notice | Reach content, reveal detail, state translation availability | Shared semantic components, immediate state and focus behavior; no new animation dependency |
| Static-mode review switch | Compare the composition without movement | Immediate CSS cancellation and observer cleanup; OS reduced motion takes precedence |

Keyboard input cancels current movement and disables transitions. Reduced-motion
changes during playback produce a complete static result. Turning static mode off
permits the entrance again for comparison. No continuous loop, parallax tracker,
particle system, repetitive scroll reveal, GSAP, Motion, Canvas, or WebGL.

The single observer is a small documented exception to the default 0 KiB decorative
animation-JS preference in PERFORMANCE.md: it supports the user-requested bounded
scene transition. Its code is included in the bundle totals, not separately sized.
A purely static rendering remains complete and can replace this behavior.

### Taste / Hallmark / Emil review

| Before review | After review | Why |
| --- | --- | --- |
| Mobile character crowded the right edge | Bounded two-column tracks, reduced portrait type size | Keep the complete festival name readable while retaining scale |
| Vector ground ended in a rectangular edge | Ground paths extend through the frame and into the pink transition | Preserve the landscape composition instead of exposing an asset rectangle |
| Portrait crop excluded the people | Reframed scene and independently offset foreground | Mobile interprets the scene instead of shrinking the desktop view |
| History label contrast 3.93:1 | Darker muted text, approximately 4.98:1 on sky | Ordinary text needs 4.5:1 |
| Comparison links below 24 px wide | Minimum 26 px link width | Remove small-target failures |
| Display rose too close to distant ground value | Darkened display rose | At least 3:1 where large type crosses the landscape |

Hallmark self-review (judgment, not a measured quality score): Philosophy 4,
Hierarchy 4, Execution 4, Specificity 4, Restraint 4, Variety 4. No centered SaaS
hero, generic feature cards, pill CTAs, glass, gradients, unrelated blobs,
repetitive reveals, or fabricated factual claims. The large field and system-font
experiment intentionally follow the user's brief rather than a preset palette or
font mandate. The ground curve has a landscape and section-transition role.

The illustration remains the weakest evidence: simple vector scenery establishes
layer roles but cannot validate the craft of future commissioned art. The opening
is also tall on mobile. Direct navigation and the information link mitigate that
cost; actual attendee task testing should determine whether it needs shortening.

### Verification performed

- `npm run build`: TypeScript and Vite production build passed.
- Desktop 1440 × 1000 and mobile 390 × 844 screenshots inspected, including full
  page, typography, and the key-visual/information boundary. Rechecked after fixes.
- Widths 320, 375, 390, 414, 768, 1440, and 1920: no document horizontal overflow,
  missing local anchor targets, or active entrance animations after settling.
- Automated axe WCAG A/AA checks at 390 and 1440, both pending/attendee scenarios:
  zero reported violations after fixes. Layered SVG/type produced incomplete
  contrast checks; these are not automatic passes. Actual text/background token
  pairs and visible overlaps were reviewed separately. Large rose type exceeds
  3:1 over the tested sky/ground; body text uses darker purple.
- Announcement disclosure, English notice Escape/focus return, information-anchor
  focus, skip-link activation, attendee scenario, and static switch checked.
- Five entrance animations observed under normal motion; zero running animations
  after switching to reduced motion. Scene transform becomes `none`; keyboard
  input stops motion and the skip link focuses the information section.
- No page exceptions in the route checks. This is not a screen-reader certification.

### Performance review

No packages, image requests, external fonts, third-party requests, or continuous
animation work added. SVG paths are part of the JS bundle. Current shared build:
JS **79.64 kB gzip**, CSS **12.84 kB gzip**, HTML **0.44 kB gzip** (Vite decimal kB).
Previous pass: JS 76.74 kB, CSS 10.08 kB gzip. Increase includes D's component,
artwork, styles, and bounded motion; code splitting is not claimed. A/B/C source
is preserved, although the shared bundle now includes D.

Three cold-context local production samples: Chrome 154.0.8037.58, 390 × 844,
4× CPU throttle, cache disabled, 150 ms network latency, 200,000 B/s download,
93,750 B/s upload. Observed LCP: **892–928 ms, median 896 ms**; CLS **0** in all
three; no >50 ms tasks reported in the observed load windows; no active animation
after the tested transition settled. Encoded resource bodies reported 78,505 B
JS and 12,793 B CSS; compression differs from Vite's gzip estimate.

These are local lab observations, not field Core Web Vitals or real-device results.
INP, screen-reader behavior, iOS/Android GPU performance, font differences, full
English localization, commissioned-asset load cost, and actual attendee success
remain unverified. The current bundle is below the provisional JS/CSS ceilings;
future artwork must be budgeted again.

Review evidence is outside the project in `/tmp/songying-d-review/`: screenshots,
`verification.json`, `perf.json`, and temporary browser scripts. It is disposable
QA evidence, not a new test-suite dependency.

### Scope and disposition

DIRECTIONS.md records this as an exploratory addition. DESIGN.md, PRODUCT.md,
RESEARCH.md, INTERACTIONS.md, PERFORMANCE.md, and AGENTS.md are unchanged.
No final direction, logo, official palette, publication copy, or deployment chosen.
A/B/C remain accessible; their evaluation below is historical.

---

## Earlier A/B/C second-pass record — rejected directions

## Run and compare

```sh
cd /Users/fearnot/Desktop/website
npm install
npm run dev -- --port 5173 --strictPort
```

- [Index](http://127.0.0.1:5173/) — testing utility, not a fourth festival design.
- A — Editorial / Cultural（已移除：`/a`）
- B — Campus / Spatial（已移除：`/b`）
- C — Student / Experimental（已移除：`/c`）

The top toolbar switches discovery/attendee scenarios and preserves the scenario
when changing direction. B can hide its relationship explorer; C can reduce
compositional irregularity. `?mode=attend` opens the attendee simulation directly.
These are testing controls, not proposed production features.

`npm run build` checks TypeScript and builds the application. No new dependencies
were added in this pass. React, TypeScript, and Vite remain the small prototype setup.

## What changed from the first pass

The first pass established reading order but was too restrained for a meaningful
visual comparison. The second pass explores color fields, stronger Chinese
composition, local depth, and distinct interaction behavior without changing the
approved product or information architecture.

| Area | First pass | Second pass |
| --- | --- | --- |
| A | Large serif title and asymmetric text columns | Split Chinese title, vermilion editorial field, ink-colored reading spread, two-part name reader, sticky reading context |
| B | Pale page with a list-based conceptual diagram | Saturated blue arrival field, dark wayfinding rail, connected planar subjects, moving selection frame and directional reading transitions |
| C | Offset title characters and irregular passages | Interactive Chinese title, sulfur-yellow/violet fields, tactile letter responses, linked composition changes, bounded overlapping passages |
| Common behavior | Native links and mostly static disclosures | Animated announcement opening, trigger-related language notice, responsive navigation underline, attendee topic links with selected context |
| Motion | Effectively none | Purposeful state transitions; no ambient loops or generic scroll reveals |

[Shared content](../src/content.ts) is unchanged. Dates, venues, programs, and
requirements for a real next edition remain unannounced. The historical 2026 account
is explicitly labeled as ended. Sample announcement copy, its test date, and the
fictional attendee slot/location remain labeled as prototype data.

The color systems are **temporary composition experiments**, not official 松櫻祭
colors. The festival name is typeset text, not a new logo. No photography, official
artwork, or imaginary campus geography has been invented. No palette is derived
from “cherry blossom = pink” or “pine = green.”

Changes live in the prototype components and styles, especially
`exploration.tsx`（已移除） and `exploration.css`（已移除）.
PRODUCT.md, RESEARCH.md, DIRECTIONS.md, DESIGN.md, INTERACTIONS.md, PERFORMANCE.md,
and AGENTS.md remain unchanged. The user's explicit second-pass permission to explore
larger color fields and motion governs these disposable experiments; it does not
amend permanent project rules.

## A — Editorial / Cultural

### Hypothesis and what it tests

A cultural reading experience can be visually forceful while keeping a deliberate
reading order. The typography now has a split, oversized Chinese title rather than
a conventional horizontal masthead. A vermilion text field and dark historical
passage create changes of emphasis without imagery. Ink, warm paper, and print-like
color contrast are a temporary conceptual palette, not an official identity.

The “讀松 / 讀櫻” reader connects a large character to its explanation. Switching
changes the character within a bounded field and brings the new explanation into
place. A sticky contents strip indicates the current story/news/visit context and
provides immediate links. The initial navigation duplication was removed.

### Strongest aspect

The direction now has both a visual voice and a distinct reading behavior. The
name's two ideas can be experienced sequentially; strong color contrasts separate
the introduction, history, and practical content without adding illustrations.

### Weakest aspect

The opening is intentionally expansive, and the two-part reader makes reading both
meanings an explicit action. A plain paired-text version would be quicker for some
visitors. The editorial form could still feel overly formal or consume too much
mobile space.

### Unresolved questions

Does the composed sequence deepen understanding or simply slow it? Is the large
color field useful emphasis over repeated visits? How much of the spread should
survive once real festival materials arrive? These need user evaluation, not a
preference inferred from implementation quality.

### Interaction rationale

The reader's movement explains a change of subject; the next control makes the
sequence explicit. Removing motion retains all functionality, but reduces the
connection between the displaced character and its explanation. The reading-context
strip supports orientation and fast jumps, not a forced reading path.

### Mobile behavior

The split title becomes one readable line. The colored introduction becomes a
full-width reading field. Reader controls remain above the character and explanation,
which stack vertically. The sticky contents strip stays compact; anchor offsets
keep targets below it. Attendee mode still compresses the opening and moves Visit
before the story in document order.

### Accessibility concerns

Reader buttons expose their selected state; the explanation has a polite, atomic
announcement. Both meanings remain available without hover. Keyboard operations are
immediate, focus is never delayed, and reduced motion changes the content in place.
The large visual character is redundant to the accessible explanation. System-font
variation and real screen-reader output remain untested.

### Performance concerns

The short opening composition uses transforms without hiding essential content.
Reader glyphs use transform/opacity transitions; text uses a small cancellable
browser animation. One IntersectionObserver tracks reading context and disconnects
on unmount or scenario change. No per-frame scroll handler, font download, or media
asset is introduced.

## B — Campus / Spatial

### Hypothesis and what it tests

A planar relationship explorer can communicate orientation through selection and
continuity. Saturated blue identifies the arrival area; deeper blue holds navigation
and the conceptual field; pale reading surfaces distinguish explanation from selection.
The selected subject has a light, high-contrast marker and an explicit current label.

The connected subjects are campus, lake history, and student participation. The
explorer is **not a map** and is labeled accordingly. Geometry does not claim
physical direction, distance, access, or a future venue. “學生參與” is a conceptual
subject, not an invented physical site.

### Strongest aspect

Selection, its outline, the connection segment, and the associated text move together
as a coherent change of context. Previous/next controls make the relationship
sequence explorable without requiring diagram interpretation. Arrival links select
the corresponding subject rather than all leading to a generic default.

### Weakest aspect

This tests spatial communication of relationships, not real-world wayfinding. The
explorer still adds interface and vertical space compared with a plain list. A
moving selection frame does not itself prove that geography is useful to attendees.

### Unresolved questions

Does connecting these subjects improve recall or orientation? Would verified venues
justify a more literal spatial view later? Does the strong wayfinding presentation
feel like a festival or an institutional directory? The list-only toggle keeps a
simpler comparison available.

### Interaction rationale

Selecting a node updates the current subject immediately, moves a selection frame,
draws the associated connection, and transitions the explanation in reading order.
Removing animation preserves selection and content; removing the entire explorer
leaves the same passages as a list. A native “閱讀所選內容” link provides a direct
jump to the explanation on mobile. No camera flight, dragging, zoom, location access,
or simulated physical travel is required.

### Mobile behavior

The rail becomes ordinary top navigation. The diagram stacks above the explanation;
its labels remain readable, and the direct reading link avoids searching below the
field. The geometry is bounded, with enough inset for focus and selection indicators.
No part of the diagram requires horizontal scrolling. Schedules and important
information remain independent of the explorer.

### Accessibility concerns

The explorer is a named group. Buttons expose selected state; the current subject is
also written in text. Previous/next controls are named, and the explanation updates
politely. A full list can replace the explorer. Reduced motion retains current
geometry and immediate content changes. Keyboard input cancels active motion rather
than waiting for a transition.

### Performance concerns

The implementation uses a small inline SVG for conceptual connections, CSS for the
selection frame, and a short browser animation for the explanation. The connection
stroke briefly repaints a bounded SVG; it is not assumed to be compositor-only.
There is no map SDK, Canvas, WebGL, texture, video, or continuous render loop.

## C — Student / Experimental

### Hypothesis and what it tests

Chinese type can be an interactive reading surface rather than a passive heading.
The title's three characters are explicit controls: roots, new ideas, and participation.
Choosing a character changes emphasis and slightly redistributes the composition;
its meaning appears in a violet reading field. Sulfur yellow, dark violet, and pale
material fields explore high-contrast overprint relationships, not plant symbolism.

Lower story passages use controlled overlap and unequal alignment on desktop.
There are no fake student signatures, invented artwork, decorative stickers, or
permanent claims about the festival's brand.

### Strongest aspect

The direction is materially different at first glance and responds to an understandable
act of reading. It demonstrates expression without requiring artwork. The title has
visible control captions, a selected state, and an explanation, rather than merely
reacting to the pointer for decoration.

### Weakest aspect

Its intensity and large title can dominate the first visit. The keyboard and
reduced-motion experience deliberately uses less motion, so expression must survive
through composition and color alone. Student authorship is still a hypothesis, not
a claim that these graphics came from students.

### Unresolved questions

Does interacting with a character encourage reading or distract from festival
information? Is the chosen degree of irregularity sustainable across bilingual
content and future materials? Could some visitors find the large yellow field tiring?
The restrained-composition toggle remains available for comparison.

### Interaction rationale

Hover response is restricted to fine pointers and communicates that a character is
pressable. Activation updates its meaning and retargets the neighboring composition.
Removing hover preserves clear buttons and touch operation; removing the transition
preserves the same reading relationship. There is no cursor replacement, pointer
tracking, random animation, drag puzzle, or perpetual type movement.

### Mobile behavior

Character controls fit the screen and retain smaller, bounded offsets. The meaning
panel becomes a single reading block. Overlap is removed from story passages while
some indentation remains. In attendee mode the interactive title is replaced by a
compact noninteractive heading, so no control points to a hidden reading panel.

### Accessibility concerns

The title has one accessible heading; each character control has a complete name
and selected state. Reading updates are polite and atomic. Redundant display glyphs
are hidden from assistive technology. The reading order stays stable despite desktop
rotation. Reduced motion removes the kinetic offsets while preserving color and
selection. Cognitive load and real-device touch feel still need human testing.

### Performance concerns

Expression uses static color fields and bounded transform transitions. No per-frame
pointer events, physics engine, images, filters, or animated textures are used.
The low-contrast caption found on the violet field was corrected by darkening the
supporting-text token.

## Motion and interaction contract for this experiment

These are implementation descriptions, not updates to INTERACTIONS.md.

| Interaction | PURPOSE | WITHOUT IT | COST / current implementation |
| --- | --- | --- | --- |
| A opening type placement | Establish composed editorial hierarchy on arrival | Static arrangement remains complete | One short transform sequence, 580ms with a 70ms offset; no hidden essential text or navigation gate |
| A name reader | Connect each character to its meaning | Immediate change works; simultaneous text is a useful future comparison | Glyph transitions 280ms; explanation 220ms; selected buttons and polite announcement |
| A sticky reading context | Preserve orientation and direct access | Ordinary navigation still works, but less current-position feedback | One observer; 240ms underline state; no scroll interception |
| B subject selection | Explain which relationship is being examined | Static selection remains usable; list mode removes the entire diagram | CSS selection frame 280ms, explanation 260ms, bounded SVG stroke 420ms; all cancellable or preference-gated |
| B previous/next and reading jump | Explore the actual three-subject sequence or reach its text | Diagram buttons/list still work | Named native buttons and a native anchor; no camera controls |
| C character response | Reveal meaning and make the selected reading subject tangible | Plain button state and immediate text work | Transform transitions 260ms, explanation 220ms; hover gated to fine pointers |
| Announcement disclosure | Separate scan summary from detail and show the revealed relationship | Expanded plain text remains valid | Native details/summary; 220ms local content entrance, 200ms disclosure symbol; no animated height |
| Language notice | State missing English availability and connect notice to trigger | Static notice is equally functional | Existing disclosure, 180ms anchored entrance, Escape and focus return; still no fabricated translation |
| Attendee topic links | Locate timing, transport, or participation guidance in the visible list | Normal reading remains possible | Native anchors, selected underline and row emphasis; all guidance remains present |
| Scenario/variant testing controls | Compare hierarchy or composition | Comparison becomes less direct | Local state only; no persisted profile, backend, or production feature implied |

CSS handles finite state transitions; the browser animation API handles the small
interruptible explanation transitions. Installed GSAP guidance was reviewed, but no
complex timeline or scroll choreography justified its cost. No animation library
was added. Color changes are local; no whole-page animated color wash exists.

Rapid selection cancels the previous explanation animation. Keyboard input cancels
running animations and applies state immediately. Preference changes to reduced
motion cancel the active browser animation; CSS motion also stops. Selected content,
focus, controls, and labels do not depend on animation completion.

## Review: Taste, Hallmark, and Emil principles

- **Taste:** reviewed hierarchy, Chinese display/read/utility roles, alignment,
  section rhythm, meaningful density, and mobile recomposition. Color fields now
  organize content rather than acting only as button accents.
- **Hallmark:** no generic centered SaaS hero, feature-card grid, rounded-card system,
  gradients, glass, decorative blobs, fake dashboards, or repeated scroll reveals.
  C's bounded overlaps are the requested experiment in juxtaposition, not floating
  decorative cards. No invented credibility, fake sponsors, or official brand claim.
- **Emil:** each major interaction identifies a reading, state, feedback, or orientation
  purpose. Frequent keyboard interaction stays immediate. Transitions settle, can be
  interrupted, and have coherent reduced-motion states. No animation blocks core access.

| Review finding | Correction |
| --- | --- |
| Spatial marker's transparent transformed box expanded the document on narrow widths | Clip that bounded diagram surface and inset its first node; do not hide document overflow |
| Full-width fields extended 4px at 320px due to conflicting gutters | Align the narrow gutter and field margins |
| Supporting text on C's violet field had 4.33:1 contrast | Darken supporting text; revised pair is approximately 4.95:1 |
| A duplicated top navigation and sticky contents | Keep the functional contents strip and remove the duplicate destination row |
| B's arrival links did not select their named subject | Connect arrival links and explorer to the same selected subject state |
| Switching to keyboard could leave a delayed CSS animation or pointer transition active | Cancel running animations and remove CSS animations for keyboard modality |
| Attendee mode would hide C's reading panel but leave title buttons | Render a compact plain heading in that scenario |

## Verification

The second pass was opened in local Chrome through browser automation and inspected
in screenshots, including full pages, selected reading states, and desktop/mobile
attendee states. This is a browser review, not a user preference study.

- Strict TypeScript and Vite build pass.
- All three routes and their discovery/attendee modes open. The shared historical,
  fictional, and pending-information labels remain present.
- Layout checks cover A/B/C at 320, 375, 390, 414, 768, and 1440 CSS pixels. The final
  pass reports no document horizontal overflow or missing fragment targets.
- Visual inspection covers 1440px desktop and 390px mobile, including A's reader,
  B's explorer, C's selected title, and all three complete page compositions.
- Interaction checks cover reader choices, B selection/list toggle, C title/variation,
  announcement expansion, language notice/Escape, and native attendee-topic focus.
- Rapid repeated selections settle on the latest subject with no remaining animations.
- Reduced-motion preference changes were tested during active animation. Each direction
  reported zero active animations afterward and after subsequent activation; controls
  continued to work. Keyboard activation also reported zero active animations.
- A's context indication was checked at News; the skip link focuses main content.
- No runtime page errors or browser console errors in the final route pass.
- Automated axe checks cover 12 route/mode/width combinations with WCAG 2 A/AA,
  2.1 A/AA, and 2.2 AA tagged rules. The corrected run has no reported violations.
  Axe leaves some glyph/symbol contrast items for manual review; this is not a claim
  of a fully automated accessibility sign-off.

Manual contrast checks for flagged symbols/type use actual foreground/background
pairs: A selected reader symbols approximately 13.05:1; A next arrow 11.46:1;
B reading-jump link 12.69:1; B previous control 10.79:1; C selected title glyph 11.97:1.
Visible controls and glyphs were also reviewed in the browser. These checks do not
replace screen-reader or real-device testing.

### Performance evidence and limits

The production build is approximately 76.74 kB JavaScript, 10.08 kB CSS, and 0.44 kB
HTML after gzip (decimal kB, estimates from Vite). No media, web fonts, third-party
scripts, map resources, or animation packages were added. The small SVG is a conceptual
relationship diagram, not a campus asset. There are no animation loops or per-frame
scroll/pointer listeners.

These are bundle estimates and behavior checks, not field LCP/INP/CLS measurements
or proof of smooth rendering on low-end phones. Real mobile hardware, Safari/Firefox,
screen-reader output, text-only enlargement, long English content, and approved brand
asset integration remain unverified. System-font rendering can differ by platform.

The experiment intentionally pushes expression further. Its usability and emotional
fit still need comparison by actual readers. No winner, permanent palette, logo,
production architecture, or final DESIGN.md decision is adopted.
