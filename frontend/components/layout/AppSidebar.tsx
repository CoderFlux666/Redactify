"use client";

import { Home, FileText, Settings, Shield, Menu, Mic, Video, Bell } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Documents", href: "/dashboard/documents" },
    { icon: Shield, label: "Redaction Rules", href: "/dashboard/rules" },
    { icon: Mic, label: "Audio Redaction", href: "/dashboard/audio" },
    { icon: Video, label: "Video Redaction", href: "/dashboard/video" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function AppSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user } = useUser();
    const pathname = usePathname();

    return (
        <motion.div
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="h-screen sticky top-0 left-0 glass-panel border-r border-slate-200/50 z-50 flex flex-col"
        >
            <div className="p-6 flex items-center justify-between">
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">R</div>
                            <span className="font-bold text-xl tracking-tight">Redactify</span>
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

            <nav className="flex-1 p-4 space-y-2">
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
                                <item.icon className="w-5 h-5" />
                                {!isCollapsed && <span>{item.label}</span>}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4">
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
