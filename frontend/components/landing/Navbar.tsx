"use client";

import Link from "next/link";
import Image from "next/image";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut, LayoutDashboard } from "lucide-react";

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

export function Navbar() {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
            });

            return () => subscription.unsubscribe();
        };
        getUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100"
        >
            <div className="flex items-center gap-1.5">
                <Logo3D />
                <span className="font-bold text-xl tracking-tight text-slate-900 font-outfit">Redactify</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
                <Link href="#use-cases" className="hover:text-indigo-600 transition-colors">Use Cases</Link>
                <Link href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
                <Link href="#enterprise" className="hover:text-indigo-600 transition-colors">Enterprise</Link>
            </div>

            <div className="flex items-center gap-4">
                {!user ? (
                    <>
                        <Link href="/login">
                            <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
                                Log in
                            </button>
                        </Link>
                        <Link href="/signup">
                            <PremiumButton className="bg-slate-900 text-white hover:bg-slate-800 px-5 py-2 h-auto text-sm rounded-full">
                                Get Started
                            </PremiumButton>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/dashboard">
                            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 mr-2 flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </button>
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </motion.nav>
    );
}
