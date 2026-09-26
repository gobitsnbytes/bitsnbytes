"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { WIDE } from "@/components/chrome/wordmark";
import { cn } from "@/lib/utils";

export type PaletteRow = {
  title: string;
  description: string;
  colors: { step: string; hex: string }[];
};

/**
 * Brand palette as a table-list: title + description, then five swatch buttons (tall colour
 * plates, mono step + hex under them). Click copies the HEX; the result is announced politely.
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
      <ol className="border-t-3 border-line">
        {rows.map((row, index) => (
          <li
            key={row.title}
            className="grid gap-6 border-b-3 border-line py-8 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-10 md:py-10"
          >
            <div>
              <span className="font-mono text-xs font-bold tracking-[0.1em] text-signal">
                [{String(index + 1).padStart(2, "0")}]
              </span>
              <h3 className={cn(WIDE, "mt-2 text-[clamp(24px,2.4vw,36px)] uppercase leading-[0.92]")}>{row.title}</h3>
              <p className="mt-3 font-serif text-base leading-relaxed opacity-80">{row.description}</p>
            </div>
            <ul className="grid grid-cols-5 gap-2 md:gap-3">
              {row.colors.map((color) => {
                const copied = copiedColor === color.hex;
                return (
                  <li key={color.hex}>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(color.hex)}
                      data-cursor-label="COPY HEX"
                      className="group flex w-full cursor-pointer flex-col text-left"
                    >
                      <span
                        aria-hidden
                        className="relative block h-24 w-full border-3 border-line shadow-[3px_3px_0_0_var(--shadow-color)] transition-transform duration-150 ease-riot group-hover:-translate-y-1 group-focus-visible:-translate-y-1 group-active:translate-y-0 motion-reduce:transition-none md:h-36"
                        style={{ backgroundColor: color.hex }}
                      >
                        <span
                          className={cn(
                            "absolute right-1.5 top-1.5 grid size-6 place-items-center border-2 border-ink bg-paper text-ink transition-opacity duration-150",
                            copied ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                          )}
                        >
                          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                        </span>
                      </span>
                      <span className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] opacity-70">
                        {color.step}
                      </span>
                      <span className="font-mono text-[11px] font-bold md:text-xs">{color.hex}</span>
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
