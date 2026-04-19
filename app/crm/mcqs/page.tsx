"use client";

import { useEffect, useState } from "react";
import CRMShellLayout from "@/components/crm/crm-shell";
import { FileText, Plus, Trash2, X, Loader2, CheckSquare, Square, Edit } from "lucide-react";

export default function MCQsPage() {
    const [mcqs, setMcqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMcq, setEditingMcq] = useState<any>(null);
    const [filterStage, setFilterStage] = useState("ALL");
    const [form, setForm] = useState({
        question: "",
        options: ["", "", "", ""],
        correctOptions: [] as number[],
        explanation: "",
        stage: "BEGINNER",
    });

    const fetchMcqs = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/mcq");
            if (res.ok) setMcqs(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchMcqs(); }, []);

    const openCreate = () => {
        setEditingMcq(null);
        setForm({ question: "", options: ["", "", "", ""], correctOptions: [], explanation: "", stage: "BEGINNER" });
        setIsModalOpen(true);
    };

    const openEdit = (mcq: any) => {
        setEditingMcq(mcq);
        const opts = Array.isArray(mcq.options) ? mcq.options : [];
        while (opts.length < 4) opts.push("");
        setForm({ question: mcq.question, options: opts, correctOptions: mcq.correctOptions || [], explanation: mcq.explanation || "", stage: mcq.stage || "BEGINNER" });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.correctOptions.length === 0) { alert("Select at least one correct option"); return; }
        const filledOptions = form.options.filter(Boolean);
        if (filledOptions.length < 2) { alert("Please fill in at least 2 options"); return; }

        const payload = { ...form, position: "" };
        const method = editingMcq ? "PUT" : "POST";
        const body = editingMcq ? { ...payload, id: editingMcq.id } : payload;

        const res = await fetch("/api/mcq", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (res.ok) { setIsModalOpen(false); fetchMcqs(); }
        else alert("Failed to save MCQ");
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this MCQ?")) return;
        await fetch(`/api/mcq/${id}`, { method: "DELETE" });
        fetchMcqs();
    };

    const toggleOption = (idx: number) => {
        setForm((f) => ({
            ...f,
            correctOptions: f.correctOptions.includes(idx)
                ? f.correctOptions.filter((i) => i !== idx)
                : [...f.correctOptions, idx],
        }));
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <FileText className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">MCQs ({mcqs.length})</h2>
                            <p className="text-xs text-gray-500">Manage multiple choice questions</p>
                        </div>
                    </div>
                    <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-bold shadow-lg hover:scale-[1.02] transition-all">
                        <Plus size={16} /> Add MCQ
                    </button>
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
                        <FileText className="mx-auto mb-3 text-gray-300" size={40} />
                        <p className="text-sm font-medium">No MCQs found</p>
                        <p className="text-xs mt-1">Click &quot;Add MCQ&quot; to create one</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((mcq, idx) => (
                            <div key={mcq.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all group">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stageColors[mcq.stage] || "bg-gray-100 text-gray-600"}`}>{mcq.stage}</span>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900 mb-2">{mcq.question}</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                                {(Array.isArray(mcq.options) ? mcq.options : []).map((opt: string, i: number) => (
                                                    <div key={i} className={`flex items-center gap-2 text-xs py-1.5 px-2.5 rounded-lg ${mcq.correctOptions?.includes(i) ? "bg-emerald-50 text-emerald-700 font-semibold" : "bg-gray-50 text-gray-600"}`}>
                                                        {mcq.correctOptions?.includes(i) ? <CheckSquare size={12} className="shrink-0 text-emerald-600" /> : <Square size={12} className="shrink-0 text-gray-400" />}
                                                        <span className="truncate">{opt}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            {mcq.explanation && (
                                                <p className="text-xs text-gray-400 mt-2 italic">💡 {mcq.explanation}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                        <button onClick={() => openEdit(mcq)} className="p-2 hover:bg-sky-50 rounded-lg text-gray-400 hover:text-sky-600"><Edit size={15} /></button>
                                        <button onClick={() => handleDelete(mcq.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600"><Trash2 size={15} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-5 border-b">
                            <h3 className="text-lg font-bold text-gray-900">{editingMcq ? "Edit MCQ" : "Create MCQ"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Question *</label>
                                <textarea required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })}
                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm resize-none h-20 focus:ring-2 focus:ring-indigo-400/30 outline-none" placeholder="Enter your question..." />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Options (check correct answers)</label>
                                {form.options.map((opt, idx) => (
                                    <div key={idx} className="flex items-center gap-2 mb-2">
                                        <button type="button" onClick={() => toggleOption(idx)}
                                            className={`p-1.5 rounded-lg transition-all ${form.correctOptions.includes(idx) ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                                            {form.correctOptions.includes(idx) ? <CheckSquare size={16} /> : <Square size={16} />}
                                        </button>
                                        <input value={opt} onChange={(e) => {
                                            const opts = [...form.options];
                                            opts[idx] = e.target.value;
                                            setForm({ ...form, options: opts });
                                        }} className="flex-1 border border-gray-200 p-2 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400/30 outline-none"
                                            placeholder={`Option ${idx + 1}`} />
                                    </div>
                                ))}
                                <p className="text-[11px] text-gray-400 mt-1">Click the checkbox to mark correct answer(s)</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Explanation (optional)</label>
                                <textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm resize-none h-16 focus:ring-2 focus:ring-indigo-400/30 outline-none" placeholder="Explain the answer..." />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Difficulty</label>
                                <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}
                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400/30 outline-none">
                                    <option value="BEGINNER">Beginner</option>
                                    <option value="INTERMEDIATE">Intermediate</option>
                                    <option value="ADVANCED">Advanced</option>
                                    <option value="EXPERT">Expert</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-bold shadow-lg hover:scale-[1.02] transition-all">
                                    {editingMcq ? "Save Changes" : "Create MCQ"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </CRMShellLayout>
    );
}
