"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Laptop, Cloud, Shield, Layers,
    Brain, Database, HardDrive, Zap,
    Globe, Lock, Activity, Server,
    Hexagon, Box, Cpu
} from "lucide-react";

const items = [
    {
        id: "client",
        title: "CLIENT_INTERFACE",
        subtitle: "WEB3_READY",
        description: "Responsive dApp-like experience across all devices.",
        icon: Laptop,
        color: "from-[#00F0FF] to-[#00F0FF]",
        colSpan: "md:col-span-2",
        delay: 0.1
    },
    {
        id: "gateway",
        title: "API_GATEWAY",
        subtitle: "EDGE_NETWORK",
        description: "Global load balancing with <10ms latency.",
        icon: Cloud,
        color: "from-[#7000FF] to-[#7000FF]",
        colSpan: "md:col-span-1",
        delay: 0.2
    },
    {
        id: "auth",
        title: "SECURE_AUTH",
        subtitle: "ZERO_TRUST",
        description: "Decentralized identity management protocols.",
        icon: Shield,
        color: "from-[#FF003C] to-[#FF003C]",
        colSpan: "md:col-span-1",
        delay: 0.3
    },
    {
        id: "queue",
        title: "EVENT_BUS",
        subtitle: "ASYNC_PIPE",
        description: "High-throughput message queuing system.",
        icon: Layers,
        color: "from-[#FA00FF] to-[#FA00FF]",
        colSpan: "md:col-span-2",
        delay: 0.4
    },
    {
        id: "ai",
        title: "NEURAL_ENGINE",
        subtitle: "AI_MODEL_V2",
        description: "GPU-accelerated inference for real-time processing.",
        icon: Brain,
        color: "from-[#00F0FF] to-[#7000FF]",
        colSpan: "md:col-span-2",
        delay: 0.5
    },
    {
        id: "db",
        title: "DATA_VAULT",
        subtitle: "IMMUTABLE",
        description: "Acid-compliant storage with cryptographic verification.",
        icon: Database,
        color: "from-[#39FF14] to-[#39FF14]",
        colSpan: "md:col-span-1",
        delay: 0.6
    },
    {
        id: "storage",
        title: "IPFS_STORAGE",
        subtitle: "DISTRIBUTED",
        description: "Encrypted object storage with global redundancy.",
        icon: HardDrive,
        color: "from-[#FA00FF] to-[#00F0FF]",
        colSpan: "md:col-span-3",
        delay: 0.7
    }
];

export function ArchitectureWorkflow() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - left,
            y: e.clientY - top,
        });
    };
    return (
        <section
            className="py-32 bg-[#050505] relative overflow-hidden font-sans group"
            onMouseMove={handleMouseMove}
        >
            {/* Infinity Vertices & Spotlight Effect */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 240, 255, 0.15), transparent 40%)`
                }}
            />

            {/* Interactive "Vertices" (Dots) */}
            <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '4rem 4rem',
                maskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`
            }} />

            {/* Cyberpunk Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* Ambient Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
                            <span className="text-sm font-mono text-[#00F0FF] tracking-widest uppercase">System Architecture v2.0</span>
                        </div>
                        <h2 className="text-6xl md:text-9xl font-bold text-white mb-8 tracking-tighter font-display uppercase leading-none">
                            Digital <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FA00FF] to-[#00F0FF] animate-gradient bg-300%">Infrastructure</span>
                        </h2>
                        <p className="text-slate-400 max-w-3xl mx-auto text-xl font-mono tracking-tight leading-relaxed">
                            // DECENTRALIZED_SCALING_PROTOCOLS_INITIATED
                            <br />
                            <span className="opacity-50">Next-gen architecture for the web3 era.</span>
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: item.delay, ease: [0.22, 1, 0.36, 1] }}
                            className={`${item.colSpan} group relative bg-black/40 border border-white/10 rounded-[2.5rem] p-10 overflow-hidden hover:border-white/20 transition-all duration-500`}
                        >
                            {/* Holographic Gradient Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />

                            {/* Neon Border Glow */}
                            <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/10 group-hover:ring-white/30 transition-all duration-700" />

                            {/* Glitch Effect Line */}
                            <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r ${item.color} -translate-x-full group-hover:animate-scan`} />

                            <div className="relative z-10 flex flex-col h-full justify-between gap-10">
                                <div className="flex justify-between items-start">
                                    <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                        <item.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                                    </div>
                                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                        <span className={`text-xs font-mono tracking-widest uppercase bg-gradient-to-r ${item.color} bg-clip-text text-transparent font-bold`}>
                                            {item.subtitle}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-3 tracking-tight uppercase group-hover:text-[#00F0FF] transition-colors duration-500">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-400 text-base font-mono leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
