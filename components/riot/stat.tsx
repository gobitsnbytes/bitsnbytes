import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONES = {
  paper: { card: "bg-card text-card-foreground", label: "text-signal" },
  ink: { card: "bg-ink text-paper", label: "text-orange" },
  orange: { card: "bg-orange text-ink", label: "text-ink" },
  cream: { card: "bg-cream text-ink", label: "text-burgundy" },
} as const;

export type StatProps = Omit<ComponentProps<"div">, "children"> & {
  /** Big Anton figure, e.g. "1400+". Use existing numbers only. */
  value: ReactNode;
  label: ReactNode;
  detail?: ReactNode;
  tone?: keyof typeof TONES;
};

/** Hard-shadow stat card: riso strip, Anton value, mono label, optional mono detail. */
export function Stat({ value, label, detail, tone = "paper", className, ...props }: StatProps) {
  const t = TONES[tone];
  return (
    <div
      className={cn("border-3 border-line p-5 shadow-[6px_6px_0_0_var(--shadow-color)]", t.card, className)}
      {...props}
    >
      <div aria-hidden className="riso mb-4 h-2" />
      <p className="font-display text-[clamp(48px,6vw,72px)] uppercase leading-[0.85]">{value}</p>
      <p className={cn("mt-2 font-mono text-xs font-bold uppercase tracking-[0.14em]", t.label)}>{label}</p>
      {detail ? <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.06em] opacity-70">{detail}</p> : null}
    </div>
  );
}
