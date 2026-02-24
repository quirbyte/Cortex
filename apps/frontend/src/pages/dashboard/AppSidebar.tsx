import { Card, CardContent } from "@/components/ui/card";
import {
  Sidebar,
  useSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { User2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AppSidebar() {
  const [userData, setUserData] = useState({
    name: localStorage.getItem("username") || "",
    email: localStorage.getItem("email") || "",
  });
  const navigate = useNavigate();
  const { state } = useSidebar();

  useEffect(() => {
    const syncUserData = () =>
      setUserData({
        name: localStorage.getItem("username") || "",
        email: localStorage.getItem("email") || "",
      });
      window.addEventListener("userDataUpdated",syncUserData);
      return () => window.removeEventListener("userDataUpdated",syncUserData);
  }, []);

  return (
    <Sidebar className="border-r border-zinc-800">
      <SidebarHeader className="bg-zinc-950 text-white font-bold p-4 text-3xl tracking-tighter">
        Cortex
      </SidebarHeader>

      <SidebarContent className="bg-zinc-950 text-white"></SidebarContent>

      <SidebarFooter
        onClick={() => navigate("/dashboard/user-settings")}
        className="bg-zinc-950 text-white p-0 cursor-pointer"
      >
        <Card className=" bg-zinc-950 border-zinc-800 border-x-0 rounded-t-sm rounded-b-none p-2">
          <CardContent className="flex items-center gap-3 px-4">
            <div className="bg-zinc-900 h-8 w-8 shrink-0 flex items-center justify-center rounded-full text-zinc-500">
              <User2Icon size={18} />
            </div>

            {state === "expanded" && (
              <div className="flex flex-col truncate">
                <div className="text-zinc-200 text-xs font-bold truncate">
                  {userData.name}
                </div>
                <div className="text-zinc-500 text-[10px] truncate">
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
