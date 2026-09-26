import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/** Print Riot textarea: serif body, inset ink shadow at rest, hard shadow + cobalt outline on focus. */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-24 w-full resize-y rounded-none border-3 border-line bg-input px-3.5 py-3 font-serif text-base leading-relaxed text-foreground shadow-[inset_3px_3px_0_0_rgb(18_15_10/0.08)] transition-shadow duration-100 ease-riot placeholder:text-muted-foreground focus-visible:shadow-[3px_3px_0_0_var(--shadow-color)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
