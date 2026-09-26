import type { ReactNode } from "react";
import { WIDE } from "@/components/chrome/wordmark";
import { pad } from "@/components/edition/shared";
import { cn } from "@/lib/utils";

/** inkfish section header row: label left, [S.0N] right, 12px mono. */
export function SectionHead({ label, section, className }: { label: ReactNode; section: number; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-6 font-mono text-xs font-bold uppercase tracking-[0.08em]",
        className,
      )}
    >
      {label}
      <span className="text-signal">[S.{pad(section)}]</span>
    </div>
  );
}

/** Giant display word, with an inkfish superscript bracket count when the caller passes one. */
export function GiantCount({ children, count, className }: { children: ReactNode; count?: number; className?: string }) {
  return (
    <h2 className={cn(WIDE, "text-[clamp(44px,11.2vw,160px)] uppercase leading-[0.85]", className)}>
      {children}
      {count === undefined ? null : (
        <sup className="ml-[0.12em] inline-block align-top font-mono text-[0.25em] font-bold leading-none tracking-normal">
          <span aria-hidden>[</span>
          {pad(count)}
          <span aria-hidden>]</span>
        </sup>
      )}
    </h2>
  );
}
