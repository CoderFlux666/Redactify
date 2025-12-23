"use client";

import { motion } from "framer-motion";
import { Copy, Download, RefreshCw } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";

interface RedactionResultProps {
    originalText: string;
    redactedText: string;
    method?: string;
    onReset: () => void;
}

export function RedactionResult({ originalText, redactedText, method, onReset }: RedactionResultProps) {
    const handleCopy = () => {
        navigator.clipboard.writeText(redactedText);
        // Could add a toast notification here
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([redactedText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "redacted_document.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto"
        >
            <GlassCard className="flex flex-col h-[600px]">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">Original Content</h3>
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                        Read Only
                    </span>
                </div>
                <div className="flex-1 overflow-auto p-4 bg-slate-50 rounded-xl border border-slate-100 font-mono text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {originalText || "No content to display."}
                </div>
            </GlassCard>

            <GlassCard className="flex flex-col h-[600px] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-slate-900">Redacted Output</h3>
                        {method && (
                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${method.includes("GPT")
                                ? "bg-purple-100 text-purple-700 border border-purple-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                                }`}>
                                {method}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                            title="Copy to clipboard"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                            title="Download"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-4 bg-white rounded-xl border border-slate-200 font-mono text-sm text-slate-800 leading-relaxed whitespace-pre-wrap shadow-inner">
                    {redactedText ? (
                        redactedText.split(/(\[REDACTED\])/g).map((part, i) =>
                            part === "[REDACTED]" ? (
                                <span key={i} className="bg-black text-black px-1 rounded-sm select-none mx-0.5">
                                    ██████
                                </span>
                            ) : (
                                <span key={i}>{part}</span>
                            )
                        )
                    ) : (
                        <span className="text-slate-400 italic">Processed output will appear here...</span>
                    )}
                </div>
                <div className="mt-6 flex justify-end">
                    <PremiumButton onClick={onReset} variant="outline" icon={<RefreshCw />}>
                        Process Another
                    </PremiumButton>
                </div>
            </GlassCard>
        </motion.div>
    );
}
