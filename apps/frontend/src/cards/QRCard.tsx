import { useRef } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Download, X, Ticket, ShieldCheck } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CardProps {
  book_id: string | null;
  onClose: () => void;
}

export default function QRCard({ book_id, onClose }: CardProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!ticketRef.current) return;

    const canvas = await html2canvas(ticketRef.current, {
      scale: 3,
      backgroundColor: "#09090b", 
      logging: false,
      useCORS: true
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width / 3, canvas.height / 3]
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 3, canvas.height / 3);
    pdf.save(`Ticket-${book_id?.slice(-6)}.pdf`);
  };

  if (!book_id) return null;

  return (
    <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
      <div 
        ref={ticketRef}
        className="relative w-80 bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary via-emerald-500 to-primary" />
        
        <div className="p-8 pb-4 space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-white/5 rounded-2xl">
              <Ticket className="text-primary" size={24} />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Booking ID</p>
              <p className="text-[12px] font-mono font-bold text-white">#{book_id.slice(-8).toUpperCase()}</p>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">Official Entry Pass</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              <ShieldCheck size={12} />
              <span>Verified Digital Asset</span>
            </div>
          </div>
        </div>

        <div className="relative py-6 flex flex-col items-center justify-center bg-white/5 mx-6 rounded-3xl border border-white/5">
          <div className="p-3 bg-white rounded-2xl shadow-inner">
            <QRCode 
              value={book_id} 
              size={160} 
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox={`0 0 256 256`}
            />
          </div>
          <p className="mt-4 text-[9px] font-black uppercase tracking-[0.5em] text-white/30">Scan at Entrance</p>
        </div>

        <div className="p-8 pt-4">
          <div className="flex items-center justify-between border-t border-white/5 pt-4">
            <div className="space-y-1">
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Status</p>
              <p className="text-[10px] font-bold text-white uppercase">Valid Tier 1</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Type</p>
              <p className="text-[10px] font-bold text-white uppercase">General Admin</p>
            </div>
          </div>
        </div>

        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-900 dark:bg-zinc-950 border-r border-white/10 rounded-full" />
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-900 dark:bg-zinc-950 border-l border-white/10 rounded-full" />
      </div>

      <div className="flex gap-3 w-full max-w-80">
        <Button 
          onClick={downloadPDF}
          className="flex-1 h-14 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl"
        >
          <Download size={16} /> Save PDF
        </Button>
        <Button 
          onClick={onClose}
          variant="outline"
          className="w-14 h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 p-0 shadow-xl"
        >
          <X size={20} />
        </Button>
      </div>
    </div>
  );
}