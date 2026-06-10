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
            className="flex flex-col w-full px-0 pt-24 sm:pt-28 lg:pt-32 pb-16"
            aria-label="bits&bytes™ QnA Assistant"
        >
            <section className="w-full">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
                        <div className="space-y-5">
                            <span className="inline-flex items-center gap-2 border-2 border-[#120f0a] bg-[#97192c] text-white px-4 py-1 text-[0.65rem] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#120f0a] rounded-none">
                                QnA Assistant
                            </span>
                            <h1 className="text-4xl sm:text-5xl font-black text-[#120f0a] uppercase tracking-tight leading-none">
                                Ask what matters, get the real bits&bytes™ answer.
                            </h1>
                            <p className="text-base sm:text-lg text-[#413f3b] max-w-2xl font-semibold">
                                This is the official QnA layer for sponsors, educators, and builders. We answer from
                                public sources in this project, fast and without fluff.
                            </p>
                            <div className="grid gap-4 sm:grid-cols-3 text-sm text-[#120f0a]">
                                <div className="bg-white border-2 border-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a] px-4 py-3 font-bold uppercase rounded-none">
                                    Verified from public docs
                                </div>
                                <div className="bg-white border-2 border-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a] px-4 py-3 font-bold uppercase rounded-none">
                                    Built for sponsor diligence
                                </div>
                                <div className="bg-white border-2 border-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a] px-4 py-3 font-bold uppercase rounded-none">
                                    Join-ready handoff
                                </div>
                            </div>
                        </div>
                        <aside className="bg-white border-4 border-[#120f0a] p-6 shadow-[8px_8px_0px_0px_#120f0a] rounded-none">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-[#97192c] font-black">
                                        Sponsor Flow
                                    </p>
                                    <h2 className="mt-2 text-xl font-black text-[#120f0a] uppercase">
                                        Want a direct convo?
                                    </h2>
                                    <p className="mt-2 text-sm text-[#413f3b] font-semibold">
                                        Ask here, then jump to a sponsor-ready contact route with context.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center justify-between bg-[#e45a92] text-white border-3 border-[#120f0a] px-4 py-3 text-sm font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all rounded-none cursor-pointer"
                                    >
                                        Contact the team
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href="/join"
                                        className="inline-flex items-center justify-between bg-white text-[#120f0a] border-3 border-[#120f0a] px-4 py-3 text-sm font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all rounded-none cursor-pointer"
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
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
                        <QnAChatInterface />
                        <aside className="bg-[#fee9cf] border-4 border-[#120f0a] p-6 shadow-[8px_8px_0px_0px_#120f0a] rounded-none text-[#120f0a]">
                            <div className="space-y-5">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-[#97192c] font-black">
                                        How it works
                                    </p>
                                    <ul className="mt-3 space-y-2 text-sm font-semibold">
                                        <li className="flex gap-2"><span>•</span> Ask anything about events, team, and partnerships.</li>
                                        <li className="flex gap-2"><span>•</span> Answers are grounded in public project sources.</li>
                                        <li className="flex gap-2"><span>•</span> Follow prompts to jump into join or sponsor steps.</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-[#97192c] font-black">
                                        Suggested asks
                                    </p>
                                    <div className="mt-3 space-y-3">
                                        {[
                                            "What makes bits&bytes™ different?",
                                            "Show me partner events and outcomes.",
                                            "How do sponsors get involved?",
                                        ].map((prompt) => (
                                            <button
                                                key={prompt}
                                                type="button"
                                                onClick={() => sendSuggestedPrompt(prompt)}
                                                className="w-full text-left bg-white border-2 border-[#120f0a] px-3 py-2.5 text-xs text-[#120f0a] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#120f0a] hover:bg-[#fee9cf] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#120f0a] transition-all rounded-none cursor-pointer"
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
