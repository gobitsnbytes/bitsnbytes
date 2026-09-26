/**
 * stripe.dev section blocks (server components; the art inside is client). No copy lives here —
 * every string comes from the page.
 *
 * LabHero        LabGrid: marks row [1,16,22,25] → h1 (cols 1/15, LAB_TEXT.hero, one block per
 *                line, `glyph` inline after the last line) + `aside` badge (21/-1, right) → subtitle
 *                (1/15, LAB_TEXT.lg, 50px above) → children → marks row. Phones: lines stack, line 2
 *                right-aligns, the glyph drops to its own line, aside sits under the title.
 * LabFeature     one 12-col half ("Featured post / video"): TableHeader → Fig window (1/7) + copy
 *                (7/13): title (LAB_TEXT.post) and summary with the marker highlight, dotted tags that
 *                fill on hover, then `cta`. `divider` draws the dashed vertical rule (24px above →
 *                70px below) on its left. Stacks on phones. Place two inside a LabGrid.
 * StatTicker     "/ LABEL" header (optional) + a dotted strip of label + value-tag pairs, tripled and
 *                looped 0 → -33.333% over 25s; pauses on hover; under reduced motion / toggle off it
 *                stops and wraps to show every item once. Screen readers get one plain list.
 * HelpGrid       2×2 grid of 12-col topics: TableHeader (h3) → body (1/9, text-md, <b> at 500) →
 *                example links on 1px dotted rules (mono 12px, 12px padding) → optional cta.
 * LabFooterRows  the page's own closing block: 1px top rule, each child is a content row (a subgrid
 *                — place LabCells in it) and a 164px row of 9 '+' marks separates consecutive rows
 *                (pass 3 children for stripe.dev's auto / 164 / auto / 164 / auto).
 */
import { Children, Fragment, isValidElement, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FigWindow } from "./fig-window";
import { LabGrid, LabLink, LabStyles, LabTag, RegMarks, TableHeader } from "./grid";
import { LAB_COLS, LAB_HOVER, LAB_MARKER, LAB_TEXT } from "./tokens";
import type { ArtPreset } from "./art";

export type LabHeroProps = {
  /** Visual title lines; together they are the page's h1. */
  lines: ReactNode[];
  /** Appended after the last line, usually <PixelGlyph text="JOIN" />. */
  glyph?: ReactNode;
  subtitle?: ReactNode;
  /** Right badge slot (cols 21/-1), e.g. <LabGlobe />. */
  aside?: ReactNode;
  /** Registration mark columns for the top and bottom rows. Default [1, 16, 22, 25]. */
  marks?: number[];
  /** Extra content under the subtitle (actions, tags), cols 1/15. */
  children?: ReactNode;
  className?: string;
};

export function LabHero({ lines, glyph, subtitle, aside, marks = [1, 16, 22, 25], children, className }: LabHeroProps) {
  return (
    <LabGrid className={cn("gap-y-8 pb-10 pt-[120px] min-[760px]:pt-[132px]", className)}>
      <RegMarks columns={marks} />
      <h1 className={cn(LAB_TEXT.hero, "col-span-full min-[760px]:col-[1/15] min-[760px]:row-start-2")}>
        {lines.map((line, i) => (
          <span key={i} className={cn("block", i === 1 && "max-[759px]:text-right")}>
            {line}
            {glyph && i === lines.length - 1 ? (
              <span className="max-[759px]:mt-3 max-[759px]:block min-[760px]:ml-[0.2em]">{glyph}</span>
            ) : null}
          </span>
        ))}
      </h1>
      {aside ? (
        <div className="col-span-full self-start justify-self-end min-[760px]:col-[21/-1] min-[760px]:row-start-2">
          {aside}
        </div>
      ) : null}
      {subtitle ? (
        <div className={cn(LAB_TEXT.lg, "col-span-full pt-[18px] min-[760px]:col-[1/15] min-[760px]:row-start-3")}>
          {subtitle}
        </div>
      ) : null}
      {children ? <div className="col-span-full min-[760px]:col-[1/15]">{children}</div> : null}
      <RegMarks columns={marks} />
    </LabGrid>
  );
}

export type LabFeatureProps = {
  /** Table header label, e.g. "Featured post". */
  label: string;
  fig: number;
  seed: string;
  preset?: ArtPreset;
  title: ReactNode;
  summary?: ReactNode;
  tags?: ReactNode[];
  /** Makes title + summary + tags one link with the marker hover. */
  href?: string;
  /** Rendered under the copy (e.g. a riot Button). */
  cta?: ReactNode;
  /** Dashed vertical rule on the left (use on the second half). */
  divider?: boolean;
  /** Title element (default h3). */
  titleAs?: "h2" | "h3";
  className?: string;
};

