import { Outlet } from "react-router-dom";
import TenantProvider from "@/components/core/TenantProvider";

export default function TenantDashboard(){
    return <TenantProvider><Outlet/></TenantProvider>
}