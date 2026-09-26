import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Solid variants carry the hard shadow; ghost/link stay flat.
const SOLID = ["default", "burgundy", "secondary", "orange", "outline", "cobalt", "marker", "destructive"] as const;

// Shadows are written as arbitrary values (not shadow-riot*) so tailwind-merge dedupes them
// against call-site overrides like `shadow-none` or `shadow-[4px_4px_0px_0px_#120f0a]`.
const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-none border-3 border-line font-sans font-black uppercase leading-none tracking-[0.04em] transition-[transform,box-shadow,background-color,color] duration-100 ease-riot hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:pointer-events-none disabled:opacity-45 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "bg-burgundy text-paper",
        burgundy: "bg-burgundy text-paper",
        secondary: "bg-orange text-ink",
        orange: "bg-orange text-ink",
        outline: "bg-card text-card-foreground",
        cobalt: "bg-cobalt text-white",
        marker: "bg-marker text-ink",
        destructive: "bg-destructive text-destructive-foreground",
        ghost:
          "border-transparent bg-transparent text-fg hover:translate-x-0 hover:translate-y-0 hover:bg-cream hover:text-ink active:translate-x-0 active:translate-y-0",
        link: "border-transparent bg-transparent text-burgundy underline-offset-4 hover:translate-x-0 hover:translate-y-0 hover:underline active:translate-x-0 active:translate-y-0 dark:text-orange",
      },
      size: {
        default: "h-12 px-6 text-sm",
        md: "h-12 px-6 text-sm",
        sm: "h-9 px-3.5 text-[11px]",
        lg: "h-14 px-8 text-[17px]",
        icon: "size-10 p-0",
      },
    },
    compoundVariants: [
      {
        variant: [...SOLID],
        size: ["default", "md"],
        class: "shadow-[6px_6px_0_0_var(--shadow-color)] hover:shadow-[8px_8px_0_0_var(--shadow-color)]",
      },
      {
        variant: [...SOLID],
        size: ["sm", "icon"],
        class: "shadow-[3px_3px_0_0_var(--shadow-color)] hover:shadow-[5px_5px_0_0_var(--shadow-color)]",
      },
      {
        variant: [...SOLID],
        size: "lg",
        class: "shadow-[10px_10px_0_0_var(--shadow-color)] hover:shadow-[12px_12px_0_0_var(--shadow-color)]",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * Print Riot button. Variants: default|burgundy, orange|secondary, outline, cobalt, marker, ghost,
 * plus legacy destructive/link. Sizes: sm, md|default, lg, icon. Hover lifts, active slams flush.
 * `asChild` renders the child (e.g. next/link) with the button styles.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
