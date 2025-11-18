"use client"

import dynamic from "next/dynamic"

const NeonScene = dynamic(() => import("@/components/ui/neon-raymarcher").then((mod) => mod.Scene), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-[32px] bg-black/30" />,
})

const highlights = [
  { label: "Hackathons run", value: "5", detail: "Student built & operated" },
  { label: "Mentors onboard", value: "18", detail: "Design · Dev · Content" },
  { label: "Prototypes shipped", value: "26", detail: "Since Jan 2024" },
]

export default function ImpactVisualization() {
  return (
    <div className="relative w-full">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] border border-white/15 bg-black shadow-[var(--glow-soft)]">
        <NeonScene />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black via-transparent to-transparent opacity-80" />
        <div className="absolute inset-x-6 bottom-6 flex flex-col gap-3 rounded-2xl border border-white/20 bg-black/60 p-4 text-white backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between">
          {highlights.map((item) => (
            <div key={item.label} className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.35em] text-white/60">{item.label}</span>
              <p className="text-2xl font-semibold">{item.value}</p>
              <p className="text-xs text-white/70">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
