import { Particles } from "@/components/ui/particles";
import { Activity, Users, Ticket, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import apiClient from "@/api/apiClient";
import { useTenant } from "@/hooks/useTenant";

interface dashboardDataInterface {
  activeEvents: number;
  totalMembers: number;
  ticketsSold: number;
  recentActivities: {
    user_id: { name: string };
    event_id: { name: string };
    createdAt: string;
  }[];
}

export default function TenantOverview() {
  const [isDark, setIsDark] = useState(true);
  const [dashboardData, setDashboardData] =
    useState<dashboardDataInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { tenant } = useTenant();

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

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!tenant?.slug) return;

      try {
        setIsLoading(true);
        const response = await apiClient.get<dashboardDataInterface>(
          "/tenant/dashboard-stats",
          {
            headers: {
              "tenant-slug": tenant.slug,
            },
          },
        );
        setDashboardData(response.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [tenant?.slug]);

  const stats = [
    {
      label: "Active Events",
      value: dashboardData?.activeEvents ?? 0,
      icon: Calendar,
      color: "text-primary",
    },
    {
      label: "Total Members",
      value: dashboardData?.totalMembers ?? 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Tickets Sold",
      value: dashboardData?.ticketsSold ?? 0,
      icon: Ticket,
      color: "text-emerald-500",
    },
    {
      label: "System Health",
      value: "99.9%",
      icon: Activity,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="relative min-h-125 w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-1">
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
            className={cn(
              "relative group overflow-hidden rounded-[2rem] border border-border bg-card/50 backdrop-blur-sm p-6 transition-all hover:bg-card hover:border-primary/50",
              isLoading && "animate-pulse",
            )}
          >
            <stat.icon className={cn("mb-4 h-5 w-5", stat.color)} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              {stat.label}
            </p>
            <h3 className="text-3xl font-black tracking-tighter text-foreground">
              {isLoading ? "..." : stat.value.toLocaleString()}
            </h3>
          </div>
        ))}
      </div>

      <div className="relative z-10 min-h-80 rounded-[2.5rem] border border-border bg-zinc-950/20 backdrop-blur-md p-8 border-dashed">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Activity className="text-primary" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
              Real-time Analytics Feed
            </span>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground animate-pulse text-center py-10">
                Fetching activities...
              </p>
            ) : dashboardData?.recentActivities.length ? (
              dashboardData.recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">
                      {activity.user_id.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Booked a ticket for{" "}
                      <span className="text-primary">
                        {activity.event_id.name}
                      </span>
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground/40 font-mono">
                    {new Date(activity.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2 opacity-20">
                <Activity size={48} />
                <span className="text-xs uppercase tracking-widest">
                  No recent activity found
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
