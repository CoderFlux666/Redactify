"use client";

import { useState } from "react";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { Sparkles, Download } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function VideoRedactionPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!file) return;

        setIsProcessing(true);
        setResultUrl(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/redact/video`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to process file");
            }

            const data = await response.json();
            if (data.status === "success" && data.url) {
                setResultUrl(data.url);
            } else {
                throw new Error("Invalid response from server");
            }

        } catch (error) {
            console.error("Error processing file:", error);
            alert("An error occurred while processing the file. Please ensure the backend server is running.");
        } finally {
            setIsProcessing(false);
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
                            {isProcessing ? "Processing Video..." : "Redact Video"}
                        </PremiumButton>
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
