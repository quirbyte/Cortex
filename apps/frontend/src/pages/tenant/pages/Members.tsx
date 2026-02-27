import { UserPlus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Members() {
  return (
    <div className="rounded-[2.5rem] border border-border bg-card/30 backdrop-blur-sm overflow-hidden">
      <div className="p-8 border-b border-border flex justify-between items-center">
        <h3 className="font-black uppercase tracking-widest text-xs text-foreground">Personnel Directory</h3>
        <Button size="sm" variant="outline" className="rounded-xl border-primary/20 text-[10px] font-black uppercase tracking-widest">
          <UserPlus size={14} className="mr-2" /> Invite Member
        </Button>
      </div>
      <div className="p-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-transparent hover:border-border transition-all">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-accent" />
              <div>
                <p className="text-sm font-bold uppercase tracking-tight">System User {i}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-medium">user_{i}@cortex.systems</p>
              </div>
            </div>
            <span className="text-[9px] font-black px-3 py-1 bg-primary/10 text-primary rounded-full uppercase">Admin</span>
          </div>
        ))}
      </div>
    </div>
  );
}