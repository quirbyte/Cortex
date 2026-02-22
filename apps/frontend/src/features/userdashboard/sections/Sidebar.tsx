import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Ticket, Building2, UserCircle,Users,Settings2, CalendarCogIcon,TicketCheck } from "lucide-react";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

export function SideBar() {
  return (
    <Sidebar className="border-r border-zinc-800 bg-black">
      <SidebarHeader className="h-20 px-6 bg-black flex items-center justify-start border-b border-zinc-900">
        <div className="z-10 flex items-center justify-center">
          <AnimatedShinyText className="inline-flex items-center justify-center transition ease-out">
            <span className="text-3xl font-bold tracking-tighter bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              Cortex
            </span>
          </AnimatedShinyText>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-black px-4 pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase pb-3">
            Personal Workspace
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors">
                <LayoutDashboard className="size-4" />
                <span className="text-sm font-medium">Overview</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors">
                <Ticket className="size-4" />
                <span className="text-sm font-medium">My-Bookings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors">
                <Building2 className="size-4" />
                <span className="text-sm font-medium">My Memberships</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase pb-3">
            Management
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors">
                <Settings2 className="size-4" />
                <span className="text-sm font-medium">Organization Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors">
                <Users className="size-4" />
                <span className="text-sm font-medium">Team Members</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors">
                <CalendarCogIcon className="size-4" />
                <span className="text-sm font-medium">Event Manager</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase pb-3">
            Operations
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors">
                <TicketCheck className="size-4" />
                <span className="text-sm font-medium">Ticket Verification</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-black p-4 border-t border-zinc-800/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-zinc-900 data-[state=open]:text-white hover:bg-zinc-900 hover:text-white transition-all duration-200"
            >
              {/* The Avatar Circle */}
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400">
                <UserCircle className="size-5" />
              </div>

              {/* The Text Info */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-white">
                  Username
                </span>
                <span className="truncate text-xs text-zinc-500">
                  user@cortex.com
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
