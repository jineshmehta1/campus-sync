"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CRMShellLayout from "@/components/crm/crm-shell";
import { FileText, Loader2, CheckCircle, XCircle, ChevronDown, ChevronUp, Square, CheckSquare } from "lucide-react";

export default function StudentMCQPage() {
    const { data: session } = useSession();
    const studentId = (session?.user as any)?.id;

    const [mcqs, setMcqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStage, setFilterStage] = useState("ALL");
    const [answers, setAnswers] = useState<Record<string, number[]>>({});
    const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
    const [results, setResults] = useState<Record<string, boolean>>({});
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/mcq").then((r) => r.json()).then(setMcqs).catch(console.error).finally(() => setLoading(false));
    }, []);

    const toggleAnswer = (mcqId: string, optIdx: number) => {
        if (submitted[mcqId]) return;
        setAnswers((a) => {
            const cur = a[mcqId] || [];
            return { ...a, [mcqId]: cur.includes(optIdx) ? cur.filter((i) => i !== optIdx) : [...cur, optIdx] };
        });
    };

    const submitMCQ = async (mcq: any) => {
        const selected = answers[mcq.id] || [];
        if (selected.length === 0) { alert("Please select an answer"); return; }
        const correct = JSON.stringify([...selected].sort()) === JSON.stringify([...(mcq.correctOptions || [])].sort());
        setSubmitted((s) => ({ ...s, [mcq.id]: true }));
        setResults((r) => ({ ...r, [mcq.id]: correct }));

        if (studentId) {
            await fetch("/api/mcq/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId, mcqId: mcq.id, isCorrect: correct }),
            }).catch(console.error);
        }
    };

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
                <div className="bg-gradient-to-r from-[#0b1d3a] to-[#1a3a6a] rounded-2xl p-6 text-white">
                    <h1 className="text-2xl font-bold mb-1">MCQ Practice</h1>
                    <p className="text-sky-200 text-sm">Test your knowledge and track your progress</p>
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
                        <p className="text-sm">No MCQs available yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((mcq, idx) => {
                            const isSubmitted = submitted[mcq.id];
                            const isCorrect = results[mcq.id];
                            const selected = answers[mcq.id] || [];
                            const isOpen = expanded === mcq.id;

                            return (
                                <div key={mcq.id} className={`bg-white rounded-2xl border transition-all ${isSubmitted ? (isCorrect ? "border-emerald-200 shadow-emerald-50 shadow-md" : "border-red-200 shadow-red-50 shadow-md") : "border-gray-100 hover:shadow-md"}`}>
                                    <button onClick={() => setExpanded(isOpen ? null : mcq.id)} className="w-full p-5 text-left flex items-start gap-3">
                                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${isSubmitted ? (isCorrect ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "bg-indigo-50 text-indigo-600"}`}>
                                            {isSubmitted ? (isCorrect ? "✓" : "✗") : idx + 1}
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stageColors[mcq.stage]}`}>{mcq.stage}</span>
                                                {isSubmitted && (
                                                    <span className={`flex items-center gap-1 text-xs font-bold ${isCorrect ? "text-emerald-600" : "text-red-600"}`}>
                                                        {isCorrect ? <><CheckCircle size={12} /> Correct</> : <><XCircle size={12} /> Incorrect</>}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">{mcq.question}</p>
                                        </div>
                                        {isOpen ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                                    </button>

                                    {isOpen && (
                                        <div className="px-5 pb-5 border-t border-gray-50">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                                                {(Array.isArray(mcq.options) ? mcq.options : []).map((opt: string, i: number) => {
                                                    const isSel = selected.includes(i);
                                                    const isCorrectOpt = mcq.correctOptions?.includes(i);
                                                    let cls = "bg-gray-50 border-gray-200 text-gray-700";
                                                    if (isSubmitted) {
                                                        if (isCorrectOpt) cls = "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold";
                                                        else if (isSel && !isCorrectOpt) cls = "bg-red-50 border-red-200 text-red-700";
                                                    } else if (isSel) {
                                                        cls = "bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold";
                                                    }
                                                    return (
                                                        <button key={i} onClick={() => toggleAnswer(mcq.id, i)} disabled={isSubmitted}
                                                            className={`flex items-center gap-2 p-3 rounded-xl text-sm text-left border transition-all ${cls} disabled:cursor-default`}>
                                                            {isSel ? <CheckSquare size={14} className="shrink-0" /> : <Square size={14} className="shrink-0 text-gray-400" />}
                                                            <span>{opt}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {!isSubmitted && (
                                                <button onClick={() => submitMCQ(mcq)}
                                                    className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-bold hover:scale-[1.02] transition-all shadow-lg shadow-indigo-500/20">
                                                    Submit Answer
                                                </button>
                                            )}

                                            {isSubmitted && mcq.explanation && (
                                                <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                                    <p className="text-xs font-bold text-blue-700 mb-1">💡 Explanation</p>
                                                    <p className="text-sm text-blue-800">{mcq.explanation}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </CRMShellLayout>
    );
}
