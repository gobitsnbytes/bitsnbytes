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
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CloudPage() {
  const [checkedAge, setCheckedAge] = useState(false);
  const [checkedPolicies, setCheckedPolicies] = useState(false);
  const [checkedAbuse, setCheckedAbuse] = useState(false);

  // Application Form State
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
    <div className="min-h-screen bg-background text-foreground pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
        
        {/* HERO SECTION */}
        <div className="relative border-2 sm:border-4 border-border bg-card p-4 sm:p-8 md:p-10 shadow-[4px_4px_0px_0px_var(--border)] sm:shadow-[8px_8px_0px_0px_var(--border)] overflow-hidden">
          {/* Background Decorative Pattern */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#fc920d]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-mono font-bold uppercase bg-primary text-primary-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
              <Cloud className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> SparkCloud PaaS
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-mono font-bold uppercase bg-[#fc920d] text-[#120f0a] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
              <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Teenagers Aged 13–19
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-mono font-bold uppercase bg-card text-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" /> India Only
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-mono font-bold uppercase bg-emerald-950/40 text-emerald-400 border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
              <HeartHandshake className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> US 501(c)(3) Nonprofit Partner
            </span>
          </div>

          {/* Partner Logos */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-6 sm:mb-8 pt-2 pb-4 sm:pb-6 border-b-2 border-border/20">
            {/* bits&bytes logo */}
            <div className="flex items-center gap-2 sm:gap-3 bg-background/80 border-2 border-border px-2.5 sm:px-3.5 py-1.5 sm:py-2 shadow-[2px_2px_0px_0px_var(--border)]">
              <div className="relative w-5 h-5 sm:w-7 sm:h-7 bg-card border border-border flex items-center justify-center shrink-0">
                <Image
                  src="/logo.svg"
                  alt="bits&bytes logo"
                  width={18}
                  height={18}
                  className="invert dark:invert-0"
                />
              </div>
              <span className="font-black text-xs sm:text-sm uppercase tracking-tight">bits&bytes™</span>
            </div>

            <span className="font-mono text-lg sm:text-xl font-bold text-muted-foreground">+</span>

            {/* Sparkden Full Logo */}
            <div className="flex items-center bg-background/80 border-2 border-border px-2.5 sm:px-3.5 py-1.5 sm:py-2 shadow-[2px_2px_0px_0px_var(--border)]">
              <a href="https://sparkden.org/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                <img
                  src="https://sparkden.org/logo-full.png"
                  alt="Sparkden Logo"
                  className="h-5 sm:h-7 object-contain invert dark:invert-0"
                />
              </a>
            </div>

            <span className="font-mono text-lg sm:text-xl font-bold text-muted-foreground">+</span>

            {/* SparkCloud Logo */}
            <div className="flex items-center bg-background/80 border-2 border-border px-2.5 sm:px-3.5 py-1.5 sm:py-2 shadow-[2px_2px_0px_0px_var(--border)]">
              <a href="https://cloud.sparkden.org/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                <img
                  src="https://cloud.sparkden.org/sparkcloud-logo.png"
                  alt="SparkCloud Logo"
                  className="h-5 sm:h-7 object-contain"
                />
              </a>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-3 sm:mb-4 leading-tight">
            SparkCloud <span className="text-primary dark:text-[#fc920d]">x bits&bytes™</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-foreground/80 font-medium max-w-3xl leading-relaxed mb-6">
            Free, high-performance cloud development spaces designed for ambitious teen builders. Code, deploy, and host full-stack applications straight from your browser with zero credit cards or complex cloud setup.
          </p>

          {/* Core Philosophy Banner */}
          <div className="p-3.5 sm:p-4 border-2 border-primary bg-primary/10 text-xs font-mono mb-6 space-y-1">
            <span className="font-bold text-primary uppercase block tracking-wider text-[11px] sm:text-xs">
              Mission Philosophy: &quot;Learn By Building&quot;
            </span>
            <p className="text-foreground/90 font-sans text-xs sm:text-sm italic leading-relaxed">
              &ldquo;Deploy. Break it. Fix it. Repeat. Every teenager should be able to deploy something real to the internet, instead of spending weeks learning complex cloud theory or corporate credit card requirements.&rdquo;
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6">
            <div className="border-2 border-border bg-background p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base mb-1">
                <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                <span>SparkCloud Environments</span>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                Free cloud development spaces — code, test, build, and host containers and databases directly from any browser without hardware limitations.
              </p>
            </div>

            <div className="border-2 border-border bg-background p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base mb-1">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#fc920d] shrink-0" />
                <span>One Verified Account</span>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                A single Spark Account signs you seamlessly into every Sparkden service, workspace, and community infrastructure tool.
              </p>
            </div>
          </div>

          {/* Sparkden Links */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-6 pt-4 border-t border-border/20 text-[11px] sm:text-xs font-mono font-bold">
            <a
              href="https://sparkden.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors underline decoration-2"
            >
              sparkden.org <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://cloud.sparkden.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors underline decoration-2"
            >
              cloud.sparkden.org <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://sparkden.org/philosophy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors underline decoration-2"
            >
              Our Philosophy <BookOpen className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://cloud.sparkden.org/faq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors underline decoration-2"
            >
              SparkCloud FAQ <HelpCircle className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* PLATFORM ARCHITECTURE & FEATURES GRID */}
        <div className="border-2 sm:border-4 border-border bg-card p-4 sm:p-8 md:p-10 shadow-[4px_4px_0px_0px_var(--border)] sm:shadow-[8px_8px_0px_0px_var(--border)] space-y-6">
          <div className="border-b-2 border-border/20 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight">
                What SparkCloud Provides
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
              Sparkden and SparkCloud are educational programs operated by <strong>The Spark Forward Foundation, Inc.</strong>, a US 501(c)(3) tax-exempt nonprofit corporation organized in <strong>New Jersey, USA (EIN: 42-2930302)</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 border-2 border-border bg-background shadow-[3px_3px_0px_0px_var(--border)] space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-primary">
                <Server className="w-4 h-4 shrink-0" />
                <span>Container Hosting</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Deploy containerized applications, Node/Python backends, REST APIs, and Discord bots with instant public URLs.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 border-2 border-border bg-background shadow-[3px_3px_0px_0px_var(--border)] space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#fc920d]">
                <Database className="w-4 h-4 shrink-0" />
                <span>Managed Databases</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Provision high-performance database instances (PostgreSQL, data stores) for full-stack hackathon projects.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 border-2 border-border bg-background shadow-[3px_3px_0px_0px_var(--border)] space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-emerald-500">
                <Ticket className="w-4 h-4 shrink-0" />
                <span>Tokens & Vouchers</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Transparent token-based billing funded through student grants & vouchers. Free tier stays real — tokens never expire.
              </p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 border-2 border-border bg-background font-mono text-xs space-y-2 leading-relaxed">
            <span className="font-bold text-foreground uppercase tracking-wider block flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#fc920d] shrink-0" />
              Zero Billing Friction for Students:
            </span>
            <p className="text-foreground/80 text-[11px] sm:text-xs">
              Unlike AWS, GCP, or Azure, SparkCloud does not require credit cards, complex IAM permissions, or corporate billing accounts. It provides student builders with the agility of Render, Railway, Fly.io, and Vercel while keeping education and accessibility front and center.
            </p>
          </div>
        </div>

        {/* STRICT ELIGIBILITY & ANTI-ABUSE WARNING NOTICE */}
        <div className="border-2 sm:border-4 border-red-600 bg-red-950/20 text-foreground p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_#dc2626] sm:shadow-[8px_8px_0px_0px_#dc2626]">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 bg-red-600 text-white border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-3 w-full">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-red-600 text-white font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  Mandatory Notice
                </span>
                <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase text-red-500 tracking-tight">
                  Strict Eligibility & Anti-Abuse Enforcement
                </h2>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-foreground/90 leading-relaxed">
                This complimentary cloud access is strictly reserved for Indian teenagers between <strong>ages 13 and 19</strong> who are active members of bits&bytes™.
              </p>

              <div className="p-3 sm:p-4 bg-background border-2 border-red-600/60 font-mono text-[11px] sm:text-xs text-red-400 space-y-2">
                <p className="font-bold uppercase tracking-wide flex items-center gap-1.5">
                  <Scale className="w-4 h-4 shrink-0 text-red-500" />
                  Legal Warning & Anti-Abuse Policy:
                </p>
                <p className="leading-relaxed text-[11px] sm:text-xs">
                  Strict Legal Notice: Misuse, abuse, fraudulent registration, multi-accounting, VPN proxying, or attempting to bypass eligibility criteria will result in immediate service termination, permanent blacklisting across all networks, legal notice issuance, and formal prosecution under applicable Indian and international civil and criminal statutes.
                </p>
                <p className="font-bold text-red-500 uppercase">
                  Legal notice will be sent and legal action will be taken against anyone found to be abusing or misusing the service or offering.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LEGAL PRECEDENCE & VERIFICATION GATE */}
        <div className="border-2 sm:border-4 border-border bg-card p-4 sm:p-8 md:p-10 shadow-[4px_4px_0px_0px_var(--border)] sm:shadow-[8px_8px_0px_0px_var(--border)] space-y-6 sm:space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 shrink-0" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight">
                Policy Agreement & Precedence Verification
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-foreground/80">
              Before applying for access, you must review Sparkden&apos;s legal documents and explicitly accept the governing terms.
            </p>
          </div>

          {/* Policy Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <a
              href="https://sparkden.org/conduct"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 sm:p-3.5 border-2 border-border bg-background hover:bg-card hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] transition-all font-bold group"
            >
              <span className="flex items-center gap-2 text-xs">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                Sparkden Code of Conduct
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0" />
            </a>

            <a
              href="https://sparkden.org/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 sm:p-3.5 border-2 border-border bg-background hover:bg-card hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] transition-all font-bold group"
            >
              <span className="flex items-center gap-2 text-xs">
                <Scale className="w-4 h-4 text-[#fc920d] shrink-0" />
                Sparkden Terms of Service
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0" />
            </a>

            <a
              href="https://sparkden.org/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 sm:p-3.5 border-2 border-border bg-background hover:bg-card hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] transition-all font-bold group"
            >
              <span className="flex items-center gap-2 text-xs">
                <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
                Sparkden Privacy Policy
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0" />
            </a>

            <a
              href="https://sparkden.org/acceptable-use"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 sm:p-3.5 border-2 border-border bg-background hover:bg-card hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] transition-all font-bold group"
            >
              <span className="flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                Sparkden Acceptable Use Policy
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0" />
            </a>
          </div>

          {/* Verification Checkboxes */}
          <div className="space-y-3 sm:space-y-4 pt-2">
            <label className="flex items-start gap-3 p-3 sm:p-3.5 border-2 border-border bg-background cursor-pointer select-none hover:border-primary transition-colors">
              <input
                type="checkbox"
                checked={checkedAge}
                onChange={(e) => setCheckedAge(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-none border-2 border-border text-primary focus:ring-0 accent-primary shrink-0"
              />
              <span className="text-xs font-bold leading-normal">
                I confirm that I am an Indian resident/national aged between 13 and 19 years old.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 sm:p-3.5 border-2 border-border bg-background cursor-pointer select-none hover:border-primary transition-colors">
              <input
                type="checkbox"
                checked={checkedPolicies}
                onChange={(e) => setCheckedPolicies(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-none border-2 border-border text-primary focus:ring-0 accent-primary shrink-0"
              />
              <span className="text-xs font-bold leading-normal">
                I have opened, reviewed, and agree to abide by Sparkden&apos;s Conduct, Terms of Service, Privacy Policy, and Acceptable Use Policy, acknowledging that Sparkden&apos;s legal terms supersede bits&bytes™ terms on their infrastructure.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 sm:p-3.5 border-2 border-border bg-background cursor-pointer select-none hover:border-primary transition-colors">
              <input
                type="checkbox"
                checked={checkedAbuse}
                onChange={(e) => setCheckedAbuse(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-none border-2 border-border text-primary focus:ring-0 accent-primary shrink-0"
              />
              <span className="text-xs font-bold leading-normal text-red-500 dark:text-red-400">
                I acknowledge the zero-tolerance anti-abuse warning and understand that misrepresenting eligibility or abusing cloud resources will result in immediate legal notices and formal prosecution.
              </span>
            </label>
          </div>

          {/* UNLOCKED CTA / FORM TRIGGER */}
          <div className="pt-4 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {isUnlocked ? (
                <motion.div
                  key="unlocked"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full text-center space-y-4"
                >
                  {!showForm && !submitted && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-black uppercase tracking-wider border-3 border-border bg-[#fc920d] text-[#120f0a] shadow-[4px_4px_0px_0px_var(--border)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--border)] active:translate-y-0.5 active:shadow-none transition-all duration-150 rounded-none font-mono"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#120f0a]" />
                      Proceed to Verification & Application Form
                      <Send className="w-4 h-4 ml-1" />
                    </button>
                  )}

                  {!showForm && !submitted && (
                    <p className="text-xs font-mono text-emerald-500 font-bold">
                      ✓ Policies accepted. Complete the quick verification form below to receive your access link.
                    </p>
                  )}
                </motion.div>
              ) : (
                <div className="w-full text-center space-y-3">
                  <button
                    disabled
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-wider border-3 border-border bg-muted text-muted-foreground shadow-[3px_3px_0px_0px_var(--border)] cursor-not-allowed opacity-75 rounded-none font-mono"
                  >
                    <Lock className="w-4 h-4" />
                    Complete All 3 Verification Steps to Unlock Application
                  </button>
                  <p className="text-xs font-mono text-muted-foreground">
                    Check all three required verification boxes above to proceed.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* APPLICATION FORM CARD */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-2 sm:border-4 border-[#fc920d] bg-card p-4 sm:p-8 md:p-10 shadow-[6px_6px_0px_0px_#fc920d] space-y-6"
            >
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-emerald-400">
                    Application Submitted Successfully! 🚀
                  </h3>
                  <p className="text-sm sm:text-base text-foreground/80 max-w-xl mx-auto leading-relaxed">
                    Our team will review your ID document and social profiles. Once verified, your official SparkCloud join link will be emailed to <strong>{email}</strong>.
                  </p>
                  <div className="p-4 border-2 border-border bg-background font-mono text-xs text-muted-foreground inline-block">
                    Verification Status: <span className="text-[#fc920d] font-bold uppercase">Pending Manual Review</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="space-y-6">
                  <div className="border-b-2 border-border/20 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <UserCheck className="w-6 h-6 text-[#fc920d]" />
                      <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                        SparkCloud Verification Details
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      To prevent multi-accounting and bot abuse, please provide your builder profile links and upload a photo of your Student ID or School ID.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 border-2 border-red-600 bg-red-950/30 text-red-400 text-xs font-mono font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-primary" /> Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Yash Singh"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-3 border-2 border-border bg-background text-sm font-sans focus:outline-none focus:border-primary shadow-[2px_2px_0px_0px_var(--border)]"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-primary" /> Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border-2 border-border bg-background text-sm font-sans focus:outline-none focus:border-primary shadow-[2px_2px_0px_0px_var(--border)]"
                      />
                    </div>

                    {/* GitHub */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5 text-primary" /> GitHub Profile URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://github.com/yourusername"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="w-full p-3 border-2 border-border bg-background text-sm font-sans focus:outline-none focus:border-primary shadow-[2px_2px_0px_0px_var(--border)]"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase flex items-center gap-1.5">
                        <Linkedin className="w-3.5 h-3.5 text-primary" /> LinkedIn Profile URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://linkedin.com/in/yourusername"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="w-full p-3 border-2 border-border bg-background text-sm font-sans focus:outline-none focus:border-primary shadow-[2px_2px_0px_0px_var(--border)]"
                      />
                    </div>
                  </div>

                  {/* ID Upload */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-mono font-bold uppercase flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-[#fc920d]" /> Upload Student ID / School ID <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="border-2 border-dashed border-border bg-background p-4 text-center hover:border-primary transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        required
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-1 font-mono text-xs">
                        <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
                        {idFile ? (
                          <p className="font-bold text-emerald-400">
                            Selected: {idFile.name} ({(idFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        ) : (
                          <>
                            <p className="font-bold text-foreground">
                              Click or drop your School ID, Aadhaar, or Student ID card image here
                            </p>
                            <p className="text-muted-foreground text-[11px]">
                              Supported formats: JPG, PNG, WEBP, PDF (Max 10MB)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 py-3.5 text-sm font-black uppercase tracking-wider border-2 border-border bg-[#fc920d] text-[#120f0a] shadow-[4px_4px_0px_0px_var(--border)] hover:-translate-y-0.5 active:translate-y-0 transition-all font-mono inline-flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Verification Request
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
