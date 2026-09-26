import Image from "next/image";
import Link from "next/link";
import { Cloud, Cpu, GitBranch, Globe, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Chapter, ChapterHead } from "@/components/riot/chapter";
import { DragMarquee } from "@/components/home/sections/drag-marquee";

const ICON = "size-4";

const strategicPartners = [
  {
    name: "SparkCloud",
    logo: "https://cloud.sparkden.org/sparkcloud-logo.png",
    url: "/cloud",
    learnMoreUrl: "/cloud",
    learnMoreLabel: "Explore SparkCloud",
    role: "Cloud Partner",
    description:
      "Free cloud development spaces for teen builders — code, build, and host applications from any browser with zero setup.",
    features: ["Cloud IDE", "Browser Hosting", "Spark Account"],
    icon: <Cloud aria-hidden className={ICON} />,
  },
  {
    name: "osmAPI",
    logo: "/partners/OSM-API-Light-BBO_4Eff.png",
    url: "https://www.osmapi.com/",
    role: "API Partner",
    description: "One Awesome API for everything AI. Route to OpenAI, Anthropic, Google & 14+ LLM providers.",
    features: ["Universal Router", "Multi-model", "Fast Inference"],
    icon: <Cpu aria-hidden className={ICON} />,
  },
  {
    name: "z.ai",
    logo: "/partners/zai.svg",
    url: "https://chat.z.ai/",
    role: "AI Partner",
    description: "Chat experiences and language model integrations for developers.",
    features: ["Neural Chat", "LLM Native", "Agentic IC"],
    icon: <Zap aria-hidden className={ICON} />,
  },
  {
    name: "GitLab",
    logo: "/partners/gitlab-logo-100-rgb.svg",
    mobileLogo: "/partners/gitlab-logo-500-rgb.svg",
    url: "https://about.gitlab.com/",
    learnMoreUrl: "https://about.gitlab.com/stages-devops-lifecycle/",
    learnMoreLabel: "Explore DevSecOps",
    role: "DevOps Partner",
    description: "A DevSecOps platform for planning, coding, securing, and shipping software.",
    features: ["CI/CD Pipelines", "DevSecOps", "Open Source"],
    icon: <GitBranch aria-hidden className={ICON} />,
  },
];

const LOGO_SIZES = "(min-width: 1024px) 18vw, (min-width: 768px) 40vw, 80vw";

/**
 * Partners chapter: a draggable ink ticker of every partner (entering straight off the paper works grid)
 * then a clean logo grid split by 2px ink bones. All names, roles, copy and links as before.
 */
export function Partners() {
  return (
    <Chapter id="partners" title="partners" number={4} tone="paper" className="pt-0 md:pt-0">
      <DragMarquee
        items={strategicPartners.map((partner) => (
          <span key={partner.name} className="flex items-baseline gap-4">
            <span className="font-display text-5xl uppercase leading-none md:text-7xl">{partner.name}</span>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-orange">{partner.role}</span>
          </span>
        ))}
      />

      <div className="mt-16 px-[4vw] md:mt-24">
        <ChapterHead
          number={4}
          label="Ecosystem"
          title="Our partners"
          description="We work with these companies to give teen builders more to work with."
        />
      </div>

      <ul className="grid gap-[2px] border-y-2 border-line bg-line md:grid-cols-2 lg:grid-cols-5">
        {strategicPartners.map((partner, index) => (
          <li
            key={partner.name}
            className="relative flex flex-col bg-page p-6 md:last:col-span-2 lg:last:col-span-1"
          >
            <span aria-hidden className="absolute right-3 top-2 font-mono text-[9px] font-bold tracking-[0.14em] opacity-60">
              [REF_PARTNER_0{index + 1}]
            </span>

            <div className="relative mt-4 h-24 border-2 border-line bg-white">
              {partner.mobileLogo ? (
                <>
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} partner logo`}
                    fill
                    sizes={LOGO_SIZES}
                    className="hidden object-contain p-4 sm:block"
                  />
                  <Image
                    src={partner.mobileLogo}
                    alt={`${partner.name} partner logo`}
                    fill
                    sizes={LOGO_SIZES}
                    className="object-contain p-4 sm:hidden"
                  />
                </>
              ) : (
                <Image
                  src={partner.logo}
                  alt={`${partner.name} partner logo`}
                  fill
                  sizes={LOGO_SIZES}
                  className="object-contain p-4"
                />
              )}
            </div>

            <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-signal">{partner.role}</p>
            <h3 className="mt-2 font-sans text-2xl font-black uppercase leading-[1.05] tracking-[-0.01em]">
              {partner.name}
            </h3>
            <p className="mt-3 font-serif text-[15px] leading-relaxed opacity-80">{partner.description}</p>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {partner.features.map((feature) => (
                <li
                  key={feature}
                  className="border-2 border-line px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em]"
                >
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              {partner.learnMoreUrl ? (
                <Link
                  href={partner.learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-4 inline-block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-signal underline-offset-4 hover:underline"
                >
                  {partner.learnMoreLabel}
                </Link>
              ) : null}
              <div className="flex items-center justify-between gap-3 border-t-2 border-line pt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href={partner.url} target="_blank" rel="noopener noreferrer">
                    Visit site
                    <Globe aria-hidden className="size-3.5" />
                  </Link>
                </Button>
                <span className="grid size-9 place-items-center border-2 border-line">{partner.icon}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Chapter>
  );
}

export default Partners;
