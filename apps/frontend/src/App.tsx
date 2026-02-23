import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import AuthPage from "./pages/auth/AuthPage";
import ProtectedRoute from "./components/core/ProtectedRoute";
import UserDashboard from "./pages/dashboard/UserDashboard";
import AuthRedirect from "./components/core/AuthRedirect";

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
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
