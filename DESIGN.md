---
name: Bits&Bytes Design System
colors:
  background: "#080504"
  foreground: "#f7f1ec"
  primary: "#97192c"
  primary-foreground: "#fff9f4"
  secondary: "rgba(151, 25, 44, 0.2)"
  secondary-foreground: "#fff4ea"
  accent: "#ff7a1b"
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
  brand-coral: "#ff7a1b"
  brand-amber: "#ffae24"
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

The Bits&Bytes design system embraces a bold, production-friendly dark mode aesthetic designed for highly agency, ambitious student builders. The interface balances high-impact energy with mature restraint, making the platform feel like a professional environment where real products are shipped—not a beginner-centric playground. 

With deep, rich tones and vibrant gradient pops, the UI projects confidence. Textured overlays (halftones, stipples) give character without detracting from legibility. 

## Colors

Our primary theme revolves around an ink-black to midnight-burgundy base with glowing coral and amber accents. 

- **Burgundy Core:** Deep, refined magentas and pinks (Brand Pink #97192C to Purple #5E0F1A) ground the brand.
- **Warm Accents:** Energetic oranges and corals (Brand Coral #FF7A1B) drive action and create dynamic "pops" of color across interactions and borders. 
- **Neutrals & Surfaces:** Almost universally dark, our surface layers rely on transparency (`rgba`) to blend smoothly with underneath textures. Text balances stark contrast by using slightly warm, off-white shades (`#F7F1EC`) for a sophisticated look that prevents eye strain.

## Typography

Typography relies on a highly structured, editorial yet modern hierarchy combining Swiss pragmatism with stylized accents.

- **Primary Headings:** *Helvetica Now Display* commands attention through heavy weights.
- **Copy & Long-form:** *Helvetica Now Text* or *Georgia Pro* for highly readable, dense information.
- **Accents:** *Palm Club* (Script) and *Anton* (Display) provide rare, decorative moments for hero headers or marketing elements.

## Layout & Spacing

A centralized `app-shell` layout dictates a maximum width of `72rem/6xl` with sensible padding and consistent spacing, ensuring that everything stays digestible on wide screens while responding flawlessly to smaller viewports. 

- **Negative Space:** We prefer dramatic breathing room between major sections to let the deep background colors and glowing effects resonate. 

## Elevation & Depth

We avoid sharp, opaque borders. Instead, elevation uses a combination of deep, colored shadows and layered translucent surfaces to evoke depth without weight.

- **Cards:** Semi-transparent backdrops (`var(--card)`) sit above a dark background to catch any moving gradients or star motifs underneath.
- **Glows:** Two key glow levels—soft burgundy glow and a stronger, wider coral glow—help draw focus to active elements and primary call-to-actions.

## Shapes

Shapes reflect an approachable but structured geometry.

- We use soft corner radiuses (default `18px`) that are substantial without being pill-shaped. This geometric softening contrasts with the intense colors and adds tactile, "app-like" affordances to buttons and cards.
