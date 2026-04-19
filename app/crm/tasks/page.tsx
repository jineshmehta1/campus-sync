"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CRMShellLayout from "@/components/crm/crm-shell";
import { ClipboardList, Plus, Trash2, X, Loader2, Users, Eye } from "lucide-react";

export default function TasksPage() {
    const { data: session } = useSession();
    const coachId = (session?.user as any)?.id;
    const userRole = ((session?.user as any)?.role || "").toUpperCase();

    const [tasks, setTasks] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewTask, setViewTask] = useState<any>(null);
    const [form, setForm] = useState({ title: "", description: "", dueDate: "", batchId: "" });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tasksRes, batchesRes] = await Promise.all([
                fetch(`/api/tasks?createdById=${coachId}`),
                fetch(`/api/classes?coachId=${coachId}`),
            ]);
            if (tasksRes.ok) setTasks(await tasksRes.json());
            if (batchesRes.ok) setBatches(await batchesRes.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (coachId) fetchData(); }, [coachId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) { setIsModalOpen(false); setForm({ title: "", description: "", dueDate: "", batchId: "" }); fetchData(); }
        else alert("Failed to create task");
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this task?")) return;
        await fetch("/api/tasks", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
        fetchData();
    };

    return (
        <CRMShellLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                            <ClipboardList className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Tasks ({tasks.length})</h2>
                            <p className="text-xs text-gray-500">Assign tasks to batches — students submit image responses</p>
                        </div>
                    </div>
                    <button onClick={() => { setForm({ title: "", description: "", dueDate: "", batchId: "" }); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold shadow-lg hover:scale-[1.02] transition-all">
                        <Plus size={16} /> Assign Task
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-orange-500 animate-spin" /></div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                        <ClipboardList className="mx-auto mb-3 text-gray-300" size={40} />
                        <p className="text-sm font-medium">No tasks assigned yet</p>
                        <p className="text-xs mt-1">Assign a task to a batch</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div key={task.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all group">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h3 className="text-base font-bold text-gray-900">{task.title}</h3>
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full">{task.batch?.name}</span>
                                        </div>
                                        {task.description && <p className="text-sm text-gray-500 mb-2">{task.description}</p>}
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Users size={12} />
                                                {task.submissions?.length || 0} submission(s)
                                            </span>
                                            {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                                            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => setViewTask(task)} className="p-2 hover:bg-sky-50 rounded-xl text-gray-400 hover:text-sky-600"><Eye size={15} /></button>
                                        <button onClick={() => handleDelete(task.id)} className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600"><Trash2 size={15} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex justify-between items-center p-5 border-b">
                            <h3 className="text-lg font-bold">Assign New Task</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Task Title *</label>
                                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-orange-400/30 outline-none" placeholder="e.g. Chapter 3 Exercise" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description</label>
                                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm resize-none h-20 focus:ring-2 focus:ring-orange-400/30 outline-none" placeholder="Task instructions..." />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Assign to Batch *</label>
                                <select required value={form.batchId} onChange={(e) => setForm({ ...form, batchId: e.target.value })}
                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-orange-400/30 outline-none">
                                    <option value="">Select batch...</option>
                                    {batches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Due Date</label>
                                <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-orange-400/30 outline-none" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold hover:scale-[1.02] transition-all">Assign Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Submissions Modal */}
            {viewTask && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-5 border-b">
                            <div>
                                <h3 className="text-lg font-bold">{viewTask.title}</h3>
                                <p className="text-xs text-gray-500">{viewTask.submissions?.length || 0} submissions</p>
                            </div>
                            <button onClick={() => setViewTask(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
                        </div>
                        <div className="p-5">
                            {viewTask.submissions?.length === 0 ? (
                                <p className="text-center text-gray-400 py-8 text-sm">No submissions yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {viewTask.submissions?.map((sub: any) => (
                                        <div key={sub.id} className="border border-gray-100 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-semibold text-sm text-gray-900">{sub.student?.name || "Student"}</span>
                                                <span className="text-xs text-gray-400">{new Date(sub.submittedAt).toLocaleString()}</span>
                                            </div>
                                            <img src={sub.imageUrl} alt="Submission" className="w-full max-h-60 object-contain rounded-lg border border-gray-100" />
                                            {sub.remarks && <p className="text-xs text-gray-500 mt-2">{sub.remarks}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </CRMShellLayout>
    );
}
