"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, Download, Eye, Mic, Video } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface Document {
    id: number;
    filename: string;
    method: string;
    timestamp: string;
    redacted_content: string;
    file_type: "text" | "audio" | "video";
    file_path?: string;
}

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/documents`);
            const data = await response.json();
            setDocuments(data.documents);
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (doc: Document) => {
        if (doc.file_type === "text") {
            const element = document.createElement("a");
            const file = new Blob([doc.redacted_content], { type: "text/plain" });
            element.href = URL.createObjectURL(file);
            element.download = `redacted_${doc.filename}.txt`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        } else if (doc.file_path) {
            const element = document.createElement("a");
            element.href = doc.file_path;
            element.download = doc.filename; // Browser might ignore this for cross-origin
            element.target = "_blank";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "audio": return <Mic className="w-6 h-6" />;
            case "video": return <Video className="w-6 h-6" />;
            default: return <FileText className="w-6 h-6" />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case "audio": return "bg-purple-50 text-purple-600";
            case "video": return "bg-pink-50 text-pink-600";
            default: return "bg-blue-50 text-blue-600";
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                    Document <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">History</span>
                </h1>
                <p className="text-lg text-slate-500">
                    View and manage your previously redacted documents.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
            ) : documents.length === 0 ? (
                <GlassCard className="text-center py-12">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No documents found</h3>
                    <p className="text-slate-500">Upload a document in the dashboard to get started.</p>
                </GlassCard>
            ) : (
                <div className="grid gap-4">
                    {documents.map((doc, index) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <GlassCard className="flex items-center justify-between p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${getColor(doc.file_type)}`}>
                                        {getIcon(doc.file_type)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{doc.filename}</h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(doc.timestamp).toLocaleDateString()}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600`}>
                                                {doc.method}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDownload(doc)}
                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
