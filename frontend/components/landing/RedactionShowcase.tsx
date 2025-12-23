"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, Video, Mic, ShieldCheck, Activity, CheckCircle2 } from "lucide-react";

export const RedactionShowcase = () => {
    return (
        <>
            {/* Audio Redaction Section */}
            <section className="py-24 relative overflow-hidden bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-medium text-sm mb-6">
                                <Mic className="w-4 h-4" />
                                <span>Audio Intelligence</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                Intelligent Audio <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                                    Redaction & Bleeping
                                </span>
                            </h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Automatically detect and redact sensitive PII (Personally Identifiable Information) from your audio files. Our AI understands context to bleep only what matters—names, credit cards, and phone numbers—while keeping the conversation flowing.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {['Context-aware PII detection', 'Preserves background audio', 'Enterprise-grade encryption'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Demo Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl opacity-20 blur-2xl" />
                            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-2">
                                <div className="bg-slate-900 rounded-2xl overflow-hidden">
                                    <AudioDemo src="/demo-audio.mp3" />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Video Redaction Section */}
            <section className="py-24 relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Demo Content (Left side for variety) */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative order-2 lg:order-1"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-20 blur-2xl" />
                            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-2">
                                <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                                    <VideoDemo src="/demo-video.mp4" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="order-1 lg:order-2"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-6">
                                <Video className="w-4 h-4" />
                                <span>Computer Vision</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                Precision Video <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                                    Face Anonymization
                                </span>
                            </h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Protect identities in seconds. Our advanced neural networks detect and blur faces frame-by-frame with 99.9% accuracy, ensuring compliance without compromising video quality.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {['Frame-by-frame analysis', 'No ghosting or flickering', 'Supports 4K resolution'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                    </div>
                </div>
            </section>
        </>
    );
};

const AudioDemo = ({ src }: { src: string }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="p-8 bg-slate-900 relative overflow-hidden group min-h-[300px] flex flex-col justify-center">
            {/* Visualizer Background Effect */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-30">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ height: isPlaying ? [20, 100, 20] : 20 }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.05, ease: "easeInOut" }}
                        className="w-3 bg-purple-500 rounded-full"
                    />
                ))}
            </div>

            <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />

            <div className="relative z-10 flex flex-col items-center gap-6">
                <button
                    onClick={togglePlay}
                    className="w-20 h-20 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-xl shadow-purple-500/30 transform hover:scale-105"
                >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>

                <div className="w-full max-w-md space-y-2">
                    <div className="flex justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
                        <span>0:00</span>
                        <span>Audio Preview</span>
                        <span>End</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                            animate={{ width: isPlaying ? "100%" : "0%" }}
                            transition={{ duration: 30, ease: "linear" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const VideoDemo = ({ src }: { src: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="relative w-full h-full group bg-black">
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                loop
                playsInline
                onClick={togglePlay}
            />

            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition-all">
                    <button
                        onClick={togglePlay}
                        className="w-20 h-20 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white transition-all transform hover:scale-110 shadow-2xl"
                    >
                        <Play className="w-10 h-10 ml-1" />
                    </button>
                </div>
            )}

            <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md text-sm font-semibold text-white border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                AI Protected
            </div>
        </div>
    );
};
