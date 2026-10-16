# Festival Web App — architecture and implementation status

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

2026-09-30 · Implementation pass authorized after the documentation phase.

## 1. Current implementation and future boundaries

The original proposal below remains context for the longer-term product; it is
not a claim that all proposed production systems now exist.

| Implemented | Boundary / source |
| --- | --- |
| React Router data router, shared desktop/mobile shell | `src/app/router.tsx` (`createBrowserRouter`, route-level `lazy` so each page loads before it swaps in, `errorElement` for chunk/offline failures, initial `HydrateFallback`); `src/app/App.tsx` layout with `<Outlet>`, `<ScrollRestoration>`, pending-navigation bar; desktop pill navigation, mobile tab bar and 更多 sheet; focus moves to `main` on path change (`use-route-focus.ts`). Links opt into View Transitions through `src/components/links.tsx` |
| `/`, `/about`, `/program`, `/events`, event details, `/map`, `/news`, announcement details, `/team`, `/visit` | One lazy chunk per route in `src/pages/`; `/e` redirects to Home; unknown paths render `NotFoundPage`; the `/motion` lab was removed on 2026-10-16 |
| Normalized typed prototype content | `src/data/model.ts`, `src/data/festival.ts`; Event → ProgramEntry → Location, plus Announcement/Organizer/Sponsor; immutable revisioned build snapshot |
| 春空 Spring Sky visual system (2026-10-16) | Tokens in `src/styles/tokens.css`; shared components in `src/components/`; global CSS is tokens, base, shell and shared components, page CSS travels with its lazy route. Replaced the Bloom files (`direction-e`, `bloom-*`, `seed-*`, `motion-lab`) and the GSAP dependency; history is in commit a37e655 |
| v5 visual system (2026-10-17) | 「櫻吹雪」: `Page` head and cards in `src/components/page.tsx`; `Plate` illustration plates and the OSM `CampusSketch` in `src/components/`; all GSAP in `src/motion/` (`gsap.ts` registers ScrollTrigger and SplitText, `ShellMotion` is lazy, `PetalFall`); display-face copy in `src/data/display-copy.ts` and `poster-copy.ts`; see DESIGN.md |
| Tooling | Biome lint/format (`biome.json`), Vitest (`tests/`), node geo tests, GitHub Actions CI (`.github/workflows/ci.yml`) |
| Functional Three.js map | `src/map/MapPage.tsx` loads `engine.ts`; OrbitControls, selection/raycasting, camera controls, URL Location selection and text alternative |
| Real geographic campus foundation | Retained OSM extract → normalized geographic features → optimized JSON; WGS84 ECEF/ENU metre frame in `src/geo/coordinates.ts`; source footprints with separate visual height/width estimates. See [MAP-DATA.md](MAP-DATA.md). |
| Development-only routing foundation | 394 source nodes / 460 edges, independent Dijkstra and GPS-candidate utilities; dev-only `/map?debug=1` route drawing. No public navigation, permission prompt, AR or accessible-routing promise. |
| PWA foundation | Manifest, temporary icons, standalone configuration, generated service worker and explicit core-save workflow; HTTPS/localhost required |
| Conservative offline behavior | Worker initially saves only a small offline fallback. Explicit core save stores the compatible shell, core route code, typed content snapshot and optimized geographic JSON/SVG fallback; no raw data/graph/Three.js/renderer/lab precache |

Core information is bundled as a revisioned typed snapshot in this first
implementation. It is **not yet a separately fetched mutable content API**. A new
content revision requires a build; a future CMS/data adapter may replace this
boundary. The UI exposes saved time, pending edition state and offline warnings.
Language availability remains explicit: Traditional Chinese content, with an
English unavailability notice, rather than a silently mixed English page.

Saved shell HTML and immutable code/data stay together. New workers wait for old
clients to close; there is no forced reload or `skipWaiting`. On activation only
this application's obsolete versioned caches are removed. The new version needs
a new successful core save. Full 3D offline packages, real-time updates, geolocation
and navigation remain deferred. First-ever offline visits and evicted caches
cannot guarantee access. Deployment still requires SPA fallback configuration.

The E2 implementation review is in [PROTOTYPE-NOTES.md](PROTOTYPE-NOTES.md).
The later geospatial implementation, source licenses, regeneration, measurements
and remaining navigation risks are in [MAP-DATA.md](MAP-DATA.md).

Map data has its own retained raw/source → normalized → application pipeline.
`Location.geographic` is the shared position source; its world coordinates are
derived, never duplicated. Six OSM-backed area labels coexist with three
unlocated festival fixtures. `lake-plaza` preserves its URL identity but denotes
the lake area, not a surveyed plaza/entrance. The renderer receives the processed
dataset; no fabricated fallback buildings or paths are mixed into it.
The source-backed SVG plan and list survive renderer failure; explicit core save
includes the small campus JSON and license, whose bytes participate in the worker
version hash. A separate empty FestivalLayer represents future edition overlays.
The production map never imports the development routing panel/algorithm.
Sections 2 onward are the original
architecture proposals: read future tense and prototype gates literally, not as
completed implementation. PRODUCT facts and final DESIGN direction are unchanged.

