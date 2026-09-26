"use client";

import { useState } from "react";
import Image from "next/image";
import { Github, Globe, Instagram, Linkedin, Mail } from "lucide-react";

import { WIDE } from "@/components/chrome/wordmark";
import { EDITION_GUTTER } from "@/components/edition";
import { Chapter, ChapterHead, HalftoneImage, Tag } from "@/components/riot";
import { cn } from "@/lib/utils";
import { coreTeam, getTeamEmail, volunteers, type CoreTeamMember } from "./data";

const TABS = [
  { id: "all", label: "All Squads" },
  { id: "founders", label: "Founders" },
  { id: "leadership", label: "Leads" },
  { id: "volunteers", label: "Contributors" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const TRACKS = ["Operations", "Outreach", "Creative", "Tech"] as const;
const pad = (n: number) => String(n).padStart(2, "0");

const founders = coreTeam.filter((m) => m.isFounder);
const leadership = coreTeam.filter((m) => !m.isFounder);

// Colour plate + bio wipe in on hover and on keyboard focus inside the card (same trigger, CSS only).
const REVEAL =
  "[clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-300 ease-riot group-hover:[clip-path:inset(0)] group-focus-within:[clip-path:inset(0)] motion-reduce:transition-none motion-off:transition-none";

function GroupLabel({ tone, children, count }: { tone: "orange" | "burgundy" | "ink"; children: string; count: number }) {
  return (
    <h3 className="mb-6 flex items-center gap-3">
      <Tag tone={tone}>{children}</Tag>
      <span aria-hidden className="font-mono text-[11px] font-bold tracking-[0.14em] text-fg/70">
        [{pad(count)}]
      </span>
    </h3>
  );
}

function TeamCard({ member, isFounder = false }: { member: CoreTeamMember; isFounder?: boolean }) {
  const email = getTeamEmail(member.name);

  const socialLinks = [
    member.socials?.linkedin && { href: member.socials.linkedin, icon: Linkedin, label: "LinkedIn" },
    member.socials?.github && { href: member.socials.github, icon: Github, label: "GitHub" },
    member.socials?.website && { href: member.socials.website, icon: Globe, label: "Web" },
    member.socials?.instagram && { href: member.socials.instagram, icon: Instagram, label: "Instagram" },
    // Email is always present for core team
    { href: `mailto:${email}`, icon: Mail, label: "Email" },
  ].filter(Boolean) as Array<{ href: string; icon: typeof Mail; label: string }>;

  return (
    <article data-cursor-label="VIEW BIO" className="group grid content-start">
      <div className="relative [grid-area:1/1]">
        <HalftoneImage
          src={member.image}
          alt={member.name}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          priority={isFounder}
          className="aspect-[4/5]"
        />
        <div aria-hidden className={cn("absolute inset-[3px] overflow-hidden", REVEAL)}>
          <Image src={member.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px" className="object-cover" />
        </div>
        {isFounder && (
          <Tag tone="orange" className="absolute left-3 top-3 z-10 shadow-none">
            Founder
          </Tag>
        )}
      </div>

      {member.bio && (
        <p
          className={cn(
            "mt-4 font-serif text-[15px] leading-relaxed text-fg/85",
            // fine pointers: the bio is printed onto the portrait and revealed with the colour plate
            "pointer-fine:relative pointer-fine:z-10 pointer-fine:m-[3px] pointer-fine:self-end pointer-fine:border-t-3 pointer-fine:border-ink pointer-fine:bg-cream pointer-fine:p-4 pointer-fine:text-ink pointer-fine:[grid-area:1/1]",
            "pointer-fine:[clip-path:inset(100%_0_0_0)] pointer-fine:transition-[clip-path] pointer-fine:duration-300 pointer-fine:ease-riot pointer-fine:group-hover:[clip-path:inset(0)] pointer-fine:group-focus-within:[clip-path:inset(0)] motion-reduce:transition-none motion-off:transition-none",
          )}
        >
          {member.bio}
        </p>
      )}

      <div className="mt-5 border-t-3 border-line pt-3">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-signal">{member.role}</p>
        <h4 className={cn(WIDE, "mt-1.5 text-[clamp(22px,2.2vw,30px)] uppercase leading-[0.95]")}>{member.name}</h4>

        <a
          href={`mailto:${email}`}
          className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-fg/75 hover:text-signal"
          title={`Email ${member.name}`}
        >
          <Mail aria-hidden className="size-3 shrink-0" />
          <span className="truncate">{email}</span>
        </a>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            const external = !link.href.startsWith("mailto:");
            return (
              <a
                key={link.label}
                href={link.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                aria-label={`${member.name}'s ${link.label}`}
                title={`${member.name}'s ${link.label}`}
                className="flex size-8 items-center justify-center border-2 border-line bg-surface shadow-[2px_2px_0_0_var(--shadow-color)] transition-[transform,box-shadow] duration-100 hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_var(--shadow-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none motion-reduce:transition-none"
              >
                <Icon aria-hidden className="size-3.5" />
              </a>
            );
          })}
        </div>
      </div>
    </article>
  );
}

/** ch.03: leadership as halftone portraits, contributors and early contributors as a names grid. */
export function Team() {
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const show = (tab: TabId) => activeTab === "all" || activeTab === tab;

  return (
    <Chapter id="team" title="Meet The Agents" number={3} tone="paper">
      <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
        <ChapterHead
          number={3}
          label="Agents"
          title="Meet The Agents"
          description="Designers, systems engineers, logistics managers, and contributors shipping this platform."
        />

        {/* Filtering Tabs */}
        <div role="group" aria-label="Filter team" className="mb-12 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="h-9 border-2 border-line px-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-150 hover:bg-cream hover:text-ink aria-pressed:bg-fg aria-pressed:text-surface motion-reduce:transition-none"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {show("founders") && (
          <div className="mb-16">
            <GroupLabel tone="orange" count={founders.length}>
              Co-Founders
            </GroupLabel>
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {founders.map((member) => (
                <TeamCard member={member} key={member.id} isFounder />
              ))}
            </div>
          </div>
        )}

        {show("leadership") && (
          <div className="mb-16">
            <GroupLabel tone="burgundy" count={leadership.length}>
              Executive & Track Leads
            </GroupLabel>
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {leadership.map((member) => (
                <TeamCard member={member} key={member.id} />
              ))}
            </div>
          </div>
        )}

        {show("volunteers") && (
          <div className="mb-16">
            <GroupLabel tone="ink" count={volunteers.length}>
              Contributors
            </GroupLabel>
            {/* names grid: 2px rules, one cell per contributor, grouped by track */}
            <div className="grid border-l-2 border-t-2 border-line md:grid-cols-2">
              {TRACKS.map((trackName) => {
                const trackVolunteers = volunteers.filter((v) => v.section === trackName);
                if (trackVolunteers.length === 0) return null;
                return (
                  <section key={trackName} aria-label={`${trackName} Track`} className="border-b-2 border-r-2 border-line">
                    <h4 className="flex items-baseline justify-between border-b-2 border-line px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-signal">
                      <span>{trackName} Track</span>
                      <span aria-hidden>[{pad(trackVolunteers.length)}]</span>
                    </h4>
                    <ul className="grid grid-cols-2">
                      {trackVolunteers.map((v, i) => {
                        return (
                          <li
                            key={v.id}
                            className={cn("flex min-h-32 flex-col border-line px-4 py-4", i % 2 === 0 && "border-r-2", i > 1 && "border-t-2")}
                          >
                            <span className={cn(WIDE, "text-lg uppercase leading-none md:text-xl")}>{v.name}</span>
                            <span className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-fg/70">
                              {v.role || "Contributor"}
                            </span>
                            <span className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-3">
                              {v.linkedin && (
                                <a
                                  href={v.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-signal underline decoration-2 underline-offset-4 hover:text-fg"
                                >
                                  LinkedIn
                                </a>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {/* Early Contributors Note */}
        <div className="grid gap-4 border-y-3 border-line py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal">Early Contributors</h3>
          <p className="max-w-[60ch] font-serif text-lg leading-relaxed">
            We are grateful to our early team members and contributors who helped build and shape the network during its initial sprints before moving on to new chapters: <strong className={cn(WIDE, "uppercase")}>Saksham, Kaustubh, Oviya</strong>.
          </p>
        </div>

        <p className="mt-8 font-mono text-xs text-fg/70">*Roles stay flexible as our team and network grow.</p>
      </div>
    </Chapter>
  );
}
