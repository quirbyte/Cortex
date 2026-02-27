import { Outlet } from "react-router-dom";
import TenantProvider from "@/components/core/TenantProvider";

export default function TenantLayout(){
    return <TenantProvider><Outlet/></TenantProvider>
}