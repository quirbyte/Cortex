import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { MdStadium } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { Info } from "lucide-react";

interface CardProps {
  event_id: string;
  tenant_name: string;
  event_name: string;
  price: number;
  total: number;
  sold: number;
  venue: string;
  imageRef?: string;
  handleSubmit: (event_id: string) => void;
  handleDetails: (event_id: string) => void;
}

export default function EventCard(props: CardProps) {
  const remaining = props.total - props.sold;
  const percentage = (props.sold / props.total) * 100;
  const { event_id, handleSubmit, handleDetails, imageRef } = props;

  return (
    <div className="relative group w-72 aspect-3/4">
      <Card className="relative w-full h-full rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950 transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:z-50 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] dark:group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] group-hover:border-black/10 dark:group-hover:border-white/20 overflow-visible">
        <div className="absolute inset-0 z-0 rounded-[2rem] overflow-hidden">
          <img
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 dark:opacity-40 group-hover:opacity-80 dark:group-hover:opacity-60 grayscale-40 group-hover:grayscale-0"
            src={imageRef || "/event2.jpg"}
            alt={props.event_name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/event2.jpg";
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 dark:from-black dark:via-black/90 via-20% to-transparent" />
        </div>

        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem] overflow-hidden">
          <div
            className="absolute -inset-0.5 bg-linear-to-r from-transparent via-black/5 dark:via-white/10 to-transparent animate-shine"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>

        <div className="relative z-20 h-full flex flex-col justify-end px-6 pb-6">
          <div className="space-y-1 mb-5">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-black/40 dark:text-white/30">
              {props.tenant_name}
            </span>
            <CardTitle className="text-2xl font-bold tracking-tighter leading-none text-black dark:text-white drop-shadow-md">
              {props.event_name}
            </CardTitle>
            <div className="flex items-center gap-1.5 text-black/50 dark:text-white/40 text-[10px] font-medium pt-1">
              <MdStadium size={12} className="text-primary" />
              <span>{props.venue}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
              <div className="flex flex-col">
                <span className="text-[8px] text-black/30 dark:text-white/20 uppercase font-black tracking-widest leading-none mb-1">
                  Entry
                </span>
                <div className="flex items-center text-black dark:text-white font-black text-xl leading-none">
                  <FaRupeeSign size={14} className="text-black/30 dark:text-white/40" />
                  <span>{props.price}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDetails(event_id)}
                  className="h-10 w-10 p-0 rounded-xl border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-800 transition-all active:scale-95 shadow-sm"
                >
                  <Info size={16} className="text-black dark:text-white" />
                </Button>

                <Button
                  onClick={() => handleSubmit(event_id)}
                  className="h-10 px-5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95 shadow-lg"
                >
                  Book
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-tight">
                <span className="text-black/30 dark:text-white/20">Availability</span>
                <span
                  className={
                    remaining < 100
                      ? "text-orange-600 dark:text-orange-500 animate-pulse"
                      : "text-black/40 dark:text-white/30"
                  }
                >
                  {remaining} Seats Left
                </span>
              </div>
              <div className="h-1 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
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