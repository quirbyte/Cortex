import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Particles } from "@/components/ui/particles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import apiClient from "@/api/apiClient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";

export default function UserDetails() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: localStorage.getItem("username") || "",
    email: localStorage.getItem("email") || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...userData, password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        name: editData.name,
        email: editData.email,
        ...(editData.password && { password: editData.password }),
      };
      const response = await apiClient.put("/user/update", payload);
    const updatedUser = response.data.user; 
    setUserData(updatedUser);
    localStorage.setItem("username", updatedUser.name);
    localStorage.setItem("email", updatedUser.email);
    setSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
      setTimeout(() => setError(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    try {
      setLoading(true);
      await apiClient.delete("/user/delete");
      localStorage.clear();
      navigate("/signup");
    } catch (err: any) {
      setError(err?.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <div className="relative bg-zinc-950 w-full h-screen overflow-hidden">
        <Particles
          className="absolute inset-0"
          quantity={70}
          ease={80}
          color="#ffffff"
          refresh
        />
        <div className="relative z-10 flex flex-col gap-2 items-center justify-center h-full">
          <Card className="bg-zinc-900/50 backdrop-blur-md border-0 w-[70%]">
            <CardHeader className="text-white text-2xl font-bold flex flex-row items-center justify-between">
              <div className="w-20" aria-hidden="true" />

              <div className="flex-1 text-center">
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription className="text-[16px]">
                  Edit your profile
                </CardDescription>
              </div>
              <CardAction className="w-20 flex justify-end">
                <Button
                  onClick={handleLogout}
                  className="text-white bg-zinc-800"
                >
                  Log out
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center pb-4">
                <div className="h-24 w-24 rounded-full bg-linear-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-bold text-white">
                  {userData.name[0]?.toUpperCase()}
                </div>
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-zinc-500">Username</p>
                    <p className="text-lg text-white font-medium">
                      {userData.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Email Address</p>
                    <p className="text-lg text-white font-medium">
                      {userData.email}
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-4 bg-zinc-800 hover:bg-zinc-900"
                  >
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-4 text-left">
                    <div className="space-y-2">
                      <Label className="text-sm text-zinc-400 ml-1">
                        Username
                      </Label>
                      <Input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="bg-zinc-950/50 border-zinc-800 text-white focus:ring-purple-500"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-zinc-400 ml-1">
                        Email Address
                      </Label>
                      <Input
                        value={editData.email}
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                        className="bg-zinc-950/50 border-zinc-800 text-white focus:ring-purple-500"
                        placeholder="Enter your email"
                        type="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-zinc-400 ml-1">
                        New Password
                      </Label>
                      <Input
                        type="password"
                        value={editData.password || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, password: e.target.value })
                        }
                        className="bg-zinc-950/50 border-zinc-800 text-white focus:ring-purple-500"
                        placeholder="Leave blank to keep current"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={handleSave}
                        className="flex-1 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                      >
                        {loading === false ? "Save Changes" : <Spinner />}
                      </Button>
                      <Button
                        onClick={() => {
                          setEditData({ ...userData, password: "" });
                          setIsEditing(false);
                        }}
                        variant="outline"
                        className="border-zinc-800 text-white bg-zinc-800 hover:bg-zinc-900 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                <p className="text-white font-bold">Account Deletion</p>
                <Button
                  onClick={handleAccountDelete}
                  className="bg-red-900 text-white"
                >
                  {loading === false ? "Delete Account" : <Spinner />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {(success || error) && (
        <div className="fixed bottom-6 right-6 z-50 w-80">
          <Alert variant={error ? "destructive" : "default"}>
            {success ? (
              <CheckCircle2Icon className="h-4 w-4" />
            ) : (
              <XCircleIcon className="h-4 w-4" />
            )}
            <AlertTitle>
              {success ? "Edit Successful" : "Edit Failed"}
            </AlertTitle>
            <AlertDescription>
              {success ? "You have successfully edited your info." : error}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
