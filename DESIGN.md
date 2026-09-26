---
name: bits&bytes™ Design System — Print Riot Edition (v5)
canonical-kit: design/neobrutalism-design-system.html
colors:
  paper: "#faf8f5"
  paper-2: "#eae8e4"
  cream: "#fee9cf"
  ink: "#120f0a"
  burgundy: "#97192c"
  burgundy-dk: "#791423"
  orange: "#fc920d"
  orange-lt: "#fda83d"
  warm: "#c94218"
  cobalt: "#2b39ff"
  acid: "#ffe600"
  slime: "#12e29b"
typography:
  display: "Anton (next/font) — uppercase, line-height .82–.9"
  sans: "Helvetica Now → Helvetica Neue → Archivo (next/font, 400–900)"
  serif: "Georgia Pro → Georgia — body copy, lede, italic statements"
  mono: "Space Mono (next/font) — labels, coordinates, eyebrows, receipts"
  script: "Palm Club → Yellowtail (next/font) — one decorative accent per view"
rounded: "0px everywhere"
borders: "3px ink standard, 5px heavy, 2px for small tags"
shadows: "hard offset only: 3/6/10/16px ink; never blurred"
---

# Direction: references first (user directive, 2026-09-26)

> "redesign-rethink-reimage bitsnbytes from the given website links. don't rely on the old stuff. focus on the given references."

**The reference sites drive layout, structure, motion and art direction.** Old page layouts and old components
(`components/ui/hero-movement.tsx`, `features-8`, `mini-navbar`, `flickering-footer`, `design-testimonial`, the current page
shells) are **replaced, not restyled**. Old files are only a source of copy and behaviour (forms, APIs, dialogs), not design.

What survives from before: the **brand theme** (palette, Anton/Helvetica/Georgia/mono/script type, the isometric cube mark,
`bits&bytes™` spelling) and **every word of content**. The Print Riot kit (`design/neobrutalism-design-system.html`) is the
token source and an **accent vocabulary** (hard-shadow buttons, halftone/riso texture, bursts, window chrome) — use it where it
serves the reference-driven design, not as the skeleton of every surface.

Reference sites (copy mechanics + layout ideas, never their images, 3D models, fonts, copy or source):
- **buttermax.net — homepage 1:1 in our brand**: loader glyph, full-bleed campaign-color hero with a giant wordmark + script
  accent and a floating 3D object that flies away on scroll, black reel that expands to full-bleed, giant indented "who we are"
  statement, works grid of objects with thin dividers, black "reach out" footer with a 3D object overlapping giant type.
- **shopify.com/editions/winter2026 — "copy this"**: the site as an Edition. Opening frame (construction lines + framed title)
  that expands into full-bleed art, sticky left chapter index, full-bleed chapter heroes with giant titles, torn-paper
  transitions into paper sections, serif-italic statements with a swash initial, floating UI-card collages with parallax.
- kprverse.com, stripe.dev, revelatio.studio, bfcm.shopify.com/2025, inkfishnyc.com — see "Reference playbook" below.

## Non-negotiables

1. **Content freeze.** Do not rewrite copy. Reuse existing strings verbatim: headings, paragraphs, stats, FAQs, bios,
   partner names, legal text. You MAY reorder, split into chapters, pull a sentence out as a big statement, and add
   structural labels (`§01`, `CH.02`, `26.8467° N, 80.9462° E`, `SYS_REF`, `EST. 2025`) or tiny UI verbs (Play, Close,
   Scroll, Next). Never invent facts, numbers, dates, names, quotes, partners, or claims.
2. **Brand spelling** per AGENTS.md: `bits&bytes™` (or `bitsnbytes` where `&` is impossible). Legal entity name only in legal contexts.
3. **Preserve behaviour.** Forms, API calls, booking dialogs, hCaptcha, consent checkboxes, cookie consent, AI assistant,
   analytics, JSON-LD, metadata exports, `data-tour` hooks, and links must keep working exactly as before.
4. **Brand-safe finish.** Square corners by default (a reference may justify pills/rounded shapes for a specific control).
   No generic SaaS glass cards or purple AI gradients; if a reference uses blur/glow, translate it into print texture instead.
5. **Accessibility.** One `h1` per page; semantic landmarks; visible focus (`3px cobalt` outline, 3px offset);
   text contrast ≥ 4.5:1 (ink on orange/acid/cream OK; **never white text on orange or acid**); dialogs trap focus and close on Esc;
   every animation honours `prefers-reduced-motion` and the site's motion toggle (`html[data-immersive-motion="off"]`).
