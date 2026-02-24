import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "lucide-react";

export default function AuthPage() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex h-screen w-full bg-background transition-colors duration-500 relative">
      <div className="absolute top-8 right-8 z-50">
        <div 
          onClick={toggleTheme}
          className="relative flex flex-col items-center h-12 w-6 cursor-pointer group"
        >
          <div className="absolute h-full w-px bg-border group-hover:bg-muted-foreground/30 transition-colors" />
          
          <div className={`
            absolute flex items-center justify-center transition-all duration-500 ease-in-out
            ${theme === "dark" ? "translate-y-8" : "translate-y-0"}
          `}>
            {theme === "dark" ? (
              <MoonIcon size={16} className="text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
            ) : (
              <SunIcon size={16} className="text-foreground" />
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block md:w-1/2 h-full relative overflow-hidden">
        <img
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            theme === "dark" ? "opacity-60" : "opacity-0"
          }`}
          src="/authSplitDark.png"
          alt="Dark Visual"
        />
        
        <img
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            theme === "light" ? "opacity-60" : "opacity-0"
          }`}
          src="/authSplitLight.png"
          alt="Light Visual"
        />
      </div>

      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6">
        <Outlet />
      </div>
    </div>
  );
}