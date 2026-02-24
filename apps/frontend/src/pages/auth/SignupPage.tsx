import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Particles } from "@/components/ui/particles";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import apiClient from "@/api/apiClient";

export default function SignupPage() {
  const [name, setName] = useState("");
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
      await apiClient.post("/user/signup", {
        username: name,
        email,
        password: passwd,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
      setTimeout(() => setError(false), 3000);
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
      <Card className="bg-card border-border relative z-10 w-[70%] px-1 py-8 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-foreground tracking-tighter text-2xl text-center">
            Welcome to Cortex
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            SignUp for Cortex
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-2">
                <Label className="text-foreground" htmlFor="username">
                  Username:
                </Label>
                <Input
                  id="username"
                  value={name}
                  type="text"
                  className="text-foreground border-border bg-background cursor-default rounded-xl"
                  placeholder="name"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-foreground" htmlFor="email">
                  Email:
                </Label>
                <Input
                  id="email"
                  value={email}
                  type="email"
                  className="text-foreground border-border bg-background cursor-default rounded-xl"
                  placeholder="name@example.com"
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
                  value={passwd}
                  className="text-foreground border-border cursor-default bg-background rounded-xl"
                  placeholder="••••••••"
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
                  {loading === false ? "Signup" : <Spinner />}
                </Button>
                <Link
                  to="/login"
                  className="text-muted-foreground text-[12px] cursor-pointer hover:underline text-center"
                >
                  Already used Cortex? Log in
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
              {success ? "Signup Successful" : "Signup Failed"}
            </AlertTitle>
            <AlertDescription>
              {success ? "You have successfully signed up." : (error as string)}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}