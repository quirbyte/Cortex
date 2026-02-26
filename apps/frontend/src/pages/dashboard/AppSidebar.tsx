import { Card, CardContent } from "@/components/ui/card";
import {
  Sidebar,
  useSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { User2Icon, SunIcon, MoonIcon, LayoutDashboard,BalloonIcon,TicketIcon,Building2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AppSidebar() {
  const [userData, setUserData] = useState({
    name: localStorage.getItem("username") || "",
    email: localStorage.getItem("email") || "",
  });

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const navigate = useNavigate();
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

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="bg-sidebar text-sidebar-foreground flex flex-row items-center justify-between p-4 pb-2">
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
          <span className="font-bold text-3xl tracking-tighter text-foreground">
            Cortex
          </span>
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
      </SidebarHeader>

      <SidebarContent className="bg-sidebar text-sidebar-foreground flex flex-col items-center mt-10 gap-7 pb-18 py-8">
        <Card
          onClick={() => navigate("/dashboard/overview")}
          className="cursor-default text-foreground bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 rounded-3xl border-0 p-1 w-[90%] text-center font-bold tracking-tighter text-xl"
        >
          <div className="flex items-center justify-center gap-2">
            <LayoutDashboard size={20} className="shrink-0" />
            <span className="font-bold tracking-tighter text-xl">Overview</span>
          </div>
        </Card>
        <Card
          onClick={() => navigate("/dashboard/events")}
          className="cursor-default text-foreground bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 rounded-3xl border-0 p-1 w-[90%] text-center font-bold tracking-tighter text-xl"
        >
          <div className="flex items-center justify-center gap-2">
            <BalloonIcon size={20} className="shrink-0" />
            <span className="font-bold tracking-tighter text-xl">Browse Events</span>
          </div>
        </Card>
        <Card
          onClick={() => navigate("/dashboard/my-bookings")}
          className="cursor-default text-foreground bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 rounded-3xl border-0 p-1 w-[90%] text-center font-bold tracking-tighter text-xl"
        >
          <div className="flex items-center justify-center gap-2">
            <TicketIcon size={20} className="shrink-0" />
            <span className="font-bold tracking-tighter text-xl">My Bookings</span>
          </div>
        </Card>
        <Card
          onClick={() => navigate("/dashboard/my-orgs")}
          className="cursor-default text-foreground bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 rounded-3xl border-0 p-1 w-[90%] text-center font-bold tracking-tighter text-xl"
        >
          <div className="flex items-center justify-center gap-2">
            <Building2Icon size={20} className="shrink-0" />
            <span className="font-bold tracking-tighter text-xl">My Organizations</span>
          </div>
        </Card>
      </SidebarContent>

      <SidebarFooter
        onClick={() => navigate("/dashboard/user-settings")}
        className="bg-sidebar p-2 pt-0 cursor-pointer"
      >
        <Card className="bg-zinc-200 dark:bg-zinc-900 border-none rounded-xl shadow-none hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors duration-200 py-1.5">
          <CardContent className="flex items-center gap-3 pr-3 py-0 pl-7">
            <div className="bg-background h-8 w-8 shrink-0 flex items-center justify-center rounded-full border border-border text-muted-foreground">
              <User2Icon size={18} />
            </div>

            {state === "expanded" && (
              <div className="flex flex-col truncate">
                <div className="text-foreground text-xs font-bold truncate">
                  {userData.name}
                </div>
                <div className="text-muted-foreground text-[10px] truncate font-medium">
                  {userData.email}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
}
