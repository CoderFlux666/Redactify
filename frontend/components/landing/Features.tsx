"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Scan, Lock, Share2, CheckCircle2, AlertCircle, FileJson, FileText, Download, Shield, ShieldCheck, Settings } from "lucide-react";

const tabs = [
    { id: "scan", label: "Smart Scan", icon: Scan },
    { id: "redact", label: "Auto Redact", icon: Lock },
    { id: "export", label: "Secure Export", icon: Share2 },
];

const features = {
    scan: {
        titlePrefix: "Intelligent",
        titleSuffix: "Context Analysis",
        description: "Beyond simple pattern matching. Our neural networks understand semantic context to distinguish sensitive data with 99.9% precision.",
        points: ["Natural Language Processing", "Multi-language Support", "Custom Entity Training"],
    },
    redact: {
        titlePrefix: "Granular",
        titleSuffix: "Redaction Control",
        description: "Define complex redaction policies with enterprise-grade granularity. Toggle visibility for specific roles and data types.",
        points: ["Preserves Formatting", "Reversible (Admin Only)", "Bulk Processing"],
    },
    export: {
        titlePrefix: "Cryptographic",
        titleSuffix: "Audit Trails",
        description: "Every action is logged in an immutable, cryptographically signed ledger. Ensure full chain-of-custody for compliance.",
        points: ["SHA-256 Verification", "JSON/CSV Reports", "Watermarking"],
    },
};

