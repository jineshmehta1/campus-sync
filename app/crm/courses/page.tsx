"use client";

import React, { useEffect, useState } from "react";
import CRMShellLayout from "@/components/crm/crm-shell";
import { BookOpen, Plus, Edit, Trash2, ArrowLeft, Save, Loader2, X, Filter, Video, FileText } from "lucide-react";

function getYouTubeEmbedUrl(url: string): string | null {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
}

export default function CoursesPage() {
    const [view, setView] = useState<"LIST" | "EDIT_COURSE">("LIST");
    const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
    const [courses, setCourses] = useState<any[]>([]);
    const [editingCourse, setEditingCourse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeChapterIndex, setActiveChapterIndex] = useState<number>(-1);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/courses");
            if (res.ok) setCourses(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCourses(); }, []);

    const handleCreateCourse = () => {
        setEditingCourse({ title: "", description: "", level: "BEGINNER", chapters: [] });
        setView("EDIT_COURSE");
        setActiveChapterIndex(-1);
    };

    const handleDeleteCourse = async (id: string) => {
        if (!confirm("Delete this course?")) return;
        await fetch("/api/courses", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
        fetchCourses();
    };

    const saveCourse = async () => {
        const method = editingCourse.id ? "PUT" : "POST";
        const res = await fetch("/api/courses", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingCourse) });
        if (res.ok) { fetchCourses(); setView("LIST"); }
        else alert("Failed to save course");
    };

    const levelColors: Record<string, string> = {
        BEGINNER: "bg-emerald-50 text-emerald-700 border-emerald-200",
        INTERMEDIATE: "bg-sky-50 text-sky-700 border-sky-200",
        ADVANCED: "bg-indigo-50 text-indigo-700 border-indigo-200",
        EXPERT: "bg-amber-50 text-amber-700 border-amber-200",
    };

    if (view === "LIST") {
        const filtered = selectedLevel === "ALL" ? courses : courses.filter((c) => c.level === selectedLevel);
        return (
            <CRMShellLayout>
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg">
                                <BookOpen className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Courses ({courses.length})</h2>
                                <p className="text-xs text-gray-500">Manage courses with YouTube video lessons</p>
                            </div>
                        </div>
                        <button onClick={handleCreateCourse}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold shadow-lg hover:scale-[1.02] transition-all">
                            <Plus size={16} /> Create Course
                        </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Filter size={16} className="text-gray-400" />
                        {["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"].map((lvl) => (
                            <button key={lvl} onClick={() => setSelectedLevel(lvl)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all border ${selectedLevel === lvl ? "bg-gray-900 text-white border-gray-900 shadow-md" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
                                {lvl === "ALL" ? "All" : lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                            <BookOpen className="mx-auto mb-3 text-gray-300" size={40} />
                            <p className="text-sm font-medium">No courses found</p>
                            <p className="text-xs mt-1">Click &quot;Create Course&quot; to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map((c) => (
                                <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all group flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border ${levelColors[c.level] || "bg-gray-100 text-gray-700 border-gray-200"}`}>{c.level}</span>
                                            <button onClick={() => handleDeleteCourse(c.id)} className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{c.title}</h3>
                                        {c.description && <p className="text-xs text-gray-400 line-clamp-2 mb-2">{c.description}</p>}
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Video size={12} />
                                            <span>{c.chapters?.length || 0} Lessons</span>
                                        </div>
                                    </div>
                                    <button onClick={() => { setEditingCourse({ ...c, chapters: c.chapters || [] }); setView("EDIT_COURSE"); setActiveChapterIndex(-1); }}
                                        className="w-full mt-4 bg-sky-50 border border-sky-200 hover:bg-sky-100 text-sky-700 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                                        <Edit size={14} /> Edit Course
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CRMShellLayout>
        );
    }

    // EDIT COURSE VIEW
    const activeChapter = activeChapterIndex >= 0 ? editingCourse.chapters[activeChapterIndex] : null;

    const updateChapter = (key: string, val: string) => {
        const nc = [...editingCourse.chapters];
        nc[activeChapterIndex] = { ...nc[activeChapterIndex], [key]: val };
        setEditingCourse({ ...editingCourse, chapters: nc });
    };

    return (
        <CRMShellLayout>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
                <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setView("LIST")} className="hover:bg-gray-100 p-2 rounded-xl text-gray-500"><ArrowLeft size={20} /></button>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{editingCourse.title || "New Course"}</h2>
                            <p className="text-xs text-gray-500">Course Editor</p>
                        </div>
                    </div>
                    <button onClick={saveCourse} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold shadow-lg hover:shadow-emerald-500/40 transition-all">
                        <Save size={16} /> Save Changes
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-full lg:w-80 border-b lg:border-r lg:border-b-0 bg-gray-50/50 flex flex-col shrink-0 max-h-[45vh] lg:max-h-full">
                        <div className="p-4 space-y-3 border-b border-gray-100">
                            <label className="text-xs font-bold text-gray-400 uppercase">Course Settings</label>
                            <input className="w-full border border-gray-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400 outline-none text-sm"
                                placeholder="Course Title" value={editingCourse.title}
                                onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })} />
                            <textarea className="w-full border border-gray-200 p-2.5 rounded-xl bg-white text-sm resize-none h-16 focus:ring-2 focus:ring-sky-400/30 outline-none"
                                placeholder="Description (optional)" value={editingCourse.description || ""}
                                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })} />
                            <select className="w-full border border-gray-200 p-2.5 rounded-xl bg-white text-sm"
                                value={editingCourse.level} onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}>
                                <option value="BEGINNER">Beginner</option>
                                <option value="INTERMEDIATE">Intermediate</option>
                                <option value="ADVANCED">Advanced</option>
                                <option value="EXPERT">Expert</option>
                            </select>
                        </div>

                        <div className="p-4 border-b border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-400 uppercase">Lessons ({editingCourse.chapters.length})</span>
                            </div>
                            <button onClick={() => {
                                const newChap = { title: "New Lesson", content: "", videoUrl: "" };
                                const newChaps = [...editingCourse.chapters, newChap];
                                setEditingCourse({ ...editingCourse, chapters: newChaps });
                                setActiveChapterIndex(newChaps.length - 1);
                            }} className="w-full bg-white border-2 border-dashed border-gray-300 text-gray-500 font-bold py-2 rounded-xl hover:border-sky-400 hover:text-sky-500 transition-colors text-sm">
                                + Add Lesson
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                            {editingCourse.chapters.map((chap: any, idx: number) => (
                                <div key={idx} onClick={() => setActiveChapterIndex(idx)}
                                    className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all border ${activeChapterIndex === idx ? "bg-sky-50 border-sky-400" : "bg-white border-gray-200 hover:border-gray-300"}`}>
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${activeChapterIndex === idx ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-500"}`}>{idx + 1}</span>
                                    <div className="truncate text-sm font-medium text-gray-700 flex-1">{chap.title || "Untitled"}</div>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        const nc = editingCourse.chapters.filter((_: any, i: number) => i !== idx);
                                        setEditingCourse({ ...editingCourse, chapters: nc });
                                        if (activeChapterIndex === idx) setActiveChapterIndex(-1);
                                        else if (activeChapterIndex > idx) setActiveChapterIndex(activeChapterIndex - 1);
                                    }} className="text-gray-300 hover:text-red-500 shrink-0"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30">
                        {activeChapter ? (
                            <div className="max-w-3xl mx-auto space-y-5">
                                <input className="text-xl font-bold bg-white border border-gray-200 rounded-xl p-3 w-full focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400 outline-none"
                                    value={activeChapter.title} placeholder="Lesson Title"
                                    onChange={(e) => updateChapter("title", e.target.value)} />

                                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex items-center gap-2">
                                        <Video size={14} className="text-red-500" /> YouTube Video URL
                                    </label>
                                    <input className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400 outline-none"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={activeChapter.videoUrl || ""}
                                        onChange={(e) => updateChapter("videoUrl", e.target.value)} />
                                    {activeChapter.videoUrl && (
                                        <div className="mt-4 rounded-xl overflow-hidden aspect-video bg-black">
                                            <iframe
                                                src={getYouTubeEmbedUrl(activeChapter.videoUrl) || ""}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex items-center gap-2">
                                        <FileText size={14} /> Lesson Notes / Description
                                    </label>
                                    <textarea className="w-full border border-gray-200 rounded-xl p-4 resize-none h-40 focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400 outline-none text-sm leading-relaxed text-gray-600 bg-gray-50"
                                        placeholder="Write lesson notes, description, or instructions here..."
                                        value={activeChapter.content || ""}
                                        onChange={(e) => updateChapter("content", e.target.value)} />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                                <BookOpen size={60} className="mb-4 text-gray-200" />
                                <p className="text-base font-bold text-gray-400">Select a lesson to edit</p>
                                <p className="text-xs text-gray-400 mt-1">Or add a new lesson from the sidebar</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CRMShellLayout>
    );
}
