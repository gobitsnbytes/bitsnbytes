"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

/** Radix Accordion root (type="single" collapsible | type="multiple"), stacked with gaps. */
export function Accordion({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root className={cn("flex flex-col gap-3", className)} {...props} />;
}

/** One card per item: 3px line border, 3px hard shadow. Requires a unique `value`. */
export function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        "border-3 border-line bg-card text-card-foreground shadow-[3px_3px_0_0_var(--shadow-color)]",
        className,
      )}
      {...props}
    />
  );
}

/** Heading (h3) + button. The plus square rotates into an × when open. */
export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-sans text-base font-black uppercase leading-tight tracking-[0.02em] transition-colors data-[state=open]:bg-cream data-[state=open]:text-ink",
          className,
        )}
        {...props}
      >
        {children}
        <span
          aria-hidden
          className="grid size-7 shrink-0 place-items-center border-2 border-current font-mono text-lg leading-none transition-transform duration-200 ease-riot group-data-[state=open]:rotate-45 motion-reduce:transition-none"
        >
          +
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/** Collapsible panel with serif body copy. */
export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none"
      {...props}
    >
      <div className={cn("border-t-3 border-line px-5 py-4 font-serif text-base leading-relaxed", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}
