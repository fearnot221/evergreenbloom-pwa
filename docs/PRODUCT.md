# Product definition: 松櫻祭

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

## Approval, status, and evidence

Original product definition approved on 2026-09-30, including announcement
provenance, honest language availability, and recognizable digital identity.
**Amended on 2026-09-30 by the user's Festival Web App expansion.** The approved
product is now a multi-page, installable event companion with a functional 3D
campus festival map and one expressive, single-page homepage. A subsequent approved
amendment requires **architectural readiness for future pedestrian navigation**.
Full navigation is not required in the current prototype.

**Amended 2026-10-16:** the user replaced the Direction E / Bloom visuals with the
春空 Spring Sky direction derived from the second-edition social posts (see
[DESIGN.md](DESIGN.md)). Bloom references in later sections are historical context;
their requirements apply to the current direction where they still make sense. The
implemented app includes the multi-page shell, shared typed prototype data, a Three.js
campus map built from OpenStreetMap geometry (community data, not surveyed, not a
navigation tool) and the PWA/offline foundation. `/` is the homepage; `/e` redirects
to it; the `/motion` lab and GSAP were removed. Official branding remains open.

**Second-edition facts supplied 2026-10-16** (a screenshot of the official social grid):
the upcoming edition is the 第二屆 松櫻祭 of 國立中央大學, and the official account has
published posts titled 活動說明會, 工人招募 and 特約商店. Dates, venues, terms and shop
lists were not part of the material and remain unconfirmed. See [ARCHITECTURE.md](ARCHITECTURE.md)
and the latest [prototype notes](PROTOTYPE-NOTES.md) for implemented boundaries
and verification. Requirements below retain their approval and factual scope.

**Amended 2026-10-17 (v5 「櫻吹雪」).** Sakura pink became the main colour and the UI was
rebuilt to an editorial, motion-led standard (GSAP ScrollTrigger, SplitText, timelines).
The home page keeps the plan's three parts and adds a manifesto, 松 / 櫻, and 走進中央
sections that elaborate the 理念 and lead to the map and stamp rally. See DESIGN.md.

**Amended 2026-10-17 (v4 redesign).** The whole UI was rebuilt to the same site plan:
primary navigation is the plan's outline, the home page has only the plan's three parts
(subtitle, live direction, partners), and the sakura burst and scroll petal fall are
implemented with GSAP. 最新消息 and 來訪須知 remain as footer pages. See [DESIGN.md](DESIGN.md).

**Amended 2026-10-16 (site plan 「松櫻季官網規劃」).** The site splits into two parts on one
origin: the official site (static reading, no login) and the 大地遊戲 實景集章, which runs
only in the installed PWA (`/game`, gated on `display-mode: standalone`). The site adds
`/play` (install guide, planned sign-in methods, photo privacy), `/partners`, `/donate`
(no channel yet; no account numbers are published) and, on About, purpose, sustainability
(campus wood, tentative) and a second-edition timeline. QR codes point at
`/stamp/<spot>?k=<key>`; a browser visit keeps the claim and points the install at it so
the app opens on that stamp. Sign-in (Portal for campus members; Google and LINE for
visitors) needs the game backend and is shown as not yet open; until then stamps are kept
on the device. Stamp spots, questions and keys are prototype placeholders.

Festival facts below remain the user's supplied context. Preserve their factual
scope and verify publication-ready copy against official sources before release.
Future dates, venues, program, assets, and geographic accuracy remain unconfirmed.
The initial documentation-only inspection and earlier phases are historical;
their lack of implementation is not the current project state.

## Product purpose and positioning

The website is the intended permanent official digital home for 松櫻祭, a
student-led spring campus festival at National Central University. It is a
multi-page, installable Festival Web App: a persistent digital home and event companion with a long-term festival identity, rather than a separate
promotional website for each edition.

It has two complementary responsibilities:

- Help visitors understand the festival's purpose, origins, and connection to NCU.
- Help attendees plan and navigate their visit as confirmed information becomes available,
  including cross-linked program, activity, and location information and useful offline access.

