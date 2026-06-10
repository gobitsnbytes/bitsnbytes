import { Rocket, Lightbulb, CodeXml, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Features() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="relative">
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {/* Card 1: 1400+ Members */}
          <div
            className="col-span-full lg:col-span-2 bg-card border-4 border-border shadow-[8px_8px_0px_0px_var(--border)] flex flex-col items-center justify-center p-8 md:p-12 group transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0px_0px_var(--border)] duration-200"
          >
            <div className="relative m-auto h-full w-full flex flex-col items-center justify-center">
              <div className="relative border-3 border-border bg-secondary px-6 py-4 shadow-[4px_4px_0px_0px_var(--border)] transition-transform group-hover:scale-105 group-hover:-rotate-1">
                <span className="mx-auto block w-fit text-5xl md:text-6xl font-black text-foreground tracking-tighter font-mono">
                  1400+
                </span>
                <span className="absolute -top-3 -right-3 border-2 border-border bg-[#fc920d] text-[#120f0a] dark:text-[#120f0a] px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_var(--border)]">
                  LIVE
                </span>
              </div>
              <h2 className="mt-8 text-center text-2xl font-black text-foreground uppercase tracking-widest">
                Members
              </h2>
            </div>
          </div>

          {/* Card 2: Workshops */}
          <div
            className="col-span-full sm:col-span-3 lg:col-span-2 bg-card border-4 border-border shadow-[8px_8px_0px_0px_var(--border)] p-8 md:p-12 group transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0px_0px_var(--border)] duration-200"
          >
            <div className="relative mx-auto flex aspect-square size-24 items-center justify-center border-3 border-border bg-secondary shadow-[4px_4px_0px_0px_var(--border)] transition-transform group-hover:scale-105 group-hover:rotate-2">
              <Lightbulb className="h-10 w-10 text-primary dark:text-accent" />
              <span className="absolute -top-2.5 -right-2.5 border-2 border-border bg-primary text-primary-foreground px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_var(--border)]">
                NEW
              </span>
            </div>
            <div className="relative z-10 mt-8 space-y-3 text-center">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Workshops</h2>
              <p className="text-sm text-muted-foreground font-semibold">
                Dev tools and AI, one weekend at a time.
              </p>
            </div>
          </div>

          {/* Card 3: 5+ Forks */}
          <div
            className="col-span-full sm:col-span-3 lg:col-span-2 bg-card border-4 border-border shadow-[8px_8px_0px_0px_var(--border)] p-8 md:p-12 group transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0px_0px_var(--border)] duration-200"
          >
            <div className="relative mx-auto flex aspect-square size-24 items-center justify-center border-3 border-border bg-secondary shadow-[4px_4px_0px_0px_var(--border)] transition-transform group-hover:scale-105 group-hover:-rotate-2">
              <CodeXml className="h-10 w-10 text-primary dark:text-accent" />
              <span className="absolute -top-2.5 -right-2.5 border-2 border-border bg-[#fc920d] text-[#120f0a] dark:text-[#120f0a] px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_var(--border)]">
                CITY
              </span>
            </div>
            <div className="relative z-10 mt-8 space-y-3 text-center">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">
                5+ Forks
              </h2>
              <p className="text-sm text-muted-foreground font-semibold">
                Active city chapters — <Link href="/fork" className="underline text-primary dark:text-accent hover:opacity-80 transition-opacity font-bold">gobitsnbytes.org/fork</Link>
              </p>
            </div>
          </div>

          {/* Card 4: Innovation */}
          <div
            className="col-span-full lg:col-span-3 bg-card border-4 border-border shadow-[8px_8px_0px_0px_var(--border)] p-8 md:p-10 group transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0px_0px_var(--border)] duration-200"
          >
            <div className="grid sm:grid-cols-2 h-full gap-6">
              <div className="relative z-10 flex flex-col justify-between space-y-8 h-full">
                <div className="relative flex aspect-square size-14 items-center justify-center border-3 border-border bg-secondary shadow-[3px_3px_0px_0px_var(--border)]">
                  <Rocket className="size-7 text-primary dark:text-accent" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-black text-foreground uppercase tracking-tight">
                    Innovation
                  </h2>
                  <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
                    AI, distributed systems, creative code. The stuff we
                    actually work on.
                  </p>
                </div>
              </div>
              <div className="relative min-h-[160px] border-3 border-border bg-muted p-4 sm:ml-4 overflow-hidden shadow-[4px_4px_0px_0px_var(--border)] flex flex-col justify-between bb-dither">
                <div className="absolute left-3 top-3 flex gap-1.5 z-20">
                  <span className="block size-2.5 rounded-full border-2 border-border bg-red-500"></span>
                  <span className="block size-2.5 rounded-full border-2 border-border bg-yellow-400"></span>
                  <span className="block size-2.5 rounded-full border-2 border-border bg-green-500"></span>
                </div>
                {/* Neobrutalist line chart mockup */}
                <div className="relative w-full h-[95px] mt-6 flex items-end z-10">
                  <svg
                    className="w-full h-full opacity-80 transition-opacity group-hover:opacity-100"
                    viewBox="0 0 200 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Gridlines */}
                    <line x1="0" y1="20" x2="200" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.15" />
                    <line x1="0" y1="50" x2="200" y2="50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.15" />
                    <line x1="0" y1="80" x2="200" y2="80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.15" />

                    {/* Filled Area */}
                    <path
                      d="M 0 90 L 30 70 L 60 85 L 90 40 L 120 65 L 150 25 L 180 35 L 200 10 L 200 100 L 0 100 Z"
                      fill="#fc920d"
                      opacity="0.2"
                    />

                    {/* Stroke Line */}
                    <path
                      d="M 0 90 L 30 70 L 60 85 L 90 40 L 120 65 L 150 25 L 180 35 L 200 10"
                      stroke="#97192c"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Dot points */}
                    <circle cx="90" cy="40" r="4.5" fill="#fc920d" stroke="currentColor" strokeWidth="2" />
                    <circle cx="150" cy="25" r="4.5" fill="#fc920d" stroke="currentColor" strokeWidth="2" />
                    <circle cx="200" cy="10" r="4.5" fill="#fc920d" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Team & Mentorship */}
          <div
            className="col-span-full lg:col-span-3 bg-card border-4 border-border shadow-[8px_8px_0px_0px_var(--border)] p-8 md:p-10 group transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0px_0px_var(--border)] duration-200"
          >
            <div className="grid sm:grid-cols-2 h-full gap-6">
              <div className="relative z-10 flex flex-col justify-between space-y-8 h-full">
                <div className="relative flex aspect-square size-14 items-center justify-center border-3 border-border bg-secondary shadow-[3px_3px_0px_0px_var(--border)]">
                  <Users className="m-auto size-7 text-primary dark:text-accent" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-black text-foreground uppercase tracking-tight">
                    Team & Mentorship
                  </h2>
                  <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
                    Working alongside teen developers and designers who know
                    what they&apos;re doing.
                  </p>
                </div>
              </div>
              <div className="relative mt-6 sm:mt-0 before:absolute before:inset-y-0 before:left-1/2 before:w-[3px] before:bg-border hidden sm:block">
                <div className="relative flex h-full flex-col justify-center space-y-6">
                  <div className="relative flex w-[calc(50%+1.5rem)] items-center justify-end gap-3 transition-all hover:-translate-y-0.5 duration-150">
                    <span className="block h-fit border-2 border-border bg-secondary px-3 py-1 text-xs font-mono font-black uppercase tracking-wider text-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-transform hover:rotate-1">
                      Yash Singh
                    </span>
                    <div className="size-10 shrink-0 overflow-hidden border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] bg-muted">
                      <Image
                        className="size-full object-cover"
                        src="/team/yash.jpeg"
                        alt="Yash"
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                  <div className="relative ml-[calc(50%-1rem)] flex items-center gap-3 transition-all hover:-translate-y-0.5 duration-150">
                    <div className="size-12 shrink-0 overflow-hidden border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] bg-muted">
                      <Image
                        className="size-full object-cover"
                        src="/team/akshat.jpg"
                        alt="Akshat"
                        width={48}
                        height={48}
                      />
                    </div>
                    <span className="block h-fit border-2 border-border bg-[#fda83d] dark:bg-[#fda83d]/20 dark:text-foreground px-3 py-1 text-xs font-mono font-black uppercase tracking-wider text-[#120f0a] shadow-[2px_2px_0px_0px_var(--border)] transition-transform hover:-rotate-1">
                      Akshat Kushwaha
                    </span>
                  </div>
                  <div className="relative flex w-[calc(50%+1.5rem)] items-center justify-end gap-3 transition-all hover:-translate-y-0.5 duration-150">
                    <span className="block h-fit border-2 border-border bg-secondary px-3 py-1 text-xs font-mono font-black uppercase tracking-wider text-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-transform hover:rotate-1">
                      Aadrika Maurya
                    </span>
                    <div className="size-10 shrink-0 overflow-hidden border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] bg-muted">
                      <Image
                        className="size-full object-cover"
                        src="/team/aadrika.png"
                        alt="Aadrika"
                        width={40}
                        height={40}
                      />
                    </div>
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
