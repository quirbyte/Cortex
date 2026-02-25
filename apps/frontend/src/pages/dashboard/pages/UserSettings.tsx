import { Particles } from "@/components/ui/particles";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle2Icon,
  XCircleIcon,
  User2Icon,
  LogOutIcon,
  Trash2Icon,
  Settings2Icon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useState, useEffect } from "react";
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
  }>({ show: false, message: "", type: "success" });

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
    const checkTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
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
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 1500);
  };

  const handleLogout = () => {
    localStorage.clear();
    triggerAlert("Logged out successfully", "success");
    setTimeout(() => navigate("/login"), 1500);
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
      triggerAlert("Profile synchronized", "success");
      setIsOpen(false);
    } catch (err) {
      triggerAlert("Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await apiClient.delete("/user/delete");
      localStorage.clear();
      triggerAlert("Account terminated", "success");
      setTimeout(() => navigate("/signup"), 1500);
    } catch (err: any) {
      triggerAlert("Action restricted", "error");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <Particles
          key={`particles-${state}-${isDark}`}
          className="h-full w-full"
          quantity={isDark ? 80 : 40}
          ease={80}
          color={isDark ? "#ffffff" : "#000000"}
          staticity={30}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-[1200px] px-8 py-20 lg:py-32">
        <header className="mb-16 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">
              Account Controls
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-foreground uppercase leading-none">
            User <br />
            <span className="text-green-950 dark:text-muted-foreground/20">Details & Settings</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-card border border-border p-8 transition-all duration-500 hover:shadow-2xl">
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center border border-border shadow-inner">
                  <User2Icon size={32} className="text-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    {userData.name}
                  </h2>
                  <p className="text-xs font-medium text-muted-foreground">
                    {userData.email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full rounded-xl border-border bg-transparent hover:bg-foreground hover:text-background transition-all uppercase text-[10px] font-black tracking-widest"
                >
                  <LogOutIcon size={14} className="mr-2" />
                  Sign Out
                </Button>
              </div>
              <BorderBeam
                size={200}
                duration={12}
                colorFrom="var(--primary)"
                colorTo="transparent"
              />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <section className="rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-md p-10 space-y-8">
              <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">
                    Identity Information
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Manage how your profile appears to others.
                  </p>
                </div>
                <Settings2Icon className="text-black dark:text-muted-foreground/20" size={40} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                    Username
                  </p>
                  <p className="text-sm font-semibold">{userData.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold">{userData.email}</p>
                </div>
              </div>

              <div className="pt-4">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-12 px-8 rounded-xl bg-foreground text-background font-bold uppercase text-[10px] tracking-widest transition-transform active:scale-95">
                      {loading ? <Spinner /> : "Update Profile"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="backdrop-blur-2xl bg-card/95 border-border">
                    <DialogHeader className="space-y-3">
                      <DialogTitle className="text-3xl font-black tracking-tighter uppercase">
                        Edit Profile
                      </DialogTitle>
                      <DialogDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        Synchronize your credentials
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="py-6">
                      <Field>
                        <FieldLabel className="text-[10px] font-black uppercase">
                          Username
                        </FieldLabel>
                        <Input
                          className="h-12 rounded-xl bg-background border-border"
                          defaultValue={userData.name}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              name: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel className="text-[10px] font-black uppercase">
                          Email
                        </FieldLabel>
                        <Input
                          className="h-12 rounded-xl bg-background border-border"
                          type="email"
                          defaultValue={userData.email}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              email: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel className="text-[10px] font-black uppercase">
                          New Password
                        </FieldLabel>
                        <Input
                          className="h-12 rounded-xl bg-background border-border"
                          type="password"
                          placeholder="••••••••"
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              password: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </FieldGroup>
                    <DialogFooter className="sm:justify-between">
                      <DialogClose asChild>
                        <Button
                          variant="ghost"
                          className="text-[10px] font-bold uppercase tracking-widest"
                        >
                          Discard
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={handleEdit}
                        disabled={loading}
                        className="h-12 px-8 rounded-xl bg-primary font-bold uppercase text-[10px] tracking-widest"
                      >
                        {loading ? <Spinner /> : "Confirm Update"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </section>

            <section className="rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-10 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors hover:bg-destructive/10">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-lg font-bold tracking-tight text-destructive">
                  Danger Zone
                </h3>
                <p className="text-xs text-muted-foreground">
                  Irreversible action. All data will be purged.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={loading}
                className="h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
              >
                <Trash2Icon size={14} className="mr-2" />
                Terminate Account
              </Button>
            </section>
          </div>
        </div>
      </main>

      {alert.show && (
        <div className="fixed bottom-10 right-10 z-[100] w-80 animate-in fade-in slide-in-from-bottom-10 duration-500">
          <Alert className="border-border bg-card/80 backdrop-blur-xl shadow-2xl rounded-2xl border-l-4 border-l-primary">
            {alert.type === "success" ? (
              <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
            ) : (
              <XCircleIcon className="h-4 w-4 text-destructive" />
            )}
            <AlertTitle className="text-xs font-black uppercase tracking-widest">
              {alert.type}
            </AlertTitle>
            <AlertDescription className="text-xs font-medium text-muted-foreground">
              {alert.message}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
