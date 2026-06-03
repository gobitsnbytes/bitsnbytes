"use client";

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

## 1. Who we are and why this exists

bits&bytes™ is a youth-led builder network for students, developers, designers, and creators who want to ship real things. It is run by GOBITSNBYTES FOUNDATION, a non-profit company incorporated under Section 8 of the Companies Act, 2013.

This Code of Conduct exists because a community is only as good as its standards. It protects participants, organisers, mentors, and the Foundation itself. It is not a formality — it is a binding condition of participation in any bits&bytes™ space, event, or programme.

---

## 2. Scope

This Code applies to every person in any capacity — participant, contributor, Fork Lead, volunteer, mentor, sponsor, speaker, or guest — who:

- Attends any bits&bytes™ event, hackathon, workshop, cohort, or meetup (in person or virtual)
- Participates in any bits&bytes™ online space — Discord, WhatsApp, Slack, GitHub, or any official platform
- Contributes to any bits&bytes™ project, repository, or programme
- Represents bits&bytes™ or GOBITSNBYTES FOUNDATION in any public, institutional, or media context
- Interacts with the community under the bits&bytes™ name or brand in any form

This Code applies regardless of the participant's age, role, seniority, founding status, or prior contribution to the community.

---

## 3. Our standards

### What we expect

- **Be welcoming.** Make new people feel like they belong — not like they walked into the wrong room.
- **Be patient.** People learn at different speeds and communicate differently. Assume good intent first.
- **Disagree respectfully.** Challenge ideas, not people. Criticism should be constructive, not personal. The goal is to build better — not to win.
- **Take responsibility.** If you make a mistake, own it, fix it, and move on.
- **Protect the community.** If you see something wrong, say something. Silence is not neutrality.

### What we do not allow

- **Harassment:** Any unwanted conduct that creates a hostile, intimidating, or degrading environment — including repeated unwanted contact, offensive comments, personal attacks, or behaviour intended to make someone feel unsafe or excluded.
- **Discrimination:** Treating any person less favourably on the basis of age, gender, gender identity, sexual orientation, disability, physical appearance, race, ethnicity, caste, religion, nationality, socioeconomic background, or any other protected characteristic.
- **Sexual misconduct:** Unwanted romantic or sexual advances, comments, or contact of any kind. This applies online and offline, and regardless of the target's age. Conduct involving minors in any sexual or inappropriate context will be treated as a serious violation and referred to statutory authorities.
- **Bullying and intimidation:** Deliberate targeting of an individual or group to cause distress, social isolation, reputational harm, or emotional damage — including in private messages, group chats, and public forums.
- **Doxxing and privacy violations:** Publishing, sharing, or threatening to share another person's private information — including address, phone number, identity documents, financial details, or private communications — without their explicit consent.
- **Misuse of the bits&bytes™ brand or resources:** Using the bits&bytes™ name, logo, platforms, or community relationships for personal commercial gain, unauthorised fundraising, or any purpose not aligned with the Foundation's mission.
- **Fraud and financial misconduct:** Misrepresenting your identity or authority, collecting money on behalf of bits&bytes™ without written authorisation, or misusing community funds or resources in any form.
- **Disruption:** Spam, trolling, sustained off-topic derailment, or any conduct designed to obstruct productive community activity.
- **Retaliation:** Taking any adverse action against a person who has raised a concern, made a report, or supported another participant in good faith. Retaliation is itself a serious violation.

---

## 4. Reporting

If you experience or witness a violation, report it. Don't assume someone else has.

- **Email:** hello@gobitsnbytes.org
- **Private message:** any team member directly

Include as much context as you can — what happened, where, when, who was involved. Screenshots help. If you're not sure whether something is a violation, report it anyway and let us assess.

All reports are confidential. Your identity as a reporter will not be disclosed without your consent, except where required by law or to prevent ongoing harm. No person who makes a good-faith report will face any adverse consequence — retaliation against a reporter is itself a violation.

---

## 5. Enforcement

GOBITSNBYTES FOUNDATION, through its Board and authorised Executive Officers, has final authority over all enforcement decisions.

