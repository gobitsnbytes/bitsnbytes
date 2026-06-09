"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { CometCard } from "@/components/ui/comet-card";
import { cn } from "@/lib/utils";
import { Github, Globe, Linkedin, User, type LucideIcon } from "lucide-react";

export interface CoreTeamMember {
  id: number;
  name: string;
  role: string;
  bio?: string;
  image: string;
  expertise?: string[];
  linkedin?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  accentColor?: string;
  imagePosition?: string;
  mobileImagePosition?: string;
  imageScale?: number;
  mobileImageScale?: number;
  isFounder?: boolean;
  isFeatured?: boolean;
}
export interface Volunteer {
  id: number;
  name: string;
  image: string;
  linkedin?: string;
  website?: string;
  section: "Creative" | "Tech" | "Outreach" | "Operations";
  role?: string;
}

interface TeamCaseStudyProps {
  coreTeam: CoreTeamMember[];
  volunteers: Volunteer[];
}

const brandColors = [
  "var(--brand-purple)",
  "var(--brand-pink)",
  "var(--brand-plum)",
];

function TeamCard({
  member,
  accentColor,
}: {
  member: CoreTeamMember;
  accentColor: string;
}) {
  const cardAccent = member.accentColor || accentColor;

  const imageStyle = {
    "--team-image-position": member.imagePosition ?? "center top",
    "--team-image-position-mobile": member.mobileImagePosition ?? "center 24%",
    "--team-image-scale": String(member.imageScale ?? 1),
    "--team-image-scale-mobile": String(member.mobileImageScale ?? 1),
  } as CSSProperties;

  const linkedinHref = member.socials?.linkedin ?? member.linkedin;

  const socialLinks = [
    linkedinHref && {
      href: linkedinHref,
      label: `${member.name}'s LinkedIn`,
      icon: Linkedin,
    },
    member.socials?.github && {
      href: member.socials.github,
      label: `${member.name}'s GitHub`,
      icon: Github,
    },
    member.socials?.website && {
      href: member.socials.website,
      label: `${member.name}'s website`,
      icon: Globe,
    },
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    icon: LucideIcon;
  }>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", duration: 0.6, bounce: 0 }}
      className="w-full"
    >
      <CometCard 
        className="w-full" 
        rotateDepth={member.isFounder ? 20 : 17.5}
        translateDepth={member.isFounder ? 25 : 20}
      >
        <div
          className={cn(
            "relative flex cursor-pointer flex-col rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-300",
            "h-full active:scale-[0.98]",
            "md:backdrop-blur-lg",
          )}
          style={{
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.86) 0%, rgba(10,15,30,0.94) 58%, rgba(7,10,22,0.98) 100%)",
          }}
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl transition-opacity duration-500",
              member.isFounder ? "opacity-90" : "opacity-70"
            )}
            style={{
              background: `radial-gradient(140% 100% at 50% -10%, ${cardAccent}${member.isFounder ? '66' : '44'} 0%, ${cardAccent}15 45%, transparent 80%)`,
            }}
          />
          {/* Image section - larger for better portraits */}
          <div className="relative z-10 mx-1 sm:mx-2 h-[280px] sm:h-[280px] md:h-[320px] lg:h-[340px] flex-shrink-0">
            <div className="relative h-full w-full rounded-xl sm:rounded-2xl overflow-hidden">
              {/* Ambient glow background */}
              <div className={cn(
                "absolute inset-0 -z-10 scale-110 blur-2xl sm:blur-3xl transition-opacity duration-500",
                member.isFounder ? "opacity-60" : "opacity-40"
              )}>
                <Image
                  src={member.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={60}
                  className="object-cover [object-position:var(--team-image-position-mobile)] [transform:scale(var(--team-image-scale-mobile))] sm:[object-position:var(--team-image-position)] sm:[transform:scale(var(--team-image-scale))]"
                  style={imageStyle}
                />
              </div>
              {/* Main image - keep it full-bleed on mobile with tuned focal points per portrait */}
              <div className={cn(
                "relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl border bg-black/20 transition-colors duration-500",
                member.isFounder ? "border-white/20" : "border-white/12"
              )}>
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={90}
                  className="object-cover [object-position:var(--team-image-position-mobile)] [transform:scale(var(--team-image-scale-mobile))] sm:[object-position:var(--team-image-position)] sm:[transform:scale(var(--team-image-scale))]"
                  style={imageStyle}
                />
                {/* Founder-specific shimmer/aura effect overlay */}
                {member.isFounder && (
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 pointer-events-none" />
                )}
              </div>
            </div>
          </div>

          {/* Text content section - cleaner without tags */}
          <div className="relative z-10 flex-1 mt-2 sm:mt-3">
            <div className={cn(
              "absolute inset-0 -mx-3 -mb-3 sm:-mx-4 sm:-mb-4 rounded-b-xl sm:rounded-b-2xl backdrop-blur-md border-t transition-colors duration-500",
              member.isFounder ? "bg-slate-950/80 border-white/20" : "bg-slate-950/72 border-white/10"
            )} />

            <div className="relative flex h-full flex-col p-3 sm:p-4 text-white z-10">
              {/* Header with role, name, and LinkedIn */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <span
                    className="text-[0.6rem] sm:text-[0.7rem] font-black uppercase tracking-[0.1em] mb-1 block leading-normal"
                    style={{ color: cardAccent }}
                  >
                    {member.role}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                    {member.name}
                    {member.isFounder && (
                      <span 
                        className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[0.55rem] sm:text-[0.6rem] font-bold uppercase tracking-[0.15em] align-middle border shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                        style={{ 
                          backgroundColor: `${cardAccent}22`, 
                          borderColor: `${cardAccent}44`,
                          color: cardAccent 
                        }}
                      >
                        Founder
                      </span>
                    )}
                  </h3>
                </div>
                <AnimatePresence mode="wait">
                  {socialLinks.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                      className="flex shrink-0 items-center gap-1.5"
                    >
                      {socialLinks.map(({ href, label, icon: Icon }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-110 active:scale-[0.93] hover:bg-white/20"
                          aria-label={label}
                          style={{ boxShadow: `0 0 0 1px ${cardAccent}33 inset` }}
                        >
                          <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bio - cleaner and more readable */}
              <AnimatePresence>
                {member.bio && (
                  <motion.p
                    initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
                    className={cn(
                      "text-xs sm:text-sm leading-relaxed font-medium transition-colors duration-500",
                      member.isFounder ? "text-white/95" : "text-white/84"
                    )}
                  >
                    {member.bio}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </CometCard>
    </motion.div>
  );
}

function VolunteerCard({ volunteer, index }: { volunteer: Volunteer; index: number }) {
  const [imageError, setImageError] = useState(false);
  const isPlaceholder = volunteer.image.includes("placeholder");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        type: "spring",
        duration: 0.5,
        bounce: 0,
        delay: (index % 6) * 0.1, // Staggered reveal
      }}
      className="group relative flex flex-col items-center w-24 sm:w-32"
    >      <div className="relative mb-2 sm:mb-3">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--brand-purple)] via-[var(--brand-pink)] to-[var(--brand-plum)] opacity-50 blur-lg group-hover:opacity-80 transition-opacity duration-300" />

        {/* Avatar container */}
        <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full border-2 border-white/20 bg-gradient-to-br from-[var(--brand-purple)] to-[var(--brand-plum)] group-hover:border-[var(--brand-pink)]/50 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105 group-active:scale-[0.96]">
          {isPlaceholder || imageError ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--brand-purple)]/80 to-[var(--brand-plum)]/80">
              <User className="h-8 w-8 sm:h-10 sm:w-10 text-white/60" />
            </div>
          ) : (
            <Image
              src={volunteer.image}
              alt={volunteer.name}
              fill
              sizes="(max-width: 768px) 64px, (max-width: 1024px) 80px, 96px"
              quality={85}
              className="object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-0.5 sm:gap-1 text-center w-full">
        <h4 className="font-semibold text-sm sm:text-base text-white truncate w-full px-1">
          {volunteer.name}
        </h4>
        <span className="text-[0.6rem] sm:text-xs font-medium uppercase tracking-wider text-[var(--brand-pink)]/80 leading-tight">
          {volunteer.role || "Contributor"}
        </span>
        {/* Fixed height container for LinkedIn to keep grids aligned */}
        <div className="mt-1 h-7 flex items-center justify-center gap-1.5">
          {volunteer.linkedin ? (
            <a
              href={volunteer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/10 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/20 hover:scale-110 active:scale-[0.92]"
              aria-label={`${volunteer.name}'s LinkedIn`}
            >
              <Linkedin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </a>
          ) : null}
          {volunteer.website ? (
            <a
              href={volunteer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/10 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/20 hover:scale-110 active:scale-[0.92]"
              aria-label={`${volunteer.name}'s Website`}
            >
              <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamCaseStudy({
  coreTeam,
  volunteers,
}: TeamCaseStudyProps) {
  const sectionOrder: Volunteer["section"][] = [
    "Operations",
    "Outreach",
    "Creative",
    "Tech",
  ];
  const sectionLabels: Record<Volunteer["section"], string> = {
    Operations: "Operations Track",
    Outreach: "Outreach Track",
    Creative: "Creative Track",
    Tech: "Tech Track",
  };

  const founders = coreTeam.filter((m) => m.isFounder);
  const leadership = coreTeam.filter((m) => !m.isFounder);

  return (
    <div className="flex flex-col gap-8 sm:gap-16">
      {/* Founders Heading */}
      <div className="relative flex items-center justify-center py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative bg-background px-4 sm:px-6">
          <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-[var(--brand-pink)]/70">
            Co-Founders
          </span>
        </div>
      </div>

      {/* Founders */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {founders.map((member, index) => {
          const accentColor = brandColors[index % brandColors.length];

          return (
            <div
              key={member.id}
              className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] max-w-sm"
            >
              <TeamCard member={member} accentColor={accentColor} />
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative bg-background px-4 sm:px-6">
          <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-[var(--brand-pink)]/70">
            Leadership & Department Leads
          </span>
        </div>
      </div>

      {/* Leadership & Department Heads */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {leadership.map((member, index) => {
          const accentColor = brandColors[index % brandColors.length];

          return (
            <div
              key={member.id}
              className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] max-w-sm"
            >
              <TeamCard member={member} accentColor={accentColor} />
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative bg-background px-4 sm:px-6">
          <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-[var(--brand-pink)]/70">
            Contributors
          </span>
        </div>
      </div>

      {/* Volunteers Section - Grouped by function */}
      <div className="flex flex-col gap-8 sm:gap-10">
        {sectionOrder.map((section) => {
          const sectionVolunteers = volunteers.filter(
            (volunteer) => volunteer.section === section,
          );

          if (sectionVolunteers.length === 0) return null;

          return (
            <section key={section} className="space-y-4 sm:space-y-5">
              <h3 className="text-center text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-[var(--brand-pink)]/90">
                {sectionLabels[section]}
              </h3>
              <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-10 md:gap-14 lg:gap-16">
                {sectionVolunteers.map((volunteer, index) => (
                  <VolunteerCard key={volunteer.id} volunteer={volunteer} index={index} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
