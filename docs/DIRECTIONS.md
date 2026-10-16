# 松櫻祭 — Design direction exploration

Phase 4 record with Direction D exploration added · 2026-09-30.

**Current status:** The user rejected A/B/C as design directions after prototyping.
They remain documented below as historical experiments, not candidates to polish
or combine. Direction D is a new reference-led exploration, not an approved final
design. The original Phase 4 scope statements below describe that earlier phase;
the D addendum records the subsequent authorization for a working prototype.

## Scope and shared commitments

This document transforms [PRODUCT.md](PRODUCT.md) and [RESEARCH.md](RESEARCH.md)
into three deliberately different design philosophies. It does not amend either
source or finalize [DESIGN.md](DESIGN.md). No mockups, application code, logo,
palette, typeface, framework, or animation library is selected or created.

Taste informs hierarchy, spacing, rhythm, and intentional composition. Emil
Kowalski's principles inform purpose, frequency, state feedback, and continuity.
Hallmark informs the explicit anti-template checks below. Their implementation
presets do not override this brief. GSAP does not inform any direction.

All three retain the approved destinations: Home, Festival Story including concise
2026 origins, and News; Current Edition and Visit become useful when confirmed
content exists. Different presentations do not create three different products.
No dedicated archive, CMS, account, ticketing, submission, or personalization
feature is introduced. Future program, venue, performer, and other details stay TBD.

### Identity boundaries

- **Factual identity:** NCU, the actual campus landscape, student-led culture,
  spring, festival origins, and the meanings of 松 and 櫻 inform the content.
- **Existing brand:** official logo, key visual, approved copy and photographs,
  permissions, and usage rules remain pending collection. None is invented here.
- **Digital opportunity:** the three systems below are proposals for organizing
  and expressing that content. Their working descriptions are not public branding.

Each direction must work with the approved factual text alone. Missing images do
not produce placeholder rectangles, synthetic student artwork, or invented voices.
When approved materials arrive, they enter defined roles rather than forcing the
entire concept to be rebuilt. No direction assumes pink, green, petals, Japanese
lettering, torii, or a borrowed festival motif.

### Common functional floor

Essential information remains readable text, reachable through ordinary named
links. Traditional Chinese is primary; English shares structure and receives
explicit translation-availability notices and links to Chinese-only content.
Announcements identify date, edition, and source/context where necessary. Historical
facts cannot look upcoming. No countdown or live status is implied by an event date.

The accessibility, reduced-motion, and performance rules in
[INTERACTIONS.md](INTERACTIONS.md) and [PERFORMANCE.md](PERFORMANCE.md) apply to all
three. Default experience is complete without decorative motion. All costs and
benefits below are hypotheses, not measurements or compliance claims.

### Shared interaction check

These foundational interactions apply across A, B, and C. Direction-specific
interactions receive additional checks in their own sections.

| Interaction | PURPOSE | WITHOUT IT | COST and decision |
| --- | --- | --- | --- |
| Named destination links, current-location indication, and browser back | Move directly through the approved IA and remain oriented | Users lose reliable access; retain | Small implementation burden; maintain semantics, focus, and history. No animated route gate |
| Language switch and explicit unavailable-translation notice | Reach a readable version without a surprise language change | Bilingual access becomes unpredictable; retain | Content parity and fallback handling require care; no separate duplicated page architecture |
| Compact navigation disclosure only when links cannot fit comfortably | Expose destinations at narrow widths | Always-visible links are equally valid where they fit | Disclosure state, keyboard/touch, and focus handling; prefer a simple in-flow menu over a modal without need |
| Links from updates to relevant content | Explain published changes in their actual context | Visitors must reconcile disconnected facts; retain where relevant | Source-of-truth discipline; no duplicated manually maintained event facts or gratuitous notification toasts |

## Direction A — Editorial / Cultural

**Organizing principle: an edited sequence of ideas.** The festival becomes legible
through the relationship between a strong opening statement, supporting evidence,
and practical information. Composition follows editorial importance rather than a
uniform feed of articles. Research basis: A1–A4 and B1 in RESEARCH.md.

### 1. Core idea

Translate the authority and concentration of a cultural poster into a changing
reading system. Each page has a clear leading idea and an intentional sequence of
supporting material. The festival's identity emerges from what receives emphasis
and how text and evidence are placed together.

### 2. Emotional qualities

Considered, curious, culturally engaged, and open. It should feel made with care
by people invested in the festival, without becoming an austere museum or a
prestige publication that distances students.

### 3. Information hierarchy

At initial launch: identify 松櫻祭 and its current status, lead into its meaning and
NCU relationship, then offer origins and published updates. During attendance
planning: confirmed dates, places, program, and important changes take the leading
position; editorial discovery remains accessible below and through navigation.
Editorial importance never outranks a material attendee notice.

### 4. Layout/composition system

Use an asymmetric column structure with a stable reading column and a secondary
area for related images, captions, or references. Not every section occupies both.
Alternate a concentrated title or image with quieter reading passages; group facts
more tightly than stories. A few consistent alignment lines hold varied widths
together. No fixed full-screen opening and no repetitive title-left/card-right recipe.