6. **Dark mode keeps working** (next-themes, `.dark` class): paper ↔ ink swap; borders/shadows flip to cream/paper.

## Tokens

Surfaces: `paper #faf8f5` (default page), `paper-2 #eae8e4` (muted panel), `cream #fee9cf` (warm fill), `ink #120f0a`.
Brand core: `burgundy #97192c` (serious core, primary buttons), `burgundy-dk #791423`, `orange #fc920d` (controlled heat,
campaign surfaces, secondary buttons), `orange-lt #fda83d`, `warm #c94218`.
Electric pops, **one per view, never wallpaper**: `cobalt #2b39ff` (focus, links, jolt), `acid #ffe600` (marker highlight),
`slime #12e29b` (rare success).
Structure: `--bw 3px`, `--bw-thick 5px`; shadows `--sh-sm 3px 3px 0 ink`, `--sh 6px 6px 0 ink`, `--sh-lg 10px 10px 0 ink`,
`--sh-xl 16px 16px 0 ink`, `--sh-color 6px 6px 0 burgundy`.
Texture primitives (CSS utilities): `.halftone`, `.halftone-orange`, `.halftone-fade`, `.riso` (orange→warm→burgundy plate with
halftone bite), `.dither`, `.noise`, plus a faint page-wide halftone dot field (opacity ≈ .05).

Color roles: paper sections are the default rhythm; **ink "poster" sections** punctuate (reel, statements, footer);
**orange is the campaign/hero surface**; burgundy carries primary actions and the core voice.

## Typography scale

- Display (Anton, uppercase): hero wordmark `clamp(96px, 22vw, 360px)` / line-height .8; section titles `clamp(40px, 7vw, 112px)` / .86.
- Big statement (buttermax "who we are"): sans 900 uppercase `clamp(28px, 4.2vw, 64px)` / 1.0, first line indented ~25%.
- Serif italic statement (Editions): Georgia italic `clamp(32px, 5vw, 80px)` / 1.05; optional script (Yellowtail) initial.
- Lede: Georgia 18–20px / 1.5, max 60ch. Body: Georgia 16–17px.
- Labels: Space Mono 11–12px, 700, uppercase, tracking .14–.34em.

## Components (build once in `components/riot/`, reuse everywhere)

Button (burgundy / orange / outline / cobalt / acid / ghost; sm / md / lg): 3px ink border, hard shadow; hover lifts
(−2px,−2px & larger shadow), active slams flush (3px,3px & no shadow), spring-driven. Tag, Eyebrow (ink bar + pulsing orange
square), Burst / Star / Plus / Flower stickers (one per view), Window chrome (title bar with 3 square lights), Stat,
Accordion, Chapter (numbered section wrapper that registers with the chapter index), TornEdge (SVG jagged paper edge),
Marquee (ink band, Space Mono or Anton), HalftoneImage (grayscale photo + halftone/duotone overlay, hard frame),
VideoFrame (window-chrome player with poster, big play, sound-on click, Esc to close when modal).

## Page structure: the Edition

- Every page is an edition: an **opening frame** (h1) and **numbered chapters**. Chapters are `<section data-cinematic-section
  data-cinematic-title="…">`; `ExperienceProvider` discovers them for the **chapter index** (desktop ≥1280px: sticky left
  column listing `01 Title … 02 Title`, active chapter marked, click scrolls there).
- Chapter heads: `§0N — LABEL` in mono burgundy, Anton title, optional serif description to the right, 3px ink rule below.
- Transitions between ink and paper use a TornEdge at most once per boundary.

## Motion rules

- **GSAP**: `gsap.registerPlugin(ScrollTrigger)` at module scope in client components; always `useGSAP(() => {…}, { scope })`
  from `@gsap/react` (never raw `useEffect` for GSAP). `ExperienceProvider` already runs Lenis → ScrollTrigger; never create a
  second Lenis or scroller.
- Animate **transform, opacity, clip-path** only. No animating width/height/top/left/filter-blur on scroll.
- **Pinning:** no ancestor of a pinned/sticky element may keep a `transform`, `filter`, or `overflow: hidden|auto` —
  use `overflow-x: clip` for horizontal overflow guards.
