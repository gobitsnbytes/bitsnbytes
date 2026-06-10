"use client";

import { cn } from "@/lib/utils";

// IMPECCABLE_PREFLIGHT: context=pass product=pass command_reference=pass shape=not_required image_gate=skipped:using_css_styling_no_new_image_assets_needed mutation=open

type PageBackgroundProps = {
  className?: string;
};

export function PageBackground({ className }: PageBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#eae8e4]", className)}
    >
      {/* Subtle Neobrutalist coordinate grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,15,10,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(18,15,10,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Stipple noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.05] bg-noise-texture" />
    </div>
  );
}

export default PageBackground;
