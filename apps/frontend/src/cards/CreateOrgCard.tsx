import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  PlusIcon,
  XIcon,
  TerminalIcon,
  FingerprintIcon,
  Loader2Icon,
  GlobeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateOrgCardProps {
  onClose: () => void;
  onCreate: (name: string, slug: string) => void;
  error?: string | null;
}

export default function CreateOrgCard({
  onClose,
  onCreate,
  error,
}: CreateOrgCardProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (error) setIsSubmitting(false);
  }, [error]);

  const handleSubmit = () => {
    if (!name || !slug) return;
    setIsSubmitting(true);
    onCreate(name, slug);
  };

  return (
    <div className="relative group w-full max-w-100 mx-auto transition-all duration-500 px-4">
      <div className="absolute -inset-4 bg-primary/10 dark:bg-primary/20 rounded-[3.5rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />

      <Card className="relative w-full rounded-[3rem] border border-black/5 dark:border-white/10 bg-white/80 dark:bg-black/90 backdrop-blur-2xl overflow-hidden flex flex-col p-10 shadow-2xl transition-colors duration-500">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10">
            <TerminalIcon size={14} className="text-primary" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">
              Secure Initialization
            </span>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10 transition-all"
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-[0.9]">
              Establish <br /> Entity
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
              Designate registry identity
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative group/input">
              <Label className="text-[9px] uppercase tracking-widest ml-2 mb-2 block opacity-50">
                Entity Name
              </Label>
              <Input
                autoFocus
                placeholder="DESIGNATION_ID"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 bg-black/3 dark:bg-white/3 border-black/10 dark:border-white/10 rounded-2xl text-foreground font-mono text-sm tracking-widest uppercase placeholder:text-muted-foreground/30 focus-visible:ring-primary/50 transition-all px-6"
              />
            </div>

            <div className="relative group/input">
              <Label className="text-[9px] uppercase tracking-widest ml-2 mb-2 block opacity-50">
                Subdomain Slug
              </Label>
              <div className="relative">
                <Input
                  placeholder="org-slug"
                  value={slug}
                  onChange={(e) =>
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                  }
                  className={cn(
                    "h-14 bg-black/3 dark:bg-white/3 border-black/10 dark:border-white/10 rounded-2xl text-foreground font-mono text-sm tracking-widest lowercase placeholder:text-muted-foreground/30 focus-visible:ring-primary/50 transition-all px-6 pr-32",
                    error && "border-destructive/50 ring-1 ring-destructive/20"
                  )}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary/40 uppercase tracking-tighter">
                  .domain_name
                </div>
              </div>

              {error ? (
                <div className="flex items-center gap-2 mt-3 px-2 text-destructive">
                  <span className="h-1 w-1 rounded-full bg-destructive animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    {error}
                  </span>
                </div>
              ) : (
                slug && (
                  <div className="flex items-center gap-2 mt-3 px-2 text-primary/60">
                    <GlobeIcon size={10} />
                    <span className="text-[9px] font-mono tracking-tight">
                      https://{slug}.domain
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-1 w-1 rounded-full bg-primary animate-ping" />
            <FingerprintIcon size={14} className="text-primary/50" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              Encryption Active // Node-04
            </span>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!name || !slug || isSubmitting}
            className={cn(
              "relative w-full h-16 rounded-2xl transition-all duration-500 font-black uppercase text-[11px] tracking-[0.4em] overflow-hidden shadow-xl",
              isSubmitting
                ? "bg-muted text-muted-foreground"
                : "bg-zinc-950 dark:bg-primary text-white dark:text-primary-foreground hover:scale-[1.03] active:scale-95 hover:shadow-primary/20"
            )}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isSubmitting ? (
                <>
                  <Loader2Icon size={16} className="animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  Confirm Access
                  <PlusIcon size={16} strokeWidth={3} />
                </>
              )}
            </span>
          </Button>
        </div>

        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      </Card>
    </div>
  );
}

function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <label className={className}>{children}</label>;
}