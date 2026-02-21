import { TenantProvider } from "@/features/core/TenantContext"; 

import { useTenant } from "./features/core/useTenant";

const TenantVisualizer = () => {
  const { name, isMainSite } = useTenant();

  return (
    <div className={`p-10 m-5 rounded-lg border-2 ${isMainSite ? 'border-gray-500' : 'border-purple-600'}`}>
      <h1 className="text-2xl font-bold">
        {isMainSite ? "Welcome to Cortex Global" : `Welcome to ${name.toUpperCase()} Portal`}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Mode: {isMainSite ? "Main Platform" : "Tenant-Specific Instance"}
      </p>
    </div>
  );
};

export default function App() {
  return (
    <TenantProvider>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <TenantVisualizer />
      </div>
    </TenantProvider>
  );
}