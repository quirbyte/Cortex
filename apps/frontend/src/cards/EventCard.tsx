import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { MdStadium } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";

interface CardProps {
  tenant_name: string;
  event_name: string;
  price: number;
  total: number;
  sold: number;
  venue: string;
}

export default function EventCard(props: CardProps) {
  const remaining = props.total - props.sold;
  const percentage = (props.sold / props.total) * 100;

  return (
    <div className="relative group w-72 aspect-3/4">
      <Card className="relative w-full h-full rounded-[2rem] border border-white/5 bg-zinc-950 transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:z-50 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] group-hover:border-white/20 overflow-visible">
        
        <div className="absolute inset-0 z-0 rounded-[2rem] overflow-hidden">
          <img
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-60 grayscale-40 group-hover:grayscale-0"
            src="/event2.jpg"
            alt="Event"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/90 via-20% to-transparent" />
        </div>

        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem] overflow-hidden">
          <div
            className="absolute -inset-0.5 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shine"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>

        <div className="relative z-20 h-full flex flex-col justify-end px-6 pb-6">
          <div className="space-y-1 mb-5">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">
              {props.tenant_name}
            </span>
            <CardTitle className="text-2xl font-bold tracking-tighter leading-none text-white drop-shadow-md">
              {props.event_name}
            </CardTitle>
            <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-medium pt-1">
              <MdStadium size={12} />
              <span>{props.venue}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-[8px] text-white/20 uppercase font-black tracking-widest leading-none mb-1">
                  Entry
                </span>
                <div className="flex items-center text-white font-black text-xl leading-none">
                  <FaRupeeSign size={14} className="text-white/40" />
                  <span>{props.price}</span>
                </div>
              </div>

              <Button className="h-10 px-6 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95">
                Book
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-tight">
                <span className="text-white/20">Availability</span>
                <span className={remaining < 100 ? 'text-orange-500 animate-pulse' : 'text-white/30'}>
                  {remaining} Seats Left
                </span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-600 rounded-full transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}