Texture comes primarily from typographic density, image detail, and changes of
scale. Do not simulate paper grain to make an otherwise generic layout “editorial.”

### 5. Typography strategy

Distinct display, reading, and utility roles. Display text uses scale, line breaks,
and position to express an editorial argument; body text favors sustained Chinese
reading; dates and source labels remain plain and legible. A serif/sans pairing
is not mandatory. Test long Chinese titles and English expansion before choosing
fonts, weights, or display proportions. Never crop essential words for drama.

### 6. Image/art direction

Approved campus photographs can function as evidence beside a specific passage:
place, activity, or historical moment, with captions and credits. Student-created
materials can be presented as authored works rather than generic decoration.
Avoid a stock “campus life” collage or an image at every section boundary.
Without assets, text hierarchy and factual narrative remain a complete composition.

### 7. Color philosophy

Color establishes reading contrast and limited emphasis. Approved festival artwork
may bring its own color into bounded image areas; the surrounding reading system
must accommodate it. Status emphasis stays distinguishable from artistic emphasis.
No cream-paper palette or dark-ink aesthetic is assumed.

### 8. Navigation model

A stable, text-led contents model: clear destination links plus optional section
links within genuinely long stories. The reading sequence invites continued
exploration, but does not require readers to finish a chapter before navigating.
No imitation magazine categories, issue browser, or article carousel.

### 9. Interaction philosophy

Interactions shorten the distance between reading intent and information. The
editorial composition supplies expression; controls do not need theatrical behavior.

| Proposed interaction | PURPOSE | WITHOUT IT | COST and decision |
| --- | --- | --- | --- |
| Section links for a long festival story | Jump to meaning, campus relationship, or 2026 origins | Short stories lose nothing; long stories may become harder to scan | Anchor/focus and heading-offset handling. Conditional on real length; no scroll-spy or progress meter required |
| Related story or event-detail links beside their context | Connect an editorial claim to supporting detail | The relationship is harder to follow, although plain navigation still works | Link wording and ordering need care; use ordinary navigation, not a modal reading layer |

Page-turn effects, cursor-following imagery, and animated reading progress have no
convincing additional purpose here and are excluded.

### 10. Motion philosophy

Reading rhythm comes from the static composition. Navigation and anchors respond
immediately with native scrolling behavior; no forced smooth scroll. If a compact
menu is needed, a brief local state transition may clarify opening, but the same
state must be immediate under reduced motion. No staggered paragraphs or image
reveals. Removing expressive animation should not diminish this direction.

### 11. Mobile interpretation

Convert the asymmetric arrangement into a deliberate single reading sequence.
Bring related captions next to their images; move supporting notes inline rather
than shrinking a desktop side column. Preserve some changes of scale and spacing,
but shorten visual pauses around practical information. The mobile opening identifies
the festival and lifecycle status without demanding a screen-height scroll.

### 12. How attendee information behaves

Program becomes a readable date-grouped agenda with aligned time, name, and place,
not a grid of story teasers. Event detail starts with those facts and published
changes before descriptive content. Visit instructions use concise headings and
lists. Utility pages use denser spacing while retaining the same typographic roles.

### 13. How festival storytelling behaves

An intentional narrative connects the name, campus setting, student participation,
and first edition. Each section earns its scale through content. The campus is
understood through observation and history; student culture enters through verified
activities and, later, credited materials. No fabricated interviews or quotations.

### 14. How announcements behave

A dated, scannable index with meaningful titles and source/context. A significant
current update can occupy a prominent editorial position; minor updates do not
receive equally enormous headings. Detail pages retain publication and edition
context. Do not disguise notices as lifestyle articles.

### 15. How future editions fit

Permanent type roles and alignments persist while the leading content and approved
edition imagery change. Historical 2026 content remains within the story. A later
archive, if separately required, can reuse reading structures without creating an
“issue” feature now.

### 16. Accessibility considerations

Visual asymmetry must follow a coherent reading order. Check heading structure,
line length, zoom, caption contrast, and that large type does not obscure navigation.
No essential image lettering without equivalent text. English fallback notices
belong in the reading sequence, not an unobtrusive footnote.

### 17. Performance implications

Main exposure is type delivery and oversized editorial images. Limit font variants,
reserve image space, and deliver responsive crops. Text-led pages need little
interactive work. A sparse appearance is not proof of a small payload; measure
actual CJK fonts and the leading image against the shared budgets.

### 18. Risks

It could feel institutional, precious, or like a magazine template. It needs editing
discipline so every update does not become a bespoke composition. An art-directed
opening could push current information too low.

### 19. What would make the direction fail

Readers remember typography but cannot explain the festival; students find it
remote or formal; attendees must read past a feature story to find dates; or routine
content changes require manual layout repair. A decorative serif and whitespace
alone are not evidence of success.

### 20. What should be tested in prototype

Compare a text-only festival opening and story with the same structure containing
one approved image when available. Test the switch from introduction-led to
attendee-led emphasis, a long bilingual title, an announcement, and an agenda at
narrow widths. Ask users to explain the festival and find a published change before
asking whether they like the style. Check whether varied sections still feel like
one system without every section receiving a custom design.

### A — Hallmark check

