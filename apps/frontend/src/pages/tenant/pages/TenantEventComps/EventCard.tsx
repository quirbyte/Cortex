import { CalendarDays, Trash2 } from "lucide-react";
import { MdStadium } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EventInterface {
  _id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  imageRef: string;
  ticketDetails: { price: number; total: number; sold: number; };
}

export function EventCard({ 
  event, 
  canManage, 
  onDelete,
  onDetails 
}: { 
  event: EventInterface; 
  canManage: boolean; 
  onDelete: (event: EventInterface) => void;
  onDetails: (event: EventInterface) => void;
}) {
  const remaining = event.ticketDetails.total - event.ticketDetails.sold;
  const percentage = (event.ticketDetails.sold / event.ticketDetails.total) * 100;

  return (
    <div className="relative group w-72 aspect-3/4">
      <Card className="relative w-full h-full rounded-[2.5rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/40 backdrop-blur-sm transition-all duration-500 ease-out group-hover:scale-[1.04] overflow-hidden group-hover:border-zinc-300 dark:group-hover:border-white/20 shadow-xl dark:shadow-2xl">
        <div className="absolute inset-0 z-0 bg-zinc-100 dark:bg-zinc-950">
          <img className="h-full w-full object-cover transition-all duration-700 opacity-80 dark:opacity-70 group-hover:opacity-100" src={event.imageRef} alt={event.name} />
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/40 dark:from-zinc-950 dark:via-zinc-950/60 to-transparent" />
        </div>
        
        <div className="relative z-20 h-full flex flex-col justify-end px-6 pb-6">
          <div className="space-y-1 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays size={10} className="text-zinc-500 dark:text-white/60" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-white/60">
                {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase()}
              </span>
            </div>
            <CardTitle className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic drop-shadow-sm dark:drop-shadow-md">{event.name}</CardTitle>
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-white/50 text-[9px] font-bold uppercase">
              <MdStadium size={12} /> <span>{event.venue}</span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between pt-5 border-t border-zinc-200 dark:border-white/10">
              <div className="flex flex-col">
                <span className="text-[8px] text-zinc-400 dark:text-white/30 uppercase font-black tracking-widest mb-1">Valuation</span>
                <div className="flex items-center text-zinc-900 dark:text-white font-black text-xl tracking-tighter">
                  <FaRupeeSign size={14} className="text-zinc-400 dark:text-white/40" /> <span>{event.ticketDetails.price}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {canManage && (
                  <button onClick={() => onDelete(event)} className="h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-400 dark:text-white/40 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
                <Button onClick={() => onDetails(event)} className="h-10 px-5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black font-black text-[9px] uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">Details</Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[8px] font-black uppercase">
                <span className="text-zinc-400 dark:text-white/30">Capacity Load</span>
                <span className={cn(remaining < 50 ? "text-orange-600 dark:text-orange-500 animate-pulse" : "text-zinc-500 dark:text-white/50")}>{remaining} Seats Available</span>
              </div>
              <div className="h-1 w-full bg-zinc-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}