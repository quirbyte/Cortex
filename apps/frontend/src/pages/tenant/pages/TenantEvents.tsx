import { useState, useEffect, useRef } from "react";
import { useTenant } from "@/hooks/useTenant";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, CalendarDays, Loader2, FileCheck, Target, MapPin, Zap, ImageIcon, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { MdStadium } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import apiClient from "@/api/apiClient";

const AUTOFILL_FIX = "autofill:shadow-[0_0_0_1000px_#f9fafb_inset] dark:autofill:shadow-[0_0_0_1000px_#09090b_inset] autofill:[-webkit-text-fill-color:#18181b] dark:autofill:[-webkit-text-fill-color:white] transition-colors duration-[50000s] ease-in-out";

interface EventInterface {
  _id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  imageRef: string;
  ticketDetails: {
    price: number;
    total: number;
    sold: number;
  };
}

function SkeletonCard() {
  return (
    <div className="w-72 aspect-3/4">
      <Card className="w-full h-full rounded-[2.5rem] border border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-zinc-900/20 animate-pulse overflow-hidden">
        <div className="h-full flex flex-col justify-end px-6 pb-6 space-y-4">
          <div className="h-4 w-20 bg-zinc-200 dark:bg-white/5 rounded" />
          <div className="h-8 w-40 bg-zinc-200 dark:bg-white/5 rounded" />
          <div className="h-4 w-32 bg-zinc-200 dark:bg-white/5 rounded" />
          <div className="pt-5 border-t border-zinc-200 dark:border-white/10 flex justify-between items-center">
            <div className="h-10 w-24 bg-zinc-200 dark:bg-white/5 rounded-xl" />
            <div className="h-10 w-10 bg-zinc-200 dark:bg-white/5 rounded-xl" />
          </div>
        </div>
      </Card>
    </div>
  );
}

