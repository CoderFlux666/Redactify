"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, FileText } from "lucide-react";
import Link from "next/link";

const badges = [
    { icon: Shield, text: "PII Protection", color: "bg-blue-100 text-blue-700" },
    { icon: Zap, text: "Instant Redaction", color: "bg-purple-100 text-purple-700" },
    { icon: FileText, text: "PDF & Docx", color: "bg-indigo-100 text-indigo-700" },
];

export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10" />

            <div className="max-w-5xl mx-auto text-center flex flex-col items-center flex-1 justify-center px-6">
                {/* Floating Badges */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {badges.map((badge, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${badge.color} border border-white/50 shadow-sm`}
                        >
                            <badge.icon className="w-4 h-4" />
                            {badge.text}
                        </motion.div>
                    ))}
                </div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6"
                >
                    Secure your Documents with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
                        Intelligent Redaction
                    </span>
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed"
                >
                    The only way to ensure 100% compliance and privacy.
                    Don't rely on manual edits, start using Redactify's context-aware AI today.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-4"
                >
                    <Link href="/dashboard">
                        <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2">
                            Get Started for Free <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                    <button className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all">
                        View Demo
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
