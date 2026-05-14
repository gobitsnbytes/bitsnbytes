"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { QnAChatInterface } from "@/components/qna-chat-interface";

export default function QnAPage() {
    const sendSuggestedPrompt = (prompt: string) => {
        if (typeof window === "undefined") return;
        window.dispatchEvent(new CustomEvent("bb:qna-prompt", { detail: prompt }));
    };

    return (
        <main
            className="flex flex-col w-full px-0 pt-24 sm:pt-28 lg:pt-32"
            aria-label="Bits and Bytes QnA Assistant"
        >
            <section className="w-full">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
                        <div className="space-y-5">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(151,25,44,0.2)] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/80">
                                QnA Assistant
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
                                Ask what matters, get the real Bits&Bytes answer.
                            </h1>
                            <p className="text-base sm:text-lg text-white/80 max-w-2xl">
                                This is the official QnA layer for sponsors, educators, and builders. We answer from
                                public sources in this project, fast and without fluff.
                            </p>
                            <div className="grid gap-3 sm:grid-cols-3 text-sm text-white/70">
                                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                    Verified from public docs
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                    Built for sponsor diligence
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                    Join-ready handoff
                                </div>
                            </div>
                        </div>
                        <aside className="rounded-2xl border border-white/10 bg-[rgba(18,8,12,0.8)] p-5 shadow-[0_20px_60px_rgba(8,4,6,0.6)]">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                                        Sponsor Flow
                                    </p>
                                    <h2 className="mt-2 text-xl font-semibold text-white">
                                        Want a direct convo?
                                    </h2>
                                    <p className="mt-2 text-sm text-white/70">
                                        Ask here, then jump to a sponsor-ready contact route with context.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center justify-between rounded-xl bg-[var(--brand-pink)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(151,25,44,0.35)] transition-transform hover:translate-y-[-1px]"
                                    >
                                        Contact the team
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href="/join"
                                        className="inline-flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 transition-colors hover:border-white/25 hover:bg-white/10"
                                    >
                                        Join the crew
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <section className="w-full pb-12 sm:pb-16">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
                        <QnAChatInterface />
                        <aside className="rounded-2xl border border-white/10 bg-[rgba(16,8,11,0.78)] p-5 text-white/80 shadow-[0_18px_50px_rgba(8,4,6,0.55)]">
                            <div className="space-y-5">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                                        How it works
                                    </p>
                                    <ul className="mt-3 space-y-2 text-sm">
                                        <li>Ask anything about events, team, and partnerships.</li>
                                        <li>Answers are grounded in public project sources.</li>
                                        <li>Follow prompts to jump into join or sponsor steps.</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                                        Suggested first asks
                                    </p>
                                    <div className="mt-3 space-y-2">
                                        {[
                                            "What makes Bits&Bytes different?",
                                            "Show me partner events and outcomes.",
                                            "How do sponsors get involved?",
                                        ].map((prompt) => (
                                            <button
                                                key={prompt}
                                                type="button"
                                                onClick={() => sendSuggestedPrompt(prompt)}
                                                className="w-full text-left rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition-colors hover:border-[rgba(151,25,44,0.6)] hover:bg-[rgba(151,25,44,0.18)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-pink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0608]"
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    )
}
