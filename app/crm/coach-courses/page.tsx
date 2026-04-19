"use client";

import { useEffect, useState } from "react";
import CRMShellLayout from "@/components/crm/crm-shell";
import { BookOpen, Video, FileText, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";

function getYouTubeEmbedUrl(url: string): string | null {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
}

export default function CoachCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [activeChapter, setActiveChapter] = useState<any>(null);

    useEffect(() => {
        fetch("/api/courses").then((r) => r.json()).then(setCourses).catch(console.error).finally(() => setLoading(false));
    }, []);

    const levelColors: Record<string, string> = {
        BEGINNER: "bg-emerald-50 text-emerald-700",
        INTERMEDIATE: "bg-sky-50 text-sky-700",
        ADVANCED: "bg-indigo-50 text-indigo-700",
        EXPERT: "bg-amber-50 text-amber-700",
    };

    if (selectedCourse) {
        return (
            <CRMShellLayout>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col" style={{ minHeight: "calc(100vh - 120px)" }}>
                    <div className="p-4 border-b flex items-center gap-3">
                        <button onClick={() => { setSelectedCourse(null); setActiveChapter(null); }} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500"><ArrowLeft size={20} /></button>
                        <div>
                            <h2 className="font-bold text-gray-900">{selectedCourse.title}</h2>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelColors[selectedCourse.level] || "bg-gray-100 text-gray-600"}`}>{selectedCourse.level}</span>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row flex-1">
                        <div className="w-full lg:w-72 border-b lg:border-r border-gray-100 bg-gray-50/50 p-4 space-y-2 overflow-y-auto max-h-[35vh] lg:max-h-full">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Lessons ({selectedCourse.chapters?.length || 0})</p>
                            {(selectedCourse.chapters || []).map((chap: any, idx: number) => (
                                <button key={idx} onClick={() => setActiveChapter(chap)}
                                    className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all border ${activeChapter?.title === chap.title ? "bg-sky-50 border-sky-400 text-sky-700" : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"}`}>
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${activeChapter?.title === chap.title ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-500"}`}>{idx + 1}</span>
                                    <span className="text-sm font-medium truncate">{chap.title}</span>
                                    {chap.videoUrl && <Video size={12} className="shrink-0 text-gray-400 ml-auto" />}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            {activeChapter ? (
                                <div className="max-w-3xl mx-auto space-y-5">
                                    <h2 className="text-xl font-bold text-gray-900">{activeChapter.title}</h2>
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
                                    {!activeChapter.videoUrl && !activeChapter.content && (
                                        <div className="text-center py-20 text-gray-400">
                                            <Video size={40} className="mx-auto mb-3 text-gray-300" />
                                            <p className="text-sm">No content for this lesson yet</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 flex-col gap-3">
                                    <BookOpen size={50} className="text-gray-200" />
                                    <p className="text-sm font-medium">Select a lesson from the sidebar</p>
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
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg">
                        <BookOpen className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Courses</h2>
                        <p className="text-xs text-gray-500">View and teach available courses</p>
                    </div>
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
                        {courses.map((c) => (
                            <button key={c.id} onClick={() => { setSelectedCourse(c); setActiveChapter(c.chapters?.[0] || null); }}
                                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left group">
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${levelColors[c.level] || "bg-gray-100 text-gray-700"}`}>{c.level}</span>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-sky-400 transition-colors" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">{c.title}</h3>
                                {c.description && <p className="text-xs text-gray-400 line-clamp-2 mb-3">{c.description}</p>}
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Video size={12} />
                                    <span>{c.chapters?.length || 0} Lessons</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </CRMShellLayout>
    );
}
