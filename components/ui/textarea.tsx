import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-none border-3 border-[#120f0a] bg-white px-3 py-2 text-sm text-[#120f0a] placeholder:text-[#a09f9d] focus:outline-none focus:ring-0 focus:border-[#fc920d] shadow-[2px_2px_0px_0px_#120f0a] disabled:cursor-not-allowed disabled:opacity-50 font-semibold",
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
