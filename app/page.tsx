"use client"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import TechShapes from "@/components/tech-shapes"

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="bg-white">
        <Hero />
        <TechShapes />
      </main>
    </>
  )
}
