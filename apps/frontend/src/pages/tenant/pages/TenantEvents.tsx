import { useTenant } from "@/hooks/useTenant";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { MdStadium } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { Plus, Trash2, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TenantEvents() {
  const { role, tenant } = useTenant();
  const isAdmin = role === "Admin";

  const events = [
    { 
      event_id: "1", 
      event_name: "NEON GALA 2026", 
      price: 1200, 
      total: 500, 
      sold: 420, 
      venue: "Sector 7 Hall", 
      date: "MAR 15" 
    },
    { 
      event_id: "2", 
      event_name: "CORTEX SUMMIT", 
      price: 2500, 
      total: 200, 
      sold: 50, 
      venue: "Virtual Arena", 
      date: "APR 02" 
    },
  ];

  const handleDelete = (id: string) => {
    console.log("Deleting event:", id);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
            Event Registry
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
            {tenant?.name} • Command Center
          </p>
        </div>

        {isAdmin && (
          <Button className="h-12 px-8 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 gap-2 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]">
            <Plus size={16} strokeWidth={3} />
            Initialize Event
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-8">
        {events.map((event) => {
          const remaining = event.total - event.sold;
          const percentage = (event.sold / event.total) * 100;

          return (
            <div key={event.event_id} className="relative group w-72 aspect-3/4">
              <Card className="relative w-full h-full rounded-[2.5rem] border border-white/5 bg-zinc-950 transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:z-50 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] group-hover:border-white/20 overflow-visible">
                <div className="absolute inset-0 z-0 rounded-[2.5rem] overflow-hidden">
                  <img
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-30 group-hover:opacity-50 grayscale group-hover:grayscale-0"
                    src="/event2.jpg"
                    alt="Event"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 via-30% to-transparent" />
                </div>

                <div className="relative z-20 h-full flex flex-col justify-end px-6 pb-6">
                  <div className="space-y-1 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarDays size={10} className="text-white/40" />
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">
                        {event.date}
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tighter leading-none text-white uppercase italic">
                      {event.event_name}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 text-white/40 text-[9px] font-bold pt-1 uppercase">
                      <MdStadium size={12} />
                      <span>{event.venue}</span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center justify-between pt-5 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-white/20 uppercase font-black tracking-widest leading-none mb-1">
                          Valuation
                        </span>
                        <div className="flex items-center text-white font-black text-xl leading-none tracking-tighter">
                          <FaRupeeSign size={14} className="text-white/40" />
                          <span>{event.price}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {isAdmin && (
                          <Button
                            onClick={() => handleDelete(event.event_id)}
                            variant="ghost"
                            className="h-10 w-10 p-0 rounded-xl border border-white/5 bg-white/5 text-white/40 hover:bg-red-500/10 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                        <Button
                          className="h-10 px-5 rounded-xl bg-white text-black hover:bg-zinc-200 font-black text-[9px] uppercase tracking-wider transition-all active:scale-95"
                        >
                          Details
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-tight">
                        <span className="text-white/20">Capacity Load</span>
                        <span className={cn(remaining < 50 ? "text-orange-500 animate-pulse" : "text-white/40")}>
                          {remaining} Units Available
                        </span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}