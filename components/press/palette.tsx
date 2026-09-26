"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { LAB_TEXT } from "@/components/lab";
import { cn } from "@/lib/utils";

export type PaletteRow = {
  title: string;
  description: string;
  colors: { step: string; hex: string }[];
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Brand palette as stripe.dev table rows (children of a LabGrid: each row is a subgrid). Name +
 * description in 1/7, five swatch buttons in 8/25 at lg. Click copies the HEX; the result is
 * announced politely. The label strip fills with the lab highlight on hover/focus.
 */
export function Palette({ rows }: { rows: PaletteRow[] }) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopiedColor(hex);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <>
      <p aria-live="polite" className="sr-only">
        {copiedColor ? `Copied ${copiedColor} to clipboard!` : ""}
      </p>
      <ol role="list" className="col-span-full grid grid-cols-subgrid border-t border-line">
        {rows.map((row, index) => (
          <li key={row.title} className="col-span-full grid grid-cols-subgrid gap-y-5 border-b border-line py-6 md:py-8">
            <div className="col-span-full lg:col-[1/7]">
              <span className="font-mono text-[11px] uppercase leading-none">/ {pad(index + 1)}</span>
              <h3 className={cn(LAB_TEXT.md, "mt-2")}>{row.title}</h3>
              <p className={cn(LAB_TEXT.sm, "mt-2 text-fg/80")}>{row.description}</p>
            </div>
            <ul role="list" className="col-span-full grid grid-cols-5 gap-[var(--lab-gap)] lg:col-[8/25]">
              {row.colors.map((color) => {
                const copied = copiedColor === color.hex;
                return (
                  <li key={color.hex} className="min-w-0">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(color.hex)}
                      data-cursor-label="COPY HEX"
                      className="group/sw flex w-full cursor-pointer flex-col text-left"
                    >
                      <span
                        aria-hidden
                        className="relative block h-24 w-full border border-line transition-transform duration-150 ease-riot group-hover/sw:-translate-y-1 group-focus-visible/sw:-translate-y-1 group-active/sw:translate-y-0 motion-reduce:transition-none md:h-36"
                        style={{ backgroundColor: color.hex }}
                      >
                        <span
                          className={cn(
                            "absolute right-1.5 top-1.5 grid size-6 place-items-center border border-ink bg-paper text-ink transition-opacity duration-150",
                            copied ? "opacity-100" : "opacity-0 group-hover/sw:opacity-100 group-focus-visible/sw:opacity-100",
                          )}
                        >
                          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                        </span>
                      </span>
                      <span className="mt-1 flex flex-col gap-1 border-b border-dotted border-line px-1 py-1.5 font-mono uppercase leading-none pointer-fine:group-hover/sw:bg-[var(--lab-hi,var(--acid))] pointer-fine:group-hover/sw:text-ink group-focus-visible/sw:bg-[var(--lab-hi,var(--acid))] group-focus-visible/sw:text-ink">
                        <span className="text-[10px] opacity-70">{color.step}</span>
                        <span className="truncate text-[11px] md:text-[12px]">{color.hex}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </>
  );
}
