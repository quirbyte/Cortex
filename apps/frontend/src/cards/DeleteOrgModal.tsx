import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertTriangleIcon,
  XIcon,
  FlameIcon,
  Loader2Icon,
  ShieldAlertIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteOrgModalProps {
  name: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteOrgModal({
  name,
  onClose,
  onConfirm,
}: DeleteOrgModalProps) {
  const [confirmName, setConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isValid = confirmName.trim().toUpperCase() === name.trim().toUpperCase();

  const handleDecommission = () => {
    if (!isValid) return;
    setIsDeleting(true);
    onConfirm();
  };

  return (
    <div className="relative group w-full max-w-md mx-auto px-4">
      <div className="absolute -inset-4 bg-red-500/10 rounded-[3.5rem] blur-3xl opacity-50" />

      <Card className="relative w-full rounded-[3rem] border border-red-500/20 bg-white/90 dark:bg-black/95 backdrop-blur-2xl overflow-hidden flex flex-col p-10 shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/5">
            <ShieldAlertIcon size={14} className="text-red-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500">
              Critical Protocol
            </span>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-4xl font-black tracking-tighter text-red-600 dark:text-red-500 uppercase italic leading-[0.9]">
              Terminate <br /> Entity
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-relaxed">
              This action will purge all memberships and event data associated with <span className="text-foreground">{name}</span>.
            </p>
          </div>

          <div className="relative group/input space-y-4">
            <label className="text-[9px] uppercase tracking-widest ml-2 block opacity-50">
              Type <span className="text-red-500 font-black">{name}</span> to confirm
            </label>
            <Input
              autoFocus
              placeholder="CONFIRMATION_ID"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className="h-14 bg-red-500/5 border-red-500/20 rounded-2xl text-foreground font-mono text-sm tracking-widest uppercase focus-visible:ring-red-500/50 transition-all px-6"
            />
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-1 w-1 rounded-full bg-red-500 animate-ping" />
            <AlertTriangleIcon size={14} className="text-red-500/50" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500/60">
              Destructive Operation // Auth-Required
            </span>
          </div>

          <Button
            onClick={handleDecommission}
            disabled={!isValid || isDeleting}
            className={cn(
              "relative w-full h-16 rounded-2xl transition-all duration-500 font-black uppercase text-[11px] tracking-[0.4em] overflow-hidden shadow-xl",
              isDeleting
                ? "bg-muted text-muted-foreground"
                : isValid 
                  ? "bg-red-600 text-white hover:scale-[1.03] hover:bg-red-700 shadow-red-500/20"
                  : "bg-zinc-200 dark:bg-zinc-800 text-muted-foreground cursor-not-allowed"
            )}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isDeleting ? (
                <>
                  <Loader2Icon size={16} className="animate-spin" />
                  Purging
                </>
              ) : (
                <>
                  Confirm Deletion
                  <FlameIcon size={16} />
                </>
              )}
            </span>
          </Button>
        </div>
      </Card>
    </div>
  );
}