| Pattern to avoid | Specific restraint in this direction |
| --- | --- |
| Generic SaaS hero | Opening identifies this festival and its status; no slogan-plus-two-buttons marketing scaffold |
| Card grids by default | Reading passages, captions, agenda rows, and announcement lists serve different content roles |
| Excessive rounded rectangles | Group with alignment and spacing; no box around every editorial fragment |
| Gratuitous gradients | Contrast and approved artwork provide emphasis; no ambient gradient layer |
| Glassmorphism | Text sits on stable readable surfaces, not translucent panels over photography |
| Decorative blobs | Every image is relevant evidence or credited work, not space-filling geometry |
| Repetitive scroll reveals | All passages and images are readable on arrival |
| Generic AI landing-page structure | Sequence follows meaning, campus relationship, origins, and current needs; no invented stats, testimonials, or CTA finale |

## Direction B — Campus / Spatial

**Organizing principle: relationships between real places.** The festival is
understood as something happening within NCU, and content repeatedly answers how
stories and activities relate to campus locations. This is place-based explanation,
not a map application or game. Research basis: A3, A6, B3, and the restraint in B5.

### 1. Core idea

Make the campus the connective context between festival identity and visiting.
A place has a name, a role in the story, and—only when confirmed—a relationship
to current activities and arrival information. Ordinary navigation remains primary;
spatial context gives the content another understandable relationship.

### 2. Emotional qualities

Situated, welcoming, exploratory, and grounded. A visitor should feel invited into
a real campus rather than transported into a fantasy festival world.

### 3. Information hierarchy

At launch: festival purpose and status, then its relationship to the NCU lake and
campus history, alongside updates. Later: date and program access remain immediate,
while confirmed place names connect events to Visit information. Time-first and
place-first questions must both be answerable; the site never forces a geographic
journey before showing a schedule.

### 4. Layout/composition system

Organize content as named place sections with a consistent relationship between
location context and related information. On wide screens, a bounded diagram may
sit beside a corresponding list, when verified geometry exists. Sections can also
work entirely through text and related links. Use adjacency and explicit labels,
not decorative coordinate grids or a free-floating canvas.

Density concentrates around destinations and their facts; quieter intervals
separate place stories. Texture, if present in approved photographs, conveys actual
surfaces and surroundings. No simulated topographic background or inaccurate route lines.

### 5. Typography strategy

Place names, event titles, and practical labels form a clear wayfinding hierarchy.
Readable Chinese names remain complete; English equivalents can expand beneath or
beside them. Utility text has strong consistency; story titles can be more expressive
without competing with location labels. Do not default to monospaced coordinates,
transit-map typography, or condensed sign lettering.

### 6. Image/art direction

Approved photographs should help recognize or understand a location: identifiable
context and truthful captions, rather than interchangeable scenic crops. Diagrams
require verified relationships and names; do not infer walk times, accessible paths,
or exact positions. A text-only description with place links works until appropriate
materials exist. No aerial artwork or reconstructed campus map is required at launch.

### 7. Color philosophy

Color may help distinguish selected context from surrounding information, paired
with labels and shape. Do not assign permanent palette identities to buildings or
use color as the only route cue. Official artwork enters a bounded editorial role;
its colors need not become functional wayfinding colors. No green landscape assumption.

### 8. Navigation model

Global Home, Story, News, and later Current Edition/Visit remain named links.
Within relevant content, named places link to related story or visit sections.
A map/list relationship is optional, subordinate navigation within Visit or a story,
not a replacement for the site menu. No compass controls, collectible landmarks,
forced route, geolocation request, or pan-to-find navigation.

### 9. Interaction philosophy

Selection should explain a spatial relationship. Interactions need a benefit for
someone unfamiliar with campus, not just a satisfying moving diagram.

| Proposed interaction | PURPOSE | WITHOUT IT | COST and decision |
| --- | --- | --- | --- |
| Place-name link to related context or arrival details | Connect an activity/story to an actual location | Users must search separately for the place; retain when relevant content exists | Stable names, anchors, and verified content; ordinary links with back behavior |
| Select a place in a bounded diagram or equivalent list | Highlight correspondence and expose the same place details | A static labeled diagram and list may fully suffice | Duplicate-input consistency, focus, selected state, touch targets, and modest client work. Conditional experiment; remove unless it improves orientation |
| Return from place detail to the same selected context | Preserve orientation when comparing places | Lost selection may force repeated searching if the list is substantial | History/state restoration complexity; only needed if the selected-context experiment survives |

No animated camera flight, draggable world, or automatic “tour.” The diagram must
never hide essential content behind selection; the equivalent list is independently useful.

### 10. Motion philosophy

A selection may change emphasis locally to show correspondence. First test it as
an immediate change; a short opacity transition is optional only if it improves
comprehension. Keep the frame still—do not simulate travel through campus. Under
reduced motion, selected labels and content update immediately. No library or 3D
rendering capability is needed to express the principle.

### 11. Mobile interpretation

Place names and relevant details become the main reading sequence. An optional
compact overview diagram can precede them without becoming a full-screen map.
Selecting a place must not open a bottom sheet that conceals its essential details
or traps scrolling. No miniature desktop labels, pinch-to-read requirement, or
horizontal pan needed to discover destinations. Time-first agenda access stays visible.

