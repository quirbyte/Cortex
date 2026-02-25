import { Button } from "@/components/ui/button";
import AppSidebar from "./AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { BorderBeam } from "@/components/ui/border-beam";

export default function UserDashboard() {
  return (
    <div className="bg-background min-h-screen">
      <SidebarProvider className="h-screen w-screen overflow-hidden">
        <AppSidebar />
        <SidebarInset className="overflow-x-hidden flex flex-col bg-background">
          <header className="flex items-center px-4 w-full h-12 bg-background justify-between border-b border-border/50">
            <SidebarTrigger className="text-foreground hover:bg-accent" />

            <div className="relative group p-px rounded-md">
              <Button 
                className="relative bg-foreground text-background px-5 h-8 font-semibold text-xs uppercase tracking-widest z-10 rounded-[5px]"
              >
                Book Tickets
              </Button>

              <BorderBeam 
                size={30} 
                duration={6} 
                delay={0} 
                borderWidth={1.5}
                colorFrom="var(--foreground)" 
                colorTo="transparent"
              />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}