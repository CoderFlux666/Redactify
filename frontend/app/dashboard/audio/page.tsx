"use client";

import { useState } from "react";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { Sparkles, Download } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AudioRedactionPage() {
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

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/redact/audio`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to process file");
            }

            // For audio/video, we expect a file download or a URL to the processed file
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
                    Audio <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Redaction</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Upload audio recordings to automatically detect and mute sensitive information like names and phone numbers.
                </p>
            </div>

            {!resultUrl ? (
                <div className="flex flex-col items-center gap-8">
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
                            {isProcessing ? "Processing Audio..." : "Redact Audio"}
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
                            <p className="text-slate-500 mt-2">Your audio file has been processed and sensitive information muted.</p>
                        </div>

                        <audio controls className="w-full max-w-md mx-auto">
                            <source src={resultUrl} type={file?.type || "audio/mpeg"} />
                            Your browser does not support the audio element.
                        </audio>

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
                                Download Redacted Audio
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
