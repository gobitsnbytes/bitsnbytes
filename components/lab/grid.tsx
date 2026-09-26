/**
 * stripe.dev layout primitives (server-safe).
 *
 * LabGrid      max-w 1728px, 12px padding, 24 cols ≥760px / 8 below (LAB_COLS). Children place
 *              themselves with LabCell or col-* classes.
 * LabCell      grid-column from `span` (≥760px, 24-col lines, e.g. "1/15") and `spanSm` (<760px,
 *              8-col lines, default "1/-1"). `subgrid` makes its own children use the parent's tracks.
 * RegMarks     one row of 8px '+' registration marks centred on grid lines. Column n = the line
 *              before column n (col 1 = the left content edge, 25 = the right edge, translated 50% out).
 *              Marks past column 8 hide below 760px.
 * TableHeader  "/ LABEL" mono 11px, optional "(N)" superscript, right slot, 1px bottom rule, 6px padding.
 * LabTitle     section H2 at stripe.dev's title scale with a superscript count "(20)".
 * LabTag       1px dotted mono tag; as a link it fills with --lab-hi on hover/focus.
 * LabLink      next/link for internal hrefs, <a target=_blank> for http(s).
 * LabStyles    the kit's keyframes, hoisted once into <head> by React 19 (<style href precedence>).
 */
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LAB_COLS, LAB_HOVER, LAB_TEXT, isExternalHref } from "./tokens";

const KEYFRAMES = `
@keyframes lab-ticker { to { transform: translate3d(-33.3333%, 0, 0); } }
@keyframes lab-blink { 50% { opacity: 0; } }
`;

/** Renders the lab keyframes once per document (deduped by href). */
export function LabStyles() {
  return (
    <style href="bnb-lab-keyframes" precedence="medium">
      {KEYFRAMES}
    </style>
  );
}

export type LabGridProps = ComponentProps<"div"> & {
  as?: "div" | "section" | "header" | "footer" | "article";
};

/** 24/8-column page grid. Extra props (data-surface, data-cinematic-*, id…) pass through. */
export function LabGrid({ as: Tag = "div", className, ...props }: LabGridProps) {
  return <Tag className={cn(LAB_COLS, "mx-auto w-full max-w-[1728px] px-3", className)} {...props} />;
}

export type LabCellProps = ComponentProps<"div"> & {
  /** grid-column at ≥760px on the 24-col grid, e.g. "1/15", "8/25", "21/-1". Default "1/-1". */
  span?: string;
  /** grid-column below 760px on the 8-col grid. Default "1/-1". */
  spanSm?: string;
  /** Children align to the parent's tracks (grid-template-columns: subgrid). */
  subgrid?: boolean;
  as?: "div" | "section" | "article" | "aside" | "header" | "footer";
};

export function LabCell({ span = "1/-1", spanSm = "1/-1", subgrid, as: Tag = "div", className, style, ...props }: LabCellProps) {
  return (
    <Tag
      className={cn(
        "min-w-0 [grid-column:var(--lab-cs)] min-[760px]:[grid-column:var(--lab-c)]",
        subgrid && "grid grid-cols-subgrid",
        className,
      )}
      style={{ "--lab-c": span, "--lab-cs": spanSm, ...style } as CSSProperties}
      {...props}
    />
  );
}

export type RegMarksProps = {
  /** Grid lines to mark: 1–24 = the start of that column, 25 (or any n > 24) = the right edge. */
  columns: number[];
  className?: string;
};

export function RegMarks({ columns, className }: RegMarksProps) {
  return (
    <div aria-hidden className={cn(LAB_COLS, "col-span-full h-2 items-center text-fg", className)}>
      {columns.map((column) => {
        const end = column > 24;
        return (
          <svg
            key={column}
            viewBox="0 0 8 8"
            className={cn(
              "row-start-1 size-2 overflow-visible",
              end
                ? "col-[-2/-1] justify-self-end translate-x-1/2"
                : column === 1
                  ? "-translate-x-1/2"
                  : "-translate-x-[calc(50%+var(--lab-gap)/2)]",
              column > 8 && !end && "max-[759px]:hidden",
            )}
            style={end ? undefined : { gridColumnStart: column }}
          >
            <path d="M4.5 0V8M0 4.5H8" stroke="currentColor" strokeWidth="1" shapeRendering="crispEdges" />
          </svg>
        );
      })}
    </div>
  );
}

export type TableHeaderProps = {
  label: ReactNode;
  /** Superscript count, rendered "(N)". */
  count?: number;
  /** Right-aligned slot (e.g. a LabTag or "View all" link). */
  right?: ReactNode;
  /** Element for the label; use "h2"/"h3" when it titles a region. Default "div". */
  as?: "div" | "h2" | "h3" | "h4";
  className?: string;
};

export function TableHeader({ label, count, right, as: Tag = "div", className }: TableHeaderProps) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3 border-b border-line py-1.5", className)}>
      <Tag className="font-mono text-[11px] font-normal uppercase leading-none tracking-[0.02em]">
        / {label}
        {count !== undefined ? <sup className="ml-0.5 align-super text-[0.82em]">({count})</sup> : null}
      </Tag>
      {right ? <div className="font-mono text-[11px] uppercase leading-none">{right}</div> : null}
    </div>
  );
}

export type LabTitleProps = {
  children: ReactNode;
  /** Superscript count, rendered "(N)"; compute it from the data. */
  count?: number;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
};

export function LabTitle({ children, count, as: Tag = "h2", id, className }: LabTitleProps) {
  return (
    <Tag id={id} className={cn(LAB_TEXT.title, "min-[760px]:whitespace-nowrap", className)}>
      {children}
      {count !== undefined ? (
        <sup className="ml-[0.08em] align-top font-mono text-[0.18em] font-normal leading-none tracking-normal">
          ({count})
        </sup>
      ) : null}
    </Tag>
  );
}

export type LabLinkProps = Omit<ComponentProps<"a">, "href"> & { href: string };

/** Internal hrefs → next/link; http(s) → new tab with rel=noreferrer; mailto:/tel: → plain <a>. */
export function LabLink({ href, ...props }: LabLinkProps) {
  if (isExternalHref(href)) return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
  if (/^(mailto|tel):/.test(href)) return <a href={href} {...props} />;
  return <Link href={href} {...props} />;
}

export type LabTagProps = {
  children: ReactNode;
  href?: string;
  /** Filled with the highlight (active filter / current item). */
  active?: boolean;
  className?: string;
};

const TAG =
  "inline-flex items-center whitespace-nowrap border border-dotted border-current px-[5px] py-[2px] font-mono text-[12px] uppercase leading-[1.2] tracking-[-0.02em]";

export function LabTag({ children, href, active, className }: LabTagProps) {
  const cls = cn(TAG, active && "bg-[var(--lab-hi,var(--marker))] text-ink", href && LAB_HOVER, className);
  return href ? (
    <LabLink href={href} className={cls}>
      {children}
    </LabLink>
  ) : (
    <span className={cls}>{children}</span>
  );
}
