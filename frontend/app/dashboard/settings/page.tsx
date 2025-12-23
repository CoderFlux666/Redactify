"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Key, LogOut, Save, Shield } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState("");
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem("openai_api_key");
        if (storedKey) setApiKey(storedKey);
    }, []);

    const handleSave = () => {
        localStorage.setItem("openai_api_key", apiKey);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleLogout = () => {
        // Clear local storage and redirect
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                    System <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Settings</span>
                </h1>
                <p className="text-lg text-slate-500">
                    Manage your API keys and system preferences.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* API Key Section */}
                <GlassCard className="p-8 space-y-6">
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Key className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900">API Configuration</h3>
                            <p className="text-slate-500">Manage your AI provider credentials.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700">
                            OpenAI API Key
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <p className="text-xs text-slate-400">
                            Your key is stored locally in your browser and sent securely to the backend.
                        </p>
                        <div className="flex justify-end">
                            <PremiumButton
                                onClick={handleSave}
                                icon={isSaved ? <Shield className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                className={isSaved ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                                {isSaved ? "Saved Securely" : "Save Configuration"}
                            </PremiumButton>
                        </div>
                    </div>
                </GlassCard>

                {/* Danger Zone */}
                <GlassCard className="p-8 space-y-6 border-red-100">
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                            <LogOut className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900">Session Management</h3>
                            <p className="text-slate-500">Sign out and clear local data.</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="text-sm text-slate-600">
                            This will remove all locally stored settings and keys.
                        </p>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
}
