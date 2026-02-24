import { Card, CardContent } from "@/components/ui/card";
import {
  Sidebar,
  useSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { User2Icon, SunIcon, MoonIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
      <SidebarHeader className="bg-sidebar text-sidebar-foreground flex flex-row items-center justify-between font-bold p-4 text-3xl tracking-tighter">
        <span>Cortex</span>
        {state === "expanded" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 text-sidebar-foreground"
          >
            {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </Button>
        )}
      </SidebarHeader>

      <SidebarContent className="bg-sidebar text-sidebar-foreground"></SidebarContent>

      <SidebarFooter
        onClick={() => navigate("/dashboard/user-settings")}
        className="bg-sidebar text-sidebar-foreground p-0 cursor-pointer"
      >
        <Card className="bg-sidebar border-border border-x-0 border-t rounded-t-sm rounded-b-none p-2 shadow-none">
          <CardContent className="flex items-center gap-3 px-4">
            <div className="bg-sidebar-accent h-8 w-8 shrink-0 flex items-center justify-center rounded-full text-muted-foreground">
              <User2Icon size={18} />
            </div>

            {state === "expanded" && (
              <div className="flex flex-col truncate">
                <div className="text-sidebar-foreground text-xs font-bold truncate">
                  {userData.name}
                </div>
                <div className="text-muted-foreground text-[10px] truncate">
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