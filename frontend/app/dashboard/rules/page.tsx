"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Plus, X, ToggleLeft, ToggleRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";

export default function RulesPage() {
    const [customWords, setCustomWords] = useState<string[]>([]);
    const [newWord, setNewWord] = useState("");
    const [piiCategories, setPiiCategories] = useState({
        names: true,
        emails: true,
        phone: true,
        dates: true,
        creditCards: true,
    });

    useEffect(() => {
        const storedWords = localStorage.getItem("custom_redaction_words");
        if (storedWords) setCustomWords(JSON.parse(storedWords));

        const storedCats = localStorage.getItem("pii_categories");
        if (storedCats) setPiiCategories(JSON.parse(storedCats));
    }, []);

    const saveWords = (words: string[]) => {
        setCustomWords(words);
        localStorage.setItem("custom_redaction_words", JSON.stringify(words));
    };

    const addWord = () => {
        if (newWord.trim() && !customWords.includes(newWord.trim())) {
            saveWords([...customWords, newWord.trim()]);
            setNewWord("");
        }
    };

    const removeWord = (word: string) => {
        saveWords(customWords.filter(w => w !== word));
    };

    const toggleCategory = (key: keyof typeof piiCategories) => {
        const newCats = { ...piiCategories, [key]: !piiCategories[key] };
        setPiiCategories(newCats);
        localStorage.setItem("pii_categories", JSON.stringify(newCats));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                    Redaction <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Rules</span>
                </h1>
                <p className="text-lg text-slate-500">
                    Customize what gets redacted from your documents.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Custom Words Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <GlassCard className="h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-slate-900">Custom Blocklist</h3>
                        </div>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newWord}
                                onChange={(e) => setNewWord(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addWord()}
                                placeholder="Add word or phrase..."
                                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={addWord}
                                className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 overflow-y-auto max-h-[400px]">
                            {customWords.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-8">
                                    No custom rules added yet.
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {customWords.map((word, i) => (
                                        <span key={i} className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-700 shadow-sm">
                                            {word}
                                            <button onClick={() => removeWord(word)} className="text-slate-400 hover:text-red-500">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </motion.div>

                {/* PII Categories Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <GlassCard className="h-full">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-slate-900">PII Categories</h3>
                        </div>

                        <div className="space-y-4">
                            {Object.entries(piiCategories).map(([key, enabled]) => (
                                <div key={key} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                    <span className="capitalize text-slate-700 font-medium">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    <button
                                        onClick={() => toggleCategory(key as keyof typeof piiCategories)}
                                        className={`transition-colors ${enabled ? "text-blue-600" : "text-slate-300"}`}
                                    >
                                        {enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}
