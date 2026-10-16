# Design

## Current visual language · v6 「櫻吹雪 · 一陣風」 (adopted 2026-10-17)

**Why v6.** The user judged v5 still ordinary and set Awwwards Site-of-the-Day as the
target, banning templates, card stacks, heavy rounding, gratuitous gradients, emoji,
one animation everywhere, centred everything and placeholder images; text motion should
not all "pop up", with ui.fearnot.tw's text-motion catalogue as the reference.

**Concept.** One gust of wind carries petals from 松 (rooted, still) to 櫻 (moving)
through the campus. Everything that moves travels with that wind, left to right.

| Area | Decision | Source |
| --- | --- | --- |
| Colour | Unchanged from v5: blush paper, sakura field, pine ink, one hot rose; night stays plum-pink. No gradients (the only `linear-gradient` is a one-colour highlighter band) | `tokens.css` |
| Type | LXGW WenKai TC at poster scale; titles are outline + fill (`Ink.tsx`); phrases atomic (`Phrases.tsx`); vertical CJK for 松 and the hero edge | `components/`, `base.css` |
| Images | No placeholders. Hero: a live canvas petal storm (`motion/PetalStorm.tsx`) with near petals in front of the wordmark. 松 and 櫻: the glyphs are the pictures, filled with drawn textures (`public/art/cones.svg`, `petals.svg`, from `scripts/art/build-textures.mjs`). Campus: the real OpenStreetMap drawing. Menu: the destination's first character as an outline | as listed |
| Shape | Square corners everywhere; only petals and the 松櫻 emblem are round. Header is a full-width bar with a hairline; tab bar a square bottom bar with a rose rule on the current tab; buttons square with an ink/rose wipe from the left | `base.css`, `shell.css` |
| Mark | Flat five-petal blossom (`Blossom` in `motifs.tsx`), no gradients | `motifs.tsx` |

**Home:** hero (storm, ink-filled wordmark, actions offset right, facts ledger) ·
小副標 slogan (two centred lines at slogan size, the story paragraph beneath) · 松 (pine-cone glyph, three vertical
columns) · 櫻 (petal window glyph) · 即時導向 (pine departure board) · 走進中央 (giant
bands across the campus plate) · 合作夥伴 (splitting heading) · footer (stamped wordmark).

**Inner pages (2026-10-17).** Every page head is a sakura field with the title and lede on
the left and the title's own outlined columns flowing on the right (直書逆走); section
titles are outline-and-fill ink titles. Pages carry one FLOW element each where it means
something: categories (活動介紹), first-edition facts (關於我們 history), recruitment
tape (團隊成員), the partner ribbon (合作單位); 活動期程 shares the home board's
split-flap times. About's 松 / 櫻 are unboxed textured glyphs (pine cones, petals).
Grids that hold full-bleed bands use `minmax(0, 1fr)` tracks so the bands cannot widen
the page.

**Footer.** The closing wordmark is a full-width ink ribbon (緞帶) carrying the festival's
name along a wave.

**Per-page signatures.** 合作單位: a split-invert call 「成為合作夥伴」; 互動平台: seals for
the three ways to collect; 捐款: an outlined 「支持」 filling with sakura; 最新消息: a 快訊
ticker; 來訪須知: highlighted cautions; 404: an echoing 「迷路了嗎」. Phone spacing between
inner-page sections is 4rem (9rem from 900px). The page-head pill uses a 94% opaque glass
so large titles do not smear behind it.

**Unknowns.** Official logo, key visual and photography; palette approval.

## Design direction

Establish direction from the product's users, tasks, content, and existing brand.
Until those are known, preserve options; do not select an aesthetic on the basis
of a skill's default theme, font, stack, or numerical taste settings.

Use the installed `design-taste-frontend` (Taste) principles for hierarchy,
typography, spacing, and coherent composition. Use Hallmark as a contextual
anti-pattern review, not a mandate to rotate themes or rebuild the site. Existing
product identity takes precedence over stylistic novelty.

## Typography principles

- Define semantic roles for page title, section heading, body, label, and supporting text.
- Prefer a small, coherent family and weight set; a single family is valid when it fits.
- Size headings to actual content and viewport width. Verify long titles and descenders.
- Use comfortable body leading and reading measures; 45–75 characters is a starting
  range for Latin prose, not a rule for every language or dense data interface.
- Preserve readability at 200% zoom and text enlargement. Avoid tiny muted labels.
- Choose fonts for brand fit, language coverage, readability, licensing, and load cost.
  Do not replace an established font just because a skill discourages its popularity.

## Color principles

Use semantic roles for background, surface, text, secondary text, border, accent,
focus, and status. Pair foreground and background tokens explicitly. Maintain a
coherent neutral palette and restrained emphasis; status colors may have distinct
semantic roles. Do not convey meaning with color alone. Target text contrast of
4.5:1 for normal text and 3:1 for large text; check controls and focus indicators
against adjacent surfaces. Verify every supported theme independently.

## Spacing and layout principles

Extract an existing spacing scale before adding values. If none exists, establish
one small named scale from content needs, documenting its purpose rather than
scattering arbitrary numbers. Use consistent alignment and proximity to show
relationships. Whitespace should clarify grouping rather than fill a template.

Let content determine layout and breakpoints. Use constrained reading widths,
fluid gutters, and explicit alignment. Preserve logical DOM order when composing
grids. Avoid forced viewport-height heroes, clipped text, and overflow hidden
merely to conceal layout defects. Long words, localization, and narrow viewports
must not break navigation or actions.

## Component language and visual hierarchy

Reuse existing component ownership and variants once known. Document tokens for
shape, borders, elevation, density, and icon treatment; avoid mixed visual systems.
Cards should group a meaningful object or action, not wrap every paragraph.

Make the primary task apparent without competing buttons, oversized decorative
labels, or multiple accents. Differentiate primary, secondary, and supporting
content through scale, weight, placement, and spacing. Design relevant hover,
focus, active, disabled, loading, error, empty, and success states together.

## Patterns to avoid

- Automatic hero → three feature cards → testimonial → CTA structure regardless of content.
- Unjustified gradient meshes, glowing accents, glass panels, pills, and bento grids.
- Generic claims, fabricated metrics, stock testimonials, fake customers, or fake UI chrome.
- Excessive eyebrow labels, decorative section numbers, or typography chosen for novelty.
- Repeated identical cards and spacing that flatten the content hierarchy.
- Arbitrary font, icon, corner radius, shadow, or accent changes between sections.
- Hidden navigation, low contrast, hover-only information, or motion used as decoration.
- Changing established patterns solely to make a site look less conventional.

These are review prompts, not evidence that any such pattern exists here.
A familiar pattern is acceptable when it serves the product and is executed well.

## Design decision template

The 春空 decision above follows this template. For the next consequential change, record:

- Product/audience rationale and a one-sentence design direction.
- Reference material and which principles apply to this product.
- Typography roles and selected font sources.
- Semantic color pairs, spacing scale, containers, and breakpoint rationale.
- Component shapes, border/elevation rules, and icon conventions.
- Content hierarchy and relevant component state coverage.
- Alternatives considered, accessibility checks, and performance implications.

## Validation and maintenance

Inspect affected pages at 320, 375, 414, 768, 1280, and 1920 CSS pixels, with
intermediate widths where layout changes. Check long content, keyboard focus,
zoom, supported themes, and real mobile behavior when available. Record checks
actually performed. After an authorized design change, update only affected
system rules and cite the implementation; never turn an accidental value into a
permanent design requirement.
