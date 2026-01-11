"use client";

import { useState, useEffect, useRef } from "react";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { RedactionResult } from "@/components/dashboard/RedactionResult";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { Sparkles } from "lucide-react";
import { ProcessingState } from "@/components/dashboard/ProcessingState";
import { createClient } from "@/utils/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";

export default function Dashboard() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ original: string; redacted: string; method: string } | null>(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Initializing...");
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, []);

    const startProgressSimulation = () => {
        setProgress(0);
        setStatus("Scanning document structure...");

        if (progressInterval.current) clearInterval(progressInterval.current);

        progressInterval.current = setInterval(() => {
            setProgress(prev => {
                // Stall at 92% until actual completion
                if (prev >= 92) {
                    setStatus("Finalizing redaction...");
                    return 92;
                }

                // Dynamic speed
                let increment = 1.5; // Faster for text documents
                if (prev < 20) increment = 4.0;
                else if (prev < 50) increment = 2.0;
                else if (prev < 80) increment = 1.0;
                else increment = 0.5;

                const next = prev + increment;

                // Update status text based on progress stages
                if (next > 15 && next < 35) setStatus("Extracting text content...");
                if (next >= 35 && next < 60) setStatus("Identifying PII entities...");
                if (next >= 60 && next < 85) setStatus("Redacting sensitive data...");
                if (next >= 85) setStatus("Formatting output...");

                return next;
            });
        }, 100);
    };

    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const handleProcess = async () => {
        if (!file) return;

        setIsProcessing(true);
        setResult(null);
        startProgressSimulation();

        try {
            const formData = new FormData();
            formData.append("file", file);
            if (user) {
                formData.append("user_id", user.id);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to process file");
            }

            const data = await response.json();

            if (data.status === "error") {
                alert(data.error);
                setIsProcessing(false);
                if (progressInterval.current) clearInterval(progressInterval.current);
                return;
            }

            // Complete the progress bar
            if (progressInterval.current) clearInterval(progressInterval.current);
            setProgress(100);
            setStatus("Complete!");

            // Small delay to show 100% before showing result
            await new Promise(resolve => setTimeout(resolve, 600));

            setResult({
                original: data.original_content,
                redacted: data.redacted_content,
                method: data.method
            });
        } catch (error) {
            console.error("Error processing file:", error);
            alert("An error occurred while processing the file. Please ensure the backend server is running.");
        } finally {
            if (progressInterval.current) clearInterval(progressInterval.current);
            // Only stop processing if we don't have a result (error case)
            // If we have a result, the UI switches to result view
            if (!result) setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                    Context <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Redaction</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Upload your documents and let our advanced AI identify and redact sensitive information instantly.
                </p>
            </div>

            {!result ? (
                <div className="flex flex-col items-center gap-8">
                    {isProcessing ? (
                        <GlassCard className="w-full max-w-2xl p-12">
                            <ProcessingState progress={progress} status={status} />
                        </GlassCard>
                    ) : (
                        <>
                            <FileUpload onFileSelect={setFile} isProcessing={isProcessing} />

                            {file && (
                                <PremiumButton
                                    onClick={handleProcess}
                                    disabled={isProcessing}
                                    className="w-full max-w-xs text-lg py-4"
                                    icon={<Sparkles />}
                                >
                                    Redact Document
                                </PremiumButton>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <RedactionResult
                    originalText={result.original}
                    redactedText={result.redacted}
                    method={result.method}
                    onReset={() => {
                        setFile(null);
                        setResult(null);
                        setIsProcessing(false);
                        setProgress(0);
                    }}
                />
            )}
        </div>
    );
}
