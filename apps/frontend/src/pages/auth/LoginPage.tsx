import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Particles } from "@/components/ui/particles";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import apiClient from "@/api/apiClient";
import type { loginResponse } from "./types";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | boolean>(false);
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await apiClient.post<loginResponse>("/user/login", {
        email,
        password: passwd,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.name);
      localStorage.setItem("email", data.user.email);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/dashboard/overview");
      }, 3000);
    } catch (err: any) {
      setError(err?.response?.data?.msg || err.message);
      setTimeout(() => setError(false), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-background">
      <Particles
        className="absolute inset-0 z-0"
        quantity={70}
        ease={80}
        color={isDark ? "#ffffff" : "#000000"}
        refresh
      />
      <Card className="bg-card border-border relative w-[70%] z-10 px-1 py-8 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-foreground tracking-tighter text-2xl text-center">
            Welcome to Cortex
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Login to Cortex
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-2">
                <Label className="text-foreground" htmlFor="email">
                  Email:
                </Label>
                <Input
                  type="email"
                  id="email"
                  className="border-border text-foreground bg-background cursor-default rounded-xl"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-foreground" htmlFor="password">
                  Password:
                </Label>
                <Input
                  id="password"
                  className="text-foreground border-border cursor-default bg-background rounded-xl"
                  placeholder="••••••••"
                  value={passwd}
                  type="password"
                  onChange={(e) => setPasswd(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-primary text-primary-foreground cursor-pointer hover:opacity-90"
                  disabled={loading}
                >
                  {loading === false ? "Login" : <Spinner />}
                </Button>
                <Link
                  to="/signup"
                  className="text-muted-foreground text-[12px] cursor-pointer hover:underline text-center"
                >
                  New to Cortex? Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
        <BorderBeam 
          size={150} 
          colorFrom={isDark ? "gray" : "#d1d5db"} 
          colorTo={isDark ? "white" : "#000000"} 
        />
      </Card>
      {(success || error) && (
        <div className="fixed bottom-6 right-6 z-50 w-80 animate-in fade-in slide-in-from-bottom-4">
          <Alert variant={error ? "destructive" : "default"}>
            {success ? (
              <CheckCircle2Icon className="h-4 w-4" />
            ) : (
              <XCircleIcon className="h-4 w-4" />
            )}
            <AlertTitle>
              {success ? "Login Successful" : "Login Failed"}
            </AlertTitle>
            <AlertDescription>
              {success ? "You have successfully logged in." : (error as string)}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}