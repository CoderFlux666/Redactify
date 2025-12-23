"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Brain, Lock, ArrowRight, Zap, Settings, Play, Plus, Search, MoreVertical, X, CheckCircle2, Loader2, MousePointer2, FileJson, Download, Shield, ShieldCheck } from "lucide-react";

type NodeType = "input" | "ai" | "redact" | "output";

interface NodeData {
    id: string;
    type: NodeType;
    label: string;
    sublabel: string;
    icon: any;
    color: "blue" | "purple" | "amber" | "green";
    x: number;
    y: number;
    properties: {
        label: string;
        value: string;
        type: "text" | "select" | "tags" | "readonly";
        options?: string[];
        tags?: string[];
    }[];
}

const initialNodes: NodeData[] = [
    {
        id: "node-1",
        type: "input",
        label: "Input PDF",
        sublabel: "invoice_2024.pdf",
        icon: FileText,
        color: "blue",
        x: 40,
        y: 80,
        properties: [
            { label: "Source", value: "Local Upload", type: "readonly" },
            { label: "File Type", value: "PDF Document", type: "readonly" },
            { label: "Size", value: "2.4 MB", type: "readonly" }
        ]
    },
    {
        id: "node-2",
        type: "ai",
        label: "AI Analysis",
        sublabel: "GPT-4 Turbo",
        icon: Brain,
        color: "purple",
        x: 200,
        y: 200,
        properties: [
            { label: "Model", value: "GPT-4 Turbo", type: "select", options: ["GPT-4 Turbo", "Claude 3 Opus", "Llama 3"] },
            { label: "Temperature", value: "0.2", type: "text" },
            { label: "Context Window", value: "128k", type: "readonly" }
        ]
    },
    {
        id: "node-3",
        type: "redact",
        label: "PII Redaction",
        sublabel: "Strict Mode",
        icon: Lock,
        color: "amber",
        x: 380,
        y: 80,
        properties: [
            { label: "Mode", value: "Strict", type: "select", options: ["Strict", "Custom", "Relaxed"] },
            { label: "Entities", value: "", type: "tags", tags: ["Credit Card", "SSN", "Email", "Phone"] },
            { label: "Confidence", value: "> 90%", type: "text" }
        ]
    }
];

