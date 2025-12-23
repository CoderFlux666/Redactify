"use client";

import { motion } from "framer-motion";
import { Twitter, Github, Linkedin, Mail, ArrowRight, Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#0B1121] text-slate-400 border-t border-slate-800 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-white font-bold text-xl">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white">R</span>
                            </div>
                            Redactify
                        </div>
                        <p className="text-sm leading-relaxed">
                            Enterprise-grade redaction and data privacy platform.
                            Secure your documents with AI-powered precision.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm">
                            {["Features", "Integrations", "Enterprise", "Security", "Changelog"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-blue-400 transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm">
                            {["About Us", "Careers", "Blog", "Legal", "Contact"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-blue-400 transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Stay Updated</h4>
                        <p className="text-xs mb-4">Subscribe to our newsletter for the latest security updates.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <div>
                        &copy; 2025 Redactify Inc. All rights reserved.
                    </div>
                    <div className="flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by Redactify Team
                    </div>
                </div>
            </div>
        </footer>
    );
}
