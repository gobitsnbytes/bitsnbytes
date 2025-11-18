"use client"

import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  image: string
  expertise?: string[]
}

interface TeamCaseStudyProps {
  members: TeamMember[]
}

const palettes = [
  {
    gradient: "from-[var(--brand-purple)] via-[#1b0c2c] to-[#05020a]",
    text: "text-white",
  },
  {
    gradient: "from-[var(--brand-pink)] via-[#8e1c54] to-[#2a0618]",
    text: "text-white",
  },
  {
    gradient: "from-[#201230] via-[var(--brand-plum)] to-[#120720]",
    text: "text-white",
  },
]

export default function TeamCaseStudy({ members }: TeamCaseStudyProps) {
  return (
    <div className="space-y-8">
      {members.map((member, index) => {
        const palette = palettes[index % palettes.length]
        const isEven = index % 2 === 0

        return (
          <div
            key={member.id}
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br p-8 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--glow-strong)] md:p-12",
              palette.gradient,
            )}
          >
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div className={cn("flex flex-col gap-4", isEven ? "md:order-1" : "md:order-2", palette.text)}>
                <span className="inline-flex w-fit items-center rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.35em]">
                  {member.role}
                </span>
                <h3 className="font-display text-4xl font-bold sm:text-5xl">{member.name}</h3>
                <p className="text-base leading-relaxed text-white/80">{member.bio}</p>

                {member.expertise && member.expertise.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {member.expertise.map((skill) => (
                      <span key={skill} className="rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <button className="group/cta mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-all">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                </button>
              </div>

              <div className={cn("flex items-center justify-center", isEven ? "md:order-2" : "md:order-1")}>
                <div className="relative w-full max-w-sm">
                  <div className="aspect-square rounded-[32px] border border-white/20 bg-white/10 p-6 backdrop-blur-2xl dark:bg-white/5">
                    <div className="flex h-full items-center justify-center rounded-[26px] border border-white/10 bg-black/10">
                      <div className="grid h-40 w-40 place-items-center rounded-full bg-white/15 text-5xl font-bold text-white">
                        {member.name.charAt(0)}
                      </div>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-40" />
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 opacity-15">
              <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/20 to-transparent" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

