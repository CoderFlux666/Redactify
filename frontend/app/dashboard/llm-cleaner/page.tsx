"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { Download, CheckCircle, AlertCircle, RefreshCw, Zap } from "lucide-react";
import { WorkflowBuilder } from "@/components/WorkflowBuilder";
import { TerminalLog } from "@/components/TerminalLog";
import { createClient } from "@/utils/supabase/client";
import { ProcessingState } from "@/components/dashboard/ProcessingState";
import { GlassCard } from "@/components/ui/GlassCard";

export default function LLMCleanerPage() {
    const [user, setUser] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);
    const supabase = createClient();
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Initializing pipeline...");
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, []);

    const startProgressSimulation = () => {
        setProgress(0);
        setStatus("Initializing pipeline...");

        if (progressInterval.current) clearInterval(progressInterval.current);

        progressInterval.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 92) {
                    setStatus("Finalizing dataset...");
                    return 92;
                }

                // Slower progress for "massive" datasets feel
                let increment = 0.8;
                if (prev < 20) increment = 2.0;
                else if (prev < 50) increment = 1.0;
                else if (prev < 80) increment = 0.5;
                else increment = 0.2;

                const next = prev + increment;

                if (next > 15 && next < 35) setStatus("Parsing dataset structure...");
                if (next >= 35 && next < 60) setStatus("Sanitizing PII entities...");
                if (next >= 60 && next < 85) setStatus("Validating schema integrity...");
                if (next >= 85) setStatus("Optimizing for LLM training...");

                return next;
            });
        }, 100);
    };

    const handleUpload = async () => {
        if (!file || !user) return;

        setIsUploading(true);
        setError(null);
        setResult(null);
        startProgressSimulation();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("text_column", "message");
        formData.append("user_id", user.id);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/clean-dataset`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.status === "success") {
                // Complete progress
                if (progressInterval.current) clearInterval(progressInterval.current);
                setProgress(100);
                setStatus("Pipeline Complete!");

                await new Promise(resolve => setTimeout(resolve, 600));
                setResult(data);
            } else {
                setError(data.message || "An error occurred during processing.");
                setIsUploading(false); // Stop processing on error
            }
        } catch (err) {
            setError("Failed to connect to the server.");
            console.error(err);
            setIsUploading(false);
        } finally {
            if (progressInterval.current) clearInterval(progressInterval.current);
            if (!result) setIsUploading(false); // Only reset if we didn't succeed (success shows result view)
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-32 pb-24">
            {/* Hero Section */}
            <div className="space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                        LLM Dataset <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Cleaning Pipeline</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Enterprise-grade PII sanitization for Large Language Model training.
                        Ensure GDPR/CCPA compliance while maintaining semantic integrity.
                    </p>
                </div>

                {!result ? (
                    <div className="flex flex-col items-center gap-8">
                        {isUploading ? (
                            <GlassCard className="w-full max-w-2xl p-12">
                                <ProcessingState progress={progress} status={status} />
                            </GlassCard>
                        ) : (
                            <>
                                <FileUpload
                                    onFileSelect={(f) => {
                                        setFile(f);
                                        setResult(null);
                                        setError(null);
                                    }}
                                    isProcessing={isUploading}
                                    accept=".csv,.jsonl"
                                    supportText="Supports CSV, JSONL (Massive files supported)"
                                />

                                {file && (
                                    <PremiumButton
                                        onClick={handleUpload}
                                        disabled={isUploading}
                                        className="w-full max-w-xs text-lg py-4"
                                        icon={isUploading ? <RefreshCw className="animate-spin" /> : <Zap />}
                                    >
                                        Start Cleaning Pipeline
                                    </PremiumButton>
                                )}

                                {error && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100 max-w-md">
                                        <AlertCircle className="w-5 h-5" />
                                        {error}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-slate-200 text-center space-y-6"
                    >
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Processing Complete</h3>
                            <p className="text-slate-500">
                                Successfully cleaned <span className="font-medium text-slate-900">{result.original_filename}</span>
                            </p>
                        </div>

                        <div className="flex justify-center gap-4 pt-4">
                            <a
                                href={result.url}
                                download
                                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Download Cleaned Dataset
                            </a>
                            <button
                                onClick={() => {
                                    setFile(null);
                                    setResult(null);
                                    setIsUploading(false);
                                    setProgress(0);
                                }}
                                className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors border border-slate-200"
                            >
                                Clean Another File
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Section 1: Enterprise Intelligence (Terminal) */}
            <TerminalLog />

            {/* Section 2: Workflow Builder */}
            <WorkflowBuilder />
        </div>
    );
}
