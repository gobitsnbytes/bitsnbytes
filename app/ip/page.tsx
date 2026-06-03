"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Scale } from "lucide-react";
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

const ipMarkdown = `<aside>
⚖️ This Intellectual Property & Copyright Policy outlines the ownership, licensing, usage, and infringement reporting procedures for all intellectual assets associated with GOBITSNBYTES FOUNDATION.

</aside>

---

## 1. Brand Stewardship and Ownership

### 1.1 Brand Assets
The terms "bits&bytes" and "bitsnbytes", along with the 3D cube monogram logo, visual designs, colors, fonts, and domains (such as gobitsnbytes.org), are protected brand assets.
* All right, title, and interest in these assets are owned exclusively by **GOBITSNBYTES FOUNDATION**, a non-profit company registered under Section 8 of the Indian Companies Act, 2013.
* **Registered Address:** 265/1 PATRAKAR COLONY, PRAYAGRAJ ASHOK NAGER, Allahabad, Uttar Pradesh - 211001.
* **CIN:** U85500UP2026NPL248652.
* **Unauthorized Use:** No individual, Fork, school, or external group may use these brand assets to imply legal partnership, commercial franchise, or authorization to raise funds independently.

---

## 2. Open-Source and Public-Benefit Mission

### 2.1 Default Software Licensing
In alignment with our mission to empower young creators, GOBITSNBYTES FOUNDATION defaults to open-source software licenses:
* Code repositories hosted under the official bits&bytes™ GitHub organization are generally released under the **MIT License** or **Apache License 2.0** unless specified otherwise by the Board of Directors.
* Any participant contributing code to official repositories agrees to license their contributions under the repository's open-source license.

### 2.2 Default Content Licensing
Educational materials, curricula, workshop guides, design frameworks, and documentation developed by the Foundation are generally licensed under a **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)** license. This allows other students and educational institutions to use and adapt our work for non-commercial purposes, provided they attribute bits&bytes™.

---

## 3. Contributor Intellectual Property

### 3.1 Vesting and Continuity
To protect our codebase and ensure the long-term continuity of our open-source tools:
* All code, curriculum, designs, and content created by Executive Officers, Fork Leads, Local Maintainers, and volunteers specifically in connection with Foundation-funded or Foundation-stewarded projects vest in or are licensed to GOBITSNBYTES FOUNDATION.
* This ensures that personal leadership transitions do not disrupt the availability of public-benefit software or educational materials.

### 3.2 Special Rules for Minor Contributors
Under Indian contract law, a minor (under the age of 18) cannot execute a legally binding contract.
* Intellectual property assignments or contributor license agreements (CLAs) for work created by minor contributors must be executed with the consent of a parent or lawful guardian.
* Alternatively, the Foundation may operate under a non-exclusive license framework that grants the Foundation irrevocable, worldwide, perpetual rights to host, modify, and distribute the contributed work as part of our open-source programs.

---

## 4. IP and Copyright Infringement Claims

### 4.1 Our Commitment
GOBITSNBYTES FOUNDATION respects the intellectual property rights of others. We expect our participants, volunteers, and organizers to do the same. We will promptly remove or disable access to materials that infringe valid third-party copyrights or trademarks.

### 4.2 How to File a Copyright Infringement Notice
If you believe that any material hosted on our website (gobitsnbytes.org), official GitHub organizations, or digital platforms infringes your intellectual property rights, you may submit a formal notification to our designated contact:
* **Email:** hello@gobitsnbytes.org
* **Subject:** Intellectual Property Infringement Notice

Your notice must contain the following information:
1. **Identification of the Infringed Work:** A description of the copyrighted work or trademark that you claim has been infringed.
2. **Location of the Infringing Material:** The exact URL, GitHub repository link, or channel where the infringing material is located.
3. **Contact Details:** Your name, address, telephone number, and email address.
4. **Statement of Authority:** A statement that you are the owner of the intellectual property, or are authorized to act on behalf of the owner.
5. **Statement of Good Faith:** A statement that you have a good-faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
6. **Signature:** Your physical or electronic signature.

Upon receipt of a valid notice, we will review and take appropriate action within 72 hours, which may include removing the content and notifying the contributing participant.

---

Adopted by the Board of Directors of GOBITSNBYTES FOUNDATION on 4 June 2026.
Contact: hello@gobitsnbytes.org | gobitsnbytes.org/ip`;

const sections = [
  { id: "1-brand-stewardship-and-ownership", label: "1. Brand Stewardship" },
  { id: "2-open-source-and-public-benefit-mission", label: "2. Open-Source" },
  { id: "3-contributor-intellectual-property", label: "3. Contributor IP" },
  { id: "4-ip-and-copyright-infringement-claims", label: "4. Infringement Claims" },
];

export default function IntellectualPropertyPolicy() {
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

  const renderIP = () => {
    const parts = ipMarkdown.split(/<aside>([\s\S]*?)<\/aside>/g);
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
            <Scale className="h-3.5 w-3.5 text-[var(--brand-pink)]" />
            Legal Framework
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
            Intellectual Property
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
                {renderIP()}
              </div>
            </GlassContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