## 2. Information architecture and page boundaries

Candidate destinations; validate grouping and labels before locking paths:

| Route | Owns | Home contains instead |
| --- | --- | --- |
| `/` | One continuous Bloom overview, selected content and closing | The entry experience itself |
| `/about` | Detailed story, name meanings, campus connection, origins | Brief introduction and link |
| `/program` | Chronological occurrences, day/location filters if content warrants | Selected schedule highlights |
| `/events` | Activity discovery across performances, special events and market | Curated important activities |
| `/events/:eventId` | Canonical activity detail and its occurrences | A linked summary, not duplicate detail |
| `/map` | Spatial exploration, location selection and related activities; future entry to pedestrian navigation | Static/lightweight preview, no campus renderer |
| `/news`, `/news/:announcementId` | Announcement list and full source-attributed detail | Latest important notices |
| `/team` | Approved organizers and contributors; contextual partner credits | Organizer summary and approved sponsor/partner acknowledgment |
| `/visit` | Transportation, attendance requirements and FAQ | Small practical signpost |

**Proposed refinements:** Program answers “when”; Events answers “what”; Map
answers “where”. Share detail records rather than maintaining three descriptions.
Do not add a separate Current Edition page initially: Home provides its overview
and all event-related pages share edition context. Validate whether a future theme
requires its own destination. No dedicated archive or sponsor page is needed now.

The homepage is not an index of every item. Store curated highlight IDs, then
resolve them from shared records. Only show publishable current highlights; never
feature a canceled occurrence as active. Organizers/sponsors are required content
roles but still lack confirmed material. Missing records stay unpublished/TBD;
prototype placeholders must be explicitly labeled.

Direct links must survive refresh, Back/Forward, and entry without a homepage
visit. Permanent IDs outlive title changes; readable slugs may be added later.
Do not infer an edition solely from today's date. The maintained current-edition
pointer drives defaults, with explicit edition context in shared event/map links.
Locale URL policy (prefix or equivalent) remains to validate; use one route tree
and shared templates, with honest missing-translation behavior from PRODUCT.md.

## 3. Application boundaries and incremental evolution

Proposed logical modules, not directories to scaffold now:

```text
Shared shell: navigation, language availability, edition context, connectivity
  ├─ Route content: Home / About / Program / Events / News / Team / Visit
  │    └─ Shared content selectors → versioned festival content
  ├─ Bloom effects: optional, page-scoped, separately disposable
  └─ Map route shell: location list, details, loading/fallback state
       ├─ Lazy campus renderer → Three.js + selected loaders → model assets
       └─ Future navigation controller → independent routing engine + graph
            ├─ Optional user-initiated positioning / manual origin
            └─ RouteResult → 3D, simplified or textual presentation

Service worker: bounded shell/content caches, offline response and update policy
```

Keep the current React/Vite base for the next architecture prototypes. A router
with nested layouts, code splitting, history, error boundaries and URL state is a
candidate; no routing package is selected or installed by this document. Rendering
for public detail pages (pre-rendered static output versus client rendering) needs
an SEO/deep-link comparison before production. A CMS or server runtime is not a
prerequisite: build-generated static JSON can carry shared content updates.

Ordinary routes import lightweight schemas/selectors, not a map index that
re-exports Three.js. Map loaders, decoders and assets belong behind the map route's
own dynamic import. Disable automatic prefetch/precache of this heavy branch.
Home's map preview must not instantiate the renderer even if it is in view.

Expressive Bloom and the functional map share only approved visual tokens and
neutral content types. They do not share a renderer, scene, render loop, mutable
camera state, or forced Three.js dependency. Keep the existing small raw WebGL
aperture isolated; it need not be rewritten in Three.js to support the map.

Migration after further authorization: preserve `/e` as the comparison baseline;
build the shared shell and one inner-page slice; validate shared content; then
move the approved homepage to `/`. Its existing prototype sections become concise
previews and links. Keep `/motion` as development reference, outside public
navigation/install shortcuts/precache. A/B/C/D remain removed. No migration or
route redirect changes happen in this documentation task.

## 4. Minimum shared content model

Store structured source files separately from presentation; typed JSON/TypeScript
plus build-time validation is sufficient initially. Export versioned static data
for runtime/offline use rather than baking all changing facts into UI bundles.
Names below are proposed contracts, not a finalized schema implementation.

Common envelope: stable `id`, `schemaVersion`, `updatedAt`, publication state,
fact confirmation state, source/context where relevant, and localized content
with explicit availability (`zh-Hant`, optionally `en`). Unknown dates and positions
are absent/null plus status, never fake values or “TBD” parsed as a date. Prototype
fixtures have a separate namespace and cannot enter a production export.

