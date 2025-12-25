"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Shield, Plus, Trash2, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";

interface PiiCategories {
    names: boolean;
    emails: boolean;
    phone: boolean;
    dates: boolean;
    credit_cards: boolean;
    [key: string]: boolean;
}

export default function RedactionRulesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [blocklist, setBlocklist] = useState<string[]>([]);
    const [newWord, setNewWord] = useState("");
    const [piiRules, setPiiRules] = useState<PiiCategories>({
        names: true,
        emails: true,
        phone: true,
        dates: true,
        credit_cards: true,
    });


    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchRules = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUser(user);

            try {
                const { data, error } = await supabase
                    .from('redaction_rules')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching rules:', error);
                }

                if (data) {
                    setBlocklist(data.blocklist || []);
                    setPiiRules(data.pii_categories || {
                        names: true,
                        emails: true,
                        phone: true,
                        dates: true,
                        credit_cards: true,
                    });
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRules();
    }, [supabase]);

    const saveRules = async (updatedBlocklist?: string[], updatedPiiRules?: PiiCategories) => {
        if (!user) return;
        setIsSaving(true);

        const rulesToSave = {
            user_id: user.id,
            blocklist: updatedBlocklist ?? blocklist,
            pii_categories: updatedPiiRules ?? piiRules,
            updated_at: new Date().toISOString(),
        };

        try {
            const { error } = await supabase
                .from('redaction_rules')
                .upsert(rulesToSave, { onConflict: 'user_id' });

            if (error) throw error;
        } catch (error) {
            console.error('Error saving rules:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggle = (key: string) => {
        const newRules = { ...piiRules, [key]: !piiRules[key] };
        setPiiRules(newRules);
        saveRules(undefined, newRules);
    };

    const addBlocklistWord = () => {
        if (!newWord.trim()) return;
        if (blocklist.includes(newWord.trim())) return;

        const newBlocklist = [...blocklist, newWord.trim()];
        setBlocklist(newBlocklist);
        setNewWord("");
        saveRules(newBlocklist, undefined);
    };

    const removeBlocklistWord = (word: string) => {
        const newBlocklist = blocklist.filter(w => w !== word);
        setBlocklist(newBlocklist);
        saveRules(newBlocklist, undefined);
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Redaction <span className="text-blue-600">Rules</span></h1>
                <p className="text-slate-500">Customize what gets redacted from your documents.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Custom Blocklist */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Custom Blocklist</h3>
                            <p className="text-sm text-slate-500">Add specific words to redact</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newWord}
                            onChange={(e) => setNewWord(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addBlocklistWord()}
                            placeholder="Add word or phrase..."
                            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <button
                            onClick={addBlocklistWord}
                            className="bg-slate-900 text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="min-h-[200px] bg-slate-50 rounded-xl p-4 border border-slate-100">
                        {blocklist.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                                No custom rules added yet.
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {blocklist.map((word) => (
                                    <motion.div
                                        key={word}
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium flex items-center gap-2 group"
                                    >
                                        {word}
                                        <button
                                            onClick={() => removeBlocklistWord(word)}
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* PII Categories */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">PII Categories</h3>
                            <p className="text-sm text-slate-500">Toggle sensitive data types</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {Object.entries(piiRules).map(([key, enabled]) => (
                            <div key={key} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                                <span className="font-medium text-slate-700 capitalize">
                                    {key.replace('_', ' ')}
                                </span>
                                <button
                                    onClick={() => handleToggle(key)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isSaving && (
                <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-bottom-4">
                    <Save className="w-4 h-4" />
                    Saving changes...
                </div>
            )}
        </div>
    );
}
