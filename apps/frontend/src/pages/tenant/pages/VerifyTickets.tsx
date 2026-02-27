import { ScanQrCode, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyTickets() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Access Validator</h2>
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">Scan or enter ticket credential</p>
      </div>

      <div className="aspect-square rounded-[3rem] border-2 border-primary/20 bg-zinc-900/50 flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        <ScanQrCode size={80} className="text-primary/40 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-1/2 w-full h-px bg-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-scan" />
      </div>

      <div className="flex gap-4">
        <input 
          placeholder="ENTER TICKET ID MANUALLY" 
          className="flex-1 bg-card border border-border rounded-2xl px-6 text-[10px] font-bold tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button className="rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-[0.2em]">Validate</Button>
      </div>
    </div>
  );
}