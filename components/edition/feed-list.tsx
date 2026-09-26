"use client";

import { useId, useState, type ComponentProps, type PointerEvent, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** stripe.dev / inkfish table-list: 2px rules between rows. Children: <FeedRow>s. */
export function FeedList({ className, ...props }: ComponentProps<"ul">) {
  return <ul role="list" className={cn("border-t-2 border-line", className)} {...props} />;
}

export type FeedRowProps = {
  /** Mono date column, from existing data (e.g. "2026.12.17"). */
  date: ReactNode;
  title: ReactNode;
  /** Small mono line under the title (city, type, count…). */
  meta?: ReactNode;
  /** Whole row links out. Ignored when children are given (put links inside the details). */
  href?: string;
  /** Expandable details. Makes the row a disclosure button. */
  children?: ReactNode;
  className?: string;
};

// inkfish barcode: stripes shrink left → right (width 1/i of the column).
const STRIPES = [3, 4, 5, 6, 7, 8, 10, 14, 16, 18, 20, 30];

// Wipe state lives on the <li> (data-wipe): reset → in (fill enters from the left) → out (exits right).
const ANIM =
  "transition-[scale,clip-path] ease-[cubic-bezier(.25,1,.5,1)] group-data-[wipe=reset]/row:transition-none motion-reduce:transition-none motion-off:transition-none";
const BAR = cn(
  "pointer-events-none absolute inset-0 origin-left scale-x-0 bg-fg",
  "group-data-[wipe=in]/row:scale-x-100 group-data-[wipe=out]/row:origin-right",
  ANIM,
);
const INVERT = cn(
  "pointer-events-none absolute inset-0 text-surface [clip-path:inset(0_100%_0_0)]",
  "group-data-[wipe=in]/row:[clip-path:inset(0)] group-data-[wipe=out]/row:[clip-path:inset(0_0_0_100%)]",
  ANIM,
);

/** A cell whose fill bar + inverted copy sweep in on row hover. `pad` goes on both copies; ms timings. */
function WipeCell({
  children,
  className,
  pad,
  delay,
  duration,
}: {
  children: ReactNode;
  className?: string;
  pad: string;
  delay: number;
  duration: number;
}) {
  const timing = { transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` };
  return (
    <span className={cn("relative block", className)}>
      <span aria-hidden className={BAR} style={timing} />
      <span className={cn("relative block", pad)}>{children}</span>
      <span aria-hidden className={cn(INVERT, pad)} style={timing}>
        {children}
      </span>
    </span>
  );
}

const onPointerEnter = (event: PointerEvent<HTMLLIElement>) => {
  if (event.pointerType === "touch") return;
  const row = event.currentTarget;
  row.dataset.wipe = "reset";
  void row.offsetWidth; // commit the reset before transitioning in
  row.dataset.wipe = "in";
};

const onPointerLeave = (event: PointerEvent<HTMLLIElement>) => {
  if (event.currentTarget.dataset.wipe === "in") event.currentTarget.dataset.wipe = "out";
};

/**
 * Feed row: mono date | barcode | title + meta | plus. Hover (fine pointers) runs the barcode
 * stripe-wipe with an inverted label revealed by clip-path. With children it's an accessible
 * disclosure (button + aria-expanded; the panel opens via grid-template-rows 0fr → 1fr).
 */
export function FeedRow({ date, title, meta, href, children, className }: FeedRowProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const expandable = children !== undefined && children !== null;

  const cells = (
    <>
      <WipeCell
        delay={0}
        duration={250}
        pad="px-2 pt-4 pb-1 md:py-5"
        className="col-start-1 row-start-1 font-mono text-xs font-bold uppercase tracking-[0.08em] text-signal"
      >
        {date}
      </WipeCell>
      <span aria-hidden className="hidden items-stretch gap-[3px] py-5 md:flex">
        {STRIPES.map((i) => (
          <span
            key={i}
            className={cn(BAR, "relative inset-auto block")}
            style={{ width: `calc(100% / ${i})`, transitionDelay: `${100 + 8 * i}ms`, transitionDuration: "300ms" }}
          />
        ))}
      </span>
      <WipeCell
        delay={200}
        duration={550}
        pad="px-2 pb-4 md:py-5"
        className="col-start-1 row-start-2 min-w-0 md:col-start-auto md:row-start-auto"
      >
        <span className="block font-sans text-[clamp(18px,2vw,28px)] font-extrabold uppercase leading-[1.05] tracking-[-0.01em]">
          {title}
        </span>
        {meta ? (
          <span className="mt-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.1em] opacity-75">{meta}</span>
        ) : null}
      </WipeCell>
      <span aria-hidden className="col-start-2 row-span-2 row-start-1 grid w-10 place-items-center self-center md:col-start-auto md:row-auto">
        {expandable ? (
          <span className="relative block size-4">
            <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-current" />
            <span
              className={cn(
                "absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-current transition-transform duration-500 ease-[cubic-bezier(.19,1,.22,1)] motion-reduce:transition-none motion-off:transition-none",
                open && "scale-y-0",
              )}
            />
          </span>
        ) : href ? (
          <span className="font-mono text-base">→</span>
        ) : null}
      </span>
    </>
  );

  const rowClass =
    "grid w-full grid-cols-[minmax(0,1fr)_auto] items-stretch text-left md:grid-cols-[8.5rem_minmax(0,1fr)_minmax(0,2.4fr)_3rem] md:gap-x-3";

  return (
    <li
      className={cn("group/row border-b-2 border-line", className)}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <h3 className="font-sans">
        {expandable ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((current) => !current)}
            className={cn(rowClass, "cursor-pointer")}
          >
            {cells}
          </button>
        ) : href ? (
          <Link href={href} className={rowClass}>
            {cells}
          </Link>
        ) : (
          <span className={rowClass}>{cells}</span>
        )}
      </h3>
      {expandable ? (
        <div
          id={panelId}
          inert={!open}
          className={cn(
            "grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.19,1,.22,1)] motion-reduce:transition-none motion-off:transition-none",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="px-2 pb-6 pt-1 md:pl-[calc(8.5rem+0.75rem)]">{children}</div>
          </div>
        </div>
      ) : null}
    </li>
  );
}
