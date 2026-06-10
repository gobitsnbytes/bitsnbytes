"use client"

import { useEffect, useRef, useState } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [151 / 255, 25 / 255, 44 / 255], // Burgundy core #97192c
  glowColor: [254 / 255, 211 / 255, 158 / 255], // Cream pop glow
  markers: [
    { location: [26.8467, 80.9462], size: 0.1 }, // Lucknow (Core Hub)
    { location: [25.4358, 81.8463], size: 0.08 }, // Prayagraj
    { location: [12.9716, 77.5946], size: 0.08 }, // Bangalore
    { location: [28.6139, 77.2090], size: 0.08 }, // Delhi
    { location: [22.5726, 88.3639], size: 0.08 }, // Kolkata
    { location: [26.2345, 81.2329], size: 0.06 }, // Raebareli
    { location: [21.1702, 72.8311], size: 0.06 }, // Surat
    { location: [30.9010, 75.8573], size: 0.06 }, // Ludhiana
    { location: [13.0827, 80.2707], size: 0.06 }, // Chennai
    { location: [19.0760, 72.8777], size: 0.08 }, // Mumbai
    { location: [26.9124, 75.7873], size: 0.06 }, // Jaipur
    { location: [17.3850, 78.4867], size: 0.06 }, // Hyderabad
  ],
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const [width, setWidth] = useState<number>(0)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  // Observe container size
  useEffect(() => {
    if (!canvasRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        if (w > 0) {
          setWidth(w)
        }
      }
    })

    observer.observe(canvasRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Initialize Globe only when size is known (> 0) and theme is resolved
  useEffect(() => {
    if (width <= 0 || !canvasRef.current) return

    const activeConfig = {
      ...config,
      width: width * 2,
      height: width * 2,
      dark: isDark ? 1 : 0,
      diffuse: isDark ? 1.2 : 0.8, // Brighter diffuse lighting in light mode
      mapBrightness: isDark ? 6.0 : 6.0, // High brightness makes dots highly visible in both modes
      baseColor: isDark 
        ? [18 / 255, 15 / 255, 10 / 255]      // #120f0a (brand black)
        : [255 / 255, 255 / 255, 255 / 255],  // #ffffff (white)
      glowColor: isDark 
        ? [151 / 255, 25 / 255, 44 / 255]     // #97192c (burgundy glow)
        : [254 / 255, 211 / 255, 158 / 255], // #fed39e (cream/orange glow)
      markerColor: isDark 
        ? [252 / 255, 146 / 255, 13 / 255]     // #fc920d (orange markers)
        : [151 / 255, 25 / 255, 44 / 255],    // #97192c (burgundy markers)
      onRender: (state) => {
        if (!pointerInteracting.current) phiRef.current += 0.005
        state.phi = phiRef.current + rs.get()
        state.width = width * 2
        state.height = width * 2
      },
    }

    const globe = createGlobe(canvasRef.current, activeConfig)

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1"
      }
    }, 0)

    return () => {
      globe.destroy()
    }
  }, [width, rs, config, isDark])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full max-w-150",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}

export default Globe
