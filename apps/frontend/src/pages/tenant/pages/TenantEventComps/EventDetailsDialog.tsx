import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Edit3 } from "lucide-react";

export function EventDetailsDialog({ event, onClose, onEdit, canManage }: any) {
  if (!event) return null;
  return (
    <Dialog open={!!event} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{event.name}</DialogTitle>
          <DialogDescription>Event Logistics</DialogDescription>
        </DialogHeader>
        <div className="h-64 relative">
          <img src={event.imageRef} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-50 dark:from-zinc-950 to-transparent" />
          <div className="absolute bottom-6 left-8">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[8px] font-black uppercase tracking-widest text-white mb-3 inline-block">Event Protocol</span>
            <div className="text-4xl font-black uppercase tracking-tighter italic text-zinc-900 dark:text-white">{event.name}</div>
          </div>
        </div>
        <div className="p-8 grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-zinc-600 dark:text-white/60"><CalendarDays size={16} /><span className="text-xs font-bold uppercase">{new Date(event.date).toDateString()}</span></div>
            <div className="flex items-center gap-3 text-zinc-600 dark:text-white/60"><MapPin size={16} /><span className="text-xs font-bold uppercase">{event.venue}</span></div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase">Availability</span>
              <span className="text-xs font-black">{event.ticketDetails.total - event.ticketDetails.sold} / {event.ticketDetails.total}</span>
            </div>
          </div>
        </div>
        <div className="p-8 pt-0 flex gap-4">
          <Button className="flex-1 h-14 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-black font-black uppercase text-[10px]">Book Now</Button>
          {canManage && <Button variant="outline" onClick={onEdit} className="h-14 w-14 rounded-2xl"><Edit3 size={18} /></Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
}