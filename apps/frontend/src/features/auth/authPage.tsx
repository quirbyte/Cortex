import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";


export function AuthPage() {
  const [currentPage, setCurrentPage] = useState("signup");

  return (
    <div className="container h-screen w-screen flex bg-black">
      <div className="imgContainer w-[50vw]">
        <img
          className="h-screen w-full opacity-35"
          src="/authSplit.jpg"
          alt="img"
        />
      </div>

      <div className="formContainer h-screen w-[50vw] flex items-center justify-center">
        {currentPage === "login" ? (
          <LoginForm switchPage={() => setCurrentPage("signup")} />
        ) : (
          <SignupForm switchPage={() => setCurrentPage("login")} />
        )}
      </div>
    </div>
  );
}