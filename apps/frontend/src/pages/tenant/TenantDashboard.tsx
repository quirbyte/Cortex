import { useTenant } from "@/hooks/useTenant"
import TenantNavbar from "./TenantNavbar";
import { Spinner } from "@/components/ui/spinner";
import { Outlet } from "react-router-dom";

export default function TenantDashboard() {
  const { tenant, role, isLoading, error } = useTenant();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="p-10 text-destructive font-black uppercase tracking-widest">
        Error: {error || "Tenant not found"}
      </div>
    );
  }

  return (
    <div className="text-foreground">
      <TenantNavbar 
        role={role} 
        tenantName={tenant.name} 
        slug={tenant.slug} 
      />

      <main className="p-6">
        <Outlet/>
      </main>
    </div>
  );
}