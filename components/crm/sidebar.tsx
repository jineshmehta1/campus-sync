"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    LayoutDashboard, Users, GraduationCap, CreditCard, ClipboardCheck,
    LogOut, ChevronLeft, ChevronRight, BookOpen, ListTodo, Wallet,
    Calendar, Trophy, CalendarDays, ClipboardList, FileText, X,
} from "lucide-react";
import { useState } from "react";

type NavSection = {
    label: string;
    roles: string[];
    items: { href: string; label: string; icon: any }[];
};

const navSections: NavSection[] = [
    {
        label: "Admin",
        roles: ["ADMIN"],
        items: [
            { href: "/crm/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/crm/students", label: "Users", icon: Users },
            { href: "/crm/batches", label: "Batches & Classes", icon: GraduationCap },
            { href: "/crm/payments", label: "Payments", icon: CreditCard },
            { href: "/crm/attendance", label: "Attendance", icon: ClipboardCheck },
            { href: "/crm/courses", label: "Courses", icon: BookOpen },
            { href: "/crm/mcqs", label: "MCQs", icon: FileText },
            { href: "/crm/events", label: "Events", icon: CalendarDays },
            { href: "/crm/leaderboard", label: "Leaderboard", icon: Trophy },
        ],
    },
    {
        label: "Teacher",
        roles: ["COACH"],
        items: [
            { href: "/crm/coach-dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/crm/coach-students", label: "My Students", icon: Users },
            { href: "/crm/coach-attendance", label: "Attendance", icon: ClipboardCheck },
            { href: "/crm/coach-courses", label: "Courses", icon: BookOpen },
            { href: "/crm/coach-mcq", label: "MCQs", icon: FileText },
            { href: "/crm/tasks", label: "Tasks", icon: ClipboardList },
            { href: "/crm/leaderboard", label: "Leaderboard", icon: Trophy },
        ],
    },
    {
        label: "Student",
        roles: ["STUDENT"],
        items: [
            { href: "/crm/student-dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/crm/student-courses", label: "Courses", icon: BookOpen },
            { href: "/crm/student-mcq", label: "MCQs", icon: FileText },
            { href: "/crm/student-tasks", label: "Tasks", icon: ListTodo },
            { href: "/crm/student-fees", label: "Fees", icon: Wallet },
            { href: "/crm/student-schedule", label: "Schedule", icon: Calendar },
            { href: "/crm/leaderboard", label: "Leaderboard", icon: Trophy },
        ],
    },
];

export default function CRMSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [collapsed, setCollapsed] = useState(false);
    const userRole = ((session?.user as any)?.role || "").toUpperCase();
    const visibleSections = navSections.filter((s) => s.roles.includes(userRole) || userRole === "");

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-[55] lg:hidden backdrop-blur-sm" onClick={onClose} />
            )}
            <aside className={`fixed left-0 top-0 h-screen z-[60] flex flex-col transition-all duration-300 ease-in-out ${collapsed ? "lg:w-[72px]" : "lg:w-[240px]"} w-[260px] ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
                style={{ background: "linear-gradient(180deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%)" }}>

                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg">
                        <span className="text-white font-black text-base">A</span>
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden flex-1">
                            <h1 className="text-white font-bold text-base leading-tight">Campus-Sync</h1>
                            <span className="text-[10px] font-semibold text-sky-400/80 uppercase tracking-widest">Learning Portal</span>
                        </div>
                    )}
                    <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors ml-auto">
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {visibleSections.map((section) => (
                        <div key={section.label} className="mb-2">
                            {!collapsed && (
                                <div className="px-3 pt-3 pb-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">{section.label}</div>
                            )}
                            {collapsed && <div className="border-t border-white/10 my-2" />}
                            {section.items.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                return (
                                    <Link key={item.href} href={item.href} onClick={onClose}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${isActive ? "bg-white/15 text-white shadow-lg" : "text-white/60 hover:text-white hover:bg-white/8"}`}>
                                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-sky-400 rounded-r-full" />}
                                        <item.icon size={20} className={`shrink-0 ${isActive ? "text-sky-400" : "text-white/50 group-hover:text-white/80"}`} />
                                        {!collapsed && <span>{item.label}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Bottom */}
                <div className="px-3 py-4 border-t border-white/10 space-y-2">
                    <button onClick={() => signOut({ callbackUrl: "/crm/login" })}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? "justify-center" : ""}`}>
                        <LogOut size={20} className="shrink-0" />
                        {!collapsed && <span>Sign Out</span>}
                    </button>
                    <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex items-center justify-center w-full py-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>
            </aside>
        </>
    );
}
