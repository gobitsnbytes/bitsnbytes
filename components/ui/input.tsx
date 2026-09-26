import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/** Print Riot input: 3px line border, inset ink shadow at rest, hard shadow + cobalt outline on focus. */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full min-w-0 rounded-none border-3 border-line bg-input px-3.5 py-3 font-sans text-[15px] text-foreground shadow-[inset_3px_3px_0_0_rgb(18_15_10/0.08)] transition-shadow duration-100 ease-riot placeholder:text-muted-foreground focus-visible:shadow-[3px_3px_0_0_var(--shadow-color)] disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:font-mono file:text-xs file:font-bold file:uppercase file:text-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
