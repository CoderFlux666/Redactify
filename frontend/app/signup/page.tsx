"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, ArrowRight, User } from "lucide-react";

export default function SignupPage() {
    const supabase = createClient();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;

            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden font-outfit">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Floating Gradient Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none"
            />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-white/20 ring-1 ring-black/5">
                    <div className="text-center space-y-4 mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                            className="mx-auto flex items-center justify-center mb-6"
                        >
                            <div className="relative w-14 h-14">
                                <Image
                                    src="/logo-v0-pixel.png"
                                    alt="V0 Logo"
                                    fill
                                    className="object-contain rounded-xl shadow-lg shadow-black/20"
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create an account</h1>
                            <p className="text-slate-500 text-sm mt-1">Get started with Redactify today</p>
                        </motion.div>
                    </div>

                    <div className="space-y-3">
                        {/* Google - Colorful Icon */}
                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={async () => {
                                await supabase.auth.signInWithOAuth({
                                    provider: 'google',
                                    options: { redirectTo: `${window.location.origin}/auth/callback` },
                                });
                            }}
                            className="w-full bg-white text-slate-700 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </motion.button>

                        <div className="grid grid-cols-2 gap-3">
                            {/* GitHub */}
                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "#2f363d" }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={async () => {
                                    await supabase.auth.signInWithOAuth({
                                        provider: 'github',
                                        options: { redirectTo: `${window.location.origin}/auth/callback` },
                                    });
                                }}
                                className="w-full bg-[#24292F] text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                GitHub
                            </motion.button>

                            {/* GitLab */}
                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "#e24329" }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={async () => {
                                    await supabase.auth.signInWithOAuth({
                                        provider: 'gitlab',
                                        options: { redirectTo: `${window.location.origin}/auth/callback` },
                                    });
                                }}
                                className="w-full bg-[#FC6D26] text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .41.26l2.47 7.6h8.6l2.47-7.6a.43.43 0 0 1 .41-.26.42.42 0 0 1 .11.02.42.42 0 0 1 .31.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
                                </svg>
                                GitLab
                            </motion.button>
                        </div>

                        <div className="relative py-3">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">Or continue with email</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400 hover:bg-white hover:border-slate-300"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400 hover:bg-white hover:border-slate-300"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-purple-600 font-semibold hover:text-purple-500 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
