import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SideBar } from "./sections/Sidebar";

export function UserPage() {
  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="bg-zinc-900 text-white">
          <SidebarTrigger />
        </header>
        <div className="main-area h-full w-full bg-zinc-900"></div>
      </SidebarInset>
    </SidebarProvider>
  );
}
