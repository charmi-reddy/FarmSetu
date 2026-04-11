import { useState } from "react";
import type { FormEvent } from "react";
import type { FarmSetuForwardContract, SettleContractInput } from "../types/contract";

interface SettleContractModalProps {
  contract: FarmSetuForwardContract;
  onSettle: (input: SettleContractInput) => Promise<void>;
  onClose: () => void;
}

function SettleContractModal({ contract, onSettle, onClose }: SettleContractModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const priceChange = contract.current_price - contract.agreed_price;
  const settlementAmount = priceChange * contract.quantity;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await onSettle({ contractId: contract.appId });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="grid min-h-full place-items-center">
        <div className="fs-card w-full max-w-md rounded-2xl p-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Settle Contract</h2>

          <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">Crop:</span><span className="font-semibold">{contract.crop_name}</span></div>
            <div className="mt-2 flex justify-between"><span className="text-slate-600">Quantity:</span><span className="font-semibold">{contract.quantity} quintals</span></div>
            <div className="mt-2 flex justify-between"><span className="text-slate-600">Agreed Price:</span><span className="font-semibold">₹{contract.agreed_price.toLocaleString()} per quintal</span></div>
            <div className="mt-2 flex justify-between"><span className="text-slate-600">Current Price:</span><span className="font-semibold">₹{contract.current_price.toLocaleString()} per quintal</span></div>
            <div className="mt-3 border-t border-green-200 pt-2 flex justify-between font-bold">
              <span>Settlement Amount:</span>
              <span className={settlementAmount >= 0 ? "text-emerald-700" : "text-red-700"}>
                {settlementAmount > 0 ? "+" : ""}
                ₹{Math.abs(settlementAmount).toLocaleString()}
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {settlementAmount > 0
                ? "Farmer receives this amount (prices rose)"
                : settlementAmount < 0
                ? "Buyer receives this amount (prices fell)"
                : "No payment (prices unchanged)"}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <p className="text-sm text-slate-600">
              This will finalize the contract using current oracle price. This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={onClose} className="fs-btn fs-btn-secondary px-4 py-2.5 text-sm">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="fs-btn fs-btn-primary px-4 py-2.5 text-sm">
                {isLoading ? "Processing..." : "Settle"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SettleContractModal;
