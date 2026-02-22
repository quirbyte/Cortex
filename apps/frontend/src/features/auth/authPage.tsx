import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";

export function AuthPage() {
  const [currentPage, setCurrentPage] = useState("signup");

  return (
    <div className="flex h-screen w-full bg-black">
      <div className="hidden md:block md:w-1/2 h-full">
        <img
          className="h-full w-full object-cover opacity-35"
          src="/authSplit.jpg"
          alt="img"
        />
      </div>

      <div className="w-full md:w-1/2 h-full flex items-center justify-center p-6">
        {currentPage === "login" ? (
          <LoginForm switchPage={() => setCurrentPage("signup")} />
        ) : (
          <SignupForm switchPage={() => setCurrentPage("login")} />
        )}
      </div>
    </div>
  );
}