### 12. How attendee information behaves

An event's date/time and named venue appear together, with a direct link to verified
arrival information. Visit groups guidance by destination when useful. A general
agenda remains available without selecting a venue. No proximity sorting, inferred
walking directions, or claims that a route is accessible without verification.

### 13. How festival storytelling behaves

The actual campus supplies the narrative context: the lake and cherry-tree history,
then the festival's student-led use of campus as supported by facts. Place is a way
to connect stories, not an excuse to manufacture stories for every building.
Students appear as people shaping campus activity, not decorative map avatars.

### 14. How announcements behave

All updates remain in a dated News list. If a confirmed update affects a location,
link it from the corresponding event/Visit context as well, using one maintained
source. Important non-location updates stay prominent; do not force every notice
onto a map pin or duplicate the announcement text manually.

### 15. How future editions fit

Keep stable place identities separate from edition-specific event associations.
A location can have historical context without being an active venue. New editions
change confirmed associations; they do not redraw the navigation architecture.
No speculative future venue appears just to fill out a diagram.

### 16. Accessibility considerations

Spatial information needs a complete text equivalent. Diagram controls need readable
labels, keyboard access, distinguishable selection, and sufficiently separated touch
targets. Screen-reader order follows the list. Avoid focus jumps when selection
changes. A map is supplemental; accessibility cannot depend on interpreting geometry.

### 17. Performance implications

A static diagram and text can be inexpensive; image-rich maps and mapping services
can be costly. No external map SDK, live location, WebGL, or Canvas is part of this
concept. Any selection enhancement should stay local. Verify diagram readability
and transfer size; do not load a high-resolution campus poster to make labels work.

### 18. Risks

It may imply geographical accuracy that has not been verified, feel like a campus
facilities directory, or overemphasize movement when the program is concentrated in
one place. Spatial views can impose more work on mobile than a simple event list.

### 19. What would make the direction fail

People cannot connect an event to its venue; they mistake historical places for
current venues; the useful spatial relationship disappears without an unavailable
map; or finding time/place is slower because everything routes through geography.
If the confirmed program gives place little explanatory value, reduce or reject
this direction rather than inventing a complex campus journey.

### 20. What should be tested in prototype

Start with a text-led campus story and ordinary place links. Separately compare a
verified static diagram/list against a selectable version if enough relevant places
exist. Ask unfamiliar visitors to identify a place relationship and reach event
arrival details, then ask returning visitors to find a time without using the map.
Test back navigation, keyboard selection, reduced motion, and the mobile list.
If geometry is unavailable, test the content relationship alone and record spatial
usability as unresolved; do not fabricate a campus for the test.

### B — Hallmark check

| Pattern to avoid | Specific restraint in this direction |
| --- | --- |
| Generic SaaS hero | Opening establishes a real campus relationship and current festival status, not a marketing promise |
| Card grids by default | Named place sections, related lists, and optional diagram/list correspondence do the organizing |
| Excessive rounded rectangles | Locations are labels and relationships, not a grid of rounded destination tiles |
| Gratuitous gradients | Selection uses a clear semantic distinction; no atmospheric map glow |
| Glassmorphism | Labels and details have reliable contrast; no floating frosted control panels |
| Decorative blobs | Only verified diagram geometry or relevant imagery; no invented terrain shapes |
| Repetitive scroll reveals | Places and labels remain visible; no staged “journey” required to unlock information |
| Generic AI landing-page structure | Content answers campus relationship and visiting needs; no fake coordinates, route statistics, or feature grid |

## Direction C — Student / Experimental

**Organizing principle: a controlled gathering of distinct expressions.** The
festival feels collectively made through deliberate juxtaposition, while a stable
information structure makes those differences readable. Unlike A's single editorial
voice or B's geography, relationships emerge between contributions and ideas.
Research basis: A3, A7, B2, and the anti-pattern cautions in section 10 of RESEARCH.md.

### 1. Core idea

Create a digital composition that can accommodate different student expressions
without making every contribution look identical. Use controlled changes in scale,
alignment, and format within firm reading and utility rules. Participation is a
factual character of the festival, not a claim that a public submission platform exists.

### 2. Emotional qualities

Resourceful, sociable, surprising, and self-aware. It should feel open to student
creativity without treating students as synonymous with messiness, youthful slang,
cheap materials, or deliberately unfinished work.

### 3. Information hierarchy

A consistent readable festival name, description, lifecycle status, and practical
links establish orientation. Expressive story fragments then enter a curated
sequence with different emphases. During the attendee stage, confirmed essential
facts gain priority in stable positions; expressive material never shares the same
visual urgency as a schedule change.

### 4. Layout/composition system

Use a repeatable set of relationships rather than identical containers: a large
text fragment beside a short supporting passage, an authored image interrupting a
text sequence, or two related ideas juxtaposed at different scales. Limit irregularity
to selected content groups; headings, reading order, and utility alignment stay stable.

Overlap can occur only in nonessential artwork, never over links or text. Rhythm
alternates compact clusters with clear pauses. Texture comes from approved materials
if present; no default torn-paper edges, stickers, fake tape, or noise overlay.

