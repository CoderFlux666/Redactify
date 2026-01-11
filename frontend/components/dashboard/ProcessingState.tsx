"use client";

import { motion } from "framer-motion";
import { Loader2, CheckCircle2, ScanLine, Sparkles } from "lucide-react";

interface ProcessingStateProps {
    progress: number;
    status: string;
}

export function ProcessingState({ progress, status }: ProcessingStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 space-y-10 relative overflow-hidden">

            {/* Background Glow Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />

            {/* Main Circular Progress */}
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Outer Rotating Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500/50 border-r-purple-500/50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Counter-Rotating Ring */}
                <motion.div
                    className="absolute inset-4 rounded-full border-2 border-transparent border-b-blue-400/30 border-l-purple-400/30"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />

                {/* SVG Progress Circle */}
                <svg className="absolute w-full h-full transform -rotate-90 drop-shadow-lg">
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-slate-100/50"
                    />
                    <motion.circle
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progress / 100 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="url(#gradient)"
                        strokeWidth="6"
                        fill="transparent"
                        strokeLinecap="round"
                        className="drop-shadow-md"
                        style={{
                            strokeDasharray: "553", // 2 * pi * 88
                            strokeDashoffset: "553",
                        }}
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <motion.div
                        key={progress}
                        initial={{ scale: 0.9, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-5xl font-mono font-bold text-slate-800 tracking-tighter"
                    >
                        {Math.round(progress)}%
                    </motion.div>
                    {progress < 100 && (
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <ScanLine className="w-5 h-5 text-blue-500 mt-2" />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Status Text & Steps */}
            <div className="text-center space-y-3 z-10 max-w-md">
                <motion.div
                    key={status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2"
                >
                    {progress === 100 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    <h3 className="text-xl font-semibold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        {status}
                    </h3>
                </motion.div>

                <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">
                    {progress < 30 ? "Initializing" : progress < 60 ? "Processing" : progress < 90 ? "Refining" : "Finalizing"}
                </p>
            </div>
        </div>
    );
}
