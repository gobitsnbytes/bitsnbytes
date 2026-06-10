"use client";

import { Sparkles } from "lucide-react";

export const LumaSpin = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative w-12 h-12 flex items-center justify-center border-3 border-border bg-card shadow-[3px_3px_0px_0px_var(--border)] animate-spin">
        <Sparkles className="w-6 h-6 text-accent animate-pulse" />
      </div>
      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-primary dark:text-accent animate-pulse">
        SHIPPING...
      </span>
    </div>
  );
};

export default LumaSpin;


