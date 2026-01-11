"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Unlock, FileText, RefreshCcw, Eye, EyeOff, Key, Upload, CheckCircle, AlertCircle, Copy, Link as LinkIcon } from "lucide-react";
import { ConstructionAnimation } from "@/components/ConstructionAnimation";
import { createClient } from "@/utils/supabase/client";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { PremiumButton } from "@/components/ui/PremiumButton";

export default function ReversibleRedactionPage() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [docId, setDocId] = useState<string | null>(null);
    const [redactedUrl, setRedactedUrl] = useState<string | null>(null);
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);

    // Unlock State
    const [unlockPassword, setUnlockPassword] = useState("");
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [unlockError, setUnlockError] = useState<string | null>(null);

    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const handleUpload = async () => {
        if (!file || !password || !user) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("password", password);
            formData.append("user_id", user.id);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/reversible/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.status === "success") {
                setDocId(data.doc_id);
                setRedactedUrl(data.redacted_url);
                // Reset upload state
                setFile(null);
                setPassword("");
            } else {
                // Handle FastAPI validation errors or custom messages
                const errorMessage = data.detail ? JSON.stringify(data.detail) : (data.message || "Unknown error");
                alert("Upload failed: " + errorMessage);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed. Please check console for details.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleUnlock = async () => {
        if (!docId || !unlockPassword) return;

        setIsUnlocking(true);
        setUnlockError(null);
        try {
            const formData = new FormData();
            formData.append("doc_id", docId);
            formData.append("password", unlockPassword);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/reversible/unlock`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.status === "success") {
                setOriginalUrl(data.original_url);
            } else {
                setUnlockError("Incorrect password. Access denied.");
            }
        } catch (error) {
            console.error("Unlock error:", error);
            setUnlockError("Failed to unlock.");
        } finally {
            setIsUnlocking(false);
        }
    };

    const shareLink = docId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${docId}` : "";

    const copyLink = () => {
        if (shareLink) {
            navigator.clipboard.writeText(shareLink);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Reversible Redaction</h1>
                    <p className="text-slate-500 mt-2">Password-Protected Vault Strategy</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-medium text-indigo-600">Enterprise Feature</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="space-y-6">
                    {/* Vault Upload */}
                    {!docId ? (
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-slate-400" />
                                Secure Upload
                            </h2>

                            <FileUpload onFileSelect={setFile} isProcessing={isUploading} />

                            {file && (
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-sm font-medium text-slate-700">Set Encryption Password</label>
                                            <button
                                                onClick={() => {
                                                    const newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + "!@";
                                                    setPassword(newPassword);
                                                    // Auto-show password when generated
                                                    setShowPassword(true);
                                                }}
                                                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                                            >
                                                <RefreshCcw className="w-3 h-3" />
                                                Generate Random
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Enter a strong password..."
                                            />
                                            <button
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1">
                                            Max 72 characters. Make sure to save this password!
                                        </p>
                                    </div>
                                    <PremiumButton
                                        onClick={handleUpload}
                                        disabled={isUploading || !password}
                                        className="w-full"
                                        icon={isUploading ? <RefreshCcw className="animate-spin" /> : <Lock />}
                                    >
                                        Encrypt & Upload
                                    </PremiumButton>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium text-green-900">Document Secured</p>
                                    <p className="text-xs text-green-700">Encrypted at rest</p>
                                </div>
                            </div>

                            {/* Share Link Section */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Shareable Link</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        readOnly
                                        value={shareLink}
                                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 focus:outline-none"
                                    />
                                    <button
                                        onClick={copyLink}
                                        className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600"
                                        title="Copy Link"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2">
                                    Anyone with this link and the password can unlock the file.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <h3 className="text-sm font-semibold text-slate-900 mb-3">Unlock Document</h3>
                                <p className="text-xs text-slate-500 mb-4">Enter the password to decrypt and view the original file.</p>

                                <div className="space-y-3">
                                    <input
                                        type="password"
                                        value={unlockPassword}
                                        onChange={(e) => setUnlockPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter password..."
                                    />
                                    <button
                                        onClick={handleUnlock}
                                        disabled={isUnlocking || !unlockPassword}
                                        className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isUnlocking ? "Decrypting..." : "Unlock Vault"}
                                    </button>
                                    {unlockError && (
                                        <div className="text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {unlockError}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setDocId(null);
                                    setRedactedUrl(null);
                                    setOriginalUrl(null);
                                    setUnlockPassword("");
                                    setUnlockError(null);
                                }}
                                className="w-full text-sm text-slate-500 hover:text-slate-700 underline"
                            >
                                Upload Another File
                            </button>
                        </div>
                    )}
                </div>

                {/* Document Preview */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full min-h-[600px] flex flex-col relative overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${originalUrl ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {originalUrl ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        {originalUrl ? "Original Document (Decrypted)" : "Redacted View (Public)"}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {originalUrl ? "Access Granted" : "Restricted Access"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-100 p-8 flex items-center justify-center">
                            {originalUrl ? (
                                <iframe src={originalUrl} className="w-full h-full min-h-[600px] shadow-lg rounded-lg bg-white" />
                            ) : redactedUrl ? (
                                <div className="relative w-full h-full min-h-[600px] bg-white shadow-lg rounded-lg p-8">
                                    <iframe src={redactedUrl} className="w-full h-full min-h-[600px]" />
                                </div>
                            ) : (
                                <div className="text-center text-slate-400">
                                    <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>Upload a document to begin</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
