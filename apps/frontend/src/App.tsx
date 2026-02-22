import { TenantProvider } from "@/features/core/TenantContext";
import { AuthPage } from "./features/auth/authPage";
import { UserPage } from "./features/userdashboard/userPage";

export default function App() {
  return (
    <TenantProvider> 
      <div className="flex min-h-screen w-full">
        <UserPage/>
      </div>
    </TenantProvider>
  );
}