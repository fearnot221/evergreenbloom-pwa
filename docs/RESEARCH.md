# 松櫻祭 — Design research

Research date: 2026-09-30. Status: exploratory findings, not a selected design direction.

## 1. Research goals

Expand the design space for a recognizable, useful, permanent festival website.
Evaluate how typography, composition, information hierarchy, and interaction can
express this particular festival without obstructing attendance planning.

This document does not authorize implementation, create mockups, select fonts or
colors, prescribe an animation library, or replace official festival branding.
[PRODUCT.md](PRODUCT.md) remains the approved, locked brief. [DESIGN.md](DESIGN.md),
[INTERACTIONS.md](INTERACTIONS.md), and [PERFORMANCE.md](PERFORMANCE.md) remain the
baseline rules.

### Method and limits

Research combined official-site text, rendered browser inspection of selected
references, limited menu interaction, and installed Taste, Emil Kowalski, and
Hallmark guidance. Taste informs hierarchy and composition; Emil informs purpose,
frequency, feedback, and continuity; Hallmark informs content-specific anti-pattern
review. Skill defaults do not select a stack, palette, font, or effect.

Evidence labels in the reference register:

- **Rendered:** inspected a desktop browser view; this does not verify underlying
  font names, implementation, all breakpoints, or motion timing.
- **Text:** retrieved page/document text; conclusions concern content structure,
  not a verified visual treatment.
- **Limited:** access or preview was incomplete; no design-quality endorsement.

Only the KYOTO EXPERIMENT schedule received a narrow viewport spot check at
390 × 844 CSS pixels. No reference received a complete keyboard, screen-reader,
reduced-motion, device, or performance audit. Observing a pattern is not proof of
its accessibility or effectiveness. WHY and ADAPTATION entries below are research
interpretations, not measured conversion or usability results.

## 2. Product constraints derived from PRODUCT.md

- One persistent digital home for 松櫻祭; no separate site per edition.
- Initial release: introduction, festival story, NCU relationship, concise 2026
  origins, and announcements. No dedicated Past Editions section.
- Later, as confirmed content exists: current edition, program, performers,
  activities, booths, visit information, map, transport, and FAQ. These are
  conditional capabilities, not an instruction to build every feature.
- Attendees take priority. Essential information must remain easy to find even
  when the website invites exploration.
- Traditional Chinese is primary. English shares the content architecture, with
  honest translation availability and an explicit route to Chinese-only content.
- Historical dates, current confirmed details, and pending information must be
  distinguishable. Announcements can identify source and communication context;
  a website update is not automatically an institutional NCU announcement.
- A technical maintainer updates structured content. No CMS or administration
  dashboard is required now. Avoid infrastructure lock-in.
- Domain, hosting, institutional publishing rules, and deadline remain TBD.
- Usability, accessibility, mobile use, and performance outrank decorative effects.
- Acceptance criterion: **The website should establish a recognizable digital
  identity for 松櫻祭 without compromising access to essential information.**

### Three different kinds of identity

| Category | Evidence or status | Consequence for research |
| --- | --- | --- |
| Factual identity | Student-led NCU spring festival; campus landscape, student creativity, arts and culture; meanings of 松 and 櫻; actual campus cherry trees and Chuo University connection; first edition in 2026 | These can inform content and questions about form; they do not dictate a palette or motif |
| Existing brand | Official logo, key visual, approved photography/copy, social accounts, contacts, partner materials, usage rules, and permissions remain pending collection | Public visibility does not establish reuse permission; do not reconstruct an official logo |
| Digital opportunity | Alternative compositions, reading rhythms, navigation, editorial treatment, and purposeful transitions | Research hypotheses only; must complement official materials once available |

### Factual reference check

