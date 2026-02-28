import { useState, useEffect, useRef } from "react";
import { ScanQrCode, ShieldCheck, Loader2, CameraOff, ChevronRight, Ticket, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import QrScanner from "qr-scanner";
import { useTenant } from "@/hooks/useTenant";
import apiClient from "@/api/apiClient";
import { cn } from "@/lib/utils";

interface EventInterface {
  _id: string;
  name: string;
  date: string;
}

export default function VerifyTickets() {
  const { tenant } = useTenant();
  const [events, setEvents] = useState<EventInterface[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [ticketId, setTicketId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [scanResult, setScanResult] = useState<{ success: boolean; msg: string } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!tenant?.slug) return;
      try {
        const res = await apiClient.get("/events/tenant-events");
        setEvents(res.data.events || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsEventsLoading(false);
      }
    };
    fetchEvents();
  }, [tenant?.slug]);

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleValidation = async (id: string) => {
    if (!tenant?.slug || !selectedEventId || !id.trim()) return;
    
    setIsLoading(true);
    setScanResult(null);
    try {
      const response = await apiClient.post("/tenant/verify-ticket", {
        ticketId: id.trim(),
        eventId: selectedEventId
      }, {
        headers: { "tenant-slug": tenant.slug }
      });
      setScanResult({ success: true, msg: response.data.msg });
      setTicketId(""); 
    } catch (err: any) {
      setScanResult({ 
        success: false, 
        msg: err.response?.data?.msg || "Validation Failed" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startScanner = async () => {
    if (!videoRef.current || !selectedEventId) return;
    setScanResult(null);
    setIsScanning(true);

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        stopScanner();
        handleValidation(result.data);
      },
      {
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    qrScannerRef.current = scanner;

    try {
      await scanner.start();
    } catch (err) {
      console.error(err);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => stopScanner();
  }, []);

  if (!selectedEventId) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 space-y-10 animate-in fade-in duration-700">
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
            <Ticket size={32} />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">Select Target Event</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 dark:text-white/20">
            {tenant?.name} • Verification Protocol
          </p>
        </div>

        <div className="grid gap-4">
          {isEventsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-3xl bg-zinc-100 dark:bg-white/5 animate-pulse" />
            ))
          ) : events.length > 0 ? (
            events.map((event) => (
              <button
                key={event._id}
                onClick={() => setSelectedEventId(event._id)}
                className="group flex items-center justify-between p-6 rounded-[2rem] border border-zinc-200 dark:border-white/5 bg-white dark:bg-white/2 hover:border-primary/50 hover:bg-primary/2 transition-all text-left shadow-sm"
              >
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white group-hover:text-primary transition-colors">
                    {event.name}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase">
                    <Calendar size={12} />
                    {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })}
                  </div>
                </div>
                <ChevronRight size={20} className="text-zinc-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-[3rem]">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">No active events found</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10 px-4 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/5 pb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Validator</h2>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary">
            Targeting: {events.find(e => e._id === selectedEventId)?.name}
          </p>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => { setSelectedEventId(""); stopScanner(); setScanResult(null); }}
          className="text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/10 hover:text-primary"
        >
          Change Event
        </Button>
      </div>

      <div className="relative aspect-square rounded-[3rem] border-2 border-zinc-200 dark:border-white/10 bg-zinc-900 overflow-hidden group shadow-2xl">
        <video 
          ref={videoRef} 
          className={cn("absolute inset-0 w-full h-full object-cover", !isScanning && "hidden")} 
        />
        
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
            <div className="absolute inset-0 bg-primary/2 animate-pulse" />
            <ScanQrCode size={80} className="text-zinc-700 dark:text-white/10 mb-6 group-hover:scale-110 transition-transform duration-500" />
            <Button 
              onClick={startScanner}
              className="z-10 h-14 px-10 rounded-2xl bg-primary dark:text-black font-black uppercase text-[11px] tracking-[0.2em] shadow-xl active:scale-95 transition-all"
            >
              Start Scanner
            </Button>
          </div>
        )}

        {isScanning && (
          <div className="absolute bottom-10 inset-x-0 flex justify-center z-10">
             <Button onClick={stopScanner} variant="destructive" className="rounded-2xl gap-2 px-8 h-12 font-black uppercase text-[10px] tracking-widest shadow-2xl">
                <CameraOff size={16} /> Terminate
             </Button>
          </div>
        )}

        <div className={cn(
          "absolute top-1/2 w-full h-1 bg-primary/40 shadow-[0_0_20px_rgba(var(--primary),0.8)] animate-scan pointer-events-none z-20",
          !isScanning && "hidden"
        )} />
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <input 
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="MANUAL ENTRY TICKET ID" 
            className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl px-6 text-[11px] font-black tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 h-16 shadow-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-colors"
          />
          <Button 
            onClick={() => handleValidation(ticketId)}
            disabled={isLoading || !ticketId.trim()}
            className="rounded-2xl h-16 px-10 font-black uppercase text-[11px] tracking-[0.2em] shadow-lg"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Verify"}
          </Button>
        </div>

        {scanResult && (
          <div className={cn(
            "p-8 rounded-[2.5rem] border-2 flex flex-col items-center text-center gap-4 animate-in zoom-in-95 duration-500 shadow-2xl",
            scanResult.success 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
              : "bg-destructive/10 border-destructive/20 text-destructive"
          )}>
            <div className={cn(
              "p-4 rounded-full mb-2",
              scanResult.success ? "bg-emerald-500/20" : "bg-destructive/20"
            )}>
              <ShieldCheck size={40} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-xl font-black uppercase tracking-tighter leading-none mb-1">
                {scanResult.success ? "Access Granted" : "Access Denied"}
              </h4>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{scanResult.msg}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setScanResult(null)}
              className="mt-2 rounded-xl border-current text-[9px] font-black uppercase tracking-widest h-8"
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}