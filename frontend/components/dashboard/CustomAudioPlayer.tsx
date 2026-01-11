"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Download, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomAudioPlayerProps {
    src: string;
    fileName?: string;
    onDownload?: () => void;
    onProcessAnother?: () => void;
}

export function CustomAudioPlayer({ src, fileName, onDownload, onProcessAnother }: CustomAudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
        };

        const setAudioTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            // Reset visualizer
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        audio.addEventListener("loadeddata", setAudioData);
        audio.addEventListener("timeupdate", setAudioTime);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("loadeddata", setAudioData);
            audio.removeEventListener("timeupdate", setAudioTime);
            audio.removeEventListener("ended", handleEnded);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    const initializeAudioContext = () => {
        if (audioContextRef.current) return;

        const audio = audioRef.current;
        if (!audio) return;

        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        // Connect audio to analyser and destination
        if (!sourceRef.current) {
            const source = ctx.createMediaElementSource(audio);
            sourceRef.current = source;
            source.connect(analyser);
            analyser.connect(ctx.destination);
        }
    };

    const drawVisualizer = () => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;
        if (!canvas || !analyser) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            const width = canvas.width;
            const height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            // Style for the bars
            const barWidth = (width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            // Draw centered bars
            const centerY = height / 2;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * height * 0.8; // Scale height

                // Gradient color
                const gradient = ctx.createLinearGradient(0, centerY - barHeight / 2, 0, centerY + barHeight / 2);
                gradient.addColorStop(0, "rgba(147, 51, 234, 0.2)"); // Purple-600 transparent
                gradient.addColorStop(0.5, "rgba(168, 85, 247, 1)"); // Purple-500 solid
                gradient.addColorStop(1, "rgba(147, 51, 234, 0.2)");

                ctx.fillStyle = gradient;

                // Draw rounded pill shape
                ctx.beginPath();
                ctx.roundRect(x, centerY - barHeight / 2, barWidth - 2, barHeight || 4, 4);
                ctx.fill();

                x += barWidth;
            }
        };

        draw();
    };

    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!audioContextRef.current) {
            initializeAudioContext();
        }

        if (audioContextRef.current?.state === "suspended") {
            await audioContextRef.current.resume();
        }

        if (isPlaying) {
            audio.pause();
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            setIsPlaying(false);
        } else {
            await audio.play();
            setIsPlaying(true);
            drawVisualizer();
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const newTime = parseFloat(e.target.value);
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

                <audio ref={audioRef} src={src} crossOrigin="anonymous" />

                <div className="relative z-10 flex flex-col items-center gap-8">

                    {/* Visualizer Area */}
                    <div className="w-full h-32 flex items-center justify-center relative">
                        <canvas
                            ref={canvasRef}
                            width={600}
                            height={128}
                            className="w-full h-full opacity-80"
                        />

                        {/* Central Play Button Overlay */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={togglePlay}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 z-20 group"
                        >
                            {isPlaying ? (
                                <Pause className="w-8 h-8 text-white fill-current" />
                            ) : (
                                <Play className="w-8 h-8 text-white fill-current ml-1" />
                            )}

                            {/* Pulse Effect */}
                            {!isPlaying && (
                                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
                            )}
                        </motion.button>
                    </div>

                    {/* Progress & Controls */}
                    <div className="w-full space-y-4">
                        {/* Time Labels */}
                        <div className="flex justify-between text-xs font-medium text-slate-400 tracking-wider uppercase">
                            <span>{formatTime(currentTime)}</span>
                            <span>Audio Preview</span>
                            <span>{formatTime(duration)}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative group h-2">
                            <div className="absolute inset-0 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 relative"
                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={duration || 100}
                                value={currentTime}
                                onChange={handleSeek}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4">
                            <button
                                onClick={() => {
                                    const audio = audioRef.current;
                                    if (audio) {
                                        audio.muted = !isMuted;
                                        setIsMuted(!isMuted);
                                    }
                                }}
                                className="p-2 text-slate-400 hover:text-white transition-colors"
                            >
                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>

                            <div className="flex gap-3">
                                {onProcessAnother && (
                                    <button
                                        onClick={onProcessAnother}
                                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        New
                                    </button>
                                )}
                                {onDownload && (
                                    <button
                                        onClick={onDownload}
                                        className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-200 text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-white/10"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
