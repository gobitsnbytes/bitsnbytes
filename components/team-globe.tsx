"use client";
import React from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(
  () => import("@/components/ui/globe").then((m) => m.Globe),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-pulse text-[#716f6c] font-mono text-xs uppercase tracking-widest">
          Initializing Globe...
        </div>
      </div>
    ),
  }
);

export default function TeamGlobe() {
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <Globe className="w-full h-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px]" />
    </div>
  );
}
