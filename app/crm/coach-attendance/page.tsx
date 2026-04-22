'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import CRMShellLayout from "@/components/crm/crm-shell"
import {
  CheckCircle, Loader2, Plus, Users, X
} from 'lucide-react'

export default function CoachAttendancePage() {
  const { data: session } = useSession()
  const coachId = (session?.user as any)?.id || ''

  const [classes, setClasses] = useState<any[]>([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, { status: string, remarks: string }>>({})

  // Modals and form state
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false)
  const [batchForm, setBatchForm] = useState({ name: '', dayOfWeek: 'Monday', startTime: '', endTime: '', meetingLink: '' })
  const [allStudents, setAllStudents] = useState<any[]>([])
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])

  // Fetch classes for this coach
  useEffect(() => {
    if (!coachId) return
    const fetchClasses = async () => {
      try {
        const res = await fetch(`/api/classes?coachId=${coachId}`)
        if (res.ok) {
          const data = await res.json()
          setClasses(data)
          if (data.length > 0 && !selectedClassId) {
            setSelectedClassId(data[0].id)
          }
        }
      } catch (e) { console.error(e) }
    }
    fetchClasses()
  }, [coachId])

  // Fetch students + attendance when class/date changes
  useEffect(() => {
    if (!selectedClassId || !date || classes.length === 0) return
    const fetchData = async () => {
      setLoading(true)
      try {
        const currentClass = classes.find((c: any) => c.id === selectedClassId)
        if (currentClass) {
          setStudents(currentClass.students || [])
        }
        const attRes = await fetch(`/api/attendance?classTimingId=${selectedClassId}&date=${date}`)
        if (attRes.ok) {
          const attData = await attRes.json()
          const records: any = {}
          attData.forEach((r: any) => {
            records[r.studentId] = { status: r.status, remarks: r.remarks || '' }
          })
          setAttendanceRecords(records)
        } else { setAttendanceRecords({}) }
      } catch (e) { setAttendanceRecords({}) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [selectedClassId, date, classes])

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const records = Object.entries(attendanceRecords).map(([studentId, data]) => ({
        studentId, status: data.status, remarks: data.remarks
      }))
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classTimingId: selectedClassId, date, records })
      })
      if (res.ok) alert("Attendance saved successfully!")
      else alert("Failed to save attendance")
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  // Manage Batch & Students Logic
  const fetchAllStudents = async () => {
    try {
      const res = await fetch('/api/students')
      if (res.ok) setAllStudents(await res.json())
    } catch (e) { console.error(e) }
  }

  const openStudentsModal = () => {
    const currentClass = classes.find(c => c.id === selectedClassId)
    setSelectedStudentIds(currentClass?.students?.map((s: any) => s.id) || [])
    setIsStudentsModalOpen(true)
    if (allStudents.length === 0) fetchAllStudents()
  }

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...batchForm, coachId })
      })
      if (res.ok) {
        const newClass = await res.json()
        setClasses([newClass, ...classes])
        setSelectedClassId(newClass.id)
        setIsBatchModalOpen(false)
        setBatchForm({ name: '', dayOfWeek: 'Monday', startTime: '', endTime: '', meetingLink: '' })
      } else { alert("Failed to create batch") }
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleUpdateStudents = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/classes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedClassId, studentIds: selectedStudentIds })
      })
      if (res.ok) {
        const updatedClass = await res.json()
        setClasses(classes.map(c => c.id === selectedClassId ? updatedClass : c))
        setStudents(updatedClass.students || [])
        setIsStudentsModalOpen(false)
      } else { alert("Failed to update students") }
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-600 text-white border-green-700'
      case 'ABSENT': return 'bg-red-600 text-white border-red-700'
      case 'LATE': return 'bg-yellow-500 text-white border-yellow-600'
      case 'LEAVE': return 'bg-blue-600 text-white border-blue-700'
      default: return 'bg-slate-100 text-slate-500 border-slate-200'
    }
  }

  return (
    <CRMShellLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-4 md:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#0b1d3a] flex items-center gap-3">
              <CheckCircle className="text-sky-500" /> Mark Attendance
            </h2>
            <p className="text-slate-400 text-xs font-medium mt-2">Select a class and date to mark student attendance.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
            <button onClick={() => setIsBatchModalOpen(true)} className="p-3 border border-sky-500 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs outline-none flex items-center justify-center gap-2 w-full sm:w-auto shadow-md transition-all whitespace-nowrap">
               <Plus size={14}/> New Batch
            </button>
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full sm:w-auto p-3 border border-sky-200 rounded-xl bg-sky-50/50 font-bold text-xs text-slate-700 outline-none focus:ring-2 ring-sky-100 min-w-[200px]"
              >
                {classes.length === 0 && <option value="" disabled>No classes</option>}
                {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.startTime})</option>)}
              </select>
              <button disabled={!selectedClassId} onClick={openStudentsModal} className="p-3 border border-sky-200 rounded-xl bg-white hover:bg-sky-50 text-sky-600 font-bold text-xs outline-none disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm" title="Manage Students">
                  <Users size={16}/>
              </button>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-3 border border-sky-200 rounded-xl bg-sky-50/50 font-bold text-xs text-slate-700 outline-none focus:ring-2 ring-sky-100 w-full sm:w-auto"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-sky-500 w-10 h-10" /></div>
        ) : (
          <div className="space-y-6">
            <div className="border border-sky-100 rounded-2xl overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-sky-50/50 border-b border-sky-100">
                  <tr>
                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {students.map(s => {
                    const currentStatus = attendanceRecords[s.id]?.status || ''
                    return (
                      <tr key={s.id} className="hover:bg-sky-50/30 transition-colors">
                        <td className="p-5">
                          <div className="font-bold text-slate-800 text-sm">{s.name}</div>
                          <div className="text-[10px] font-medium text-slate-400">{s.email}</div>
                        </td>
                        <td className="p-5">
                          <div className="flex justify-center gap-1.5">
                            {['PRESENT', 'ABSENT', 'LATE', 'LEAVE'].map(status => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(s.id, status)}
                                className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl text-[10px] font-bold transition-all border shadow-sm ${currentStatus === status
                                  ? getStatusColor(status)
                                  : 'bg-white text-slate-300 border-slate-100 hover:border-sky-200'
                                  }`}
                                title={status}
                              >
                                {status[0]}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="p-5">
                          <input
                            value={attendanceRecords[s.id]?.remarks || ''}
                            onChange={(e) => setAttendanceRecords(prev => ({
                              ...prev,
                              [s.id]: { ...prev[s.id], remarks: e.target.value }
                            }))}
                            className="w-full p-3 border border-slate-100 rounded-xl text-xs bg-transparent outline-none focus:bg-white focus:border-sky-200"
                            placeholder="Add remark..."
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {students.length === 0 && <div className="p-20 text-center text-slate-300 font-bold italic bg-sky-50/30">No students enrolled in this batch.</div>}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={students.length === 0 || saving}
                className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-sky-100 transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle size={18} />}
                Save Attendance
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE BATCH MODAL */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md border border-sky-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#0b1d3a]">Create New Batch</h3>
              <button onClick={() => setIsBatchModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-xl"><X size={20}/></button>
            </div>
            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Batch Name *</label>
                <input required value={batchForm.name} onChange={e => setBatchForm({...batchForm, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" placeholder="e.g. Beginners Mon/Wed"/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Day of Week *</label>
                <select required value={batchForm.dayOfWeek} onChange={e => setBatchForm({...batchForm, dayOfWeek: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none">
                  {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Multiple Days'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Start Time *</label>
                  <input required type="time" value={batchForm.startTime} onChange={e => setBatchForm({...batchForm, startTime: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">End Time *</label>
                  <input required type="time" value={batchForm.endTime} onChange={e => setBatchForm({...batchForm, endTime: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Meeting Link</label>
                <input value={batchForm.meetingLink} onChange={e => setBatchForm({...batchForm, meetingLink: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" placeholder="https://zoom.us/..."/>
              </div>
              <button type="submit" disabled={saving} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 flex justify-center mt-4">
                {saving ? <Loader2 className="animate-spin" size={20}/> : "Create Batch"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE STUDENTS MODAL */}
      {isStudentsModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg border border-sky-100 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#0b1d3a]">Manage Students</h3>
                <p className="text-xs text-slate-500">Enroll or remove students for this batch.</p>
              </div>
              <button onClick={() => setIsStudentsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-xl"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-2 border-t pt-4">
              {allStudents.length === 0 ? (
                 <div className="text-center py-10 text-slate-400"><Loader2 className="animate-spin mx-auto"/>Loading students...</div>
              ) : (
                allStudents.map(student => {
                  const isEnrolled = selectedStudentIds.includes(student.id);
                  return (
                    <label key={student.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 cursor-pointer">
                      <div>
                        <p className="font-bold text-sm text-slate-800">{student.name}</p>
                        <p className="text-[10px] text-slate-500">{student.email}</p>
                      </div>
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                        checked={isEnrolled}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedStudentIds([...selectedStudentIds, student.id])
                          else setSelectedStudentIds(selectedStudentIds.filter(id => id !== student.id))
                        }}
                      />
                    </label>
                  )
                })
              )}
            </div>

            <button onClick={handleUpdateStudents} disabled={saving} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 flex justify-center">
              {saving ? <Loader2 className="animate-spin" size={20}/> : `Save Enrollments (${selectedStudentIds.length})`}
            </button>
          </div>
        </div>
      )}
    </CRMShellLayout>
  )
}
