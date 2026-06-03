"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Shield } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import { GlassContainer } from "@/components/ui/glass-container";

const WebGLShader = dynamic(
  () =>
    import("@/components/ui/web-gl-shader").then((mod) => ({
      default: mod.WebGLShader,
    })),
  {
    loading: () => null,
    ssr: false,
  },
);

const cocMarkdown = `<aside>
📋 This is the official Code of Conduct for the bits&bytes™ community. It applies to everyone — participants, Fork Leads, Executive Officers, volunteers, mentors, sponsors, and guests — across all bits&bytes™ spaces, events, and platforms. Also published at gobitsnbytes.org/coc.

</aside>

---

## TL;DR

Build things. Be decent. Don't cause harm.

---

## 1. Who We Are and Why This Exists

bits&bytes is a youth-led builder network for students, developers, designers, and creators who want to ship real things. It is run by GOBITSNBYTES FOUNDATION, a non-profit company incorporated under Section 8 of the Companies Act, 2013.

This Code of Conduct ("Code") exists because a community is only as good as its standards. It protects participants, organisers, mentors, and the Foundation itself. It is not a formality — it is a binding condition of participation in any bits&bytes space, event, or programme.

---

## 2. Scope

This Code applies to every person in any capacity — participant, contributor, Fork Lead, volunteer, mentor, sponsor, speaker, or guest — who:

- (a) Attends any bits&bytes event, hackathon, workshop, cohort, or meetup (in person or virtual);
- (b) Participates in any bits&bytes online space — Discord, WhatsApp, Slack, GitHub, or any official platform;
- (c) Contributes to any bits&bytes project, repository, or programme;
- (d) Represents bits&bytes or GOBITSNBYTES FOUNDATION in any public, institutional, or media context;
- (e) Interacts with the community under the bits&bytes name or brand in any form.

This Code applies regardless of the participant's age, role, seniority, founding status, or prior contribution to the community.

---

## 3. Our Standards

### 3.1 What We Expect

Everyone in this community is expected to:

* **Be welcoming.** Make new people feel like they belong — not like they walked into the wrong room.
* **Be patient.** People learn at different speeds and communicate differently. Assume good intent first.
* **Disagree respectfully.** Challenge ideas, not people. Criticism should be constructive, not personal. The goal is to build better — not to win.
* **Take responsibility.** If you make a mistake, own it, fix it, and move on. No defensiveness needed.
* **Protect the community.** If you see something wrong, say something. Silence is not neutrality.

### 3.2 What We Do Not Allow

The following conduct is prohibited in all bits&bytes spaces and activities, without exception:

* **Harassment:** Any unwanted conduct that creates a hostile, intimidating, or degrading environment — including repeated unwanted contact, offensive comments, personal attacks, or behaviour intended to make someone feel unsafe or excluded.
* **Discrimination:** Treating any person less favourably on the basis of age, gender, gender identity, sexual orientation, disability, physical appearance, race, ethnicity, caste, religion, nationality, socioeconomic background, or any other protected characteristic.
* **Sexual Misconduct:** Unwanted romantic or sexual advances, comments, or contact of any kind. This applies online and offline, and regardless of the target's age. Conduct involving minors in any sexual or inappropriate context will be treated as a serious violation and may be referred to statutory authorities.
* **Bullying and Intimidation:** Deliberate targeting of an individual or group to cause distress, social isolation, reputational harm, or emotional damage — including in private messages, group chats, and public forums.
* **Doxxing and Privacy Violations:** Publishing, sharing, or threatening to share another person's private information — including address, phone number, identity documents, financial details, or private communications — without their explicit consent.
* **Misuse of the bits&bytes Brand or Resources:** Using the bits&bytes name, logo, platforms, or community relationships for personal commercial gain, unauthorised fundraising, or any purpose not aligned with the Foundation's mission.
* **Fraud and Financial Misconduct:** Misrepresenting your identity or authority, collecting money on behalf of bits&bytes without written authorisation, or misusing community funds or resources in any form.
* **Disruption:** Spam, trolling, sustained off-topic derailment, or any conduct designed to obstruct productive community activity.
* **Retaliation:** Taking any adverse action against a person who has raised a concern, made a report, or supported another participant in good faith. Retaliation is itself a serious violation.

---

## 4. Reporting

### 4.1 How to Report

If you experience or witness a violation of this Code, report it. Do not assume someone else has.

* **Email:** hello@gobitsnbytes.org
* **Private:** Message any team member directly.

When reporting, include as much context as you can — what happened, where, when, and who was involved. Screenshots or records help. If you are unsure whether something is a violation, report it anyway and let us assess.

### 4.2 Confidentiality

All reports are handled with confidentiality. Your identity as a reporter will not be disclosed without your consent, except where disclosure is required by law or necessary to prevent ongoing harm.

### 4.3 No Retaliation

No person who makes a good-faith report or supports another participant through a reporting process will face any adverse consequence from GOBITSNBYTES FOUNDATION. Any retaliation against a reporter is itself a Code violation subject to immediate enforcement action.

---

## 5. Enforcement

### 5.1 Who Decides

GOBITSNBYTES FOUNDATION, acting through its Board of Directors and authorised Executive Officers, has final authority over all enforcement decisions. Enforcement is not a vote or a community poll — it is a governance function of the Foundation.

### 5.2 Graduated Response

Violations are assessed on the basis of severity, context, intent, impact, and history. The general approach is:

* **First Violation:** Formal written warning. Depending on severity, may include a mandatory apology or a temporary restriction from specific spaces.
* **Second Violation:** Temporary suspension from all bits&bytes events, platforms, and community spaces for a defined period determined by the Foundation.
* **Third Violation or Serious First Violation:** Permanent removal from the bits&bytes community, revocation of all access, roles, and recognition.

### 5.3 Immediate Action

<aside>
⚠️ For serious violations, the Foundation will act immediately and without a prior warning. Serious violations include — but are not limited to — any form of sexual misconduct, conduct involving a minor, credible threat of physical harm, doxxing, financial fraud, or any act that places a participant's safety at imminent risk.
</aside>

### 5.4 External Referral

Where a violation may constitute a criminal offence under applicable Indian law — including the Indian Penal Code, Protection of Children from Sexual Offences Act (POCSO), Information Technology Act, or any other applicable statute — GOBITSNBYTES FOUNDATION reserves the right to refer the matter to relevant statutory authorities.

### 5.5 No Vested Rights

No person has a vested right to continued participation in the bits&bytes community by reason of founding involvement, prior contribution, seniority, or public standing. Participation is a privilege subject to this Code.

---

## 6. Special Protections for Minors

bits&bytes is a youth-led community and many of its participants are minors. GOBITSNBYTES FOUNDATION applies heightened standards wherever minors are involved:

- (a) Any adult engaging in inappropriate contact, communication, or conduct toward a minor will be permanently removed and the matter referred to statutory authorities.
- (b) Organisers of events or online spaces involving minors must ensure appropriate supervision, consent procedures, and safe communication practices are in place.
- (c) Recording, photographing, or sharing images or data of minors requires verified parental or guardian consent.
- (d) The provisions of the Protection of Children from Sexual Offences Act, 2012 (POCSO) and the Digital Personal Data Protection Act, 2023 (DPDP Act) apply to all activities of the Foundation involving minors.

---

## 7. Data and Privacy

GOBITSNBYTES FOUNDATION collects and processes participant data (including names, contact details, event registrations, and minor consent records) in connection with its programmes. All such data is handled in accordance with applicable Indian data protection law, including the Digital Personal Data Protection Act, 2023. Participants have the right to access, correct, and request deletion of their personal data by writing to hello@gobitsnbytes.org.

---

## 8. Relationship to Other Governance Documents

This Code operates alongside the Internal Operating Manual and Network Governance Charter of GOBITSNBYTES FOUNDATION. In case of conflict, the Internal Operating Manual and Network Governance Charter take precedence. This Code may be amended by the Board of Directors of GOBITSNBYTES FOUNDATION by way of Board Resolution.

---

## 9. Binding Effect

By participating in any bits&bytes event, platform, programme, or activity, every participant agrees to be bound by this Code. This Code is a condition of participation — not a request.

---

Adopted by the Board of Directors of GOBITSNBYTES FOUNDATION on 4 June 2026. Contact: hello@gobitsnbytes.org | gobitsnbytes.org/coc`;

