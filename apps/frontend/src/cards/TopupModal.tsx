import { useState } from "react";
import { Loader2, X, Wallet, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import apiClient from "@/api/apiClient";

interface TopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newBalance: number) => void;
}

export function TopupModal({ isOpen, onClose, onSuccess }: TopupModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleTopup = async () => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 10) return;

    try {
      setLoading(true);
      const response = await apiClient.post("/user/wallet/topup", { amount: numAmount });
      setStatus('success');
      setTimeout(() => {
        onSuccess(response.data.balance);
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Transaction failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount("");
    setStatus('idle');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md border-border bg-card p-8 relative overflow-hidden">
        <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className="flex flex-col items-center py-10 gap-4 animate-in zoom-in-95 duration-300">
            <CheckCircle2 size={60} className="text-primary" />
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Credits Injected</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
              Grid liquidity has been successfully updated.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Wallet className="text-primary" size={24} />
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Wallet Top-up</h2>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Authorize Credit Transfer</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black italic">₹</span>
                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-4 pl-10 pr-4 text-xl font-black italic focus:border-primary transition-all outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 2000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="py-2 rounded-lg border border-border text-[10px] font-black uppercase hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    +₹{val}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleTopup}
              disabled={loading || !amount || Number(amount) < 10}
              className="w-full py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Initiate Transfer"}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}