"use client";

import { useState } from "react";

import runs from "./runs.json";

type Run = [date: string, failed: 0 | 1, title: string];

// Every completed motherboard CI/CD run, in order. One bar per run; orange bars failed.
export function RunStrip() {
  const all = runs as Run[];
  const failed = all.filter((r) => r[1]).length;
  const [active, setActive] = useState<number | null>(null);
  const run = active === null ? null : all[active];

  return (
    <figure className="lcs-strip">
      <div
        className="flex h-24 items-end gap-px sm:h-32 lg:h-28 lg:gap-[2px]"
        onPointerLeave={() => setActive(null)}
        role="img"
        aria-label={`${all.length} CI runs, ${failed} of them failed`}
      >
        {all.map((r, i) => (
          <span
            key={i}
            onPointerEnter={() => setActive(i)}
            className="lcs-bar min-w-0 flex-1"
            data-failed={r[1] ? "" : undefined}
            data-active={active === i ? "" : undefined}
            style={{ "--i": i } as React.CSSProperties}
          />
        ))}
      </div>
      <figcaption className="mt-3 flex min-h-[2.5em] flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[11px] font-bold uppercase tracking-[.14em] text-[var(--cream)] sm:text-xs">
        {run ? (
          <>
            <span className="text-[var(--orange)]">[{String(active! + 1).padStart(3, "0")}]</span>
            <span className={run[1] ? "bg-[var(--orange)] px-1 text-[var(--ink)]" : "opacity-70"}>{run[1] ? "failed" : "passed"}</span>
            <span className="min-w-0 normal-case tracking-normal opacity-90">{run[2]}</span>
          </>
        ) : (
          <>
            <span>every CI/CD run on motherboard&apos;s record</span>
            <span className="text-[var(--orange)]">■ {failed} failed</span>
            <span className="opacity-70">■ {all.length - failed} passed</span>
          </>
        )}
      </figcaption>
    </figure>
  );
}
