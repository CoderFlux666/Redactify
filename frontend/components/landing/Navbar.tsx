"use client";

import Link from "next/link";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { motion } from "framer-motion";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100"
        >
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
                <span className="font-bold text-xl tracking-tight text-slate-900">Redactify</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
                <Link href="#use-cases" className="hover:text-indigo-600 transition-colors">Use Cases</Link>
                <Link href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
                <Link href="#enterprise" className="hover:text-indigo-600 transition-colors">Enterprise</Link>
            </div>

            <div className="flex items-center gap-4">
                <SignedOut>
                    <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                        <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
                            Log in
                        </button>
                    </SignInButton>
                    <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                        <PremiumButton className="bg-slate-900 text-white hover:bg-slate-800 px-5 py-2 h-auto text-sm rounded-full">
                            Get Started
                        </PremiumButton>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <Link href="/dashboard">
                        <button className="text-sm font-medium text-slate-600 hover:text-slate-900 mr-4">
                            Dashboard
                        </button>
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </motion.nav>
    );
}
