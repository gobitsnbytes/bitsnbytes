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
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CloudPage() {
  const [checkedAge, setCheckedAge] = useState(false);
  const [checkedPolicies, setCheckedPolicies] = useState(false);
  const [checkedAbuse, setCheckedAbuse] = useState(false);

  const isUnlocked = checkedAge && checkedPolicies && checkedAbuse;

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* HERO SECTION */}
        <div className="relative border-4 border-border bg-card p-6 sm:p-10 shadow-[8px_8px_0px_0px_var(--border)] overflow-hidden">
          {/* Background Decorative Pattern */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#fc920d]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Badges */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase bg-primary text-primary-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
              <Cloud className="w-3.5 h-3.5" /> SparkCloud Integration
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase bg-[#fc920d] text-[#120f0a] border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
              <UserCheck className="w-3.5 h-3.5" /> Teenagers Aged 13–19
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase bg-card text-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
              <Globe className="w-3.5 h-3.5 text-emerald-500" /> India Only
            </span>
          </div>

          {/* Partner Logos */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 pt-2 pb-6 border-b-2 border-border/20">
            {/* bits&bytes logo */}
            <div className="flex items-center gap-3 bg-background/80 border-2 border-border px-3.5 py-2 shadow-[2px_2px_0px_0px_var(--border)]">
              <div className="relative w-7 h-7 bg-card border border-border flex items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="bits&bytes logo"
                  width={20}
                  height={20}
                  className="invert dark:invert-0"
                />
              </div>
              <span className="font-black text-sm uppercase tracking-tight">bits&bytes™</span>
            </div>

            <span className="font-mono text-xl font-bold text-muted-foreground">+</span>

            {/* Sparkden Full Logo */}
            <div className="flex items-center bg-background/80 border-2 border-border px-3.5 py-2 shadow-[2px_2px_0px_0px_var(--border)]">
              {/* eslint-disable-next-html-link-for-pages */}
              <a href="https://sparkden.org/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                {/* eslint-disable-next-html-link-for-pages */}
                <img
                  src="https://sparkden.org/logo-full.png"
                  alt="Sparkden Logo"
                  className="h-6 sm:h-7 object-contain invert dark:invert-0"
                />
              </a>
            </div>

            <span className="font-mono text-xl font-bold text-muted-foreground">+</span>

            {/* SparkCloud Logo */}
            <div className="flex items-center bg-background/80 border-2 border-border px-3.5 py-2 shadow-[2px_2px_0px_0px_var(--border)]">
              <a href="https://cloud.sparkden.org/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                <img
                  src="https://cloud.sparkden.org/sparkcloud-logo.png"
                  alt="SparkCloud Logo"
                  className="h-6 sm:h-7 object-contain"
                />
              </a>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4 leading-none">
            SparkCloud <span className="text-primary dark:text-[#fc920d]">x bits&bytes™</span>
          </h1>

          <p className="text-base sm:text-lg text-foreground/80 font-medium max-w-3xl leading-relaxed mb-6">
            Free, high-performance cloud development spaces designed for ambitious builders. Code, build, and host full-stack projects straight from your browser with zero local setup requirements.
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="border-2 border-border bg-background p-4 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="flex items-center gap-2.5 font-bold text-base mb-1.5">
                <Terminal className="w-5 h-5 text-primary" />
                <span>SparkCloud Environments</span>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                Free cloud development spaces — code, test, build, and host applications from any browser without hardware limitations.
              </p>
            </div>

            <div className="border-2 border-border bg-background p-4 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="flex items-center gap-2.5 font-bold text-base mb-1.5">
                <Sparkles className="w-5 h-5 text-[#fc920d]" />
                <span>One Verified Account</span>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                A single Spark Account signs you seamlessly into every Sparkden service, workspace, and community infrastructure tool.
              </p>
            </div>
          </div>

          {/* Sparkden Links */}
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border/20 text-xs font-mono font-bold">
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
              href="https://cloud.sparkden.org/faq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors underline decoration-2"
            >
              SparkCloud FAQ <HelpCircle className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* STRICT ELIGIBILITY & ANTI-ABUSE WARNING NOTICE */}
        <div className="border-4 border-red-600 bg-red-950/20 text-foreground p-6 sm:p-8 shadow-[8px_8px_0px_0px_#dc2626]">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-600 text-white border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-600 text-white font-mono text-xs font-black uppercase tracking-wider">
                  Mandatory Notice
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-red-500 tracking-tight">
                  Strict Eligibility & Anti-Abuse Enforcement
                </h2>
              </div>

              <p className="text-sm font-semibold text-foreground/90 leading-relaxed">
                This complimentary cloud access is strictly reserved for Indian teenagers between <strong>ages 13 and 19</strong> who are active members of bits&bytes™.
              </p>

              <div className="p-4 bg-background border-2 border-red-600/60 font-mono text-xs text-red-400 space-y-2">
                <p className="font-bold uppercase tracking-wide flex items-center gap-1.5">
                  <Scale className="w-4 h-4 shrink-0 text-red-500" />
                  Legal Warning & Anti-Abuse Policy:
                </p>
                <p className="leading-relaxed">
                  Strict Legal Notice: Misuse, abuse, fraudulent registration, multi-accounting, VPN proxying, or attempting to bypass eligibility criteria (age 13-19 or geographic restriction) will result in immediate service termination, permanent blacklisting across all networks, legal notice issuance, and formal prosecution under applicable Indian and international civil and criminal statutes.
                </p>
                <p className="font-bold text-red-500 uppercase">
                  Legal notice will be sent and legal action will be taken against anyone found to be abusing or misusing the service or offering.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LEGAL PRECEDENCE & VERIFICATION GATE */}
        <div className="border-4 border-border bg-card p-6 sm:p-10 shadow-[8px_8px_0px_0px_var(--border)] space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                Policy Agreement & Precedence Verification
              </h2>
            </div>
            <p className="text-sm text-foreground/80">
              Before accessing the organization signup link, you must review Sparkden&apos;s legal documents and explicitly accept the governing terms.
            </p>
          </div>

          {/* Policy Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <a
              href="https://sparkden.org/conduct"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 border-2 border-border bg-background hover:bg-card hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] transition-all font-bold group"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Sparkden Code of Conduct
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </a>

            <a
              href="https://sparkden.org/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 border-2 border-border bg-background hover:bg-card hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] transition-all font-bold group"
            >
              <span className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#fc920d]" />
                Sparkden Terms of Service
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </a>

            <a
              href="https://sparkden.org/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 border-2 border-border bg-background hover:bg-card hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] transition-all font-bold group"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500" />
                Sparkden Privacy Policy
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </a>

            <a
              href="https://sparkden.org/acceptable-use"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 border-2 border-border bg-background hover:bg-card hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] transition-all font-bold group"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Sparkden Acceptable Use Policy
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </a>
          </div>

          {/* Legal Precedence Box */}
          <div className="p-4 border-2 border-border bg-background text-xs font-mono space-y-2 leading-relaxed">
            <span className="font-black uppercase tracking-wider text-primary block">
              Legal Precedence Clarification:
            </span>
            <p className="text-foreground/80">
              Sparkden&apos;s Terms of Service, Acceptable Use Policy, Code of Conduct, and Privacy Policy take precedence and strictly govern all usage, data processing, user conduct, and account infrastructure on SparkCloud and Sparkden platforms. While the bits&bytes™ Code of Conduct applies concurrently to network activities, Sparkden&apos;s legal agreements and terms take priority over ours regarding their services.
            </p>
          </div>

          {/* Verification Checkboxes */}
          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-3 p-3.5 border-2 border-border bg-background cursor-pointer select-none hover:border-primary transition-colors">
              <input
                type="checkbox"
                checked={checkedAge}
                onChange={(e) => setCheckedAge(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-none border-2 border-border text-primary focus:ring-0 accent-primary"
              />
              <span className="text-xs font-bold leading-normal">
                I confirm that I am an Indian resident/national aged between 13 and 19 years old.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3.5 border-2 border-border bg-background cursor-pointer select-none hover:border-primary transition-colors">
              <input
                type="checkbox"
                checked={checkedPolicies}
                onChange={(e) => setCheckedPolicies(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-none border-2 border-border text-primary focus:ring-0 accent-primary"
              />
              <span className="text-xs font-bold leading-normal">
                I have opened, reviewed, and agree to abide by Sparkden&apos;s Conduct, Terms of Service, Privacy Policy, and Acceptable Use Policy, acknowledging that Sparkden&apos;s legal terms supersede bits&bytes™ terms on their infrastructure.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3.5 border-2 border-border bg-background cursor-pointer select-none hover:border-primary transition-colors">
              <input
                type="checkbox"
                checked={checkedAbuse}
                onChange={(e) => setCheckedAbuse(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-none border-2 border-border text-primary focus:ring-0 accent-primary"
              />
              <span className="text-xs font-bold leading-normal text-red-500 dark:text-red-400">
                I acknowledge the zero-tolerance anti-abuse warning and understand that misrepresenting eligibility or abusing cloud resources will result in immediate legal notices and formal prosecution.
              </span>
            </label>
          </div>

          {/* UNLOCKED CTA BUTTON */}
          <div className="pt-4 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {isUnlocked ? (
                <motion.div
                  key="unlocked"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full text-center space-y-3"
                >
                  <a
                    href="https://sparkden.org/org/gobitsnbytes-foundation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 text-base font-black uppercase tracking-wider border-3 border-border bg-[#fc920d] text-[#120f0a] shadow-[4px_4px_0px_0px_var(--border)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--border)] active:translate-y-0.5 active:shadow-none transition-all duration-150 rounded-none"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#120f0a]" />
                    Proceed to GOBITSNBYTES Organization Signup
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <p className="text-xs font-mono text-emerald-500 font-bold">
                    ✓ Verification complete. Link unlocked for valid Indian teen builders.
                  </p>
                </motion.div>
              ) : (
                <div className="w-full text-center space-y-3">
                  <button
                    disabled
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-sm font-black uppercase tracking-wider border-3 border-border bg-muted text-muted-foreground shadow-[3px_3px_0px_0px_var(--border)] cursor-not-allowed opacity-75 rounded-none font-mono"
                  >
                    <Lock className="w-4 h-4" />
                    Complete All 3 Verification Steps to Unlock Signup Link
                  </button>
                  <p className="text-xs font-mono text-muted-foreground">
                    Check all three required verification boxes above to proceed.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
