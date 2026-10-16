# NCU campus geospatial foundation — Phase 1

Implemented 2026-09-30. E2 remains the visual baseline; this is a geographic/data
workstream, not an E3 proposal or final official visual identity. Map colors and
Bloom markers are presentation. Community map data is **not a campus survey**.
No public navigation, AR, location-permission request or accessible-route claim.

## Sources, evidence and licenses

| Source investigated | Status / actual use | Rights / limitations |
| --- | --- | --- |
| [OpenStreetMap API extract](https://api.openstreetmap.org/api/0.6/map?bbox=121.1835,24.964,121.198,24.973) | **Used**: campus multipolygon, footprints/names, roads, paths, open spaces, two entrance/gate points, original node connectivity | Community-maintained, [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright), [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/). Attribution visible on /map. Processed database and derived graph remain ODbL; downloads available. |
| [NCU official campus map page](https://www.ncu.edu.tw/p/412-1000-105.php?Lang=zh-tw) and [building map PDF](https://www.ncu.edu.tw/var/file/0/1000/img/3/140551203.pdf) | **Reference only**: rendered and visually compared; artwork dated 2026.08.12. Campus organization and recognizable buildings checked. | Official NCU communication, not surveyed vectors. No reusable geographic license established. Artwork is not copied, traced, cached or shipped. |
| [NCU campus guide](https://www.ncu.edu.tw/var/file/0/1000/img/3/901763578.pdf), [older 2021 map](https://www.ncu.edu.tw/upload/page/Campus%20Map-20211122.pdf), [interactive department map](https://in.ncu.edu.tw/~ncu7141/) | Additional references found; not imported | No assumption that official publication permits reuse of map artwork. |
| [NLSC building/3D product announcement](https://www.nlsc.gov.tw/NLSC_Content.aspx?n=1742&s=330570), [data supply rules](https://www.nlsc.gov.tw/cp.aspx?n=1548), [map service manual](https://maps.nlsc.gov.tw/downloaddoc/UserManual.pdf) | Investigated, not used | Availability as a viewer/service/product does not establish an open detailed campus-vector license; supply/product and permitted use need separate confirmation. |
| [MOI 20 m DTM catalog](https://data.gov.tw/dataset/176927), [earlier catalog](https://data.gov.tw/dataset/35430/), [terrain portal](https://dtm.moi.gov.tw/) | Public terrain data identified, **not imported** | Catalog identifies Taiwan Open Government Data License v1. Confirm selected release, CRS, height datum and coverage before importing. 20 m terrain cannot establish curb, stair, ramp or accessible-path gradients; higher-resolution products have different access conditions. |

Research checked 2026-09-30. Exact source retrieval: **2026-09-30T09:30:06.538856Z**.
Raw SHA-256: `d824b50b928b60c44920cc3446c339523d5a436d47044b7c270c1409113c8d4b`.
The application revision is its first 12 characters: `d824b50b928b`.
Per-feature OSM ID, version and timestamp remain attached to geometry.
No satellite imagery, tiles, official map artwork or third-party map SDK is served.

The derivative databases are downloadable at `/data/ncu-campus.json` and
`/data/ncu-graph.json`; `/data/LICENSE.txt` supplies attribution/license links.
Keep visible attribution and ODbL obligations when publishing adaptations. Website
code/artwork has a separate licensing boundary; ODbL is not an official-brand grant.
Raw data and transformation scripts remain available in this project for maintenance.

## Bounds and coordinate frame

Fetch envelope `[west,south,east,north]`: `[121.1835,24.964,121.198,24.973]`.
This is a retrieval envelope, not a rectangular replacement for the campus shape.
Campus geometry comes from OSM university relation **18727079**, including its
separate western parcel. Its actual bounds are
`[121.1848596,24.9650565,121.1967519,24.9717322]`.

`src/geo/coordinates.ts` is the sole geographic conversion layer:

```text
WGS84 longitude/latitude (+ optional ellipsoidal altitude)
  → WGS84 Earth-centered Earth-fixed coordinates
  → local East/North/Up tangent plane (metres)
  → Three.js: x = East, z = -North, y = visual elevation
```

Frame `ncu-wgs84-enu-v1`, origin longitude **121.1908057**, latitude **24.9683944**,
zero ellipsoidal altitude. WGS84 semi-major axis 6378137 m, flattening
1/298.257223563. The ECEF rotation follows the standard
[ENU transformation](https://gssc.esa.int/navipedia/index.php/Transformations_between_ECEF_and_ENU_coordinates).
Inverse conversion is provided. Campus-scale tangent-plane distances are suitable
for this experiment; they are not surveyed walking distances or terrain distances.
This is not EPSG:3826/TWD97 TM2, nor an orthometric-height transformation.

All persisted feature vertices and shared Locations stay geographic. World
coordinates are derived at the render boundary. The renderer deliberately uses a
flat ground plane; it does **not** reinterpret missing altitude as surveyed level
terrain. Real elevation needs its own datum and ground-height strategy.
The generator checks that the origin matches the transform; a changed boundary
that changes the computed origin must trigger a deliberate frame/version review.
Camera limits and overview size derive from geographic bounds with visual margins.

## Reproducible pipeline

Requires Python 3, curl and Node 24 with TypeScript type stripping (the project's
current runtime). Builds do not fetch public map services automatically.

```sh
# Optional, maintainer-triggered network refresh; overwrites the retained extract.
npm run map:fetch
# Deterministic conversion from the retained source; no network.
npm run map:data
# Coordinate, geometry, graph, routing and GPS-candidate tests.
npm run map:test
npm run build
```

| Stage | Files / ownership |
| --- | --- |
| Raw source + provenance | `data/campus/raw/ncu.osm`, `source.json`; fetch URL, bounds, UTC retrieval, hash, license and classification |
| Normalize | `scripts/geo/normalize.py` → `data/campus/normalized.json`; geographic geometry, complete feature tags, original path node IDs and node metadata |
| Optimize / derive | `scripts/geo/process.mjs` → `public/data/ncu-campus.json`, `ncu-graph.json`, small `src/data/campus-locations.json`, `data/campus/stats.json`, `connectivity.json` |
| Test example | `scripts/geo/geo.test.mjs` → `data/campus/route-experiment.json`; source-based developer route, never an approved itinerary |
| Rendering | `src/map/engine.ts`, `map-data.ts`, `flat-map.tsx`; no authoritative geographic vertex lists in React |

Normalization checks the raw hash. Relation rings join only on shared source node
IDs; missing relation members are not silently closed. Inner rings are preserved
(e.g. the lake island, track interior, building courtyards). Member way geometry is
not duplicated after importing its relation. Closed areas are retained if a vertex
falls within the campus; source shapes are not forcibly clipped into fake outlines.
Road/path runs retain only consecutive source segments whose **both endpoints**
are inside the campus multipolygon; outside runs are omitted. This is a conservative
endpoint filter, not exact geometric clipping: concave-boundary crossings and
edge cases need later review. No artificial connections across excluded gaps.
Current normalization reports no skipped incomplete relations.

Optimization removes unused display tags and node metadata from the public base
geometry; the graph retains relevant source-node barrier/access/foot metadata.
Coordinates retain source precision, not a new claim of measured accuracy. No
geometry simplification or intersection snapping changes footprints/topology.
Refresh requires review of changed counts, IDs, origin, graph components, names and
license; never silently publish changed campus or festival assertions.

## Schemas and authority boundaries

`src/geo/types.ts` defines these explicit feature roles:

| Type | Current contents |
| --- | --- |
| CampusBoundary | University multipolygon, 1 record / multiple parcels |
| Building | 111 source footprints, with holes where supplied |
| Walkway | 71 source path runs; category does not certify walking permission |
| Road | 55 source road runs; not automatically approved pedestrian routes |
| OpenSpace | 31 areas: water, sports/track, grass/garden etc. |
| Entrance | 2 source entrance/gate points; not a complete public entrance inventory |
| POI | Supported feature type; the small shared Location catalogue currently owns named POI labels |
| FestivalZone | Supported, currently empty; no confirmed festival geometry |

A feature has stable `id`, `type`, `name`, geographic GeoJSON-like geometry,
selected source tags and provenance. `CampusDataset` adds revision, origin,
bounding box and source metadata. A campus label is not an event confirmation.

`Location` connects Event/Program to this base data through geographic position,
aliases, related feature/building IDs, entrance IDs and navigation-node IDs. It has
**no stored world position or mesh ID**. Six geographic-backed labels are available:
中大湖, 總圖書館, 行政大樓, 工程一館, 操場, and an OSM gate point.
Polygon POI anchors are simple vertex means for labeling; they may fall in a
courtyard or water. They are explicitly **not entrances or navigation destinations**.

The existing `lake-plaza` ID is preserved for links but now resolves to
**中大湖・區域參考**, not a verified Lake Plaza point. Related events remain test
fixtures, not actual programming. Demo stage, market and entrance retain IDs with
`geographic: null`, `geographicStatus: unlocated`; no markers or invented coordinates.
The page explains why these cannot focus a map position.

Permanent campus data and edition-specific `FestivalLayer` are separate. The
latter supports zones and revisioned edge closures with time windows, reasons and
verification state. It is empty pending approved stages, booths, barriers and event
access. No permanent edits to the campus graph should encode temporary conditions.

## Height, width and rendering assumptions

`src/map/map-data.ts` owns visual assumptions, separately from geographic records:

- A valid OSM `height` tag would take priority; **none of these buildings has one**.
- Four buildings supply `building:levels`; rendered height is levels × **assumed
  3.2 m**. This is an estimate, even though the level count has a source.
- Remaining **107 buildings** use a visual **12 m** mass. It is not authoritative.
- Paths use a numeric source width if available; otherwise visual widths are
  **7 m for roads / 2.5 m for walkways**. These are not measured clear widths.
- Flat terrain, no verified bridge/underpass elevations, no facade models or
  photorealism. Rendering may visually overlap routes at different source levels;
  the graph never infers connections from that appearance.

Footprint masses and edges are merged by material; six compact Bloom markers
share petal/stem geometry. Rendering runs on demand, not in an idle loop. Only the
selected Bloom state has a short, interruptible 220 ms transition. Reduced motion
and keyboard modality skip it. Camera selection, controls and recenter respond
immediately; bounded OrbitControls prevent free flight.

Labels prioritize selection then catalogue POIs, with at most 4 on narrow maps /
10 on wider maps; secondary building labels require a closer view. Simple projected
screen collisions suppress labels. This is not a full occlusion engine. Every
catalogue POI remains available as a native button in the list when its label is
hidden. Camera arrows pan from the focused map; buttons handle rotation, zoom and
north overview. Touch orbit/pinch/pan explicitly opt in, and users can restore page
scrolling. No permission is required.

## Pedestrian graph and development routing

`src/geo/routing.ts` is independent of React and Three.js. The current graph has
**394 nodes, 460 edges**. Undirected structural components have **387 / 4 / 3**
nodes; these counts describe raw connectivity before access filtering. No snapping
is used to conceal gaps. Only identical OSM node IDs connect paths. Cycleways are
excluded unless a pedestrian permission tag explicitly allows them; other road
edges are exploratory candidates, not a guarantee of walking access.

`NavigationNode`: source ID, geographic position, nullable barrier/access/foot.
`NavigationEdge`: source run + segment ID, endpoints, ENU distance, path type,
nullable access/foot/wheelchair/incline/indoor/layer/bridge/tunnel/oneway metadata,
stairs `true` only for source steps (otherwise unknown), temporary availability.
Missing tags remain null/unknown. Unknown wheelchair status never means accessible.

The Dijkstra experiment excludes explicit foot/access no/private, wall/fence
nodes, closed edges and supplied temporary closure IDs; respects `oneway:foot`
yes/-1. Unknown access is allowed **only to test topology**, with a warning.
It does not interpret all possible OSM conditional restrictions, opening hours,
turn restrictions, ramps or gate operation. Do not expose this as navigation.

At `http://127.0.0.1:5173/map?debug=1`, the development-only panel can choose source
nodes, calculate and draw a route. Default example:
**6351559630 → 4393165315, 36 edges, 1163.09 m in the graph**. Clearing removes it.
The panel and routing algorithm are excluded from the production route bundle;
`?debug=1` on production does not enable them. The ODbL graph download is public,
but is neither fetched by normal visitors nor included in offline core.
Tests also cover disconnected/invalid nodes, shortest path, one-way direction,
barriers, private access and temporary closures.

## GPS preparation and missing navigation data

`gpsCandidates` takes a supplied coordinate and accuracy radius; it **never calls
geolocation**. It projects candidate points onto allowed graph segments within
max(10 m, reported accuracy), returns up to five candidates and offsets, and flags
ambiguity. Accuracy outside 0–100 m or nonfinite values is rejected as unreliable.
These are provisional candidate-search limits, not a GPS quality guarantee. No
single-path confidence or exact campus position is implied. There is no automatic
location tracking, heading, permission prompt or offline GPS promise.

Before public walking navigation, collect/verify:

- Surveyed/maintained walkable network, missing links and real crossings; review
  boundaries, islands, level separation and disconnected paths on site.
- Correct accessible building entrances connected to graph nodes; opening times,
  public/private access and campus gate rules (especially the generic OSM gate).
- Stairs, ramps, curb cuts, width, surface, slope, temporary works, lighting and
  appropriate no-go areas; authoritative accessibility review.
- Event-specific stages, booths, entrances, barriers and closures, ownership,
  validity windows, release/revision process and stale-offline behavior.
- Verified destinations and arrival points rather than label centroids; content
  permissions and current official names, including recent renamed buildings.
- Geolocation consent/manual start flow, accuracy/ambiguity display, off-route
  behavior, poor signal/indoor cases and device testing. No AR in this phase.
- Terrain/height datum if slopes or vertical routing are introduced; GPS/ENU
  altitude must not be treated as surveyed ground elevation.

## Offline behavior

Explicitly saving core pages now includes the optimized campus JSON, its license
and the light SVG fallback. Service-worker version hashing includes data/license
bytes as well as hashed route assets, so geometry updates cannot quietly reuse an
old immutable snapshot. Raw XML, normalized data, route graph and Three.js are not
precached. A saved version can display the campus plan and list when the renderer
is unavailable offline; first-ever offline visits or cache eviction cannot promise
that. Offline geometry is a dated snapshot, not live closure information. Full 3D
packages, offline route guidance and geolocation availability remain future work.

## Validation and performance

Source comparison: viewed the official 2026.08.12 building PDF, accounting for its
oblique camera and compass (not north-up). Compared the campus outline, sports
oval, north-side lake with island, library/admin cluster to the east, Engineering
1 southeast of the sports oval, and the major road/open-space arrangement. These
are recognizable relative-position checks, not georeferenced error measurements.
The newer official building labels/artwork are not silently substituted for OSM
names or heights. Official vs community differences require a future maintained
crosswalk. The 3D map and SVG both use the same geographic inputs and projection.

Automated checks: origin at zero; independent approximate WGS84 meridian/parallel
scale near 25°; cardinal axes; corner/origin forward-inverse error <1e-9 degrees;
closed rings, preserved lake hole, original path adjacency and finite distances;
Dijkstra/GPS candidate cases. `npm run map:test` has six passing test groups.
The route example checks only topology, not geographic ground truth.

Browser checks use local Chrome headless on this Mac, 1440×900 and touch-enabled
390×900. Program → Event → geographic Map → Back, POI focus, unlocated/unknown
states, zoom/rotation/reset, desktop pan, keyboard pan/no focus trap, one/two-finger
controls, scroll opt-out, reduced motion, idle stop, renderer import failure,
WebGL context loss, dataset failure/retry affordance and saved-core offline plan
were exercised. No unexpected page errors in the normal cases; axe reported no
WCAG A/AA violations in the map main content at both widths. This is not a full
accessibility certification. Real iOS/Android devices, safe-area/standalone behavior,
screen-reader operation and low-end mobile GPU/thermal behavior remain unverified.

Interaction review applied Emil/mobile-native principles:

| Before | After | Why |
| --- | --- | --- |
| Prototype spatial positions | Source-backed focus; unlocated fixtures stay absent | Selection must communicate actual source context |
| Narrow toolbar clipped when forced to one row | Map-scoped maximum-width override with ≥44 px controls | All camera controls must remain visible on 390 px |
| Pointer-only pan | Focusable map with arrow-key pan plus native POI list | Equivalent operation without dragging |
| Optional 3D failure leaves only text | Source-backed SVG plan plus list and retry | Preserve geographic value without WebGL/offline renderer |

Measurements and limits below are laboratory observations, not field Core Web
Vitals or real-phone performance claims. Gzip sizes are computed asset sizes;
local Vite may deliver uncompressed bodies.

| Measurement | Phase 1 result |
| --- | --- |
| Optimized campus data | **133,778 B raw / 23,844 B gzip** (130.64 / 23.29 KiB) |
| Developer graph | **198,793 B raw / 13,973 B gzip**; not normal map traffic/cache |
| Lazy Three.js + campus engine | **599,656 B raw / 150,289 B gzip** (146.77 KiB gzip) |
| Map shell + projection + SVG fallback JS | **8,189 B raw / 3,687 B gzip** |
| Shared entry JS | **284,900 B raw / 90,885 B gzip** |
| Geometry per overview | **10 GPU geometry objects**, 5,821 triangles, 44 draw calls, 0 textures |
| Geometry attribute/index buffers | **450,828 B** (CPU typed-array byte total; excludes renderer/driver/framebuffer overhead) |
| Live JS heap after initial map | **8.79–9.36 MB**, measured with Chrome DevTools Protocol; whole page, not just Three.js |
| Initial map ready, desktop | **833 / 836 / 859 ms**, 3 fresh browser contexts on localhost, unthrottled |
| Initial map ready, 390 px | **838 / 839 / 875 ms**, 3 fresh touch-emulated contexts; not a physical phone |
| Active input RAF intervals | Desktop median 16.7 / p95 16.8 ms (39 samples); touch pinch/pan median 16.7 / p95 16.8 ms (73 samples). Browser scheduling intervals, not GPU timing or certified 60 fps. |
| Idle | Draw count stays constant after selection settles; no continuous animation |
| Teardown exercise | 3 route-away/return cycles: canvas removed, restored geometry count stays 10. Post-GC non-map heaps 5.97 / 6.23 / 6.44 MB; this short run does not prove absence of long-session leaks. |

Gzip figures above use Node `zlib.gzipSync` on emitted bytes (consistent with the
data-size script); Vite's displayed gzip estimates differ slightly. No exact GPU
memory figure is claimed. Device pixel ratio is capped at 1 on coarse-pointer
maps / 1.5 otherwise, with a 1.2-million-pixel framebuffer ceiling. Merged materials,
shared marker geometry, no textures/shadows and no idle render loop limit cost.

**Budget exception recorded, not hidden:** eager entry + map shell + lazy engine
on a direct `/map` visit totals about **239.12 KiB gzip JS**, above the provisional
150 KiB ordinary-route budget. The map is the separately authorized 3D workstream;
its engine remains isolated from Home/Program and from offline core. Retain this
as a measured Phase 1 exception, not a new site-wide budget. Production readiness
still needs physical-device/network profiling and a decision about opt-in 3D
loading on constrained devices. The build still warns about the >500 kB raw engine
chunk and existing React Router `use client` directives; it completes successfully.

Determinism: rerunning `map:data` twice from the retained source produced identical
SHA-256 hashes for campus JSON, graph JSON and the shared Location catalogue.
No dependencies, E2 visual exploration, final DESIGN change or official festival
brand assets were added in this phase.
