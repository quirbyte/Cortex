import { useState, useEffect } from "react";
import { 
  Settings2, 
  Loader2, 
  Fingerprint, 
  Save, 
  AlertTriangle, 
  RefreshCw, 
  Globe,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/hooks/useTenant";
import apiClient from "@/api/apiClient";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AUTOFILL_FIX = "autofill:shadow-[0_0_0_1000px_#f9fafb_inset] dark:autofill:shadow-[0_0_0_1000px_#09090b_inset] autofill:[-webkit-text-fill-color:#18181b] dark:autofill:[-webkit-text-fill-color:white] transition-colors duration-[50000s] ease-in-out";

export default function TenantSettings() {
  const { tenant } = useTenant(); 
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: ""
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || "",
        slug: tenant.slug || ""
      });
    }
  }, [tenant]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant?._id) return;

    try {
      setIsUpdating(true);
      const response = await apiClient.put(`/tenant/update/${tenant._id}`, {
        updatedName: formData.name,
        updatedSlug: formData.slug
      });

      setStatusMsg({ type: "success", msg: response.data.msg });
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err: any) {
      setStatusMsg({ 
        type: "error", 
        msg: err.response?.data?.msg || "Failed to update system parameters" 
      });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  const handleDelete = async () => {
    if (!tenant?._id) return;
    try {
      setIsDeleting(true);
      await apiClient.delete(`/tenant/delete/${tenant._id}`);
      window.location.href = "/dashboard"; 
    } catch (err: any) {
      setStatusMsg({ type: "error", msg: "Terminal error during archival sequence" });
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-black shadow-xl">
            <Settings2 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">System Configuration</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Tenant ID: {tenant?._id}</p>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div className={cn(
          "px-6 py-4 rounded-2xl border flex items-center gap-3 animate-in zoom-in-95",
          statusMsg.type === "success" 
            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" 
            : "bg-red-500/5 border-red-500/20 text-red-500"
        )}>
          <Info size={16} />
          <p className="text-[10px] font-black uppercase tracking-widest">{statusMsg.msg}</p>
        </div>
      )}

      <section className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <Globe size={14} className="text-zinc-400" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Identity & Routing</h3>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-[2rem] shadow-sm">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest ml-1 text-zinc-500">Organization Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={cn("w-full bg-zinc-50 dark:bg-white/2 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all", AUTOFILL_FIX)}
              placeholder="System Entity Name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest ml-1 text-zinc-500">URL Slug (Permanent Link)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold opacity-30">/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                className={cn("w-full bg-zinc-50 dark:bg-white/2 border border-zinc-200 dark:border-white/10 rounded-xl pl-8 pr-4 py-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all", AUTOFILL_FIX)}
                placeholder="org-slug-link"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end pt-4 border-t border-zinc-100 dark:border-white/5 mt-4">
            <Button 
              disabled={isUpdating} 
              className="h-11 px-8 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
            >
              {isUpdating ? <RefreshCw className="animate-spin mr-2" size={14} /> : <Save className="mr-2" size={14} />}
              Synchronize Changes
            </Button>
          </div>
        </form>
      </section>

      <section className="space-y-6 pt-10">
        <div className="flex items-center gap-2 px-2">
          <AlertTriangle size={14} className="text-red-500" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-red-500">Danger Zone</h3>
        </div>

        <div className="p-8 border border-red-500/20 bg-red-500/2 rounded-[2rem] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-tight text-red-500">Deactivate Organization</h4>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed max-w-md">
                This will archive the organization and all associated events. Active bookings will be automatically refunded and system access revoked.
              </p>
            </div>
            {!showDeleteConfirm ? (
              <Button 
                onClick={() => setShowDeleteConfirm(true)}
                variant="outline"
                className="h-11 px-8 rounded-xl border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition-all"
              >
                Initiate Deactivation
              </Button>
            ) : (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                <Button 
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="ghost"
                  className="h-11 rounded-xl font-black uppercase text-[10px] tracking-widest"
                >
                  Abort
                </Button>
                <Button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-11 px-8 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-500/20"
                >
                  {isDeleting ? <Loader2 className="animate-spin" size={14} /> : "Confirm Deactivation"}
                </Button>
              </div>
            )}
          </div>

          {showDeleteConfirm && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 rounded-xl">
              <Fingerprint className="h-4 w-4" />
              <AlertTitle className="text-[10px] font-black uppercase tracking-[0.2em]">High Priority Authorization</AlertTitle>
              <AlertDescription className="text-[9px] font-bold uppercase opacity-80">
                You are about to archive <span className="underline">{tenant?.name}</span>. Active bookings will be processed for internal refunds.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </section>
    </div>
  );
}