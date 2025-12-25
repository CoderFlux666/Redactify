"use client";

import { ArrowRight, CheckCircle, Bot } from "lucide-react";

export function TerminalLog() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Description */}
            <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100">
                    <Bot className="w-4 h-4" />
                    <span>Enterprise Intelligence</span>
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                        Intelligent Data <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Sanitization & Anonymization</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Automatically detect and redact sensitive PII from your training datasets. Our AI understands context to replace entities with realistic synthetic data—names, emails, and phone numbers—while keeping the semantic structure intact.
                    </p>
                </div>

                <div className="space-y-4">
                    {[
                        "Context-aware PII detection using NLP",
                        "Preserves semantic integrity for model training",
                        "Enterprise-grade encryption & audit logging"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                <CheckCircle className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-slate-700 font-medium">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Terminal */}
            <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-700" />

                <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden aspect-video flex flex-col font-mono text-sm">
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
                        </div>
                        <div className="text-xs text-slate-500 font-medium opacity-75">cleaning_pipeline.py — zsh</div>
                        <div className="w-10" /> {/* Spacer for centering */}
                    </div>

                    {/* Terminal Content */}
                    <div className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                        <div className="flex gap-2 items-center">
                            <span className="text-green-400 font-bold">➜</span>
                            <span className="text-blue-400 font-bold">~</span>
                            <span className="text-slate-300">python clean_dataset.py --input raw_data.csv --mode strict</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex gap-3 text-slate-400">
                                <span className="text-blue-500">[INFO]</span>
                                <span>Initializing Presidio Analyzer Engine...</span>
                            </div>
                            <div className="flex gap-3 text-slate-400">
                                <span className="text-blue-500">[INFO]</span>
                                <span>Loaded NLP model: <span className="text-yellow-400">en_core_web_lg</span></span>
                            </div>
                            <div className="flex gap-3 text-slate-400">
                                <span className="text-blue-500">[INFO]</span>
                                <span>Scanning 1,000,000 rows for PII...</span>
                            </div>
                        </div>

                        <div className="space-y-3 pl-2 border-l-2 border-slate-800 my-4">
                            <div className="p-3 bg-slate-900/50 rounded border border-slate-800/50 hover:border-slate-700 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Detected Entity: PERSON</span>
                                    <span className="text-[10px] text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">98.5% Confidence</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-red-400 line-through decoration-red-400/50">Sarah Jenkins</span>
                                    <ArrowRight className="w-3 h-3 text-slate-600" />
                                    <span className="text-green-400 font-medium">Emily Davis</span>
                                </div>
                            </div>

                            <div className="p-3 bg-slate-900/50 rounded border border-slate-800/50 hover:border-slate-700 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Detected Entity: EMAIL_ADDRESS</span>
                                    <span className="text-[10px] text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">99.9% Confidence</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-red-400 line-through decoration-red-400/50">sarah@gmail.com</span>
                                    <ArrowRight className="w-3 h-3 text-slate-600" />
                                    <span className="text-green-400 font-medium">emily.d@example.org</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 items-center pt-2">
                            <span className="text-green-500">✔</span>
                            <span className="text-slate-200">Cleaning Complete.</span>
                            <span className="text-slate-500">Saved to <span className="text-slate-400 underline decoration-slate-700 underline-offset-2">cleaned_data.csv</span> (452ms)</span>
                        </div>

                        <div className="flex gap-2 items-center animate-pulse">
                            <span className="text-green-400 font-bold">➜</span>
                            <span className="text-blue-400 font-bold">~</span>
                            <span className="w-2 h-4 bg-slate-500" />
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-0.5 bg-slate-800 w-full">
                        <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full animate-[shimmer_2s_infinite]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
