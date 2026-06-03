"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import { GlassContainer } from "@/components/ui/glass-container";

const termsMarkdown = `<aside>
⚖️ These Terms of Service ("Terms") govern your participation in the bits&bytes™ Network, your use of our digital platforms, and your relationship with GOBITSNBYTES FOUNDATION. By participating in our community, events, or programs, you agree to these Terms.

</aside>

---

## 1. Legal Status and Structure

### 1.1 The Foundation
bits&bytes™ (referred to as "the Network" or "bitsnbytes") is the public-facing brand, community identity, and student-led network operated by **GOBITSNBYTES FOUNDATION**.
* GOBITSNBYTES FOUNDATION is a non-profit company incorporated under **Section 8 of the Indian Companies Act, 2013** (limited by guarantee and not having share capital) in the State of Uttar Pradesh, India.
* **Date of Incorporation:** June 2, 2026.
* **Corporate Identity Number (CIN):** U85500UP2026NPL248652.
* **Registered Address:** 265/1 PATRAKAR COLONY, PRAYAGRAJ ASHOK NAGER, Allahabad, Uttar Pradesh - 211001.

### 1.2 Non-Profit Status
In accordance with Section 8 of the Companies Act, 2013, the Foundation operates strictly on a non-profit basis. All income, donations, and sponsorships are applied solely to the promotion of our educational, youth, and technology advancement objects. No dividends, bonuses, or profit distributions are paid to any member, director, or participant.

---

## 2. The Fork Network Model

### 2.1 Operational Nature of Forks
To foster youth-led building across India, the Foundation recognizes local, city-level, or institutional operational units known as "Forks".
* **Operational Permissiveness:** A recognized Fork is permitted to use the bits&bytes™ brand and operate local meetups, events, and dev squads in alignment with our mission.
* **No Legal Independence:** A Fork is an operational abstraction and has no independent legal personality. A Fork cannot hold property, enter into contracts, sue or be sued, or establish independent legal entities under the bits&bytes™ brand.
* **No Agency or Representation:** No Fork Lead, Local Maintainer, or participant has the authority to bind GOBITSNBYTES FOUNDATION, execute legal agreements, or represent the Foundation to third parties without express written authorization from the Board of Directors.
* **Revocable Permission:** Fork recognition is a conditional, non-exclusive, and revocable permission granted by the Board. If recognition is revoked, the local group must immediately cease all use of the bits&bytes™ name, logo, domain, and digital assets.

---

## 3. Youth-Led Operations and Minors

### 3.1 Youth Leadership Mandate
The bits&bytes™ Network is structurally designed to support youth leadership. We encourage minors and teenagers to take active operational roles as organizers, Fork Leads, Local Maintainers, and Executive Officers to the extent permitted by law.

### 3.2 Liability Protections for Minor Organizers
To safeguard our young builders, the Foundation operates under a strict principle of "protected operational participation":
* Operational roles (including titles such as CEO, CTO, CFO, COO, CCO, Fork Lead, or Organizer) describe community accountability and coordination responsibilities.
* These roles do not impose statutory directorship, fiduciary status, or personal legal or financial liability on minors.
* No minor organizer shall be held personally liable for the legal, financial, or contract obligations of GOBITSNBYTES FOUNDATION merely by virtue of leading a project, running a Fork, organizing volunteers, or coordinating events.

### 3.3 Statutory Limitations
Minors do not possess the capacity to sign contracts, bind the Foundation, or manage official banking transactions. Any agreements, sponsorships, or venue bookings must be routed upstream for execution by authorized adult signatories designated by the Board of Directors.

---

## 4. Strict Financial Controls

### 4.1 Centralized Financial Routing
All financial transactions, sponsorships, grants, donations, and event fees connected with the bits&bytes™ Network or any recognized Fork must be routed exclusively through GOBITSNBYTES FOUNDATION's approved corporate bank accounts and official payment systems.

### 4.2 Prohibited Collections
To ensure regulatory compliance and financial audit integrity:
* **UPI and Personal Accounts:** Under no circumstances may any participant, organizer, or Fork Lead collect funds using personal UPI IDs, personal bank accounts, personal QR codes, or personal digital wallets (such as PhonePe, GPay, Paytm, etc.) in connection with bits&bytes™ activities.
* **Cash Collections:** Cash collections are strictly prohibited unless explicitly authorized in writing by the Chief Financial Officer (CFO) or the Board of Directors.
* **Zero Local Accounts:** Forks do not possess financial autonomy and may not set up local bank accounts or independent payment links.
* **Unapproved Sponsorships:** No local team may sign sponsor contracts or promise brand exclusivity without Upstream approval.

---

## 5. Brand, Intellectual Property, and Contributions

### 5.1 Ownership of Assets
GOBITSNBYTES FOUNDATION is the sole legal owner and steward of all intellectual property, trademarks, copyrights, visual marks, domains (including gobitsnbytes.org), social media handles, official Slack/Discord environments, and official GitHub organizations associated with the "bits&bytes" and "bitsnbytes" brands.

### 5.2 Contributed Work
To ensure project continuity and maintain our public-benefit and open-source mission:
* Any software, design, curriculum, media, documentation, or other assets developed by Executive Officers, Fork Leads, Local Maintainers, volunteers, or participants in connection with official bits&bytes™ programs shall vest in or be licensed to GOBITSNBYTES FOUNDATION.
* We default to open-source software licenses (e.g., MIT, Apache 2.0) and open-content licenses (e.g., Creative Commons) for community-facing resources.
* **Minor Contributor Notice:** In alignment with Indian contract law, intellectual property assignments by minor contributors will be secured through parental/guardian consent or managed via Board-approved contributor license agreements (CLAs).

---

## 6. Liability and Safety Safeguards

### 6.1 Emergency Measures
The Board of Directors, the CEO, and the CTO reserve the right to immediately suspend any event, digital channel, repository access, or Fork recognition if necessary to prevent safety hazards, legal violations, financial discrepancies, or reputational damage to the Network or its participants.

### 6.2 Code of Conduct
All participants in the bits&bytes™ Network must comply with the official Community Code of Conduct. The Foundation reserves the right to restrict or terminate access to official platforms or events for non-compliance.

---

## 7. Governing Law and Jurisdiction

### 7.1 Dispute Resolution
These Terms and all relationships governed by them shall be construed and governed in accordance with the laws of the Republic of India.
* Any disputes, legal proceedings, or claims arising out of or in connection with the Foundation's activities, these Terms, or participation in the bits&bytes™ Network shall be subject to the exclusive jurisdiction of the competent courts of **Allahabad (Prayagraj), Uttar Pradesh, India**.

---

Adopted by the Board of Directors of GOBITSNBYTES FOUNDATION on 4 June 2026.
Contact: hello@gobitsnbytes.org | gobitsnbytes.org/terms`;

