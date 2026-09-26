import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ConsoleWindowProps = {
  /** Mono title in the bar. */
  title: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

/**
 * stripe.dev console frame (the [C] window's chrome, re-used as a static panel): fg frame with
 * 4px sides/bottom, a 24px bar of 9px pixel buttons + mono title + draglines, and a surface body.
 * Colours follow the tone, so it reads on paper and ink. Decorative bits are aria-hidden.
 */
export function ConsoleWindow({ title, children, className, bodyClassName }: ConsoleWindowProps) {
  return (
    <div className={cn("bg-fg px-1 pb-1 text-surface", className)}>
      <div className="flex h-6 items-center gap-2 px-1 font-mono text-[10px] uppercase leading-none">
        <span aria-hidden className="flex shrink-0 gap-1">
          <span className="size-[9px] border border-current" />
          <span className="size-[9px] border border-current bg-current" />
          <span className="size-[9px] border border-current" />
        </span>
        <span className="min-w-0 truncate">{title}</span>
        <span
          aria-hidden
          className="h-[7px] min-w-6 flex-1 bg-[repeating-linear-gradient(to_bottom,currentColor_0_1px,transparent_1px_3px)] opacity-60"
        />
        <span aria-hidden className="shrink-0">
          [ ✕ ]
        </span>
      </div>
      <div className={cn("bg-surface text-fg", bodyClassName)}>{children}</div>
    </div>
  );
}
