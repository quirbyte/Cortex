import { createContext, useEffect, useState } from "react";
import { getSubDomain } from "@/utils/subdomain";

interface Tenant {
  name: string;
  isMainSite: boolean;
}

export const TenantContext = createContext<Tenant | undefined>(undefined);

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const [tenant, setTenant] = useState<Tenant>({ name: "", isMainSite: true });

  useEffect(() => {
    const sub = getSubDomain();
    if (sub) {
      setTenant({
        name: sub,
        isMainSite: false,
      });
    } else {
      setTenant({
        name: "Cortex",
        isMainSite: true,
      });
    }
  }, []);

  return (
    <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
  );
};