export function Features() {
    const [activeTab, setActiveTab] = useState<"scan" | "redact" | "export">("scan");

    return (
        <section id="features" className="py-24 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                        Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">secure your data</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Powerful features designed for the modern privacy-first enterprise.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-16">
                    <div className="bg-white p-1.5 rounded-full border border-slate-200 shadow-sm inline-flex relative">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? "text-white"
                                    : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-slate-900 rounded-full -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Feature Content */}
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-8">
                                    <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                                        {features[activeTab].titlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{features[activeTab].titleSuffix}</span>
                                    </h3>
                                </div>
                                <p className="text-xl text-slate-600 leading-relaxed mb-10">
                                    {features[activeTab].description}
                                </p>
                                <ul className="space-y-6">
                                    {features[activeTab].points.map((point, i) => (
                                        <li key={i} className="flex items-start gap-4 text-slate-800 text-lg font-medium group">
                                            <div className="mt-1 w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            </div>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-purple-100/50 rounded-3xl blur-2xl -z-10" />

                        <GlassCard className="p-1 bg-white/60 backdrop-blur-xl border-white/50 shadow-2xl rounded-2xl overflow-hidden aspect-[4/3]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full h-full bg-white rounded-xl border border-slate-100 overflow-hidden relative"
                                >
                                    {activeTab === "scan" && <ScanMockup />}
                                    {activeTab === "redact" && <RedactMockup />}
                                    {activeTab === "export" && <ExportMockup />}
                                </motion.div>
                            </AnimatePresence>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ScanMockup() {
    return (
        <div className="h-full flex flex-col bg-[#F8FAFC] relative overflow-hidden group">
            {/* Scanner Light Effect - Enhanced */}
            <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.6)] z-20 pointer-events-none"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            />

            {/* Grid Background */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 relative z-10 bg-white/50 backdrop-blur-sm border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse relative z-10" />
                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping opacity-20" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-widest">Live Scanner</div>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">ID: SCAN-8X29-V4</div>
                    </div>
                </div>
                <div className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-sm text-[10px] font-mono text-slate-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Active
                </div>
            </div>

            {/* Scanning Interface - Compact Layout */}
            <div className="flex-1 p-6 space-y-3 relative z-10 overflow-y-auto custom-scrollbar">
                {/* Customer ID Card */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-xl border border-blue-100/50 p-3 shadow-sm relative overflow-hidden cursor-default transition-all hover:shadow-md hover:border-blue-200"
                >
                    <div className="absolute top-0 left-0 w-0.5 h-full bg-blue-500" />
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Customer ID</span>
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">98%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="font-mono text-sm text-blue-600 font-medium">C-98234</div>
                        <div className="text-[9px] text-slate-400 font-mono">Ln 42</div>
                    </div>
                </motion.div>

                {/* Phone Number Card - Alert */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-xl border border-red-100 p-3 shadow-sm relative overflow-hidden cursor-default transition-all hover:shadow-md"
                >
                    <div className="absolute top-0 left-0 w-0.5 h-full bg-red-500" />
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</span>
                        <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="font-mono text-sm text-slate-700 font-medium">+1 (555) 019-2834</div>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            PII
                        </div>
                    </div>
                </motion.div>

                {/* Email Address Card */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm relative overflow-hidden cursor-default transition-all hover:shadow-md hover:border-slate-200"
                >
                    <div className="absolute top-0 left-0 w-0.5 h-full bg-slate-300" />
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email</span>
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">95%</span>
                    </div>
                    <div className="font-mono text-sm text-slate-600 font-medium">sarah.j@example.com</div>
                </motion.div>
            </div>

            {/* Terminal Footer - Compact */}
            <div className="bg-[#0F172A] p-3 border-t border-slate-800 relative z-10">
                <div className="flex items-center justify-between mb-2 opacity-50">
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                    <div className="text-[9px] font-mono text-slate-500">terminal</div>
                </div>
                <div className="font-mono text-[10px] text-slate-400 space-y-1">
                    <div className="flex gap-2 items-center">
                        <span className="text-blue-400">➜</span>
                        <span className="text-slate-300">analyzing_stream.ts</span>
                    </div>
                    <div className="h-0.5 w-full bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function RedactMockup() {
    const [rules, setRules] = useState([
        { id: 1, label: "Social Security", desc: "Pattern: \\d{3}-\\d{2}-\\d{4}", active: true, level: "High" },
        { id: 2, label: "Credit Cards", desc: "Pattern: \\d{4}-\\d{4}-\\d{4}-\\d{4}", active: true, level: "High" },
        { id: 3, label: "Email Addresses", desc: "Detects personal & work emails", active: false, level: "Medium" },
        { id: 4, label: "Phone Numbers", desc: "International format support", active: true, level: "Medium" },
    ]);

    const toggleRule = (id: number) => {
        setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
    };

    return (
        <div className="h-full flex flex-col bg-[#F8FAFC] p-6">
            {/* Header */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <Settings className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-900">Redaction Rules</div>
                        <div className="text-[10px] text-slate-500 font-medium">Global Policy Settings</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-bold rounded-full border border-green-100 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                        ACTIVE
                    </span>
                </div>
            </div>

            {/* Rules List */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                {rules.map((rule) => (
                    <motion.div
                        key={rule.id}
                        layout
                        onClick={() => toggleRule(rule.id)}
                        className={`bg-white p-3 rounded-lg border shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-200 cursor-pointer ${rule.active ? "border-blue-200" : "border-slate-100"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${rule.active ? "bg-slate-900" : "bg-slate-200"}`}>
                                <motion.div
                                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                                    animate={{ x: rule.active ? 16 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </div>
                            <div>
                                <div className={`text-xs font-bold transition-colors ${rule.active ? "text-slate-900" : "text-slate-500"}`}>{rule.label}</div>
                                <div className="text-[9px] text-slate-400 font-medium">{rule.desc}</div>
                            </div>
                        </div>
                        <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${rule.level === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                            {rule.level}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="text-[10px] text-slate-400 font-medium">Last updated: Just now</div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Reset</button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 text-[10px] font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-lg shadow-slate-900/20"
                    >
                        Save Changes
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

function ExportMockup() {
    return (
        <div className="h-full flex items-center justify-center bg-[#F8FAFC] p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-[320px] bg-white/80 backdrop-blur-xl rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/50 p-6 text-center relative z-10 ring-1 ring-slate-100">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-16 h-16 bg-gradient-to-tr from-green-50 to-emerald-50 rounded-[20px] flex items-center justify-center mx-auto mb-4 ring-4 ring-white shadow-lg shadow-green-500/10 relative"
                >
                    <Shield className="w-8 h-8 text-green-500 drop-shadow-sm relative z-10" strokeWidth={1.5} />
                    <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                </motion.div>

                <h4 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">Export Ready</h4>
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-mono text-slate-500">AES-256</span>
                    <span className="px-1.5 py-0.5 bg-green-50 border border-green-100 rounded text-[9px] font-mono text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
                    </span>
                </div>

                <div className="space-y-3">
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50/80 rounded-xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-300 group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-50/50 rounded-lg border border-red-100/50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300">
                                <FileText className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Redacted PDF</div>
                                <div className="text-[10px] text-slate-400 font-medium mt-0.5">2.4 MB • Signed</div>
                            </div>
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 shadow-sm">
                            <Download className="w-4 h-4" strokeWidth={2} />
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50/80 rounded-xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-300 group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50/50 rounded-lg border border-amber-100/50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-300">
                                <FileJson className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Audit Log</div>
                                <div className="text-[10px] text-slate-400 font-medium mt-0.5">JSON Format</div>
                            </div>
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 shadow-sm">
                            <Download className="w-4 h-4" strokeWidth={2} />
                        </div>
                    </motion.button>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-center gap-2 text-[9px] text-slate-400 font-mono">
                    <ShieldCheck className="w-3 h-3 text-green-500" />
                    <span>SHA-256: 8f43...9a21</span>
                </div>
            </div>
        </div>
    );
}
