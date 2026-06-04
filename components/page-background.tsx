"use client";

import { cn } from "@/lib/utils";

type PageBackgroundProps = {
  className?: string;
};

export function PageBackground({ className }: PageBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-[var(--bb-burgundy-20)]" />
      <div className="absolute inset-0 bg-[radial-gradient(82%_58%_at_50%_0%,rgba(151,25,44,0.34)_0%,rgba(151,25,44,0)_64%),radial-gradient(64%_48%_at_12%_100%,rgba(252,146,13,0.18)_0%,rgba(252,146,13,0)_72%),radial-gradient(60%_52%_at_100%_90%,rgba(93,47,119,0.2)_0%,rgba(93,47,119,0)_74%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(252,146,13,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(151,25,44,0.045)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-0 opacity-10 bg-noise-texture" />
      <div className="absolute inset-x-0 top-0 h-px bg-[var(--bb-orange-80)]/20" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--bb-burgundy-100)]/20" />
    </div>
  );
}

export default PageBackground;

