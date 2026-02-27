import { useTenant } from "@/hooks/useTenant"

export default function TenantDashboard(){
    const TenantObj = useTenant();
    return <div className="text-foreground" >{TenantObj.role}</div>
}