import { useState, useEffect, useRef } from "react";
import { ScanQrCode, ShieldCheck, Loader2, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import QrScanner from "qr-scanner";
import { useTenant } from "@/hooks/useTenant";
import apiClient from "@/api/apiClient";
import { cn } from "@/lib/utils";

export default function VerifyTickets() {
  const { tenant } = useTenant();
  const [ticketId, setTicketId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; msg: string } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleValidation = async (id: string) => {
    if (!tenant?.slug || !id.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await apiClient.post("/tenant/verify-ticket", {
        ticketId: id.trim()
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
    if (!videoRef.current) return;
    setScanResult(null);
    setIsScanning(true);

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        const decodedText = result.data;
        stopScanner();
        handleValidation(decodedText);
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

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10 px-4">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Access Validator</h2>
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Validating for: {tenant?.name || "..."}
        </p>
      </div>

      <div className="relative aspect-square rounded-[3rem] border-2 border-primary/20 bg-zinc-900/50 flex flex-col items-center justify-center overflow-hidden group">
        <video 
          ref={videoRef} 
          className={cn("absolute inset-0 w-full h-full object-cover", !isScanning && "hidden")} 
        />
        
        {!isScanning && (
          <>
            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
            <ScanQrCode size={80} className="text-primary/40 group-hover:scale-110 transition-transform duration-500" />
            <Button 
              onClick={startScanner}
              variant="outline" 
              className="z-10 mt-4 rounded-xl border-primary/20 bg-background/50 backdrop-blur-md font-black uppercase text-[10px] tracking-widest"
            >
              Start Camera
            </Button>
          </>
        )}

        {isScanning && (
          <div className="absolute bottom-6 z-10">
             <Button onClick={stopScanner} variant="destructive" size="sm" className="rounded-full gap-2 px-6 font-black uppercase text-[10px]">
                <CameraOff size={14} /> Stop
             </Button>
          </div>
        )}

        <div className={cn(
          "absolute top-1/2 w-full h-px bg-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-scan pointer-events-none",
          !isScanning && "hidden"
        )} />
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <input 
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="ENTER TICKET ID MANUALLY" 
            className="flex-1 bg-card border border-border rounded-2xl px-6 text-[10px] font-bold tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-primary h-14"
          />
          <Button 
            onClick={() => handleValidation(ticketId)}
            disabled={isLoading || !ticketId}
            className="rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-[0.2em]"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Validate"}
          </Button>
        </div>

        {scanResult && (
          <div className={cn(
            "p-6 rounded-2xl border flex items-center gap-4 animate-in fade-in zoom-in-95 duration-300",
            scanResult.success ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" : "bg-destructive/10 border-destructive/50 text-destructive"
          )}>
            <ShieldCheck className={cn("shrink-0", !scanResult.success && "hidden")} />
            <p className="text-[10px] font-black uppercase tracking-widest">{scanResult.msg}</p>
          </div>
        )}
      </div>
    </div>
  );
}