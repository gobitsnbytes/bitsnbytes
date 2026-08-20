"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Cloud,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  Lock,
  Sparkles,
  FileText,
  UserCheck,
  Scale,
  HelpCircle,
  Globe,
  Server,
  Database,
  Ticket,
  HeartHandshake,
  Zap,
  Layers,
  BookOpen,
  Upload,
  Loader2,
  Send,
  Github,
  Linkedin,
  Mail,
  User,
  IdCard,
  TriangleAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumb";

export default function CloudPage() {
  const [checkedAge, setCheckedAge] = useState(false);
  const [checkedPolicies, setCheckedPolicies] = useState(false);
  const [checkedAbuse, setCheckedAbuse] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isUnlocked = checkedAge && checkedPolicies && checkedAbuse;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File size exceeds 10MB limit. Please upload a smaller image or PDF.");
        return;
      }
      setErrorMessage("");
      setIdFile(file);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !github || !linkedin || !idFile) {
      setErrorMessage("Please fill out all fields and attach your Student ID / School ID.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("email", email);
      formData.append("github", github);
      formData.append("linkedin", linkedin);
      formData.append("id_file", idFile);

      const res = await fetch("/api/cloud/apply", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8"
      style={{ fontFamily: "'Helvetica Now', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-10">
        <Breadcrumbs items={[{ name: "SparkCloud", href: "/cloud" }]} />

        {/* ── HERO ── */}
        <div
          data-tour="page-hero"
          data-cinematic-section
          data-cinematic-title="cloud for builders"
          className="relative border-4 border-border bg-card p-6 sm:p-10 shadow-[8px_8px_0px_0px_var(--border)] overflow-hidden"
        >
          {/* Geometric accent — starburst, not blob */}
          <div
            className="absolute -top-8 -right-8 w-40 h-40 opacity-[0.07] pointer-events-none select-none"
            style={{
              background: "conic-gradient(from 0deg, #97192c 0deg, transparent 20deg, #97192c 40deg, transparent 60deg, #97192c 80deg, transparent 100deg, #97192c 120deg, transparent 140deg, #97192c 160deg, transparent 180deg, #97192c 200deg, transparent 220deg, #97192c 240deg, transparent 260deg, #97192c 280deg, transparent 300deg, #97192c 320deg, transparent 340deg, #97192c 360deg)",
              clipPath: "polygon(50% 0%,53% 35%,68% 6%,55% 38%,79% 21%,57% 43%,93% 43%,59% 50%,93% 57%,57% 57%,79% 79%,55% 62%,68% 94%,53% 65%,50% 100%,47% 65%,32% 94%,45% 62%,21% 79%,43% 57%,7% 57%,41% 50%,7% 43%,43% 43%,21% 21%,45% 38%,32% 6%,47% 35%)",
            }}
          />

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-black uppercase bg-primary text-primary-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
              <Cloud className="w-3 h-3" /> SparkCloud PaaS
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-black uppercase bg-[#fc920d] text-[#120f0a] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
              <UserCheck className="w-3 h-3" /> Teenagers 13–19
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-black uppercase bg-card text-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
              <Globe className="w-3 h-3 text-emerald-500" /> India Only
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-black uppercase bg-emerald-950/40 text-emerald-400 border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
              <HeartHandshake className="w-3 h-3" /> US 501(c)(3) Nonprofit Partner
            </span>
          </div>

          {/* Partner Logos */}
          <div className="flex flex-wrap items-center gap-4 mb-7 pb-6 border-b-2 border-border/20">
            <div className="flex items-center gap-2.5 bg-background/80 border-2 border-border px-3 py-2 shadow-[2px_2px_0px_0px_var(--border)]">
              <div className="relative w-6 h-6 bg-card border border-border flex items-center justify-center shrink-0">
                <Image src="/logo.svg" alt="bits&bytes logo" width={18} height={18} className="invert dark:invert-0" />
              </div>
              <span className="font-black text-sm uppercase tracking-tight">bits&bytes™</span>
            </div>
            <span className="font-mono text-xl font-bold text-muted-foreground">+</span>
            <div className="flex items-center bg-background/80 border-2 border-border px-3 py-2 shadow-[2px_2px_0px_0px_var(--border)]">
              <a href="https://sparkden.org/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-75 transition-opacity">
                <img src="https://sparkden.org/logo-full.png" alt="Sparkden" className="h-6 object-contain invert dark:invert-0" />
              </a>
            </div>
            <span className="font-mono text-xl font-bold text-muted-foreground">+</span>
            <div className="flex items-center bg-background/80 border-2 border-border px-3 py-2 shadow-[2px_2px_0px_0px_var(--border)]">
              <a href="https://cloud.sparkden.org/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-75 transition-opacity">
                <img src="https://cloud.sparkden.org/sparkcloud-logo.png" alt="SparkCloud" className="h-6 object-contain" />
              </a>
            </div>
          </div>

          <h1 data-speakable="true" className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-3 leading-none">
            SparkCloud <span className="text-[#fc920d]">× bits&bytes™</span>
          </h1>

          <p data-speakable="true" data-citation="true" className="text-sm sm:text-base text-foreground/80 font-medium max-w-3xl leading-relaxed mb-6">
            Free, high-performance cloud development spaces for ambitious teen builders. Code, deploy, and host full-stack applications from your browser — no credit card, no corporate account, no gatekeeping.
          </p>

          {/* Philosophy */}
          <div className="p-4 border-2 border-primary bg-primary/10 font-mono mb-6">
            <span className="font-black text-primary uppercase block tracking-widest text-[10px] mb-1">Mission Philosophy</span>
            <p className="text-foreground/90 font-sans text-xs sm:text-sm italic leading-relaxed">
              &ldquo;Deploy. Break it. Fix it. Repeat. Every teenager should be able to ship something real without spending weeks on cloud theory or corporate billing requirements.&rdquo;
            </p>
          </div>

          {/* Quick Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="border-2 border-border bg-background p-4 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="flex items-center gap-2 font-black text-sm mb-1.5">
                <Terminal className="w-4 h-4 text-primary shrink-0" />
                SparkCloud Environments
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Free cloud spaces — code, test, build, and host containers and databases from any browser.
              </p>
            </div>
            <div className="border-2 border-border bg-background p-4 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="flex items-center gap-2 font-black text-sm mb-1.5">
                <Sparkles className="w-4 h-4 text-[#fc920d] shrink-0" />
                One Verified Account
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A single Spark Account signs you into every Sparkden service, workspace, and tool.
              </p>
            </div>
          </div>

          {/* Footer links */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-6 pt-4 border-t border-border/20 text-[11px] font-mono font-bold">
            <a href="https://sparkden.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary transition-colors underline decoration-2">
              sparkden.org <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-muted-foreground">·</span>
            <a href="https://cloud.sparkden.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary transition-colors underline decoration-2">
              cloud.sparkden.org <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-muted-foreground">·</span>
            <a href="https://sparkden.org/philosophy" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary transition-colors underline decoration-2">
              Philosophy <BookOpen className="w-3 h-3" />
            </a>
            <span className="text-muted-foreground">·</span>
            <a href="https://cloud.sparkden.org/faq" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary transition-colors underline decoration-2">
              FAQ <HelpCircle className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* ── WHAT SPARKCLOUD PROVIDES ── */}
        <div
          data-cinematic-section
          data-cinematic-title="what you get"
          className="border-4 border-border bg-card p-6 sm:p-10 shadow-[8px_8px_0px_0px_var(--border)] space-y-6"
        >
          <div className="border-b-2 border-border/20 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 text-primary shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">What SparkCloud Provides</h2>
            </div>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
              Sparkden and SparkCloud are educational programmes operated by <strong>The Spark Forward Foundation, Inc.</strong>, a US 501(c)(3) nonprofit (EIN: 42-2930302).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: <Server className="w-4 h-4 shrink-0" />, color: "text-primary", label: "Container Hosting", desc: "Deploy containerised apps, Node/Python backends, REST APIs, and bots with instant public URLs." },
              { icon: <Database className="w-4 h-4 shrink-0" />, color: "text-[#fc920d]", label: "Managed Databases", desc: "Provision high-performance PostgreSQL and data store instances for full-stack hackathon projects." },
              { icon: <Ticket className="w-4 h-4 shrink-0" />, color: "text-emerald-400", label: "Tokens & Vouchers", desc: "Transparent token-based billing via student grants. Free tier stays real — tokens never expire." },
            ].map(({ icon, color, label, desc }) => (
              <div key={label} className="p-4 border-2 border-border bg-background shadow-[3px_3px_0px_0px_var(--border)]">
                <div className={`flex items-center gap-2 font-black text-xs sm:text-sm mb-2 ${color}`}>
                  {icon} {label}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 border-2 border-border bg-background font-mono text-xs leading-relaxed">
            <span className="font-black text-foreground uppercase tracking-widest block flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5 text-[#fc920d] shrink-0" /> Zero Billing Friction
            </span>
            <p className="text-foreground/70 text-[11px] sm:text-xs">
              Unlike AWS, GCP, or Azure — no credit cards, no complex IAM, no corporate billing. SparkCloud gives student builders the agility of Render, Railway, and Vercel while keeping access and education front and centre.
            </p>
          </div>
        </div>

        {/* ── ANTI-ABUSE WARNING ── */}
        <div
          data-cinematic-section
          data-cinematic-title="the hard limits"
          className="border-4 border-[#97192c] bg-[#97192c]/10 p-6 sm:p-8 shadow-[8px_8px_0px_0px_#97192c]"
        >
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-2.5 bg-[#97192c] text-white border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-3 w-full">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-[#97192c] text-white font-mono text-[10px] font-black uppercase tracking-widest">Mandatory Notice</span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-[#c94218] tracking-tight">Strict Eligibility & Anti-Abuse</h2>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-foreground/90 leading-relaxed">
                This complimentary cloud access is strictly reserved for Indian teenagers between <strong>ages 13 and 19</strong> who are active members of bits&bytes™.
              </p>
              <div className="p-3 sm:p-4 bg-background border-2 border-[#97192c]/60 font-mono text-[11px] sm:text-xs text-[#c94218] space-y-2">
                <p className="font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Scale className="w-4 h-4 shrink-0" /> Legal Warning & Anti-Abuse Policy:
                </p>
                <p className="leading-relaxed text-foreground/80 text-[11px]">
                  Misuse, fraudulent registration, multi-accounting, VPN proxying, or attempting to bypass eligibility criteria will result in immediate service termination, permanent blacklisting, legal notice issuance, and formal prosecution under applicable Indian and international civil and criminal statutes.
                </p>
                <p className="font-black text-[#97192c] uppercase tracking-wide">
                  Legal action will be taken against anyone found abusing or misusing this service.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── POLICY AGREEMENT & VERIFICATION GATE ── */}
        <div
          data-cinematic-section
          data-cinematic-title="verify and apply"
          className="border-4 border-border bg-card p-6 sm:p-10 shadow-[8px_8px_0px_0px_var(--border)] space-y-6 sm:space-y-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Policy Agreement & Verification</h2>
            </div>
            <p className="text-xs sm:text-sm text-foreground/70">
              Before applying, review Sparkden&apos;s legal documents and explicitly accept the governing terms.
            </p>
          </div>

          {/* Policy links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            {[
              { href: "https://sparkden.org/conduct", icon: <FileText className="w-4 h-4 text-primary shrink-0" />, label: "Sparkden Code of Conduct" },
              { href: "https://sparkden.org/terms", icon: <Scale className="w-4 h-4 text-[#fc920d] shrink-0" />, label: "Sparkden Terms of Service" },
              { href: "https://sparkden.org/privacy", icon: <Lock className="w-4 h-4 text-emerald-500 shrink-0" />, label: "Sparkden Privacy Policy" },
              { href: "https://sparkden.org/acceptable-use", icon: <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />, label: "Acceptable Use Policy" },
            ].map(({ href, icon, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border-2 border-border bg-background hover:bg-card hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] transition-all font-black group"
              >
                <span className="flex items-center gap-2">{icon} {label}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 shrink-0" />
              </a>
            ))}
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-1">
            {[
              {
                id: "age",
                checked: checkedAge,
                set: setCheckedAge,
                danger: false,
                text: "I confirm I am an Indian resident/national aged between 13 and 19 years old.",
              },
              {
                id: "policies",
                checked: checkedPolicies,
                set: setCheckedPolicies,
                danger: false,
                text: "I have read and agree to Sparkden's Conduct, Terms of Service, Privacy Policy, and Acceptable Use Policy. I acknowledge that Sparkden's legal terms govern on their infrastructure.",
              },
              {
                id: "abuse",
                checked: checkedAbuse,
                set: setCheckedAbuse,
                danger: true,
                text: "I acknowledge the zero-tolerance anti-abuse warning and understand that misrepresenting eligibility or abusing cloud resources will result in immediate legal notices and formal prosecution.",
              },
            ].map(({ id, checked, set, danger, text }) => (
              <label
                key={id}
                className={`flex items-start gap-3 p-3.5 border-2 bg-background cursor-pointer select-none transition-colors ${
                  danger
                    ? "border-[#97192c]/40 hover:border-[#97192c]"
                    : "border-border hover:border-primary"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => set(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded-none border-2 border-border focus:ring-0 accent-primary shrink-0"
                />
                <span className={`text-xs font-bold leading-normal ${danger ? "text-[#c94218]" : ""}`}>
                  {text}
                </span>
              </label>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-2 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {isUnlocked ? (
                <motion.div
                  key="unlocked"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full text-center space-y-3"
                >
                  {!showForm && !submitted && (
                    <>
                      <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 text-sm font-black uppercase tracking-widest border-2 border-border bg-[#fc920d] text-[#120f0a] shadow-[4px_4px_0px_0px_var(--border)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--border)] active:translate-y-0.5 active:shadow-none transition-all duration-150 font-mono"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Proceed to Verification Form
                        <Send className="w-4 h-4 ml-1" />
                      </button>
                      <p className="text-xs font-mono text-emerald-500 font-bold">
                        ✓ Policies accepted. Complete the verification form to receive your access link.
                      </p>
                    </>
                  )}
                </motion.div>
              ) : (
                <div className="w-full text-center space-y-2">
                  <button
                    disabled
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-xs font-black uppercase tracking-widest border-2 border-border bg-muted text-muted-foreground shadow-[3px_3px_0px_0px_var(--border)] cursor-not-allowed opacity-60 font-mono"
                  >
                    <Lock className="w-4 h-4" />
                    Complete All 3 Steps to Unlock
                  </button>
                  <p className="text-xs font-mono text-muted-foreground">Check all three boxes above to proceed.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── APPLICATION FORM ── */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-4 border-[#fc920d] bg-card p-6 sm:p-10 shadow-[8px_8px_0px_0px_#fc920d] space-y-6"
            >
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-emerald-400">
                    Application Submitted ✓
                  </h3>
                  <p className="text-sm text-foreground/80 max-w-xl mx-auto leading-relaxed">
                    Our team will review your ID document and profiles. Once verified, your official SparkCloud join link will be emailed to <strong>{email}</strong>.
                  </p>
                  <div className="p-4 border-2 border-border bg-background font-mono text-xs text-muted-foreground inline-block">
                    Status: <span className="text-[#fc920d] font-black uppercase">Pending Manual Review</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="space-y-6">
                  <div className="border-b-2 border-border/20 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <UserCheck className="w-5 h-5 text-[#fc920d]" />
                      <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Verification Details</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      To prevent multi-accounting and abuse, provide your builder profile links and a valid government or school-issued ID document.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 border-2 border-[#97192c] bg-[#97192c]/10 text-[#c94218] text-xs font-mono font-black flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-black uppercase flex items-center gap-1.5 tracking-widest">
                        <User className="w-3.5 h-3.5 text-primary" /> Full Name <span className="text-[#97192c]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Yash Singh"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-3 border-2 border-border bg-background text-sm focus:outline-none focus:border-primary shadow-[2px_2px_0px_0px_var(--border)] transition-shadow"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-black uppercase flex items-center gap-1.5 tracking-widest">
                        <Mail className="w-3.5 h-3.5 text-primary" /> Email Address <span className="text-[#97192c]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border-2 border-border bg-background text-sm focus:outline-none focus:border-primary shadow-[2px_2px_0px_0px_var(--border)] transition-shadow"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-black uppercase flex items-center gap-1.5 tracking-widest">
                        <Github className="w-3.5 h-3.5 text-primary" /> GitHub Profile URL <span className="text-[#97192c]">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://github.com/yourusername"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="w-full p-3 border-2 border-border bg-background text-sm focus:outline-none focus:border-primary shadow-[2px_2px_0px_0px_var(--border)] transition-shadow"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-black uppercase flex items-center gap-1.5 tracking-widest">
                        <Linkedin className="w-3.5 h-3.5 text-primary" /> LinkedIn Profile URL <span className="text-[#97192c]">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://linkedin.com/in/yourusername"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="w-full p-3 border-2 border-border bg-background text-sm focus:outline-none focus:border-primary shadow-[2px_2px_0px_0px_var(--border)] transition-shadow"
                      />
                    </div>
                  </div>

                  {/* ID Upload — explicit guidance to stop cat photos */}
                  <div className="space-y-3 pt-1">
                    <label className="text-[10px] font-mono font-black uppercase flex items-center gap-1.5 tracking-widest">
                      <IdCard className="w-3.5 h-3.5 text-[#fc920d]" /> ID Document <span className="text-[#97192c]">*</span>
                    </label>

                    {/* What counts as a valid ID */}
                    <div className="p-3 border-2 border-border bg-background font-mono text-[11px] space-y-1.5">
                      <p className="font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Accepted documents:
                      </p>
                      <ul className="space-y-0.5 text-foreground/70 pl-5 list-disc">
                        <li>School / College ID card (with your name and photo)</li>
                        <li>Aadhaar card (you may redact your Aadhaar number — your name and photo are sufficient)</li>
                        <li>Passport (bio-data page only)</li>
                        <li>Any other government or institution-issued photo ID</li>
                      </ul>
                      <div className="mt-2 pt-2 border-t border-border/30 flex items-start gap-1.5 text-[#97192c]">
                        <TriangleAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <p className="font-black uppercase tracking-wide">
                          Do NOT upload photos of pets, screenshots, blank images, or anything unrelated to identity verification. Fraudulent uploads result in immediate disqualification and may trigger legal action.
                        </p>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-border bg-background p-5 text-center hover:border-primary transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        required
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-1.5 font-mono text-xs pointer-events-none">
                        <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
                        {idFile ? (
                          <p className="font-black text-emerald-400">
                            ✓ {idFile.name} ({(idFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        ) : (
                          <>
                            <p className="font-black text-foreground">Click or drop your ID document here</p>
                            <p className="text-muted-foreground text-[11px]">JPG · PNG · WEBP · PDF — max 10 MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 py-4 text-sm font-black uppercase tracking-widest border-2 border-border bg-[#fc920d] text-[#120f0a] shadow-[4px_4px_0px_0px_var(--border)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--border)] active:translate-y-0 active:shadow-none transition-all font-mono inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_var(--border)]"
                    >
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                      ) : (
                        <><Send className="w-4 h-4" /> Submit Verification Request</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FOOTER ── */}
        <div className="border-t-2 border-border/30 pt-6 text-center font-mono text-[10px] text-muted-foreground space-y-1">
          <p className="font-black uppercase tracking-widest">bits&bytes™ by GOBITSNBYTES FOUNDATION</p>
          <p>© 2026 GOBITSNBYTES FOUNDATION. All rights reserved. | gobitsnbytes.org</p>
        </div>

      </div>
    </div>
  );
}