### 5. Typography strategy

Create play through contrast in scale, line arrangement, and emphasis within a
small coherent type system. One expressive role can vary in composition while body
and practical text stay stable. Do not equate experimentation with many fonts,
distorted Chinese glyphs, inaccessible outlines, or fake handwritten student voices.
English receives real reading space rather than functioning as decorative microtype.

### 6. Image/art direction

Approved student works, event photography, or mixed media can retain their authorship
and aspect ratios inside bounded compositions. Show credit and context; don't crop
away meaning or modify works without permission. If no artworks exist, vary the
arrangement of approved factual text without pretending it is a student quotation.
The concept must remain distinctive as composition before a collage asset set exists.

### 7. Color philosophy

A stable readable base can host differences already present in approved materials.
Control the number of competing areas of emphasis in each view. Functional status
and focus remain consistent across expressive sections. Neither a loud multicolor
palette nor a fluorescent accent is a prerequisite; colors remain undecided.

### 8. Navigation model

Stable named global destinations plus contextual links between related fragments.
The visual treatment may make an item distinctive, but its label must explain the
destination before interaction. No hidden corners, mystery icons, randomized menus,
drag-to-uncover navigation, or rearranging links on each visit.

### 9. Interaction philosophy

Expression should arise from a meaningful act of choosing to examine something,
not from everything reacting to the pointer. Keep the number of special behaviors small.

| Proposed interaction | PURPOSE | WITHOUT IT | COST and decision |
| --- | --- | --- | --- |
| Select a clearly labeled excerpt to read its full story/context | Connect a compact expressive fragment to an understandable whole | A permanently expanded passage may serve equally well | Link clarity and reading order. Use a normal detail link; conditional on real excerpt length, no flip-card trick |
| Explicitly open a larger approved artwork with caption/credit, when small details matter | Let visitors examine work without making every image enormous initially | An adequate inline image may remove the need entirely | Focus/return behavior if an overlay is used, large-image transfer, keyboard/touch controls. Prefer a simple detail destination; retain only for actual viewing needs |

Dragging fragments, playful scrambling of text, hover-only labels, and surprise
navigation do not help these tasks and are excluded. A still, expressive composition
is an acceptable result; the concept does not depend on adding special interactions.

### 10. Motion philosophy

Motion, if tested, stays attached to an intentional open/close action so the origin
of the examined material remains clear. Compare that local continuity with an
immediate change before retaining it. No bouncing layout, animated typography loop,
random entry order, or idle collage movement. Reduced motion uses complete static
states; repeated visits never replay a performance.

### 11. Mobile interpretation

Recompose selected clusters into a stable single-column sequence with occasional
width or scale variation. Keep intentional differences, but remove overlap and
never require sideways exploration. Context and credits follow each material.
Utility content is calm and compact. Do not simply shrink a collage or turn every
fragment into a carousel card; native scrolling remains the main reading gesture.

### 12. How attendee information behaves

A consistent facts area and time-first agenda provide a quiet functional contrast
to expressive story sections. Titles and original artwork can retain personality,
but time, location, requirements, and change notices always occupy predictable roles.
This is one coordinated system, not an unrelated sober microsite for practical facts.

### 13. How festival storytelling behaves

Visitors encounter connected aspects of festival meaning rather than a mandatory
linear essay: student initiative, campus relationship, and first-edition origins.
Each fragment has enough context to stand alone and links to fuller explanation
when useful. The campus appears as a lived setting for participation, not a map
framework. All excerpts are approved facts or attributed materials, never invented testimony.

### 14. How announcements behave

Use a stable chronological list with readable titles and provenance. An important
notice has consistent emphasis even beside varied artwork. Do not make notices
look like anonymous sticky notes or give each an unpredictable visual style.
Expressive surrounding content cannot obscure urgency or make old news look current.

### 15. How future editions fit

A fixed grammar of relationships and utility roles accepts different approved
materials each year. Variation belongs to content, not randomly regenerated tokens
or menu behavior. Edition labels protect continuity; future archiving remains a
separate requirement. New student contributions do not imply new publishing software.

### 16. Accessibility considerations

Reading order must remain clear when visual grouping varies. Test cognitive load,
text contrast within mixed media, motion sensitivity, and consistent link affordances.
Avoid using rotation, outlines, or artwork-only words for essential copy. Enlarged
text must reflow without colliding fragments. Visual novelty must not change control behavior.

### 17. Performance implications

Mixed media can multiply downloads and font variants. Bound image count and delivered
sizes, reserve space, and avoid loading full-resolution artwork before requested.
No video or audio is assumed. Static layout can carry the concept with little JS;
multiple gesture systems or per-frame pointer effects would undermine that economy.

### 18. Risks

Controlled irregularity may become arbitrary, culturally generic “student zine”
styling, or an asset-hungry collage. Too much consistency could instead erase the
sense of varied expression. Maintaining coherent compositions requires explicit
rules so a technical maintainer need not act as an art director on every update.

### 19. What would make the direction fail

