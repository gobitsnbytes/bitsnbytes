"use client"

import NeuralNetworkHero from "@/components/ui/neural-network-hero"

export default function NeuralHeroDemo() {
  return (
    <div className="flex h-screen w-screen flex-col">
      <NeuralNetworkHero
        title="Where algorithms become art."
        description="A minimal hero with a neural canvas — crisp, elegant, and quietly expressive. Built with React, Three.js, and a custom CPPN shader."
        badgeText="Generative Surfaces"
        badgeLabel="New"
        ctaButtons={[
          { text: "Get started", href: "#get-started", primary: true },
          { text: "View showcase", href: "#showcase" },
        ]}
        microDetails={["Low‑weight font", "Tight tracking", "Subtle motion"]}
      />
    </div>
  )
}

