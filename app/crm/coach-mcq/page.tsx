"use client";

import { useEffect, useState } from "react";
import CRMShellLayout from "@/components/crm/crm-shell";
import { FileText, Loader2, CheckSquare, Square, ChevronDown, ChevronUp } from "lucide-react";

export default function CoachMCQPage() {
    const [mcqs, setMcqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStage, setFilterStage] = useState("ALL");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/mcq").then((r) => r.json()).then(setMcqs).catch(console.error).finally(() => setLoading(false));
    }, []);

    const stageColors: Record<string, string> = {
        BEGINNER: "bg-emerald-50 text-emerald-700",
        INTERMEDIATE: "bg-sky-50 text-sky-700",
        ADVANCED: "bg-indigo-50 text-indigo-700",
        EXPERT: "bg-amber-50 text-amber-700",
    };

    const filtered = filterStage === "ALL" ? mcqs : mcqs.filter((m) => m.stage === filterStage);

    return (
        <CRMShellLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <FileText className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">MCQs with Solutions</h2>
                        <p className="text-xs text-gray-500">View all MCQs with correct answers</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"].map((s) => (
                        <button key={s} onClick={() => setFilterStage(s)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all border ${filterStage === s ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
                            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                        <FileText size={40} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No MCQs found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((mcq, idx) => (
                            <div key={mcq.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                                <button onClick={() => setExpandedId(expandedId === mcq.id ? null : mcq.id)}
                                    className="w-full p-5 text-left flex items-start gap-3">
                                    <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stageColors[mcq.stage] || "bg-gray-100 text-gray-600"}`}>{mcq.stage}</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">{mcq.question}</p>
                                    </div>
                                    {expandedId === mcq.id ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                                </button>

                                {expandedId === mcq.id && (
                                    <div className="px-5 pb-5 border-t border-gray-50">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                                            {(Array.isArray(mcq.options) ? mcq.options : []).map((opt: string, i: number) => {
                                                const isCorrect = mcq.correctOptions?.includes(i);
                                                return (
                                                    <div key={i} className={`flex items-center gap-2 p-2.5 rounded-xl text-sm ${isCorrect ? "bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold" : "bg-gray-50 border border-gray-100 text-gray-600"}`}>
                                                        {isCorrect ? <CheckSquare size={14} className="text-emerald-600 shrink-0" /> : <Square size={14} className="text-gray-400 shrink-0" />}
                                                        <span>{opt}</span>
                                                        {isCorrect && <span className="ml-auto text-[10px] font-bold text-emerald-600 uppercase">✓ Correct</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {mcq.explanation && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                                <p className="text-xs font-bold text-blue-700 mb-1">💡 Explanation</p>
                                                <p className="text-sm text-blue-800">{mcq.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </CRMShellLayout>
    );
}
