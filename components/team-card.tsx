"use client"

import { useState } from "react"
import Image from "next/image"

export default function TeamCard({ member }: { member: any }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="h-80 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)} style={{ perspective: "1000px" }}>
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of card - Image with splash shape */}
        <div
          className="absolute w-full h-full flex flex-col items-center justify-start overflow-hidden group hover:shadow-2xl transition-shadow"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className="w-full h-56 overflow-hidden bg-[#3e1e68]"
            style={{
              borderRadius: "0 0 50% 50% / 0 0 40% 40%",
            }}
          >
            <Image
              src={member.image || "/placeholder.svg?height=224&width=400"}
              alt={member.name}
              width={400}
              height={224}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full flex-1 bg-white flex flex-col items-center justify-center px-4 py-4 relative">
            <h3 className="font-display font-bold text-[#3e1e68] text-lg text-center">{member.name}</h3>
            <p className="text-[#e45a92] text-sm mt-1 font-medium text-center">{member.role}</p>
          </div>
        </div>

        {/* Back of card - Bio info with splash shape */}
        <div
          className="absolute w-full h-full bg-[#e45a92] flex items-center justify-center overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "0 0 50% 50% / 0 0 40% 40%",
          }}
        >
          <div className="text-center p-6">
            <p className="text-white text-sm leading-relaxed font-medium">{member.bio}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
