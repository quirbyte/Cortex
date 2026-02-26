import { Particles } from "@/components/ui/particles";
import { useSidebar } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import OrgCard from "@/cards/OrgCard";

export default function Organizations() {
  const { state } = useSidebar();
  const [isDark, setIsDark] = useState(true);

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

  const handleViewEvents = (orgName: string) => {
    console.log(`Navigating to events for: ${orgName}`);
  };

  const orgs = [
    { 
      name: "Aether Dynamics", 
      role: "Admin" as const,
    },
    { 
      name: "Veridian Collective", 
      role: "Moderator" as const,
    },
    { 
      name: "Nexus Relief", 
      role: "Volunteer" as const,
    },
  ];

  return (
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

      <div className="relative z-10 mx-auto max-w-350 px-10 py-20">
        <header className="relative mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                Organization Hub
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground uppercase leading-none">
              My <br />
              <span className="text-green-950 dark:text-muted-foreground/30">
                Entities
              </span>
            </h1>
          </div>

          <div className="flex flex-col items-start md:items-end gap-6 group/btn-container">
  <Button 
    className="
      relative h-16 px-10 overflow-hidden rounded-2xl
      bg-zinc-950 dark:bg-white 
      text-white dark:text-black 
      transition-all duration-500 ease-out
      hover:scale-[1.02] active:scale-[0.98]
      hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]
      border border-white/10 dark:border-black/10
      font-black uppercase text-[10px] tracking-[0.4em]
    "
  >
    {/* Inner Glare Effect */}
    <div className="absolute inset-0 z-0 pointer-events-none bg-linear-to-tr from-white/5 to-transparent opacity-0 group-hover/btn-container:opacity-100 transition-opacity duration-500" />
    
    {/* Button Content */}
    <div className="relative z-10 flex items-center">
      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 dark:bg-black/5 group-hover/btn-container:rotate-90 transition-transform duration-500">
        <PlusIcon size={14} strokeWidth={3} />
      </div>
      <span className="mt-0.5">Establish New</span>
    </div>

    {/* Bottom Shine Streak */}
    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover/btn-container:w-full transition-all duration-700 ease-in-out" />
  </Button>
  
  {/* Optional: Status indicator below button for extra detail */}
  <div className="flex items-center gap-2 px-2 opacity-0 group-hover/btn-container:opacity-100 transition-all duration-500 translate-y-2 group-hover/btn-container:translate-y-0">
    <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
    <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
      System Ready
    </span>
  </div>
</div>
        </header>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-x-10 gap-y-20 justify-items-center">
          {orgs.map((org, index) => (
            <OrgCard
              key={index}
              name={org.name}
              role={org.role}
              onViewEvents={() => handleViewEvents(org.name)}
            />
          ))}
        </div>

        <footer className="mt-40 flex flex-col items-center gap-8">
          <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
          <p className="text-[10px] font-black uppercase tracking-[1.5em] text-black dark:text-muted-foreground/40 whitespace-nowrap ml-[1.5em]">
            End of Registry
          </p>
        </footer>
      </div>
    </div>
  );
}