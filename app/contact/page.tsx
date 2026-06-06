"use client";

import {
  Mail,
  MapPin,
  Clock,
  Loader2,
  Github,
  Linkedin,
  Instagram,
  Copy,
  Check,
  ExternalLink,
  Building2,
  Sparkles,
  User,
  FileText,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useState, FormEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Link from "next/link";
import dynamic from "next/dynamic";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { GlassContainer } from "@/components/ui/glass-container";

// Lazy load WebGL shader
const WebGLShader = dynamic(
  () =>
    import("@/components/ui/web-gl-shader").then((mod) => ({
      default: mod.WebGLShader,
    })),
  {
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0908] via-[#2f0a13] to-[#8f2d0c]" />
    ),
    ssr: false,
  },
);

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [status, setStatus] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const captchaRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@gobitsnbytes.org");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email to clipboard", err);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = (formData.get("name") as string) || "";
    const email = (formData.get("email") as string) || "";
    const subject = (formData.get("subject") as string) || "";
    const message = (formData.get("message") as string) || "";

    if (!captchaToken) {
      setStatus({ type: "error", message: "Please complete the CAPTCHA." });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          source: "website-contact",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to send message.");
      }

      setIsSuccess(true);
      setStatus({
        type: "success",
        message: "Message sent successfully. We'll get back to you soon.",
      });
      form.reset();
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    } catch (err: any) {
      console.error(err);
      setStatus({
        type: "error",
        message:
          err.message ||
          "Something went wrong while sending your message. Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setStatus(null);
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-background">
      {/* Precision design engineering custom styles block */}
      <style jsx global>{`
        /* Gate hover rules with pointer query to avoid sticky states on mobile tap */
        @media (hover: hover) and (pointer: fine) {
          .btn-hover-effect:hover {
            transform: translateY(-2px) scale(1.015);
            background-color: var(--bb-pink) !important;
            box-shadow: 0 0 45px rgba(228, 90, 146, 0.55);
          }
          .btn-hover-effect:hover .arrow-icon {
            transform: translateX(3px);
          }
          .icon-hover-effect:hover {
            transform: scale(1.1) rotate(6deg);
            background-color: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
          }
          .email-row-hover:hover {
            background-color: rgba(255, 255, 255, 0.02);
            border-color: rgba(228, 90, 146, 0.2);
          }
        }

        /* Snappy press animations mimicking spring physics on click */
        .active-press:active {
          transform: translateY(0) scale(0.97) !important;
          transition: transform 120ms cubic-bezier(0.23, 1, 0.32, 1) !important;
        }

        /* Explicit performance-optimized transitions. No transition-all */
        .custom-transition {
          transition: transform 180ms cubic-bezier(0.23, 1, 0.32, 1), 
                      opacity 180ms cubic-bezier(0.23, 1, 0.32, 1), 
                      border-color 180ms cubic-bezier(0.23, 1, 0.32, 1), 
                      box-shadow 180ms cubic-bezier(0.23, 1, 0.32, 1),
                      background-color 180ms cubic-bezier(0.23, 1, 0.32, 1),
                      filter 180ms cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>

      {/* Hero Section - Matching /impact and /press pages */}
      <section className="relative min-h-[40vh] sm:min-h-[45vh] flex items-center justify-center overflow-hidden text-white pt-24 md:pt-32">
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="px-6 py-8 sm:px-10 lg:px-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.35em] font-semibold text-white/90 backdrop-blur-md shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-pink)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-pink)]" />
                </span>
                Contact
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight font-black text-white tracking-tighter drop-shadow-2xl">
                Let&apos;s build something <br className="hidden sm:block" />{" "}
                together
              </h1>
              <p className="max-w-2xl text-white/80 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                Partner with us on hackathons, workshops, or school programs across Lucknow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="relative z-10 bg-transparent pb-24">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          
          {/* Dashboard Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
            
            {/* Left Column: Connection Cards */}
            <div className="lg:col-span-5 flex flex-col gap-6 h-full justify-between">
              
              {/* Brand & Organization Identity Card */}
              <GlassContainer className="p-6 md:p-8 flex flex-col gap-4" glowColor="pink">
                <div className="flex items-center gap-4">
                  {/* Responsive interactive logo monogram based on SVG */}
                  <div className="h-12 w-12 shrink-0 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shadow-lg shadow-black/30">
                    <svg viewBox="28 54 146 146" className="w-9 h-9 text-white fill-current" id="svg-logo" xmlns="http://www.w3.org/2000/svg">
                      <mask id="cube-mask">
                        <path fill="#ffffff" d="m 101.27586,64.293104 56.89655,32.810343 V 161.5862 L 101.46552,194.01724 44.568964,161.5862 44.75862,96.534482 Z" />
                        <path fill="#000000" d="m 49.025862,107.06034 v 51.58621 l 46.086207,25.69828 v -20.29311 l -7.681037,-4.36207 0.189656,11 L 56.61207,154 56.51724,142.52586 87.620688,159.68965 87.431032,149.5431 56.61207,133.0431 v -12.51724 l 31.008618,16.87931 -0.189656,12.42241 7.586208,4.07759 0.09483,-21.81034 z" />
                        <path fill="#000000" d="m 104.78448,133.61207 45.61207,-25.41379 0.47414,21.05172 -8.06035,4.26724 v -11.56897 l -30.62931,16.87931 v 11.75863 L 143,133.23276 l -0.0948,10.05172 -30.81896,16.78448 c 0,0 0.18965,13.18104 -0.0948,13.18104 -0.28449,0 -0.28449,0 -0.28449,0 l 30.9138,-17.06897 v -12.70689 l 7.68103,-4.26725 0.18966,19.9138 -45.61207,26.83621 z" />
                        <path fill="#000000" d="m 136.38627,98.970564 c 6.97353,-4.023193 6.97353,-4.023193 6.97353,-4.023193 L 101.38448,70.405889 61.823075,93.606307 69.869465,98.03182 101.65269,80.195662 Z" />
                        <path fill="#000000" d="m 104.33482,95.617905 6.30301,2.145702 -6.1689,2.950343 -2.54802,5.76658 -2.548026,-5.76658 -6.571215,-2.950343 6.437109,-2.548023 2.413912,-5.498364 z" />
                      </mask>
                      <path fill="#ffffff" mask="url(#cube-mask)" d="m 101.27586,64.293104 56.89655,32.810343 V 161.5862 L 101.46552,194.01724 44.568964,161.5862 44.75862,96.534482 Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-black tracking-tight text-white">
                      bits&amp;bytes™
                    </h3>
                    <span className="text-[10px] font-bold text-white/40 tracking-wider uppercase block">
                      GOBITSNBYTES FOUNDATION
                    </span>
                    <span className="text-[9px] font-mono text-white/30 block mt-0.5">
                      CIN: U85500UP2026NPL248652
                    </span>
                  </div>
                </div>
                
                <div className="h-px bg-white/10 w-full my-1" />
                
                <p className="text-sm text-white/80 leading-relaxed font-medium">
                  bits&amp;bytes™ is an independent, student-led network helping ambitious teenagers build products and get their ideas out into the world. Taste, engineering standards, and high agency guide everything we ship.
                </p>
              </GlassContainer>

              {/* Direct Contact Info Card */}
              <GlassContainer className="p-6 md:p-8" glowColor="none">
                <h4 className="font-display text-xs font-black uppercase tracking-widest text-white/40 mb-5">
                  Direct Channels
                </h4>
                
                <div className="space-y-5">
                  {/* Email Item */}
                  <div className="group/item flex items-start gap-4 p-3 rounded-xl border border-transparent custom-transition email-row-hover">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[var(--bb-pink)] shadow-sm">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                        Email Address
                      </p>
                      <a
                        href="mailto:hello@gobitsnbytes.org"
                        className="text-base font-black text-white hover:text-[var(--bb-pink)] transition-colors break-all mt-0.5 block"
                      >
                        hello@gobitsnbytes.org
                      </a>
                      
                      {/* Copy and Email Buttons */}
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={handleCopyEmail}
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--bb-pink)] hover:text-white transition-colors cursor-pointer active-press"
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3 w-3" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Copy Link
                            </>
                          )}
                        </button>
                        <span className="text-white/20 text-xs font-light">|</span>
                        <a
                          href="mailto:hello@gobitsnbytes.org"
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors active-press"
                        >
                          Send Email
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Location Item */}
                  <div className="flex items-start gap-4 p-3 rounded-xl border border-transparent">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[var(--brand-coral)] shadow-sm">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                        HQ Location
                      </p>
                      <p className="text-base font-black text-white mt-0.5">
                        Lucknow, India
                      </p>
                      <p className="text-xs font-medium text-white/60 mt-0.5">
                        Fiduciary &amp; operational base in UP
                      </p>
                    </div>
                  </div>

                  {/* Timeline Item */}
                  <div className="flex items-start gap-4 p-3 rounded-xl border border-transparent">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[var(--brand-pink)] shadow-sm">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                        Status
                      </p>
                      <p className="text-base font-black text-white mt-0.5">
                        Teen-led since 2025
                      </p>
                      <p className="text-xs font-medium text-white/60 mt-0.5">
                        Independent student community
                      </p>
                    </div>
                  </div>
                </div>
              </GlassContainer>

              {/* Social Links Card */}
              <GlassContainer className="p-5" glowColor="purple">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-display text-[10px] font-black uppercase tracking-widest text-white/40">
                      Follow the Builds
                    </h4>
                    <p className="text-xs font-medium text-white/70 mt-0.5">
                      Connect on our channels
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {[
                      {
                        icon: Github,
                        label: "GitHub",
                        href: "https://github.com/gobitsnbytes",
                        color: "hover:text-white hover:bg-white/10 hover:border-white/20",
                      },
                      {
                        icon: Linkedin,
                        label: "LinkedIn",
                        href: "https://www.linkedin.com/company/gobitsbytes",
                        color: "hover:text-[#0077b5] hover:bg-[#0077b5]/10 hover:border-[#0077b5]/20",
                      },
                      {
                        icon: Instagram,
                        label: "Instagram",
                        href: "https://www.instagram.com/bitsnbytes.lko",
                        color: "hover:text-[#e1306c] hover:bg-[#e1306c]/10 hover:border-[#e1306c]/20",
                      },
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn active-press"
                        aria-label={social.label}
                      >
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/70 custom-transition icon-hover-effect",
                          social.color
                        )}>
                          <social.icon className="h-5 w-5" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </GlassContainer>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7 h-full">
              
              {/* Main Interactive Contact Container */}
              <GlassContainer className="p-0 h-full overflow-hidden" glowColor="both">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.div
                      key="contact-form"
                      initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      className="p-6 sm:p-8 md:p-10 flex flex-col justify-between h-full w-full"
                    >
                      <div>
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight">
                              Send Message
                            </h3>
                            <p className="text-xs font-semibold text-white/50 tracking-wider mt-1 uppercase">
                              Reach the bits&amp;bytes™ crew
                            </p>
                          </div>
                        </div>

                        <form
                          onSubmit={handleSubmit}
                          className="space-y-5 w-full"
                          id="contact-us-form"
                        >
                          <div className="grid sm:grid-cols-2 gap-5 w-full">
                            {/* Name Field */}
                            <div className="space-y-2 w-full">
                              <Label
                                htmlFor="name"
                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50"
                              >
                                <User className="h-3.5 w-3.5 text-[var(--brand-pink)]" />
                                Name
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                placeholder="Your name"
                                className="h-12 w-full bg-white/5 border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-white/20 focus-visible:outline-none focus-visible:border-[var(--brand-pink)] focus-visible:ring-2 focus-visible:ring-[var(--brand-pink)]/20 focus-visible:shadow-[0_0_15px_rgba(228,90,146,0.15)] transition-all"
                                required
                              />
                            </div>
                            {/* Email Field */}
                            <div className="space-y-2 w-full">
                              <Label
                                htmlFor="email"
                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50"
                              >
                                <Mail className="h-3.5 w-3.5 text-[var(--brand-pink)]" />
                                Email
                              </Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@email.com"
                                className="h-12 w-full bg-white/5 border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-white/20 focus-visible:outline-none focus-visible:border-[var(--brand-pink)] focus-visible:ring-2 focus-visible:ring-[var(--brand-pink)]/20 focus-visible:shadow-[0_0_15px_rgba(228,90,146,0.15)] transition-all"
                                required
                              />
                            </div>
                          </div>
                          
                          {/* Subject Field */}
                          <div className="space-y-2 w-full">
                            <Label
                              htmlFor="subject"
                              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50"
                            >
                              <FileText className="h-3.5 w-3.5 text-[var(--brand-pink)]" />
                              Subject
                            </Label>
                            <Input
                              id="subject"
                              name="subject"
                              placeholder="Reason for reaching out"
                              className="h-12 w-full bg-white/5 border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-white/20 focus-visible:outline-none focus-visible:border-[var(--brand-pink)] focus-visible:ring-2 focus-visible:ring-[var(--brand-pink)]/20 focus-visible:shadow-[0_0_15px_rgba(228,90,146,0.15)] transition-all"
                            />
                          </div>
                          
                          {/* Message Field */}
                          <div className="space-y-2 w-full">
                            <Label
                              htmlFor="message"
                              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50"
                            >
                              <MessageSquare className="h-3.5 w-3.5 text-[var(--brand-pink)]" />
                              Message
                            </Label>
                            <Textarea
                              id="message"
                              name="message"
                              rows={4}
                              placeholder="Tell us what's on your mind..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus-visible:outline-none focus-visible:border-[var(--brand-pink)] focus-visible:ring-2 focus-visible:ring-[var(--brand-pink)]/20 focus-visible:shadow-[0_0_15px_rgba(228,90,146,0.15)] min-h-[110px] resize-none transition-all"
                              required
                            />
                          </div>

                          {/* Viewport-adapted CAPTCHA wrapper to guarantee no layout breakages */}
                          <div className="flex justify-center items-center w-full min-h-[82px] py-1 overflow-hidden">
                            <div className="scale-[0.88] sm:scale-100 origin-center">
                              {mounted && (
                                <HCaptcha
                                  ref={captchaRef}
                                  sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                                  reCaptchaCompat={false}
                                  theme="dark"
                                  onVerify={setCaptchaToken}
                                />
                              )}
                            </div>
                          </div>

                          {/* Action Trigger Button */}
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group w-full h-14 rounded-full bg-[var(--brand-pink)] text-white text-sm font-semibold tracking-wider transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-white/10 cursor-pointer active-press btn-hover-effect shadow-lg shadow-[rgba(151,25,44,0.35)] hover:scale-[1.02] active:scale-[0.97]"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                Send Message
                                <ArrowRight className="h-4 w-4 shrink-0 transition-transform arrow-icon" />
                              </>
                            )}
                          </button>

                          {/* Alert banners for error validation */}
                          <AnimatePresence>
                            {status && status.type === "error" && (
                              <motion.p
                                initial={{ opacity: 0, height: 0, filter: "blur(4px)" }}
                                animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
                                exit={{ opacity: 0, height: 0, filter: "blur(4px)" }}
                                role="alert"
                                aria-live="polite"
                                className="text-xs font-bold text-center p-3.5 rounded-xl overflow-hidden bg-red-500/10 text-red-400 border border-red-500/20"
                              >
                                {status.message}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </form>
                      </div>
                    </motion.div>
                  ) : (
                    /* Success Dashboard State - Adhering to Brand Colors */
                    <motion.div
                      key="success-state"
                      initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                      transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                      className="p-8 sm:p-12 md:p-16 flex flex-col items-center justify-center text-center space-y-6 h-full w-full"
                    >
                      <div className="flex items-center justify-center h-20 w-20 rounded-full bg-[var(--brand-pink)]/10 border border-[var(--brand-pink)]/30 text-[var(--bb-pink)] shadow-[0_0_40px_rgba(151,25,44,0.3)] animate-pulse-glow">
                        <Check className="h-10 w-10" />
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                          Transmission Dispatched
                        </h3>
                        <p className="text-sm sm:text-base text-white/70 max-w-sm mx-auto leading-relaxed font-medium">
                          Your message has been beamed to the bits&amp;bytes™ crew. We&apos;ve logged the request, and we&apos;ll get back to you within 24-48 hours.
                        </p>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={handleResetForm}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--brand-pink)]/20 bg-[var(--brand-pink)]/5 hover:bg-[var(--brand-pink)]/10 hover:border-[var(--brand-pink)]/30 text-xs font-bold uppercase tracking-widest text-[var(--bb-pink)] hover:text-white transition-all cursor-pointer active-press"
                        >
                          Send another transmission
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
