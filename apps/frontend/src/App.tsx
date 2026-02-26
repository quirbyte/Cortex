import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import AuthPage from "./pages/auth/AuthPage";
import ProtectedRoute from "./components/core/ProtectedRoute";
import UserDashboard from "./pages/dashboard/UserDashboard";
import AuthRedirect from "./components/core/AuthRedirect";
import UserSettings from "./pages/dashboard/pages/UserSettings";
import Overview from "./pages/dashboard/pages/Overview";
import Events from "./pages/dashboard/pages/Events";
import TenantHome from "./pages/dashboard/pages/TenantHome";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthRedirect />}>
          <Route element={<AuthPage />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserDashboard />}>
            <Route path="user-settings" element={<UserSettings />} />
            <Route path="overview" element={<Overview/>} />
            <Route path="events" element={<Events/>} />
            <Route path="my-orgs" element={<TenantHome/>} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
