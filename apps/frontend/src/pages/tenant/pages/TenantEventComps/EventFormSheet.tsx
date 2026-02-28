import { useRef, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Target, MapPin, Zap, ImageIcon, Loader2 } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { cn } from "@/lib/utils";

const AUTOFILL_FIX = "autofill:shadow-[0_0_0_1000px_#f9fafb_inset] dark:autofill:shadow-[0_0_0_1000px_#09090b_inset] transition-colors duration-[50000s]";

export function EventFormSheet({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isLoading 
}: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-white/5 w-full sm:max-w-lg p-0">
        <div className="h-full flex flex-col">
          <div className="p-8 pb-4 space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-zinc-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Registry Access</span>
            </div>
            <SheetTitle className="text-4xl font-black uppercase tracking-tighter italic">{initialData ? "Modify Entry" : "New Entry"}</SheetTitle>
            <SheetDescription className="sr-only">Event modification form.</SheetDescription>
          </div>

          <form onSubmit={onSubmit} className="flex-1 overflow-y-auto px-8 space-y-8 pb-10">
            <div className="space-y-6 pt-4">
              <div className="relative group">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 dark:group-focus-within:text-white" size={18} />
                <input name="name" defaultValue={initialData?.name} required className={cn("w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 pl-14 text-sm font-bold focus:outline-none", AUTOFILL_FIX)} placeholder="EVENT CODENAME" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input name="date" type="date" defaultValue={initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : ""} required className={cn("w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold focus:outline-none", AUTOFILL_FIX)} />
                <input name="time" type="time" defaultValue={initialData?.time} required className={cn("w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold focus:outline-none", AUTOFILL_FIX)} />
              </div>

              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 dark:group-focus-within:text-white" size={18} />
                <input name="venue" defaultValue={initialData?.venue} required className={cn("w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 pl-14 text-sm font-bold focus:outline-none", AUTOFILL_FIX)} placeholder="COORDINATES / VENUE" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={14} />
                  <input name="price" type="number" defaultValue={initialData?.ticketDetails.price} required className={cn("w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 pl-10 text-sm font-bold focus:outline-none", AUTOFILL_FIX)} placeholder="0" />
                </div>
                <input name="total" type="number" defaultValue={initialData?.ticketDetails.total} required className={cn("w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold focus:outline-none", AUTOFILL_FIX)} placeholder="CAPACITY" />
              </div>

              <div onClick={() => fileInputRef.current?.click()} className="relative h-44 w-full border-2 border-dashed rounded-3xl flex flex-col items-center justify-center bg-white dark:bg-white/2 overflow-hidden cursor-pointer">
                <input ref={fileInputRef} type="file" name="banner" accept="image/*" className="hidden" onChange={handleFileChange} />
                {(previewUrl || initialData?.imageRef) && <img src={previewUrl || initialData?.imageRef} className="absolute inset-0 w-full h-full object-cover opacity-40" />}
                <ImageIcon size={24} className="text-zinc-400 relative" />
              </div>
            </div>
            <Button disabled={isLoading} type="submit" className="w-full h-16 rounded-[2rem] bg-zinc-900 text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.3em] text-[11px]">
              {isLoading ? <Loader2 className="animate-spin" /> : (initialData ? "Update Registry" : "Authorize Deployment")}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}