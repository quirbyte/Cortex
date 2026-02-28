import { useState, useEffect } from "react";
import { UserPlus, Trash2, Loader2, ShieldCheck, X, Fingerprint, AtSign, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/hooks/useTenant";
import apiClient from "@/api/apiClient";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AUTOFILL_FIX = "autofill:shadow-[0_0_0_1000px_#f9fafb_inset] dark:autofill:shadow-[0_0_0_1000px_#09090b_inset] autofill:[-webkit-text-fill-color:#18181b] dark:autofill:[-webkit-text-fill-color:white] transition-colors duration-[50000s] ease-in-out";

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
  
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const isAdmin = myRole === "Admin";

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/memberships/getAllMembers");
      setMembers(response.data.getAllMembers);
    } catch (err: any) {
      setStatusMsg({ type: "error", msg: "Failed to synchronize directory" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    try {
      setIsDeleting(memberToRemove.userId._id);
      await apiClient.delete("/memberships/remove", {
        data: { id: memberToRemove.userId._id },
      });
      setMembers((prev) => prev.filter((m) => m.userId._id !== memberToRemove.userId._id));
      setMemberToRemove(null);
      setStatusMsg({ type: "success", msg: "Operative link terminated" });
    } catch (err: any) {
      setStatusMsg({ type: "error", msg: err.response?.data?.msg || "Action failed" });
    } finally {
      setIsDeleting(null);
      setTimeout(() => setStatusMsg(null), 4000);
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
      setStatusMsg({ type: "success", msg: "Authorization link dispatched" });
    } catch (err: any) {
      setStatusMsg({ type: "error", msg: err.response?.data?.msg || "Invite failed" });
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [tenant?._id]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {statusMsg && (
        <div className={cn(
          "px-6 py-3 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 duration-300",
          statusMsg.type === "success" 
            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" 
            : "bg-red-500/5 border-red-500/20 text-red-500"
        )}>
          {statusMsg.type === "success" ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
          <p className="text-[10px] font-black uppercase tracking-widest">{statusMsg.msg}</p>
          <button onClick={() => setStatusMsg(null)} className="ml-auto opacity-50 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {memberToRemove && (
        <Alert variant="destructive" className="rounded-2xl border-red-500/20 bg-red-500/5 animate-in slide-in-from-top-4">
          <AlertTriangle className="h-4 w-4" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div>
              <AlertTitle className="text-[10px] font-black uppercase tracking-widest">Revocation Required</AlertTitle>
              <AlertDescription className="text-[9px] font-bold uppercase opacity-70">
                Are you sure you want to remove <span className="text-red-500">{memberToRemove.userId.name}</span>?
              </AlertDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setMemberToRemove(null)}
                className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-500/10"
              >
                Abort
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                disabled={!!isDeleting}
                onClick={handleRemoveMember}
                className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest bg-red-500 text-white"
              >
                {isDeleting ? <Loader2 size={12} className="animate-spin" /> : "Confirm"}
              </Button>
            </div>
          </div>
        </Alert>
      )}

      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-black shadow-lg">
            <Fingerprint size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight italic">Command Staff</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">{members.length} Authorized Records</p>
          </div>
        </div>

        {isAdmin && (
          <Button
            onClick={() => setIsInviteOpen(!isInviteOpen)}
            className={cn(
              "h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm",
              isInviteOpen ? "bg-zinc-100 text-zinc-900" : "bg-zinc-900 text-white dark:bg-white dark:text-black"
            )}
          >
            {isInviteOpen ? <X size={14} className="mr-2" /> : <UserPlus size={14} className="mr-2" />}
            {isInviteOpen ? "Cancel" : "New Invite"}
          </Button>
        )}
      </div>

      {isInviteOpen && (
        <div className="p-1 border border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-white/2 rounded-2xl animate-in slide-in-from-top-2 duration-300 shadow-inner">
          <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-2 p-2">
            <div className="flex-1 relative group">
              <AtSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                className={cn(
                  "w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-[10px] font-bold tracking-widest focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all",
                  AUTOFILL_FIX
                )}
                required
              />
            </div>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer min-w-[140px] appearance-none"
            >
              <option value="Volunteer">Volunteer</option>
              <option value="Moderator">Moderator</option>
              <option value="Admin">Admin</option>
            </select>
            <Button disabled={isLoading} className="h-10 rounded-xl px-8 font-black uppercase text-[10px] tracking-[0.2em]">
              {isLoading ? <Loader2 className="animate-spin" /> : "Establish Link"}
            </Button>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-zinc-50/50 dark:bg-white/2 border-b border-zinc-200 dark:border-white/5">
          <div className="col-span-5 text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400">Operative</div>
          <div className="col-span-3 text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 text-center">Tier</div>
          <div className="col-span-3 text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 text-center">Connection</div>
          <div className="col-span-1"></div>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-white/5">
          {isLoading && members.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4 opacity-40">
              <Loader2 className="animate-spin" size={24} strokeWidth={1.5} />
              <p className="text-[9px] font-black uppercase tracking-[0.4em]">Querying Database</p>
            </div>
          ) : (
            members.map((member) => (
              <div key={member.userId._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-zinc-50/50 dark:hover:bg-white/1 transition-all">
                <div className="col-span-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center font-black text-[10px] text-zinc-400 border border-zinc-200/50 dark:border-white/5">
                    {member.userId.name.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-none">
                      {member.userId.name}
                    </p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                      {member.userId.email}
                    </p>
                  </div>
                </div>

                <div className="col-span-3 flex justify-center">
                  <span className={cn(
                    "text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border transition-all",
                    member.role === "Admin" 
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-transparent shadow-md" 
                      : "bg-transparent text-zinc-400 border-zinc-200 dark:border-white/10"
                  )}>
                    {member.role}
                  </span>
                </div>

                <div className="col-span-3 flex justify-center">
                  <div className="flex items-center gap-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Active</span>
                  </div>
                </div>

                <div className="col-span-1 flex justify-end">
                  {isAdmin && member.role !== "Admin" && (
                    <Button
                      onClick={() => setMemberToRemove(member)}
                      variant="ghost"
                      className="h-9 w-9 rounded-xl text-zinc-300 hover:text-red-500 hover:bg-red-500/10 transition-all p-0 group"
                    >
                      <Trash2 size={16} className="transition-transform group-hover:scale-110" />
                    </Button>
                  )}
                  {member.role === "Admin" && (
                    <div className="h-9 w-9 flex items-center justify-center">
                      <ShieldCheck size={16} className="text-zinc-200 dark:text-white/10" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}