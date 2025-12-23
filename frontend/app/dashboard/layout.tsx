"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <AppSidebar />
            <main className="flex-1 flex flex-col min-h-screen relative">
                <AppHeader />
                <div className="flex-1 p-8 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
