import type { ContractTransaction } from "../types/contract";

interface TransactionHistoryProps {
  transactions: ContractTransaction[];
}

function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const formatTime = (timestamp: number) => new Date(timestamp).toLocaleString();

  const getTypeLabel = (type: ContractTransaction["type"]) => {
    const labels: Record<ContractTransaction["type"], string> = {
      create: "Create",
      accept: "Accept",
      update_price: "Update Price",
      settle: "Settle",
    };
    return labels[type];
  };

  if (transactions.length === 0) {
    return (
      <div className="fs-card rounded-2xl p-10 text-center">
        <p className="text-lg font-bold text-slate-800">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="fs-card overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-green-100 bg-green-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide text-green-700">Type</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide text-green-700">Contract</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide text-green-700">Time</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide text-green-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide text-green-700">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-50">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-green-50/50">
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{getTypeLabel(tx.type)}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{tx.contractId === 0 ? "New" : `#${tx.contractId}`}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{formatTime(tx.timestamp)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                      tx.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : tx.status === "success"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-600">
                  {tx.txnId ? tx.txnId.slice(0, 18) + "..." : tx.error || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-green-100 bg-green-50 px-6 py-3 text-xs font-semibold text-green-700">
        Total transactions: {transactions.length}
      </div>
    </div>
  );
}

export default TransactionHistory;