| Entity | Minimum content / references |
| --- | --- |
| Festival | Permanent name/story; `currentEditionId` nullable; curated home references |
| Edition | Stable ID, title, lifecycle, nullable confirmed period, `Asia/Taipei` time zone, published content revision |
| Event | `editionId`, title/description, category, participation status/rules when known; optional organizer IDs; unscheduled `locationIds` only when relevant |
| ProgramEntry | `editionId`, `eventId`, `locationIds`, nullable start/end instants, schedule status (TBD/scheduled/changed/canceled), update/source context |
| Location | Stable domain ID, name/details, POI type (building/stage/booth/etc.), optional `parentLocationId`, edition scope, geographic anchor with source/accuracy, derived versioned world-frame position, entrance and navigation-node references, verified/unknown accessibility metadata; **no mesh identifiers** |
| Announcement | Optional edition scope, title/body, publication/update times, priority, source/context, related event/location IDs, publication state |
| Organizer / Contributor | Approved display name, role, optional consented bio/contact/assets; festival- or edition-level association |
| Sponsor / Partner | Approved name, relationship label, edition association, permitted asset/link and display order; no invented tier or endorsement |
| MapDataset | Revision, source/license/approval, accuracy (`prototype`/`verified`), coordinate frame/units, optional verified georeference, asset manifest |
| MapFeature | Presentation binding: `datasetId`, `locationId`, model node IDs and optional visual-label/camera anchor; not a navigable destination or source of geographic truth |
| LocationEntrance | Stable entrance ID, `locationId`, geographic position with derived world-frame position, connected navigation node(s), access rules, verified/unknown accessibility and opening state |
| NavigationGraph / Node / Edge / Condition | Future dedicated routing data, revisions and temporary overlays; contracts in section 6A |
| VisitorInfo | Edition/permanent scope, confirmed transport/FAQ/attendance content, localized version and sources |

Relationships:

```text
Edition → Event ← ProgramEntry → Location ← MapFeature → MapDataset
             ↑         ↑            ↑
          Home picks / Announcement references
Event → Organizer       Edition → Organizers / Sponsors
```

An event may have several program entries at different locations/times. A
ProgramEntry's location references own that occurrence's venue. Event detail
resolves locations from its occurrences; event-level location IDs serve only
unscheduled activities. Never duplicate the Location's display name/address in
an entry. A booth can be an edition-scoped child of a venue. Geometry can contain
multiple nodes for one location, or no verified anchor yet. An absent anchor must
leave the location available in the list instead of guessing where to plot it.

Validation before publication: unique IDs; resolved references; compatible edition
scope; no parent cycles; valid start/end ordering and timezone; canceled/pending
states; honest translation availability; licensed assets; prototype/verified
separation. Validate deleted/unpublished references and map-node bindings as well.
Do not automatically turn missing translations or missing coordinates into defaults.

## 5. Cross-route state and Bloom continuity

Working deep-link example (IDs shown are **schema placeholders**, not real venues):
`/map?edition=<editionId>&entry=<programEntryId>&location=<locationId>`.

1. Program links from a specific occurrence, not just an ambiguous event title.
2. Map parses and validates IDs and their relationship against the same edition
   snapshot. Render the selected location/event detail in DOM immediately.
3. The accessible list and static view work while the separate 3D branch loads.
4. If a verified binding exists, highlight the location and frame it after readiness.
   Use an interruptible short camera move; reduced motion sets the view directly.
5. A later selection wins over a pending load/camera transition. Invalid, removed,
   mismatched or unpositioned IDs show an explicit state and location alternatives.
6. Back restores program filters/scroll and focus to the originating item where
   possible. Direct-entry Back must not trap the visitor; offer a Program link.

Keep query state lightweight: selected entry/location, edition, program filters.
Do not put per-frame camera coordinates into React state or rewrite history every
frame. A committed selection can update the URL; camera drag is transient.

All pages retain typography roles, palette relationships, navigation, and feedback
vocabulary. Home is expressive; About editorial; Program quiet; Events expressive;
Map spatial; News readable; Team human; Visit practical. This is continuity, not
permission to design every inner page as a giant animated hero.

Prototype native route transitions as progressive enhancement: shared masthead,
color continuity and perhaps a title/selection handoff. Target routine transitions
around 150–250ms, interruptible and never a prerequisite for route content/focus.
No deliberate delay to wait for assets; cold loads get immediate loading content.
Focus the new main heading, update document title, restore history scroll, expose
loading/errors and retain real anchors. Reduced motion uses immediate navigation.
View Transition support must be feature-detected, with ordinary navigation as the
baseline. [MDN View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)

Home / Program / Map / More is a mobile-navigation experiment. Compare it with a
compact route menu on 390px and in standalone mode: task discovery, safe areas,
landscape, keyboard/zoom, long translated labels, active state and Back behavior.
More must expose About, Events, News, Team, Visit and language/install state.
Never let bottom navigation cover map controls, focused fields or program rows.

## 6. Functional 3D campus map proposal

Use a dedicated React route shell with an imperative Three.js adapter as the first
candidate; a React Three Fiber wrapper is an alternative only if the prototype
justifies its lifecycle/dependency cost. Do not change the whole site's renderer.

The shell owns content/selection/accessibility. The adapter owns scene, camera,
controls, picking and resources, exposing a small boundary such as load dataset,
select location, set quality, resize and dispose. Data selection is authoritative;
mesh selection reports a Location ID back into that same store.

### Geometry and data integrity

