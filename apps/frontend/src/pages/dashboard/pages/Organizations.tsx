import { Particles } from "@/components/ui/particles";
import { useSidebar } from "@/components/ui/sidebar";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2 } from "lucide-react";
import OrgCard from "@/cards/OrgCard";
import CreateOrgCard from "@/cards/CreateOrgCard";
import DeleteOrgModal from "@/cards/DeleteOrgModal";
import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";

interface Organization {
  membershipId: string;
  role: "Admin" | "Moderator" | "Volunteer";
  tenant: {
    name: string;
    slug: string;
    _id?: string;
  } | null;
}

export default function Organizations() {
  const { state } = useSidebar();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [isOrgUpdated, setIsOrgUpdated] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get("/memberships/my-organizations");
      setOrgs(data.userOrgs || []);
    } catch (error) {
      console.error("Failed to sync registry:", error);
    } finally {
      setIsLoading(false);
      setIsOrgUpdated(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, isOrgUpdated]);

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

  const handleEstablish = async (name: string, slug: string) => {
    try {
      setCreateError(null);
      await apiClient.post("/tenant/create", { name, slug });
      setIsOrgUpdated(true);
      setIsCreating(false);
    } catch (error: any) {
      const message = error.response?.data?.msg || "Failed to establish entity";
      setCreateError(message);

      setTimeout(() => {
        setCreateError(null);
      }, 2000);
    }
  };

  const handleDecommission = async () => {
    const targetId = orgToDelete?.tenant?._id;
    const targetSlug = orgToDelete?.tenant?.slug;

    if (!targetId || !targetSlug) return;

    try {
      await apiClient.delete(`/tenant/delete/${targetId}`, {
        headers: {
          "tenant-slug": targetSlug,
        },
      });
      setIsOrgUpdated(true);
      setOrgToDelete(null);
    } catch (error) {
      console.error("Failed to purge entity:", error);
    }
  };

  const handleRedirect = (slug: string) => {
    if (slug) navigate(`/dashboard/${slug}`);
  };

  return (
    <div className="relative min-h-full bg-background transition-colors duration-500 overflow-x-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles
          key={`particles-${state}-${isDark}`}
          className="h-full w-full"
          quantity={isDark ? 180 : 140}
          ease={80}
          color={isDark ? "#ffffff" : "#000000"}
          staticity={30}
        />
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => {
              setIsCreating(false);
              setCreateError(null);
            }}
          />
          <div className="relative z-101 w-full max-w-md animate-in zoom-in-95 duration-300">
            <CreateOrgCard
              onClose={() => {
                setIsCreating(false);
                setCreateError(null);
              }}
              onCreate={handleEstablish}
              error={createError}
            />
          </div>
        </div>
      )}

      {orgToDelete && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-red-950/20 dark:bg-red-950/40 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => setOrgToDelete(null)}
          />
          <div className="relative z-101 w-full max-w-md animate-in zoom-in-95 duration-300">
            <DeleteOrgModal
              name={orgToDelete.tenant?.name || "Unknown Entity"}
              onClose={() => setOrgToDelete(null)}
              onConfirm={handleDecommission}
            />
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-350 px-10 py-20">
        <header className="relative mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                Organization Hub
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground uppercase leading-none">
              My <br />
              <span className="text-green-950 dark:text-muted-foreground/30">
                Entities
              </span>
            </h1>
          </div>

          <div className="flex flex-col items-start md:items-end gap-6 group/btn-container">
            <Button
              onClick={() => setIsCreating(true)}
              className="relative h-16 px-10 overflow-hidden rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-black transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] border border-white/10 dark:border-black/10 font-black uppercase text-[10px] tracking-[0.4em]"
            >
              <div className="relative z-10 flex items-center">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 dark:bg-black/5 group-hover/btn-container:rotate-90 transition-transform duration-500">
                  <PlusIcon size={14} strokeWidth={3} />
                </div>
                <span>Establish New</span>
              </div>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover/btn-container:w-full transition-all duration-700" />
            </Button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
            <Loader2 className="animate-spin text-primary" size={32} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Syncing Registry
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-x-10 gap-y-20 justify-items-center">
            {orgs.map((org) => (
              <OrgCard
                key={org.membershipId}
                name={org.tenant?.name || "Access Denied"}
                role={org.role}
                handleRedirect={() => handleRedirect(org.tenant?.slug || "")}
                onDelete={() => setOrgToDelete(org)}
              />
            ))}
          </div>
        )}

        <footer className="mt-40 flex flex-col items-center gap-8">
          <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
          <p className="text-[10px] font-black uppercase tracking-[1.5em] text-black dark:text-muted-foreground/40 whitespace-nowrap ml-[1.5em]">
            End of Registry
          </p>
        </footer>
      </div>
    </div>
  );
}