- **3D (R3F + drei)**: only where it earns its place (home hero cube). `next/dynamic` with `ssr: false`, `dpr={[1, 1.75]}`,
  pause rendering when offscreen (`frameloop="demand"` + invalidate, or `frameloop` toggled by IntersectionObserver), flat/toon
  materials + ink `<Edges>` so it matches print. Scroll → 3D via a custom ticker: ScrollTrigger progress written to a ref and
  read inside `useFrame` (no drei `<ScrollControls>` — it would fight Lenis). Reduced motion / no WebGL → static SVG logo.
- **Springs for interaction** (Emil Kowalski): hover/press/menus/drag use `framer-motion` springs
  (`type: "spring", stiffness 400–600, damping 30–40`, or `bounce: 0`); enter animations ease-out `cubic-bezier(.23,1,.32,1)`
  under 300ms for UI; never animate from `scale(0)` (start ≥ .9); stagger 30–60ms; one focal motion at a time
  (choreography: headline → supporting → actions); keyboard-initiated actions don't animate; defer heavy state updates until
  after the animation (`onAnimationComplete` / `requestIdleCallback`).
- Reduced motion: no scroll-scrubbed transforms, no autoplaying video loops, no parallax; content fully visible.

## Performance

LCP must be text (the wordmark), never the canvas. `next/image` with `sizes`; video `preload="none"` or `"metadata"` + poster,
play only when in view; lazy-load below-fold heavy components with `next/dynamic`. No new dependencies unless unavoidable —
gsap, @gsap/react, three, @react-three/fiber, @react-three/drei, lenis, framer-motion are already installed. Use `pnpm`.

## Reference allocation (user, 2026-09-26 — overrides anything below that conflicts)

> kprverse "i love the intro section" · stripe.dev "copy this 1:1" · buttermax "create this 1:1" ·
> inkfish "omg wow copy this too" · shopify editions "copy this copy this 1:1" · revelatio, bfcm (liked)

| Surface | 1:1 reference |
|---|---|
| Home — first-visit intro | **kprverse** preloader + logo assembly: paper panel, hairline progress rule, `LOADING - NN%` + file-path ticker, the logo's pieces assembling, cut to the hero. Skippable, no sound gate. |
| Home — everything after the intro | **buttermax** (hero, 3D logo cube, curtain reel, statement, works grid, poster footer) |
| /events | **inkfish** (black playlist reel hero with PiP "monitor", `[S.0N]`/`[NN]` bracket mono UI, barcode stripe rows, mixed-width event grid, contact "window" with fixed backdrop, custom fullscreen player) |
| /about, /impact, legal docs | **Shopify Editions** (opening frame, chapter index, chapter heroes, torn paper, serif statements, card collages) |
| /cloud, /join, /contact, /faq, /press, /qna | **stripe.dev** (24-col hairline grid with `+` registration marks, pixel-block glyph titles, `/ LABEL` table headers, seeded "Fig. N" generative windows, feed tables with mono dates, sticky router figure, get-help grid, endless outlined footer word) |
| Site-wide chrome | buttermax nav fused with **stripe.dev** bracket hotkeys (`[E] EVENTS [A] ABOUT [J] JOIN [M] MENU`, `[C]` console = the AI assistant as a stripe.dev console window), **inkfish** pixel-mountain route transition, kprverse menu, buttermax/kprverse footer |

Single-key shortcuts must be switchable off (WCAG 2.1.4), ignored while typing or with modifiers, and exposed via `aria-keyshortcuts`.

## Reference playbook → site spec

Full teardowns (measurements, timings, mechanisms) live in `tmp/research-full.json` (one object per site). Decisions:

### Type roles (supersede the scale above where they conflict)
- **Wordmark / mega display** (buttermax): Archivo 900 with `font-stretch: 125%` (variable `wdth` axis loaded), tracking
  −0.04em, lowercase `bits` + Yellowtail script `&bytes` overlapping the baseline, small `™`. Accessible text stays
  `bits&bytes™`. Hero size `clamp(96px, 21vw, 340px)`.