const sections = [
  { id: "1-legal-status-and-structure", label: "1. Legal Status" },
  { id: "2-the-fork-network-model", label: "2. The Fork Model" },
  { id: "3-youth-led-operations-and-minors", label: "3. Youth & Minors" },
  { id: "4-strict-financial-controls", label: "4. Financial Controls" },
  { id: "5-brand-intellectual-property-and-contributions", label: "5. Brand & IP" },
  { id: "6-liability-and-safety-safeguards", label: "6. Safety & Liability" },
  { id: "7-governing-law-and-jurisdiction", label: "7. Governing Law" },
];

export default function TermsOfService() {
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

  const renderTerms = () => {
    const parts = termsMarkdown.split(/<aside>([\s\S]*?)<\/aside>/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const text = part.trim();
        const icon = "⚖️";
        const cleanText = text.replace(/^⚖️\s*/, "");

        return (
          <div key={index} className="my-6">
            <GlassContainer
              className="p-6 border-white/10 bg-white/5 rounded-2xl"
              glowColor="purple"
              interactive
            >
              <div className="flex gap-4 items-start text-left">
                <span className="text-2xl shrink-0" role="img" aria-hidden="true">
                  {icon}
                </span>
                <p className="text-base md:text-lg font-medium leading-relaxed font-serif-brand m-0 text-white/90">
                  {cleanText}
                </p>
              </div>
            </GlassContainer>
          </div>
        );
      } else {
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
            <FileText className="h-3.5 w-3.5 text-[var(--brand-pink)]" />
            Legal Framework
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-white/50 font-mono">
            Last Updated: June 4, 2026 • GOBITSNBYTES FOUNDATION
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Sidebar Index */}
          <aside className="hidden lg:block lg:col-span-3">
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
                {renderTerms()}
              </div>
            </GlassContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