function EventCard({ 
  event, 
  isAdmin, 
  onDelete 
}: { 
  event: EventInterface; 
  isAdmin: boolean; 
  onDelete: (event: EventInterface) => void 
}) {
  const remaining = event.ticketDetails.total - event.ticketDetails.sold;
  const percentage = (event.ticketDetails.sold / event.ticketDetails.total) * 100;

  return (
    <div className="relative group w-72 aspect-3/4">
      <Card className="relative w-full h-full rounded-[2.5rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/40 backdrop-blur-sm transition-all duration-500 ease-out group-hover:scale-[1.04] overflow-hidden group-hover:border-zinc-300 dark:group-hover:border-white/20 shadow-xl dark:shadow-2xl">
        <div className="absolute inset-0 z-0 bg-zinc-100 dark:bg-zinc-950">
          <img 
            className="h-full w-full object-cover transition-all duration-700 opacity-80 dark:opacity-70 group-hover:opacity-100"
            src={event.imageRef} 
            alt={event.name} 
          />
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/40 dark:from-zinc-950 dark:via-zinc-950/60 to-transparent" />
        </div>
        
        <div className="relative z-20 h-full flex flex-col justify-end px-6 pb-6">
          <div className="space-y-1 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays size={10} className="text-zinc-500 dark:text-white/60" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-white/60">
                {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase()}
              </span>
            </div>
            <CardTitle className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic drop-shadow-sm dark:drop-shadow-md">
              {event.name}
            </CardTitle>
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-white/50 text-[9px] font-bold uppercase">
              <MdStadium size={12} /> <span>{event.venue}</span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between pt-5 border-t border-zinc-200 dark:border-white/10">
              <div className="flex flex-col">
                <span className="text-[8px] text-zinc-400 dark:text-white/30 uppercase font-black tracking-widest mb-1">Valuation</span>
                <div className="flex items-center text-zinc-900 dark:text-white font-black text-xl tracking-tighter">
                  <FaRupeeSign size={14} className="text-zinc-400 dark:text-white/40" /> <span>{event.ticketDetails.price}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {isAdmin && (
                  <button 
                    onClick={() => onDelete(event)} 
                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-400 dark:text-white/40 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <Button className="h-10 px-5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black font-black text-[9px] uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                  Details
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[8px] font-black uppercase">
                <span className="text-zinc-400 dark:text-white/30">Capacity Load</span>
                <span className={cn(remaining < 50 ? "text-orange-600 dark:text-orange-500 animate-pulse" : "text-zinc-500 dark:text-white/50")}>
                  {remaining} Seats Available
                </span>
              </div>
              <div className="h-1 w-full bg-zinc-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-1000" 
                  style={{ width: `${percentage}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function TenantEvents() {
  const { role, tenant } = useTenant();
  const isAdmin = role === "Admin";

  const [events, setEvents] = useState<EventInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const [eventToDecommission, setEventToDecommission] = useState<EventInterface | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchEvents();
  }, [tenant?.slug]);

  const fetchEvents = async () => {
    if (!tenant?.slug) return;
    try {
      setIsLoading(true);
      const getResponse = await apiClient.get("/events/tenant-events");
      setEvents(getResponse.data.events || []);
    } catch (err: any) {
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFileError("File exceeds 10MB limit");
        setSelectedFileName(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setSelectedFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFileName(null);
      setPreviewUrl(null);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFileName(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fileError) return;
    
    setIsSubmitLoading(true);
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      await apiClient.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsSheetOpen(false);
      setSelectedFileName(null);
      setPreviewUrl(null);
      formElement.reset();
      fetchEvents();
      setStatusMsg({ type: "success", msg: "Deployment authorized successfully" });
    } catch (error: any) {
      const msg = error.response?.data?.error || error.response?.data?.msg || "Internal Server Error";
      setFileError(msg);
    } finally {
      setIsSubmitLoading(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleConfirmDelete = async () => {
    if (!eventToDecommission) return;
    try {
      setIsDeleting(true);
      await apiClient.delete(`/events/${eventToDecommission._id}`);
      setEvents((prev) => prev.filter((event) => event._id !== eventToDecommission._id));
      setEventToDecommission(null);
      setStatusMsg({ type: "success", msg: "Event decommissioned successfully" });
    } catch (error) {
      setStatusMsg({ type: "error", msg: "Decommissioning sequence failed" });
    } finally {
      setIsDeleting(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {statusMsg && (
        <div className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 shadow-2xl backdrop-blur-md",
          statusMsg.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
            : "bg-red-500/10 border-red-500/20 text-red-500"
        )}>
          {statusMsg.type === "success" ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
          <p className="text-[10px] font-black uppercase tracking-widest">{statusMsg.msg}</p>
          <button onClick={() => setStatusMsg(null)} className="ml-4 opacity-50 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {eventToDecommission && (
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive" className="rounded-3xl border-red-500/20 bg-red-500/5 p-6 animate-in zoom-in-95 duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
              <div className="flex gap-4">
                <AlertTriangle className="h-5 w-5 mt-1" />
                <div>
                  <AlertTitle className="text-[11px] font-black uppercase tracking-[0.2em] mb-1">Critical Action: Decommissioning</AlertTitle>
                  <AlertDescription className="text-[10px] font-bold uppercase opacity-70 tracking-tight leading-relaxed">
                    Terminate entry for <span className="text-red-500 underline underline-offset-4">{eventToDecommission.name}</span>? This cannot be undone.
                  </AlertDescription>
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setEventToDecommission(null)}
                  className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-white/10"
                >
                  Abort
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500 text-white shadow-lg shadow-red-500/20"
                >
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : "Confirm Termination"}
                </Button>
              </div>
            </div>
          </Alert>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-200 dark:border-white/5 pb-8">
        <div className="space-y-1">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white italic">Event Registry</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 dark:text-white/20">
            {tenant?.name} • Security Protocol Alpha
          </p>
        </div>

        {isAdmin && (
          <Sheet open={isSheetOpen} onOpenChange={(open) => {
            setIsSheetOpen(open);
            if(!open) {
              setSelectedFileName(null);
              setPreviewUrl(null);
              setFileError(null);
            }
          }}>
            <SheetTrigger asChild>
              <Button className="h-14 px-10 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-black text-[11px] uppercase tracking-[0.25em] transition-all active:scale-95 gap-3 shadow-2xl">
                <Plus size={18} strokeWidth={3} />
                Initialize Deployment
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-white/5 text-zinc-900 dark:text-white w-full sm:max-w-lg p-0">
              <div className="h-full flex flex-col">
                <div className="p-8 pb-4 space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={14} className="text-zinc-400 dark:text-white/30" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-white/30">System Configuration</span>
                  </div>
                  <SheetTitle className="text-4xl font-black uppercase tracking-tighter italic leading-none">New Entry</SheetTitle>
                  <SheetDescription className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-white/20 font-bold">
                    Deploying to {tenant?.slug} grid
                  </SheetDescription>
                </div>

                <form onSubmit={handleCreateEvent} className="flex-1 overflow-y-auto px-8 space-y-8 pb-10 custom-scrollbar">
                  <div className="space-y-6 pt-4">
                    <div className="relative group">
                      <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-white/10 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" size={18} />
                      <input 
                        name="name" 
                        required 
                        className={cn(
                          "w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 pl-14 text-sm font-bold placeholder:text-zinc-300 dark:placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/5 transition-all shadow-sm",
                          AUTOFILL_FIX
                        )} 
                        placeholder="EVENT CODNAME (e.g. NEON GALA)" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-white/30 px-1">Phase Date</label>
                        <input name="date" type="date" required onClick={(e) => e.currentTarget.showPicker()} className={cn("w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold focus:outline-none scheme-light dark:scheme-dark shadow-sm", AUTOFILL_FIX)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-white/30 px-1">Phase Time</label>
                        <input name="time" type="time" required onClick={(e) => e.currentTarget.showPicker()} className={cn("w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold focus:outline-none scheme-light dark:scheme-dark shadow-sm", AUTOFILL_FIX)} />
                      </div>
                    </div>

                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-white/10 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" size={18} />
                      <input 
                        name="venue" 
                        required 
                        className={cn("w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 pl-14 text-sm font-bold placeholder:text-zinc-300 dark:placeholder:text-white/10 focus:outline-none shadow-sm", AUTOFILL_FIX)} 
                        placeholder="COORDINATES / VENUE" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-white/30 px-1">Unit Valuation (INR)</label>
                        <div className="relative">
                           <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-white/10" size={14} />
                           <input name="price" type="number" required className={cn("w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 pl-10 text-sm font-bold focus:outline-none shadow-sm", AUTOFILL_FIX)} placeholder="0" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-white/30 px-1">Max Capacity</label>
                        <input name="total" type="number" required className={cn("w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold focus:outline-none shadow-sm", AUTOFILL_FIX)} placeholder="100" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-white/30 px-1">Visual Asset</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "relative h-44 w-full border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all bg-white dark:bg-white/2 shadow-sm overflow-hidden",
                          selectedFileName ? "border-green-500/30" : fileError ? "border-red-500/30 bg-red-500/2" : "border-zinc-200 dark:border-white/5 hover:border-zinc-400 dark:hover:border-white/10"
                        )}
                      >
                        <input ref={fileInputRef} type="file" name="banner" accept="image/*" className="hidden" onChange={handleFileChange} />
                        
                        {previewUrl ? (
                          <div className="absolute inset-0 group">
                            <img src={previewUrl} className="w-full h-full object-cover opacity-40 dark:opacity-20 transition-all group-hover:opacity-60" alt="Preview" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                               <button 
                                 type="button"
                                 onClick={clearFile}
                                 className="absolute top-4 right-4 p-2 rounded-xl bg-red-500/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                               >
                                 <X size={16} />
                               </button>
                               <div className="p-3 rounded-2xl bg-green-500/20 text-green-500 backdrop-blur-md">
                                  <FileCheck size={24} />
                               </div>
                               <span className="text-[9px] font-black uppercase tracking-widest text-green-600 bg-white dark:bg-zinc-900 px-3 py-1 rounded-full shadow-lg">
                                 {selectedFileName}
                               </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-white/20">
                              <ImageIcon size={24} />
                            </div>
                            <span className={cn("text-[9px] font-black uppercase tracking-widest", fileError ? "text-red-500/50" : "text-zinc-400 dark:text-white/20")}>
                              {fileError || "Deploy Banner Artwork"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-linear-to-t from-zinc-50 dark:from-zinc-950 pt-10">
                    <Button 
                      disabled={isSubmitLoading || !!fileError} 
                      type="submit" 
                      className="w-full h-16 rounded-[2rem] bg-zinc-900 text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.3em] text-[11px] active:scale-95 transition-all shadow-2xl hover:shadow-zinc-500/20 dark:hover:shadow-white/10"
                    >
                      {isSubmitLoading ? <Loader2 className="animate-spin" /> : "Authorize Deployment"}
                    </Button>
                  </div>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      <div className="flex flex-wrap gap-8 justify-center md:justify-start">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : events.length > 0 ? (
          events.map((event) => (
            <EventCard 
              key={event._id} 
              event={event} 
              isAdmin={isAdmin} 
              onDelete={(e) => setEventToDecommission(e)} 
            />
          ))
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-40 border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-[3rem] text-zinc-300 dark:text-white/20">
            <MdStadium size={48} className="mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Active Deployments Found</p>
          </div>
        )}
      </div>
    </div>
  );
}