"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Lock } from "lucide-react";
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

const privacyMarkdown = `<aside>
🔒 This Privacy Policy describes how GOBITSNBYTES FOUNDATION collects, processes, stores, and protects the personal data of participants, contributors, volunteers, and website visitors. We are committed to transparency and compliance under the Digital Personal Data Protection Act, 2023 (DPDPA).

</aside>

---

## 1. Corporate Identity and Frame

### 1.1 The Data Fiduciary
The data fiduciary responsible for processing your personal data is **GOBITSNBYTES FOUNDATION**.
* **Corporate Details:** A Section 8 non-profit company incorporated under the Companies Act, 2013 (Uttar Pradesh, India).
* **Corporate Identity Number (CIN):** U85500UP2026NPL248652.
* **Registered Office:** 265/1 PATRAKAR COLONY, PRAYAGRAJ ASHOK NAGER, Allahabad, Uttar Pradesh - 211001.
* **Contact Email:** hello@gobitsnbytes.org.

### 1.2 Legal Framework
We process personal data in compliance with the **Digital Personal Data Protection Act, 2023 (DPDPA)**, the Information Technology Act, 2000, and other applicable data protection regulations in India.

---

## 2. Special Protections for Minors (Under 18)

### 2.1 Youth Focus
bits&bytes™ is a community designed for teenagers and students. Because many of our participants are minors (individuals under the age of 18), we implement heightened safeguarding measures.

### 2.2 Parental / Guardian Consent
Under the DPDPA, processing the personal data of a minor requires verifiable consent from their parent or lawful guardian:
* **Registration Consent:** When a minor registers for a hackathon, cohort, workshop, or Fork event, they must provide the contact details of a parent or lawful guardian.
* **Verification:** We send a notification to the parent or guardian to obtain consent for the minor’s participation and the processing of their data.
* **Revocation by Parent:** A parent or guardian has the absolute right to review, correct, or request the erasure of their minor child's personal data at any time by contacting hello@gobitsnbytes.org.

### 2.3 Prohibition of Tracking or Profiling
In accordance with Indian law, we do not engage in targeted advertising, behavioral profiling, or tracking of minors. All minor participant data is processed solely for educational, event coordination, and community support purposes.

---

## 3. Data We Collect

We only collect personal data that is necessary to fulfill our non-profit educational and community objectives. This includes:

### 3.1 Provided directly by you
* **Identity and Contact:** Name, email address, phone number, age, date of birth, gender, and school/college details.
* **Parental Information:** Parent/guardian name, email address, and phone number (for minor participants).
* **Technical Activity:** GitHub username, project repositories, codebase submissions, and showcase links.
* **Event Records:** Event registration inputs, dietary requirements, venue accessibility needs, team associations, and project submissions.

### 3.2 Collected automatically
* **Technical Logs:** IP address, browser type, device information, operating system, and referral URLs.
* **Analytics:** Anonymized page view statistics, interaction logs, and platform performance data to optimize our systems.

---

## 4. How We Process Data

We process your data only for specified, lawful purposes aligned with our objects:
* **Event Coordination:** To organize hackathons, coordinate teams, and manage physical and virtual event logistics.
* **Cohort Programs:** To enroll and track students in cohort-based bootcamps and mentoring sessions.
* **Forks and Nodes:** To support local Fork Leads in organizing neighborhood-level and city-level operations.
* **Platform Security:** To moderate official forums (Discord, Slack, GitHub) and prevent harassment, fraud, or violations of our Code of Conduct.
* **Communications:** To send announcements, newsletters, event updates, and certificates of completion.

---

## 5. Data Sharing and Third Parties

We do not sell, rent, or trade your personal data. We share data only with trusted service providers to run our platform, under strict data safety terms:
* **Hosting and Infra:** Vercel (for frontend hosting), Supabase (for database hosting and session management), and GitHub (for open-source code hosting).
* **Communications:** Discord, Slack, and WhatsApp (for community coordination and announcements).
* **Analytics:** Vercel Analytics and Speed Insights (for anonymous website performance monitoring).
* **Compliance and Law:** We may disclose data if required by law, court order, or to cooperate with statutory authorities during investigations under the POCSO Act, IPC, or IT Act.

---

## 6. Your Rights (Data Principal Rights)

Under the DPDPA, you (or your parent/guardian, if you are a minor) hold the following rights:
* **Right to Access:** You can request a summary of the personal data we hold about you and how it is processed.
* **Right to Correction:** You can request that we update, correct, or complete inaccurate or incomplete personal data.
* **Right to Erasure (Right to be Forgotten):** You can request that we delete your personal data when it is no longer necessary for the purpose it was collected.
* **Right to Withdraw Consent:** You can withdraw your consent to data processing at any time. Upon withdrawal, we will cease processing unless permitted by law.
* **Right to Grievance Redressal:** You can submit questions or file grievances regarding our data practices.

To exercise any of these rights, email **hello@gobitsnbytes.org** with your request. We will verify your identity (or parental relationship) before responding.

---

## 7. Data Retention and Security

* **Retention Period:** We retain personal data only as long as necessary to fulfill our educational programs, manage the community, or comply with statutory retention requirements.
* **Security Standards:** We implement appropriate technical and administrative safeguards to protect data against unauthorized access, loss, alteration, or disclosure. Production environments are restricted to authorized technical officers (managed by our CTO).

---

Adopted by the Board of Directors of GOBITSNBYTES FOUNDATION on 4 June 2026.
Contact: hello@gobitsnbytes.org | gobitsnbytes.org/privacy`;

const sections = [
  { id: "1-corporate-identity-and-frame", label: "1. Corporate Identity" },
  { id: "2-special-protections-for-minors-under-18", label: "2. Youth Protections" },
  { id: "3-data-we-collect", label: "3. Data Collected" },
  { id: "4-how-we-process-data", label: "4. Data Processing" },
  { id: "5-data-sharing-and-third-parties", label: "5. Third Parties" },
  { id: "6-your-rights-data-principal-rights", label: "6. Your Rights" },
  { id: "7-data-retention-and-security", label: "7. Retention & Safety" },
];

export default function PrivacyPolicy() {
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

  const renderPrivacy = () => {
    const parts = privacyMarkdown.split(/<aside>([\s\S]*?)<\/aside>/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const text = part.trim();
        const icon = "🔒";
        const cleanText = text.replace(/^🔒\s*/, "");

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
            <Lock className="h-3.5 w-3.5 text-[var(--brand-pink)]" />
            Data Protection
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
            Privacy Policy
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
                {renderPrivacy()}
              </div>
            </GlassContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
