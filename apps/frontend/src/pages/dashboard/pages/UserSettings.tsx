import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Particles } from "@/components/ui/particles";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, XCircleIcon, User2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import apiClient from "@/api/apiClient";
import { useSidebar } from "@/components/ui/sidebar";

export default function UserSettings() {
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });
  const [userData, setUserData] = useState({
    name: localStorage.getItem("username") || "",
    email: localStorage.getItem("email") || "",
  });
  const [editedData, setEditedData] = useState({ ...userData, password: "" });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { state } = useSidebar();

  const [isDark, setIsDark] = useState(true);

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

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ show: true, message, type });

    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 1500);
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
      triggerAlert("Logged out successfully", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      triggerAlert("Cannot log out", "error");
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setLoading(true);
      const payload = {
        name: editedData.name,
        email: editedData.email,
        ...(editedData.password && { password: editedData.password }),
      };
      const response = await apiClient.put("/user/update", payload);
      const updatedUser = response.data.user;
      setUserData(updatedUser);
      localStorage.setItem("username", updatedUser.name);
      localStorage.setItem("email", updatedUser.email);
      window.dispatchEvent(new Event("userDataUpdated"));
      triggerAlert("Info updated successfully", "success");
      setIsOpen(false);
    } catch (err) {
      triggerAlert("Problem editing data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await apiClient.delete("/user/delete");
      localStorage.clear();
      triggerAlert("Account deleted successfully", "success");
      setLoading(false);
      setTimeout(() => navigate("/signup"), 1500);
    } catch (err: any) {
      triggerAlert(
        err?.response?.data?.msg || "Problem in deleting account!",
        "error"
      );
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full w-full bg-background overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Particles
          key={`particles-${state}-${isDark}`}
          className="h-full w-full"
          quantity={50}
          ease={80}
          color={isDark ? "#ffffff" : "#000000"}
        />
      </div>

      <Card className="hover:scale-[1.01] transition-transform duration-300 z-50 text-foreground bg-card/40 backdrop-blur-xl border-border w-96 relative overflow-hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="absolute top-2 right-2 z-20 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          {loading === false ? "Log out" : <Spinner />}
        </Button>
        <CardHeader>
          <CardTitle className="text-2xl tracking-tighter text-center flex flex-col gap-2 items-center justify-center">
            <div className="img-div bg-background h-10 w-10 flex items-center justify-center rounded-full border border-border">
              <User2Icon />
            </div>
            <div>Your Account</div>
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            View or edit account settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="" className="flex flex-col gap-5">
            <Label>
              <div className="underline">Username</div> :{" "}
              <div className="text-muted-foreground">
                {localStorage.getItem("username")}{" "}
              </div>{" "}
            </Label>
            <Label>
              <div className="underline">Email</div> :{" "}
              <div className="text-muted-foreground">
                {localStorage.getItem("email")}
              </div>{" "}
            </Label>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="w-full rounded-xl bg-primary text-primary-foreground cursor-pointer hover:opacity-90">
                  {loading === false ? "Edit your info" : <Spinner />}
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-xl bg-card border-border text-foreground">
                <DialogHeader>
                  <DialogTitle className="text-center tracking-tighter text-2xl">
                    Edit Your Profile
                  </DialogTitle>
                  <DialogDescription className="text-center text-muted-foreground">
                    Make changes to your profile here
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Username:</FieldLabel>
                    <Input
                      className="rounded-xl border-border bg-background"
                      type="text"
                      placeholder="Edited username"
                      defaultValue={userData.name}
                      onChange={(e) =>
                        setEditedData({ ...editedData, name: e.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Email:</FieldLabel>
                    <Input
                      className="rounded-xl border-border bg-background"
                      type="email"
                      placeholder="updatedemail@example.com"
                      defaultValue={userData.email}
                      onChange={(e) =>
                        setEditedData({ ...editedData, email: e.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel>New Password:</FieldLabel>
                    <Input
                      className="rounded-xl border-border bg-background"
                      type="password"
                      placeholder="Do not edit to keep unchanged"
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          password: e.target.value,
                        })
                      }
                    />
                  </Field>
                </FieldGroup>
                <DialogFooter className="flex flex-row items-center justify-between w-full sm:justify-between">
                  <DialogClose asChild>
                    <Button variant="ghost">Discard changes</Button>
                  </DialogClose>
                  <Button
                    disabled={loading}
                    className="bg-primary text-primary-foreground hover:opacity-90"
                    onClick={handleEdit}
                  >
                    {loading === false ? "Save Changes" : <Spinner />}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="flex justify-between items-center tracking-tighter">
              <div>Delete your Account:</div>
              <Button
                variant="destructive"
                className="rounded-xl cursor-pointer hover:opacity-90"
                disabled={loading}
                onClick={handleDeleteAccount}
              >
                {loading === false ? "Delete account" : <Spinner />}
              </Button>
            </div>
          </form>
        </CardContent>
        <BorderBeam
          size={150}
          duration={10}
          colorFrom={isDark ? "#4b5563" : "#d1d5db"}
          colorTo={isDark ? "#ffffff" : "#000000"}
        />
      </Card>
      {alert.show && (
        <div className="fixed bottom-6 right-6 z-50 w-80 animate-in fade-in slide-in-from-bottom-4">
          <Alert variant={alert.type === "error" ? "destructive" : "default"}>
            {alert.type === "success" ? (
              <CheckCircle2Icon className="h-4 w-4" />
            ) : (
              <XCircleIcon className="h-4 w-4" />
            )}
            <AlertTitle>
              {alert.type === "success" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}