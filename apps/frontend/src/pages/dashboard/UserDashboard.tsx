import AppSidebar from "./AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function UserDashboard() {
  return (
    <div className="bg-background min-h-screen">
      <SidebarProvider className="h-screen w-screen overflow-hidden">
        <AppSidebar />
        <SidebarInset className="overflow-x-hidden flex flex-col bg-background">
          <header className="flex items-center px-4 w-full h-10 bg-background">
            <SidebarTrigger className="text-foreground hover:bg-accent" />
          </header>
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}