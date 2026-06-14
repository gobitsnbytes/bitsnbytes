"use client"

import { useEffect, useRef, useState } from "react"
import createGlobe from "cobe"
import { useSpring } from "react-spring"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

const GLOBE_CONFIG = {
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
  config?: any
}) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>(0)
  
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef<number>(0)
  const phiRef = useRef(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  const [{ r }, api] = useSpring<{ r: number }>(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
      precision: 0.001,
    },
  }))

  // Observe container size
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        if (w > 0) {
          setWidth(w)
        }
      }
    })

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (width <= 0 || !canvasRef.current) return

    const activeConfig: any = {
      ...config,
      width: width * 2,
      height: width * 2,
      dark: isDark ? 1 : 0,
      diffuse: isDark ? 2.0 : 0.4,
      mapBrightness: isDark ? 1.8 : 1.2,
      mapBaseBrightness: isDark ? 0.05 : 0.0,
      baseColor: isDark 
        ? [254 / 255, 233 / 255, 207 / 255]  // brand cream continents
        : [255 / 255, 255 / 255, 255 / 255],  // #ffffff (white)
      glowColor: isDark 
        ? [151 / 255, 25 / 255, 44 / 255]     // #97192c (burgundy glow)
        : [254 / 255, 211 / 255, 158 / 255], // #fed39e (cream/orange glow)
      markerColor: isDark 
        ? [252 / 255, 146 / 255, 13 / 255]     // #fc920d (orange markers)
        : [151 / 255, 25 / 255, 44 / 255],    // #97192c (burgundy markers)
      onRender: (state: any) => {
        if (!pointerInteracting.current) {
          phiRef.current += 0.005
        }
        state.phi = phiRef.current + r.get()
        state.width = width * 2
        state.height = width * 2
      },
    }

    const globe = createGlobe(canvasRef.current, activeConfig)

    // Fade in canvas
    if (canvasRef.current) {
      canvasRef.current.style.opacity = "1"
    }

    return () => {
      globe.destroy()
    }
  }, [config, isDark, width, r])

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerInteracting.current = e.clientX - pointerInteractionMovement.current
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
  }

  const handlePointerUp = () => {
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
  }

  const handlePointerOut = () => {
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      api.start({
        r: delta / 200,
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pointerInteracting.current !== null && e.touches[0]) {
      const delta = e.touches[0].clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      api.start({
        r: delta / 100,
      })
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative mx-auto aspect-square w-full max-w-150 flex items-center justify-center",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerOut}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="w-full h-full opacity-0 transition-opacity duration-500 cursor-grab"
      />
    </div>
  )
}

export default Globe
