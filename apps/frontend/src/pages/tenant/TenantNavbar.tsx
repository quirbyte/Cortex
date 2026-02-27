import { NavLink } from "react-router-dom";
import { Particles } from "@/components/ui/particles";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  TicketCheck, 
  Users2, 
  Settings, 
  CalendarRange 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";

interface TenantNavbarProps {
  role: string | null;
  tenantName: string;
  slug: string;
}

export default function TenantNavbar({ role, tenantName, slug }: TenantNavbarProps) {
  const { state } = useSidebar();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const navItems = [
    {
      label: "Overview",
      path: `/dashboard/${slug}/overview`,
      icon: LayoutDashboard,
      roles: ["Admin", "Moderator", "Volunteer"],
    },
    {
      label: "Verify Tickets",
      path: `/dashboard/${slug}/verify`,
      icon: TicketCheck,
      roles: ["Admin", "Moderator", "Volunteer"],
    },
    {
      label: "Manage Events",
      path: `/dashboard/${slug}/manage-events`,
      icon: CalendarRange,
      roles: ["Admin", "Moderator"],
    },
    {
      label: "Team Members",
      path: `/dashboard/${slug}/team`,
      icon: Users2,
      roles: ["Admin", "Moderator"],
    },
    {
      label: "Settings",
      path: `/dashboard/${slug}/settings`,
      icon: Settings,
      roles: ["Admin"],
    },
  ];

  return (
    <nav className="relative w-full border-b border-border bg-background/50 backdrop-blur-xl overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <Particles
          key={`nav-particles-${state}-${isDark}`}
          className="h-full w-full"
          quantity={30}
          color={isDark ? "#ffffff" : "#000000"}
          staticity={50}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-6 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                Portal Context: {role || "Guest"}
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tighter uppercase text-foreground">
              {tenantName}
            </h2>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {navItems.map((item) => {
              const hasAccess = role && item.roles.includes(role);
              if (!hasAccess) return null;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 group whitespace-nowrap",
                      isActive
                        ? "bg-foreground text-background shadow-lg scale-95"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )
                  }
                >
                  <item.icon size={14} className="group-hover:rotate-12 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}