export function VisualBuilder() {
    const [nodes, setNodes] = useState<NodeData[]>(initialNodes);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>("node-3");
    const [isRunning, setIsRunning] = useState(false);
    const [activeStep, setActiveStep] = useState<number>(-1);
    const [showSuccess, setShowSuccess] = useState(false);

    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    const handleRun = () => {
        if (isRunning) return;
        setIsRunning(true);
        setShowSuccess(false);
        setActiveStep(0);

        // Simulate workflow steps
        const steps = [0, 1, 2, 3]; // 0: Start, 1: Node 1->2, 2: Node 2->3, 3: Finish

        let current = 0;
        const interval = setInterval(() => {
            current++;
            setActiveStep(current);

            if (current >= steps.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setIsRunning(false);
                    setActiveStep(-1);
                    setShowSuccess(true);
                }, 1000);
            }
        }, 1500);
    };

    return (
        <section className="py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                            Build Custom <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Redaction Workflows
                            </span>
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Design your own privacy pipelines. Connect inputs, choose your AI models, define custom rules, and output to any format. No coding required.
                        </p>

                        <div className="space-y-4">
                            {[
                                "Drag & Drop Interface",
                                "Custom Regex & Keyword Lists",
                                "Multi-Format Export (PDF, JSON, TXT)",
                                "Enterprise-Grade Security"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Zap className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-slate-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                        <div className="relative h-[600px] w-full bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">

                            {/* Editor Toolbar */}
                            <div className="h-14 border-b border-slate-100 flex items-center px-4 justify-between bg-white z-20">
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>
                                    <div className="h-4 w-px bg-slate-200" />
                                    <span className="text-sm font-semibold text-slate-700">Untitled Workflow</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                                        <Search className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleRun}
                                        disabled={isRunning}
                                        className={`flex items-center gap-2 px-3 py-1.5 text-white text-xs font-medium rounded-lg transition-all ${isRunning ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow"
                                            }`}
                                    >
                                        {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                                        {isRunning ? "Running..." : "Run"}
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 flex relative overflow-hidden bg-slate-50/50">
                                {/* Left Sidebar - Nodes */}
                                <div className="w-16 border-r border-slate-100 bg-white flex flex-col items-center py-4 gap-4 z-20">
                                    {[
                                        { icon: FileText, label: "Input" },
                                        { icon: Brain, label: "AI Model" },
                                        { icon: Lock, label: "Redaction" },
                                        { icon: ArrowRight, label: "Output" }
                                    ].map((item, i) => (
                                        <div key={i} className="group relative p-3 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">
                                            <item.icon className="w-5 h-5" />
                                            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                                {item.label}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="mt-auto p-3 rounded-lg hover:bg-slate-50 text-slate-400 cursor-pointer">
                                        <Settings className="w-5 h-5" />
                                    </div>
                                </div>

                                {/* Canvas */}
                                <div className="flex-1 relative" onClick={() => setSelectedNodeId(null)}>
                                    {/* Grid Pattern */}
                                    <div className="absolute inset-0 opacity-[0.03]"
                                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                                    />

                                    {/* Connecting Lines */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                        <Connection
                                            start={{ x: 180, y: 130 }}
                                            end={{ x: 200, y: 250 }}
                                            isActive={activeStep >= 1}
                                            isCompleted={activeStep > 1}
                                        />
                                        <Connection
                                            start={{ x: 340, y: 250 }}
                                            end={{ x: 380, y: 130 }}
                                            isActive={activeStep >= 2}
                                            isCompleted={activeStep > 2}
                                        />
                                    </svg>

                                    {/* Nodes */}
                                    {nodes.map((node, index) => (
                                        <Node
                                            key={node.id}
                                            data={node}
                                            isSelected={selectedNodeId === node.id}
                                            onClick={(e: any) => {
                                                e.stopPropagation();
                                                setSelectedNodeId(node.id);
                                            }}
                                            status={
                                                activeStep === -1 ? "idle" :
                                                    activeStep === index ? "processing" :
                                                        activeStep > index ? "completed" : "idle"
                                            }
                                        />
                                    ))}

                                    {/* Minimap */}
                                    <div className="absolute bottom-4 right-4 w-32 h-24 bg-white border border-slate-200 rounded-lg shadow-sm opacity-50 pointer-events-none p-2">
                                        <div className="w-full h-full bg-slate-50 rounded relative">
                                            <div className="absolute top-[20%] left-[10%] w-4 h-2 bg-blue-200 rounded-sm" />
                                            <div className="absolute top-[50%] left-[40%] w-4 h-2 bg-purple-200 rounded-sm" />
                                            <div className="absolute top-[20%] left-[70%] w-4 h-2 bg-amber-200 rounded-sm" />
                                        </div>
                                    </div>

                                    {/* Success Overlay */}
                                    <AnimatePresence>
                                        {showSuccess && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                transition={{ type: "spring", duration: 0.5 }}
                                                className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px]"
                                            >
                                                <div className="w-full max-w-[320px] bg-white/80 backdrop-blur-xl rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/50 p-6 text-center relative z-10 ring-1 ring-slate-100">
                                                    <button
                                                        onClick={() => setShowSuccess(false)}
                                                        className="absolute top-4 right-4 p-1.5 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600 z-20"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>

                                                    <div className="w-16 h-16 bg-gradient-to-tr from-green-50 to-emerald-50 rounded-[20px] flex items-center justify-center mx-auto mb-4 ring-4 ring-white shadow-lg shadow-green-500/10 relative">
                                                        <Shield className="w-8 h-8 text-green-500 drop-shadow-sm relative z-10" strokeWidth={1.5} />
                                                        <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                                                    </div>

                                                    <h4 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">Export Ready</h4>
                                                    <div className="flex items-center justify-center gap-2 mb-6">
                                                        <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-mono text-slate-500">AES-256</span>
                                                        <span className="px-1.5 py-0.5 bg-green-50 border border-green-100 rounded text-[9px] font-mono text-green-600 flex items-center gap-1">
                                                            <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
                                                        </span>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <button className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50/80 rounded-xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-300 group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-red-50/50 rounded-lg border border-red-100/50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300">
                                                                    <FileText className="w-5 h-5" strokeWidth={1.5} />
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Redacted PDF</div>
                                                                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">2.4 MB • Signed</div>
                                                                </div>
                                                            </div>
                                                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 shadow-sm">
                                                                <Download className="w-4 h-4" strokeWidth={2} />
                                                            </div>
                                                        </button>

                                                        <button className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50/80 rounded-xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-300 group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-amber-50/50 rounded-lg border border-amber-100/50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-300">
                                                                    <FileJson className="w-5 h-5" strokeWidth={1.5} />
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Audit Log</div>
                                                                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">JSON Format</div>
                                                                </div>
                                                            </div>
                                                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 shadow-sm">
                                                                <Download className="w-4 h-4" strokeWidth={2} />
                                                            </div>
                                                        </button>
                                                    </div>

                                                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-center gap-2 text-[9px] text-slate-400 font-mono">
                                                        <ShieldCheck className="w-3 h-3 text-green-500" />
                                                        <span>SHA-256: 8f43...9a21</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Right Sidebar - Properties */}
                                <AnimatePresence mode="wait">
                                    {selectedNode && (
                                        <motion.div
                                            initial={{ x: 300, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: 300, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            className="w-72 border-l border-slate-100 bg-white p-4 z-20 shadow-xl"
                                        >
                                            <div className="flex items-center justify-between mb-6">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Properties</span>
                                                <button onClick={() => setSelectedNodeId(null)} className="p-1 hover:bg-slate-100 rounded">
                                                    <X className="w-4 h-4 text-slate-400" />
                                                </button>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-slate-600">Node Name</label>
                                                    <div className="p-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-900 font-medium">
                                                        {selectedNode.label}
                                                    </div>
                                                </div>

                                                {selectedNode.properties.map((prop, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <label className="text-xs font-medium text-slate-600">{prop.label}</label>

                                                        {prop.type === "readonly" && (
                                                            <div className="text-sm text-slate-500 font-mono">{prop.value}</div>
                                                        )}

                                                        {prop.type === "text" && (
                                                            <input
                                                                type="text"
                                                                defaultValue={prop.value}
                                                                className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                            />
                                                        )}

                                                        {prop.type === "select" && (
                                                            <select className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white">
                                                                {prop.options?.map(opt => (
                                                                    <option key={opt} value={opt}>{opt}</option>
                                                                ))}
                                                            </select>
                                                        )}

                                                        {prop.type === "tags" && (
                                                            <div className="space-y-1.5">
                                                                {prop.tags?.map(tag => (
                                                                    <div key={tag} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100">
                                                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                                        {tag}
                                                                    </div>
                                                                ))}
                                                                <button className="flex items-center gap-1 text-xs text-blue-600 font-medium mt-1">
                                                                    <Plus className="w-3 h-3" /> Add Entity
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Bottom Status Bar */}
                            <div className="h-8 border-t border-slate-100 bg-white flex items-center px-4 justify-between text-[10px] text-slate-400 z-20">
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-green-500 animate-pulse" : "bg-slate-300"}`} />
                                        {isRunning ? "Processing..." : "Ready"}
                                    </span>
                                    <span>v2.4.0</span>
                                </div>
                                <span>Auto-saved 2m ago</span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

function Node({ data, isSelected, onClick, status }: { data: NodeData, isSelected: boolean, onClick: any, status: "idle" | "processing" | "completed" }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600 border-blue-200",
        purple: "bg-purple-50 text-purple-600 border-purple-200",
        amber: "bg-amber-50 text-amber-600 border-amber-200",
        green: "bg-green-50 text-green-600 border-green-200",
    };

    return (
        <motion.div
            className={`absolute z-10 w-48 rounded-xl border shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all cursor-pointer ${isSelected ? "ring-2 ring-blue-500 ring-offset-2 border-blue-500" : "border-slate-200"
                }`}
            style={{ left: data.x, top: data.y }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            onClick={onClick}
            drag
            dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
            whileDrag={{ scale: 1.05, cursor: "grabbing" }}
        >
            {/* Header */}
            <div className={`h-1.5 w-full transition-colors ${status === "completed" ? "bg-green-500" :
                status === "processing" ? "bg-blue-500 animate-pulse" :
                    data.color === 'blue' ? 'bg-blue-500' :
                        data.color === 'purple' ? 'bg-purple-500' : 'bg-amber-500'
                }`} />

            <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                    <div className={`p-1.5 rounded-lg ${colors[data.color]} bg-opacity-50 relative`}>
                        <data.icon className="w-4 h-4" />
                        {status === "processing" && (
                            <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                                <Loader2 className="w-3 h-3 animate-spin text-slate-900" />
                            </div>
                        )}
                        {status === "completed" && (
                            <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                                <CheckCircle2 className="w-2 h-2" />
                            </div>
                        )}
                    </div>
                    <MoreVertical className="w-4 h-4 text-slate-300 hover:text-slate-600" />
                </div>
                <div>
                    <div className="font-semibold text-slate-900 text-sm">{data.label}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{data.sublabel}</div>
                </div>
            </div>

            {/* Ports */}
            <div className="absolute top-1/2 -left-1 w-2 h-2 rounded-full bg-slate-300 border border-white group-hover:bg-blue-400 transition-colors" />
            <div className="absolute top-1/2 -right-1 w-2 h-2 rounded-full bg-slate-300 border border-white group-hover:bg-blue-400 transition-colors" />
        </motion.div>
    );
}

function Connection({ start, end, isActive, isCompleted }: { start: { x: number, y: number }, end: { x: number, y: number }, isActive: boolean, isCompleted: boolean }) {
    return (
        <>
            <motion.path
                d={`M ${start.x} ${start.y} C ${start.x + 50} ${start.y}, ${end.x - 50} ${end.y}, ${end.x} ${end.y}`}
                fill="none"
                stroke={isCompleted ? "#22c55e" : isActive ? "#3b82f6" : "#cbd5e1"}
                strokeWidth={isActive ? "3" : "2"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                className="transition-colors duration-500"
            />
            {isActive && !isCompleted && <MovingCircle start={start} end={end} />}
        </>
    );
}

function MovingCircle({ start, end }: any) {
    return (
        <circle
            r="4"
            fill="#3b82f6"
            style={{
                offsetPath: `path("M ${start.x} ${start.y} C ${start.x + 50} ${start.y}, ${end.x - 50} ${end.y}, ${end.x} ${end.y}")`,
                animation: "moveAlongPath 1s linear infinite",
            } as React.CSSProperties}
        />
    );
}
