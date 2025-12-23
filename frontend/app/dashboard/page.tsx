"use client";

import { useState } from "react";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { RedactionResult } from "@/components/dashboard/RedactionResult";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ original: string; redacted: string; method: string } | null>(null);

    const handleProcess = async () => {
        if (!file) return;

        setIsProcessing(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

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
                return;
            }

            setResult({
                original: data.original_content,
                redacted: data.redacted_content,
                method: data.method
            });
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
                    Redaction <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Workspace</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Upload your documents and let our advanced AI identify and redact sensitive information instantly.
                </p>
            </div>

            {!result ? (
                <div className="flex flex-col items-center gap-8">
                    <FileUpload onFileSelect={setFile} isProcessing={isProcessing} />

                    {file && (
                        <PremiumButton
                            onClick={handleProcess}
                            disabled={isProcessing}
                            className="w-full max-w-xs text-lg py-4"
                            icon={<Sparkles />}
                        >
                            {isProcessing ? "Processing..." : "Redact Document"}
                        </PremiumButton>
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
                    }}
                />
            )}
        </div>
    );
}