The site should express the identity and atmosphere of 松櫻祭 and invite exploration
after essential information is easy to access. It should not feel like a
conventional university event website, a generic event landing page, or an
AI-generated template. Distinctiveness must serve this particular festival.

Positioning the site as its intended official home does not make every website
announcement equivalent in institutional authority to an official NCU announcement.
Announcement source and context must be representable and made clear when necessary.

## Target users and priorities

Primary audience: NCU students and people who may attend 松櫻祭.

Secondary audiences include:

- People discovering the festival for the first time.
- Returning visitors seeking schedules, updates, or practical information.
- Alumni, visitors, and members of the public exploring NCU in spring.
- Performers, participating organizations, collaborators, and sponsors.

The attendee experience has highest priority. Visitors should quickly understand
what the festival is, when and where it takes place, what is happening, the
schedule, and important attendee information whenever those details are confirmed.

Usability, accessibility, mobile experience, and performance take priority over
decorative effects. Interaction and motion may contribute to the experience, but
each must have a clear purpose. 春空 Spring Sky now provides the shared visual/motion
language; it does not require every page to reproduce the homepage entrance.

## Factual festival identity

松櫻祭 is a new spring campus festival intended to develop a distinctive recurring
spring tradition associated with NCU. It combines the campus environment, student
creativity, arts and culture, and a stronger sense of campus identity.

The name has specific meaning:

- **松 (pine):** resilience, growth over time, and NCU's strong academic foundation.
- **櫻 (cherry blossom):** spring, new beginnings, creativity, vitality, and blooming.

Together, these express a movement from NCU's established, resilient academic
tradition toward creativity, expression, and new ideas.

Cherry blossoms are connected to the real campus landscape and university history,
not merely a decorative theme. Cherry trees around the NCU lake were donated by
Chuo University in Japan following the universities' sister-school relationship.
These include Kawazu-zakura and other cherry varieties.

The festival is student-led. Its broader purposes are to:

- Strengthen campus identity.
- Encourage students to participate in shaping campus culture.
- Bring more arts, culture, and creative activity into university life.
- Allow students, alumni, visitors, and the public to experience NCU in spring.
- Establish 松櫻祭 as something people associate with spring at NCU.

## Historical context: first edition, 2026

These are historical facts from the supplied research, not upcoming event details.

| Item | Supplied 2026 information |
| --- | --- |
| Festival period | February 6–March 7, 2026 |
| Opening | February 6 at the NCU Lake Plaza area |
| Main festival / market day | March 7, 2026 |
| University event connection | March 7 program connected with NCU Open House Day |

Known first-edition activities included cherry blossom viewing around the NCU Lake
area; festival photo/check-in installations; limited commemorative gifts linked to
participation tasks; 松櫻市集; food and market stalls; student club performances;
opening performances involving student music clubs; and campus exploration and
visitor activities.

The associated Open House Day also included department exhibitions, academic
introductions, facility visits, and campus exploration. These broader university
activities must not automatically be presented as core 松櫻祭 programming in future
editions.

At initial launch, include a concise account of 2026 within the festival story to
explain origins and continuity. Do not attempt exhaustive documentation or create
a dedicated Past Editions section.

## Release scope and festival lifecycle

Release stages describe capabilities and content readiness, not a commitment to
build all pages now or a confirmed launch date.

| Stage | Scope |
| --- | --- |
| Architecture / next prototypes | Validate route structure, shared content references, Bloom continuity on inner pages, event-to-map selection, and install/offline behavior |
| Public presence | One expressive homepage plus detailed festival story, announcements, and approved organizer/partner content; installable shared shell with honest offline behavior |
| Attendee companion expansion | Confirmed program, activity details, functional campus festival map, visitor guidance and FAQ, with cached essential information where available |
| Later evolution | Live updates when maintained, post-event continuity, and a dedicated archive only when required |

Multi-page architecture, installability, and the functional 3D map are now approved
product requirements. Which content is publishable, and the delivery sequence,
depend on verified materials and prototype validation. A missing schedule must
produce a clear pending state, not an invented event. Do not expose a large set of
empty pages merely to demonstrate the architecture.

Use one persistent product throughout:
Festival introduction → Edition announcement → Program release → Attendee planning
→ Live event information → Post-event recap/archive when required → Next edition.

