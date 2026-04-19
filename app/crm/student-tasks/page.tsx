"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import CRMShellLayout from "@/components/crm/crm-shell";
import { ListTodo, Loader2, Upload, CheckCircle, Calendar, X, Image as ImageIcon } from "lucide-react";

export default function StudentTasksPage() {
    const { data: session } = useSession();
    const studentId = (session?.user as any)?.id;

    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState<string | null>(null);
    const [uploadModalTask, setUploadModalTask] = useState<any>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [remarks, setRemarks] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchTasks = async () => {
        if (!studentId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/tasks?studentId=${studentId}`);
            if (res.ok) setTasks(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchTasks(); }, [studentId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", "aimchess");
        fd.append("cloud_name", "dieciekpa");
        const res = await fetch("https://api.cloudinary.com/v1_1/dieciekpa/image/upload", { method: "POST", body: fd });
        const data = await res.json();
        return data.secure_url;
    };

    const handleSubmit = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) { alert("Please select an image to submit"); return; }
        setUploading(true);
        try {
            const imageUrl = await uploadToCloudinary(file);
            const res = await fetch("/api/tasks/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskId: uploadModalTask.id, imageUrl, remarks }),
            });
            if (res.ok) {
                setUploadModalTask(null);
                setPreviewUrl("");
                setRemarks("");
                fetchTasks();
            } else alert("Failed to submit task");
        } catch (e) {
            console.error(e);
            alert("Upload failed. Please try again.");
        } finally { setUploading(false); }
    };

    const isSubmitted = (task: any) => task.submissions?.some((s: any) => s.studentId === studentId);
    const getSubmission = (task: any) => task.submissions?.find((s: any) => s.studentId === studentId);

    return (
        <CRMShellLayout>
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#0b1d3a] to-[#1a3a6a] rounded-2xl p-6 text-white">
                    <h1 className="text-2xl font-bold mb-1">My Tasks</h1>
                    <p className="text-sky-200 text-sm">Submit your task answers as images</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-orange-500 animate-spin" /></div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                        <ListTodo size={40} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No tasks assigned yet</p>
                        <p className="text-xs mt-1">Your teacher will assign tasks to your batch</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task) => {
                            const submitted = isSubmitted(task);
                            const submission = getSubmission(task);
                            return (
                                <div key={task.id} className={`bg-white rounded-2xl border p-5 transition-all ${submitted ? "border-emerald-200" : "border-gray-100 hover:shadow-md"}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className="text-base font-bold text-gray-900">{task.title}</h3>
                                                {submitted && (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                        <CheckCircle size={11} /> Submitted
                                                    </span>
                                                )}
                                            </div>
                                            {task.description && <p className="text-sm text-gray-500 mb-2">{task.description}</p>}
                                            <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded-full">{task.batch?.name}</span>
                                                {task.dueDate && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={11} />
                                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {!submitted ? (
                                            <button onClick={() => { setUploadModalTask(task); setPreviewUrl(""); setRemarks(""); }}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold shadow-lg hover:scale-[1.02] transition-all shrink-0">
                                                <Upload size={14} /> Submit
                                            </button>
                                        ) : (
                                            <button onClick={() => { setUploadModalTask(task); setPreviewUrl(submission?.imageUrl || ""); setRemarks(submission?.remarks || ""); }}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-200 hover:bg-emerald-100 transition-all shrink-0">
                                                <ImageIcon size={14} /> View
                                            </button>
                                        )}
                                    </div>

                                    {submitted && submission?.imageUrl && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Your Submission</p>
                                            <img src={submission.imageUrl} alt="Submission" className="max-h-32 rounded-xl border border-gray-100 object-contain" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {uploadModalTask && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-5 border-b">
                            <div>
                                <h3 className="text-lg font-bold">Submit Task</h3>
                                <p className="text-xs text-gray-500">{uploadModalTask.title}</p>
                            </div>
                            <button onClick={() => setUploadModalTask(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Upload Image *</label>
                                <div onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                                    ) : (
                                        <div>
                                            <Upload size={32} className="mx-auto mb-2 text-gray-300" />
                                            <p className="text-sm text-gray-500">Click to upload image</p>
                                            <p className="text-xs text-gray-400 mt-1">JPG, PNG, or JPEG</p>
                                        </div>
                                    )}
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                {previewUrl && (
                                    <button onClick={() => { setPreviewUrl(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                        className="mt-2 text-xs text-red-500 hover:underline">Remove image</button>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Remarks (optional)</label>
                                <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)}
                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm resize-none h-16 focus:ring-2 focus:ring-orange-400/30 outline-none"
                                    placeholder="Any notes about your submission..." />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setUploadModalTask(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button onClick={handleSubmit} disabled={uploading || !previewUrl}
                                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                    {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : <><Upload size={14} /> Submit</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </CRMShellLayout>
    );
}
