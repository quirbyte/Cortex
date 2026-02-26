import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { 
  CrownIcon, 
  ZapIcon, 
  HeartHandshakeIcon, 
  ArrowUpRight,
  ShieldCheckIcon
} from "lucide-react";

interface OrgCardProps {
  name: string;
  role: "Admin" | "Moderator" | "Volunteer";
  onViewEvents: () => void;
}

export default function OrgCard({ name, role, onViewEvents }: OrgCardProps) {
  const getRoleTheme = () => {
    switch (role) {
      case "Admin":
        return { 
          icon: <CrownIcon size={14} />, 
          color: "text-amber-400", 
          glow: "from-amber-500/20",
          accent: "bg-amber-500/10",
          border: "group-hover:border-amber-500/30"
        };
      case "Moderator":
        return { 
          icon: <ZapIcon size={14} />, 
          color: "text-blue-400", 
          glow: "from-blue-500/20",
          accent: "bg-blue-500/10",
          border: "group-hover:border-blue-500/30"
        };
      default:
        return { 
          icon: <HeartHandshakeIcon size={14} />, 
          color: "text-emerald-400", 
          glow: "from-emerald-500/20",
          accent: "bg-emerald-500/10",
          border: "group-hover:border-emerald-500/30"
        };
    }
  };

  const theme = getRoleTheme();

  return (
    <div className="relative group w-72 aspect-3/4">
      <div className={`absolute -inset-2 bg-linear-to-b ${theme.glow} to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

      <Card className={`relative w-full h-full rounded-[2.5rem] border border-white/10 bg-[#050505] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.02] group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,1)] ${theme.border} overflow-hidden`}>

        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
          <div className={`absolute top-0 right-0 w-full h-full bg-linear-to-br ${theme.glow} via-transparent to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-700`} />

          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        <div className="relative z-20 h-full flex flex-col justify-between p-7">

          <div className="flex justify-between items-start">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/3 backdrop-blur-xl shadow-inner`}>
              <span className={theme.color}>{theme.icon}</span>
              <span className={`text-[9px] font-bold uppercase tracking-[0.15em] ${theme.color}`}>
                {role}
              </span>
            </div>
            <div className="text-white/10 group-hover:text-white/30 transition-colors">
              <ShieldCheckIcon size={18} strokeWidth={1} />
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-8 text-center opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
             <h4 className="text-[12rem] font-black leading-none select-none">
               {name.charAt(0)}
             </h4>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className={`h-1 w-1 rounded-full ${theme.color.replace('text', 'bg')} animate-pulse`} />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">
                  Verified Authority
                </span>
              </div>
              <CardTitle className="text-3xl font-black tracking-tighter leading-tight text-white uppercase italic group-hover:not-italic group-hover:tracking-tight transition-all duration-500">
                {name}
              </CardTitle>
            </div>

            <Button
              onClick={onViewEvents}
              className="group/btn relative w-full h-14 rounded-2xl bg-white text-black hover:bg-white transition-all duration-500 active:scale-95 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Access Portal
                </span>
                <ArrowUpRight size={14} strokeWidth={3} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </div>

              <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            </Button>
          </div>
        </div>

        <div className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          <div className="absolute -inset-full aspect-square bg-linear-to-tr from-transparent via-white/5 to-transparent rotate-45 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        </div>

        <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
      </Card>
    </div>
  );
}