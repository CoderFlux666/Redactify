"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Shield, Key, Settings, LogOut,
    Smartphone, Lock, CreditCard, CheckCircle,
    Activity, FileText, Zap, X, Save, Loader2,
    Eye, EyeOff
} from "lucide-react";
import { PremiumButton } from "@/components/ui/PremiumButton";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [redactionCount, setRedactionCount] = useState(0);

    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
            } else {
                setUser(user);

                // Fetch redaction count for the user
                const { count } = await supabase
                    .from('documents')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);
                setRedactionCount(count || 0);
            }
        };
        getUser();
    }, [router, supabase]);

    const handleUpdatePassword = async () => {
        setMessage(null);
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters" });
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;

            setMessage({ type: "success", text: "Password updated successfully" });
            setIsEditingPassword(false);
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-16 pb-24">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
                {/* Left Column: Digital ID Card (4 cols) */}
                <motion.div variants={item} className="lg:col-span-4 space-y-6">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
                        <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                            {/* ID Card Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-500 dark:text-slate-400">
                                    ID: {user.id.slice(0, 8)}...
                                </div>
                            </div>

                            {/* Avatar & Info */}
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="relative w-32 h-32">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse opacity-20" />
                                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
                                        {user.user_metadata?.avatar_url ? (
                                            <Image
                                                src={user.user_metadata.avatar_url}
                                                alt="Profile"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                <User className="w-12 h-12 text-slate-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-sm">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">
                                        {user.user_metadata?.full_name || "User"}
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                                        {user.email}
                                    </p>
                                </div>

                                <div className="flex gap-2 mt-2">
                                    <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-100 dark:border-blue-800">
                                        Premium Plan
                                    </span>
                                    <span className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-sm font-medium border border-purple-100 dark:border-purple-800">
                                        Verified
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">{redactionCount}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Redactions</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">0</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">API Calls</p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <form action="/auth/signout" method="post">
                                    <button className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800">
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Settings (8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Security Section */}
                    <motion.div variants={item} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">Security Center</h3>
                                <p className="text-slate-500 dark:text-slate-400">Manage your account protection settings</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Password Update Block */}
                            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 w-full">
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm mt-1">
                                            <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <div className="w-full">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-semibold text-slate-900 dark:text-white">Password</p>
                                                {!isEditingPassword && (
                                                    <button
                                                        onClick={() => setIsEditingPassword(true)}
                                                        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-all hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                                                    >
                                                        Update
                                                    </button>
                                                )}
                                            </div>

                                            {!isEditingPassword ? (
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Last changed 3 months ago</p>
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    className="mt-4 space-y-4 max-w-md"
                                                >
                                                    <div className="space-y-2">
                                                        <div className="relative">
                                                            <input
                                                                type={showNewPassword ? "text" : "password"}
                                                                placeholder="New Password"
                                                                value={newPassword}
                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                                className="w-full px-4 py-2 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                            >
                                                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                        <div className="relative">
                                                            <input
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                placeholder="Confirm Password"
                                                                value={confirmPassword}
                                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                                className="w-full px-4 py-2 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                            >
                                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {message && (
                                                        <div className={`text-xs ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                                            {message.text}
                                                        </div>
                                                    )}

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleUpdatePassword}
                                                            disabled={loading}
                                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                                        >
                                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                            Save Password
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setIsEditingPassword(false);
                                                                setMessage(null);
                                                                setNewPassword("");
                                                                setConfirmPassword("");
                                                            }}
                                                            disabled={loading}
                                                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                        <Smartphone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">2FA Authentication</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Not enabled</p>
                                    </div>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer">
                                    <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition shadow-sm" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                        <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">Linked Accounts</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Google (Active)</p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full">Connected</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* API Section */}
                    <motion.div variants={item} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                                    <Key className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">API Management</h3>
                                    <p className="text-slate-500 dark:text-slate-400">Control programmatic access</p>
                                </div>
                            </div>
                            <PremiumButton className="h-auto py-2 px-4 text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100">
                                <Zap className="w-3 h-3 mr-2" />
                                Generate Key
                            </PremiumButton>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-8 text-center group cursor-pointer">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 mx-auto mb-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Key className="w-8 h-8 text-slate-300 dark:text-slate-600 group-hover:text-purple-500 transition-colors" />
                                </div>
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">V0_API_KEY</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                    Your default API key for integrating Redactify's powerful redaction engine directly into your applications.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Preferences */}
                    <motion.div variants={item} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">Preferences</h3>
                                <p className="text-slate-500 dark:text-slate-400">Customize your workspace</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">Usage Reports</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Weekly email summaries</p>
                                    </div>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 cursor-pointer">
                                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition shadow-sm" />
                                </div>
                            </div>

                            <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">Dark Mode</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Toggle theme preference</p>
                                    </div>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer">
                                    <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
