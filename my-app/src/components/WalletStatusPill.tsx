type WalletStatusPillProps = {
  connected: boolean;
  account: string;
};

export function WalletStatusPill({ connected, account }: WalletStatusPillProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-300 backdrop-blur-xl">
      <span className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" : "bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.7)]"}`} />
      <span className="font-medium">{connected ? "Pera Wallet Connected" : "Pera Wallet Offline"}</span>
      <span className="text-slate-500">•</span>
      <span>{account}</span>
    </div>
  );
}
