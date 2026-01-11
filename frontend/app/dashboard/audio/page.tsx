"use client";

import { useState, useEffect, useRef } from "react";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { Sparkles, Download } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProcessingState } from "@/components/dashboard/ProcessingState";
import { CustomAudioPlayer } from "@/components/dashboard/CustomAudioPlayer";
import { createClient } from "@/utils/supabase/client";

export default function AudioRedactionPage() {
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
        setStatus("Fetching audio details...");

        if (progressInterval.current) clearInterval(progressInterval.current);

        progressInterval.current = setInterval(() => {
            setProgress(prev => {
                // Stall at 92% until actual completion
                if (prev >= 92) {
                    setStatus("Finalizing audio processing...");
                    return 92;
                }

                // Dynamic speed
                let increment = 0.8; // Slightly faster than video
                if (prev < 20) increment = 3.0;
                else if (prev < 50) increment = 1.5;
                else if (prev < 80) increment = 0.6;
                else increment = 0.2;

                const next = prev + increment;

                // Update status text based on progress stages
                if (next > 15 && next < 35) setStatus("Analyzing audio waveform...");
                if (next >= 35 && next < 60) setStatus("Detecting sensitive speech...");
                if (next >= 60 && next < 85) setStatus("Muting identified segments...");
                if (next >= 85) setStatus("Reassembling audio track...");

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
                // Still send a value to satisfy backend Form(...) requirement if it's strict, 
                // or let it fail if backend requires it. 
                // Based on main.py: user_id: str = Form(...) -> it IS required.
                formData.append("user_id", "anonymous");
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/redact/audio`, {
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
            setIsProcessing(false);
        } finally {
            if (progressInterval.current) clearInterval(progressInterval.current);
            if (!resultUrl) setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                    Audio <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Redaction</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Upload audio recordings to automatically detect and mute sensitive information like names and phone numbers.
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
                                accept=".mp3,.wav,.m4a"
                                supportText="Supports MP3, WAV, M4A (Max 50MB)"
                            />

                            {file && (
                                <PremiumButton
                                    onClick={handleProcess}
                                    disabled={isProcessing}
                                    className="w-full max-w-xs text-lg py-4"
                                    icon={<Sparkles />}
                                >
                                    Redact Audio
                                </PremiumButton>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-8 w-full">
                    <CustomAudioPlayer
                        src={resultUrl}
                        fileName={file?.name}
                        onDownload={() => {
                            const a = document.createElement('a');
                            a.href = resultUrl;
                            a.download = `redacted_${file?.name}`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        }}
                        onProcessAnother={() => {
                            setFile(null);
                            setResultUrl(null);
                            setIsProcessing(false);
                            setProgress(0);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
