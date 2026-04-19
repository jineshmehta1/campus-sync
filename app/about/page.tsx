"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
    BookOpen, Users, GraduationCap, Trophy, MapPin, 
    Phone, Mail, Target, Cpu, Shield, Heart, 
    Award, CheckCircle, Leaf, Quote, Briefcase
} from "lucide-react";

const leadership = [
    {
        name: "Mr. Hemant Dhabhai",
        role: "Director, AITS",
        image: "/dhabhaisir.jpg", // Replace with actual path
        quote: "Our mission is simple yet profound: to make every single student 'Industry Ready' through passionate academic leadership and technical excellence.",
        description: "A visionary academician leading Aravali with a focus on blending traditional values with modern technical manpower needs."
    },
    {
        name: "Mr. Vinayak Mehta",
        role: "Head of Department, CSE",
        image: "/vinayak.jpg", // Replace with actual path
        quote: "In the rapidly evolving world of Computer Science, we focus on real-time knowledge and sustainable technical skills that empower students to lead the digital revolution.",
        description: "Specializing in technical education management and fostering an environment of research, creativity, and professional activity."
    }
];

const achievements = [
    { label: "RTU QIV Ranking", value: "7th Rank", sub: "In Rajasthan (A-Grade List 2023-24)" },
    { label: "Udaipur Region", value: "1st Rank", sub: "Session 2021-22 & 2022-23" },
    { label: "Excellence Award", value: "UCCI-2022", sub: "Prestigious Industry Recognition" },
    { label: "ISRO Membership", value: "Since 2017", sub: "1st Engineering College in Rajasthan" },
];

const programs = [
    "B.Tech (CSE, ECE, ME, Civil)",
    "M.Tech (Technical Specializations)",
    "MCA (Computer Applications)",
    "Diploma in Engineering",
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900">

            {/* Hero Section */}
          <section className="relative overflow-hidden py-24 md:py-44 px-4 text-white">

    {/* Background Image */}
    <div className="absolute inset-0">
        <img
            src="/aravali.jpg" // 👉 put your image in /public folder
            alt="Campus Background"
            className="w-full h-full object-cover"
        />
    </div>

    {/* Dark Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#020617]/90 via-[#0c1445]/85 to-[#1e3a5f]/90" />

    {/* Fancy Glow Effect */}
    <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
            backgroundImage:
                "radial-gradient(circle at 20% 50%, #38bdf8 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 50%)",
        }}
    />

    {/* Content */}
    <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <span className="inline-block px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-6">
                ISO 9001:2015 Certified · NAAC Accredited
            </span>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight mb-8">
                Aravali Institute of<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">
                    Technical Studies
                </span>
            </h1>

            <p className="text-lg md:text-xl text-sky-100/80 max-w-3xl mx-auto leading-relaxed mb-10">
                Established in 2008, committed to providing the best teaching, training, and infrastructure for technical education.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    href="/crm/login"
                    className="px-8 py-4 rounded-2xl bg-sky-500 text-white font-bold shadow-xl shadow-sky-500/20 hover:bg-sky-400 transition-all flex items-center justify-center gap-2"
                >
                    <BookOpen size={18} /> Student Portal
                </Link>

                <a
                    href="#leadership"
                    className="px-8 py-4 rounded-2xl border border-white/20 text-white font-bold hover:bg-white/5 transition-all"
                >
                    Meet the Leadership
                </a>
            </div>
        </motion.div>
    </div>
