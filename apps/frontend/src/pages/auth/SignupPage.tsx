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
import { useState } from "react";
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
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      setLoading(true);
      await apiClient.post("/user/signup",{
        username:name,
        email,
        password:passwd
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
      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <Particles
              className="absolute inset-0 z-0"
              quantity={70}
              ease={80}
              color="#ffffff"
              refresh
            />
        <Card className="bg-zinc-950 border-none relative z-10 w-[70%] px-1 py-8">
          <CardHeader>
            <CardTitle className="text-white tracking-tighter text-2xl text-center">
              Welcome to Cortex
            </CardTitle>
            <CardDescription className="text-center">
              SignUp for Cortex
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="">
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-2">
                  <Label className="text-white" htmlFor="username">
                    Username:
                  </Label>
                  <Input
                    value={name}
                    type="text"
                    className="text-white border-[0.5px] border-none bg-zinc-900 cursor-default rounded-xl"
                    placeholder="name"
                    onChange={(e) => setName(e.target.value)}
                  ></Input>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-white" htmlFor="email">
                    Email:
                  </Label>
                  <Input
                    value={email}
                    type="email"
                    className="text-white border-[0.5px] border-none bg-zinc-900 cursor-default rounded-xl"
                    placeholder="name@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                  ></Input>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-white" htmlFor="password">
                    Password:
                  </Label>
                  <Input
                    value={passwd}
                    className="text-white border-[0.5px] border-none cursor-default bg-zinc-900 rounded-xl"
                    placeholder="••••••••"
                    type="password"
                    onChange={(e) => setPasswd(e.target.value)}
                  ></Input>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full rounded-xl bg-white text-black cursor-pointer hover:bg-zinc-200"
                    onClick={handleSubmit}
                  >
                    {loading === false ? "Signup" : <Spinner />}
                  </Button>
                  <Link
                    to="/login"
                    className="text-zinc-500 text-[12px] cursor-default hover:underline text-center"
                  >
                    Already used Cortex? Log in
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
          <BorderBeam size={150} colorFrom="gray" colorTo="white" />
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
                {success ? "You have successfully signed up." : error}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
  );
}
