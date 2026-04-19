"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CRMShellLayout from "@/components/crm/crm-shell";
import { BookOpen, Video, FileText, ArrowLeft, Loader2, CheckCircle, PlayCircle } from "lucide-react";

function getYouTubeEmbedUrl(url: string): string | null {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
}

export default function StudentCoursesPage() {
    const { data: session } = useSession();
    const studentId = (session?.user as any)?.id;

    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [activeChapter, setActiveChapter] = useState<any>(null);
    const [progress, setProgress] = useState<Record<string, any>>({});

    const fetchData = async () => {
        if (!studentId) return;
        try {
            const [coursesRes, progressRes] = await Promise.all([
                fetch("/api/courses"),
                fetch(`/api/progress/courses?studentId=${studentId}`).catch(() => ({ ok: false })),
            ]);
            if (coursesRes.ok) setCourses(await coursesRes.json());
            if ((progressRes as any).ok) {
                const list = await (progressRes as any).json();
                const map: Record<string, any> = {};
                list.forEach((p: any) => { map[p.courseId] = p; });
                setProgress(map);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [studentId]);

    const markChapterComplete = async (courseId: string, chapterId: string) => {
        const current = progress[courseId]?.completedChapters || [];
        if (current.includes(chapterId)) return;
        const updated = [...current, chapterId];
        await fetch("/api/progress/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId, courseId, completedChapters: updated }),
        });
        setProgress((p) => ({ ...p, [courseId]: { ...p[courseId], completedChapters: updated } }));
    };

    const levelColors: Record<string, string> = {
        BEGINNER: "bg-emerald-50 text-emerald-700",
        INTERMEDIATE: "bg-sky-50 text-sky-700",
        ADVANCED: "bg-indigo-50 text-indigo-700",
        EXPERT: "bg-amber-50 text-amber-700",
    };

    if (selectedCourse) {
        const completedChapters = progress[selectedCourse.id]?.completedChapters || [];
        return (
            <CRMShellLayout>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col" style={{ minHeight: "calc(100vh - 120px)" }}>
                    <div className="p-4 border-b flex items-center gap-3">
                        <button onClick={() => { setSelectedCourse(null); setActiveChapter(null); }} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500"><ArrowLeft size={20} /></button>
                        <div className="flex-1">
                            <h2 className="font-bold text-gray-900">{selectedCourse.title}</h2>
                            <div className="flex items-center gap-3 mt-0.5">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelColors[selectedCourse.level] || "bg-gray-100 text-gray-600"}`}>{selectedCourse.level}</span>
                                <span className="text-xs text-gray-400">{completedChapters.length}/{selectedCourse.chapters?.length || 0} completed</span>
                            </div>
                        </div>
                        {completedChapters.length > 0 && (
                            <div className="hidden sm:flex items-center gap-2">
                                <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full transition-all"
                                        style={{ width: `${Math.round((completedChapters.length / (selectedCourse.chapters?.length || 1)) * 100)}%` }} />
                                </div>
                                <span className="text-xs font-bold text-emerald-600">{Math.round((completedChapters.length / (selectedCourse.chapters?.length || 1)) * 100)}%</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col lg:flex-row flex-1">
                        <div className="w-full lg:w-72 border-b lg:border-r border-gray-100 bg-gray-50/50 p-4 space-y-2 overflow-y-auto max-h-[35vh] lg:max-h-full">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Lessons</p>
                            {(selectedCourse.chapters || []).map((chap: any, idx: number) => {
                                const done = completedChapters.includes(chap.id);
                                const isActive = activeChapter?.id === chap.id || activeChapter?.title === chap.title;
                                return (
                                    <button key={idx} onClick={() => setActiveChapter(chap)}
                                        className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all border ${isActive ? "bg-sky-50 border-sky-400" : "bg-white border-gray-200 hover:border-gray-300"}`}>
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done ? "bg-emerald-500 text-white" : isActive ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                                            {done ? "✓" : idx + 1}
                                        </span>
                                        <span className="text-sm font-medium truncate flex-1">{chap.title}</span>
                                        {chap.videoUrl && <PlayCircle size={12} className="shrink-0 text-gray-300" />}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            {activeChapter ? (
                                <div className="max-w-3xl mx-auto space-y-5">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-900">{activeChapter.title}</h2>
                                        {activeChapter.id && !completedChapters.includes(activeChapter.id) && (
                                            <button onClick={() => markChapterComplete(selectedCourse.id, activeChapter.id)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold hover:bg-emerald-100 transition-colors border border-emerald-200">
                                                <CheckCircle size={14} /> Mark Complete
                                            </button>
                                        )}
                                        {activeChapter.id && completedChapters.includes(activeChapter.id) && (
                                            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-200">
                                                <CheckCircle size={14} /> Completed
                                            </span>
                                        )}
                                    </div>
                                    {activeChapter.videoUrl && (
                                        <div className="rounded-2xl overflow-hidden aspect-video bg-black shadow-lg">
                                            <iframe src={getYouTubeEmbedUrl(activeChapter.videoUrl) || ""} className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                                        </div>
                                    )}
                                    {activeChapter.content && (
                                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                            <div className="flex items-center gap-2 mb-3">
                                                <FileText size={16} className="text-gray-400" />
                                                <span className="text-xs font-bold text-gray-400 uppercase">Lesson Notes</span>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{activeChapter.content}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center flex-col gap-3 text-gray-400">
                                    <BookOpen size={50} className="text-gray-200" />
                                    <p className="text-sm">Select a lesson to start learning</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CRMShellLayout>
        );
    }

    return (
        <CRMShellLayout>
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#0b1d3a] to-[#1a3a6a] rounded-2xl p-6 text-white">
                    <h1 className="text-2xl font-bold mb-1">My Courses</h1>
                    <p className="text-sky-200 text-sm">Learn at your own pace with video lessons</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                        <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No courses available yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courses.map((c) => {
                            const completed = progress[c.id]?.completedChapters?.length || 0;
                            const total = c.chapters?.length || 0;
                            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                            return (
                                <button key={c.id} onClick={() => { setSelectedCourse(c); setActiveChapter(c.chapters?.[0] || null); }}
                                    className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left group">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${levelColors[c.level] || "bg-gray-100 text-gray-700"}`}>{c.level}</span>
                                        {pct === 100 && <CheckCircle size={16} className="text-emerald-500" />}
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 mb-1">{c.title}</h3>
                                    {c.description && <p className="text-xs text-gray-400 line-clamp-2 mb-3">{c.description}</p>}
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                        <Video size={12} /><span>{total} Lessons</span>
                                    </div>
                                    {pct > 0 && (
                                        <div>
                                            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                                <span>Progress</span><span>{pct}%</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-sky-500 rounded-full" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </CRMShellLayout>
    );
}
