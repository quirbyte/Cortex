import { useState, useEffect } from "react";
import EventCard from "@/cards/EventCard";
import { Particles } from "@/components/ui/particles";
import { useSidebar } from "@/components/ui/sidebar";
import apiClient from "@/api/apiClient";
import QRCard from "@/cards/QRCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircleIcon, Loader2, Sparkles } from "lucide-react";

interface EventData {
  _id: string;
  name: string;
  venue: string;
  date: string;
  time: string;
  imageRef: string;
  tenantId: {
    _id: string;
    name: string;
  };
  ticketDetails: {
    price: number;
    total: number;
    sold: number;
  };
}

export default function Events() {
  const currYear = new Date().getUTCFullYear();
  const { state } = useSidebar();
  const [isDark, setIsDark] = useState(true);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [alert, setAlert] = useState<{ show: boolean; message: string }>({ 
    show: false, 
    message: "" 
  });

  useEffect(() => {
    const checkTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    fetchEvents();

    return () => observer.disconnect();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/events");
      setEvents(response.data.events);
    } catch (err) {
      triggerAlert("Failed to load events grid.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event_id: string) => {
    try {
      const response = await apiClient.post("/bookings/book", {
        eventId: event_id,
      });
      const id = response.data.booking_id;
      setBookingId(id);
      setShowQR(true);
      fetchEvents(); 
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || "Booking failed! Try again";
      triggerAlert(errorMsg);
    }
  };

  const triggerAlert = (message: string) => {
    setAlert({ show: true, message });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 4000);
  };

  return (
    <>
      <div className="relative min-h-full bg-background transition-colors duration-500 overflow-x-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Particles
            key={`particles-${state}-${isDark}`}
            className="h-full w-full"
            quantity={isDark ? 180 : 140}
            ease={80}
            color={isDark ? "#ffffff" : "#000000"}
            staticity={30}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
          <header className="relative mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-primary/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                  Discovery Phase
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground uppercase leading-[0.85] selection:bg-primary selection:text-black">
                Explore <br />
                <span className="text-zinc-300 dark:text-white/10 transition-colors duration-700">
                  Upcoming
                </span>
              </h1>
            </div>

            <div className="flex flex-col items-start md:items-end gap-4">
              <div className="px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-md flex items-center gap-2">
                <Sparkles size={14} className="text-primary animate-pulse" />
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase tabular-nums">
                  Curated Catalog • {currYear}
                </p>
              </div>
              <div className="flex gap-2 items-center mr-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-tighter">
                  Grid Synchronized
                </span>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-48 gap-6">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                <Loader2 className="h-12 w-12 animate-spin text-primary absolute inset-0 [animation-delay:-0.15s]" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
                Fetching Global Events...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-x-8 gap-y-16 justify-items-center">
              {events.length > 0 ? (
                events.map((event) => (
                  <EventCard
                    key={event._id}
                    event_id={event._id}
                    tenant_name={event.tenantId?.name || "Global Event"} 
                    event_name={event.name}
                    venue={event.venue}
                    imageRef={event.imageRef}
                    price={event.ticketDetails.price}
                    sold={event.ticketDetails.sold}
                    total={event.ticketDetails.total}
                    handleSubmit={handleSubmit}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center space-y-4">
                   <div className="h-20 w-20 mx-auto rounded-full bg-muted flex items-center justify-center opacity-50">
                      <Sparkles size={32} className="text-muted-foreground" />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No events found in this region</p>
                </div>
              )}
            </div>
          )}

          <footer className="mt-48 flex flex-col items-center gap-10">
            <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent opacity-50" />
            <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-[1.2em] text-foreground/20 whitespace-nowrap ml-[1.2em]">
                End of Catalog
              </p>
              <div className="h-1.5 w-1.5 rounded-full bg-primary/20" />
            </div>
          </footer>
        </div>
      </div>

      {showQR && bookingId && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-2xl animate-in fade-in duration-500" 
            onClick={() => setShowQR(false)} 
          />
          <div className="relative z-110 w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            <QRCard 
              book_id={bookingId} 
              onClose={() => setShowQR(false)} 
            />
          </div>
        </div>
      )}

      {alert.show && (
        <div className="fixed bottom-6 right-6 z-150 w-[calc(100%-3rem)] sm:w-96 animate-in fade-in slide-in-from-bottom-10 duration-500">
          <Alert className="border-border bg-background/80 backdrop-blur-2xl shadow-2xl rounded-[1.5rem] border-l-4 border-l-destructive py-5">
            <XCircleIcon className="h-5 w-5 text-destructive" />
            <div className="ml-2">
              <AlertTitle className="text-xs font-black uppercase tracking-widest leading-none mb-1">
                System Error
              </AlertTitle>
              <AlertDescription className="text-[11px] font-bold text-muted-foreground tracking-tight">
                {alert.message}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}
    </>
  );
}