Users cannot tell links from decoration; attention scatters before they understand
the festival; mobile collapses into an ordinary card feed; or the concept only works
with an imagined supply of student art. A design that needs bad usability to feel
experimental fails even if visually memorable.

### 20. What should be tested in prototype

Test the same approved text in two bounded degrees of irregularity, without custom
art first. Ask users to identify the festival, distinguish interactive elements,
follow a story relationship, and find a notice. Later, insert one approved work to
test authorship, credit, and enlargement only if needed. Test dense and sparse content,
long bilingual headlines, keyboard order, enlarged text, and a new announcement
added using the existing rules. Compare local open/close continuity with no animation.

### C — Hallmark check

| Pattern to avoid | Specific restraint in this direction |
| --- | --- |
| Generic SaaS hero | Festival identification leads into related expressions, not a slogan and product-demo panel |
| Card grids by default | Varied text/image relationships form a readable sequence; no masonry wall as a shortcut |
| Excessive rounded rectangles | Material edges follow actual works; utility grouping uses spacing rather than sticker-like containers |
| Gratuitous gradients | Authored material supplies variation when available; no synthetic glow to imply creativity |
| Glassmorphism | Mixed media is not placed behind translucent reading panels |
| Decorative blobs | Each fragment carries factual meaning or credited authorship; no anonymous filler shapes |
| Repetitive scroll reveals | Differences are present in the static composition; content never waits to assemble itself |
| Generic AI landing-page structure | Relationships reflect the festival's actual story; no stock zine aesthetic, fake student quotes, or formulaic collage hero |

## Neutral comparison

These are intended differences and predicted tradeoffs, not ratings or measured
outcomes. No direction is ranked or recommended over another.

| Dimension | A — Editorial / Cultural | B — Campus / Spatial | C — Student / Experimental |
| --- | --- | --- | --- |
| Identity expression | A coherent editorial voice through emphasis and sequence | Belonging to NCU through named places and relationships | Collective character through controlled contrast and juxtaposition |
| Information clarity | Explicit hierarchy; art-directed leads must yield to important facts | Time/place relationships; spatial context must not add mandatory steps | Stable utility roles amid variation; link recognition needs careful testing |
| Storytelling | Guided argument connecting meaning, context, and origins | Stories grounded in location and campus relationships | Connected fragments offering multiple points of entry |
| Attendee utility | Compact agendas and practical reading pages | Direct connection from event to venue and arrival information | Predictable factual structure contrasting with expressive material |
| Mobile adaptability | Asymmetric columns become an edited reading sequence | Place list becomes primary; diagram stays supplemental | Clusters are recomposed with selective scale variation and no overlap |
| Interaction opportunity | Section jumps and contextual reading links | Place/list correspondence and return to context if justified | Deliberate examination of excerpts or authored material |
| Accessibility complexity | Reading order, large type, and caption relationships | Spatial equivalence, selection semantics, and small diagram targets | Consistent affordances, cognitive load, mixed-media text, and visual order |
| Performance risk | CJK type variants and large leading photography | Detailed diagrams or unnecessary map tooling | Asset count, high-resolution works, and excessive font variation |
| Dependence on unavailable brand assets | Text hierarchy can operate now; imagery later strengthens editorial evidence | Text relationships can operate now; spatial enhancement needs verified geography | Text composition can operate now; authored variety needs approved works to substantiate it |
| Long-term adaptability | Stable editorial rules; avoid bespoke layouts for each update | Stable places with changing edition associations; verify changed venues | Stable compositional grammar with changing material; avoid uncontrolled drift |

### Same content, genuinely different decisions

Use the approved account of the name, campus relationship, and 2026 origins to
compare organization without letting different copy create a false difference:

- **A:** the meaning of the name leads an edited narrative; campus context and
  origins support the argument through changing typographic emphasis.
- **B:** the campus relationship provides the connecting context; named places
  lead to relevant history, without implying that historical places are next-edition venues.
- **C:** meaning, student initiative, and origins form deliberately contrasted but
  connected fragments; ordinary links and a clear introduction hold them together.

When confirmed attendee information arrives, A changes the lead editorial priority,
B attaches verified activities to places while keeping the agenda direct, and C
raises the prominence of its stable facts structure. These differences concern
organization and behavior; they survive a neutral palette and the same typeface.

## Prototype evaluation plan — for a separately authorized phase

No prototypes are created in this phase. Test the directions with the same content,
same task prompts, and comparable fidelity; do not compare a polished version of
one against a sketch of another. Do not merge the directions before evaluating
their distinct organizing principles.

### Shared content and conditions

Use approved factual content for purpose, campus connection, 2026 origins, and the
current lack of confirmed future details. Use actual approved announcements when
available. If later testing requires hypothetical event records, obtain agreement
on clearly labeled test-only fixtures; never invent upcoming facts in a public-looking
prototype. The unresolved historical market location in RESEARCH.md is not a verified
venue input.

Evaluate initial presence and, when adequate confirmed or explicitly test-only
content exists, attendee planning. Include Traditional Chinese, a long English
version, and a clearly unavailable translation. Test at narrow mobile and desktop
widths, enlarged text, keyboard navigation, reduced motion, and slow loading.
Use identical core content without imagery first; approved images can enter a
second pass. A direction must not win merely because it received better assets.

