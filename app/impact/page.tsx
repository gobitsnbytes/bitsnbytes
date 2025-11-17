"use client"

import Navigation from "@/components/navigation"
import ImpactVisualization from "@/components/impact-visualization"
import Image from "next/image"
import { ShaderAnimation } from "@/components/ui/shader-animation"
import { SlideTabs } from "@/components/ui/slide-tabs"

export default function Impact() {
  return (
    <>
      <Navigation />
      {/* Hero section with shader animation */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ShaderAnimation />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-in-up">
            <h1 className="font-display font-bold text-5xl sm:text-6xl text-white mb-4 drop-shadow-lg">
              Our Impact
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Transforming teen creativity into real-world impact
            </p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <SlideTabs
              tabs={["Overview", "Stats", "Events", "Projects", "Community"]}
              defaultTab={0}
            />
          </div>
        </div>
      </section>

      <main className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
            {/* Left - Visualization */}
            <div className="animate-slide-in-up w-full flex justify-center">
              <ImpactVisualization />
            </div>

            {/* Right - Stats */}
            <div className="animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
              <h2 className="font-display font-bold text-3xl text-[#3e1e68] mb-8">Building the Future</h2>
              <div className="space-y-8">
                <div className="pb-6 border-b-2 border-[#e45a92]/20">
                  <p className="font-display font-bold text-[#e45a92] text-4xl">80+</p>
                  <p className="text-[#656565] mt-2 text-lg">Students Joined from Across the Region</p>
                </div>
                <div className="pb-6 border-b-2 border-[#e45a92]/20">
                  <p className="font-display font-bold text-[#e45a92] text-4xl">10</p>
                  <p className="text-[#656565] mt-2 text-lg">Different Schools Represented</p>
                </div>
                <div className="pb-6 border-b-2 border-[#e45a92]/20">
                  <p className="font-display font-bold text-[#e45a92] text-4xl">50+</p>
                  <p className="text-[#656565] mt-2 text-lg">Projects Built by Our Community</p>
                </div>
                <div>
                  <p className="font-display font-bold text-[#e45a92] text-4xl">Hosted first high schooler led hackathon in Lucknow</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="font-display font-bold text-3xl text-[#3e1e68] mb-2 text-center">Scrapyard Lucknow 2024</h2>
            <p className="text-center text-[#656565] mb-12">
              Our first hackathon brought together talented minds to build amazing projects
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="rounded-2xl overflow-hidden border-2 border-[#e45a92]/20 hover:border-[#e45a92] transition-colors duration-300 animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="relative w-full h-64 sm:h-80">
                  <Image
                    src="/images/b653f79c-fcc9-49bb-a92a-4fc454659b3a-1-105-c.jpeg"
                    alt="Scrapyard Lucknow hackathon group photo with 40+ participants"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-display font-bold text-[#3e1e68]">Community United</h3>
                  <p className="text-sm text-[#656565] mt-1">40+ talented developers united for innovation</p>
                </div>
              </div>

              <div
                className="rounded-2xl overflow-hidden border-2 border-[#e45a92]/20 hover:border-[#e45a92] transition-colors duration-300 animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="relative w-full h-64 sm:h-80">
                  <Image
                    src="/images/432a787b-bfde-4dd0-8c2a-cb994146a3b9-1-105-c.jpeg"
                    alt="Team member presenting project ideas on whiteboard during hackathon"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-display font-bold text-[#3e1e68]">Creative Ideation</h3>
                  <p className="text-sm text-[#656565] mt-1">Brainstorming solutions to real-world problems</p>
                </div>
              </div>

              <div
                className="rounded-2xl overflow-hidden border-2 border-[#e45a92]/20 hover:border-[#e45a92] transition-colors duration-300 animate-fade-in"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="relative w-full h-64 sm:h-80">
                  <Image
                    src="/images/4c59e5bb-c1eb-4e4d-9b69-f29faa693002-1-105-c.jpeg"
                    alt="Project presentation showcase with interactive interface"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-display font-bold text-[#3e1e68]">Project Showcase</h3>
                  <p className="text-sm text-[#656565] mt-1">Presenting innovative solutions to the community</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#3e1e68] rounded-2xl text-white animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <h3 className="font-display font-bold text-lg mb-4 text-[#e45a92]">Innovation First</h3>
              <p className="text-white/80 text-sm">
                We encourage creative thinking and bold ideas. Every project is a chance to push boundaries.
              </p>
            </div>
            <div className="p-8 bg-[#e45a92] rounded-2xl text-white animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <h3 className="font-display font-bold text-lg mb-4 text-white">Community Power</h3>
              <p className="text-white/80 text-sm">
                Together we're stronger. Our community supports each other through challenges and celebrates every win.
              </p>
            </div>
            <div className="p-8 bg-[#5d2f77] rounded-2xl text-white animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <h3 className="font-display font-bold text-lg mb-4 text-[#ffacac]">Real-World Impact</h3>
              <p className="text-white/80 text-sm">
                Our projects don't just exist in code. They solve problems and make a difference in people's lives.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