The [NCU-hosted February 6 media report](https://ncusec.ncu.edu.tw/news/press_content.php?P_ID=45549)
credits 中央社 and supports the first-edition period, opening, student participation,
and festival intent. Another [NCU-hosted report](https://ncusec.ncu.edu.tw/news/press_content.php?P_ID=45566)
provides campus cherry-tree context. Preserve their publication and source context
rather than treating every hosted report as an institutional directive.

The [2026 Open House visitor information](https://openhouse.ncu.edu.tw/info)
organizes transport and festival-related information. Its broader university
program is not a promise about future 松櫻祭 content. Browser inspection encountered
a certificate error; text was available through retrieval. No certificate bypass
was attempted, and no rendered design conclusion is drawn from this page.

**Unresolved historical detail:** the February 6 report describes the March 7
market at 依仁堂前; the Open House page describes 教研大樓前道路. These may reflect
revisions or different descriptions, but that has not been established. Do not
select a location from either for publication without checking. The locked brief
does not specify this market location, so this does not require a PRODUCT.md
change. No contradiction to its approved scope was established. Historical access,
transport, admission, gifts, and program details must not become future-edition
facts by default.

## 3. Reference landscape

### Supplied starting points

These are mainly component and design-workflow resources. They are useful for
examining individual behavior or documenting systems, but do not supply the
festival's identity. Pattern IDs connect each useful reference to the six-part
analysis in sections 13–15.

| Reference | Evidence and observation | Research use |
| --- | --- | --- |
| [Be UI](https://beui.dev) and [motion patterns](https://beui.dev/docs/motion-patterns) | Text: component catalog and guidance on purpose, frequency, and reduced motion; catalog also includes conspicuous effects | A7: state feedback; C2: reject spectacle as a default |
| [Three UI](https://threeui.com) | Text: Three.js components, shaders, templates, and visual effects; demos not profiled | B5: conditional spatial explanation; C2: no decorative rendering engine |
| [21st.dev](https://21st.dev) | Text: community components, templates, and themes | A8: inspect individual state patterns; C1: avoid assembling a generic landing page |
| [HeroUI Pro](https://heroui.pro) | Text: product UI and component examples; premium implementations not inspected | A8: coherent control states; C1: dashboard conventions are not festival identity |
| [Watermelon UI](https://ui.watermelon.sh) | Limited: browser-accessible public summary describes components and blocks; direct retrieval failed and actual demos were not verified | Discovery lead only; no positive interaction or performance conclusion |
| [Fluid Functionalism](https://www.fluidfunctionalism.com/) | Rendered: documentation rail and examples of tabs, accordions, buttons, and switches; FAQ frames motion as information | A7: local state relationships; no adoption of its dark dashboard presentation |
| [tweakcn](https://tweakcn.com) | Rendered landing page; theme editor not exercised | A8: later token exploration; changing a theme is not a product-specific concept |
| [getdesign.md](https://getdesign.md) | Text: catalog of design-system descriptions covering type, color, spacing, and reasoning | A8: document reasons as well as values; third-party descriptions are not primary evidence about other sites |

### Festival, cultural, editorial, and place-based references

| Reference | Evidence and observation | Research use |
| --- | --- | --- |
| [KYOTO EXPERIMENT](https://kyoto-ex.jp/en/) | Rendered: expressive marks and performer imagery coexist with named program, schedule, information, and ticket destinations; text shows staged announcements | A1, A2, B1: expressive identity beside practical destinations |
| [KYOTO EXPERIMENT schedule](https://kyoto-ex.jp/en/schedule/) | Text and narrow rendered sample: date navigation and event information; the calendar extended beyond the 390px viewport with horizontal scrolling in the sampled state | A5: useful time grouping; C3: do not copy a wide calendar onto phones |
| [KYOTOGRAPHIE](https://www.kyotographie.jp/en/) | Rendered: condensed vertical display lettering, image-led composition, pronounced whitespace, language/menu controls; text separates exhibitions and visit information | A1, A4, B1: poster hierarchy and image editing, with legibility limits |
| [大溪大禧](https://daxidaxi.tycg.gov.tw/web/daxidaxi/Index) | Rendered: prominent Chinese festival lettering and actual event photography; opened menu exposes named festival, current-edition, visit, and history destinations | A1, A3, B3: local identity and explicit navigation; its archive is not an NCU launch requirement |
| [大溪大禧 overview](https://daxidaxi.tycg.gov.tw/web/daxidaxi/Overview) | Text: identity developed with local communities, traditions, and designers | A3: research the local people and place before inventing visual symbolism |
| [Pili Wu: 大溪大禧 project](https://www.piliwu-design.com/daxidaxi) | Text, designer account: 2018 flags reinterpreted local procession and community references | A3, B2: content-derived variation; do not borrow religious imagery or neon treatment |
| [Aomori Nebuta official site](https://www.nebuta.jp/) | Text: schedule, route, participation, access, history, and festival-making content | A5, A6: matsuri communication as time/place/participation, not a stock Japanese aesthetic |
| [Nebuta guide PDF](https://www.nebuta.jp/info/docs/aomorinebutafestivalguidemap.pdf) | Text only, older indexed guide: route and practical legend information; no current-logistics validation or visual audit | A6: map plus explanation; PDF must not be the only accessible source |
| [Le Guess Who?](https://leguesswho.com/) | Rendered: visible festival date/place and distinct named destinations for different program strands; menu opened, no full interaction audit | A1, B3: gateway hierarchy when destinations are genuinely distinct |
| [NCU Open House visitor information](https://openhouse.ncu.edu.tw/info) | Text only: transport methods and visitor logistics, specific to the 2026 university event | A2, A6: local terminology and provenance; no future logistics inferred |

大溪大禧 and its designer's account provide a concrete contemporary Taiwanese
example. They do not establish a universal “Taiwanese style.” Likewise Kyoto art
festivals and Nebuta serve different audiences and traditions; none licenses a
Japanese visual identity for an NCU festival.

Additional leads were checked but excluded from visual conclusions:
[Taiwan Creative Expo](https://www.creativexpo.tw/zh-TW),
[Taiwan Design Expo](https://www.designexpo.org.tw/), and
[Typomania](https://www.typomania.ru/) had retrieval limitations. They remain
possible later references, not evidence supporting recommendations here.

## 4. Visual design patterns

The strongest common principle is **separation of expressive composition from
reliable information access**, not any shared aesthetic. A festival can have a
particular voice while its dates, place names, and navigation remain plain.

Possible conceptual translations below deliberately avoid literal motifs. All are
DIGITAL OPPORTUNITY, not existing branding or selected directions.

| Factual concept | Question about form to explore | Failure to avoid |
| --- | --- | --- |
| Pine: continuity and resilience | Could a stable alignment or recurring typographic role persist while edition content changes? | Automatically assigning green, tree silhouettes, or solemn institutional styling |
| Cherry blossoms and spring | Could intervals, changes in density, or the sequence of a story express emergence? | Pink defaults, falling petals, bloom-on-scroll effects |
| Actual campus landscape | Could relationships between places organize stories and later visitor guidance? | An invented illustrated campus or map with inaccurate routes |
| Student creativity | Could edited student voices or varied approved materials sit within a coherent structure? | Random collages, fake handwriting, or uncontrolled submissions |
| Recurring festival | Could permanent identity remain recognizable as factual emphasis changes through the year? | A different site every year or an eternally imminent event |

Compare content-led approaches later rather than choosing one now: a reading-led
festival journal, a poster-led composition, and a place-led story could each serve
parts of the brief. Each must first demonstrate the same information tasks. These
are lenses for exploration, not proposals for three separate websites.

## 5. Typography observations

Strong display typography can establish hierarchy without a large effects budget.
KYOTOGRAPHIE's vertical display treatment and 大溪大禧's Chinese-led composition
show different possibilities; neither supplies a font recommendation for 松櫻祭.
A screenshot does not establish typeface identity or font licensing.

Evaluate a future type system through roles and actual content:

- Display: festival or story titles, used selectively and tested with long Chinese
  titles and English translations. A treatment that works for four characters may
  fail for a full announcement headline.
- Reading: story, explanation, and visitor guidance. Set language-appropriate
  measures and leading; do not impose a Latin character-count rule on Chinese.
- Utility: dates, times, place names, language status, and source attribution.
  Information must remain readable at small screens and text enlargement.
- Bilingual relationships: Traditional Chinese has launch priority; English needs
  intentional hierarchy and room for expansion, not decorative filler.

Check Traditional Chinese glyph coverage and forms, punctuation, mixed-script
baselines, line wrapping, and fallback fonts with representative copy. Font file
cost and licenses are selection criteria. The 100 KiB initial-font budget may
constrain CJK delivery; measure actual assets before claiming a solution.

Do not turn important text into artwork to reproduce a reference's typography.
If an approved key visual contains lettering, provide its essential information
as readable text as well. A familiar, well-set typeface can be more distinctive in
context than a novelty font with weak composition. See A4 and B1.

## 6. Layout and composition observations

Taste suggests evaluating relationships rather than collecting decorative parts:
what is dominant, what is adjacent, what repeats, and where the reader pauses.

- Reserve compositional emphasis for meaningful content. Scale a story image or
  title because it deserves attention, not because a template requires a hero.
- Vary density by task. Festival discovery can allow visual pauses; a schedule
  should put comparable facts close together. Avoid identical cards for both.
- Use alignment and proximity before adding boxes, pills, or shadows. Whitespace
  should reveal relationships rather than push essential information far below.
- Establish a logical reading order before exploring overlap or asymmetric grids.
  Desktop composition must reflow into that order rather than shrink as a poster.
- Treat current information as a changing priority within stable destinations.
  Initial launch should not resemble an empty event dashboard.

Competing hypotheses remain open: image-led versus type-led emphasis, compact
versus spacious discovery sections, and continuous story versus bounded chapters.
The content and official materials must decide their usefulness. A1, A2, A4, B1,
and B2 provide tests rather than selected layouts.

## 7. Interaction patterns

Emil's useful question is what changes for the user: state, hierarchy, navigation,
feedback, continuity, or spatial understanding. “It animates” is not a purpose.

| Conditional interaction | User purpose | Required behavior before motion |
| --- | --- | --- |
| Primary navigation | Reach a known destination | Clear labels, current location, native links, browser history, keyboard/touch access |
| Language switch | Understand available content | Preserve context where available; explicit Chinese-only notice/link when not translated |
| Announcement links | Check new or changed facts | Publication date, edition context, source where necessary; no invented urgency |
| Date/group selection, if program volume justifies it | Narrow relevant events | Visible selected state, meaningful results, sensible default, direct access to event details |
| FAQ disclosure, if content warrants one | Scan questions then read an answer | Real button, expanded state, readable content, predictable focus |
| Menu overlay, if needed | Expose destinations within limited space | Visible open/close state, appropriate focus handling, Escape, focus return |
| Map/list connection, if required | Relate a destination to its location | Equivalent text directions and operable destinations without dragging |

These are conditional analyses, not newly approved features. Search, accounts,
favorites, ticket purchasing, registration, live feeds, and push notifications
are not introduced by this research. B3 explores navigation without making
experimentation a prerequisite for access.

## 8. Motion principles

Motion should clarify a change that already works without animation. Frequency
matters: returning attendees checking a schedule should not repeatedly wait for
an expressive introduction. The [Be UI motion guide](https://beui.dev/docs/motion-patterns)
provides a useful cross-check on this purpose-first approach.

- Prefer immediate navigation and state feedback. Keep focus visible immediately.
- Local, reversible transitions can explain an open menu, active selection, or
  disclosure. Rapid repeated input must not queue or break transitions.
- Maintain a coherent origin and direction when spatial movement carries meaning.
  Do not invent spatial meaning just to justify movement.
- Follow existing project timing ranges; ordinary UI normally stays below 300 ms.
  These are future tuning limits, not measurements of the references.
- Essential text and the likely LCP element must not wait for an entrance sequence.
- Reduced motion receives complete static content and immediate state changes;
  no parallax, spatial scrubbing, continuous decoration, or forced smooth scroll.

Tool choice stays unresolved: CSS/native behavior first; Motion only if justified
state/presence/gesture needs arise; GSAP only if a real explanatory sequence needs
complex choreography that simpler tools cannot reasonably provide. GSAP timelines
could coordinate multiple elements, but no researched product need currently
requires that capability. No dependency is proposed. See INTERACTIONS.md for its
adoption gate, cleanup, and fallback requirements.

## 9. Mobile and event-information patterns

Design attendee information for direct entry from a shared link as well as Home.
An event detail should be understandable without first watching or reading the
festival story. When confirmed, put date, time, location, and relevant changes
near the event title; contextual story can follow.

A date-grouped agenda is a strong hypothesis for short or sparse programs. A
month grid may be useful for a long schedule, but its empty days and horizontal
width can make scanning harder. The KYOTO EXPERIMENT narrow sample demonstrated
a concrete overflow risk; it is not a complete judgment of that site's mobile UX.

Other candidate practices:

- Use explicit dates and edition labels; “today” must not imply a live data feed
  or remain stale after the event. Use the festival's local time context.
- Keep practical content in HTML. A downloadable map or poster can supplement it.
- Pair map graphics with named places, text directions, and verified access details.
- Avoid displaying unavailable sections as a wall of TBD cards. Explain what is
  pending and provide published announcements instead.
- Show translated-content availability before sending someone into a different
  language. Do not make a mostly Chinese page look fully translated into English.
- Validate narrow widths, text enlargement, touch, browser chrome, and long titles.
  Sticky elements must not consume the screen or hide focused content.

These are research implications, not tested behavior in this greenfield project.

## 10. Anti-patterns: Hallmark review lens

“Generic AI design” here describes recurring design shortcuts, not an assertion
that any referenced site was AI-generated. Review the work against its content:

1. **Interchangeability:** would replacing the name make the page plausible for a
   SaaS app, conference, or unrelated festival? If yes, find missing product evidence.
2. **Template sequence:** hero, three equal feature cards, numbers, testimonials,
   and CTA regardless of the actual festival story or attendance needs.
3. **Decorative specificity:** arbitrary coordinates, edition codes, micro-labels,
   grain, oversized numbers, or mixed type treatments pretending to be art direction.
4. **Effect accumulation:** gradient meshes, glass, glow, bento panels, pill tags,
   marquees, and spring motion combined without shared purpose.
5. **Invented credibility:** sponsors, attendee counts, quotations, awards, official
   seals, unverified social accounts, or “live” status used to fill empty space.
6. **Cultural shorthand:** Japanese-looking fonts, torii, generic matsuri imagery,
   pink petals, or green pines substituted for actual NCU research.

An editorial layout can become a template too. Large serif text, a tiny uppercase
label, and a grain overlay do not by themselves make the result specific. Familiar
navigation, lists, and cards remain valid when their grouping serves real content.

## 11. Performance implications

No reference or proposed site has measured performance results in this research.
Visual simplicity does not prove low cost; library choice does not prove smoothness.

Carry forward the simultaneous provisional limits in PERFORMANCE.md: initial
transfer ≤1,024 KiB, JS ≤150 KiB, CSS ≤50 KiB, fonts ≤100 KiB, primary image ≤200 KiB,
and default decorative-animation JS allocation of zero. Target field p75 LCP
≤2.5 seconds, INP ≤200 ms, and CLS ≤0.1; lab tests alone cannot establish field results.

| Opportunity | Likely cost or risk to test later | Constraint |
| --- | --- | --- |
| Poster typography | Multiple weights, large CJK fonts, fallback reflow | Test actual text coverage, delivery cost, licenses, and layout stability |
| Campus photography | Large LCP image, many competing downloads | Edit image count, responsive sizes, reserved dimensions, appropriate prioritization |
| Collage or layered texture | Extra assets, stacking and paint cost | Prefer static composition; measure before adding masks or movement |
| Local UI feedback | Unnecessary client bundles for simple controls | Use existing/native capabilities; avoid page-wide hydration for a small effect |
| Map | Third-party SDK/network cost or inaccessible bitmap | Text/list baseline; only load an enhanced map if a real need justifies it |
| Spatial experience | CPU/GPU, battery, context loss, motion sensitivity | No WebGL/Canvas by default; B5 needs evidence beyond visual appeal |

Pause and clean up optional active work; prefer transform/opacity where movement
is justified, while verifying actual rendering. Constrained mobile hardware and
networks must be part of later testing. No package installation, font download,
media reuse, or profiling integration is authorized by this document.

## 12. Accessibility implications

A reference's semantic-looking controls or accessibility link do not establish
compliance. Design-direction evaluation must cover:

- Logical headings, reading order, named navigation, real links/buttons, and visible
  focus; test keyboard and touch rather than inferring behavior from screenshots.
- Readable text and contrast over every image/background; do not use color, shape,
  motion, or position as the sole way to communicate a status or destination.
- Layout reflow, text enlargement, and localization. Keep essential information
  out of clipped display lettering and image-only posters.
- Appropriate menu/disclosure semantics and focus behavior; overlays must not
  strand focus or obscure essential content.
- Equivalent information for map graphics and optional spatial experiences.
  Alternative text should describe relevant content, not repeat a decorative theme.
- Honest language availability, correct language metadata, and understandable
  language-switch labels. Decorative English must not masquerade as translation.
- Reduced-motion behavior and control of ongoing motion. A reduced-motion query
  alone is not a complete accessibility review.

The [WCAG target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
describes the AA 24 × 24 CSS-pixel minimum with specified exceptions; roughly
44px or larger is a useful comfort target, not that criterion's universal mandate.
The [animation-from-interactions guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
concerns disabling nonessential interaction-triggered motion at AAA. Automatic
movement has additional considerations; do not conflate these requirements.

## 13. A — Strong candidates

“Strong” means a relevant principle for future evaluation, not approval of a visual
style or additional feature. Every card distinguishes observation from adaptation.

### A1. Expressive identity with explicit practical destinations

- **WHAT:** Cultural references such as KYOTO EXPERIMENT, KYOTOGRAPHIE, 大溪大禧,
  and Le Guess Who? give visual expression and named information destinations
  separate roles.
- **WHY:** Visitors can orient through labels even when the composition is unusual.
- **PURPOSE:** Support both discovery and purposeful return visits.
- **RELEVANCE:** Directly addresses the festival's identity/information dual purpose.
- **RISK:** Oversized artwork or an obscure menu can still bury essentials.
- **ADAPTATION:** Explore distinct compositions around a stable set of approved
  destinations; use NCU content, never the source's artwork, exact arrangement, or symbols.

### A2. Lifecycle-aware emphasis and dated, attributed updates

- **WHAT:** KYOTO EXPERIMENT publishes staged releases; the NCU historical sources
  show why dates and source context matter.
- **WHY:** Explicit publication and edition context reduces uncertainty about what
  is current, historical, or not yet announced.
- **PURPOSE:** Answer “what is happening next?” without fabricated event details.
- **RELEVANCE:** The same site must move between festival discovery and attendance.
- **RISK:** Old dates can look upcoming; website wording can overstate authority.
- **ADAPTATION:** Shift content priority using confirmed information within the
  approved IA; preserve announcement provenance and mark historical material.

### A3. Local evidence as the source of visual specificity

- **WHAT:** 大溪大禧's organizer overview and Pili Wu's account connect expression
  to local communities and traditions rather than generic festival decoration.
- **WHY:** Specific people, materials, and places supply meaningful differences.
- **PURPOSE:** Make identity recognizable and explain its origin.
- **RELEVANCE:** NCU's lake, campus history, and student participation are real anchors.
- **RISK:** Borrowing another festival's religious motifs, inventing student voices,
  or using unapproved photography would undermine authenticity.
- **ADAPTATION:** Research and edit approved NCU stories and materials; test how their
  relationships shape composition. The method transfers, the imagery does not.

### A4. Distinct display and reading roles

- **WHAT:** KYOTOGRAPHIE's display emphasis and 大溪大禧's Chinese prominence suggest
  that expressive titles need not determine every text treatment.
- **WHY:** Contrast in scale and density can guide attention while body copy stays usable.
- **PURPOSE:** Establish voice without sacrificing reading or practical scanning.
- **RELEVANCE:** Chinese-first storytelling and bilingual utility need different roles.
- **RISK:** Oversized, vertical, outlined, or compressed text becomes unreadable.
- **ADAPTATION:** Test real titles, long translations, and schedule facts across widths;
  choose fonts later from official identity, glyph quality, and performance evidence.

### A5. Time-first program reading when a program exists

- **WHAT:** KYOTO EXPERIMENT and Nebuta organize information around festival dates.
- **WHY:** Attendees compare what they can attend by time before reading every story.
- **PURPOSE:** Reduce effort in planning and checking an event-day schedule.
- **RELEVANCE:** Program access is central to the later attendee stage.
- **RISK:** A complex calendar or filters can add more work than a short list; wide
  grids can fail on phones.
- **ADAPTATION:** Start evaluation with date-grouped, scannable event facts. Consider
  controls only when confirmed program volume makes the benefit demonstrable.

### A6. Places explained through a map and readable logistics

- **WHAT:** Nebuta's site/guide and NCU Open House information relate places to
  participation and transport instructions.
- **WHY:** A place name alone may be insufficient for a first-time visitor.
- **PURPOSE:** Help attendees arrive and locate activities.
- **RELEVANCE:** Campus exploration can support both festival story and later visits.
- **RISK:** Stale maps, unverified access routes, PDF-only details, or an expensive SDK.
- **ADAPTATION:** Use verified campus names and text directions alongside a suitable
  map when required. Do not reuse historical logistics as future promises.

### A7. Small feedback that explains state

- **WHAT:** Be UI's guide and Fluid Functionalism's control examples offer local
  selection, disclosure, and press-state patterns.
- **WHY:** Feedback relates an action to its outcome without distracting from content.
- **PURPOSE:** Communicate navigation, expansion, or selection clearly.
- **RELEVANCE:** These needs may arise in ordinary festival navigation and information.
- **RISK:** Applying bounce or animated indicators everywhere slows frequent tasks.
- **ADAPTATION:** Define semantics and immediate states first; add only a short,
  interruptible transition with a clear purpose and static reduced-motion equivalent.

### A8. Reusable rules with documented reasons

- **WHAT:** getdesign.md emphasizes recorded system attributes; tweakcn and the
  21st.dev/HeroUI catalogs expose variations and component families.
- **WHY:** Coherent roles and states are more maintainable than unrelated one-off styling.
- **PURPOSE:** Keep future edition updates consistent while content changes.
- **RELEVANCE:** A technical maintainer needs a durable system without annual redesign.
- **RISK:** Importing a ready-made dashboard or another brand's token values creates
  borrowed identity; theme customization can be mistaken for design research.
- **ADAPTATION:** Later document independently selected roles, states, and rationale
  using actual festival content. No component suite or token set is selected here.

## 14. B — Experiments worth prototyping

These are options for a separately authorized phase. Each needs a task-based test
and an easier alternative; no prototype is created by this research.

### B1. Poster composition that reflows into a clear reading order

- **WHAT:** Explore typographic scale, asymmetry, and selective overlap informed by
  KYOTOGRAPHIE and KYOTO EXPERIMENT.
- **WHY:** Composition can communicate energy without continuous motion.
- **PURPOSE:** Give festival discovery a memorable opening and editorial rhythm.
- **RELEVANCE:** The product explicitly asks for a recognizable digital identity.
- **RISK:** Cropped lettering, vertical utility text, and weak mobile hierarchy.
- **ADAPTATION:** Compose original real content; compare with a simpler reading-led
  version. Reject if users miss festival purpose, status, or practical destinations.

### B2. An edited collection of student and campus materials

- **WHAT:** Explore modular variation informed by 大溪大禧's locally grounded method.
- **WHY:** Multiple voices can convey participation while a shared structure preserves unity.
- **PURPOSE:** Tell the student-led story with evidence rather than abstract decoration.
- **RELEVANCE:** Student creativity and campus culture are factual identity anchors.
- **RISK:** Assets may not exist or be licensed; random collage becomes another cliché.
- **ADAPTATION:** Test only once approved materials exist, with clear credits and
  editorial selection. Do not add submission tools or an unapproved content program.

### B3. Optional exploration beside ordinary navigation

- **WHAT:** Le Guess Who?'s named program gateways and 大溪大禧's explicit menu suggest
  a choice between destination browsing and expressive grouping.
- **WHY:** Spatial grouping can help explain genuinely different content relationships.
- **PURPOSE:** Encourage discovery without making known destinations harder to reach.
- **RELEVANCE:** Could connect stories, places, and activities if actual content warrants it.
- **RISK:** The small launch IA may not justify another layer; mystery icons become a puzzle.
- **ADAPTATION:** Test labeled groups with standard links and keyboard order; retain
  ordinary navigation. Reject if finding an announcement or Visit takes extra effort.

### B4. A transition that preserves a meaningful relationship

- **WHAT:** Explore a local transition between a selected story/item and its detail,
  using Emil's continuity principle rather than a copied reference animation.
- **WHY:** A stable visual anchor may help the reader understand where detail came from.
- **PURPOSE:** Preserve orientation during optional exploration.
- **RELEVANCE:** Potentially useful for related campus stories or program details.
- **RISK:** Route delays, extra JS, focus errors, and excessive movement on repeat visits.
- **ADAPTATION:** Compare against an immediate page change. Require correct back
  navigation, focus, interruption, reduced motion, and measured cost; otherwise omit.

### B5. Spatial explanation only if flat alternatives prove insufficient

- **WHAT:** Three UI suggests possible spatial rendering capabilities; no inspected
  demo establishes a need for them in this product.
- **WHY:** Spatial representation can sometimes clarify relationships, but that benefit
  must be demonstrated rather than assumed.
- **PURPOSE:** Hypothetically explain a difficult place relationship, not decorate a hero.
- **RELEVANCE:** Campus geography is relevant; a rendering engine is not yet justified.
- **RISK:** High cost, poor touch access, motion discomfort, inaccurate geography, and lock-in.
- **ADAPTATION:** First test a text/list or flat diagram. Only revisit richer rendering
  with a confirmed unresolved task, equivalent DOM content, and measured mobile benefit.
  This is a low-priority contingency, not a planned feature.

## 15. C — Patterns to avoid

### C1. Component-catalog assembly as festival art direction

- **WHAT:** Generic hero/cards/stats/CTA, arbitrary bento grids, faux dashboard panels,
  theme swaps, and unearned decorative labels.
- **WHY:** They can create quick surface consistency, but may carry no festival meaning.
- **PURPOSE:** Usually rapid template construction rather than an attendee problem.
- **RELEVANCE:** Conflicts with this brief when it replaces NCU-specific content choices.
- **RISK:** Interchangeability, invented credibility, and a flattened information hierarchy.
- **ADAPTATION:** Retain only individual controls justified by content; create composition
  from the approved brief instead of recombining a template's signature arrangement.

### C2. Spectacle imposed on essential access

- **WHAT:** Mandatory intros, falling petals, shader backgrounds, scroll hijacking,
  magnetic buttons, custom cursors, continuous marquees, and page-wide reveal sequences.
- **WHY:** They may attract momentary attention; attention alone is not a useful outcome.
- **PURPOSE:** Typically decoration unless a specific explanatory need is established.
- **RELEVANCE:** Repeated visitors need fast facts; default decorative JS allocation is zero.
- **RISK:** Delays, motion sensitivity, touch failures, GPU cost, and hidden information.
- **ADAPTATION:** Seek identity through static composition and approved content; use
  local state feedback where needed. Do not reproduce the effect under another theme.

### C3. A desktop poster or calendar squeezed onto mobile

- **WHAT:** Fixed wide grids, tiny metadata, rotated essential labels, and horizontal
  overflow used to preserve a desktop composition.
- **WHY:** The desktop arrangement may look cohesive while hiding a reading-order problem.
- **PURPOSE:** Preserves a visual arrangement more than a mobile attendee task.
- **RELEVANCE:** Narrow-screen event access is a product priority.
- **RISK:** Missed dates, clipped destinations, zoom dependence, and navigation conflicts.
- **ADAPTATION:** Preserve hierarchy and relationships through reflow and readable lists;
  do not preserve exact geometry at the expense of access.

### C4. Cultural shorthand presented as authentic identity

- **WHAT:** Automatic pink/green symbolism, torii, generic Japanese lettering,
  invented official marks, or borrowing another festival's religious imagery.
- **WHY:** Familiar motifs signal a category quickly, but can misrepresent this festival.
- **PURPOSE:** Shortcut recognition without doing local research.
- **RELEVANCE:** 松櫻祭 belongs specifically to NCU; its Chuo connection does not make it
  a generic Japanese matsuri.
- **RISK:** Cultural confusion and silent replacement of pending official branding.
- **ADAPTATION:** Use the factual story to ask compositional questions; wait for genuine
  assets and permissions. A literal motif is not selected merely because it is available.

### C5. Information hidden behind art, language, or false certainty

- **WHAT:** Image/PDF-only facts, hover/drag-only destinations, silent Chinese fallback
  in English pages, ambiguous years, fabricated upcoming programs, or false live badges.
- **WHY:** These can make a page seem visually finished while masking missing information.
- **PURPOSE:** Often completeness of appearance rather than truthful communication.
- **RELEVANCE:** Directly conflicts with staged launch, provenance, and language requirements.
- **RISK:** Users plan using wrong facts or cannot reach the information at all.
- **ADAPTATION:** Publish readable, dated, sourced content; expose availability honestly,
  retain equivalent navigation, and leave unsupported future details unannounced.

## 16. Open questions for Design Direction

These questions belong to the next phase; they do not reopen the approved product.

1. What official logo/key visual and usage rules will be available, and which aspects
   must the digital system preserve? How should edition artwork relate to permanent identity?
2. Which approved photographs, campus stories, and student materials best demonstrate
   the festival's specific character? Who can confirm publication rights and credits?
3. With real content, which balance of typography, imagery, density, and whitespace
   makes discovery distinctive while keeping practical destinations obvious?
4. What Chinese/English sample content is ready for testing length, reading hierarchy,
   glyph quality, translation notices, and font-delivery constraints?
5. Does confirmed program volume eventually justify filtering or a calendar, or does
   a grouped agenda solve the task more directly?
6. If place-based storytelling is explored, which campus facts and accessible routes
   can be verified? Can a flat map and text provide everything visitors need?
7. Which, if any, transitions improve orientation compared with immediate changes?
   What simpler version should each experiment be compared against?
8. Who will verify source/context for announcements and reconcile historical details
   such as the 2026 market location before publication?
9. What institutional publishing and infrastructure constraints emerge before production?
   Keep platform selection deferred until requirements make it necessary.

### Research review and handoff boundary

- No final style, palette, font, navigation treatment, animation engine, or stack
  has been selected. A/B/C classify principles and risks, not a visual direction.
- Reference observations and interpretations are separated. Unavailable previews,
  narrow testing coverage, and unmeasured performance are explicitly recorded.
- No source code, artwork, logo, type system, exact layout, or proprietary component
  was copied or downloaded for reuse. Adaptations concern purposes and relationships.
- Factual identity, pending official brand, and digital opportunities remain distinct.
  Explorations must not be published as official festival branding by default.
- No new future-edition facts or features have been approved. The historical location
  discrepancy remains unresolved; PRODUCT.md does not need alteration on this evidence.
- Only this research document is created. The next phase requires separate direction;
  this research does not authorize mockups, DESIGN.md edits, or implementation.
