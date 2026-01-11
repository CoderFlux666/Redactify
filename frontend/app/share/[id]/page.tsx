"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Lock, Unlock, FileText, AlertCircle, Shield, Download, Eye, EyeOff, CheckCircle, Zap, RefreshCw, FileCheck } from "lucide-react";
import { PremiumButton } from "@/components/ui/PremiumButton";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

function Logo3D() {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["25deg", "-25deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-25deg", "25deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;

        const xPct = mouseXFromCenter / width;
        const yPct = mouseYFromCenter / height;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
            }}
            className="relative w-10 h-10 cursor-pointer"
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="w-full h-full relative"
            >
                {/* Spotlight Effect */}
                <motion.div
                    style={{
                        background: useTransform(
                            [mouseX, mouseY],
                            ([latestX, latestY]) => `radial-gradient(circle at ${50 + (latestX as number) * 100}% ${50 + (latestY as number) * 100}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 80%)`
                        ),
                        opacity: useTransform(mouseX, (value) => (value !== 0 ? 1 : 0)),
                    }}
                    className="absolute inset-0 z-20 rounded-lg mix-blend-overlay transition-opacity duration-300"
                />

                <div className="relative w-full h-full" style={{ transform: "translateZ(20px)" }}>
                    <Image
                        src="/logo-v0-pixel.png"
                        alt="V0 Logo"
                        fill
                        className="object-contain rounded-lg shadow-xl"
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function SharePage() {
    const params = useParams();
    const id = params.id as string;

    const [docInfo, setDocInfo] = useState<any>(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [unlockError, setUnlockError] = useState<string | null>(null);
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchDocInfo();
        }
    }, [id]);

    const fetchDocInfo = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/reversible/${id}`);
            const data = await response.json();
            if (data.status === "success") {
                setDocInfo(data);
            } else {
                setUnlockError("Document not found or invalid link.");
            }
        } catch (error) {
            console.error("Error fetching doc:", error);
            setUnlockError("Failed to load document.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnlock = async () => {
        if (!password) return;

        setIsUnlocking(true);
        setUnlockError(null);
        try {
            const formData = new FormData();
            formData.append("doc_id", id);
            formData.append("password", password);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/reversible/unlock`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.status === "success") {
                setOriginalUrl(data.original_url);
            } else {
                setUnlockError("Incorrect password. Access denied.");
            }
        } catch (error) {
            console.error("Unlock error:", error);
            setUnlockError("Failed to unlock.");
        } finally {
            setIsUnlocking(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-slate-600 font-medium">Loading secure document...</p>
                </div>
            </div>
        );
    }

    if (!docInfo && !isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-3">Document Not Found</h1>
                    <p className="text-slate-500 text-lg">The link may be invalid or expired.</p>
                </div>
            </div>
        );
    }

    const features = [
        {
            icon: Shield,
            title: "Military-Grade Encryption",
            description: "Your documents are protected with enterprise-level security"
        },
        {
            icon: Zap,
            title: "AI-Powered Redaction",
            description: "Intelligent PII detection using advanced machine learning"
        },
        {
            icon: FileCheck,
            title: "Layout Preservation",
            description: "Original formatting and design remain intact"
        },
        {
            icon: RefreshCw,
            title: "Reversible Technology",
            description: "Unlock original content with password authentication"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8 space-y-8">
                {/* Document Header */}
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-slate-200/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center shadow-lg p-3 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-rotate-2 cursor-pointer">
                                <Image
                                    src="/logo-v0-pixel.png"
                                    alt="V0 Logo"
                                    width={56}
                                    height={56}
                                    className="object-contain rounded-xl"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Redactify</h1>
                                <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    {docInfo.filename}
                                </p>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm ${originalUrl
                            ? 'bg-slate-900 text-white border border-slate-700'
                            : 'bg-slate-900 text-white border border-slate-700'
                            }`}>
                            {originalUrl ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            {originalUrl ? "Decrypted" : "Encrypted"}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Unlock Panel - Removed sticky positioning */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/50 shadow-lg flex-1 flex flex-col justify-center">
                            {!originalUrl ? (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                                            <Lock className="w-8 h-8 text-slate-500" />
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900">Protected Document</h2>
                                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                            Enter the password provided by the sender to unlock and view the original content.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                                                className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                                                placeholder="Enter password..."
                                            />
                                            <button
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        <PremiumButton
                                            onClick={handleUnlock}
                                            disabled={isUnlocking || !password}
                                            className="w-full py-3 text-base font-semibold"
                                        >
                                            {isUnlocking ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Unlocking...
                                                </span>
                                            ) : (
                                                "Unlock Document"
                                            )}
                                        </PremiumButton>
                                        {unlockError && (
                                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2 animate-shake">
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                <span>{unlockError}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-6 animate-fadeIn">
                                    <div className="w-16 h-16 bg-slate-100 border-2 border-slate-300 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                                        <Unlock className="w-8 h-8 text-slate-700" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Granted</h2>
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            You are now viewing the original, unredacted document.
                                        </p>
                                    </div>
                                    <a
                                        href={originalUrl}
                                        download
                                        className="block w-full py-3 px-4 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl font-semibold hover:from-slate-800 hover:to-slate-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Original
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Why Redactify Section */}
                        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/50 shadow-lg flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-indigo-600" />
                                Why Redactify?
                            </h3>
                            <div className="space-y-3">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50/50 transition-colors">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <feature.icon className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">{feature.title}</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Document Viewer */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden min-h-[800px] relative">
                            <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                    <span className="text-xs font-medium text-slate-600 ml-2">
                                        {originalUrl ? "Original Document" : "Redacted Preview"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-xs font-medium text-slate-600">Secure Connection</span>
                                </div>
                            </div>
                            {originalUrl ? (
                                <iframe src={originalUrl} className="w-full h-full min-h-[800px]" />
                            ) : (
                                <div className="relative w-full h-full min-h-[800px]">
                                    {docInfo.redacted_url ? (
                                        <iframe src={docInfo.redacted_url} className="w-full h-full min-h-[800px]" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400">
                                            <div className="text-center">
                                                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                <p>No preview available</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/50 shadow-lg">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-indigo-600" />
                            <p className="text-sm text-slate-600">
                                <span className="font-semibold text-slate-900">Powered by Redactify</span> - Trusted by enterprises worldwide for secure document handling
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium text-green-700">Secure</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                                <Lock className="w-3 h-3 text-blue-600" />
                                <span className="text-xs font-medium text-blue-700">Encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
