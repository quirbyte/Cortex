import EventCard from "@/cards/EventCard";
import { Particles } from "@/components/ui/particles";
import { useSidebar } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import apiClient from "@/api/apiClient";
import QRCard from "@/cards/QRCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircleIcon } from "lucide-react";

export default function Events() {
  const currYear = new Date().getUTCFullYear();
  const { state } = useSidebar();
  const [isDark, setIsDark] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });
  useEffect(() => {
    const checkTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (event_id: string) => {
    try {
      const response = await apiClient.post("/bookings/book", {
        eventId: event_id,
      });
      const id = response.data.booking_id;
      setBookingId(id);
      setShowQR(true);
    } catch (err: any) {
      triggerAlert("Booking failed! Try again");
    }
  };

  const triggerAlert = (message: string) => {
    setAlert({ show: true, message });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 1500);
  };

  return (
    <>
      <div className="relative min-h-full bg-background transition-colors duration-500">
        <div className="absolute inset-0 z-0">
          <Particles
            key={`particles-${state}-${isDark}`}
            className="h-full w-full"
            quantity={isDark ? 180 : 140}
            ease={80}
            color={isDark ? "#ffffff" : "#000000"}
            staticity={30}
          />
        </div>
        <div className="mx-auto max-w-350 px-10 py-20">
          <header className="relative mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                  All Events
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground uppercase leading-none">
                Explore <br />
                <span className="text-green-950 dark:text-muted-foreground/30">
                  Upcoming
                </span>
              </h1>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                Curated Events • {currYear}
              </p>
              <div className="flex gap-2 items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-muted-foreground tabular-nums tracking-tight">
                  Live Updates Active
                </span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-x-10 gap-y-20 justify-items-center">
            <EventCard
              tenant_name="Partner Name"
              event_name="Grand Opening"
              venue="Main Arena"
              price={450}
              sold={2100}
              total={2500}
              event_id=""
              handleSubmit={handleSubmit}
            />
            <EventCard
              tenant_name="Host Co"
              event_name="Tech Summit"
              venue="Hall A"
              price={1200}
              sold={1200}
              total={2500}
              event_id=""
              handleSubmit={handleSubmit}
            />
            <EventCard
              tenant_name="Artist Collective"
              event_name="Live Night"
              venue="The Stage"
              price={300}
              sold={2450}
              total={2500}
              event_id=""
              handleSubmit={handleSubmit}
            />
            <EventCard
              tenant_name="Organizer"
              event_name="Workshop"
              venue="Studio 1"
              price={150}
              sold={600}
              total={2500}
              event_id=""
              handleSubmit={handleSubmit}
            />
            <EventCard
              tenant_name="Partner Name"
              event_name="Grand Opening"
              venue="Main Arena"
              price={450}
              sold={2100}
              total={2500}
              event_id=""
              handleSubmit={handleSubmit}
            />
            <EventCard
              tenant_name="Host Co"
              event_name="Tech Summit"
              venue="Hall A"
              price={1200}
              sold={1200}
              total={2500}
              event_id=""
              handleSubmit={handleSubmit}
            />
          </div>

          <footer className="mt-40 flex flex-col items-center gap-8">
            <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
            <p className="text-[10px] font-black uppercase tracking-[1.5em] text-black dark:text-muted-foreground/40 whitespace-nowrap ml-[1.5em]">
              End of Catalog
            </p>
          </footer>
        </div>
      </div>
      {showQR && bookingId && (
      <div className="fixed inset-0 z-200 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-background/60 backdrop-blur-xl animate-in fade-in duration-500" 
          onClick={() => setShowQR(false)} 
        />

        <div className="relative z-10">
          <QRCard 
            book_id={bookingId} 
            onClose={() => setShowQR(false)} 
          />
        </div>
      </div>
    )}
      {alert.show && (
        <div className="fixed bottom-10 right-10 z-100 w-80 animate-in fade-in slide-in-from-bottom-10 duration-500">
          <Alert className="border-border bg-card/80 backdrop-blur-xl shadow-2xl rounded-2xl border-l-4 border-l-primary">
            <XCircleIcon className="h-4 w-4 text-destructive" />
            <AlertTitle className="text-xs font-black uppercase tracking-widest">
              Error
            </AlertTitle>
            <AlertDescription className="text-xs font-medium text-muted-foreground">
              {alert.message}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
