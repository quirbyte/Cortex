import { useState } from "react";
import { authApiLogin } from "../api/authApi";
import { useTenant } from "@/features/core/useTenant";
import type { AuthResponse } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const { name: currentTenant, isMainSite } = useTenant();

  const login = async (credentials: any) => {
    const data = await authApiLogin.login(credentials);
    localStorage.setItem("token", data.token);

    if (!isMainSite) {
      const orgs = await authApiLogin.checkMembership();
      const belongsToThisOrg = orgs.userOrgs.some(
        (org: any) => org.tenant.slug === currentTenant
      );

      if (!belongsToThisOrg) {
        throw new Error("You do not have access to this organization.");
      }
    }
    
    setUser(data.user);
  };

  return { login, user };
};
