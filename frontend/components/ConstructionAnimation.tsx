"use client";

import { motion } from "framer-motion";

export function ConstructionAnimation() {
    return (
        <div className="w-full h-96 relative bg-slate-50 overflow-hidden rounded-xl border border-slate-200">
            <svg
                viewBox="0 0 800 400"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid slice"
            >
                {/* Background City Skyline */}
                <g className="opacity-20 text-slate-400">
                    <path d="M100,400 L100,250 L200,250 L200,400 Z" fill="currentColor" />
                    <path d="M250,400 L250,180 L350,180 L350,400 Z" fill="currentColor" />
                    <path d="M400,400 L400,220 L550,220 L550,400 Z" fill="currentColor" />
                    <path d="M600,400 L600,280 L750,280 L750,400 Z" fill="currentColor" />
                    <path d="M50,400 L50,300 L120,300 L120,400 Z" fill="currentColor" />
                </g>

                {/* Ground */}
                <rect x="0" y="380" width="800" height="20" fill="#e2e8f0" />

                {/* Billboard */}
                <g transform="translate(150, 200)">
                    {/* Legs */}
                    <rect x="40" y="100" width="10" height="80" fill="#334155" />
                    <rect x="150" y="100" width="10" height="80" fill="#334155" />
                    {/* Cross bracing */}
                    <path d="M40,120 L160,160" stroke="#334155" strokeWidth="2" />
                    <path d="M40,160 L160,120" stroke="#334155" strokeWidth="2" />

                    {/* Board */}
                    <rect x="0" y="0" width="200" height="100" fill="white" stroke="#334155" strokeWidth="4" />
                    <rect x="10" y="10" width="180" height="80" fill="#f8fafc" stroke="#334155" strokeWidth="2" />

                    {/* Text */}
                    <text x="100" y="55" textAnchor="middle" className="text-2xl font-black fill-slate-800" style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '24px' }}>
                        COMING SOON
                    </text>

                    {/* Lights */}
                    <circle cx="20" cy="-5" r="5" fill="#334155" />
                    <circle cx="180" cy="-5" r="5" fill="#334155" />
                </g>

                {/* Crane */}
                <g transform="translate(500, 150)">
                    {/* Base */}
                    <rect x="50" y="200" width="100" height="30" fill="#334155" rx="5" />
                    {/* Wheels/Tracks */}
                    <circle cx="65" cy="230" r="10" fill="#475569" stroke="#334155" strokeWidth="2" />
                    <circle cx="90" cy="230" r="10" fill="#475569" stroke="#334155" strokeWidth="2" />
                    <circle cx="115" cy="230" r="10" fill="#475569" stroke="#334155" strokeWidth="2" />
                    <circle cx="140" cy="230" r="10" fill="#475569" stroke="#334155" strokeWidth="2" />

                    {/* Cabin Body */}
                    <path d="M60,200 L60,140 L140,140 L140,200 Z" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
                    <path d="M140,140 L140,200 L180,200 L180,160 Z" fill="#64748b" stroke="#334155" strokeWidth="2" />

                    {/* Window */}
                    <path d="M70,150 L110,150 L110,180 L70,180 Z" fill="#bae6fd" stroke="#334155" strokeWidth="2" />

                    {/* Crane Arm Group */}
                    <motion.g
                        initial={{ rotate: 0 }}
                        animate={{ rotate: [0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ originX: "100px", originY: "150px" }}
                    >
                        {/* Main Arm */}
                        <line x1="100" y1="150" x2="0" y2="50" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
                        <line x1="100" y1="150" x2="-20" y2="30" stroke="#334155" strokeWidth="4" />

                        {/* Cable */}
                        <motion.line
                            x1="0" y1="50" x2="0" y2="120"
                            stroke="#334155" strokeWidth="2"
                            animate={{ y2: [120, 160, 120] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* Hook/Load */}
                        <motion.g
                            animate={{ y: [0, 40, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {/* Beam */}
                            <rect x="-40" y="120" width="80" height="10" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
                            {/* Hook */}
                            <path d="M-5,110 L0,120 L5,110" fill="none" stroke="#334155" strokeWidth="2" />
                        </motion.g>
                    </motion.g>
                </g>

                {/* Boxes */}
                <g transform="translate(400, 340)">
                    <rect x="0" y="0" width="40" height="40" fill="#d97706" stroke="#78350f" strokeWidth="2" />
                    <line x1="0" y1="0" x2="40" y2="40" stroke="#78350f" strokeWidth="1" />
                    <line x1="40" y1="0" x2="0" y2="40" stroke="#78350f" strokeWidth="1" />
                    <rect x="10" y="10" width="20" height="20" fill="none" stroke="#78350f" strokeWidth="1" />
                </g>
                <g transform="translate(450, 340)">
                    <rect x="0" y="0" width="40" height="40" fill="#d97706" stroke="#78350f" strokeWidth="2" />
                    <line x1="0" y1="0" x2="40" y2="40" stroke="#78350f" strokeWidth="1" />
                    <line x1="40" y1="0" x2="0" y2="40" stroke="#78350f" strokeWidth="1" />
                </g>
                <g transform="translate(425, 300)">
                    <rect x="0" y="0" width="40" height="40" fill="#d97706" stroke="#78350f" strokeWidth="2" />
                    <line x1="0" y1="0" x2="40" y2="40" stroke="#78350f" strokeWidth="1" />
                    <line x1="40" y1="0" x2="0" y2="40" stroke="#78350f" strokeWidth="1" />
                </g>

            </svg>
        </div>
    );
}
