import { cn } from "@/lib/utils"

type TechShapesProps = {
  className?: string
}

const cards = [
  {
    title: "Learn",
    copy: "Master web dev, mobile, and cutting-edge makerspace tech.",
    bg: "from-[var(--brand-plum)] to-[#2b123c]",
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
    bg: "from-[var(--brand-coral)] to-[#ffd1d1]",
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
    bg: "from-[var(--brand-pink)] to-[#711845]",
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
        <div key={card.title} className="group relative cursor-pointer rounded-3xl p-1">
          <div
            className={cn(
              "relative h-64 overflow-hidden rounded-[26px] bg-gradient-to-br p-8 shadow-[var(--glow-soft)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--glow-strong)]",
              card.bg,
            )}
          >
            <div className="absolute inset-0 opacity-20">{card.graphic}</div>
            <div className={cn("relative z-10 flex h-full flex-col justify-between", card.text)}>
              <div>
                <div className="font-display text-2xl font-bold">{card.title}</div>
                <p className="mt-3 text-sm opacity-80">{card.copy}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em]">
                Explore
                <span className="h-px w-6 bg-current" />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
