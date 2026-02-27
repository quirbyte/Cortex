import apiClient from "@/api/apiClient";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface InterfaceTenant {
  _id: string;
  name: string;
  slug: string;
}

interface InterfaceTenantContext {
  tenant: InterfaceTenant | null;
  isLoading: boolean;
  error: string | null;
  role: string | null;
}

interface InterfaceGetRole{
  role: "Admin" | "Moderator" | "Volunteer";
  msg: string;
}

export const TenantContext = createContext<InterfaceTenantContext | null>(null);

export default function TenantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tenant, setTenant] = useState<InterfaceTenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [role, setRole] = useState<string|null>("Volunteer");
  const { slug } = useParams();

  useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const tenantRes = await apiClient.get(`/tenant/public/${slug}`);
      setTenant(tenantRes.data);

      const roleRes = await apiClient.get<InterfaceGetRole>(
        `/memberships/my-role/${tenantRes.data._id}`
      );
      
      setRole(roleRes.data.role);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setRole(null);
        setError("You are not a member of this organization.");
      } else {
        setError(err.response?.data?.msg || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (slug) fetchData();
}, [slug]);
  return (
    <TenantContext.Provider value={{ tenant, isLoading, error, role }}>
      {children}
    </TenantContext.Provider>
  );
}
