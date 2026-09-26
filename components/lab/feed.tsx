"use client";

/**
 * stripe.dev "Featured" feed: sticky filter directory + table list.
 *
 * LabFeed      [aside 1/7, sticky (lg)] [list 8/25 (lg), full width below]. The list is a subgrid:
 *              header row "/ DATE / NAME / TYPE" (mono 11px, 1px rule) then a <ul> of LabFeedRows.
 *              Without `aside` the list spans all 24 columns. Filtering is the page's job.
 * LabFeedRow   subgrid row, 1px bottom rule, 10px vertical padding: [8px square + mono date]
 *              [title, one line, ellipsized; wraps when open] [type tag] [+]. Hover (fine pointer)
 *              and keyboard focus fill the whole row with --lab-hi and ink text. With children it is
 *              a disclosure (h3 > button[aria-expanded]); the panel opens 0fr → 1fr over 800ms
 *              cubic-bezier(.19,1,.22,1) and the plus's vertical bar scales to 0 (600ms). With `href`
 *              (and no children) the row is a link. Columns: <760px date 1/4 + name 4/-1 (type hidden);
 *              ≥760px date 1/4, name 4/20, type 20/-1; with aside at lg (17 cols) 1/3, 3/15, 15/-1.
 * LabFilters   directory folders (chevron -90° → 0°, 300ms expo-out, dotted left rule) of native
 *              checkboxes drawn as pixel boxes with counts, plus "Clear filters". Sticky at lg; below
 *              lg each group is a horizontal scroll strip with a mask fade and contained overscroll.
 */
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LabLink, LabTag } from "./grid";
import { LAB_COLS, LAB_HOVER, LAB_STICKY, LAB_TEXT } from "./tokens";

const EXPO = "ease-[cubic-bezier(.19,1,.22,1)] motion-reduce:transition-none motion-off:transition-none";
const DATE = "col-[1/4] lg:group-data-[aside]/feed:col-[1/3]";
const NAME = "col-[4/-1] min-[760px]:col-[4/20] lg:group-data-[aside]/feed:col-[3/15]";
const TYPE = "max-[759px]:hidden min-[760px]:col-[20/-1] lg:group-data-[aside]/feed:col-[15/-1]";
const PANEL = "col-[1/-1] min-[760px]:col-[4/-1] lg:group-data-[aside]/feed:col-[3/-1]";
// Every cell gets a line box as tall as the title's first line, so short cells centre on it.
const LINE = "row-start-1 flex h-[1.2em] items-center text-[length:calc(0.5476vw+17.86px)]";

export type LabFeedProps = {
  /** LabFeedRow elements. */
  children: ReactNode;
  /** Sidebar (usually <LabFilters>): columns 1/7 at lg, above the list below lg. */
  aside?: ReactNode;
  /** Header labels. Default ["Date", "Name", "Type"]; omit the third to drop the type label. */
  labels?: [date: string, name: string, type?: string];
  className?: string;
};

export function LabFeed({ children, aside, labels = ["Date", "Name", "Type"], className }: LabFeedProps) {
  return (
    <div
      data-aside={aside ? "" : undefined}
      className={cn(LAB_COLS, "group/feed col-span-full gap-y-8", className)}
    >
      {aside ? <div className="col-span-full min-w-0 lg:col-[1/7] lg:row-start-1">{aside}</div> : null}
      <div className="col-span-full grid grid-cols-subgrid content-start lg:group-data-[aside]/feed:col-[8/25] lg:group-data-[aside]/feed:row-start-1">
        <div
          aria-hidden
          className="col-span-full grid grid-cols-subgrid border-b border-line py-1.5 font-mono text-[11px] uppercase leading-none"
        >
          <span className={DATE}>/ {labels[0]}</span>
          <span className={NAME}>/ {labels[1]}</span>
          {labels[2] ? <span className={TYPE}>/ {labels[2]}</span> : null}
        </div>
        <ul role="list" className="col-span-full grid grid-cols-subgrid">
          {children}
        </ul>
      </div>
    </div>
  );
}

export type LabFeedRowProps = {
  /** Mono date, e.g. labDate("2026-12-17") → "2026.12.17" (or any short mono label). */
  date: ReactNode;
  title: ReactNode;
  /** Type tag text. */
  type?: ReactNode;
  /** Replaces the 8px square. */
  icon?: ReactNode;
  /** Link row (ignored when children are given). */
  href?: string;
  /** Expandable details (summary, author, links…). */
  children?: ReactNode;
  className?: string;
};

