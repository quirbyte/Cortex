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
}

export const TenantContext = createContext<InterfaceTenantContext | null>(null);

export default function TenantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tenant, setTenant] = useState<InterfaceTenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const {slug} = useParams();

  useEffect(()=>{
    const fetchData = async () =>{
        try{
            setError(null);
            const response = await apiClient.get(`/tenant/public/${slug}`);
            setTenant(response.data);
        }catch(err:any){
            setError(err.msg);
        }
        finally{
            setIsLoading(false);
        }
    }
    fetchData();
  },[slug]);

  return (
    <TenantContext.Provider value={{ tenant, isLoading, error }}>
      {children}
    </TenantContext.Provider>
  );
}