export function LabFeature({
  label,
  fig,
  seed,
  preset,
  title,
  summary,
  tags,
  href,
  cta,
  divider,
  titleAs: Title = "h3",
  className,
}: LabFeatureProps) {
  const copy = (
    <>
      <Title className={cn(LAB_TEXT.post, "font-light")}>
        <span className={LAB_MARKER}>{title}</span>
      </Title>
      {summary ? (
        <div className={LAB_TEXT.sm}>
          <span className={cn(LAB_MARKER, "[--ov:calc(1.8px+0.18vw)]")}>{summary}</span>
        </div>
      ) : null}
      {tags?.length ? (
        <span className="flex flex-wrap gap-1">
          {tags.map((tag, i) => (
            <LabTag
              key={i}
              className="group-hover/mark:bg-[var(--lab-hi,var(--acid))] group-hover/mark:text-ink group-focus-visible/mark:bg-[var(--lab-hi,var(--acid))] group-focus-visible/mark:text-ink"
            >
              {tag}
            </LabTag>
          ))}
        </span>
      ) : null}
    </>
  );

  return (
    <article
      className={cn(
        "relative col-span-full grid grid-cols-subgrid content-start gap-y-8 min-[760px]:col-span-12",
        divider &&
          "min-[760px]:before:absolute min-[760px]:before:-bottom-[70px] min-[760px]:before:-top-6 min-[760px]:before:left-[calc(var(--lab-gap)/-2)] min-[760px]:before:border-l min-[760px]:before:border-dashed min-[760px]:before:border-line",
        className,
      )}
    >
      <TableHeader label={label} className="col-span-full" />
      <FigWindow seed={seed} fig={fig} preset={preset} className="col-span-full min-[760px]:col-[1/7]" />
      <div className="col-span-full flex flex-col items-start gap-5 min-[760px]:col-[7/13]">
        {href ? (
          <LabLink href={href} className="group/mark flex flex-col items-start gap-3">
            {copy}
          </LabLink>
        ) : (
          <div className="flex flex-col items-start gap-3">{copy}</div>
        )}
        {cta}
      </div>
    </article>
  );
}

export type StatTickerItem = { label: ReactNode; value: ReactNode };
export type StatTickerProps = {
  items: StatTickerItem[];
  /** Optional TableHeader label above the strip (e.g. "Statistics"). */
  label?: string;
  className?: string;
};

export function StatTicker({ items, label, className }: StatTickerProps) {
  // ponytail: each copy repeats the list to ≥6 entries so short lists span wide screens; measure if gaps ever show.
  const run = Array.from({ length: Math.ceil(6 / Math.max(items.length, 1)) }, () => items).flat();

  return (
    <div className={className}>
      <LabStyles />
      {label ? <TableHeader label={label} /> : null}
      <div className="group/tick relative overflow-hidden py-2">
        <ul className="sr-only">
          {items.map((item, i) => (
            <li key={i}>
              {item.label}: {item.value}
            </li>
          ))}
        </ul>
        <div
          aria-hidden
          className="flex w-max animate-[lab-ticker_25s_linear_infinite] pointer-fine:group-hover/tick:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:gap-y-2 motion-off:w-auto motion-off:animate-none motion-off:flex-wrap motion-off:gap-y-2"
        >
          {[0, 1, 2].flatMap((copy) =>
            run.map((item, i) => (
              <span
                key={`${copy}-${i}`}
                className={cn(
                  "flex shrink-0 items-center gap-2 whitespace-nowrap border-r border-dotted border-line px-3 font-mono text-[12px] uppercase leading-none",
                  (copy > 0 || i >= items.length) && "motion-reduce:hidden motion-off:hidden",
                )}
              >
                {item.label}
                <LabTag>{item.value}</LabTag>
              </span>
            )),
          )}
        </div>
      </div>
    </div>
  );
}

type LinkCta = { label: string; href: string };
export type HelpTopic = {
  title: string;
  body: ReactNode;
  examples: { label: string; href: string }[];
  /** {label, href} renders an outline riot Button link; any other node renders as is. */
  cta?: LinkCta | ReactNode;
};
export type HelpGridProps = { topics: HelpTopic[]; className?: string };

const isLinkCta = (cta: HelpTopic["cta"]): cta is LinkCta =>
  typeof cta === "object" && cta !== null && !isValidElement(cta) && "href" in cta && "label" in cta;

export function HelpGrid({ topics, className }: HelpGridProps) {
  return (
    <div className={cn(LAB_COLS, "col-span-full gap-y-14", className)}>
      {topics.map((topic) => (
        <article
          key={topic.title}
          className="col-span-full grid grid-cols-subgrid content-start gap-y-5 min-[760px]:col-span-12"
        >
          <TableHeader as="h3" label={topic.title} className="col-span-full" />
          <div className={cn(LAB_TEXT.md, "col-span-full min-[760px]:col-[1/9] [&_b]:font-medium [&_strong]:font-medium")}>
            {topic.body}
          </div>
          {topic.examples.length ? (
            <ul role="list" className="col-span-full min-[760px]:col-[1/12]">
              {topic.examples.map((example) => (
                <li key={example.href + example.label} className="border-b border-dotted border-line">
                  <LabLink
                    href={example.href}
                    className={cn(
                      "flex items-center justify-between gap-3 px-1 py-3 font-mono text-[12px] uppercase leading-[1.2]",
                      LAB_HOVER,
                    )}
                  >
                    {example.label}
                    <span aria-hidden>→</span>
                  </LabLink>
                </li>
              ))}
            </ul>
          ) : null}
          {topic.cta ? (
            <div className="col-span-full">
              {isLinkCta(topic.cta) ? (
                <Button asChild variant="outline" size="sm">
                  <LabLink href={topic.cta.href}>{topic.cta.label}</LabLink>
                </Button>
              ) : (
                topic.cta
              )}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

const FOOTER_MARKS = [1, 4, 7, 10, 13, 16, 19, 22, 25];

export type LabFooterRowsProps = { children: ReactNode; className?: string };

export function LabFooterRows({ children, className }: LabFooterRowsProps) {
  return (
    <div className={cn(LAB_COLS, "col-span-full border-t border-line pt-4", className)}>
      {Children.toArray(children).map((row, i) => (
        <Fragment key={i}>
          {i > 0 ? <RegMarks columns={FOOTER_MARKS} className="h-14 min-[760px]:h-[164px]" /> : null}
          <div className="col-span-full grid grid-cols-subgrid gap-y-3">{row}</div>
        </Fragment>
      ))}
    </div>
  );
}
