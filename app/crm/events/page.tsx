"use client";

import { useEffect, useState } from "react";
import CRMShellLayout from "@/components/crm/crm-shell";
import { CalendarDays, Plus, Trash2, Edit, X, Loader2, MapPin, Calendar } from "lucide-react";

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [form, setForm] = useState({ title: "", description: "", date: "", location: "", imageUrl: "" });

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/events");
            if (res.ok) setEvents(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchEvents(); }, []);

    const openCreate = () => {
        setEditingEvent(null);
        setForm({ title: "", description: "", date: "", location: "", imageUrl: "" });
        setIsModalOpen(true);
    };

    const openEdit = (ev: any) => {
        setEditingEvent(ev);
        setForm({
            title: ev.title,
            description: ev.description || "",
            date: ev.date ? ev.date.split("T")[0] : "",
            location: ev.location || "",
            imageUrl: ev.imageUrl || "",
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingEvent ? "PUT" : "POST";
        const body = editingEvent ? { ...form, id: editingEvent.id } : form;
        const res = await fetch("/api/events", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (res.ok) { setIsModalOpen(false); fetchEvents(); }
        else alert("Failed to save event");
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this event?")) return;
        await fetch("/api/events", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
        fetchEvents();
    };

    return (
        <CRMShellLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <CalendarDays className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Events ({events.length})</h2>
                            <p className="text-xs text-gray-500">Post and manage upcoming events</p>
                        </div>
                    </div>
                    <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-bold shadow-lg hover:scale-[1.02] transition-all">
                        <Plus size={16} /> Post Event
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                        <CalendarDays className="mx-auto mb-3 text-gray-300" size={40} />
                        <p className="text-sm font-medium">No events yet</p>
                        <p className="text-xs mt-1">Click &quot;Post Event&quot; to create one</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {events.map((ev) => (
                            <div key={ev.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                                {ev.imageUrl && (
                                    <div className="h-40 overflow-hidden">
                                        <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                )}
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-base font-bold text-gray-900 flex-1 pr-2">{ev.title}</h3>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => openEdit(ev)} className="p-1.5 text-gray-400 hover:text-sky-500"><Edit size={14} /></button>
                                            <button onClick={() => handleDelete(ev.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                    {ev.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{ev.description}</p>}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar size={12} className="text-purple-500" />
                                            <span>{new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                                        </div>
                                        {ev.location && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <MapPin size={12} className="text-purple-500" />
                                                <span>{ev.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-5 border-b">
                            <h3 className="text-lg font-bold text-gray-900">{editingEvent ? "Edit Event" : "Post New Event"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title *</label>
                                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-purple-400/30 outline-none" placeholder="Event title" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description</label>
                                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm resize-none h-24 focus:ring-2 focus:ring-purple-400/30 outline-none" placeholder="Event details..." />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Date *</label>
                                <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-purple-400/30 outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Location</label>
                                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-purple-400/30 outline-none" placeholder="e.g. Main Hall, Online" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Image URL</label>
                                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-purple-400/30 outline-none" placeholder="https://..." />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-bold shadow-lg hover:scale-[1.02] transition-all">
                                    {editingEvent ? "Save Changes" : "Post Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </CRMShellLayout>
    );
}
