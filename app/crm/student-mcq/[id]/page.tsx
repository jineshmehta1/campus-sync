'use client'

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import CRMShellLayout from "@/components/crm/crm-shell"
import { ArrowLeft, Loader2, CheckCircle, XCircle, ArrowRight, HelpCircle } from "lucide-react"

export default function StudentMCQSolvePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const params = useParams()
    const mcqId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined)

    const [mcq, setMcq] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [selectedIndices, setSelectedIndices] = useState<number[]>([])
    const [solveStatus, setSolveStatus] = useState<"IDLE" | "CORRECT" | "WRONG">("IDLE")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (status === "unauthenticated") { router.push("/crm/login"); return }
        if (status !== "authenticated" || !mcqId) return

        setSelectedIndices([])
        setSolveStatus("IDLE")
        setError(null)

        fetch(`/api/mcq/${mcqId}`)
            .then((r) => { if (!r.ok) throw new Error("MCQ not found"); return r.json() })
            .then(setMcq)
            .catch((err) => setError(err.message || "Failed to load"))
    }, [status, mcqId, router])

    const toggleOption = (idx: number) => {
        if (solveStatus === "CORRECT") return
        setSelectedIndices((prev) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx])
    }

    const handleSubmit = async () => {
        if (selectedIndices.length === 0 || isSubmitting || !mcq) return
        setIsSubmitting(true)
        const isCorrect = selectedIndices.length === mcq.correctOptions.length &&
            selectedIndices.every((i: number) => mcq.correctOptions.includes(i))

        try {
            const studentId = (session?.user as any)?.id
            if (studentId) {
                await fetch("/api/mcq/progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId, mcqId: mcq.id, isCorrect }),
                })
            }
            setSolveStatus(isCorrect ? "CORRECT" : "WRONG")
        } catch (e) { console.error(e) }
        finally { setIsSubmitting(false) }
    }

    if (error) return (
        <CRMShellLayout>
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <XCircle className="text-red-400" size={48} />
                <p className="text-red-600 font-bold">{error}</p>
                <button onClick={() => router.push("/crm/student-mcq")} className="text-sky-600 font-bold hover:underline">← Back to MCQs</button>
            </div>
        </CRMShellLayout>
    )

    if (!mcq || status === "loading") return (
        <CRMShellLayout>
            <div className="flex items-center justify-center py-20 gap-3">
                <Loader2 className="animate-spin text-sky-500" size={24} />
                <span className="text-sky-600 font-bold">Loading MCQ...</span>
            </div>
        </CRMShellLayout>
    )

    return (
        <CRMShellLayout>
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => router.push("/crm/student-mcq")} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={18} /> Back to MCQs
                </button>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${mcq.stage === "BEGINNER" ? "bg-emerald-50 text-emerald-700" : mcq.stage === "INTERMEDIATE" ? "bg-sky-50 text-sky-700" : mcq.stage === "ADVANCED" ? "bg-indigo-50 text-indigo-700" : "bg-amber-50 text-amber-700"}`}>
                    {mcq.stage}
                </span>
            </div>

            <div className="max-w-2xl mx-auto space-y-5">
                {/* Question */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-start gap-3">
                        <HelpCircle className="text-sky-500 mt-0.5 shrink-0" size={22} />
                        <div>
                            <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">Question</span>
                            <p className="text-lg font-bold text-gray-900 mt-1 leading-relaxed">{mcq.question}</p>
                        </div>
                    </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {(mcq.options as string[]).map((option: string, idx: number) => {
                        const isSelected = selectedIndices.includes(idx)
                        const isCorrectOpt = mcq.correctOptions.includes(idx)
                        let cls = "bg-white border-gray-200 text-gray-700 hover:border-sky-300"
                        if (solveStatus !== "IDLE") {
                            if (isCorrectOpt) cls = "bg-emerald-50 border-emerald-400 text-emerald-800"
                            else if (isSelected) cls = "bg-red-50 border-red-400 text-red-800"
                            else cls = "bg-white border-gray-100 text-gray-400"
                        } else if (isSelected) {
                            cls = "bg-sky-50 border-sky-400 text-sky-800"
                        }

                        return (
                            <button key={idx} onClick={() => toggleOption(idx)} disabled={solveStatus === "CORRECT"}
                                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${cls}`}>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold
                                    ${solveStatus !== "IDLE" && isCorrectOpt ? "bg-emerald-500 text-white" :
                                    solveStatus !== "IDLE" && isSelected ? "bg-red-500 text-white" :
                                    isSelected ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                                    {solveStatus !== "IDLE" && isCorrectOpt ? "✓" : solveStatus !== "IDLE" && isSelected ? "✗" : String.fromCharCode(65 + idx)}
                                </div>
                                <span className="text-sm font-semibold">{option}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Feedback + Action */}
                <div className="space-y-3">
                    {solveStatus === "CORRECT" && (
                        <>
                            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-800 font-bold flex items-center gap-3">
                                <CheckCircle size={20} /> Correct! Well done.
                            </div>
                            {mcq.explanation && (
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-blue-800 text-sm leading-relaxed">
                                    <b>Explanation:</b> {mcq.explanation}
                                </div>
                            )}
                            <button onClick={() => router.push("/crm/student-mcq")}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                Back to MCQs <ArrowRight size={18} />
                            </button>
                        </>
                    )}
                    {solveStatus === "WRONG" && (
                        <>
                            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-red-800 font-bold flex items-center gap-3">
                                <XCircle size={20} /> Incorrect — see the correct answer above.
                            </div>
                            {mcq.explanation && (
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-blue-800 text-sm leading-relaxed">
                                    <b>Explanation:</b> {mcq.explanation}
                                </div>
                            )}
                            <button onClick={() => { setSelectedIndices([]); setSolveStatus("IDLE"); }}
                                className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold hover:scale-[1.02] transition-all">
                                Try Again
                            </button>
                        </>
                    )}
                    {solveStatus === "IDLE" && (
                        <button onClick={handleSubmit} disabled={selectedIndices.length === 0 || isSubmitting}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-lg hover:scale-[1.02] disabled:opacity-40 transition-all flex items-center justify-center gap-2">
                            {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Checking...</> : "Check Answer"}
                        </button>
                    )}
                </div>
            </div>
        </CRMShellLayout>
    )
}
