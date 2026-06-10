---
name: bits&bytes™ Design System
colors:
  background: "#1e0509"
  foreground: "#f7f1ec"
  primary: "#97192c"
  primary-foreground: "#fff9f4"
  secondary: "rgba(151, 25, 44, 0.2)"
  secondary-foreground: "#fff4ea"
  accent: "#fc920d"
  accent-foreground: "#2a0804"
  destructive: "#f04438"
  destructive-foreground: "#ffffff"
  border: "rgba(247, 241, 236, 0.12)"
  input: "rgba(247, 241, 236, 0.1)"
  muted: "rgba(247, 241, 236, 0.08)"
  muted-foreground: "rgba(247, 241, 236, 0.72)"
  card: "rgba(20, 15, 10, 0.86)"
  card-foreground: "#f8f2ed"
  popover: "rgba(22, 16, 11, 0.96)"
  ring: "rgba(255, 122, 27, 0.4)"
  brand-purple: "#5e0f1a"
  brand-plum: "#791423"
  brand-pink: "#97192c"
  brand-coral: "#fc920d"
  brand-amber: "#fda83d"
  brand-midnight: "#1e0509"
  brand-ink: "#120f0a"
typography:
  display:
    fontFamily: "Helvetica Now Display, Helvetica Neue, sans-serif"
    fontWeight: "700"
  sans:
    fontFamily: "Helvetica Now Text, Helvetica, sans-serif"
    fontWeight: "400"
  serif:
    fontFamily: "Georgia Pro, Georgia, serif"
  script:
    fontFamily: "Palm Club, cursive"
    fontWeight: "400"
rounded:
  sm: "12px"
  md: "16px"
  DEFAULT: "18px"
  lg: "18px"
  xl: "24px"
shadows:
  glow-strong: "0 20px 70px rgba(255, 122, 27, 0.24)"
  glow-soft: "0 10px 32px rgba(151, 25, 44, 0.22)"
  shadow-card: "0 20px 60px rgba(7, 3, 2, 0.55)"
---

## Brand & Style

The bits&bytes™ design system embraces a bold, production-friendly aesthetic for high-agency student builders. The interface balances high-impact energy with mature restraint, making the platform feel like a professional environment where real products are shipped, not a beginner-centric playground.

Deep burgundy surfaces, orange pops, dither/halftone texture, and crisp typography should project confidence without making the UI feel noisy.

## Colors

Our primary theme revolves around a neutral ink to midnight-burgundy base with controlled orange accents.

- **Burgundy Core:** Deep, refined magentas and pinks (Brand Pink #97192C to Purple #5E0F1A) ground the brand.
- **Warm Accents:** Energetic oranges (#FC920D → #FEE9CF) drive action and create dynamic pops across interactions and borders.
- **Neutrals & Surfaces:** Almost universally dark, our surface layers rely on transparency (`rgba`) to blend smoothly with underneath textures. Text balances stark contrast by using slightly warm, off-white shades (`#F7F1EC`) for a sophisticated look that prevents eye strain.

## Typography

Typography relies on a highly structured, editorial yet modern hierarchy combining Swiss pragmatism with stylized accents.

- **Primary Headings:** *Helvetica Now Display* commands attention through heavy weights.
- **Copy & Long-form:** *Helvetica Now Text* or *Georgia Pro* for highly readable, dense information.
- **Accents:** *Palm Club* (Script) and *Anton* (Display) provide rare, decorative moments for hero headers or marketing elements.

## Logo

The brand mark is a geometric isometric cube with stylized B letterforms and a four-pointed star. `public/logo.svg` is white and should be placed on dark, burgundy, orange, or otherwise high-contrast surfaces. Use the logo route (`/logo`) for public embeds.

Approved public spelling is **bits&bytes™**. Use **bitsnbytes** only where `&` is impractical, and reserve **GOBITSNBYTES FOUNDATION** for legal contexts.

## Layout & Spacing

A centralized `app-shell` layout dictates a maximum width of `72rem/6xl` with sensible padding and consistent spacing. Fixed navigation requires explicit hero top offsets so the first viewport never overlaps.

- **Negative Space:** We prefer dramatic breathing room between major sections to let the deep background colors and glowing effects resonate.
- **Media Loading:** Use stable aspect ratios, eager loading only for the first viewport, preloading for imminent carousel images, and a quiet dither texture instead of heavy shimmer.
- **Movie Frame:** The homepage movie opens as a focused in-page frame with autoplay after click, audio on, no visible player controls, and an obvious close action.

## Elevation & Depth

We avoid sharp, opaque borders. Instead, elevation uses a combination of deep, colored shadows and layered translucent surfaces to evoke depth without weight.

- **Cards:** Semi-transparent backdrops (`var(--card)`) sit above a dark background to catch any moving gradients or star motifs underneath.
- **Glows:** Two key glow levels—soft burgundy glow and a stronger, wider coral glow—help draw focus to active elements and primary call-to-actions.
- **Texture:** Dither and halftone overlays can appear in hero loading states, video frames, and campaign surfaces at low opacity.

## Shapes

Shapes reflect an approachable but structured geometry.

- We use soft corner radiuses (default `18px`) that are substantial without being pill-shaped. This geometric softening contrasts with the intense colors and adds tactile, "app-like" affordances to buttons and cards.
