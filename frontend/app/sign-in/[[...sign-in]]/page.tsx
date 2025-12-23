"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function SignInPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0f2fe_1px,transparent_1px),linear-gradient(to_bottom,#e0f2fe_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-blue-100/40 rounded-full blur-3xl animate-blob" />
                    <div className="absolute top-[40%] right-[20%] w-96 h-96 bg-purple-100/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto p-4 z-10 items-center justify-center gap-12">
                {/* Left Side - Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="hidden md:flex flex-col space-y-6 max-w-md"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                            Redactify
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold text-slate-900 leading-tight">
                        Secure Document Redaction for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Modern Enterprise</span>
                    </h1>

                    <p className="text-lg text-slate-500">
                        Join thousands of users who trust Redactify to automatically identify and protect sensitive information in their documents, audio, and video.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        {[
                            "AI-Powered Detection",
                            "Bank-Grade Security",
                            "Multi-Format Support",
                            "Instant Processing"
                        ].map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-slate-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                {feature}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side - Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "shadow-xl border border-slate-100 rounded-2xl bg-white/80 backdrop-blur-xl",
                                headerTitle: "text-slate-900 font-bold text-xl",
                                headerSubtitle: "text-slate-500",
                                socialButtonsBlockButton: "border-slate-200 hover:bg-slate-50 text-slate-600",
                                formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 border-0",
                                footerActionLink: "text-blue-600 hover:text-blue-700"
                            }
                        }}
                        redirectUrl="/dashboard"
                    />
                </motion.div>
            </div>
        </div>
    );
}