export function LabFeedRow({ date, title, type, icon, href, children, className }: LabFeedRowProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const expandable = children !== undefined && children !== null && children !== false;
  const rowClass = cn(
    "group/row col-span-full grid grid-cols-subgrid items-start py-2.5 text-left",
    (expandable || href) && cn("cursor-pointer", LAB_HOVER),
  );

  const cells = (
    <>
      <span className={cn(DATE, LINE, "gap-[7px] font-mono")}>
        {icon ?? <span aria-hidden className="size-2 shrink-0 bg-signal" />}
        <span className="truncate text-[12px] uppercase leading-none tracking-[-0.02em]">{date}</span>
      </span>
      <span
        className={cn(
          NAME,
          LAB_TEXT.md,
          "row-start-1 min-w-0 truncate max-[759px]:pr-7",
          expandable && "group-aria-expanded/row:whitespace-normal",
        )}
      >
        {title}
      </span>
      <span className={cn(TYPE, LINE, "pr-7")}>{type ? <LabTag>{type}</LabTag> : null}</span>
      <span aria-hidden className={cn(LINE, "col-[-2/-1] justify-self-end pr-1")}>
        {expandable ? (
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
        ) : href ? (
          <span className="font-mono text-[12px] leading-none">→</span>
        ) : null}
      </span>
    </>
  );

  return (
    <li className={cn("col-span-full grid grid-cols-subgrid border-b border-line", className)}>
      <h3 className="col-span-full grid grid-cols-subgrid font-sans font-normal">
        {expandable ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className={rowClass}
          >
            {cells}
          </button>
        ) : href ? (
          <LabLink href={href} className={rowClass}>
            {cells}
          </LabLink>
        ) : (
          <span className={rowClass}>{cells}</span>
        )}
      </h3>
      {expandable ? (
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
            <div className={cn(LAB_TEXT.sm, "pb-6 pt-2")}>{children}</div>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export type LabFilterOption = { value: string; label?: string; count?: number };
export type LabFilterGroup = { id: string; label: string; options: LabFilterOption[] };
/** Selected option values per group id. */
export type LabFilterValue = Record<string, string[]>;

export type LabFiltersProps = {
  groups: LabFilterGroup[];
  value: LabFilterValue;
  onChange: (next: LabFilterValue) => void;
  /** Default "Clear filters". */
  clearLabel?: string;
  className?: string;
};

export function LabFilters({ groups, value, onChange, clearLabel = "Clear filters", className }: LabFiltersProps) {
  const active = groups.some((group) => (value[group.id]?.length ?? 0) > 0);
  const toggle = (group: string, option: string) => {
    const current = value[group] ?? [];
    onChange({
      ...value,
      [group]: current.includes(option) ? current.filter((v) => v !== option) : [...current, option],
    });
  };

  return (
    <div className={cn(LAB_STICKY, "grid content-start gap-y-6 lg:grid-cols-2 lg:gap-x-3", className)}>
      {groups.map((group) => (
        <FilterGroup key={group.id} group={group} selected={value[group.id] ?? []} onToggle={toggle} />
      ))}
      {active ? (
        <button
          type="button"
          onClick={() => onChange(Object.fromEntries(groups.map((group) => [group.id, []])))}
          className={cn(
            "justify-self-start border border-dotted border-current px-[5px] py-[2px] font-mono text-[12px] uppercase leading-[1.2] lg:col-span-full",
            LAB_HOVER,
          )}
        >
          {clearLabel}
        </button>
      ) : null}
    </div>
  );
}

function FilterGroup({
  group,
  selected,
  onToggle,
}: {
  group: LabFilterGroup;
  selected: string[];
  onToggle: (group: string, option: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const id = useId();

  return (
    <div role="group" aria-labelledby={`${id}-label`} className="min-w-0">
      <button
        type="button"
        id={`${id}-label`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 py-1 font-mono text-[11px] uppercase leading-none"
      >
        <svg
          aria-hidden
          viewBox="0 0 10 10"
          className={cn("size-2.5 transition-transform duration-300", EXPO, !open && "-rotate-90")}
        >
          <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        / {group.label}
      </button>
      <div
        id={`${id}-panel`}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-300",
          EXPO,
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <ul
            role="list"
            className="mt-2 flex gap-1 overflow-x-auto overscroll-x-contain px-3 py-1 [mask-image:linear-gradient(to_right,transparent,black_12px,black_90%,transparent)] lg:flex-col lg:overflow-visible lg:border-l lg:border-dotted lg:border-line lg:py-0 lg:pl-2.5 lg:pr-0 lg:[mask-image:none]"
          >
            {group.options.map((option) => (
              <li key={option.value} className="shrink-0">
                <label
                  className={cn(
                    LAB_TEXT.xs,
                    "flex cursor-pointer items-center gap-2 whitespace-nowrap px-1.5 py-1 capitalize text-fg/70",
                    "has-checked:bg-[var(--lab-hi,var(--marker))] has-checked:text-ink pointer-fine:hover:text-fg",
                    "has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-[var(--focus-ring)]",
                  )}
                >
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={selected.includes(option.value)}
                    onChange={() => onToggle(group.id, option.value)}
                  />
                  <span aria-hidden className="size-2.5 shrink-0 border border-current peer-checked:bg-current" />
                  <span>{option.label ?? option.value}</span>
                  {option.count !== undefined ? (
                    <sup className="font-mono text-[10px] leading-none">({option.count})</sup>
                  ) : null}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
