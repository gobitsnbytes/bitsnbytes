"use client"

import dynamic from "next/dynamic"

import { LiquidGlassBackdrop } from "@/components/ui/liquid-glass-effect"

const NeonScene = dynamic(() => import("@/components/ui/neon-raymarcher").then((mod) => mod.Scene), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-[40px] bg-black/30" />,
})

const highlights = [
  { label: "Hackathons run", value: "5", detail: "Student built & operated" },
  { label: "Mentors onboard", value: "18", detail: "Design · Dev · Content" },
  { label: "Prototypes shipped", value: "26", detail: "Since Jan 2024" },
]

export default function ImpactVisualization() {
  return (
    <div className="relative w-full">
      <div className="relative isolate aspect-[4/3] overflow-hidden rounded-[40px] border border-white/30 bg-white/70 shadow-2xl backdrop-blur-3xl dark:border-white/10 dark:bg-white/10">
        <LiquidGlassBackdrop radiusClassName="rounded-[inherit]" />
        <NeonScene />
        <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-40 dark:opacity-30" />
        <div className="absolute inset-x-6 bottom-6 z-10 flex flex-col gap-3 rounded-2xl border border-white/40 bg-white/80 p-5 text-foreground backdrop-blur-xl shadow-lg dark:border-white/20 dark:bg-white/20 dark:text-white sm:flex-row sm:items-center sm:justify-between">
          {highlights.map((item) => (
            <div key={item.label} className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.35em] font-medium text-foreground/80 dark:text-white/80 drop-shadow-sm">{item.label}</span>
              <p className="text-2xl font-bold text-foreground drop-shadow-sm dark:text-white">{item.value}</p>
              <p className="text-xs font-medium text-foreground/90 dark:text-white/90 drop-shadow-sm">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
