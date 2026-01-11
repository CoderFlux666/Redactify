"use client";

import { Search, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AppHeaderProps {
    onMenuClick?: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/50 px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-1/3">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                    <Search className="w-6 h-6 hidden" /> {/* Dummy to keep imports if needed, but actually we need Menu */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                </button>
                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                    />
                </div>
                {/* Mobile Search Icon only */}
                <button className="md:hidden p-2 text-slate-500">
                    <Search className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-4">

                {user?.user_metadata?.avatar_url && (
                    <Link href="/dashboard/profile">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-slate-200 transition-all cursor-pointer">
                            <img
                                src={user.user_metadata.avatar_url}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-slate-900">{user?.email || "User"}</p>
                        <p className="text-xs text-slate-500">Premium Plan</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Sign out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