Current edition context must be consistent across homepage, program, events, map,
and cached data. Historical editions remain distinct. No dedicated Past Editions
section or separate website per edition is required for the initial release.

## Information architecture

The **homepage is one continuous page; the product is multi-page**. Routes below
are working proposals, not permanently locked URLs. Their content responsibilities
are the intended architecture.

| Proposed route | Responsibility | Bloom interpretation |
| --- | --- | --- |
| `/` | Expressive overview and entry to the app | Preserved Bloom opening, selected information, closing experience |
| `/about` | Full festival story, identity, origins and concise 2026 history | Editorial / storytelling |
| `/program` | Complete chronological program and schedule | Information-first, subtle state feedback |
| `/events` | Explore activities, performances, special events and market content | More expressive discovery |
| `/events/:eventId` | Reusable event detail; linked sessions and locations | Expressive framing around clear facts |
| `/map` | Functional 3D campus festival map with an accessible location alternative | Spatial / immersive, task-driven |
| `/news` and `/news/:announcementId` | Updates, source/context, readable full announcements | Editorial and readable |
| `/team` | Approved organizing team and contributors | Human and expressive |
| `/visit` | Transportation, practical attendee guidance and FAQ | Calm and practical |

Refinements proposed: program organizes **when**, events explains **what**, and map
explains **where**; these are shared entities presented for different tasks.
Event and announcement details need shareable destinations. Keep the edition
summary on Home and edition context across relevant pages initially; a separate
`/edition` route is not yet required. Sponsor/partner acknowledgment belongs on
Home and contextually with team information when approved; no separate sponsor
route is currently required. See ARCHITECTURE.md for validation of this proposal.

The homepage approximately contains:

- Bloom key visual and concise festival introduction.
- Current edition overview when available.
- Featured / important activities and selected schedule highlights.
- Latest important announcements.
- Lightweight campus / map preview linking into `/map`.
- Approved organizer information and sponsors / partners.
- Closing experience.

Each preview links to its full destination and draws from shared data. Home must
not become the full story, complete schedule, event directory, and FAQ combined.
Missing sponsor/team/edition details remain TBD in maintained content; do not
invent identities, logos, or relationships to fill the homepage.

Navigation must expose all published destinations with a consistent active state.
A mobile **Home / Program / Map / More** model is a candidate to prototype, not a
locked navigation decision. Inner pages retain Bloom through typography, color,
composition and purposeful transitions, without requiring a large animated hero.
Direct links, browser Back, keyboard focus, and reduced motion take precedence
over transition choreography. No forced homepage opening before a deep link.

## Primary user journeys

| Need | Journey | Successful outcome |
| --- | --- | --- |
| Discover 松櫻祭 | Home overview → About | Understand the festival, origins and NCU connection |
| Find an activity | Home highlight / Events → event detail → Program | Understand what happens and which confirmed occurrence to attend |
| Plan where to go | Program → selected entry → View on Map | Open the referenced location, highlight it, and show the same event/location facts; move the camera only when ready and appropriate |
| Explore campus festival locations | Map → location → related events / program entries | Connect physical context with confirmed programming |
| Check updates | Home / News → announcement | See source/context, publication/update time, and relevant edition |
| Prepare a visit | Program / event detail → Visit | Find confirmed transportation, attendance conditions and FAQ |
| Use the installed companion | Install when supported → Program / Map / More | Quickly reach practical information without replaying an entrance |
| Continue with poor connectivity | Open previously saved information offline | Read available schedule, event, visitor and announcement content with clear saved time and stale/offline status |
| Future navigation | Home highlight / Program → Event → location → Map → Navigate → choose current or manual start → route overview → follow progress | Reach a verified destination through campus using a pedestrian route; optional positioning and clear accuracy/freshness states |
| Understand organizers | Home → Team | Identify approved organizers/contributors and partners without implied institutional authority |

Offline cannot guarantee updates, unseen content, or cached asset retention. An
uncached destination should explain that it is unavailable and offer useful
cached alternatives. “View on Map” must still expose location details if 3D is
unsupported, unavailable offline, or loading. Unknown location IDs and unconfirmed
positions must never send visitors to fabricated coordinates.