const sections = [
  { id: "tldr", label: "TL;DR" },
  { id: "1-who-we-are-and-why-this-exists", label: "1. Who We Are" },
  { id: "2-scope", label: "2. Scope" },
  { id: "3-our-standards", label: "3. Our Standards" },
  { id: "4-reporting", label: "4. Reporting" },
  { id: "5-enforcement", label: "5. Enforcement" },
  { id: "6-special-protections-for-minors", label: "6. Minor Protections" },
  { id: "7-data-and-privacy", label: "7. Data & Privacy" },
  { id: "8-relationship-to-other-governance-documents", label: "8. Governance Relation" },
  { id: "9-binding-effect", label: "9. Binding Effect" },
];

export default function CodeOfConduct() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const renderCoC = () => {
    const parts = cocMarkdown.split(/<aside>([\s\S]*?)<\/aside>/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // It's an aside block
        const text = part.trim();
        const isWarning = text.startsWith("⚠️");
        const icon = isWarning ? "⚠️" : "📋";
        const cleanText = text.replace(/^(⚠️|📋)\s*/, "");

        return (
          <div
            key={index}
            className={cn(
              "my-6 border-l-4 p-5 sm:p-6 rounded-r-2xl text-left",
              isWarning ? "border-red-500 bg-red-950/15" : "border-[var(--brand-pink)] bg-white/5"
            )}
          >
            <div className="flex gap-4 items-start">
              <span className="text-2xl shrink-0" role="img" aria-hidden="true">
                {icon}
              </span>
              <p className={cn(
                "text-sm sm:text-base md:text-lg font-serif-brand leading-relaxed m-0",
                isWarning ? "text-red-200" : "text-white/90"
              )}>
                {cleanText}
              </p>
            </div>
          </div>
        );
      } else {
        // It's standard Markdown text
        if (!part.trim()) return null;
        return (
          <ReactMarkdown
            key={index}
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => {
                const text = React.Children.toArray(children).join("");
                const id = text
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, "")
                  .trim()
                  .replace(/\s+/g, "-");
                return (
                  <h2
                    id={id}
                    className="scroll-mt-28 font-display text-2xl sm:text-3xl font-black text-white mt-12 mb-6 tracking-tight flex items-center gap-3 border-b border-white/10 pb-3 uppercase tracking-wider text-left"
                  >
                    {children}
                  </h2>
                );
              },
              h3: ({ children }) => (
                <h3 className="font-display text-lg sm:text-xl font-bold text-white mt-8 mb-4 tracking-tight text-left">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="font-serif-brand text-white/80 leading-relaxed text-base sm:text-lg mb-6 text-left">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-3 mb-6 text-white/80 font-serif-brand text-base sm:text-lg text-left">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed pl-1">
                  {children}
                </li>
              ),
              hr: () => <hr className="my-10 border-white/10" />,
              strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-[var(--brand-pink)] hover:text-red-400 hover:underline transition-colors duration-150 font-bold"
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {children}
                </a>
              ),
            }}
          >
            {part}
          </ReactMarkdown>
        );
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-transparent pt-32 pb-24">
      {/* Background radial glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(100%_50%_at_50%_0%,rgba(151,25,44,0.12)_0%,rgba(151,25,44,0)_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute inset-0 opacity-10 bg-noise-texture" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Sleek Breadcrumb / Topic Header */}
        <div className="mb-12 text-center lg:text-left flex flex-col items-center lg:items-start gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.35em] font-semibold text-white/70 backdrop-blur-md shadow-inner">
            <Shield className="h-3.5 w-3.5 text-[var(--brand-pink)]" />
            Community Guidelines
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
            Code of Conduct
          </h1>
          <p className="text-xs sm:text-sm text-white/50 font-mono">
            Last Updated: June 4, 2026 • GOBITSNBYTES FOUNDATION
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Sidebar Index */}
          <aside className="hidden lg:block lg:col-span-3 h-full">
            <div className="sticky top-32 space-y-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 font-bold px-3">
                On this page
              </p>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={cn(
                      "block px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 text-left border border-transparent",
                      activeSection === section.id
                        ? "bg-[var(--brand-pink)]/10 border-[var(--brand-pink)]/20 text-white font-bold"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Document Content */}
          <div className="lg:col-span-9 w-full">
            <GlassContainer className="p-6 sm:p-12 md:p-14 border-white/10 bg-black/40 backdrop-blur-md shadow-2xl rounded-3xl" glowColor="purple">
              <div className="prose prose-invert max-w-none">
                {renderCoC()}
              </div>
            </GlassContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
