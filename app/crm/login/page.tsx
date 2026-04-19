"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    Eye, 
    EyeOff, 
    ArrowRight, 
    Loader2, 
    Users, 
    GraduationCap, 
    Trophy, 
    BookOpen, 
    Info 
} from "lucide-react";

export default function CRMLoginPage() {
    const { status } = useSession();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (status === "authenticated") {
        router.replace("/crm/dashboard");
        return null;
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await signIn("credentials", { email, password, redirect: false });
        if (result?.error) { 
            setError("Invalid email or password"); 
            setLoading(false); 
            return; 
        }
        window.location.href = "/crm/dashboard";
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            <style>{`
                @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
                .shimmer-text { background: linear-gradient(90deg, #fff 0%, #38bdf8 50%, #fff 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; }
            `}</style>

            {/* Mobile Header */}
            <div className="lg:hidden w-full py-8 px-6 relative overflow-hidden flex flex-col items-center"
                style={{ background: "linear-gradient(160deg, #020617 0%, #0c1445 50%, #1e3a5f 100%)" }}>
                <div className="absolute top-[-30%] left-[-20%] w-60 h-60 rounded-full bg-sky-600/20 blur-[80px]" />
                <div className="absolute bottom-[-30%] right-[-20%] w-60 h-60 rounded-full bg-indigo-600/15 blur-[80px]" />
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center mb-4 shadow-xl">
                        <span className="text-white font-black text-3xl">A</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-white tracking-tight">Campus-Sync</h2>
                    <p className="shimmer-text text-xs font-semibold tracking-widest uppercase mt-1">Aravali Institute of Technical Studies</p>
                </div>
            </div>

            {/* Left Panel — Desktop */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center"
                style={{ background: "linear-gradient(160deg, #020617 0%, #0c1445 30%, #1e3a5f 60%, #0f172a 100%)" }}>
                <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-sky-600/15 blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/12 blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px"
                }} />

                <div className="relative z-10 px-12 xl:px-16 max-w-lg w-full text-center">
                    <div className="w-24 h-24 xl:w-28 xl:h-28 rounded-3xl bg-[#0c1445] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-sky-500/30 p-2">
    <img
        src="/logo.png"   // 👉 put your logo path here
        alt="Campus Sync Logo"
        className="w-full h-full object-contain"
    />
</div>
                    <h2 className="text-3xl xl:text-4xl font-extrabold text-white mb-2 tracking-tight">Campus-Sync</h2>
                    <p className="shimmer-text text-base xl:text-sm font-semibold tracking-widest uppercase mb-2">Aravali Institute of Technical Studies</p>
                    <p className="text-white/40 text-sm mb-10">Empowering education through technology</p>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: Users, label: "Students", value: "1000+", color: "from-sky-400 to-sky-600" },
                            { icon: GraduationCap, label: "Teachers", value: "50+", color: "from-indigo-400 to-indigo-600" },
                            { icon: BookOpen, label: "Courses", value: "30+", color: "from-emerald-400 to-emerald-600" },
                            { icon: Trophy, label: "Top Scores", value: "500+", color: "from-amber-400 to-orange-500" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 hover:bg-white/[0.10] transition-all">
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
                                    <stat.icon className="text-white" size={16} />
                                </div>
                                <div className="text-2xl font-extrabold text-white leading-none mb-1">{stat.value}</div>
                                <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gray-50 relative">
                
                {/* About Button - Top Right Positioning */}
                <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
                    <Link 
                        href="/about" 
                        className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-sky-600 bg-white border border-gray-200 rounded-xl shadow-sm transition-all hover:border-sky-300 hover:shadow-md"
                    >
                        <Info size={16} />
                        <span className="hidden sm:inline">About Platform</span>
                        <span className="sm:hidden">About</span>
                    </Link>
                </div>

                <div className="w-full max-w-sm sm:max-w-md">
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">Sign in to Campus-Sync</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        <div>
                            <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                required disabled={loading} placeholder="you@example.com"
                                className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all text-sm shadow-sm" />
                        </div>

                        <div>
                            <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required disabled={loading} placeholder="••••••••"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all text-sm pr-12 shadow-sm" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full shrink-0" />{error}
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                            {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>) : (<>Sign In <ArrowRight size={16} /></>)}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-500">
                            Don&apos;t have an account?{" "}
                            <Link href="/crm/signup" className="text-sky-600 hover:text-sky-700 font-semibold">Sign Up</Link>
                        </p>
                        <p className="text-center mt-2">
                            <Link href="/about" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                                Learn more about Campus-Sync system
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}