"use client";

import { Bell, Search } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

export function AppHeader() {
    const { user } = useUser();
    return (
        <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/50 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 w-1/3">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-slate-900">{user?.fullName || "User"}</p>
                        <p className="text-xs text-slate-500">Premium Plan</p>
                    </div>
                    <UserButton />
                </div>
            </div>
        </header>
    );
}
