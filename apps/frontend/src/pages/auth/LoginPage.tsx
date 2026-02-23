import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import axios from "axios";
import type { loginResponse } from "./types";

export default function LoginPage() {
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
      const { data } = await axios.post<loginResponse>("/api/v1/user/login", {
        email,
        password: passwd,
      });
      localStorage.setItem("token", data.token);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/dashboard");
      }, 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
      setTimeout(() => setError(false), 3000);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Card className="bg-zinc-950 border-none relative w-[70%] p-2">
        <CardHeader>
          <CardTitle className="text-white tracking-tighter text-2xl text-center">
            Welcome to Cortex
          </CardTitle>
          <CardDescription className="text-center text-xl">
            Login to Cortex
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="">
            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-2">
                <Label className="text-white" htmlFor="email">
                  Email:
                </Label>
                <Input
                  type="email"
                  className="border-[0.5px] border-none bg-zinc-900 cursor-default rounded-xl"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Input>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-white" htmlFor="password">
                  Password:
                </Label>
                <Input
                  className="border-[0.5px] border-none cursor-default bg-zinc-900 rounded-xl"
                  placeholder="-------"
                  value={passwd}
                  type="password"
                  onChange={(e) => setPasswd(e.target.value)}
                ></Input>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full rounded-xl bg-white text-black cursor-pointer hover:bg-zinc-200"
                  onClick={handleSubmit}
                >
                  {loading === false ? "Login" : <Spinner />}
                </Button>
                <Link
                  to="/signup"
                  className="text-zinc-500 text-[12px] cursor-default hover:underline text-center"
                >
                  New to Cortex? Sign up
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
              {success ? "Login Successful" : "Login Failed"}
            </AlertTitle>
            <AlertDescription>
              {success ? "You have successfully logged in." : error}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