## Content structure, maintenance, and publishing

A technical maintainer will update the first release. Do not introduce a CMS or
administrative dashboard. Keep frequently changing information structured and
separate from presentation code, including edition details, schedules,
announcements, performers, activities, booths, locations, organizers, and sponsors.
Repeated event facts should have a single maintained source rather than being hardcoded across components.

The content model must distinguish:

- Permanent festival information and story.
- Edition-specific information and its confirmation status.
- Historical material, clearly associated with its edition.
- Announcements with publication dates, edition context where relevant, and the
  ability to identify their source or communication context when necessary.
- Language versions and actual translation availability.

Do not imply NCU institutional endorsement or authority merely because an
announcement appears on this site. Preserve attribution when drawing on university
communications and distinguish their context from festival website updates.

Keep unconfirmed details marked **TBD** in maintained content and planning records.
Public pages should communicate what is pending without extensive empty sections
or navigation to unavailable information. Do not publish invented announcements,
performers, sponsors, registration requirements, metrics, or placeholder facts.

Structure content to accommodate future editions, translations, and eventual
archiving without rebuilding the site. Leave open a later CMS integration if
non-technical organizers need it; neither the CMS nor archive is part of this release.

### Shared product entities

Use stable shared identities for Festival, Edition, Event, ProgramEntry, Location,
Announcement, Organizer/Contributor, and Sponsor/Partner. An event describes an
activity; program entries describe its occurrences. Each occurrence references
its event and location(s). Map geometry references Location IDs rather than
containing an independent copy of event facts. Location is a conceptual entity
shared by events, program, booths, stages, POIs, map and future navigation; it is
never identified by a Three.js mesh ID. Multiple occurrences and changed
or canceled sessions must be representable without duplicating the event.

Home highlights and map details are projections of these records. Names, times,
location copy, source context, translations and confirmation status must not
diverge between pages. Distinguish real records from prototype fixtures and verify
references before publishing. ARCHITECTURE.md proposes the minimum schema; no
backend, CMS, or database service is required to support this model.

Future location data must accommodate geographic coordinates, versioned map/world
coordinates, entrances, POI types, navigation-node references and accessibility
metadata. Unknown coordinates or accessibility properties remain unknown. A
separate pedestrian graph contains nodes and edges, including distance, path type,
stairs, indoor/outdoor context and temporary availability. Routing logic consumes
this data independently of 3D presentation.

## Language requirements

Support Traditional Chinese and English structurally from the beginning.
Traditional Chinese is the primary language and has launch-content priority.
Complete English translation is not a prerequisite for initial launch unless a
specific content need later makes it necessary.

Use shared content/page structures so localization does not duplicate the site's
architecture or make maintenance unnecessarily complex.

Language availability must be honest and predictable:

- Do not silently insert large amounts of Traditional Chinese content into an
  English page when translation is missing.
- Clearly explain when content currently exists only in Traditional Chinese.
- Provide an obvious way to view the Traditional Chinese version.
- Partial translation is acceptable, with untranslated content and its availability
  clearly identified rather than presented as a completed English version.

The precise localization implementation is deferred; these are product behaviors.

## Functional and experience requirements

- Provide semantic, responsive pages with keyboard access, honest language states,
  visible focus, and direct navigation independent of visual effects.
- Preserve successful Bloom opening and scroll behavior while translating its
  language across inner pages at task-appropriate intensity.
- Support direct route loads, Back/Forward, meaningful route titles, and selected
  event/location state without replaying the homepage entrance.
- Make historical, confirmed, pending, changed/canceled, and cached information
  distinguishable. Announcements retain their communication context.
- Treat the 3D map as a functional tool with clickable places, markers, location
  detail, program/event links, selection highlighting, and camera framing.
- Buildings, stages, booths and points of interest require verified data for public
  use. Until then, map geometry is explicitly prototype-only, not geographically
  accurate NCU modeling. Supply a text/list or simplified alternative.
- Isolate expressive effects from the functional campus renderer. Ordinary pages
  and the homepage preview must not fetch or depend on the full 3D map system.
- Make the product installable on supported browsers through a coherent manifest,
  standalone presentation, approved app icons, and appropriate deployment.