### Graduated response

- **First violation:** Formal written warning. May include a temporary restriction or mandatory apology.
- **Second violation:** Temporary suspension from all bits&bytes™ events, platforms, and spaces.
- **Third violation or serious first violation:** Permanent removal from the bits&bytes™ community, revocation of all access, roles, and recognition.

<aside>
⚠️ For serious violations, the Foundation will act immediately without a prior warning. This includes any form of sexual misconduct, conduct involving a minor, credible threat of physical harm, doxxing, financial fraud, or anything placing a participant's safety at imminent risk.

</aside>

Where a violation may constitute a criminal offence under applicable Indian law — including the IPC, POCSO Act, or the IT Act — the Foundation reserves the right to refer the matter to relevant statutory authorities.

No person has a vested right to continued participation by reason of founding involvement, prior contribution, seniority, or public standing. Participation is a privilege subject to this Code.

---

## 6. Special protections for minors

bits&bytes™ is a youth-led community and many participants are minors. Heightened standards apply wherever minors are involved.

- Any adult engaging in inappropriate contact, communication, or conduct toward a minor will be permanently removed and the matter referred to statutory authorities
- Organisers of events or spaces involving minors must ensure appropriate supervision, consent procedures, and safe communication practices
- Recording, photographing, or sharing images or data of minors requires verified parental or guardian consent
- The POCSO Act, 2012 and the Digital Personal Data Protection Act, 2023 apply to all Foundation activities involving minors

---

## 7. Data and privacy

GOBITSNBYTES FOUNDATION collects and processes participant data in connection with its programmes in accordance with applicable Indian law, including the Digital Personal Data Protection Act, 2023. Participants have the right to access, correct, and request deletion of their personal data by writing to hello@gobitsnbytes.org.

---

## 8. Binding effect

By participating in any bits&bytes™ event, platform, programme, or activity, every participant agrees to be bound by this Code. This is a condition of participation — not a request.

---

Adopted by the Board of Directors of GOBITSNBYTES FOUNDATION on 4 June 2026. Contact: hello@gobitsnbytes.org | gobitsnbytes.org/coc`;

export default function CodeOfConduct() {
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
          <div key={index} className="my-8">
            <GlassContainer
              className={cn(
                "p-6 md:p-8",
                isWarning ? "border-red-500/20 bg-red-950/15" : "border-white/10 bg-white/5"
              )}
              glowColor={isWarning ? "pink" : "purple"}
              interactive
            >
              <div className="flex gap-4 items-start text-left">
                <span className="text-2xl shrink-0" role="img" aria-hidden="true">
                  {icon}
                </span>
                <p className={cn(
                  "text-base md:text-lg font-medium leading-relaxed font-serif-brand m-0",
                  isWarning ? "text-red-200" : "text-white/90"
                )}>
                  {cleanText}
                </p>
              </div>
            </GlassContainer>
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
              h2: ({ children }) => (
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-black text-white mt-12 mb-6 tracking-tight flex items-center gap-3 border-b border-white/10 pb-3 uppercase tracking-wider text-left">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="font-display text-base sm:text-lg md:text-xl font-bold text-white mt-8 mb-4 tracking-tight text-left">
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
                <li className="leading-relaxed">
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
    <>
      {/* Hero Section */}
      <section className="relative min-h-[40vh] sm:min-h-[45vh] flex items-center justify-center overflow-hidden text-white pt-24 md:pt-32">
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="px-6 py-8 sm:px-10 lg:px-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.35em] font-semibold text-white/90 backdrop-blur-md shadow-inner">
                <Shield className="h-3.5 w-3.5 text-[var(--brand-pink)] animate-pulse" />
                Community Guidelines
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight font-black text-white tracking-tighter drop-shadow-2xl">
                Code of Conduct
              </h1>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-transparent pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <GlassContainer className="p-8 sm:p-12 md:p-16 border-white/10" glowColor="both">
            <div className="max-w-none">
              {renderCoC()}
            </div>
          </GlassContainer>
        </div>
      </main>
    </>
  );
}
