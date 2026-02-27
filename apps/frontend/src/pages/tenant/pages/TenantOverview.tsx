import { Particles } from "@/components/ui/particles";
import { Activity, Users, Ticket, Calendar } from "lucide-react";
import { cn } from "@/lib/utils"; 
import { useState, useEffect } from "react";

export default function TenantOverview() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: "Active Events", value: "12", icon: Calendar, color: "text-primary" },
    { label: "Total Members", value: "48", icon: Users, color: "text-blue-500" },
    { label: "Tickets Sold", value: "1,204", icon: Ticket, color: "text-emerald-500" },
    { label: "System Health", value: "99.9%", icon: Activity, color: "text-orange-500" },
  ];

  return (
    <div className="relative min-h-[500px] w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-1">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles
          className="h-full w-full"
          quantity={50}
          color={isDark ? "#ffffff" : "#000000"}
          staticity={40}
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className="relative group overflow-hidden rounded-[2rem] border border-border bg-card/50 backdrop-blur-sm p-6 transition-all hover:bg-card hover:border-primary/50"
          >
            <stat.icon className={cn("mb-4 h-5 w-5", stat.color)} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              {stat.label}
            </p>
            <h3 className="text-3xl font-black tracking-tighter text-foreground">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>
      
      <div className="relative z-10 h-80 rounded-[2.5rem] border border-border bg-zinc-950/20 backdrop-blur-md flex items-center justify-center border-dashed">
         <div className="flex flex-col items-center gap-4">
            <Activity className="text-primary/20 animate-pulse" size={48} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/20">
              Real-time Analytics Feed
            </span>
         </div>
      </div>
    </div>
  );
}