### Tasks and evidence

| Task or check | What to record | Decision it informs |
| --- | --- | --- |
| Explain what 松櫻祭 is after an initial visit | Correct understanding, mistaken assumptions, and remembered NCU connection | Whether expression communicates factual identity |
| Identify what is confirmed and what is pending | Confusion between 2026 history and future details | Whether lifecycle hierarchy is honest |
| Find a specific announcement and identify its source/context | Completion, wrong turns, hesitation, and attribution errors | Whether practical access survives art direction |
| Find a confirmed/test-only event time, place, and visit guidance | Completion path and mistakes; compare with a plain list baseline | Whether attendee utility benefits from the direction |
| Switch language where translation is missing | Expectation, notice comprehension, and ability to reach Chinese content | Whether availability remains predictable |
| Repeat an action, go back, use keyboard, and reduce motion | Lost context, focus problems, delays, or missing information | Whether interactions add meaning without obstructing use |
| Add an announcement and replace an edition association/material | Manual composition work and broken relationships | Whether the system can be maintained over years |

Do not manufacture numerical success thresholds or declare a winner from visual
preference alone. Record evidence against the product acceptance criterion and
each direction's failure conditions. The user can then choose what to develop.

### Direction-specific minimum comparisons

- **A:** asymmetric editorial sequence versus its mobile reading order; initial
  festival story versus attendee-first lead; text-only versus one approved image.
- **B:** ordinary place links versus static diagram/list versus selectable correspondence,
  only with verified relevant places; time-first tasks must bypass geography.
- **C:** two controlled degrees of compositional irregularity; text-only versus one
  approved authored work; intentional detail opening versus immediate navigation.

Shared performance ceilings remain those in PERFORMANCE.md: initial total transfer
≤1,024 KiB, JS ≤150 KiB, CSS ≤50 KiB, fonts ≤100 KiB, primary image ≤200 KiB, and
zero default decorative-animation JS. Field targets remain LCP ≤2.5s, INP ≤200ms,
and CLS ≤0.1 at p75. Prototype evaluation cannot claim field compliance. If any
concept requires exceeding a budget, record the measured need and revisit the
concept before assuming an exception.

## Review and phase boundary

- Each direction makes different choices about hierarchy, composition, typography,
  density, imagery, texture, navigation, storytelling, interaction, and mobile reflow.
- Every major proposed interaction has a purpose, a removal test, and a cost. Effects
  without a convincing purpose are excluded; conditional experiments are not features.
- All three remain compatible with missing assets and deferred branding. No logo,
  final color, font, literal festival motif, or official visual identity is invented.
- Familiar functional navigation is deliberately shared. Difference does not require
  compromising accessibility or making three versions of basic controls.
- Research references inform principles; no external layout, artwork, or code is copied.
  No new external factual claims or performance results are introduced.
- Only DIRECTIONS.md is created. PRODUCT.md, RESEARCH.md, DESIGN.md, and other baseline
  documents remain unchanged. Selection, prototyping, and implementation are deferred.


## Direction D — Spring landscape / illustrated typographic world

Exploratory addendum, authorized after rejection of A/B/C. Prototype: `/d`.
This is a new direction, not a combination or refinement of the rejected systems.
PRODUCT.md, RESEARCH.md, and DESIGN.md remain unchanged.

### Reference and evidence boundaries

The user supplied a portrait recruitment-poster screenshot with a muted lavender
field, pale pink illustration, dusty rose oversized Traditional Chinese type,
large calm areas, and foreground/background overlap. The source file is the user
attachment `codex-clipboard-51a9e775-cca4-4400-8c6e-e7b08e38bdb3.png`; it is not
loaded by the website. No exact font identity, asset rights, or official brand
status can be established from the screenshot. Its visible recruitment wording
and edition designation are not evidence of upcoming festival details.

- **Factual identity:** NCU, student-led spring culture, the festival name and
  meanings, and the documented lake/cherry-tree connection.
- **Existing brand:** still pending. The screenshot is an art-direction reference,
  not a complete or approved website brand system.
- **Digital opportunity:** a soft illustrated world organized around emphatic
  Chinese lettering, followed by a deliberate increase in information density.
  Colors, scenery, and display treatment are temporary experiments.

The user now explicitly encourages pale pink, lavender-blue, dusty rose, muted
purple, and off-white. This supersedes earlier avoidance of assuming those colors
for this prototype only. It does not establish official colors or change DESIGN.md.

### Core idea and emotional qualities

A spring campus festival poster becomes a navigable landscape. Dense type supplies
recognition and energy; open sky supplies calm; a path, water, and human figures
supply a sense of shared place. The intended feeling is gentle, youthful, and
culturally engaged, with enough typographic weight to avoid nursery-like sweetness.

### Hierarchy, composition, and typography

The festival name, NCU identification, navigation, and pending edition status are
available in the opening. The three name characters step diagonally across the
landscape rather than forming a centered headline. A small statement occupies the
quiet sky; an information link remains outside the most active lettering area.

