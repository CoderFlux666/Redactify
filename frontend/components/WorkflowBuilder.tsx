"use client";

import { useState } from "react";
import {
    Layers,
    Search,
    FileText,
    Shield,
    Play,
    Settings,
    Bot,
    Lock,
    ArrowRight,
    FileJson,
    Database,
    MoreHorizontal,
    X,
    Plus,
    GripVertical
} from "lucide-react";
import { motion } from "framer-motion";

export function WorkflowBuilder() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Visual Builder */}
            <div className="order-2 lg:order-1 relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-slate-200 rounded-3xl opacity-0 group-hover:opacity-50 blur-2xl transition-opacity duration-700" />

                <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden aspect-[4/3] flex flex-col md:flex-row">
                    {/* Toolbar Sidebar */}
                    <div className="w-full md:w-16 border-b md:border-b-0 md:border-r border-slate-100 flex flex-row md:flex-col items-center py-2 md:py-4 gap-2 md:gap-4 bg-slate-50/50 px-4 md:px-0 justify-between md:justify-start">
                        <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-200 text-blue-600 cursor-pointer"><FileText className="w-5 h-5" /></div>
                        <div className="p-2 rounded-lg hover:bg-white hover:shadow-sm hover:border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"><Bot className="w-5 h-5" /></div>
                        <div className="p-2 rounded-lg hover:bg-white hover:shadow-sm hover:border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"><Lock className="w-5 h-5" /></div>
                        <div className="p-2 rounded-lg hover:bg-white hover:shadow-sm hover:border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"><ArrowRight className="w-5 h-5" /></div>
                        <div className="md:mt-auto p-2 text-slate-400 hover:text-slate-600 cursor-pointer"><Settings className="w-5 h-5" /></div>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
                        {/* Grid Background */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.4]"
                            style={{
                                backgroundImage: `linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)`,
                                backgroundSize: '24px 24px'
                            }}
                        />

                        {/* Header Overlay */}
                        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-slate-100 z-20">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-semibold text-slate-700">PII Redaction Pipeline</span>
                            </div>
                            <button className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm">
                                <Play className="w-3 h-3 fill-current" /> Run Pipeline
                            </button>
                        </div>

                        {/* Nodes Container */}
                        <div className="flex-1 relative p-6 overflow-y-auto">
                            {/* SVG Connections Layer */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                {/* Line 1: Input -> Redaction */}
                                <path d="M 160 90 C 160 120, 160 120, 160 150" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                                {/* Line 2: Redaction -> Export */}
                                <path d="M 160 220 C 160 250, 160 250, 160 280" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                            </svg>

                            <div className="space-y-10 mt-12 relative z-10 pl-8">
                                {/* Node 1: Input */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm w-64 group/node hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                            <FileJson className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">Input Dataset</p>
                                            <p className="text-[11px] text-slate-500 truncate">customer_chat_logs.jsonl</p>
                                        </div>
                                        <GripVertical className="w-4 h-4 text-slate-300 ml-auto opacity-0 group-hover/node:opacity-100 transition-opacity" />
                                    </div>
                                </motion.div>

                                {/* Node 2: PII Redaction (Active) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white p-3 rounded-xl border-2 border-blue-500 shadow-lg shadow-blue-500/10 w-64 relative"
                                >
                                    {/* Connection Points */}
                                    <div className="absolute -top-1.5 left-8 w-3 h-3 bg-white border-2 border-blue-500 rounded-full z-20" />
                                    <div className="absolute -bottom-1.5 left-8 w-3 h-3 bg-white border-2 border-blue-500 rounded-full z-20" />

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">PII Redaction</p>
                                            <p className="text-[11px] text-slate-500 truncate">Presidio + Faker</p>
                                        </div>
                                        <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    </div>
                                </motion.div>

                                {/* Node 3: Export */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm w-64 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
                                            <Database className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">Export Clean</p>
                                            <p className="text-[11px] text-slate-500 truncate">training_ready.csv</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Properties Panel (Right Side) */}
                    <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-100 bg-white/50 backdrop-blur-sm flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Properties</span>
                            <button className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-5 space-y-6 overflow-y-auto custom-scrollbar">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-700">Node Name</label>
                                <input type="text" value="PII Redaction" className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" readOnly />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-700">Redaction Mode</label>
                                <div className="relative">
                                    <select className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                        <option>Strict (High Recall)</option>
                                        <option>Balanced</option>
                                        <option>Loose (High Precision)</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-slate-700">Active Entities</label>
                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">3 Active</span>
                                </div>
                                <div className="space-y-2">
                                    {['Credit Card', 'SSN', 'Email Address', 'Phone Number'].map((entity, i) => (
                                        <div key={entity} className="flex items-center gap-3 text-sm text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group/item">
                                            <div className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-blue-500' : 'bg-slate-300'}`} />
                                            <span className={i >= 3 ? 'text-slate-400' : ''}>{entity}</span>
                                            {i < 3 && <CheckCircleIcon className="w-3.5 h-3.5 text-blue-500 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" />}
                                        </div>
                                    ))}
                                    <button className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs font-medium text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center gap-1.5">
                                        <Plus className="w-3 h-3" /> Add Custom Entity
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-slate-700">Confidence Threshold</label>
                                    <span className="text-xs font-mono text-slate-500">0.90</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[90%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Description */}
            <div className="order-1 lg:order-2 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                    <Layers className="w-4 h-4" />
                    <span>Visual Pipeline Builder</span>
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                        Build Custom <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Redaction Workflows</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Design your own privacy pipelines with our intuitive drag-and-drop builder. Connect inputs, choose your AI models, define custom rules, and output to any format—all without writing a single line of code.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        { icon: Layers, title: "Drag & Drop", desc: "Intuitive visual interface" },
                        { icon: Search, title: "Custom Regex", desc: "Define specific patterns" },
                        { icon: FileText, title: "Multi-Format", desc: "PDF, JSON, TXT support" },
                        { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 shrink-0">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CheckCircleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
