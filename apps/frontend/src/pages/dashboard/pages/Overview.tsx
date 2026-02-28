import { useState, useEffect } from "react";
import { Particles } from "@/components/ui/particles";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Ticket,
  Activity,
  Wallet,
  ArrowUpRight,
  Clock,
  Calendar as CalendarIcon,
  Loader2,
  RefreshCcw,
  Plus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import apiClient from "@/api/apiClient";
import { cn } from "@/lib/utils";
import { TopupModal } from "@/cards/TopupModal";

interface DashboardData {
  stats: {
    totalBookings: number;
    balance: number;
    engagement: number;
    daysToNextEvent: number;
  };
  recentActivity: Array<{
    id: string;
    title: string;
    location: string;
    amount: number;
    type: "debit" | "credit";
  }>;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  onAction?: () => void;
}

function StatCard({
  label,
  value,
  icon: Icon,
  description,
  onAction,
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden border-border bg-card/50 backdrop-blur-md p-8 transition-all hover:border-primary/50 group">
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="rounded-xl bg-primary/10 p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Icon size={20} />
          </div>
          {onAction && (
            <button
              onClick={onAction}
              className="p-2 rounded-full border border-border hover:bg-foreground hover:text-background transition-all"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">
            {label}
          </p>
          <h3 className="text-4xl font-black tracking-tighter uppercase leading-none italic">
            {value}
          </h3>
        </div>
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
          {description}
        </p>
      </div>
    </Card>
  );
}

export default function Overview() {
  const { state } = useSidebar();
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const currYear = new Date().getFullYear();

  useEffect(() => {
    const checkTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    fetchDashboardData();

    return () => observer.disconnect();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setSyncing(true);
      const response = await apiClient.get("/user/dashboard-summary");
      setData(response.data);
    } catch (error) {
      console.error("Critical failure during Grid Synchronization", error);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  const handleTopupSuccess = (newBalance: number) => {
    if (data) {
      setData({
        ...data,
        stats: { ...data.stats, balance: newBalance },
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
            Initializing Command Center...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full bg-background transition-colors duration-500 overflow-x-hidden">
      <TopupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTopupSuccess}
      />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles
          key={`particles-overview-${state}-${isDark}`}
          className="h-full w-full"
          quantity={isDark ? 150 : 100}
          ease={80}
          color={isDark ? "#ffffff" : "#000000"}
          staticity={30}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-350 px-6 md:px-10 py-12 md:py-20">
        <header className="relative mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4 md:space-y-6 max-w-full">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 md:w-10 bg-primary" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                Operational Dashboard
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter text-foreground uppercase leading-[0.9] wrap-break-word">
              Control <br />
              <span className="text-green-950 dark:text-muted-foreground/20">
                Dashboard
              </span>
            </h1>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Current Cycle • {currYear}
            </p>
            <div className="flex gap-4">
              <button
                onClick={fetchDashboardData}
                disabled={syncing}
                className="flex gap-2 items-center bg-card/80 border border-border px-3 md:px-4 py-2 rounded-xl hover:bg-accent transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCcw
                  size={12}
                  className={cn("text-primary", syncing && "animate-spin")}
                />
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-foreground">
                  {syncing ? "Syncing" : "Refresh"}
                </span>
              </button>
              <div className="flex gap-2 items-center bg-card/80 border border-border px-3 md:px-4 py-2 rounded-xl">
                <Clock size={12} className="text-primary" />
                <span className="text-[10px] md:text-[11px] font-bold text-foreground tabular-nums tracking-tight">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20">
          <StatCard
            label="Total Bookings"
            value={data?.stats.totalBookings ?? 0}
            icon={Ticket}
            description="Stored in your local grid"
          />
          <StatCard
            label="Credit Balance"
            value={formatCurrency(data?.stats.balance ?? 0)}
            icon={Wallet}
            description="Available for deployment"
            onAction={() => setIsModalOpen(true)}
          />
          <StatCard
            label="Engagement"
            value={`${data?.stats.engagement ?? 0}%`}
            icon={Activity}
            description="Network activity score"
          />
          <StatCard
            label="Next Phase"
            value={`${data?.stats.daysToNextEvent ?? 0}D`}
            icon={CalendarIcon}
            description="Countdown to next node"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          <Card className="lg:col-span-2 border-border bg-card/30 backdrop-blur-xl p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic">
                  Recent Activity
                </h2>
                <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Transaction Log
                </p>
              </div>
              <button className="w-fit text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-border px-4 py-2 rounded-lg hover:bg-foreground hover:text-background transition-all">
                Access Archive
              </button>
            </div>

            <div className="space-y-4 md:space-y-6">
              {data?.recentActivity && data.recentActivity.length > 0 ? (
                data.recentActivity.map((activity, i) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 md:p-6 rounded-2xl bg-background/50 border border-border/50 group hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-full bg-muted flex items-center justify-center font-black italic text-[10px] md:text-xs">
                        0{i + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black uppercase tracking-tight text-xs md:text-sm truncate">
                          {activity.title}
                        </h4>
                        <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                          {activity.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 shrink-0">
                      <span
                        className={cn(
                          "text-[10px] md:text-xs font-black italic",
                          activity.type === "debit"
                            ? "text-foreground"
                            : "text-primary",
                        )}
                      >
                        {activity.type === "debit" ? "-" : "+"}
                        {formatCurrency(activity.amount)}
                      </span>
                      <ArrowUpRight
                        size={14}
                        className="text-muted-foreground group-hover:text-primary transition-colors"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-3xl opacity-50">
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    No Recent Transactions Detected
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="border-border bg-primary p-8 md:p-10 rounded-[1.5rem] md:rounded-[2rem] text-primary-foreground flex flex-col justify-between overflow-hidden relative group min-h-75">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
              <Activity size={100} />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight italic mb-4">
                System <br />
                Status
              </h2>
              <div className="h-1 w-16 md:w-20 bg-primary-foreground mb-8" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                  <span>Profile Integrity</span>
                  <span>
                    {data?.stats.engagement
                      ? Math.max(data.stats.engagement, 40)
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-1 w-full bg-primary-foreground/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-foreground transition-all duration-1000"
                    style={{
                      width: `${data?.stats.engagement ? Math.max(data.stats.engagement, 40) : 0}%`,
                    }}
                  />
                </div>
              </div>
              <p className="text-[9px] md:text-[10px] font-bold uppercase leading-relaxed tracking-wider opacity-80">
                All systems functional. Biometric handshake verified. Grid
                access authorized for current operational cycle.
              </p>
            </div>
          </Card>
        </div>

        <footer className="mt-24 md:mt-40 flex flex-col items-center gap-8">
          <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[1em] md:tracking-[1.5em] text-muted-foreground/40 whitespace-nowrap">
            End of Intelligence Brief
          </p>
        </footer>
      </div>
    </div>
  );
}