Display uses the existing Chinese system-font stack at heavy weight, with a small
stroke to test visual mass. This tests role, density, and line arrangement, not a
final font choice or bespoke lettering. Information uses ordinary readable Chinese
text. Font rendering varies by platform; a future licensed display face must be
tested before production. A single short English atmospheric line is prototype
copy, not a claim that the page has been translated.

### Illustration, depth, and palette

Original disposable SVG scenery contains a lake, path, tree canopies, two people,
an abstract building silhouette, and a cropped flowering branch. It is explicitly
labeled non-official and non-geographic: neither a faithful NCU depiction nor a
map. These elements form one bounded composition, not scattered flower icons.
Nothing is traced from the reference's flower, hand, sparkle, lettering, or layout.

Use the muted sky as the large field, dusty rose for display weight, warm pink for
the ground/information transition, and dark purple for legibility. The scene's
scale, silhouette, and overlap create depth without cards, blur, gradients, or glass.
Approved or commissioned materials could replace distant/foreground layers through
the same frame; all text, navigation, and information remain outside the SVG.
Missing artwork must not become missing functionality.

### Navigation and transition into information

Always-visible named links reach story, news, and attendee guidance. A skip link
and an opening information link bypass the poster. The pink ground continues into
a two-column introduction/status ledger, then gives way to an off-white information
area. News and practical rows are scannable; a sticky three-link local navigation
supports movement between them and the story. No custom scroll or route gate.

Announcements retain their test label, source/context, and native disclosure.
Dates/venues/program remain unannounced. Historical 2026 information remains in the
story and explicitly ended. A clearly labeled test selector exposes the existing
fictional attendee fixture; it makes no future-edition claim. Future confirmed
information can populate the same ledger and practical section without rebuilding
the illustrated opening. Shortening the opening in a real live-event lifecycle is
an open evaluation question, not a new approved product decision.

### Interaction and motion checks

| Interaction | Purpose | Without it | Cost / decision |
| --- | --- | --- | --- |
| Native destination and skip links | Immediate access to useful information | Essential access worsens; retain | Ordinary focus/anchor handling; sticky-bar offsets |
| One-time title assembly and scenery settling | Establish the order and near/far relationships of the opening | All content remains understandable; enhancement only | 720–850 ms, small transform-only movement; text never hidden, no input delay, static/keyboard/reduced-motion cancellation |
| Small scene displacement at the hero's exit | Connect leaving the visual world with entering information | Static composition remains complete | 18 px, 650 ms bounded transform at an IntersectionObserver threshold; no per-frame scroll work; remove if it distracts |
| Link-arrow response | Reinforce the path toward information | Link remains fully clear | 4 px / 220 ms on fine-pointer hover only; no essential hover content |
| Existing announcement/language behaviors | Reveal detail and communicate honest translation availability | Readers lose content access or predictability | Reuse tested native disclosure and trigger-related notice; preserve Escape/focus and reduced motion |
| Static-preview toggle | Let reviewers compare motion with the complete still composition | OS reduced motion still works | One local state; immediate cancellation, no production feature implied |

No continuous atmospheric loop, drifting petal system, sparkle field, pinned scene,
scroll-jacking, physics toy, GSAP, Motion, Canvas, or WebGL. CSS plus one visibility
observer provide the required bounded behavior. Technology did not choose the form.

### Mobile interpretation

Portrait changes the type into a two-column stagger with the third character below,
rather than shrinking the desktop diagonal. The scene is reframed around water and
people; a foreground branch has its own offset. Navigation occupies a separate row.
The status ledger, news, and story become single-column readings, and essential
text never enters the illustrated asset. The opening information link and top
navigation both bypass the tall composition.

### Accessibility, performance, and Hallmark review

Semantic heading text names the festival once; decorative glyph copies and scenery
are hidden from assistive technology. Ordinary links/buttons/selects/details keep
keyboard and touch behavior. Reduced-motion changes are honored immediately; the
observer is not initialized for a reduced-motion/static rendering and is cleaned
up when preferences change. Keyboard input cancels movement via the existing app
behavior and scoped CSS.

No image/font downloads, animation library, or new dependency is introduced.
Static vector path cost is part of the JS bundle; performance measurements and
limits are recorded in PROTOTYPE-NOTES.md. A generated illustration does not prove
production quality or official geography.

Hallmark checks: no centered SaaS hero, feature-card grid, pill CTA, rounded section
system, gradient text, glass, blobs used as unrelated decoration, invented claims,
or repetitive section reveals. The pink curved ground has a landscape/transition
role. Broad color areas and system fonts are intentional prototype exceptions to
skill defaults, required by this brief and by font/asset uncertainty.

### Risks, failure conditions, and next tests

The direction fails if the scenery feels childish, the heavy type overwhelms the
NCU identity, the opening delays access to information, or readers mistake invented
scenery for a real location. Illustration craft is provisional; geometric SVGs do
not demonstrate the quality of future commissioned art. Color alone must not carry
recognition. Final assets may have a different palette or proportions.

Test recognition against the supplied reference without showing it side by side;
time information-finding on mobile; compare motion/static readings; replace the
scene with differently proportioned approved art; test Chinese typography on real
Android/iOS hardware and zoom; test a realistic confirmed event dataset. No winner,
final visual system, commissioned asset, or official branding is selected here.