- **Chapter hero titles** (Editions' 190px sans title): Archivo 900 wide, `clamp(64px, 13vw, 200px)`, line-height .85.
- **Big indented statement** (buttermax "who we are"): Archivo 800 uppercase `clamp(28px, 4.2vw, 64px)` / 1.0, first line
  indented 25–28% with the `§0N — LABEL` eyebrow sitting in the indent.
- **Serif-italic statement** (Editions): Georgia italic `clamp(32px, 5vw, 80px)` / 1.05, first letter a Yellowtail swash
  (burgundy on paper, orange on ink) hanging into the gutter.
- **Numerals** (odometers, stats, dates): Anton. **Labels**: Space Mono 11–12px 700 uppercase, bracket style `[07%]`,
  `[S.01]`, `EVENTS [06]` (counts computed from data, never invented).

### Color systems
- **Homepage = two-colour poster** like buttermax: orange `#fc920d` + ink `#120f0a`, burgundy as the depth colour (3D cube
  faces, duotones). Paper/cream sections for reading.
- **Edition pages**: ink opening frame → full-bleed **duotone chapter art** (our "paintings": real photos from
  `public/event_pictures`, `public/images` in grayscale → burgundy/orange duotone + halftone) → torn paper → paper/cream reading chapters.
- Electric pops (cobalt/acid/slime): one per view, max.

### Global chrome
- **Loader** (buttermax + inkfish): first visit per session only, ink screen, brand four-point star glyph breathing (scale .94↔1),
  Space Mono `LOADING [07%]` driven by real readiness (fonts + hero poster), hard cap 800ms, "yank" exit (curtain up,
  content settles). The DOM wordmark is painted underneath (LCP never waits on it). Skip under reduced motion.
- **Nav** (buttermax): fixed, 3 zones. Left: cube mark → home. Centre: small `bits&bytes™` wordmark. Right: square outline
  buttons (2px, Space Mono 12px, uppercase) for EVENTS / ABOUT / JOIN + MENU; hover = fill wipes in (scaleY 0→1 from top,
  .45s cubic-bezier(.215,.61,.355,1)); oversized hit areas. **Section-aware colour** (kprverse): each chapter carries
  `data-surface="ink|paper|orange"`; a ScrollTrigger flips `html[data-nav-surface]` so the nav reads ink on paper/orange and
  paper on ink (no blend-mode over burgundy). Hide on scroll down / show on scroll up.
- **Menu** (kprverse): burgundy rail slides first, then an ink panel wipes out with giant Archivo links (every route), active
  route marked with an acid block; paper halftone underlay; focus-trapped, Esc closes, springs.
- **Chapter index** (Editions): ≥1280px on edition pages, sticky LEFT column: page title (from the opening frame) + chapter list
  `01 Title` with CSS counters, active row marked (3px rule revealed by clip-path), click scrolls via Lenis. Below 1280px a
  compact "CH 02/05 ▾" jump menu. Replaces the old right-hand progress rail in `ExperienceProvider`.
- **Page transition** (buttermax/inkfish): reveal-only tile wipe on route mount in `app/template.tsx` — 8×5 burgundy/orange/ink
  tiles scaleY 1→0, stagger 30ms rising from bottom-centre, ≤700ms total, never leaves a transform on the page wrapper.
  Skipped under reduced motion.
- **Cursor label** (bfcm/revelatio): elements opt in with `data-cursor-label="PLAY TRAILER"`; one fixed Space Mono tag
  (paper on ink, 2px border, 3px orange hard shadow) moved with `translate3d` in rAF; pointer:fine only; hidden for keyboard.
- **Scramble labels** (revelatio/kprverse): `<ScrambleText>` for Space Mono labels only (eyebrows, chapter numbers, nav
  hover, coordinates, bracket counters); charset `01&#*+=/<>`; real text stays in the DOM (animate an aria-hidden mirror).
- **Footer** (buttermax + kprverse): ink poster. Top row of 4 columns split by 2px paper rules (console column with routes +
  `26.8467° N, 80.9462° E`, nav, socials, contact incl. legal/trust links with `data-tour="footer-trust"`), then a full-bleed
  giant `bits&bytes™` wordmark uncovered from a slot (counter-translated mask scrub), with the cube mark tucked between a back
  and a front copy of the type. All existing footer links/text preserved.

### Homepage (buttermax 1:1, in brand)
1. **Hero** — full-bleed orange, wordmark centred edge-to-edge, tiny uppercase caption line under its left side
   (existing tagline: "India's boldest builder network" + "innovate • collaborate • hack"), a **3D "byte"** floating in front:
   a 2×2×2 cluster of 8 "bit" cubes (8 bits = 1 byte) with flat/toon burgundy/ink/cream faces and ink `<Edges>`, one face
   carrying the B letterform, a four-point star on top. It idles (slow spin, pointer spring tilt), every ~8s does a
   choreographed burst-apart-and-reassemble (the buttermax object swap), and on scroll **outruns the page** (rises ~1.6×
   scroll speed, rotates, bits drift apart) so it's gone by ~40% of the first viewport. Hero footer row: mono dots glyph left,
   down-arrow centre. Riso misregistration: burgundy + orange copies of the wordmark slip ±10px with scroll velocity and snap back.
   Primary CTAs (existing: "Join the crew" → /join, "Watch film" → film modal) sit small and precise, not as a hero button block.
2. **Curtain reel** — a fixed full-bleed reel of the existing film (`/movie/bnb-movie.mp4`, low-res → full-bleed copy under a
   halftone/dither screen, plus a sharp inset window playing it clean) uncovered as the orange hero scrolls up, then covered by
   the next paper panel (TornEdge top). `[ WATCH FILM ]` opens the VideoModal with sound. Plays only in view; none under reduced motion.
3. **Statement** — "who we are" indented mega statement from existing mission copy; words fade 0.15→1 as you scroll.
4. **Numbers** — Anton odometer stats (existing: 1400+ members, 5+ forks, 4+ events, 16.5 mean age), drawn 3px rules.
5. **Works grid** — buttermax hairline grid → our "What we do" programs + events: 3 columns, 2px ink dividers, each cell a
   halftone-duotone photo "object" at 75%, label bottom-left in mono, small glyph bottom-right, cursor **lens** (circle
   clip-path reveals the full-colour photo under the pointer; keyboard focus shows it too).
6. **Now showing** — the Regional Hackathon Series teaser: poster frame + `IIT BOMBAY · DEC 17–18` + link to /events.
7. **Partners** — draggable ink marquee band.
8. **FAQ** + **Voices** (existing content) in the kit's accordion / a horizontal quote rail.
9. **Footer** (global).

### Edition pages (/about, /events, /impact; lighter version on every other route)
- **Opening frame** (Editions): ink stage with construction lines derived from the isometric cube (hexagon, 30° diagonals,
  nested rhombi, circumscribed circle) in cream 1px strokes drawing in; a centred square frame holding the page h1 +
  chapter list. On scroll the frame expands (clip-path inset → 0) into chapter 01's full-bleed duotone art, and the title +
  list hand off into the sticky chapter index. Secondary routes use a static framed title (no expansion).
- **Chapter hero**: full-bleed duotone photo + giant Archivo title (cream on art, ≥4.5:1 via an ink scrim band, not blur).
- **TornEdge** into paper chapters; serif-italic statements with a swash initial; sticky copy stacks beside pinned media.
- **/events**: ch.01 = the **Regional Hackathon Series** (trailer `/movie/regional-series-trailer.mp4`, poster
  `/movie/regional-series-trailer-poster.jpg`): a framed "monitor" that scroll-zooms to full-bleed (revelatio CRT zoom, clip-path
  + transform), click = **theatre mode** (bfcm: clip-path from the card rect to full screen, chrome fades, Esc exits, sound on).
  Copy comes ONLY from the trailer: "High schoolers, your city's got competition." / "bits&bytes™ is launching a regional
  hackathon series across India." / "Win your qualifier — here's where you're headed: IIT Bombay." / "December 17th and 18th,
  qualifier winners compete here for the title." / "So who's carrying your city?". ch.02 = the archive as a table-list feed
  (stripe.dev/inkfish: mono date column, barcode stripe-wipe row hover, expand for existing details) + photo galleries.
- **/about**: origin story as a pinned horizontal timeline (July 2025 → mid-Aug 2025 cancellation → Nov 2025 founded →
  2 Jun 2026 incorporated) with a bracket scrubber `[NN%]`; principles as serif-italic statements; team with halftone portraits
  (hover → colour, `VIEW BIO` cursor label) preserving the booking dialog + motherboard hosts; volunteers/early contributors;
  governance as a construction-line grid (Board → Executive Officers → Forks → Safeguarding).
- **/impact**: opening frame → odometer mega-stats → "spotlight wall" of the track record (sticky list, focused item full
  opacity + orange underline, others dim; cursor image trail on pointer:fine) → globe chapter (existing globe, arcs only
  between places already in content: Lucknow → New Delhi, IIT Kanpur, IIT Bombay) → pillars as a sticky stack with a
  floating window-card collage (Editions' Pulse collage) using existing stats.

### Explicitly not copied
Their images, 3D models, Lottie files, fonts, copy, source; WebGL-rendered text; full-page fixed canvases or post-processing;
second scrollers / ScrollSmoother; blur/glow/bloom; pill radii; `mix-blend-mode: difference` over burgundy; audio; UA sniffing;
zoom-blocking viewport meta; loaders that gate content without a cap.