- Provide a service worker/app-shell and deliberate offline behavior: useful
  previously available schedule, event details, visitor guidance, and announcements;
  clearly limited map/offline functionality and transparent data freshness.
- Never require installation, 3D support, connectivity, or animated transitions to
  read information already available in an accessible form.
- Apply [INTERACTIONS.md](INTERACTIONS.md) and [PERFORMANCE.md](PERFORMANCE.md).
  New architecture and release validation are specified in
  [ARCHITECTURE.md](ARCHITECTURE.md); no expanded-app compliance is claimed yet.

### Future pedestrian navigation — approved architectural requirement

The installed PWA should eventually support event-day walking navigation:
Home → next event → Navigate; Program → Event → Navigate; and Map → POI → Navigate.
A “next event” link uses confirmed schedule data and does not imply a personalized
calendar or new account feature. The future flow selects a destination/entrance,
chooses a starting point, calculates a pedestrian route, shows an overview, and
can follow progress when a sufficiently reliable current position is available.

Required boundaries now, implementation later:

- Campus data → shared Location/POI → pedestrian graph → routing engine → route
  result → 3D or alternative visualization. Three.js is a presentation layer;
  route calculation must be testable without rendering a map.
- Support festival-specific overlays for temporary stages/booths/entrances,
  pedestrian-only paths, closed paths, barriers, event-specific routes and access
  constraints. Overlay validity and source belong to the edition, not baked geometry.
- Browser geolocation is optional and requested only after an explicit location
  action. Opening a map, selecting Navigate, or installing the PWA must not
  automatically prompt for location. Manual starting-point selection remains usable.
- Show current-position accuracy and age; do not assume exact GPS, a correct path
  match, or reliable indoor/background/offline positioning. Permission denial,
  unavailable positioning and uncertain fixes retain manual route overview.
- Make accessible-route planning possible through verified entrance/path data,
  including stairs, slope and other suitability constraints. Unknown does not
  mean accessible; no accessible-routing promise before survey and validation.
- Plan to cache compatible campus/location/graph data and routing resources for
  poor connectivity. Cached routes cannot prove that temporary paths are still
  open. State data age and limitations; do not promise live location offline.

This amendment authorizes documentation and data boundaries only. It does not
implement routing, progress tracking, location access or AR, nor establish route
accuracy. Data prerequisites and validation gates are in ARCHITECTURE.md.

## Identity and design boundaries

During Research and Design, distinguish clearly between:

1. **Factual festival identity:** the festival's meaning, history, campus connection,
   student-led character, and purpose.
2. **Existing official visual identity:** authentic logo, key visual, brand rules,
   and other official materials once collected.
3. **New digital design direction:** proposed website art direction and expression,
   which must not be presented as official festival branding by default.

Do not invent or recreate an "official" logo or brand identity. A new website
visual system should complement the official 松櫻祭 identity once assets are
provided, rather than silently replacing it. Temporary exploration is not official
branding. Missing final assets should not block product architecture, research, or
early design exploration when those phases are separately authorized.

The website should establish a recognizable digital identity for 松櫻祭 without
compromising access to essential information.

Distinctiveness should come from intentional art direction, typography,
composition, interaction, storytelling, and appropriate use of festival materials,
not unnecessary complexity or decorative effects. Bloom is now the working digital
direction across the product; official logo, assets, final palette and typography
remain unapproved. Existing E work is preserved, not restarted.
See [DESIGN.md](DESIGN.md) for baseline quality principles; it is unchanged by this task.

## Pending materials and constraints

