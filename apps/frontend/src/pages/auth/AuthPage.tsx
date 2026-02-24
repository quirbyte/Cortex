import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full text-foreground hover:bg-accent"
        >
          {theme === "dark" ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </Button>
      </div>

      <div className="hidden lg:block md:w-1/2 h-full relative overflow-hidden">
        <img
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            theme === "dark" ? "opacity-60" : "opacity-0"
          }`}
          src="/authSplitDark.jpg"
          alt="Dark Visual"
        />
        
        <img
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            theme === "light" ? "opacity-60" : "opacity-0"
          }`}
          src="/authSplitLight.jpg"
          alt="Light Visual"
        />
      </div>

      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6">
        <Outlet />
      </div>
    </div>
  );
}