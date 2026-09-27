"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

export type EditionChapter = { id: string; title: string };

export type ChapterIndexProps = {
  /** Page title from [data-edition] data-edition-title. */
  title: string;
  chapters: EditionChapter[];
  /** Index of the chapter under the viewport centre. */
  active: number;
  /** Scrolls to a chapter (Lenis when running). viaKeyboard = no animation. */
  onJump: (index: number, viaKeyboard: boolean) => void;
};

const pad = (n: number) => String(n).padStart(2, "0");

// Colours follow html[data-nav-surface] like the nav: ink on paper/orange/cream, paper on ink
// (text-fg covers paper in both themes).
const SURFACE_TEXT =
  "text-fg [[data-nav-surface=ink]_&]:text-paper [[data-nav-surface=orange]_&]:text-ink [[data-nav-surface=cream]_&]:text-ink [[data-nav-surface=ink]_&]:[--focus-ring:var(--marker)]";

/** "01 Title" row: CSS-counter numeral, Archivo title, 3px rule revealed by clip-path when active. */
function Rows({
  chapters,
  active,
  onPick,
  className,
}: {
  chapters: EditionChapter[];
  active: number;
  onPick: (index: number, event: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}) {
  return (
    <ol className={cn("[counter-reset:ch]", className)}>
      {chapters.map((chapter, index) => (
        <li key={`${chapter.id}-${index}`} className="[counter-increment:ch]">
          <a
            href={chapter.id ? `#${chapter.id}` : undefined}
            aria-current={index === active ? "true" : undefined}
            data-active={index === active}
            onClick={(event) => onPick(index, event)}
            className="group pointer-events-auto flex min-h-9 cursor-pointer items-baseline gap-3 py-1 opacity-70 transition-opacity duration-300 hover:opacity-100 data-[active=true]:opacity-100 motion-reduce:transition-none motion-off:transition-none"
          >
            <span
              aria-hidden
              className="shrink-0 font-mono text-[11px] font-bold tracking-[0.08em] before:content-[counter(ch,decimal-leading-zero)]"
            />
            <span className="min-w-0 font-sans text-base font-extrabold uppercase leading-[0.95] tracking-[-0.01em] [font-stretch:112%] group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
              {chapter.title}
            </span>
            <span
              aria-hidden
              className="h-[3px] min-w-4 flex-1 self-center bg-current [clip-path:inset(0_100%_0_0)] transition-[clip-path] delay-150 duration-300 ease-in-out group-data-[active=true]:[clip-path:inset(0)] motion-reduce:transition-none motion-off:transition-none"
            />
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * Editions chapter index, rendered by ExperienceProvider on pages with [data-edition].
 * ≥1280px: fixed left column (title + chapter rows), fades in once html[data-scrolled="true"].
 * <1280px: compact "CH 02/05 ▾" disclosure fixed bottom-left.
 */
export function ChapterIndex({ title, chapters, active, onJump }: ChapterIndexProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const pick = (index: number, event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setOpen(false);
    onJump(index, event.detail === 0);
  };

  return (
    <>
      <nav
        aria-label="Chapters"
        data-theatre-hide=""
        className={cn(
          "pointer-events-none fixed bottom-8 left-6 top-[104px] z-30 hidden w-[220px] flex-col justify-between xl:flex",
          "invisible -translate-x-2 opacity-0 transition-[opacity,translate,visibility,color] duration-300 ease-riot motion-reduce:transition-none motion-off:transition-none",
          "[[data-scrolled=true]_&]:visible [[data-scrolled=true]_&]:translate-x-0 [[data-scrolled=true]_&]:opacity-100",
          SURFACE_TEXT,
        )}
      >
        <p className="font-sans text-[22px] font-black uppercase leading-[0.9] tracking-[-0.02em] [font-stretch:125%]">
          {title}
        </p>
        <Rows chapters={chapters} active={active} onPick={pick} />
      </nav>

      <div
        ref={menuRef}
        data-theatre-hide=""
        className="fixed bottom-4 left-4 z-40 xl:hidden"
        onKeyDown={(event) => {
          if (event.key !== "Escape" || !open) return;
          setOpen(false);
          buttonRef.current?.focus();
        }}
      >
        <nav
          id={panelId}
          aria-label="Chapters"
          className={cn(
            "absolute bottom-full left-0 mb-2 w-[min(18rem,calc(100vw-2rem))] origin-bottom-left border-2 border-ink bg-paper p-3 text-ink shadow-[4px_4px_0_0_var(--ink)]",
            "transition-[opacity,scale,visibility] duration-200 ease-riot motion-reduce:transition-none motion-off:transition-none",
            open ? "visible scale-100 opacity-100" : "invisible scale-[0.97] opacity-0",
          )}
        >
          <Rows chapters={chapters} active={active} onPick={pick} className="space-y-1" />
        </nav>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "flex min-h-11 items-center gap-2 border-2 px-3 font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-300",
            "border-paper bg-ink text-paper dark:border-ink dark:bg-paper dark:text-ink",
            "[[data-nav-surface=ink]_&]:border-ink [[data-nav-surface=ink]_&]:bg-paper [[data-nav-surface=ink]_&]:text-ink",
          )}
        >
          <span className="sr-only">Chapter menu, </span>
          CH {pad(active + 1)}/{pad(chapters.length)}
          <span
            aria-hidden
            className={cn("transition-transform duration-200 ease-riot motion-reduce:transition-none", open && "rotate-180")}
          >
            ▾
          </span>
        </button>
      </div>
    </>
  );
}
