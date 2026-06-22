---
name: bits&bytes™ Design System
colors:
  background: "#faf8f5"
  foreground: "#120f0a"
  primary: "#97192c"
  primary-foreground: "#faf8f5"
  secondary: "#fee9cf"
  secondary-foreground: "#120f0a"
  accent: "#fc920d"
  accent-foreground: "#120f0a"
  destructive: "#f04438"
  destructive-foreground: "#ffffff"
  border: "rgba(18, 15, 10, 0.15)"
  border-dark: "rgba(250, 248, 245, 0.15)"
  brand-burgundy: "#97192c"
  brand-warm-accent: "#fc920d"
  brand-near-black: "#120f0a"
  brand-off-white: "#faf8f5"
typography:
  display:
    fontFamily: "Anton, Helvetica Now Display, Helvetica Neue, sans-serif"
    fontWeight: "normal"
  sans:
    fontFamily: "Helvetica Now Text, Helvetica, sans-serif"
    fontWeight: "400"
  serif:
    fontFamily: "Georgia Pro, Georgia, serif"
  script:
    fontFamily: "Palm Club, cursive"
    fontWeight: "400"
rounded:
  DEFAULT: "0px"
  none: "0px"
shadows:
  none: "none"
---

## Brand & Style

The bits&bytes™ design system embraces a **Swiss editorial, museum poster, and architectural blueprint** "movement" aesthetic. The interface balances structural engineering restraint with raw student energy, making the platform feel like a blueprint drafting sheet where real products are designed and built.

We reject standard, colorful neobrutalist offsets, cartoonish drop shadows, and futuristic SaaS gradients. Instead, we use thin 1px lines, coordinates, dot grids, and tick marks.

## Colors

The palette is limited and highly controlled. It supports light mode and dark mode transitions:

- **Primary Background:** Warm off-white (`#faf8f5`). In dark mode, it flips to near-black (`#120f0a`).
- **Primary Text & Borders:** Near-black (`#120f0a`). In dark mode, it flips to off-white (`#faf8f5`).
- **Burgundy Accent:** Deep burgundy (`#97192c`) is used for primary brand elements, badges, and key editorial highlights.
- **Orange Pop:** Warm orange (`#fc920d`) is used strictly as a minor accent for state triggers, indicators, or active badge highlights.

## Typography

Typography relies on a highly structured, editorial hierarchy:

- **Display & Headings:** *Anton* (Display) and *Helvetica Now Display* command attention in clean uppercase blocks.
- **Copy & Explanations:** *Georgia Pro* (Serif) is preferred for descriptive paragraphs and body copy, giving it a premium print publication feel.
- **System Labels:** Clean monospace is used for technical labels, indicators, status badges, coordinates, and viewport dimensions.
- **Script Accents:** *Palm Club* (cursive) is used sparingly for handwritten editorial accents.

## Shapes & Corners

- **Square Corners Only:** The border radius must be strictly `rounded-none` (`0px`) across all cards, buttons, input fields, and tags. Soft rounded radiuses are prohibited.

## Layout & Grid System

Layouts resemble print layouts or blueprint drawings:

- **Asymmetry:** Grid systems are offset (e.g., 60/40 hero grids) with generous whitespace.
- **Dot Grids:** `.blueprint-dot-grid` is used as a light background pattern overlay.
- **Dimension Lines:** Clean 1px lines, coordinates (`26.8467° N, 80.9462° E`), and tick markers (`blueprint-tick-x`, `blueprint-tick-y`) outline key boundaries.
- **Asset Treatment:** Photographic assets should be grayscale (black-and-white) to preserve print identity, though structural frame hovers (offset translations and shadows) are encouraged to keep layouts responsive.
