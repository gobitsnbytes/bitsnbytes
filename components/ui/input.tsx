import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-none border-3 border-[#120f0a] bg-white px-3 py-2 text-sm text-[#120f0a] placeholder:text-[#a09f9d] focus:outline-none focus:ring-0 focus:border-[#fc920d] shadow-[2px_2px_0px_0px_#120f0a] disabled:cursor-not-allowed disabled:opacity-50 font-semibold file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#120f0a]",
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
