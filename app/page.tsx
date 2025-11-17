"use client"
import Navigation from "@/components/navigation"
import { HeroFuturistic } from "@/components/ui/hero-futuristic"
import TechShapes from "@/components/tech-shapes"

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="bg-white">
        <HeroFuturistic />
        <TechShapes />
      </main>
    </>
  )
}
