"use client";

import { useState, useEffect, useRef } from "react";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { Sparkles, Download } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProcessingState } from "@/components/dashboard/ProcessingState";
import { createClient } from "@/utils/supabase/client";

export default function VideoRedactionPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
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
        setStatus("Fetching document details...");

        if (progressInterval.current) clearInterval(progressInterval.current);

        progressInterval.current = setInterval(() => {
            setProgress(prev => {
                // Stall at 92% until actual completion
                if (prev >= 92) {
                    setStatus("Finalizing redaction...");
                    return 92;
                }

                // Dynamic speed: Fast start, slow middle, very slow end
                let increment = 0.5;
                if (prev < 20) increment = 2.5;
                else if (prev < 50) increment = 1.0;
                else if (prev < 80) increment = 0.4;
                else increment = 0.1;

                const next = prev + increment;

                // Update status text based on progress stages
                if (next > 15 && next < 35) setStatus("Analyzing video frames...");
                if (next >= 35 && next < 60) setStatus("Detecting faces...");
                if (next >= 60 && next < 85) setStatus("Redacting sensitive information...");
                if (next >= 85) setStatus("Applying smooth filters...");

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
        setResultUrl(null);
        startProgressSimulation();

        try {
            const formData = new FormData();
            formData.append("file", file);

            let currentUserId = user?.id;
            if (!currentUserId) {
                const { data: { user: freshUser } } = await supabase.auth.getUser();
                currentUserId = freshUser?.id;
            }

            if (currentUserId) {
                formData.append("user_id", currentUserId);
            } else {
                console.warn("User ID not found, uploading as anonymous (history will not be saved)");
                formData.append("user_id", "anonymous");
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/redact/video`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to process file");
            }

            const data = await response.json();

            // Complete the progress bar
            if (progressInterval.current) clearInterval(progressInterval.current);
            setProgress(100);
            setStatus("Complete!");

            // Small delay to show 100% before showing result
            await new Promise(resolve => setTimeout(resolve, 600));

            if (data.status === "success" && data.url) {
                setResultUrl(data.url);
            } else {
                throw new Error("Invalid response from server");
            }

        } catch (error: any) {
            console.error("Error processing file:", error);
            const errorMessage = error.message || "An error occurred while processing the file. Please ensure the backend server is running.";
            alert(errorMessage);
            setIsProcessing(false); // Only reset if error, otherwise we show result
        } finally {
            if (progressInterval.current) clearInterval(progressInterval.current);
            // We don't set isProcessing(false) here immediately if successful 
            // because we switch to the result view which is handled by !resultUrl check
            if (!resultUrl) setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                    Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Redaction</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Upload videos to automatically detect and blur faces in interviews or CCTV footage.
                </p>
            </div>

            {!resultUrl ? (
                <div className="flex flex-col items-center gap-8">
                    {isProcessing ? (
                        <GlassCard className="w-full max-w-2xl p-12">
                            <ProcessingState progress={progress} status={status} />
                        </GlassCard>
                    ) : (
                        <>
                            <FileUpload
                                onFileSelect={setFile}
                                isProcessing={isProcessing}
                                accept=".mp4,.mov,.avi"
                                supportText="Supports MP4, MOV, AVI (Max 100MB)"
                            />

                            {file && (
                                <PremiumButton
                                    onClick={handleProcess}
                                    disabled={isProcessing}
                                    className="w-full max-w-xs text-lg py-4"
                                    icon={<Sparkles />}
                                >
                                    Redact Video
                                </PremiumButton>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-8">
                    <GlassCard className="p-8 text-center space-y-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <Sparkles className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900">Redaction Complete!</h3>
                            <p className="text-slate-500 mt-2">Your video has been processed and faces have been blurred.</p>
                        </div>

                        <video key={resultUrl} controls className="w-full max-w-md mx-auto rounded-lg shadow-lg">
                            <source src={resultUrl} type="video/mp4" />
                            Your browser does not support the video element.
                        </video>

                        <div className="flex gap-4 justify-center">
                            <PremiumButton
                                onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = resultUrl;
                                    a.download = `redacted_${file?.name}`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                }}
                                icon={<Download />}
                            >
                                Download Redacted Video
                            </PremiumButton>

                            <PremiumButton
                                variant="secondary"
                                onClick={() => {
                                    setFile(null);
                                    setResultUrl(null);
                                    setIsProcessing(false);
                                    setProgress(0);
                                }}
                            >
                                Process Another
                            </PremiumButton>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    );
}
