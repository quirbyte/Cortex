import { BorderBeam } from "@/components/ui/border-beam";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authApiSignup } from "../api/authApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export function SignupForm({ switchPage }: { switchPage: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authApiSignup.signup({
        username:name,
        email,
        password,
      });

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        switchPage();
      }, 3000);

    } catch (err: any) {
      setError(err?.message || "Signup failed. Please try again.");

      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="relative w-80 overflow-hidden md:w-96 bg-zinc-950 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold tracking-tight">
            Signup for Cortex
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="name"
                  placeholder="username"
                  className="bg-zinc-900 border-zinc-800"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  className="bg-zinc-900 border-zinc-800"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="passwd"
                  placeholder="••••••••"
                  className="bg-zinc-900 border-zinc-800"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="bg-white text-black cursor-pointer hover:bg-zinc-200"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Sign Up"}
              </Button>

              <p
                className="text-zinc-500 -mt-2.5 w-full text-center tracking-tight text-[12px] hover:underline cursor-pointer"
                onClick={switchPage}
              >
                Already have an account? Login
              </p>
            </div>
          </form>
        </CardContent>

        <BorderBeam
          size={250}
          duration={12}
          delay={9}
          borderWidth={1}
          colorFrom="grey"
          colorTo="white"
        />
      </Card>

      {(success || error) && (
        <div className="fixed bottom-6 right-6 z-50 w-80">
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
              {success
                ? "You have successfully signed up."
                : error}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}