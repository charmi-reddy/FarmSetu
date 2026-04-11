import { useEffect, useState } from "react";
import type { UseWalletResult } from "../hooks/useWallet";
import { useContracts } from "../hooks/useContracts";
import CreateContractForm from "../components/CreateContractForm";
import ContractList from "../components/ContractList";
import TransactionHistory from "../components/TransactionHistory";

interface DashboardProps {
  userRole: "farmer" | "buyer" | null;
  wallet: UseWalletResult;
}

function Dashboard({ userRole, wallet }: DashboardProps) {
  const contracts = useContracts(wallet.wallet || null, wallet.accountAddress);
  const { loadContracts } = contracts;
  const [currentRole, setCurrentRole] = useState<"farmer" | "buyer">(userRole ?? "farmer");
  const [activeTab, setActiveTab] = useState<"create" | "list" | "transactions">("list");

  useEffect(() => {
    if (wallet.isConnected) {
      void loadContracts();
    }
  }, [wallet.isConnected, wallet.accountAddress, loadContracts]);

  if (wallet.isLoading || !wallet.isConnected) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="fs-card w-full max-w-md rounded-2xl p-8 text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
          <p className="text-lg font-bold text-slate-800">
            {wallet.isLoading ? "Loading wallet..." : "Connecting to wallet..."}
          </p>
          <p className="mt-2 text-sm text-slate-600">Please approve the request in wallet.</p>
        </div>
      </div>
    );
  }

  const tabBase = "fs-tab";
  const active = `${tabBase} fs-tab-active`;
  const safeActiveTab = currentRole !== "farmer" && activeTab === "create" ? "list" : activeTab;

  return (
    <div className="min-h-screen py-8">
      <header className="fs-shell fs-glass rounded-2xl px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">FarmSetu Dashboard</h1>
            <p className="mt-1 text-sm font-semibold text-green-700">
              {currentRole === "farmer" ? "Farmer Workspace" : "Buyer Workspace"}
            </p>
          </div>
          <div className="text-sm sm:text-right">
            <div className="mb-2 inline-flex rounded-full border border-green-200 bg-green-50 p-1">
              <button
                onClick={() => setCurrentRole("farmer")}
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  currentRole === "farmer"
                    ? "bg-white text-green-700 shadow"
                    : "text-slate-600"
                }`}
              >
                Farmer
              </button>
              <button
                onClick={() => setCurrentRole("buyer")}
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  currentRole === "buyer"
                    ? "bg-white text-green-700 shadow"
                    : "text-slate-600"
                }`}
              >
                Buyer
              </button>
            </div>
            <p className="font-semibold text-slate-700">
              {wallet.accountAddress
                ? `${wallet.accountAddress.slice(0, 10)}...${wallet.accountAddress.slice(-8)}`
                : "Not connected"}
            </p>
            <button
              onClick={() => void wallet.disconnect()}
              className="fs-btn fs-btn-secondary mt-2 px-4 py-2 text-xs"
            >
              Disconnect
            </button>
          </div>
        </div>
      </header>

      <main className="fs-shell mt-7">
        {contracts.error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {contracts.error}
          </div>
        )}

        <div className="fs-card mb-6 rounded-2xl p-3">
          <nav className="flex flex-wrap items-center gap-2">
            {currentRole === "farmer" && (
              <button
                onClick={() => setActiveTab("create")}
                className={safeActiveTab === "create" ? active : tabBase}
              >
                Create Contract
              </button>
            )}
            <button
              onClick={() => setActiveTab("list")}
              className={safeActiveTab === "list" ? active : tabBase}
            >
              {currentRole === "farmer" ? "My Contracts" : "Available Contracts"} (
              {contracts.contracts.length})
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={safeActiveTab === "transactions" ? active : tabBase}
            >
              Transactions
            </button>
          </nav>
        </div>

        {safeActiveTab === "create" && currentRole === "farmer" && (
          <CreateContractForm
            onSubmit={contracts.create}
            isLoading={contracts.isLoading}
            userAddress={wallet.accountAddress || ""}
          />
        )}

        {safeActiveTab === "list" && (
          <ContractList
            contracts={contracts.contracts}
            isLoading={contracts.isLoading}
            userAddress={wallet.accountAddress || ""}
            userRole={currentRole}
            onAccept={contracts.accept}
            onSettle={contracts.settle}
          />
        )}

        {safeActiveTab === "transactions" && (
          <TransactionHistory transactions={contracts.transactions} />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
