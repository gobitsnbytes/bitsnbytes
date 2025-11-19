import { cn } from "@/lib/utils"

type TechShapesProps = {
  className?: string
}

const cards = [
  {
    title: "Learn",
    copy: "Master web dev, mobile, and cutting-edge makerspace tech.",
    bg: "bg-[var(--brand-plum)]",
    text: "text-white",
    graphic: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M50 10 L90 90 L10 90 Z" fill="white" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: "Collaborate",
    copy: "Build ambitious projects with passionate peers across schools.",
    bg: "bg-[var(--brand-coral)]",
    text: "text-[var(--brand-purple)]",
    graphic: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="20" y="20" width="60" height="60" fill="white" opacity="0.3" />
        <rect x="40" y="40" width="20" height="20" fill="white" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: "Hack",
    copy: "Turn creativity into prototypes, MVPs, and real-world impact.",
    bg: "bg-[var(--brand-pink)]",
    text: "text-white",
    graphic: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="30" fill="white" opacity="0.3" />
        <circle cx="50" cy="50" r="15" fill="white" opacity="0.5" />
      </svg>
    ),
  },
]

export default function TechShapes({ className }: TechShapesProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 md:grid-cols-3", className)}>
      {cards.map((card) => (
        <div
          key={card.title}
          className="glass-card group relative isolate cursor-pointer overflow-hidden p-8 text-foreground shadow-xl hover:shadow-[var(--glow-strong)] dark:text-white"
        >
          <div
            className={cn(
              "absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20",
              card.bg,
            )}
          />
          <div className="absolute inset-0 opacity-10">{card.graphic}</div>
          <div className={cn("relative z-10 flex h-64 flex-col justify-between text-foreground dark:text-white")}>
            <div>
              <div className="font-display text-2xl font-bold">{card.title}</div>
              <p className="mt-3 text-sm text-foreground/80 dark:text-white/80">{card.copy}</p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand-pink)]">
              Explore
              <span className="h-px w-6 bg-[var(--brand-pink)]" />
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
