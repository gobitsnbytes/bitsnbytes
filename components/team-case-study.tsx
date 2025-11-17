"use client"

import { ArrowRight } from "lucide-react"

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

export default function TeamCaseStudy({ members }: TeamCaseStudyProps) {
  return (
    <div className="space-y-8">
      {members.map((member, index) => {
        const isEven = index % 2 === 0
        const bgColors = ["bg-[#3e1e68]", "bg-[#e45a92]", "bg-[#5d2f77]", "bg-[#ffacac]"]
        const bgColor = bgColors[index % 4]
        const isLightBg = bgColor === "bg-[#ffacac]"
        
        return (
          <div
            key={member.id}
            className={`group relative overflow-hidden rounded-3xl ${bgColor} transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] animate-slide-in-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              {/* Content Side */}
              <div className={`flex flex-col justify-center ${isEven ? "md:order-1" : "md:order-2"}`}>
                <div className="space-y-4">
                  <div className="inline-block">
                    <span
                      className={`text-sm font-semibold tracking-wider uppercase ${
                        isLightBg ? "text-[#3e1e68]" : "text-white/80"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                  
                  <h3
                    className={`font-display font-bold text-4xl md:text-5xl ${
                      isLightBg ? "text-[#3e1e68]" : "text-white"
                    }`}
                  >
                    {member.name}
                  </h3>
                  
                  <p
                    className={`text-lg leading-relaxed ${
                      isLightBg ? "text-[#3e1e68]/80" : "text-white/90"
                    }`}
                  >
                    {member.bio}
                  </p>
                  
                  {member.expertise && member.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {member.expertise.map((skill, idx) => (
                        <span
                          key={idx}
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            isLightBg
                              ? "bg-[#3e1e68] text-white"
                              : "bg-white/20 text-white backdrop-blur-sm"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <button
                    className={`group/btn inline-flex items-center gap-2 mt-6 font-semibold transition-all ${
                      isLightBg
                        ? "text-[#3e1e68] hover:gap-4"
                        : "text-white hover:gap-4"
                    }`}
                  >
                    Learn more
                    <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Image Side */}
              <div className={`flex items-center justify-center ${isEven ? "md:order-2" : "md:order-1"}`}>
                <div className="relative w-full aspect-square max-w-md">
                  <div
                    className={`absolute inset-0 rounded-3xl overflow-hidden ${
                      isLightBg ? "bg-[#3e1e68]/10" : "bg-white/10"
                    } backdrop-blur-sm transition-transform group-hover:scale-105`}
                  >
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: isLightBg
                          ? "radial-gradient(circle at 30% 30%, rgba(62, 30, 104, 0.1), transparent)"
                          : "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent)",
                      }}
                    >
                      {/* Placeholder for member image */}
                      <div
                        className={`w-48 h-48 rounded-full flex items-center justify-center text-6xl font-bold ${
                          isLightBg ? "bg-[#3e1e68] text-[#ffacac]" : "bg-white/20 text-white"
                        }`}
                      >
                        {member.name.charAt(0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-30"
              style={{
                background: isLightBg
                  ? "radial-gradient(circle, rgba(62, 30, 104, 0.3), transparent)"
                  : "radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent)",
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

