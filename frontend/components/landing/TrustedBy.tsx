"use client";

import { motion } from "framer-motion";

const companies = [
    "Acme Corp", "GlobalBank", "SecureNet", "DataGuard", "PrivacyFlow",
    "TechGiant", "CloudSafe", "CyberShield", "TrustWorks", "SafeHaven"
];

export function TrustedBy() {
    return (
        <section className="py-24 border-b border-slate-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Trusted by security teams at
                </p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-24 px-8">
                    {companies.map((company, i) => (
                        <span
                            key={i}
                            className="text-4xl md:text-5xl font-bold text-slate-200 hover:text-slate-900 transition-colors cursor-default select-none"
                        >
                            {company}
                        </span>
                    ))}
                </div>

                <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-24 px-8">
                    {companies.map((company, i) => (
                        <span
                            key={i}
                            className="text-4xl md:text-5xl font-bold text-slate-200 hover:text-slate-900 transition-colors cursor-default select-none"
                        >
                            {company}
                        </span>
                    ))}
                </div>

                {/* Fade edges */}
                <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-white to-transparent z-10" />
            </div>
        </section>
    );
}
