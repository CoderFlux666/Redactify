"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Layers, Code2, Users, Sparkles } from "lucide-react";

export const ScaleSection = () => {
    const features = [
        {
            title: "Automated Workflows",
            description: "Trigger redaction automatically. Redactify sits on top of your stack, keeping everything moving.",
            icon: <Zap className="w-8 h-8 text-cyan-400" />,
            gradient: "from-cyan-500/20 to-blue-500/20",
            border: "group-hover:border-cyan-500/50",
            glow: "group-hover:shadow-cyan-500/20"
        },
        {
            title: "Bulk Processing",
            description: "Process hours of video or gigabytes of audio in parallel without breaking a sweat.",
            icon: <Layers className="w-8 h-8 text-purple-400" />,
            gradient: "from-purple-500/20 to-pink-500/20",
            border: "group-hover:border-purple-500/50",
            glow: "group-hover:shadow-purple-500/20"
        },
        {
            title: "Developer API",
            description: "Embed our engine into your dashboard, product, or background services with just a few lines of code.",
            icon: <Code2 className="w-8 h-8 text-emerald-400" />,
            gradient: "from-emerald-500/20 to-teal-500/20",
            border: "group-hover:border-emerald-500/50",
            glow: "group-hover:shadow-emerald-500/20"
        },
        {
            title: "Secure Collaboration",
            description: "Invite your team with granular permissions. Share redacted assets securely across your organization.",
            icon: <Users className="w-8 h-8 text-amber-400" />,
            gradient: "from-amber-500/20 to-orange-500/20",
            border: "group-hover:border-amber-500/50",
            glow: "group-hover:shadow-amber-500/20"
        }
    ];

    return (
        <section className="py-12 bg-white">
            <div className="max-w-[98%] mx-auto">
                <div className="relative rounded-[2.5rem] overflow-hidden border border-black/5 bg-black py-24 md:py-32 shadow-2xl">
                    {/* Dynamic Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black" />

                    {/* Animated Orbs */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
                    </div>

                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                        {/* Header */}
                        <div className="text-center mb-24">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
                            >
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm font-medium text-slate-300">Next-Gen Infrastructure</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6"
                            >
                                Scale Without <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient-x">
                                    Limits
                                </span>
                            </motion.h2>

                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                Built for the decentralized future. Process millions of files with our distributed, high-performance redaction engine.
                            </p>
                        </div>

                        {/* NFT Style Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className={`group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all duration-500`}
                                >
                                    {/* Inner Card */}
                                    <div className="relative h-full bg-black/80 backdrop-blur-xl rounded-[1.3rem] p-8 border border-white/10 group-hover:border-white/20 transition-colors overflow-hidden">

                                        {/* Hover Gradient Blob */}
                                        <div className={`absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br ${feature.gradient} blur-[60px] group-hover:opacity-100 opacity-0 transition-opacity duration-500`} />

                                        {/* Icon */}
                                        <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                            {feature.icon}
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                                            {feature.title}
                                        </h3>

                                        <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors">
                                            {feature.description}
                                        </p>

                                        {/* Bottom Glow Line */}
                                        <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};
