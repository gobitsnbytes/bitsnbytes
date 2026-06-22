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
            className="flex flex-col w-full px-0 pt-20 sm:pt-24 lg:pt-28 pb-4 bg-[#faf8f5] dark:bg-[#120f0a] text-[#120f0a] dark:text-[#faf8f5] transition-colors duration-300 transform scale-110 origin-top-left min-h-screen lg:h-full lg:min-h-0 lg:overflow-hidden"
            aria-label="bits&bytes™ QnA Assistant"
        >
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 h-full flex flex-col lg:min-h-0 lg:overflow-hidden pb-4">
                <div className="grid gap-6 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr] items-stretch h-full lg:min-h-0 lg:overflow-hidden pb-4">
                    {/* LEFT COLUMN: Header, badges, flow cards (stacked order-2 on mobile, lg:order-1 on desktop) */}
                    <div className="flex flex-col gap-4 lg:overflow-y-auto pr-0 lg:pr-2 lg:pb-6 custom-scrollbar order-2 lg:order-1">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 border border-[#120f0a] dark:border-[#faf8f5] bg-[#faf8f5] dark:bg-[#120f0a] px-2.5 py-0.5 text-[9px] font-mono tracking-widest text-[#120f0a] dark:text-[#faf8f5] select-none rounded-none w-fit">
                                <span className="h-1.5 w-1.5 bg-[#97192c] block animate-pulse" />
                                QnA Assistant
                            </div>
                            <h1 className="text-xl sm:text-2xl font-normal font-accent-sans text-[#120f0a] dark:text-[#faf8f5] uppercase tracking-tight leading-[0.95]">
                                Ask what matters, get the real bits&bytes™ answer.
                            </h1>
                            <p className="text-xs text-[#120f0a]/80 dark:text-[#faf8f5]/80 font-serif-brand leading-relaxed">
                                This is the official QnA layer for sponsors, educators, and builders. We answer from
                                public sources in this project, fast and without fluff.
                            </p>
                        </div>

                        {/* Badges stacked */}
                        <div className="grid gap-2 grid-cols-1 text-[9px] sm:text-[10px] text-[#120f0a] dark:text-[#faf8f5]">
                            <div className="bg-[#faf8f5] dark:bg-[#120f0a] border border-[#120f0a]/15 dark:border-[#faf8f5]/15 px-3 py-1.5 font-mono uppercase tracking-wider rounded-none relative select-none">
                                <span className="absolute top-1 right-2 text-[5px] font-mono text-[#120f0a]/30 dark:text-[#faf8f5]/30">[VERIFY_01]</span>
                                Verified from public docs
                            </div>
                            <div className="bg-[#faf8f5] dark:bg-[#120f0a] border border-[#120f0a]/15 dark:border-[#faf8f5]/15 px-3 py-1.5 font-mono uppercase tracking-wider rounded-none relative select-none">
                                <span className="absolute top-1 right-2 text-[5px] font-mono text-[#120f0a]/30 dark:text-[#faf8f5]/30">[VERIFY_02]</span>
                                Built for sponsor diligence
                            </div>
                            <div className="bg-[#faf8f5] dark:bg-[#120f0a] border border-[#120f0a]/15 dark:border-[#faf8f5]/15 px-3 py-1.5 font-mono uppercase tracking-wider rounded-none relative select-none">
                                <span className="absolute top-1 right-2 text-[5px] font-mono text-[#120f0a]/30 dark:text-[#faf8f5]/30">[VERIFY_03]</span>
                                Join-ready handoff
                            </div>
                        </div>

                        {/* Sponsor Flow Card */}
                        <aside className="bg-[#faf8f5] dark:bg-[#120f0a] border border-[#120f0a]/15 dark:border-[#faf8f5]/15 p-3 rounded-none relative select-none">
                            <span className="absolute top-2 right-3 text-[7px] font-mono text-[#120f0a]/30 dark:text-[#faf8f5]/30">[FLOW_01]</span>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-[9px] font-mono uppercase tracking-widest text-[#97192c] font-bold">
                                        Sponsor Flow
                                    </p>
                                    <h2 className="mt-0.5 text-xs sm:text-sm font-normal font-accent-sans text-[#120f0a] dark:text-[#faf8f5] uppercase tracking-tight leading-none">
                                        Want a direct convo?
                                    </h2>
                                    <p className="mt-1 text-[10px] text-[#120f0a]/75 dark:text-[#faf8f5]/75 font-serif-brand leading-relaxed">
                                        Ask here, then jump to a sponsor-ready contact route with context.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center justify-between border border-[#120f0a] dark:border-[#faf8f5] bg-[#97192c] text-white px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-transparent hover:text-[#120f0a] dark:hover:text-[#faf8f5] hover:border-[#120f0a] dark:hover:border-[#faf8f5] transition-all duration-200 rounded-none cursor-pointer active:scale-[0.98]"
                                    >
                                        Contact the team
                                        <ArrowRight className="h-3 w-3" />
                                    </Link>
                                    <Link
                                        href="/join"
                                        className="inline-flex items-center justify-between border border-[#120f0a] dark:border-[#faf8f5] bg-transparent text-[#120f0a] dark:text-[#faf8f5] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-[#120f0a] dark:hover:bg-[#faf8f5] hover:text-[#faf8f5] dark:hover:text-[#120f0a] transition-all duration-200 rounded-none cursor-pointer active:scale-[0.98]"
                                    >
                                        Join the crew
                                        <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </aside>

                        {/* How it works & Suggested Asks */}
                        <aside className="bg-[#faf8f5] dark:bg-[#120f0a] border border-[#120f0a]/15 dark:border-[#faf8f5]/15 p-3 rounded-none text-[#120f0a] dark:text-[#faf8f5] relative select-none">
                            <span className="absolute top-2 right-3 text-[7px] font-mono text-[#120f0a]/30 dark:text-[#faf8f5]/30">[INFO_02]</span>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[9px] font-mono uppercase tracking-widest text-[#97192c] font-bold">
                                        How it works
                                    </p>
                                    <ul className="mt-1 space-y-1 text-[10px] font-serif-brand text-[#120f0a]/85 dark:text-[#faf8f5]/85 leading-normal">
                                        <li className="flex gap-1"><span>•</span> Ask about events, team, and partnerships.</li>
                                        <li className="flex gap-1"><span>•</span> Answers are grounded in public project sources.</li>
                                        <li className="flex gap-1"><span>•</span> Follow prompts to jump into join or sponsor steps.</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-[9px] font-mono uppercase tracking-widest text-[#97192c] font-bold">
                                        Suggested asks
                                    </p>
                                    <div className="mt-1 space-y-1">
                                        {[
                                            "What makes bits&bytes™ different?",
                                            "Show me partner events and outcomes.",
                                            "How do sponsors get involved?",
                                        ].map((prompt) => (
                                            <button
                                                key={prompt}
                                                type="button"
                                                onClick={() => sendSuggestedPrompt(prompt)}
                                                className="w-full text-left bg-[#faf8f5] dark:bg-[#120f0a] border border-[#120f0a]/15 dark:border-[#faf8f5]/15 px-2 py-0.5 text-[10px] text-[#120f0a] dark:text-[#faf8f5] font-mono font-bold uppercase tracking-tight hover:border-[#120f0a] dark:hover:border-[#faf8f5] transition-all rounded-none cursor-pointer"
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* RIGHT COLUMN: Chat box (order-1 on mobile, lg:order-2 on desktop) */}
                    <div className="flex flex-col h-full lg:min-h-0 lg:overflow-hidden order-1 lg:order-2">
                        <QnAChatInterface className="h-full lg:h-full lg:min-h-0" />
                    </div>
                </div>
            </div>
        </main>
    );
}