| Area | Status |
| --- | --- |
| Next edition dates, theme, venues, programs, performers, schedules | TBD |
| Attendance and registration requirements | TBD |
| Official 松櫻祭 logo files and visual identity / key visual | TBD / pending collection |
| Approved photography and official copywriting | TBD / pending collection |
| Official social media accounts and organizer contact information | TBD / pending collection |
| Sponsor/partner identities and assets | TBD / pending confirmation and collection |
| Brand usage requirements | TBD / pending collection |
| Publication and photography permissions | TBD / pending confirmation |
| Domain and hosting | TBD |
| Institutional publishing requirements | TBD |
| Launch deadline | TBD |
| Verified campus geographic data, building models, coordinate system, map rights | TBD / required before accurate public map claims |
| Festival locations, stage/booth positions and accessible paths | TBD / edition-specific confirmation required |
| Approved app icon variants and standalone presentation assets | TBD / do not invent official branding |
| Verified pedestrian network, entrances, path dimensions/slopes/surfaces, access rules and festival closures | TBD / authoritative sources, field verification and update owner required |
| Coordinate alignment and positioning reliability on campus | TBD / validate before navigation claims |
| Supported device/browser matrix, offline freshness policy and storage allowance | Proposed in ARCHITECTURE.md; validate before production |

Collect the official asset package before final production design. Publicly
available reference material does not establish permission to republish its assets.

Avoid unnecessary platform lock-in. Keep deployment feasible as a modern web
application or static site, depending on final infrastructure needs. Do not choose
a hosting provider during this amendment. React/TypeScript/Vite and GSAP already
exist in the prototype; preserve this investment. Routing, production rendering,
service-worker tooling, and map integration choices remain proposals. Deployment
must support secure delivery, deep links, correct asset types/cache headers, and
service-worker scope; these constraints do not select a vendor.

## Non-goals and scope boundaries

- This task changes documentation only; no new pages, PWA registration, packages,
  detailed 3D models, or further E visual iteration.
- No restart of Bloom, revival of A/B/C/D, or finalization of DESIGN.md.
- No separate website per edition or dedicated archive at launch.
- No CMS, backend, authentication, registration/ticketing system or push notifications.
- Full pedestrian routing and progress tracking are future capabilities, not current
  implementation scope. No AR navigation, automatic location permission request,
  fabricated paths, or guaranteed background tracking.
- No assumed future facts, real-looking unverified geography, or reuse of 2026
  programming as next-edition confirmation.
- No invented official assets, team identities, sponsor relationships or authority.
- No guaranteed full offline 3D campus or always-current offline announcements.
- No requirement for complete English translation before initial launch.
- No locked route spelling, mobile tab structure, hosting vendor, or 3D wrapper
  library merely because it appears in the proposed architecture.

## Acceptance criteria

For the intended expanded release (not claims about the present prototype):

- Home quickly communicates the festival and highlights priority content; complete
  detail remains reachable on dedicated pages without expanding an exhaustive homepage.
- About preserves the festival's meaning, NCU connection and clearly dated origins.
- Bloom continuity is recognizable on inner pages without delaying practical tasks.
- Program, event details and map resolve consistent times, statuses and shared
  locations; a program deep link selects the correct place and associated content.
- A location remains readable and selectable when 3D fails; prototype geography is
  unmistakable until verified data replaces it. Camera movement honors reduced motion.
- Navigation works on narrow phones, keyboards, direct entry and browser history.
  Language availability remains explicit and predictable.
- Supported installations open the shared app coherently. Without installation,
  the same core product remains accessible through a browser.
- After relevant content has been saved successfully, offline use exposes that
  content with edition and freshness context; unavailable content and stale updates
  are honestly represented. Reconnection can surface changed or canceled sessions.
- Approved organizers/partners are identified without fabricating missing assets.
- Ordinary route loads and homepage previews request no campus renderer, model,
  texture, or decoder bundles; route and map performance pass their separate gates.
- Technical maintainers can update shared structured content once for all views,
  without a CMS or yearly redesign.

Current architecture acceptance additionally requires a renderer-independent
Location/entrance/graph model and routing-result boundary, optional positioning,
manual start selection, festival overlays, and explicit future validation gates.
Successful live pedestrian guidance is not an acceptance claim for this prototype.

The website should establish a recognizable digital identity for 松櫻祭 without
compromising access to essential information.

Remaining decisions are explicit: final route grouping/mobile navigation, verified
map data and rights, map quality and rendering choices, offline scope/freshness,
update behavior, pedestrian data/closure governance, routing and positioning
validation, supported devices, and deployment. The functional 3D map and
installable multi-page product are approved; the implementation proposals and
prototype results are not yet validated. See ARCHITECTURE.md.
