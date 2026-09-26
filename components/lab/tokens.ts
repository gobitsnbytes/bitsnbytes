/**
 * stripe.dev "lab notebook" tokens (DESIGN.md → Reference allocation: /cloud /join /contact /faq /press /qna).
 *
 * Grid: 24 columns ≥760px, 8 below; 12px outer padding (LabGrid only); --lab-gap column gap
 * (8px → 12px) redefined on every lab grid so nested grids line up exactly.
 * Rules: 1px `border-line` hairlines and 1px dotted separators inside lab components — not the 3px riot bones.
 * Highlight: every hover/active fill reads `var(--lab-hi, var(--marker))` with ink text. Set `--lab-hi`
 * on any ancestor (e.g. `[--lab-hi:var(--orange)]`) to change the pop for a whole view.
 */

/** 24/8-column track template + gap, no padding. Put on any element that must align with LabGrid. */
export const LAB_COLS =
  "grid grid-cols-8 min-[760px]:grid-cols-24 [--lab-gap:8px] min-[760px]:[--lab-gap:12px] gap-x-[var(--lab-gap)]";

/** Sticky offset for lab sidebars: the fixed nav is ~91px (stripe.dev uses 60px under a 36px nav). */
export const LAB_STICKY = "lg:sticky lg:top-[110px]";

/** Type scale (stripe.dev clamp/calc formulas, re-set in Archivo / Space Mono). */
export const LAB_TEXT = {
  /** Hero title: ≈80px at 390, 143.75px at 1440, max 170px. Weight 300, -0.07em, line-height .84. */
  hero: "font-sans font-light text-[length:min(calc(12.2807vw+32.1053px),84px)] min-[760px]:text-[length:min(calc(9.11458vw+12.5px),170px)] leading-[0.84] tracking-[-0.07em]",
  /** Hero subtitle: 20px at 390, 38px at 1440. */
  lg: "font-sans font-light text-[length:min(calc(1.71898vw+13.296px),44px)] leading-[0.95] tracking-[-0.06em]",
  /** Section title (H2): 54px at 390, 101px at 1440, max 114px. */
  title: "font-sans font-light text-[length:min(calc(4.48431vw+36.5112px),114px)] leading-[0.84] tracking-[-0.06em]",
  /** Featured post title: 31.5px at 1440, max 33px. */
  post: "font-sans font-light text-[length:min(calc(0.516529vw+24.0744px),33px)] leading-none tracking-[-0.04em]",
  /** Row / topic title and body: 20px at 390, 25.75px at 1440. */
  md: "font-sans text-[length:calc(0.5476vw+17.86px)] leading-[1.2] tracking-[-0.03em]",
  /** Summary / body small: 16px at 390, 19.5px at 1440. */
  sm: "font-sans text-[length:calc(0.3333vw+14.7px)] leading-[1.15] tracking-[-0.02em]",
  /** Filters, captions. */
  xs: "font-sans text-[14px] leading-[1.2]",
  /** Mono UI labels (tags, dates, table headers use 11px). */
  mono: "font-mono text-[12px] uppercase leading-[1.2] tracking-[-0.02em]",
} as const;

/** Hover + keyboard-focus highlight fill (mirrored). Only for fine pointers on hover. */
export const LAB_HOVER =
  "pointer-fine:hover:bg-[var(--lab-hi,var(--marker))] pointer-fine:hover:text-ink focus-visible:bg-[var(--lab-hi,var(--marker))] focus-visible:text-ink";

/**
 * stripe.dev marker highlight for multi-line titles: an inline background that starts just below
 * the top of each line box and wraps line by line. Put `group/mark` on the link that owns it.
 */
export const LAB_MARKER =
  "[--ov:calc(3px+0.3vw)] bg-[linear-gradient(transparent_var(--ov),var(--lab-mark,transparent)_var(--ov))] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] group-hover/mark:[--lab-mark:var(--lab-hi,var(--marker))] group-hover/mark:text-ink group-focus-visible/mark:[--lab-mark:var(--lab-hi,var(--marker))] group-focus-visible/mark:text-ink";

/** "2026-12-17" | Date → "2026.12.17" (string dates are not re-parsed, so no timezone shift). */
export function labDate(input: string | Date) {
  if (typeof input === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
    return match ? `${match[1]}.${match[2]}.${match[3]}` : input;
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${input.getFullYear()}.${pad(input.getMonth() + 1)}.${pad(input.getDate())}`;
}

export const isExternalHref = (href: string) => /^https?:\/\//.test(href);
