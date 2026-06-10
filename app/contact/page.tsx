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
    <div className="relative min-h-screen text-[#120f0a] overflow-hidden bg-transparent">
      {/* Hero Section - Neobrutalist Header */}
      <section className="relative flex items-center justify-center overflow-hidden text-[#120f0a] pt-24 md:pt-32">
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="px-6 py-8 text-center">
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 border-2 border-[#120f0a] bg-[#fc920d] px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a]">
                Contact
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-[#120f0a] uppercase tracking-tight leading-none">
                Let&apos;s build something <br className="hidden sm:block" />{" "}
                together
              </h1>
              <p className="max-w-2xl text-[#413f3b] text-base sm:text-lg font-semibold leading-relaxed">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* Left Column: Connection Cards */}
            <div className="lg:col-span-5 flex flex-col gap-6 h-full justify-between">
              
              {/* Brand & Organization Identity Card */}
              <div className="bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] p-6 md:p-8 flex flex-col gap-4 text-[#120f0a] rounded-none">
                <div className="flex items-center gap-4">
                  {/* Responsive interactive logo monogram based on SVG */}
                  <div className="h-12 w-12 shrink-0 bg-[#fee9cf] rounded-none border-2 border-[#120f0a] flex items-center justify-center shadow-[2px_2px_0px_0px_#120f0a]">
                    <svg viewBox="28 54 146 146" className="w-9 h-9 text-[#120f0a] fill-current" id="svg-logo" xmlns="http://www.w3.org/2000/svg">
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
                    <h3 className="font-display text-lg font-black tracking-tight text-[#120f0a] uppercase">
                      bits&amp;bytes™
                    </h3>
                    <span className="text-[10px] font-black text-[#716f6c] tracking-wider uppercase block">
                      GOBITSNBYTES FOUNDATION
                    </span>
                    <span className="text-[9px] font-mono font-bold text-[#a09f9d] block mt-0.5">
                      CIN: U85500UP2026NPL248652
                    </span>
                  </div>
                </div>
                
                <div className="h-[2px] bg-[#120f0a]/10 w-full my-1" />
                
                <p className="text-sm text-[#413f3b] leading-relaxed font-semibold">
                  bits&amp;bytes™ is an independent, student-led network helping ambitious teenagers build products and get their ideas out into the world. Taste, engineering standards, and high agency guide everything we ship.
                </p>
              </div>

              {/* Direct Contact Info Card */}
              <div className="bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] p-6 md:p-8 text-[#120f0a] rounded-none">
                <h4 className="font-display text-xs font-black uppercase tracking-widest text-[#97192c] mb-5">
                  Direct Channels
                </h4>
                
                <div className="space-y-6">
                  {/* Email Item */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[#120f0a] bg-[#fee9cf] text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] rounded-none">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#716f6c]">
                        Email Address
                      </p>
                      <a
                        href="mailto:hello@gobitsnbytes.org"
                        className="text-base font-black text-[#120f0a] hover:text-[#fc920d] transition-colors break-all mt-0.5 block"
                      >
                        hello@gobitsnbytes.org
                      </a>
                      
                      {/* Copy and Email Buttons */}
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={handleCopyEmail}
                          className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#97192c] hover:text-[#fc920d] transition-colors cursor-pointer"
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
                        <span className="text-[#120f0a]/20 text-xs font-light">|</span>
                        <a
                          href="mailto:hello@gobitsnbytes.org"
                          className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#97192c] hover:text-[#fc920d] transition-colors"
                        >
                          Send Email
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Location Item */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[#120f0a] bg-[#fee9cf] text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] rounded-none">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#716f6c]">
                        HQ Location
                      </p>
                      <p className="text-base font-black text-[#120f0a] mt-0.5">
                        Lucknow, India
                      </p>
                      <p className="text-xs font-semibold text-[#413f3b] mt-0.5">
                        Fiduciary &amp; operational base in UP
                      </p>
                    </div>
                  </div>

                  {/* Timeline Item */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[#120f0a] bg-[#fee9cf] text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] rounded-none">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#716f6c]">
                        Status
                      </p>
                      <p className="text-base font-black text-[#120f0a] mt-0.5">
                        Teen-led since 2025
                      </p>
                      <p className="text-xs font-semibold text-[#413f3b] mt-0.5">
                        Independent student community
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links Card */}
              <div className="bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] p-5 text-[#120f0a] rounded-none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-display text-[10px] font-black uppercase tracking-widest text-[#716f6c]">
                      Follow the Builds
                    </h4>
                    <p className="text-xs font-semibold text-[#413f3b] mt-0.5">
                      Connect on our channels
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {[
                      {
                        icon: Github,
                        label: "GitHub",
                        href: "https://github.com/gobitsnbytes",
                        color: "hover:bg-[#fc920d]",
                      },
                      {
                        icon: Linkedin,
                        label: "LinkedIn",
                        href: "https://www.linkedin.com/company/gobitsbytes",
                        color: "hover:bg-[#fc920d]",
                      },
                      {
                        icon: Instagram,
                        label: "Instagram",
                        href: "https://www.instagram.com/bitsnbytes.lko",
                        color: "hover:bg-[#fc920d]",
                      },
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn"
                        aria-label={social.label}
                      >
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center border-2 border-[#120f0a] bg-white text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none rounded-none cursor-pointer",
                          social.color
                        )}>
                          <social.icon className="h-5 w-5" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7 h-full">
              
              {/* Main Interactive Contact Container */}
              <div className="bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] rounded-none p-0 h-full overflow-hidden text-[#120f0a]">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.div
                      key="contact-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 sm:p-8 md:p-10 flex flex-col justify-between h-full w-full bg-white"
                    >
                      <div>
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="font-display text-2xl font-black text-[#120f0a] uppercase tracking-tight">
                              Send Message
                            </h3>
                            <p className="text-xs font-black text-[#716f6c] tracking-widest mt-1 uppercase">
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
                                className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#120f0a]"
                              >
                                <User className="h-3.5 w-3.5 text-[#97192c]" />
                                Name
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                placeholder="Your name"
                                className="h-12 w-full bg-white border-3 border-[#120f0a] rounded-none px-4 text-sm text-[#120f0a] placeholder:text-[#a09f9d] shadow-[2px_2px_0px_0px_#120f0a] focus-visible:bg-[#fee9cf] focus-visible:border-[#120f0a] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all font-semibold"
                                required
                              />
                            </div>
                            {/* Email Field */}
                            <div className="space-y-2 w-full">
                              <Label
                                htmlFor="email"
                                className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#120f0a]"
                              >
                                <Mail className="h-3.5 w-3.5 text-[#97192c]" />
                                Email
                              </Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@email.com"
                                className="h-12 w-full bg-white border-3 border-[#120f0a] rounded-none px-4 text-sm text-[#120f0a] placeholder:text-[#a09f9d] shadow-[2px_2px_0px_0px_#120f0a] focus-visible:bg-[#fee9cf] focus-visible:border-[#120f0a] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all font-semibold"
                                required
                              />
                            </div>
                          </div>
                          
                          {/* Subject Field */}
                          <div className="space-y-2 w-full">
                            <Label
                              htmlFor="subject"
                              className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#120f0a]"
                            >
                              <FileText className="h-3.5 w-3.5 text-[#97192c]" />
                              Subject
                            </Label>
                            <Input
                              id="subject"
                              name="subject"
                              placeholder="Reason for reaching out"
                              className="h-12 w-full bg-white border-3 border-[#120f0a] rounded-none px-4 text-sm text-[#120f0a] placeholder:text-[#a09f9d] shadow-[2px_2px_0px_0px_#120f0a] focus-visible:bg-[#fee9cf] focus-visible:border-[#120f0a] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all font-semibold"
                            />
                          </div>
                          
                          {/* Message Field */}
                          <div className="space-y-2 w-full">
                            <Label
                              htmlFor="message"
                              className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#120f0a]"
                            >
                              <MessageSquare className="h-3.5 w-3.5 text-[#97192c]" />
                              Message
                            </Label>
                            <Textarea
                              id="message"
                              name="message"
                              rows={4}
                              placeholder="Tell us what's on your mind..."
                              className="w-full bg-white border-3 border-[#120f0a] rounded-none p-4 text-sm text-[#120f0a] placeholder:text-[#a09f9d] shadow-[2px_2px_0px_0px_#120f0a] focus-visible:bg-[#fee9cf] focus-visible:border-[#120f0a] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] min-h-[110px] resize-none transition-all font-semibold"
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
                                  theme="light"
                                  onVerify={setCaptchaToken}
                                />
                              )}
                            </div>
                          </div>

                          {/* Action Trigger Button */}
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 rounded-none bg-[#97192c] text-white border-3 border-[#120f0a] text-sm font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer hover:bg-[#fc920d] hover:text-[#120f0a] flex items-center justify-center gap-2"
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
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                role="alert"
                                aria-live="polite"
                                className="text-xs font-bold text-center p-3.5 rounded-none bg-red-50 border-2 border-red-500 text-red-600"
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
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="p-8 sm:p-12 md:p-16 flex flex-col items-center justify-center text-center space-y-6 h-full w-full bg-white"
                    >
                      <div className="flex items-center justify-center h-20 w-20 border-3 border-[#120f0a] bg-[#fee9cf] text-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] rounded-none">
                        <Check className="h-10 w-10" />
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-display text-2xl sm:text-3xl font-black text-[#120f0a] uppercase tracking-tight">
                          Transmission Dispatched
                        </h3>
                        <p className="text-sm sm:text-base text-[#413f3b] max-w-sm mx-auto leading-relaxed font-semibold">
                          Your message has been beamed to the bits&amp;bytes™ crew. We&apos;ve logged the request, and we&apos;ll get back to you within 24-48 hours.
                        </p>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={handleResetForm}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-none border-2 border-[#120f0a] bg-white hover:bg-[#fc920d] text-xs font-mono font-bold uppercase tracking-wider text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                        >
                          Send another transmission
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
