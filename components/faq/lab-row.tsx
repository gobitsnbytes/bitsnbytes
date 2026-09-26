"use client";

/**
 * Rows for a <LabFeed> list (children of its subgrid <ul>), in LabFeedRow's anatomy.
 *
 * LabRow       disclosure row (h3 > button[aria-expanded]): [8px square + mono label] [title] [+].
 *              Same hover/focus fill, 800ms expo-out 0fr → 1fr panel and 600ms plus → minus as the
 *              kit row, plus what the kit row lacks: `defaultOpen`, and titles that wrap instead of
 *              ellipsizing (questions must stay readable on phones).
 * LabIndexRow  static row: [square + mono label] [wrapping text]. For checklists and rules.
 *
 * ponytail: local copy of components/lab/feed.tsx LabFeedRow's markup; delete once the kit row
 * takes `defaultOpen` and a `wrap` flag.
 */
import { useId, useState, type ReactNode } from "react";
import { LAB_HOVER, LAB_TEXT } from "@/components/lab";
import { cn } from "@/lib/utils";

const EXPO = "ease-[cubic-bezier(.19,1,.22,1)] motion-reduce:transition-none motion-off:transition-none";
// Column lines match LabFeed's header ("/ DATE" 1/4, "/ NAME" from 4; 1/3 and 3 beside an aside at lg).
const LABEL = "col-[1/4] lg:group-data-[aside]/feed:col-[1/3]";
const TITLE = "col-[4/-2] lg:group-data-[aside]/feed:col-[3/-2]";
const PANEL = "col-[1/-1] min-[760px]:col-[4/-1] lg:group-data-[aside]/feed:col-[3/-1]";
// Short cells get a line box as tall as the title's first line so they centre on it.
const LINE = "row-start-1 flex h-[1.2em] items-center text-[length:calc(0.5476vw+17.86px)]";

function Label({ children }: { children: ReactNode }) {
  return (
    <span className={cn(LABEL, LINE, "gap-[7px] font-mono")}>
      <span aria-hidden className="size-2 shrink-0 bg-signal" />
      <span className="text-[12px] uppercase leading-none tracking-[-0.02em]">{children}</span>
    </span>
  );
}

export type LabRowProps = {
  /** Mono index, e.g. "Q.01". */
  label: string;
  title: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function LabRow({ label, title, defaultOpen = false, children }: LabRowProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <li className="col-span-full grid grid-cols-subgrid border-b border-line">
      <h3 className="col-span-full grid grid-cols-subgrid font-sans font-normal">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className={cn("col-span-full grid cursor-pointer grid-cols-subgrid items-start py-2.5 text-left", LAB_HOVER)}
        >
          <Label>{label}</Label>
          <span className={cn(TITLE, LAB_TEXT.md, "row-start-1 min-w-0")}>{title}</span>
          <span aria-hidden className={cn(LINE, "col-[-2/-1] justify-self-end pr-1")}>
            <span className="relative block size-[11px]">
              <span className="absolute inset-x-0 top-[5px] h-px bg-current" />
              <span
                className={cn(
                  "absolute inset-y-0 left-[5px] w-px bg-current transition-transform duration-600",
                  EXPO,
                  open && "scale-y-0",
                )}
              />
            </span>
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        inert={!open}
        className={cn(
          "col-span-full grid grid-cols-subgrid transition-[grid-template-rows] duration-800",
          EXPO,
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className={cn(PANEL, "min-h-0 overflow-hidden")}>
          <div className={cn(LAB_TEXT.sm, "max-w-[65ch] pb-6 pt-2")}>{children}</div>
        </div>
      </div>
    </li>
  );
}

export function LabIndexRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li className="col-span-full grid grid-cols-subgrid items-start border-b border-line py-2.5">
      <Label>{label}</Label>
      <span className={cn(TITLE, LAB_TEXT.md, "row-start-1 min-w-0")}>{children}</span>
    </li>
  );
}