Phase 1 now uses real OSM geographic geometry rather than fictional blocks.
Source precision/verification is explicitly community-maintained, not surveyed.
See MAP-DATA.md for exact bounds, source IDs, ENU origin, filtering and limitations.
`map-data.ts` now owns only rendering assumptions and an empty festival overlay.
The normalized feature schema supports CampusBoundary, Building, Walkway, Road,
OpenSpace, Entrance, POI and FestivalZone. React contains no footprint vertex lists.

The current map extrudes source polygons directly, preserving holes; there is no
GLB/model/texture pipeline yet. Most heights, path widths and flat ground are
visual assumptions. No organizer-confirmed festival placements are available.
Home's unchanged small illustration remains explicitly labeled conceptual and
is not consumed as geographic data. Never infer walkability or a destination
entrance from a rendered mesh or a label centroid. The independent development
graph is derived only from original source path-node adjacency. Geolocation
consent, verified pedestrian guidance and accessible routing remain future work.

Use GLTF/GLB as the model delivery candidate. Evaluate Draco **or** Meshopt on the
actual asset for transfer savings versus decoder/CPU cost; do not include both by
default. GLTFLoader supports integration with those decoders.
[Three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html)

If textures are needed, evaluate KTX2/Basis delivery and renderer capability
selection; prefer simple materials to texture-heavy realism. Self-host compatible
loaders/decoders under the same release manifest; account for WASM/transcoder bytes
and required server headers. [Three.js KTX2Loader](https://threejs.org/docs/pages/KTX2Loader.html)

### Selection, rendering, and fallback

- Buildings provide context; mapped stage/booth/POI markers resolve Location IDs.
  Raycasting and DOM marker buttons select the same entity. Highlight with shape
  or outline plus text, not color alone. Limit label density and overlap; prioritize
  selected/visible places and cluster only when justified by actual counts.
- Keep a keyboard-accessible location list, text detail and event links outside
  the canvas. Provide reset/zoom controls and selection without drag gestures.
  Do not force focus into the canvas when camera motion ends.
- Start by comparing an orthographic overview with a constrained perspective view.
  Camera movement communicates a selected place, not a cinematic tour. Interrupt
  immediately on new selection or direct input; reduced motion skips camera travel.
- Feature-detect the capabilities required by the pinned Three.js renderer. Current
  WebGLRenderer uses WebGL 2, unlike E's independent WebGL 1 effect; a working Bloom
  effect does not prove map compatibility.
  [Three.js WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html)
- Render on demand after data, camera, selection or size changes. While controls
  settle or camera motion runs, request frames only until settled. Pause when
  hidden/offscreen; no default auto-rotation or ambient loop.
- Start DPR at 1 on mobile and cap at 1.5 on desktop; evaluate pixel-count limits
  and adaptive lower quality. Disable costly shadows/post-processing initially.
  Use simplified geometry, reused materials/instancing, and a bounded label set.
- On capability failure, context loss, asset/decode failure, timeout or memory
  pressure: retain text/list plus verified simplified/static map if available.
  If no verified image exists, the list is the honest fallback. Preserve selection,
  explain the limited view and offer retry. No fallback may invent coordinates.
- On route exit: cancel loaders where possible, ignore stale callbacks, stop RAF,
  detach controls/observers/listeners and dispose owned GPU resources. Reference-
  counted shared resources must not be disposed while still in use. Avoid keeping
  the campus scene alive behind every route merely to animate a transition.

## 6A. Future pedestrian navigation — data and engine boundaries

Approved readiness requirement; **not a complete routing implementation in this
phase**. No coordinates, real campus paths, models, permission calls or AR are
created by this document. UI route navigation and pedestrian route calculation
are different concerns and must not share an ambiguous “router” abstraction.

### Source of truth and coordinate contracts

```text
Verified campus data + edition-specific conditions
    ↓
Shared Location / POI / Entrance model
    ↓
Versioned NavigationGraph + condition overlays
    ↓
Routing engine (no DOM, React or Three.js dependency)
    ↓
RouteResult
    ├─ 3D map adapter
    ├─ Simplified map / route overview
    └─ Textual route and location detail

Manual origin or optional PositionFix → navigation controller → routing request
```

Event, ProgramEntry, Booth, Stage and POI references converge on the same stable
Location ID. Model mesh IDs exist **only** in MapFeature bindings. Replacing the
GLB or Three.js must not invalidate location URLs, entrances, graph IDs or tests.
Location is not required to have a mesh, geographic coordinate or route connection
before it can be represented as a pending record.

Geographic anchors identify coordinate reference/datum, source, accuracy and
verification time. Proposed geographic interchange is latitude/longitude with an
explicit datum; do not treat degrees as meters. World anchors identify a coordinate
frame revision, origin, axes and units. Use a verified transform between geographic,
local metric and render space; choose one explicitly classified geographic source position and
derive other representations rather than manually maintaining conflicting copies.
Navigation uses measured metric distances and path geometry, never exaggerated
render distances. Rendering scale/height edits cannot change route distance.

A Location may have multiple entrances with different access restrictions and
route-node connections. Choose a usable verified entrance, not the building
centroid or whichever mesh is closest. Entrances may be closed even while the
place remains open. Unpositioned/unconnected places stay readable with navigation
unavailable; do not synthesize a straight path to them.

### Graph and festival overlay contracts

All records retain verification/source and revision metadata. These fields define
future schema capacity, not a requirement to populate unknown data now.

| Record | Proposed fields / rules |
| --- | --- |
| NavigationGraph | `id`, revision/schema, coverage, coordinate-frame revision, node/edge sets, verification, compatible location revision; prototype/verified distinction |
| NavigationNode | Stable `id`, geographic and derived world/local metric position, optional elevation/level, kind (junction/entrance/etc.), source/verification |
| NavigationEdge | Stable `id`, `from`, `to`, directed/bidirectional semantics, measured `distanceMeters`, path polyline, path type, pedestrian access, accessibility evidence, stairs, slope/surface/width/curb information when verified, indoor/outdoor, level connection, baseline availability |
| NavigationCondition | ID, edition/event scope, targeted edges/nodes/entrances, change type (closure/barrier/restriction/temporary opening), validity interval with timezone, priority/authority, reason, revision and last verification |
| RouteProfile | Pedestrian policy and explicit constraints/preferences, such as avoid stairs or require verified step-free entrances; unknown-property handling is explicit |
| RoutingRequest | Origin/destination entrance or valid graph connection, graph and overlay revisions, requested departure time, profile and request ID |
| RouteResult | Status, ordered node/edge IDs, geographic/local path geometry plus frame revision, total measured distance, destination entrance, constraints/data warnings, graph/overlay revisions and calculation time |
| PositionFix | Ephemeral geographic coordinates, accuracy in meters, timestamp, provider state; independent of graph, renderer and persistent Location records |

NavigationEdge availability is an evaluated result of baseline conditions and
valid festival overlays, not a single permanently overwritten Boolean. Permanent
campus paths remain distinct from edition-scoped temporary connectors. Temporary
stages, booths, festival entrances, pedestrian-only paths and event-specific routes
need explicit approved nodes/edges or restrictions. Barriers do not become routing
constraints merely because their geometry is visible in 3D.

Conflicting restrictions resolve deterministically: closures/access prohibitions
must not be undone by a lower-authority opening. Expired or missing temporary
conditions become **unknown**, not proof that a blocked path has reopened. Define
source precedence, timezone boundaries and freshness policy with organizers.
An expired navigation package may need to show historical overview only, with
new guidance unavailable until conditions can be verified.

Unknown stairs, slope, surface or entrance access is not `false`/accessible. An
accessible profile must require the relevant verified data across the entire
connected route; otherwise return “insufficient verified data” or “no suitable
route”, not silently fall back to stairs. Even a complete data path requires field
validation before the product promises accessible routing. Do not infer indoor
access or walkability from proximity or visual geometry.

### Renderer-independent calculation and progress

A* or Dijkstra are algorithm candidates, not installed requirements. The engine
accepts plain graph/profile/condition inputs and returns a serializable RouteResult.
Filter forbidden/closed edges before applying costs; nonnegative distance-based
costs are a starting proposal. Any A* heuristic must match the selected cost model;
validate against a simpler reference calculation before optimizing. Keep display
instructions and map animation outside the search algorithm.

RouteResult statuses should distinguish success, unknown endpoint, no connected
path, no profile-compliant route, insufficient verified data, expired/incompatible
data, and canceled work. A successful result includes the revisions used, so it
can be invalidated when a closure or destination changes. Do not return an invented
line as a successful fallback. Walking-time estimates remain deferred until the
assumptions and data support them.

The navigation controller handles origin choice, entrance resolution, optional
position fixes, user intent and progress. The engine does not call geolocation.
If needed later, run graph search in a separate worker with a spatial index;
measure first. Cancel superseded searches and ignore late results. Do not recompute
on every camera frame or GPS fluctuation.

Origin matching must account for fix accuracy, age, graph coverage, level and
barriers. Do not blindly snap to the nearest node across a wall, lake or inaccessible
entrance. An off-network/ambiguous fix should invite a manual known starting point.
Connecting a fix to a path must follow verified network geometry, not invent a
walkable connector. Progress/off-route logic needs confidence thresholds and
hysteresis; poor fixes must not cause repeated reroutes or false arrival. Thresholds
require field validation and are deliberately not specified as accuracy promises.

3D visualization consumes RouteResult geometry through the coordinate adapter.
Highlight the path and selected entrance, retain an accessible text/overview
alternative, and let users inspect without continuous camera-follow. No WebGL
capability is needed to test or calculate a route. Reduced motion removes camera
travel while preserving route state and manual controls.

### Optional current location and privacy

Future flow: Event/location → Navigate → select destination/entrance → choose
“Use my location” or a manual start → route overview → optional progress following.
A navigation deep link or “Navigate” action alone does not request permission.
No permission request at page load, map open, install, or automatic app restoration.
Manual selection is a first-class mode, not only an error fallback.

Browser geolocation needs permission and a secure context, and may be constrained
by deployment Permissions Policy. Plan explicit handling for denied permission,
unavailable API/provider, timeout, stale fixes and revoked access.
[MDN Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

Show an uncertainty area and position timestamp instead of an apparently exact
pin. The browser's `accuracy` reports horizontal accuracy in meters; it is not
proof of which path or entrance the user occupies.
[MDN accuracy](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/accuracy)

If following is requested, use a bounded positioning lifecycle; stop watches when
the navigation session ends and do not silently resume on reopen. Browser
`watchPosition`/`clearWatch` provide the lifecycle primitives.
[MDN watchPosition](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition)

Default proposal: keep fixes in session memory, not analytics, shared URLs, route
history or persistent cache; no upload/backend is needed for local route calculation.
A user-selected manual origin may be a public Location ID. Persisting route progress
or precise personal coordinates would need a separately justified product decision.
High-accuracy mode is not a reliability guarantee and may increase battery cost.
Do not promise indoor, screen-locked or background navigation merely because the
app is installed. Stop or explicitly suspend guidance on loss of reliable updates.

### PWA and poor-connectivity behavior

Future Home → next confirmed event → Navigate, Program → Event → Navigate, and
Map → POI → Navigate all resolve the same destination/occurrence/entrance records.
The selected navigation session must not depend on revisiting the homepage.

An optional saved navigation package should contain compatible Locations,
entrances, graph, condition overlays, coordinate transform and routing code. Store
edition/revisions, coverage, saved/verified times and expiry together; stage the
whole package before activation. A cached GLB alone cannot support routing, while
a complete graph may support a manual-origin route without any GLB.

If a valid complete package exists, local route calculation can be evaluated as
an offline capability. That does **not** guarantee current path availability or
live geolocation: offline fixes depend on device/provider/environment. Retain
manual origin, clearly show package age and prevent current-guidance claims from
expired/unknown conditions. Uncached coverage must produce an unavailable state.

On reconnection/foreground, revalidate relevant conditions. A new closure or entry
change invalidates affected results; explain a recalculation or unavailable route
rather than silently retaining the old line. Keep graph and overlays version
compatible and preserve user intent. Service workers cache data; they are not a
promise of continuous background positioning. Navigation packages and engine
chunks stay separately bounded/lazy; do not add them to ordinary-page or install
preloads by default.

### Required campus data, risks, and future validation

Before real pedestrian guidance, obtain and verify:

- Authoritative, licensed campus reference data, surveyed coordinate transforms,
  path polylines/junction topology and geographic coverage.
- Actual entrances, permitted access, opening times, building levels and verified
  connections to pedestrian paths; campus boundary and off-network behavior.
- Distances, path type, stairs/ramps, slopes, width, surface, curbs and other relevant
  access constraints, with explicit unknown values and verification provenance.
- Organizer-approved temporary stages/booths/entrances, pedestrian-only links,
  barriers and closures with effective intervals, update owner, source precedence
  and a practical correction/retraction process.
- Field validation of endpoint access, routing correctness and accessible profiles,
  plus positioning reliability and battery behavior on intended campus devices.

Major risks: coordinate-frame mismatch; disconnected or incorrect topology;
nearest-node matching through barriers; indoor/level ambiguity; stale closures;
unknown accessibility treated as safe; GPS drift and false arrival; reroute churn;
main-thread/battery cost; and partial or evicted offline packages. A routing
algorithm cannot correct unverified source data.

Phase 1 has now tested deterministic graph fixtures without Three.js,
closed/directed/disconnected edges, metric transforms and GPS candidate uncertainty.
The retained real-source route experiment proves only topology.
Still-future tests: multiple entrances; temporary condition conflicts
and expiry; unknown/step-free constraints; metric/render coordinate alignment;
GPS accuracy/age/denial simulations; manual start with no permission; canceled
searches; route invalidation after a closure; and offline package compatibility.
Then controlled campus walks and accessibility review using verified data.
No routing accuracy or accessibility claim follows from passing synthetic tests.

## 7. PWA as an event companion

**Stamp rally boundary (2026-10-16).** `src/game/` holds the PWA-only game. `isStandalone()`
gates `/game`; `/stamp/:spot` redirects to `/game` in the app and to `/play` in a browser.
`/play` saves the claim to localStorage (shared with the installed app on Android and
desktop) and swaps the manifest link for a blob copy whose `start_url` carries the claim
(iOS home-screen apps do not share Safari storage). Every spot also has a printed code for
manual entry. Stamps live in localStorage (`src/game/stamp-store.ts`); keys are checked on
the client, which is not tamper-proof and must move to the backend with SSO. The manifest
`start_url` is now `/game`. Unverified: iOS Safari honouring the swapped manifest.

### Manifest and installation

One app identity, manifest and service-worker scope cover all product routes.
Plan stable `id`, `name`, `short_name`, `start_url`, `scope`, `display: standalone`,
theme/background presentation, and approved ordinary/maskable icons (including
192px and 512px candidates). App icons must come from approved identity material;
prototype icons, if later authorized, must not masquerade as official branding.

HTTPS production delivery and correct scope are infrastructure requirements.
Installation UI varies by browser; offer an install action only where supported,
otherwise concise platform instructions. Never promise one universal install
prompt or require installation to access the product. Standalone mode must preserve
navigation, safe areas, offline state and external-link orientation. A manifest
alone does not deliver the requested companion behavior; offline support is a
product requirement even though service workers are not a universal installability
prerequisite. [MDN installability](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)

### App shell and content storage

Use a small versioned shell with navigation, status UI and an offline response.
Evaluate a build-integrated Workbox/service-worker approach versus a small custom
worker; select after the offline vertical slice, not by installing tooling now.
Separate immutable code cache from mutable edition content snapshots. Cache Storage
can hold requests/assets; IndexedDB is a candidate if indexed records/metadata and
atomic snapshot commits need it. Do not add a database library without that need.

Proposed cache policy (exact timeouts/quotas/freshness thresholds remain to validate):

| Resource | Proposed strategy | Offline expectation |
| --- | --- | --- |
| Minimal shell, core text-route chunks, approved icons | Small versioned precache; cache-first immutable hashed assets | Navigation and cached-text rendering work after successful setup |
| Navigation HTML | Network-first, bounded wait, then compatible shell/offline response | Unknown/unfetched content is labeled unavailable; not falsely a 404 |
| Program, locations and event detail data | Network-first with bounded fallback to a complete edition snapshot | Show last successfully saved data, edition, content update and last-check times |
| Visitor information | Revalidate when reachable; bounded cached fallback | Readable saved transport/FAQ copy with age/context |
| Announcements | Network-first; last saved entries only if unreachable | Clearly previously saved; never claim to include unseen urgent notices |
| Approved noncritical images | Bounded runtime cache, suitable revalidation | Optional; missing media never hides practical text |
| Future graph, entrances, condition overlays and routing code | Optional version-compatible navigation package, separately bounded; revalidate conditions when reachable | Manual-origin route calculation only when a complete usable package is saved; no guarantee of live location or current closures |
| Campus renderer/model/decoders/textures | Excluded from default precache and normal-route fetches | Text/list or simplified map; full 3D is not an offline promise |
| Unknown external links/assets | Network by default | Explain unavailable destinations; no broad cache of third-party origins |

Different resource classes justify different caching strategies; the table is a
project proposal based on [MDN caching guidance](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching).
Do not return app HTML for failed JS/JSON/model/decoder requests. Use a route-aware
navigation fallback, proper MIME types and explicit asset failures.

Cache the chunks needed to **render** essential cached data, not only JSON. Keep
that core set within a measured offline shell budget. Route-specific decorative
motion and map code are not prerequisites. For a first-ever offline visit there
is no service worker/cache guarantee; explain this in installation/offline testing.
Browser storage may be evicted. “Available offline” must reflect an actual completed
save, not just a successful online fetch. An explicit “save event information”
action is a candidate to test, not an approved new UI requirement.

### Freshness, updates, and failure behavior

Use a versioned content index identifying the current edition and a complete
compatible snapshot. Stage/validate related records before committing the active
snapshot; never combine new schedule entries with old locations from another
revision. Cache identity includes edition, locale and schema/content revision.
Retain one bounded last-known-good snapshot for fallback; preserve unsupported
language notices offline as well.

Show content `updatedAt` separately from successful server-check/download time.
Offline mode must say that cancellations, moves or new announcements may be
missing. An expired or prior-edition snapshot is still historical cached material,
not current advice. Do not infer connectivity from `navigator.onLine` alone;
request results determine reachability. Revalidate on foreground/reconnect and
explicit refresh; do not require background sync or notifications.

On reconnection, validate a new snapshot and show meaningful changes; canceled or
moved entries must lose stale active status. Deleted/unpublished records and
important retractions need a revision/tombstone strategy. Preserve filters and
selected IDs when valid; explain removed selections. No promise that offline data
can detect changes it has not received.

Service-worker updates need version compatibility with open tabs. Avoid immediate
unconditional `skipWaiting`/reload during program use. Propose an update-ready
notice and user-controlled reload, preserve URL state, and keep old hashed assets
available for the deployment's compatibility window. Only delete caches owned by
this app; test rollback, multiple tabs, interrupted download and storage exhaustion.
The waiting/activation lifecycle and takeover risks are described in
[the service worker lifecycle](https://web.dev/articles/service-worker-lifecycle).

Full-map offline caching is deferred. If later justified, offer a size-disclosed,
versioned optional download with quota/error/cancel handling; do not silently fill
storage when the user visits Home or installs the app.

## 8. Performance boundaries and risks

[PERFORMANCE.md](PERFORMANCE.md) remains the baseline: normal initial routes target
≤150 KiB compressed JS, ≤50 KiB CSS, ≤100 KiB fonts, ≤1 MiB total initial transfer;
field LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at the 75th percentile. Existing E numbers in
PROTOTYPE-NOTES are evidence for E only, not the expanded app.

**Required isolation gate:** cold Home/About/Program/Events/News/Team/Visit loads,
hover/focus navigation prefetch, install and service-worker setup must make zero
requests for campus Three.js, models, decoders and textures. Check the bundle graph
and actual network requests; lazy imports alone do not prove isolation.

**Proposed map prototype envelopes, not approved production exceptions:** accessible
map shell stays within ordinary-route limits; optional 3D JS plus decoders target
≤500 KiB compressed incremental transfer, initial low-detail model/textures ≤3 MiB
transfer, desktop enhancement only on intent. Measure decoded geometry/texture
memory, draw calls and sustained input response separately. These starting limits
are hypotheses; if missed, simplify or return for an explicit budget decision,
not quietly increase PERFORMANCE.md. No authoritative GPU-memory or FPS claim is
possible until device/model tests exist.

**Proposed offline storage test envelopes:** small app shell/core route precache
≤1 MiB compressed transfer; current-edition text snapshot target ≤1 MiB decoded;
optional runtime images bounded to ≤10 MiB stored and evicted separately. Measure
Cache Storage/IndexedDB usage rather than assuming stored size equals transfer.
Installation must not download the whole website. Thresholds need validation
against real content and browser eviction behavior.

| Risk | Response / evidence required |
| --- | --- |
| Shared barrel imports pull Three.js into all pages | Dependency graph plus cold-route/precache network checks |
| Attractive GLB is small on disk but large after decoding | Record triangles, decoded buffers, texture dimensions, memory pressure and route-exit cleanup |
| Compression shifts bytes into slow decode/startup | Compare raw, Draco/Meshopt and texture variants on target phones, including decoder transfer |
| Many DOM labels/markers cause layout and collision work | Bound visible labels, batch projection reads/writes, test dense fixture |
| Two canvases and transitions coexist across navigation | Dispose route-owned renderers; do not animate two heavy live scenes |
| Stale/cross-edition caches mislead attendees | Atomic snapshots, freshness labels, cancellation/retraction and edition-switch tests |
| Worker update breaks open routes or evicts data | Version compatibility, controlled activation and quota/rollback tests |
| Mobile map gestures conflict with page/OS navigation | Test physical devices, gesture boundaries, safe areas and accessible list alternative |
| Future positioning/recalculation consumes battery or blocks input | Lazy routing engine, bounded workers/cancelable jobs if needed, throttle fix processing, no perpetual render loop or background-tracking promise |
| Stale closure overlays or uncertain GPS suggest an invalid path | Check graph/overlay validity, represent uncertain match/no-route states, retain manual origin and never assume an unknown path is accessible |
| New route bundles and CJK fonts consume remaining budget | Keep decorative code page-scoped, approved font subsets, measure every representative route |

## 9. Prototype gates before production

These are proposed next tasks, not prototypes performed by this documentation pass.

| Slice | Must establish before widening implementation |
| --- | --- |
| IA and mobile navigation | Users find when/what/where without duplicate facts; compare Home/Program/Map/More with compact menu; evaluate browser and installed modes |
| One Bloom inner-page pair | Expressive Events and calm Program share identity without huge repeated heroes; direct links, title/focus, Back, interruption and reduced motion work |
| Shared-data vertical slice | One labeled fixture event with two occurrences references shared locations; edit a venue once and all views agree; unknown/canceled/missing-language cases behave honestly |
| Functional map blockout | Program → map selected place → details → Back works with fictional geometry; no real NCU accuracy claim; keyboard/list parity and camera interruption |
| Map device/asset test | Geometry/texture/decoder comparison, low/high quality, dense markers, touch, DPR, hidden tab, context loss, slow network and disposal on physical mid-range devices |
| PWA offline slice | Install/standalone, reload a cached deep route offline, uncached route, old snapshot, cancellation on reconnect, cache eviction, service-worker update and multi-tab rollback |
| Future navigation contract slice, after authorization | Synthetic graph tests without Three.js: closures, disconnected paths, entrance selection, accessibility unknowns, coordinate revisions, low-accuracy fixes, denied permission and cached/manual-origin operation; no real-route accuracy claim |
| Homepage projection | Existing Bloom survives; highlights derive from shared IDs; no map bundle request and no exhaustive inner-page copy on Home |

Do not start detailed campus modeling before verified source/rights and the
functional map slice. Do not build all inner pages before the shell/data/deep-link
slice. Select service-worker tooling only after demonstrating honest offline states.
No test results or completed prototypes are claimed here.

## 10. Open decisions and publication dependencies

- Obtain and field-check pedestrian paths, entrances, stairs/slopes/surfaces, access restrictions,
  temporary barriers and closure feeds; name a data owner and define expiry/verification.
- Validate campus positioning, coordinate alignment, routing policy and device battery
  cost; no automatic permission prompt, AR, or accessible-routing guarantee.
- Confirm route naming/grouping, event/market categorization and whether any edition
  later needs a dedicated landing page; proposed route spelling is not locked.
- Validate mobile navigation and installed-app behavior on target iOS/Android devices.
- Obtain campus data/model rights, geographic reference, location inventory and
  edition-specific placements; identify who approves map accuracy and updates.
- Choose renderer integration, camera model, GLB optimization, labels and quality
  tiers from measurements; Three.js is the map candidate, not a reason to migrate
  existing expressive effects.
- Decide offline freshness limits, core save scope, storage allowances and optional
  download UI with organizers; do not promise live knowledge while offline.
- Confirm content ownership/update cadence, retraction/cancellation handling,
  approved organizer/sponsor records, icons and English availability.
- Validate router/rendering strategy, deep-link hosting, HTTPS, worker scope,
  base path, asset headers/CSP/WASM support and deployment rollback. Vendor TBD.

The next authorization can select a small validation slice. Until then, current E,
its opening/scroll behavior, `/motion`, source code and DESIGN.md remain untouched.
