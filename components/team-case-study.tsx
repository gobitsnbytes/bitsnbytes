"use client"

import Image from "next/image"
import { useState, useRef } from "react"
import { CometCard } from "@/components/ui/comet-card"
import { cn } from "@/lib/utils"
import { Linkedin } from "lucide-react"

interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  image: string
  expertise?: string[]
  linkedin?: string
  accentColor?: string
  isFounder?: boolean
}

interface TeamCaseStudyProps {
  members: TeamMember[]
}

const brandColors = ["bg-[var(--brand-purple)]", "bg-[var(--brand-pink)]", "bg-[var(--brand-plum)]"]

function TeamCard({ member, bgColor }: { member: TeamMember; bgColor: string }) {
  const [dominantColor, setDominantColor] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const extractDominantColor = (img: HTMLImageElement) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Check if image has valid dimensions
    if (img.naturalWidth === 0 || img.naturalHeight === 0) return

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    
    try {
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      let r = 0,
        g = 0,
        b = 0,
        count = 0

      // Sample every 10th pixel for performance
      for (let i = 0; i < data.length; i += 40) {
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
        count++
      }

      r = Math.floor(r / count)
      g = Math.floor(g / count)
      b = Math.floor(b / count)

      setDominantColor(`rgb(${r}, ${g}, ${b})`)
    } catch (error) {
      console.error("Error extracting dominant color:", error)
    }
  }

  const cardBg = member.accentColor || (bgColor.includes("purple")
    ? "var(--brand-purple)"
    : bgColor.includes("pink")
      ? "var(--brand-pink)"
      : "var(--brand-plum)")

  const getBackgroundStyle = () => {
    if (dominantColor) {
      return `radial-gradient(circle at 50% 30%, ${dominantColor}33, ${dominantColor}11 50%, transparent 80%), ${cardBg}`
    }
    // Apply subtle gradient even without dominant color for consistency
    if (member.accentColor) {
      return `radial-gradient(circle at 50% 30%, ${member.accentColor}dd, ${member.accentColor}aa 50%, ${member.accentColor} 80%)`
    }
    return undefined
  }

  return (
    <CometCard className="w-full">
      <div
        className={cn(
          "relative flex h-full cursor-pointer flex-col items-stretch rounded-2xl p-4 backdrop-blur-xl transition-all duration-700",
          member.isFounder ? "border-2 border-[var(--brand-pink)]/50 shadow-[0_0_30px_rgba(228,90,146,0.3)]" : "border border-white/10",
          !member.accentColor && bgColor
        )}
        style={{
          background: getBackgroundStyle(),
        }}
      >
        <div className="mx-2">
          <div className="relative mt-2 aspect-[3/4] w-full overflow-hidden rounded-2xl">
            <Image
              ref={imgRef}
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
              onLoad={(e) => extractDominantColor(e.currentTarget)}
            />
          </div>
        </div>
        <div className="mt-4 flex min-h-[220px] flex-col gap-2 p-4 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] opacity-70">
                {member.role}
              </span>
              <h3 className="font-display text-2xl font-bold">{member.name}</h3>
            </div>
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20 hover:scale-110"
                aria-label={`${member.name}'s LinkedIn`}
              >
                <Linkedin className="h-5 w-5 transition-transform group-hover:scale-110" />
              </a>
            )}
          </div>
          <p className="mb-auto text-sm leading-relaxed opacity-80 line-clamp-4">{member.bio}</p>
          {member.expertise && member.expertise.length > 0 ? (
            <div className="mt-auto pt-4 flex flex-wrap gap-2">
              {member.expertise.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="pt-4 h-8" />
          )}
        </div>
      </div>
    </CometCard>
  )
}

export default function TeamCaseStudy({ members }: TeamCaseStudyProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {members.map((member, index) => {
        const bgColor = brandColors[index % brandColors.length]

        return (
          <div key={member.id} className="flex">
            <TeamCard member={member} bgColor={bgColor} />
          </div>
        )
      })}
    </div>
  )
}

