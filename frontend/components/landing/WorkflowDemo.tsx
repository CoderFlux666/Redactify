import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldCheck, Scan, FileText, AlertCircle, CheckCircle2, Eye, Download } from "lucide-react";

export function WorkflowDemo() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
    const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className="py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    style={{ opacity }}
                    className="text-center mb-20"
                >
                    <h2 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
                        See Redactify in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Action</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Our AI scans your documents in real-time, identifying and redacting sensitive information with surgical precision.
                    </p>
                </motion.div>

                <motion.div
                    style={{ scale, opacity }}
                    className="relative max-w-6xl mx-auto"
                >
                    {/* Background Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full opacity-50" />

                    <GlassCard className="relative h-[850px] bg-white/90 backdrop-blur-xl border-slate-200/50 shadow-2xl overflow-hidden flex flex-col rounded-2xl">
                        {/* App Header */}
                        <div className="h-16 border-b border-slate-100 flex items-center px-6 justify-between bg-white/80 backdrop-blur-sm z-20 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-2">
                                    <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
                                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400" />
                                    <div className="w-3.5 h-3.5 rounded-full bg-green-400" />
                                </div>
                                <div className="h-8 w-px bg-slate-200 mx-2" />
                                <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                    <div className="p-1.5 bg-blue-50 rounded-md">
                                        <FileText className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="font-semibold text-slate-900">employment_agreement_v2.pdf</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2 border border-emerald-100">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Protected
                                </div>
                                <div className="h-8 w-px bg-slate-200 mx-2" />
                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                                    <Eye className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Document Viewer */}
                            <div className="flex-1 bg-slate-100/50 p-8 overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                <style jsx global>{`
                                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
                                `}</style>
                                <div className="max-w-4xl mx-auto bg-white shadow-2xl border border-slate-200 min-h-[1000px] p-20 relative">
                                    {/* Paper Texture Overlay */}
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 pointer-events-none" />

                                    {/* Watermark */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                                        <div className="text-slate-50 text-[150px] font-black -rotate-45 uppercase tracking-widest select-none opacity-60" style={{ fontFamily: "'Playfair Display', serif" }}>
                                            Confidential
                                        </div>
                                    </div>

                                    {/* Scanning Line */}
                                    <motion.div
                                        className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] z-20"
                                        animate={{ top: ["0%", "100%"] }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
                                    />

                                    {/* Document Content */}
                                    <div className="relative z-10 text-slate-900 space-y-10 text-lg leading-loose" style={{ fontFamily: "'Lora', serif" }}>
                                        <div className="text-center mb-20 border-b-4 border-slate-900 pb-10">
                                            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-widest mb-8 text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                                                Confidential<br />Employment Agreement
                                            </h1>
                                            <div className="flex justify-between items-end text-sm font-bold text-slate-600 uppercase tracking-widest mt-8 font-sans">
                                                <span>Ref: EMP-2024-892</span>
                                                <span className="px-4 py-1.5 border-2 border-slate-900 text-slate-900 bg-white">Strictly Private</span>
                                            </div>
                                        </div>

                                        <p className="text-justify indent-16 text-xl leading-9 font-medium text-slate-800">
                                            This Employment Agreement ("Agreement") is made and entered into as of <RedactedText delay={0}>October 12, 2024</RedactedText>, by and between <span className="font-bold text-black border-b-2 border-black">Global Corp Inc.</span> ("Employer"), a Delaware corporation, and <RedactedText delay={2}>Johnathan Doe</RedactedText> ("Employee"). The Employer and Employee may be referred to individually as a "Party" and collectively as the "Parties."
                                        </p>

                                        <div className="pl-10 border-l-[6px] border-slate-900 my-12 py-6 bg-slate-50">
                                            <h3 className="font-black text-lg uppercase tracking-widest text-slate-900 mb-8 font-sans flex items-center gap-3">
                                                <span className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded text-sm">1</span>
                                                Employee Information
                                            </h3>
                                            <div className="grid grid-cols-2 gap-y-10 gap-x-16">
                                                <div>
                                                    <span className="text-xs uppercase tracking-widest text-slate-500 block mb-3 font-sans font-bold">Full Legal Name</span>
                                                    <div className="text-xl"><RedactedText delay={2}>Johnathan Doe</RedactedText></div>
                                                </div>
                                                <div>
                                                    <span className="text-xs uppercase tracking-widest text-slate-500 block mb-3 font-sans font-bold">Social Security Number</span>
                                                    <div className="text-xl"><RedactedText delay={3}>XXX-XX-1234</RedactedText></div>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-xs uppercase tracking-widest text-slate-500 block mb-3 font-sans font-bold">Residential Address</span>
                                                    <div className="text-xl"><RedactedText delay={4}>123 Maple Avenue, San Francisco, CA 94105</RedactedText></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pl-10 border-l-[6px] border-slate-900 my-12 py-6 bg-slate-50">
                                            <h3 className="font-black text-lg uppercase tracking-widest text-slate-900 mb-8 font-sans flex items-center gap-3">
                                                <span className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded text-sm">2</span>
                                                Compensation & Benefits
                                            </h3>
                                            <p className="text-justify text-xl leading-9 font-medium text-slate-800">
                                                The Employer shall pay the Employee a base salary of <RedactedText delay={5}>$150,000</RedactedText> per annum, payable in accordance with the Employer's standard payroll schedule. Direct deposit shall be made to <RedactedText delay={6}>Chase Bank</RedactedText>, Account Number <RedactedText delay={7}>987654321</RedactedText>.
                                            </p>
                                        </div>

                                        <div className="mt-20 pt-16 border-t-2 border-slate-200 flex justify-between items-center">
                                            <div className="text-center">
                                                <div className="w-72 h-0.5 bg-slate-900 mb-4"></div>
                                                <span className="text-xs uppercase tracking-widest text-slate-500 font-bold font-sans">Employer Signature</span>
                                            </div>
                                            <div className="text-center">
                                                <div className="w-72 h-0.5 bg-slate-900 mb-4"></div>
                                                <span className="text-xs uppercase tracking-widest text-slate-500 font-bold font-sans">Employee Signature</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Analysis Sidebar */}
                            <div className="w-96 border-l border-slate-100 bg-white flex flex-col z-20 shrink-0 shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.05)]">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                                        <Scan className="w-4 h-4 text-blue-500" />
                                        Analysis Results
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1.5 font-medium uppercase tracking-wide">Real-time PII detection</p>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    <AnalysisItem type="Person" value="Johnathan Doe" confidence={99} delay={2} />
                                    <AnalysisItem type="Date" value="Oct 12, 2024" confidence={98} delay={0} />
                                    <AnalysisItem type="SSN" value="XXX-XX-1234" confidence={99} delay={3} />
                                    <AnalysisItem type="Address" value="123 Maple Ave..." confidence={95} delay={4} />
                                    <AnalysisItem type="Financial" value="$150,000" confidence={92} delay={5} />
                                    <AnalysisItem type="Bank Acct" value="987654321" confidence={99} delay={7} />
                                </div>

                                <div className="p-6 bg-slate-50 border-t border-slate-100">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Redactions</span>
                                        <span className="text-sm font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">7</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            className="bg-blue-600 h-full rounded-full"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "85%" }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </section>
    );
}

function RedactedText({ children, delay }: { children: React.ReactNode, delay: number }) {
    return (
        <span className="relative inline-block font-mono text-xs bg-slate-100 px-1 rounded text-slate-800">
            <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: delay, duration: 0.1, repeat: Infinity, repeatDelay: 5, repeatType: "reverse" }}
            >
                {children}
            </motion.span>
            <motion.span
                className="absolute inset-0 bg-slate-900 rounded-sm flex items-center justify-center"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: delay, duration: 0.2, repeat: Infinity, repeatDelay: 5, repeatType: "reverse" }}
                style={{ originX: 0 }}
            >
                <span className="text-[8px] text-slate-600 tracking-widest opacity-0">REDACTED</span>
            </motion.span>
        </span>
    );
}

function AnalysisItem({ type, value, confidence, delay }: any) {
    return (
        <motion.div
            className="p-3 rounded-lg border border-slate-100 bg-white shadow-sm flex items-start gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay }}
        >
            <div className={`mt-0.5 w-2 h-2 rounded-full ${confidence > 95 ? 'bg-green-500' : 'bg-amber-500'}`} />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-700">{type}</span>
                    <span className="text-[10px] text-slate-400">{confidence}%</span>
                </div>
                <div className="text-xs text-slate-500 truncate font-mono bg-slate-50 px-1.5 py-0.5 rounded">
                    {value}
                </div>
            </div>
        </motion.div>
    );
}
