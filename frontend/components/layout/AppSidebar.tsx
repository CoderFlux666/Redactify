"use client";

import { Home, FileText, Settings, Shield, Menu, Mic, Video, Bell, Bot, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";


const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Documents", href: "/dashboard/documents" },
    { icon: Shield, label: "Redaction Rules", href: "/dashboard/rules" },
    { icon: Mic, label: "Audio Redaction", href: "/dashboard/audio" },
    { icon: Video, label: "Video Redaction", href: "/dashboard/video" },
];

export function AppSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <motion.div
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="h-screen bg-white border-r border-slate-200 flex flex-col sticky top-0 z-50"
        >
            <div className="p-4 flex items-center justify-between">
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
                        >
                            <div className="relative w-8 h-8">
                                <Image
                                    src="/logo-v0-pixel.png"
                                    alt="V0 Logo"
                                    fill
                                    className="object-contain rounded-lg shadow-sm"
                                />
                            </div>
                            <span className="font-bold text-xl tracking-tight font-outfit">Redactify</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <Menu className="w-5 h-5 text-slate-500" />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />
                                {!isCollapsed && <span>{item.label}</span>}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-slate-100">
                {!isCollapsed && (
                    <div className="mb-4">
                        <div className="flex items-center gap-2 px-2 mb-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enterprise</span>
                            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-200 opacity-70 shadow-[0_0_10px_rgba(79,70,229,0.5)] animate-pulse">Free Book</span>
                        </div>
                        <Link href="/dashboard/llm-cleaner">
                            <motion.div
                                whileHover={{ x: 4 }}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${pathname === "/dashboard/llm-cleaner"
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <Bot className="w-5 h-5 shrink-0" />
                                <span>LLM Dataset Cleaning</span>
                            </motion.div>
                        </Link>
                        <Link href="/dashboard/reversible-redaction">
                            <motion.div
                                whileHover={{ x: 4 }}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${pathname === "/dashboard/reversible-redaction"
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <RefreshCcw className="w-5 h-5 shrink-0" />
                                <span>Reversible Redaction</span>
                            </motion.div>
                        </Link>
                    </div>
                )}

                {!isCollapsed && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-medium text-slate-500 mb-2">Storage Used</p>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full w-[45%] bg-slate-900 rounded-full" />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">4.5 GB / 10 GB</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
