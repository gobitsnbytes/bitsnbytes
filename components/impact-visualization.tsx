"use client"

export default function ImpactVisualization() {
  const schools = [
    { name: "Central High", color: "#3e1e68", size: "w-24 h-24" },
    { name: "Tech Academy", color: "#e45a92", size: "w-32 h-32" },
    { name: "Oak Ridge", color: "#5d2f77", size: "w-20 h-20" },
    { name: "Valley Tech", color: "#ffacac", size: "w-28 h-28" },
    { name: "STEAM Lab", color: "#3e1e68", size: "w-26 h-26" },
  ]

  return (
    <div className="relative h-96 flex items-center justify-center w-full">
      <div className="relative w-full h-full">
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-24 h-24 bg-[#e45a92] rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow">
            <span className="font-display font-bold text-white text-2xl">80+</span>
          </div>
        </div>

        {/* Orbiting schools */}
        {schools.map((school, i) => {
          const angle = (i / schools.length) * 360
          const distance = 140
          const x = Math.cos((angle * Math.PI) / 180) * distance
          const y = Math.sin((angle * Math.PI) / 180) * distance

          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                animation: `rotate-slow linear infinite`,
                animationDuration: "20s",
              }}
            >
              <div
                className={`${school.size} rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xs text-center p-2 hover:scale-110 transition-transform cursor-pointer`}
                style={{ backgroundColor: school.color }}
              >
                <span>{school.name}</span>
              </div>
            </div>
          )
        })}

        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
          {schools.map((_, i) => {
            const angle = (i / schools.length) * 360
            const distance = 140
            const x = Math.cos((angle * Math.PI) / 180) * distance + 200
            const y = Math.sin((angle * Math.PI) / 180) * distance + 200
            return <line key={i} x1="200" y1="200" x2={x} y2={y} stroke="#e45a92" strokeWidth="2" opacity="0.3" />
          })}
        </svg>
      </div>
    </div>
  )
}
