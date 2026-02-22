import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TenantProvider } from "@/features/core/TenantContext";
import { AuthLayout } from "./features/auth/AuthLayout";
import { LoginForm } from "./features/auth/components/LoginForm";
import { SignupForm } from "./features/auth/components/SignupForm";
import { UserPage } from "./features/userdashboard/userPage";

export default function App() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
          </Route>
          <Route path="/dashboard" element={<UserPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </TenantProvider>
    </BrowserRouter>
  );
}
