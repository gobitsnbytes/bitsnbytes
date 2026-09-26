"use client";

/**
 * RouterFigure — stripe.dev's "Router": a sticky generative figure beside a list of destinations.
 *
 * Anatomy: [lg 1/7: sticky (top 110px) FigWindow + echo of the hovered title (text-md) and type
 * (tag); hidden below lg] [lg 8/25, full width below: <ol> of items — 1px top rule, h3 title link
 * (marker highlight), type tag, body, sub-links with 8px squares on dotted rules].
 * Hovering or focusing any link re-parameterises the running figure without re-mounting it:
 * seed = link title (djb2 → mulberry32), count = 4 × title length, noise = (href length + title
 * length) × 0.1, scale = 1.1 + 0.001 × href length. The last hovered link stays until the next one.
 * The section heading (LabTitle with a count) belongs to the page.
 */
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FigWindow } from "./fig-window";
import { LabLink, LabTag } from "./grid";
import { LAB_COLS, LAB_MARKER, LAB_STICKY, LAB_TEXT } from "./tokens";
import type { ArtPreset } from "./art";

export type RouterLink = { label: string; href: string };
export type RouterItem = {
  title: string;
  type: string;
  href: string;
  body?: ReactNode;
  links?: RouterLink[];
};

export type RouterFigureProps = {
  items: RouterItem[];
  /** Figure number for the bar ("[ Fig. N ]"). */
  fig: number;
  /** Art preset (default "orbits"). */
  preset?: ArtPreset;
  className?: string;
};

type Active = { title: string; type: string; href: string };

export function RouterFigure({ items, fig, preset = "orbits", className }: RouterFigureProps) {
  const first = items[0];
  const [active, setActive] = useState<Active>({
    title: first?.title ?? "",
    type: first?.type ?? "",
    href: first?.href ?? "",
  });
  const point = (next: Active) => () => {
    if (next.title !== active.title || next.href !== active.href) setActive(next);
  };

  return (
    <div className={cn(LAB_COLS, "col-span-full", className)}>
      <div className="hidden lg:col-[1/7] lg:row-start-1 lg:block">
        <div className={LAB_STICKY}>
          <FigWindow
            seed={active.title}
            fig={fig}
            preset={preset}
            count={4 * active.title.length}
            noise={(active.href.length + active.title.length) * 0.1}
            scale={1.1 + 0.001 * active.href.length}
          />
          <div aria-hidden className="mt-3 flex flex-col items-start gap-2">
            <span className={LAB_TEXT.md}>{active.title}</span>
            {active.type ? <LabTag>{active.type}</LabTag> : null}
          </div>
        </div>
      </div>

      <ol role="list" className="col-span-full lg:col-[8/25] lg:row-start-1">
        {items.map((item) => {
          const main = point({ title: item.title, type: item.type, href: item.href });
          return (
            <li key={item.href + item.title} className="flex flex-col items-start gap-3 border-t border-line py-8 last:border-b">
              <h3 className={cn(LAB_TEXT.md, "font-normal")}>
                <LabLink href={item.href} className="group/mark" onPointerEnter={main} onFocus={main}>
                  <span className={LAB_MARKER}>{item.title}</span>
                </LabLink>
              </h3>
              <LabTag>{item.type}</LabTag>
              {item.body ? <div className={cn(LAB_TEXT.sm, "max-w-[46ch]")}>{item.body}</div> : null}
              {item.links?.length ? (
                <ul role="list" className="mt-2 w-full max-w-[40rem]">
                  {item.links.map((link) => {
                    const sub = point({ title: link.label, type: item.type, href: link.href });
                    return (
                      <li key={link.href + link.label} className="border-b border-dotted border-line">
                        <LabLink
                          href={link.href}
                          className={cn(LAB_TEXT.sm, "group/mark flex items-center gap-2.5 py-2.5")}
                          onPointerEnter={sub}
                          onFocus={sub}
                        >
                          <span aria-hidden className="size-2 shrink-0 bg-signal" />
                          <span className={LAB_MARKER}>{link.label}</span>
                        </LabLink>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
