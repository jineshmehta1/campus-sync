"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const pageTitles: Record<string, string> = {
    "/crm/dashboard": "Dashboard",
    "/crm/students": "Users",
    "/crm/batches": "Batches & Classes",
    "/crm/payments": "Payments",
    "/crm/attendance": "Attendance",
    "/crm/courses": "Courses",
    "/crm/mcqs": "MCQs",
    "/crm/events": "Events",
    "/crm/coach-students": "My Students",
    "/crm/coach-attendance": "Attendance",
    "/crm/coach-courses": "Courses",
    "/crm/coach-mcq": "MCQs",
    "/crm/tasks": "Tasks",
    "/crm/coach-dashboard": "Teacher Dashboard",
    "/crm/student-courses": "My Courses",
    "/crm/student-mcq": "MCQs",
    "/crm/student-tasks": "My Tasks",
    "/crm/student-fees": "Fee History",
    "/crm/student-schedule": "My Schedule",
    "/crm/student-dashboard": "Student Dashboard",
    "/crm/leaderboard": "Leaderboard",
};

export default function CRMTopbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
    const { data: session } = useSession();
    const pathname = usePathname();

    const title = pageTitles[pathname] || "Campus-Sync";
    const initials = session?.user?.name
        ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "AL";

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-xl hover:bg-sky-50 transition-colors">
                        <Menu size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-200">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md overflow-hidden">
                            {(session?.user as any)?.photoUrl ? (
                                <img src={(session?.user as any).photoUrl} alt={session?.user?.name || ""} className="w-full h-full object-cover" />
                            ) : initials}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold text-gray-800 leading-tight">{session?.user?.name || "User"}</p>
                            <p className="text-[10px] text-sky-600 uppercase font-medium tracking-wide">{(session?.user as any)?.role || "—"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
