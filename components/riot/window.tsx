import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const BARS = {
  acid: "bg-acid text-ink",
  orange: "bg-orange text-ink",
  cobalt: "bg-cobalt text-white",
} as const;

export type WindowProps = Omit<ComponentProps<"div">, "title"> & {
  /** Mono title shown in the bar. */
  title: ReactNode;
  bar?: keyof typeof BARS;
  bodyClassName?: string;
};

/** Retro window chrome: coloured title bar, three square lights, mono title, body slot. */
export function Window({ title, bar = "acid", className, bodyClassName, children, ...props }: WindowProps) {
  return (
    <div
      className={cn(
        "border-3 border-line bg-card text-card-foreground shadow-[10px_10px_0_0_var(--shadow-color)]",
        className,
      )}
      {...props}
    >
      <div className={cn("flex items-center gap-2 border-b-3 border-line px-2.5 py-2", BARS[bar])}>
        <span aria-hidden className="size-3.5 shrink-0 border-2 border-ink bg-burgundy" />
        <span aria-hidden className="size-3.5 shrink-0 border-2 border-ink bg-acid" />
        <span aria-hidden className="size-3.5 shrink-0 border-2 border-ink bg-slime" />
        <div className="ml-1.5 min-w-0 truncate font-mono text-[11px] font-bold uppercase tracking-[0.12em]">{title}</div>
        <span aria-hidden className="ml-auto shrink-0 font-mono text-[13px] font-bold">
          — ▢ ✕
        </span>
      </div>
      <div className={cn("p-4.5", bodyClassName)}>{children}</div>
    </div>
  );
}
