"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PageSection } from "@/components/page-section";
import { Sparkles, Cpu, Zap, Globe, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

const strategicPartners = [
  {
    name: "osmAPI",
    logo: "/partners/OSM-API-Light-BBO_4Eff.png",
    url: "https://www.osmapi.com/",
    role: "API Partner",
    description:
      "One Awesome API for everything AI. Route to OpenAI, Anthropic, Google & 14+ LLM providers.",
    features: ["Universal Router", "Multi-model", "Fast Inference"],
    color: "blue",
    icon: <Cpu className="w-5 h-5 text-[#120f0a]" />,
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
    icon: <Sparkles className="w-5 h-5 text-[#120f0a]" />,
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
    icon: <Zap className="w-5 h-5 text-[#120f0a]" />,
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
    icon: <GitBranch className="w-5 h-5 text-[#120f0a]" />,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4 max-w-7xl mx-auto px-4 relative z-10">
        {strategicPartners.map((partner) => (
          <div
            key={partner.name}
            className="bg-white border-4 border-[#120f0a] shadow-[6px_6px_0px_0px_#120f0a] p-8 flex flex-col min-h-[500px] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_#120f0a] duration-200"
          >
            <div className="mb-6 h-12 relative flex items-center">
              <div className={`h-12 relative ${partner.logoWrapClass ?? "w-40"}`}>
                {partner.mobileLogo ? (
                  <>
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className={`hidden sm:block object-contain object-left ${partner.logoImageClass ?? ""}`}
                    />
                    <Image
                      src={partner.mobileLogo}
                      alt={partner.name}
                      fill
                      className={`sm:hidden object-contain object-left ${partner.logoImageClass ?? ""}`}
                    />
                  </>
                ) : (
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className={`object-contain object-left ${partner.logoImageClass ?? ""}`}
                  />
                )}
              </div>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#97192c]">
              {partner.role}
            </p>

            <h3 className="text-3xl font-black text-[#120f0a] tracking-tight mt-2 min-h-[72px] leading-[1.05] uppercase">
              {partner.name}
            </h3>

            <p className="text-sm text-[#413f3b] leading-relaxed font-semibold min-h-[120px] line-clamp-6">
              {partner.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-6 min-h-[80px] content-start">
              {partner.features.map((feat) => (
                <span
                  key={feat}
                  className="text-[10px] px-2.5 py-1 border-2 border-[#120f0a] bg-[#fee9cf] text-[#120f0a] font-mono font-bold uppercase tracking-wider"
                >
                  {feat}
                </span>
              ))}
            </div>

            <div className="mt-4 min-h-5 mb-6">
              {partner.learnMoreUrl ? (
                <Link
                  href={partner.learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono font-black uppercase tracking-wider text-[#97192c] hover:underline"
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

            <div className="flex justify-between items-center mt-auto pt-6 border-t-2 border-[#120f0a]/10">
              <Button
                variant="outline"
                size="sm"
                className="min-w-[150px] h-11 justify-center rounded-none border-2 border-[#120f0a] bg-white text-[#120f0a] font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#120f0a] hover:bg-[#fc920d] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
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
              <div className="p-2.5 border-2 border-[#120f0a] bg-[#fee9cf] text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a]">
                {partner.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageSection>
  );
}
