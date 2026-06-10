import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm font-black uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-3 border-[#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[#97192c] text-white shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a]",
        destructive: "bg-destructive text-destructive-foreground shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a]",
        outline: "bg-white text-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a]",
        secondary: "bg-[#fc920d] text-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a]",
        ghost: "border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground active:translate-x-0 active:translate-y-0 active:shadow-none shadow-none",
        link: "border-transparent bg-transparent text-[#97192c] underline-offset-4 hover:underline active:translate-x-0 active:translate-y-0 active:shadow-none shadow-none",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-3 text-xs border-2 shadow-[2px_2px_0px_0px_#120f0a] hover:shadow-[3px_3px_0px_0px_#120f0a]",
        lg: "h-14 px-8 text-base shadow-[6px_6px_0px_0px_#120f0a] hover:shadow-[8px_8px_0px_0px_#120f0a]",
        icon: "h-10 w-10 border-2 shadow-[2px_2px_0px_0px_#120f0a] hover:shadow-[3px_3px_0px_0px_#120f0a]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

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
