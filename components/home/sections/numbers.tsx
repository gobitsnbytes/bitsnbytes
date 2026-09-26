import Link from "next/link";
import { Chapter, ChapterHead } from "@/components/riot/chapter";
import { Odometer } from "@/components/edition/odometer";
import { cn } from "@/lib/utils";

const stats = [
  { value: "1400+", label: "Community Members", detail: "active builders nationwide" },
  {
    value: "5+ Forks",
    label: "Local Hubs",
    detail: (
      <span>
        city chapters — view at{" "}
        <Link href="/fork" className="font-bold underline decoration-2 underline-offset-2 hover:text-signal">
          gobitsnbytes.org/fork
        </Link>
      </span>
    ),
  },
  { value: "4+ Events", label: "Nationwide Events", detail: "hackathons and workshops" },
  { value: "16.5 Years", label: "Mean Team Age", detail: "average age of our team" },
];

/** buttermax numbers: Anton odometers on a 2×2 board of 3px rules, straight after the statement. */
export function HomeNumbers() {
  return (
    <Chapter id="impact" title="impact" number={2} tone="paper" className="pt-0 md:pt-0">
      <div className="px-[4vw]">
        <ChapterHead
          number={2}
          label="Impact"
          title="Shipped, not just taught"
          description="A teen-led builders network. Workshops and hackathons that end with something shipped, not just something learned."
        />
        <div className="grid border-t-3 border-line md:grid-cols-2">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "relative border-b-3 border-line py-8 md:py-12",
                index % 2 === 0 ? "md:border-r-3 md:pr-10" : "md:pl-10",
              )}
            >
              <span aria-hidden className="absolute right-0 top-3 font-mono text-[10px] font-bold tracking-[0.14em] opacity-60 md:right-4">
                [METRIC_0{index + 1}]
              </span>
              <Odometer
                value={stat.value}
                label={stat.label}
                detail={stat.detail}
                className="[&>p:first-child]:text-[clamp(64px,9vw,150px)]"
              />
            </div>
          ))}
        </div>
      </div>
    </Chapter>
  );
}
