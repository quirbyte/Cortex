import { TenantProvider } from "@/features/core/TenantContext";
import { AuthPage } from "./features/auth/authPage";

export default function App() {
  return (
    <TenantProvider> 
      <div className="flex min-h-screen w-full">
        <AuthPage/>
      </div>
    </TenantProvider>
  );
}