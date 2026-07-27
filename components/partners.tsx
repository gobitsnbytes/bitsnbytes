"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PageSection } from "@/components/page-section";
import { Sparkles, Cpu, Zap, Globe, GitBranch, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    color: "orange",
    icon: <Cloud className="w-4 h-4 text-current" />,
    logoWrapClass: "w-36",
    logoImageClass: "scale-[1.02]",
  },
  {
    name: "osmAPI",
    logo: "/partners/OSM-API-Light-BBO_4Eff.png",
    url: "https://www.osmapi.com/",
    role: "API Partner",
    description:
      "One Awesome API for everything AI. Route to OpenAI, Anthropic, Google & 14+ LLM providers.",
    features: ["Universal Router", "Multi-model", "Fast Inference"],
    color: "blue",
    icon: <Cpu className="w-4 h-4 text-current" />,
    logoWrapClass: "w-36",
    logoImageClass: "scale-[0.98]",
  },
  {
    name: "YRI Fellowship",
    logo: "/partners/yri.png",
    url: "https://www.yriscience.com/",
    role: "Knowledge Partner",
    description:
      "Supporting scientific research and early-career researchers through fellowships.",
    features: ["Research Hub", "Fellowships", "Open Science"],
    color: "purple",
    icon: <Sparkles className="w-4 h-4 text-current" />,
    logoWrapClass: "w-32",
    logoImageClass: "scale-105",
  },
  {
    name: "z.ai",
    logo: "/partners/zai.svg",
    url: "https://chat.z.ai/",
    role: "AI Partner",
    description:
      "Chat experiences and language model integrations for developers.",
    features: ["Neural Chat", "LLM Native", "Agentic IC"],
    color: "pink",
    icon: <Zap className="w-4 h-4 text-current" />,
    logoWrapClass: "w-24",
    logoImageClass: "scale-[1.08]",
  },
  {
    name: "GitLab",
    logo: "/partners/gitlab-logo-100-rgb.svg",
    mobileLogo: "/partners/gitlab-logo-500-rgb.svg",
    url: "https://about.gitlab.com/",
    learnMoreUrl: "https://about.gitlab.com/stages-devops-lifecycle/",
    learnMoreLabel: "Explore DevSecOps",
    role: "DevOps Partner",
    description:
      "A DevSecOps platform for planning, coding, securing, and shipping software.",
    features: ["CI/CD Pipelines", "DevSecOps", "Open Source"],
    color: "purple",
    icon: <GitBranch className="w-4 h-4 text-current" />,
    logoWrapClass: "w-28",
    logoImageClass: "scale-[1.04]",
  },
];

export function Partners() {
  return (
    <PageSection
      eyebrow="Ecosystem"
      title="Our partners"
      description="We work with these companies to give teen builders more to work with."
      align="center"
      className="pb-24 relative overflow-hidden"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-6 mt-4 max-w-[1400px] mx-auto px-4 relative z-10">
        {strategicPartners.map((partner, idx) => (
          <div
            key={partner.name}
            className="bg-[#faf8f5] dark:bg-[#120f0a] border border-[#120f0a]/15 dark:border-[#faf8f5]/15 p-6 sm:p-8 flex flex-col min-h-[420px] sm:min-h-[500px] hover:border-[#120f0a] dark:hover:border-[#faf8f5] transition-colors duration-200 text-[#120f0a] dark:text-[#faf8f5] relative select-none"
          >
            {/* Technical coordinate marker */}
            <span className="absolute top-2 right-3 text-[7px] font-mono text-[#120f0a]/30 dark:text-[#faf8f5]/30">
              [REF_PARTNER_0{idx + 1}]
            </span>

            <div className="mb-6 h-12 relative flex items-center mt-2">
              <div className={`h-12 relative ${partner.logoWrapClass ?? "w-40"}`}>
                {partner.mobileLogo ? (
                  <>
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className={`hidden sm:block object-contain object-left dark:brightness-125 dark:contrast-125 ${partner.logoImageClass ?? ""}`}
                    />
                    <Image
                      src={partner.mobileLogo}
                      alt={partner.name}
                      fill
                      className={`sm:hidden object-contain object-left dark:brightness-125 dark:contrast-125 ${partner.logoImageClass ?? ""}`}
                    />
                  </>
                ) : (
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className={`object-contain object-left dark:brightness-125 dark:contrast-125 ${partner.logoImageClass ?? ""}`}
                  />
                )}
              </div>
            </div>

            <p className="font-mono text-[9px] uppercase tracking-widest text-[#97192c] dark:text-[#fc920d] font-bold">
              {partner.role}
            </p>

            <h3 className="font-accent-sans text-2xl sm:text-[28px] lg:text-[22px] xl:text-3xl font-normal tracking-tight mt-2 min-h-[60px] lg:min-h-[66px] leading-[1.05] uppercase">
              {partner.name}
            </h3>

            <p className="font-serif-brand text-sm text-[#120f0a]/80 dark:text-[#faf8f5]/80 leading-relaxed min-h-[120px] line-clamp-6">
              {partner.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-6 min-h-[80px] content-start">
              {partner.features.map((feat) => (
                <span
                  key={feat}
                  className="text-[9px] px-2.5 py-1 border border-[#120f0a]/20 dark:border-[#faf8f5]/20 bg-[#faf8f5] dark:bg-[#120f0a] text-[#120f0a] dark:text-[#faf8f5] font-mono tracking-widest uppercase select-none"
                >
                  {feat}
                </span>
              ))}
            </div>

            <div className="mt-2 min-h-5 mb-4">
              {partner.learnMoreUrl ? (
                <Link
                  href={partner.learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#97192c] dark:text-[#fc920d] hover:underline"
                >
                  {partner.learnMoreLabel}
                </Link>
              ) : (
                <span
                  className="text-xs font-bold uppercase tracking-[0.18em] opacity-0 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  Explore DevSecOps
                </span>
              )}
            </div>

            <div className="flex justify-between items-center mt-auto pt-6 border-t border-[#120f0a]/15 dark:border-[#faf8f5]/15">
              <Button
                variant="outline"
                className="min-w-[140px] h-11 justify-center rounded-none border border-[#120f0a] dark:border-[#faf8f5] bg-[#faf8f5] dark:bg-[#120f0a] text-[#120f0a] dark:text-[#faf8f5] hover:bg-[#120f0a] dark:hover:bg-[#faf8f5] hover:text-[#faf8f5] dark:hover:text-[#120f0a] font-black uppercase tracking-wider shadow-none hover:shadow-none hover:-translate-x-0 hover:-translate-y-0 active:scale-[0.97] transition-movement cursor-pointer"
                asChild
              >
                <Link
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit site
                  <Globe className="w-3.5 h-3.5 ml-2" />
                </Link>
              </Button>
              <div className="p-2 border border-[#120f0a] dark:border-[#faf8f5] bg-[#faf8f5] dark:bg-[#120f0a] text-[#120f0a] dark:text-[#faf8f5] select-none">
                {partner.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageSection>
  );
}

export default Partners;
