import { useState, useEffect } from "react";
import { useTenant } from "@/hooks/useTenant";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import apiClient from "@/api/apiClient";
import { EventCard } from "./TenantEventComps/EventCard"
import { EventFormSheet } from "./TenantEventComps/EventFormSheet";
import { EventDetailsDialog } from "./TenantEventComps/EventDetailsDialog";

export default function TenantEvents() {
  const { role, tenant } = useTenant();
  const canManage = role === "Admin" || role === "Moderator";

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [editEvent, setEditEvent] = useState<any>(null);
  const [deletingEvent, setDeletingEvent] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => { fetchEvents(); }, [tenant?.slug]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/events/tenant-events");
      setEvents(res.data.events || []);
    } finally { setLoading(false); }
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const url = editEvent ? `/events/${editEvent._id}` : "/events";
      const method = editEvent ? "put" : "post";
      await apiClient[method](url, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setSheetOpen(false);
      setEditEvent(null);
      fetchEvents();
      setStatus({ type: "success", msg: "Operation successful" });
    } catch (err) {
      setStatus({ type: "error", msg: "Action failed" });
    } finally { setSubmitLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/events/${deletingEvent._id}`);
      setEvents(prev => prev.filter(ev => ev._id !== deletingEvent._id));
      setDeletingEvent(null);
    } catch (err) { setStatus({ type: "error", msg: "Delete failed" }); }
  };

  return (
    <div className="space-y-10">
      {status && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-100 px-6 py-3 rounded-2xl bg-zinc-900 text-white border border-white/10 flex items-center gap-3">
          {status.type === "success" ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
          <p className="text-[10px] font-black uppercase tracking-widest">{status.msg}</p>
          <button onClick={() => setStatus(null)}><X size={14} /></button>
        </div>
      )}

      {deletingEvent && (
        <Alert variant="destructive" className="max-w-2xl mx-auto rounded-3xl">
          <div className="flex justify-between items-center w-full">
            <AlertDescription className="text-[10px] font-black uppercase">Terminate {deletingEvent.name}?</AlertDescription>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setDeletingEvent(null)}>Abort</Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>Confirm</Button>
            </div>
          </div>
        </Alert>
      )}

      <div className="flex justify-between items-center border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Event Registry</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-20">{tenant?.name}</p>
        </div>
        {canManage && (
          <Button onClick={() => setSheetOpen(true)} className="h-14 px-10 rounded-2xl bg-zinc-900 dark:bg-white dark:text-black font-black uppercase text-[11px] tracking-widest">
            <Plus size={18} className="mr-2" /> Initialize Deployment
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-8 justify-center md:justify-start">
        {loading ? <Loader2 className="animate-spin mx-auto" /> : events.map(ev => (
          <EventCard key={ev._id} event={ev} canManage={canManage} onDelete={setDeletingEvent} onDetails={setSelectedEvent} />
        ))}
      </div>

      <EventFormSheet 
        isOpen={sheetOpen} 
        onOpenChange={(open: boolean) => { setSheetOpen(open); if(!open) setEditEvent(null); }} 
        onSubmit={handleFormSubmit} 
        initialData={editEvent} 
        isLoading={submitLoading} 
      />

      <EventDetailsDialog 
        event={selectedEvent} 
        canManage={canManage} 
        onClose={() => setSelectedEvent(null)} 
        onEdit={() => { setEditEvent(selectedEvent); setSelectedEvent(null); setSheetOpen(true); }} 
      />
    </div>
  );
}