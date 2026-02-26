import {
  Sidebar,
  useSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  User2Icon,
  SunIcon,
  MoonIcon,
  LayoutDashboard,
  BalloonIcon,
  TicketIcon,
  Building2Icon,
  ChevronRight,
  FingerprintIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const [userData, setUserData] = useState({
    name: localStorage.getItem("username") || "Authorized User",
    email: localStorage.getItem("email") || "access@cortex.systems",
  });

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const syncUserData = () =>
      setUserData({
        name: localStorage.getItem("username") || "",
        email: localStorage.getItem("email") || "",
      });
    window.addEventListener("userDataUpdated", syncUserData);
    return () => window.removeEventListener("userDataUpdated", syncUserData);
  }, []);

  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, path: "/dashboard/overview" },
    { label: "Browse Events", icon: BalloonIcon, path: "/dashboard/events" },
    { label: "My Bookings", icon: TicketIcon, path: "/dashboard/my-bookings" },
    { label: "Organizations", icon: Building2Icon, path: "/dashboard/my-orgs" },
  ];

  return (
    <Sidebar className="border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#050505] transition-colors duration-500">
      <SidebarHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/cortex.png"
              alt="Cortex Logo"
              style={{
                filter:
                  theme === "dark"
                    ? "invert(100%) sepia(0%) saturate(0%) brightness(200%) contrast(100%)"
                    : "none",
              }}
              className="h-7 w-7 object-contain transition-all duration-500"
            />
            {state === "expanded" && (
              <span className="font-bold text-3xl tracking-tighter text-foreground">
                Cortex
              </span>
            )}
          </div>

          {state === "expanded" && (
            <div
              onClick={toggleTheme}
              className="relative flex items-center w-10 h-6 cursor-pointer group"
            >
              <div className="absolute w-full h-0.5 bg-border group-hover:bg-muted-foreground/30 transition-colors" />
              <div
                className={`
                absolute flex items-center justify-center transition-all duration-500 ease-in-out
                ${theme === "dark" ? "translate-x-6" : "translate-x-0"}
              `}
              >
                {theme === "dark" ? (
                  <MoonIcon
                    size={14}
                    className="text-primary drop-shadow-[0_0_5px_rgba(var(--primary),0.8)]"
                  />
                ) : (
                  <SunIcon size={14} className="text-foreground" />
                )}
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 mt-8">
        <div className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
          {state === "expanded" ? "Main Terminal" : "•••"}
        </div>

        <SidebarMenu className="gap-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "relative h-12 px-4 rounded-xl transition-all duration-300 group overflow-hidden",
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-900 text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900/40",
                  )}
                >
                  <item.icon
                    size={18}
                    className={cn(
                      "transition-all duration-500",
                      isActive
                        ? "text-primary scale-110"
                        : "group-hover:text-foreground",
                    )}
                  />

                  {state === "expanded" && (
                    <div className="flex items-center justify-between w-full ml-3">
                      <span
                        className={cn(
                          "font-bold tracking-tight text-xs uppercase transition-colors",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <ChevronRight
                          size={14}
                          className="text-primary animate-in fade-in slide-in-from-left-2 duration-500"
                        />
                      )}
                    </div>
                  )}

                  {isActive && (
                    <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <button
          onClick={() => navigate("/dashboard/user-settings")}
          className="group relative w-full flex items-center gap-3 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0a0a] hover:border-primary/40 transition-all duration-500"
        >
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-white/5 bg-zinc-200 dark:bg-zinc-800">
            <div className="absolute inset-0 bg-linear-to-tr from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <User2Icon
              size={18}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors"
            />
          </div>

          {state === "expanded" && (
            <div className="flex flex-col items-start truncate text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground leading-none">
                {userData.name || "Access Granted"}
              </span>
              <span className="text-[9px] font-bold text-muted-foreground truncate w-32 mt-1.5 opacity-60">
                {userData.email}
              </span>
            </div>
          )}

          <div className="absolute right-4">
            <FingerprintIcon
              size={14}
              className="text-muted-foreground/20 group-hover:text-primary/40 transition-colors"
            />
          </div>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
