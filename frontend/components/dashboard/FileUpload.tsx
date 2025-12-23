"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, CheckCircle, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isProcessing: boolean;
    accept?: string;
    supportText?: string;
}

export function FileUpload({
    onFileSelect,
    isProcessing,
    accept = ".txt,.pdf,.docx",
    supportText = "Supports TXT, PDF, DOCX (Max 10MB)"
}: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setSelectedFile(file);
        onFileSelect(file);
    };

    const clearFile = () => {
        setSelectedFile(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <GlassCard className="w-full max-w-2xl mx-auto text-center relative overflow-hidden">
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept={accept}
            />

            <AnimatePresence mode="wait">
                {!selectedFile ? (
                    <motion.div
                        key="upload-zone"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`relative p-12 border-2 border-dashed rounded-xl transition-all ${dragActive
                            ? "border-slate-900 bg-slate-50 scale-[1.02]"
                            : "border-slate-200 hover:border-slate-400"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                                <Upload className="w-8 h-8 text-slate-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Upload your document
                                </h3>
                                <p className="text-slate-500 mt-1">
                                    Drag & drop or click to browse
                                </p>
                            </div>
                            <p className="text-xs text-slate-400">
                                {supportText}
                            </p>
                            <PremiumButton
                                variant="secondary"
                                onClick={() => inputRef.current?.click()}
                                className="mt-4"
                            >
                                Select File
                            </PremiumButton>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="file-preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-8"
                    >
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                                    <File className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-slate-900 truncate max-w-[200px]">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {(selectedFile.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            </div>
                            {!isProcessing && (
                                <button
                                    onClick={clearFile}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            )}
                        </div>

                        {isProcessing ? (
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                <p className="text-slate-600 font-medium">
                                    Redacting sensitive information...
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                                <CheckCircle className="w-5 h-5" />
                                <span>Ready for processing</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
}
