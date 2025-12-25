"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Unlock, FileText, RefreshCcw, User, Eye, EyeOff, Key, Upload, CheckCircle } from "lucide-react";
import { ConstructionAnimation } from "@/components/ConstructionAnimation";

export default function ReversibleRedactionPage() {
    const [role, setRole] = useState<"junior" | "manager">("junior");
    const [isUploaded, setIsUploaded] = useState(false);
    const [privateKey, setPrivateKey] = useState("");
    const [isRestored, setIsRestored] = useState(false);
    const [isDecrypting, setIsDecrypting] = useState(false);

    const handleRestore = () => {
        if (privateKey.length > 0) {
            setIsDecrypting(true);
            setTimeout(() => {
                setIsRestored(true);
                setIsDecrypting(false);
            }, 1500);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Reversible Redaction</h1>
                    <p className="text-slate-500 mt-2">Server-Side Reversibility & Vault Strategy</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-medium text-indigo-600">Enterprise Feature</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="space-y-6">
                    {/* Vault Upload Simulation */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-slate-400" />
                            The Vault
                        </h2>
                        {!isUploaded ? (
                            <div
                                onClick={() => setIsUploaded(true)}
                                className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                            >
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
                                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                                </div>
                                <p className="text-sm font-medium text-slate-600">Click to simulate secure upload</p>
                                <p className="text-xs text-slate-400 mt-1">Files are encrypted at rest</p>
                            </div>
                        ) : (
                            <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium text-green-900">File Securely Stored</p>
                                    <p className="text-xs text-green-700">contract_v1.pdf • Encrypted</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RBAC Controls */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-slate-400" />
                            Role Access
                        </h2>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button
                                onClick={() => setRole("junior")}
                                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${role === "junior"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                Junior Analyst
                            </button>
                            <button
                                onClick={() => setRole("manager")}
                                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${role === "manager"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                Manager
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-3">
                            {role === "junior"
                                ? "Junior Analysts can only view the public, redacted version."
                                : "Managers can request on-the-fly decryption of the original file."}
                        </p>
                    </div>

                    {/* Crypto-Redaction */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg text-white">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Key className="w-5 h-5 text-indigo-400" />
                            Crypto-Redaction
                        </h2>
                        <p className="text-xs text-slate-400 mb-4">
                            Restore redacted text using your private key. This decrypts metadata stored within the PDF.
                        </p>
                        <div className="space-y-3">
                            <input
                                type="password"
                                placeholder="Enter Private Key..."
                                value={privateKey}
                                onChange={(e) => setPrivateKey(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                            <button
                                onClick={handleRestore}
                                disabled={!privateKey || isDecrypting || isRestored}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {isDecrypting ? (
                                    <>
                                        <RefreshCcw className="w-4 h-4 animate-spin" />
                                        Decrypting...
                                    </>
                                ) : isRestored ? (
                                    <>
                                        <Unlock className="w-4 h-4" />
                                        Restored
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        Restore Text
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Document Preview */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full min-h-[600px] flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">confidential_agreement.pdf</h3>
                                    <p className="text-xs text-slate-500">
                                        {role === "junior" ? "Public View (Redacted)" : "Manager View (Decrypted)"}
                                    </p>
                                </div>
                            </div>
                            {role === "manager" && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md flex items-center gap-1">
                                    <Unlock className="w-3 h-3" />
                                    Access Granted
                                </span>
                            )}
                        </div>

                        <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
                            <div className="max-w-2xl mx-auto bg-white shadow-sm border border-slate-200 min-h-[800px] p-12 relative">
                                {!isUploaded ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                                        <div className="text-center">
                                            <Upload className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                            <p className="text-slate-400">Upload a document to the vault to view</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 font-serif text-slate-800 leading-relaxed">
                                        <h1 className="text-2xl font-bold text-center mb-8">NON-DISCLOSURE AGREEMENT</h1>
                                        <p>
                                            This Agreement is made and entered into as of <strong>December 24, 2025</strong>, by and between:
                                        </p>
                                        <p>
                                            <strong>Disclosing Party:</strong>{" "}
                                            <RedactableText
                                                text="TechCorp Industries Ltd."
                                                isRedacted={role === "junior" && !isRestored}
                                            />
                                            , located at{" "}
                                            <RedactableText
                                                text="123 Innovation Blvd, Silicon Valley, CA"
                                                isRedacted={role === "junior" && !isRestored}
                                            />
                                            .
                                        </p>
                                        <p>
                                            <strong>Receiving Party:</strong>{" "}
                                            <RedactableText
                                                text="John Doe Consulting"
                                                isRedacted={role === "junior" && !isRestored}
                                            />
                                            , located at{" "}
                                            <RedactableText
                                                text="456 Freelance Lane, Austin, TX"
                                                isRedacted={role === "junior" && !isRestored}
                                            />
                                            .
                                        </p>
                                        <p>
                                            The parties agree to the following terms regarding the confidential information related to{" "}
                                            <RedactableText
                                                text="Project Apollo (AI-Driven Analytics)"
                                                isRedacted={role === "junior" && !isRestored}
                                            />
                                            .
                                        </p>
                                        <div className="my-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-yellow-800">
                                            <strong>Note:</strong> This document contains sensitive financial data.
                                        </div>
                                        <p>
                                            1. <strong>Confidential Information</strong> includes, but is not limited to, all data, materials, products, technology, computer programs, specifications, manuals, business plans, software, marketing plans, business plans, financial information, and other information disclosed or submitted, orally, in writing, or by any other media, to Receiving Party by Disclosing Party.
                                        </p>
                                        <p>
                                            2. <strong>Financial Terms:</strong> The Receiving Party agrees to a penalty of{" "}
                                            <RedactableText
                                                text="$5,000,000 USD"
                                                isRedacted={role === "junior" && !isRestored}
                                            />{" "}
                                            for any breach of this agreement.
                                        </p>
                                        <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between">
                                            <div className="w-48 border-t border-slate-900 pt-2">
                                                <p className="text-xs uppercase tracking-wider">Signature of Disclosing Party</p>
                                            </div>
                                            <div className="w-48 border-t border-slate-900 pt-2">
                                                <p className="text-xs uppercase tracking-wider">Signature of Receiving Party</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Under Construction Section */}
            {/* SVG Animated Under Construction Section */}
            <div className="mt-12">
                <ConstructionAnimation />

                <div className="mt-8 text-center space-y-4 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-slate-600 text-sm font-bold uppercase tracking-wider shadow-sm">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" />
                        System Upgrade In Progress
                    </div>

                    <h3 className="text-3xl font-bold text-slate-900">
                        Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">Ultimate Encryption Vault</span>
                    </h3>

                    <p className="text-slate-500 text-lg leading-relaxed">
                        Our engineers are laying the foundation for the world's first reversible redaction engine.
                        Check back soon for the full release.
                    </p>
                </div>
            </div>
        </div>
    );
}

function RedactableText({ text, isRedacted }: { text: string; isRedacted: boolean }) {
    return (
        <span className="relative inline-block align-bottom">
            <AnimatePresence mode="wait">
                {isRedacted ? (
                    <motion.span
                        key="redacted"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-slate-900 text-transparent select-none rounded px-1"
                    >
                        {text}
                    </motion.span>
                ) : (
                    <motion.span
                        key="visible"
                        initial={{ opacity: 0, filter: "blur(4px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.5 }}
                        className="bg-yellow-100 text-slate-900 px-1 rounded"
                    >
                        {text}
                    </motion.span>
                )}
            </AnimatePresence>
        </span>
    );
}
