import AppSidebar from "./AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function UserDashboard() {
  return (
    <div>
      <SidebarProvider className="bg-black h-screen w-screen overflow-hidden">
        <AppSidebar />
        <SidebarInset className="overflow-x-hidden flex-1">
          <header className="bg-black w-full h-7">
            <SidebarTrigger className="text-white" />
          </header>
          <Outlet/>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
