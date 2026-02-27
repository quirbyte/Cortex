import { useState, useEffect } from "react";
import { UserPlus, Trash2, Loader2, ShieldCheck, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/hooks/useTenant";
import apiClient from "@/api/apiClient";
import { cn } from "@/lib/utils";

interface Member {
  role: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function Members() {
  const { tenant, role: myRole } = useTenant();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Volunteer");

  const isAdmin = myRole === "Admin";

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/memberships/getAllMembers");
      setMembers(response.data.getAllMembers);
    } catch (err: any) {
      console.error(err.response?.data?.msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (targetUserId: string) => {
    try {
      setIsDeleting(targetUserId);
      await apiClient.delete("/memberships/remove", {
        data: { id: targetUserId },
      });
      setMembers((prev) => prev.filter((m) => m.userId._id !== targetUserId));
    } catch (err: any) {
      console.error(err.response?.data?.msg);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    try {
      setIsLoading(true);
      await apiClient.post("/memberships/add", {
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail("");
      setIsInviteOpen(false);
      fetchMembers();
    } catch (err: any) {
      alert(err.response?.data?.msg || "Failed to invite user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [tenant?._id]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {isInviteOpen && (
        <div className="p-8 rounded-[2.5rem] border border-primary/30 bg-primary/5 backdrop-blur-md space-y-4 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsInviteOpen(false)}
              className="rounded-full"
            >
              <X size={18} />
            </Button>
          </div>
          <h4 className="font-black uppercase tracking-tighter text-xl italic">
            Initiate Personnel Link
          </h4>
          <form
            onSubmit={handleInvite}
            className="flex flex-col md:flex-row gap-4"
          >
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="USER_EMAIL@CORTEX.SYSTEMS"
              className="flex-1 bg-background border border-border rounded-2xl px-6 py-3 text-[10px] font-bold tracking-widest  focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="bg-background border border-border rounded-2xl px-6 py-3 text-[10px] font-bold tracking-widest uppercase focus:outline-none"
            >
              <option value="Volunteer">Volunteer</option>
              <option value="Moderator">Moderator</option>
              <option value="Admin">Admin</option>
            </select>
            <Button
              disabled={isLoading}
              className="rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Confirm Link"
              )}
            </Button>
          </form>
        </div>
      )}

      <div className="rounded-[2.5rem] border border-border bg-card/30 backdrop-blur-sm overflow-hidden">
        <div className="p-8 border-b border-border flex justify-between items-center bg-zinc-900/20">
          <div>
            <h3 className="font-black uppercase tracking-widest text-xs text-foreground">
              Personnel Directory
            </h3>
            <p className="text-[10px] text-muted-foreground uppercase mt-1 tracking-wider">
              {members.length} Authorized Persons
            </p>
          </div>

          {isAdmin && !isInviteOpen && (
            <Button
              onClick={() => setIsInviteOpen(true)}
              size="sm"
              variant="outline"
              className="rounded-xl border-primary/20 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <UserPlus size={14} className="mr-2" /> Invite Member
            </Button>
          )}
        </div>

        <div className="p-8 space-y-4">
          {isLoading && members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
              <Loader2 className="animate-spin" size={40} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                Synchronizing Registry...
              </p>
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.userId._id}
                className="group flex items-center justify-between p-5 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-primary/30 transition-all duration-500"
              >
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-primary/20 to-accent/20 border border-white/5 flex items-center justify-center font-black text-primary text-xl">
                    {member.userId.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold uppercase tracking-tight text-foreground">
                        {member.userId.name}
                      </p>
                      <span
                        className={cn(
                          "text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter",
                          member.role === "Admin"
                            ? "bg-primary/10 text-primary"
                            : "bg-zinc-800 text-muted-foreground",
                        )}
                      >
                        {member.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 opacity-50">
                      <Mail size={10} />
                      <p className="text-[10px] uppercase font-medium tracking-wider">
                        {member.userId.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isAdmin &&
                    member.userId._id !== (tenant as any)?.ownerId &&
                    member.role !== "Admin" && (
                      <Button
                        onClick={() => handleRemoveMember(member.userId._id)}
                        disabled={isDeleting === member.userId._id}
                        variant="ghost"
                        className="h-10 w-10 rounded-xl bg-destructive/5 text-destructive/40 hover:bg-destructive hover:text-destructive-foreground transition-all opacity-0 group-hover:opacity-100"
                      >
                        {isDeleting === member.userId._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </Button>
                    )}
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-muted-foreground">
                    <ShieldCheck size={18} />
                  </div>
                </div>
              </div>
            ))
          )}

          {!isLoading && members.length === 0 && (
            <div className="text-center py-20 opacity-20">
              <p className="text-[10px] font-black uppercase tracking-[0.5em]">
                No Personnel Found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
