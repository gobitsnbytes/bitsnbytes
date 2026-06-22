"use client";

import { Rocket, Lightbulb, CodeXml, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Features() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="relative">
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
          
          {/* Card 1: 1400+ Members */}
          <div className="col-span-full lg:col-span-2 bg-[#faf8f5] dark:bg-[#120f0a] border border-[#120f0a]/15 dark:border-[#faf8f5]/15 p-6 sm:p-8 md:p-10 flex flex-col justify-between hover:border-[#120f0a] dark:hover:border-[#faf8f5] transition-colors duration-200 select-none relative min-h-[250px]">
            {/* Technical coordinate marker */}
            <span className="absolute top-2 right-3 text-[7px] font-mono text-[#120f0a]/30 dark:text-[#faf8f5]/30">
              [REF_MEMBERS_01]
            </span>

            <div className="flex items-center justify-between mt-4">
              <div className="relative border border-[#120f0a] dark:border-[#faf8f5] px-4 py-2 bg-[#faf8f5] dark:bg-[#120f0a]">
                <span className="block text-4xl sm:text-5xl md:text-6xl font-accent-sans text-[#120f0a] dark:text-[#faf8f5] tracking-tighter">
                  1400+
                </span>
                <span className="absolute -top-2.5 -right-3 border border-[#120f0a] dark:border-[#faf8f5] bg-[#faf8f5] dark:bg-[#120f0a] text-[#97192c] px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider select-none">
                  LIVE
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl sm:text-2xl font-accent-sans text-[#120f0a] dark:text-[#faf8f5] uppercase tracking-tight">
                Members
              </h2>
              <p className="font-serif-brand text-xs sm:text-sm text-[#120f0a]/70 dark:text-[#faf8f5]/70 leading-relaxed mt-2">
                A nationwide community of student builders, developers, roboticists, and designers.
              </p>
            </div>
          </div>

          {/* Card 2: Workshops */}
          <div className="col-span-full sm:col-span-3 lg:col-span-2 bg-[#faf8f5] dark:bg-[#120f0a] border border-[#120f0a]/15 dark:border-[#faf8f5]/15 p-6 sm:p-8 md:p-10 flex flex-col justify-between hover:border-[#120f0a] dark:hover:border-[#faf8f5] transition-colors duration-200 select-none relative min-h-[250px]">
            {/* Technical coordinate marker */}
            <span className="absolute top-2 right-3 text-[7px] font-mono text-[#120f0a]/30 dark:text-[#faf8f5]/30">
              [REF_WORKSHOPS_02]
            </span>

            <div className="relative border border-[#120f0a] dark:border-[#faf8f5] bg-[#faf8f5] dark:bg-[#120f0a] p-3 w-fit mt-4">
              <Lightbulb className="h-6 w-6 sm:h-7 sm:w-7 text-[#97192c]" />
              <span className="absolute -top-2 -right-2 border border-[#120f0a] dark:border-[#faf8f5] bg-[#faf8f5] dark:bg-[#120f0a] text-[#120f0a] dark:text-[#faf8f5] px-1.5 py-0.5 text-[7px] font-mono font-bold uppercase tracking-wider">
                WEEKLY
              </span>
            </div>

            <div className="mt-6">
              <h2 className="text-xl sm:text-2xl font-accent-sans text-[#120f0a] dark:text-[#faf8f5] uppercase tracking-tight">
                Workshops
              </h2>
              <p className="font-serif-brand text-xs sm:text-sm text-[#120f0a]/70 dark:text-[#faf8f5]/70 leading-relaxed mt-2">
                Dev tools, hardware interfaces, and AI engineering, one weekend at a time.
              </p>
            </div>
          </div>

          {/* Card 3: 5+ Forks */}
          <div className="col-span-full sm:col-span-3 lg:col-span-2 bg-[#faf8f5] dark:bg-[#120f0a] border border-[#120f0a]/15 dark:border-[#faf8f5]/15 p-6 sm:p-8 md:p-10 flex flex-col justify-between hover:border-[#120f0a] dark:hover:border-[#faf8f5] transition-colors duration-200 select-none relative min-h-[250px]">
            {/* Technical coordinate marker */}
            <span className="absolute top-2 right-3 text-[7px] font-mono text-[#120f0a]/30 dark:text-[#faf8f5]/30">
              [REF_FORKS_03]
            </span>

            <div className="relative border border-[#120f0a] dark:border-[#faf8f5] bg-[#faf8f5] dark:bg-[#120f0a] p-3 w-fit mt-4">
              <CodeXml className="h-6 w-6 sm:h-7 sm:w-7 text-[#97192c]" />
              <span className="absolute -top-2 -right-2 border border-[#120f0a] dark:border-[#faf8f5] bg-[#faf8f5] dark:bg-[#120f0a] text-[#120f0a] dark:text-[#faf8f5] px-1.5 py-0.5 text-[7px] font-mono font-bold uppercase tracking-wider">
                CITY
              </span>
            </div>

            <div className="mt-6">
              <h2 className="text-xl sm:text-2xl font-accent-sans text-[#120f0a] dark:text-[#faf8f5] uppercase tracking-tight">
                5+ Forks
              </h2>
              <p className="font-serif-brand text-xs sm:text-sm text-[#120f0a]/70 dark:text-[#faf8f5]/70 leading-relaxed mt-2">
                Active city chapters — request brand use and support at{" "}
                <Link href="/fork" className="underline hover:text-[#97192c] transition-colors font-bold">
                  gobitsnbytes.org/fork
                </Link>
              </p>
            </div>
          </div>

          {/* Card 4: Innovation */}
          <div className="col-span-full lg:col-span-3 bg-[#faf8f5] dark:bg-[#120f0a] border border-[#120f0a]/15 dark:border-[#faf8f5]/15 p-6 sm:p-8 md:p-10 hover:border-[#120f0a] dark:hover:border-[#faf8f5] transition-colors duration-200 select-none relative min-h-[300px]">
            {/* Technical coordinate marker */}
            <span className="absolute top-2 right-3 text-[7px] font-mono text-[#120f0a]/30 dark:text-[#faf8f5]/30">
              [REF_INNOVATE_04]
            </span>

            <div className="grid sm:grid-cols-2 h-full gap-6">
              <div className="flex flex-col justify-between h-full space-y-6 sm:space-y-8">
                <div className="relative border border-[#120f0a] dark:border-[#faf8f5] bg-[#faf8f5] dark:bg-[#120f0a] p-2.5 w-fit mt-4">
                  <Rocket className="size-5 sm:size-6 text-[#97192c]" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-accent-sans text-[#120f0a] dark:text-[#faf8f5] uppercase tracking-tight">
                    Innovation
                  </h2>
                  <p className="font-serif-brand text-xs sm:text-sm text-[#120f0a]/70 dark:text-[#faf8f5]/70 leading-relaxed">
                    AI, distributed systems, and hardware. The actual products we ship, not just study.
                  </p>
                </div>
              </div>
              
              {/* Architectural Technical Chart Mockup */}
              <div className="relative min-h-[160px] border border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-[#faf8f5] dark:bg-[#120f0a] p-4 sm:ml-4 overflow-hidden flex flex-col justify-between blueprint-dot-grid relative">
                <div className="absolute right-3 top-3 flex gap-1 z-20">
                  <span className="block size-1.5 rounded-full border border-[#120f0a]/30 dark:border-[#faf8f5]/30 bg-transparent"></span>
                  <span className="block size-1.5 rounded-full border border-[#120f0a]/30 dark:border-[#faf8f5]/30 bg-transparent"></span>
                </div>
                
                <div className="relative w-full h-[95px] mt-6 flex items-end z-10">
                  <svg
                    className="w-full h-full opacity-80"
                    viewBox="0 0 200 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Gridlines */}
                    <line x1="0" y1="20" x2="200" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.1" />
                    <line x1="0" y1="50" x2="200" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.1" />
                    <line x1="0" y1="80" x2="200" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.1" />

                    {/* Filled Area */}
                    <path
                      d="M 0 90 L 30 70 L 60 85 L 90 40 L 120 65 L 150 25 L 180 35 L 200 10 L 200 100 L 0 100 Z"
                      fill="#97192c"
                      opacity="0.08"
                    />

                    {/* Stroke Line */}
                    <path
                      d="M 0 90 L 30 70 L 60 85 L 90 40 L 120 65 L 150 25 L 180 35 L 200 10"
                      stroke="#97192c"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Dot points */}
                    <circle cx="90" cy="40" r="3.5" fill="#faf8f5" stroke="#97192c" strokeWidth="1.5" />
                    <circle cx="150" cy="25" r="3.5" fill="#faf8f5" stroke="#97192c" strokeWidth="1.5" />
                    <circle cx="200" cy="10" r="3.5" fill="#faf8f5" stroke="#97192c" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="absolute bottom-2 left-2 text-[6px] font-mono text-[#120f0a]/35 dark:text-[#faf8f5]/35">
                  [SYS_PROJ_BUILD: SUCCESS]
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Team & Mentorship */}
          <div className="col-span-full lg:col-span-3 bg-[#faf8f5] dark:bg-[#120f0a] border border-[#120f0a]/15 dark:border-[#faf8f5]/15 p-6 sm:p-8 md:p-10 hover:border-[#120f0a] dark:hover:border-[#faf8f5] transition-colors duration-200 select-none relative min-h-[300px]">
            {/* Technical coordinate marker */}
            <span className="absolute top-2 right-3 text-[7px] font-mono text-[#120f0a]/30 dark:text-[#faf8f5]/30">
              [REF_CREW_05]
            </span>

            <div className="grid sm:grid-cols-2 h-full gap-6">
              <div className="flex flex-col justify-between h-full space-y-6 sm:space-y-8">
                <div className="relative border border-[#120f0a] dark:border-[#faf8f5] bg-[#faf8f5] dark:bg-[#120f0a] p-2.5 w-fit mt-4">
                  <Users className="size-5 sm:size-6 text-[#97192c]" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-accent-sans text-[#120f0a] dark:text-[#faf8f5] uppercase tracking-tight">
                    Team & Crew
                  </h2>
                  <p className="font-serif-brand text-xs sm:text-sm text-[#120f0a]/70 dark:text-[#faf8f5]/70 leading-relaxed">
                    Work alongside active teen builders, roboticists, and C-level peers across India.
                  </p>
                </div>
              </div>
              
              {/* Tabular Index Panel for Team */}
              <div className="relative flex flex-col justify-center space-y-4 sm:pl-4 border-t sm:border-t-0 sm:border-l border-[#120f0a]/10 dark:border-[#faf8f5]/10 pt-4 sm:pt-0">
                
                {/* Yash Card */}
                <div className="flex items-center gap-3">
                  <div className="size-9 shrink-0 relative overflow-hidden border border-[#120f0a] dark:border-[#faf8f5]">
                    <Image
                      className="size-full object-cover grayscale"
                      src="/team/yash.jpeg"
                      alt="Yash"
                      fill
                      sizes="36px"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-accent-sans text-[#120f0a] dark:text-[#faf8f5] uppercase tracking-tight leading-none">
                      Yash Singh
                    </p>
                    <p className="text-[7.5px] font-mono text-[#120f0a]/50 dark:text-[#faf8f5]/50 uppercase tracking-widest mt-1">
                      CEO // FOUNDER
                    </p>
                  </div>
                </div>

                {/* Akshat Card */}
                <div className="flex items-center gap-3">
                  <div className="size-9 shrink-0 relative overflow-hidden border border-[#120f0a] dark:border-[#faf8f5]">
                    <Image
                      className="size-full object-cover grayscale"
                      src="/team/akshat.jpg"
                      alt="Akshat"
                      fill
                      sizes="36px"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-accent-sans text-[#120f0a] dark:text-[#faf8f5] uppercase tracking-tight leading-none">
                      Akshat Kushwaha
                    </p>
                    <p className="text-[7.5px] font-mono text-[#120f0a]/50 dark:text-[#faf8f5]/50 uppercase tracking-widest mt-1">
                      CTO // SYSTEM ARCHITECT
                    </p>
                  </div>
                </div>

                {/* Aadrika Card */}
                <div className="flex items-center gap-3">
                  <div className="size-9 shrink-0 relative overflow-hidden border border-[#120f0a] dark:border-[#faf8f5]">
                    <Image
                      className="size-full object-cover grayscale"
                      src="/team/aadrika.png"
                      alt="Aadrika"
                      fill
                      sizes="36px"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-accent-sans text-[#120f0a] dark:text-[#faf8f5] uppercase tracking-tight leading-none">
                      Aadrika Maurya
                    </p>
                    <p className="text-[7.5px] font-mono text-[#120f0a]/50 dark:text-[#faf8f5]/50 uppercase tracking-widest mt-1">
                      CCO & COO // NEURO RESEARCH
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
