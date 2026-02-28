import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Ticket, Clock } from "lucide-react";

export function EventDetailsDialog({ event, onClose, onBook }: any) {
  if (!event) return null;

  return (
    <Dialog open={!!event} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-0 overflow-hidden outline-none">
        <DialogHeader className="sr-only">
          <DialogTitle>{event.name}</DialogTitle>
          <DialogDescription>Full event logistics and ticket availability information.</DialogDescription>
        </DialogHeader>

        <div className="h-64 relative">
          <img 
            src={event.imageRef || "/event2.jpg"} 
            className="w-full h-full object-cover" 
            alt={event.name} 
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-50 dark:from-zinc-950 to-transparent" />
          <div className="absolute bottom-6 left-8">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[8px] font-black uppercase tracking-widest text-white mb-3 inline-block">
              Event Protocol
            </span>
            <div className="text-4xl font-black uppercase tracking-tighter italic text-zinc-900 dark:text-white">
              {event.name}
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Logistics Phase</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-zinc-600 dark:text-white/60">
                <CalendarDays size={16} className="text-zinc-400" />
                <span className="text-xs font-bold uppercase">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-zinc-600 dark:text-white/60">
                <Clock size={16} className="text-zinc-400" />
                <span className="text-xs font-bold uppercase">{event.time}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-600 dark:text-white/60">
                <MapPin size={16} className="text-zinc-400" />
                <span className="text-xs font-bold uppercase">{event.venue}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Inventory Status</p>
            <div className="p-5 rounded-[2rem] bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 flex flex-col items-center justify-center space-y-1">
              <Ticket size={20} className="text-zinc-400 mb-1" />
              <span className="text-2xl font-black text-zinc-900 dark:text-white">
                {event.ticketDetails.total - event.ticketDetails.sold}
              </span>
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Units Available</span>
            </div>
          </div>
        </div>

        <div className="p-8 pt-0">
          <Button 
            onClick={() => onBook(event._id)}
            className="w-full h-16 rounded-[2rem] bg-zinc-900 text-white dark:bg-white dark:text-black font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-all"
          >
            Authorize Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}