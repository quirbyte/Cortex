import { useState, useEffect } from "react";
import { Particles } from "@/components/ui/particles";
import { useSidebar } from "@/components/ui/sidebar";
import apiClient from "@/api/apiClient";
import QRCard from "@/cards/QRCard";
import { Ticket, Calendar, MapPin, Loader2, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookingData {
  _id: string;
  event_id: {
    _id: string;
    name: string;
    date: string;
    venue: string;
    time: string;
  };
  checkedIn: boolean;
  createdAt: string;
}

export default function MyBookings() {
  const { state } = useSidebar();
  const [isDark, setIsDark] = useState(true);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const checkTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    fetchMyTickets();

    return () => observer.disconnect();
  }, []);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/bookings/my-tickets");
      setBookings(response.data.userBookings);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  const openTicket = (id: string) => {
    setSelectedBookingId(id);
    setShowQR(true);
  };

  return (
    <div className="relative min-h-full bg-background transition-colors duration-500 overflow-x-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles
          key={`particles-bookings-${state}-${isDark}`}
          className="h-full w-full"
          quantity={isDark ? 150 : 100}
          color={isDark ? "#ffffff" : "#000000"}
          staticity={40}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <header className="mb-20 space-y-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-primary/50" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
              Personal Vault
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground uppercase leading-[0.85]">
            My <br />
            <span className="text-green-950 dark:text-muted-foreground/20 transition-colors duration-700">
              Passes
            </span>
          </h1>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-primary opacity-40" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Decrypting Tickets...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <Card 
                key={booking._id}
                className="group relative bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 transition-all hover:scale-[1.02] hover:shadow-2xl dark:hover:shadow-primary/5 hover:border-primary/20 cursor-pointer overflow-hidden"
                onClick={() => openTicket(booking._id)}
              >
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all">
                  <ArrowUpRight size={20} />
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary">
                      {booking.checkedIn ? "Used • Terminated" : "Active • Valid"}
                    </p>
                    <h3 className="text-2xl font-bold tracking-tighter text-foreground uppercase leading-tight">
                      {booking.event_id?.name || "Untitled Event"}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar size={14} className="text-primary" />
                      <span className="text-[11px] font-bold uppercase tracking-tight">
                        {new Date(booking.event_id?.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin size={14} className="text-primary" />
                      <span className="text-[11px] font-bold uppercase tracking-tight truncate">
                        {booking.event_id?.venue}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">Token</span>
                      <span className="text-[10px] font-mono font-bold">#{booking._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <Button variant="ghost" className="h-8 rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-black transition-all">
                      View QR
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-black/5 dark:border-white/5 rounded-[3rem]">
            <Ticket className="mx-auto text-muted-foreground/20 mb-4" size={48} />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No Digital Assets Found</p>
            <Button 
              variant="link" 
              className="mt-2 text-primary text-[10px] font-black uppercase tracking-widest"
              onClick={() => window.location.href = "/dashboard/events"}
            >
              Acquire Passes
            </Button>
          </div>
        )}
      </div>

      {showQR && selectedBookingId && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-2xl animate-in fade-in duration-500" 
            onClick={() => setShowQR(false)} 
          />
          <div className="relative z-110">
            <QRCard 
              book_id={selectedBookingId} 
              onClose={() => setShowQR(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}