</section>

            {/* Rankings & Accreditations */}
            <section className="py-12 bg-gray-50 border-y border-gray-100">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {achievements.map((item, i) => (
                        <div key={i} className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                <Award className="text-sky-600" size={24} />
                            </div>
                            <div>
                                <div className="text-lg font-black text-gray-900 leading-none mb-1">{item.value}</div>
                                <div className="text-xs font-bold text-sky-600 uppercase tracking-tight mb-1">{item.label}</div>
                                <div className="text-[10px] text-gray-500 font-medium leading-tight">{item.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* About History */}
            <section id="about" className="py-20 md:py-28 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                            Excellence in <br />Technical Education
                        </h2>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                Aravali Institute of Technical Studies is an <b>ISO9001: 2015 certified</b> Engineering College affiliated with <b>Rajasthan Technical University, Kota</b>. We provide a state-of-the-art environment for B.Tech, M.Tech, MCA, and Diploma students.
                            </p>
                            <p>
                                AITS is the <b>1st Engineering college in Rajasthan</b> to have membership with <b>SSME, ISRO, Ahmedabad</b> since 2017. Our campus is built to foster industry-ready professionals.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                <div className="p-4 rounded-xl bg-sky-50 border border-sky-100">
                                    <h4 className="font-bold text-sky-900 mb-1">Our Mission</h4>
                                    <p className="text-xs text-sky-800/70">To provide industry interface for faculty and students to work on real-time knowledge projects.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                                    <h4 className="font-bold text-indigo-900 mb-1">Our Vision</h4>
                                    <p className="text-xs text-indigo-800/70">To nurture talent blended with values and technology to strengthen national technical manpower.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="relative p-2 bg-gray-100 rounded-[2.5rem]">
                        <div className="bg-white rounded-[2rem] p-8 shadow-inner overflow-hidden relative">
                           <div className="absolute top-0 right-0 p-6 opacity-5">
                                <Trophy size={120} />
                           </div>
                           <h3 className="text-2xl font-black text-gray-900 mb-6">Quality Policy</h3>
                           <p className="text-gray-600 text-sm leading-relaxed mb-6">
                               We dedicate ourselves to accomplish our Mission and Vision through synergy of knowledge, skill expertise, and cooperation of our Faculty, Students, and Management by continuous improvement.
                           </p>
                           <ul className="space-y-3">
                                {[
                                    "Approved by AICTE, Govt. of India",
                                    "Affiliated to RTU, Kota",
                                    "NAAC Accredited Institution",
                                    "UCCI Excellence Award Winner"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                                        <CheckCircle size={16} className="text-emerald-500" /> {item}
                                    </li>
                                ))}
                           </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section id="leadership" className="py-20 px-4 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-sky-400 text-xs font-black uppercase tracking-widest mb-3 block">Administration</span>
                        <h2 className="text-3xl md:text-5xl font-black text-white">Academic Leadership</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {leadership.map((leader, i) => (
                            <motion.div key={i} 
                                initial={{ opacity: 0, y: 20 }} 
                                whileInView={{ opacity: 1, y: 0 }} 
                                viewport={{ once: true }}
                                className="group bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-all">
                                <div className="flex flex-col sm:flex-row gap-6 items-start">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-xl">
    <img 
        src={leader.image} 
        alt={leader.name}
        className="w-full h-full object-cover"
    />
</div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">{leader.name}</h3>
                                        <p className="text-sky-400 font-bold text-sm mb-4">{leader.role}</p>
                                        <div className="relative">
                                            <Quote size={24} className="text-white/10 absolute -top-2 -left-4" />
                                            <p className="text-gray-300 italic text-sm leading-relaxed mb-4 relative z-10">
                                                "{leader.quote}"
                                            </p>
                                        </div>
                                        <p className="text-white/40 text-xs leading-relaxed">
                                            {leader.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Green Campus Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-emerald-50 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
                        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl" />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                                    <Leaf className="text-white" size={28} />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-emerald-900 mb-6">Supporting the Green Revolution</h2>
                                <p className="text-emerald-800/70 leading-relaxed mb-6">
                                    Our fully residential campus is eco-friendly, featuring a state-of-the-art <b>Sewage Treatment Plant</b> for water recycling and a modern <b>Reverse Osmosis</b> plant for safe drinking water.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-sm font-bold text-emerald-900/80">
                                        <CheckCircle size={16} className="text-emerald-500" /> Natural Ventilation Design
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-emerald-900/80">
                                        <CheckCircle size={16} className="text-emerald-500" /> Ambient Sunlight Usage
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-emerald-900/80">
                                        <CheckCircle size={16} className="text-emerald-500" /> Expert Landscaping
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-emerald-900/80">
                                        <CheckCircle size={16} className="text-emerald-500" /> Eco-Friendly Architecture
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 border border-emerald-100">
                                <h4 className="text-xl font-black text-emerald-900 mb-4">Campus Facilities</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="font-black text-emerald-500 text-2xl">300+</div>
                                        <p className="text-xs text-emerald-800/60 font-medium">Seating capacity in our indoor Seminar Hall for personality development sessions.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="font-black text-emerald-500 text-2xl">1000+</div>
                                        <p className="text-xs text-emerald-800/60 font-medium">Capacity Open-air Auditorium for cultural and academic events.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-sky-600 text-xs font-black uppercase tracking-widest mb-3 block">Degrees & Diplomas</span>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900">Academic Programs</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {programs.map((prog, idx) => (
                            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-sky-500 transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-sky-50 transition-colors">
                                    <GraduationCap size={20} className="text-gray-400 group-hover:text-sky-600" />
                                </div>
                                <p className="text-sm font-black text-gray-900 leading-tight">{prog}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer / Contact */}
            <footer className="py-20 px-4 bg-gray-50 border-t border-gray-100">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-black">A</div>
                                <span className="font-black text-xl tracking-tight">Campus-Sync</span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Providing a technology up-to-date and intellectually inspiring environment of learning and research since 2008.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Contact Us</h4>
                            <div className="flex gap-3 text-sm text-gray-600"><MapPin size={18} className="text-sky-600 shrink-0" /> Udaipur, Rajasthan - 313001</div>
                            <div className="flex gap-3 text-sm text-gray-600"><Phone size={18} className="text-sky-600 shrink-0" /> +91-294-2650131</div>
                            <div className="flex gap-3 text-sm text-gray-600"><Mail size={18} className="text-sky-600 shrink-0" /> info@aravalieducation.org</div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest">External Links</h4>
                            <a href="https://www.rtu.ac.in" target="_blank" className="block text-sm text-gray-500 hover:text-sky-600 transition-colors">RTU Kota Website</a>
                            <a href="https://www.aicte-india.org" target="_blank" className="block text-sm text-gray-500 hover:text-sky-600 transition-colors">AICTE Official Portal</a>
                            <Link href="/crm/login" className="block text-sm text-sky-600 font-bold">Portal Login →</Link>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-200 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} Aravali Institute of Technical Studies. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}