import type {
  CreateContractInput,
  AcceptContractInput,
  UpdatePriceInput,
  SettleContractInput,
  FarmSetuForwardContract,
} from "../types/contract";
import type { WalletInstance } from "../hooks/useWallet";

const STORAGE_KEY = "farmsetu_contracts";
const NEXT_ID_KEY = "farmsetu_next_contract_id";

function hasWindow() {
  return typeof window !== "undefined";
}

function readContracts(): FarmSetuForwardContract[] {
  if (!hasWindow()) return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as FarmSetuForwardContract[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeContracts(contracts: FarmSetuForwardContract[]) {
  if (!hasWindow()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
}

function nextContractId(): number {
  if (!hasWindow()) return Date.now();
  const raw = window.localStorage.getItem(NEXT_ID_KEY);
  const current = raw ? Number(raw) : 10000;
  const next = Number.isFinite(current) ? current + 1 : 10001;
  window.localStorage.setItem(NEXT_ID_KEY, String(next));
  return next;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createForwardContract(
  input: CreateContractInput,
  _wallet: WalletInstance,
  _userAddress: string
): Promise<{ appId: number; txnId: string }> {
  await sleep(450);

  const appId = nextContractId();
  const contracts = readContracts();
  const contract: FarmSetuForwardContract = {
    appId,
    farmer_address: input.farmerAddress,
    buyer_address: null,
    oracle_address: input.oracleAddress,
    crop_name: input.cropName,
    quantity: input.quantity,
    agreed_price: input.agreedPrice,
    deposited_amount: 0,
    current_price: input.agreedPrice,
    settlement_amount: 0,
    contract_status: "CREATED",
  };

  writeContracts([contract, ...contracts]);

  return {
    appId,
    txnId: `local_create_${Date.now()}`,
  };
}

export async function acceptContract(
  input: AcceptContractInput,
  _wallet: WalletInstance,
  userAddress: string
): Promise<{ txnId: string }> {
  await sleep(350);
  const contracts = readContracts();
  const idx = contracts.findIndex((c) => c.appId === input.contractId);
  if (idx < 0) throw new Error("Contract not found.");
  if (contracts[idx].contract_status !== "CREATED") {
    throw new Error("Only contracts in CREATED state can be accepted.");
  }

  const updated = {
    ...contracts[idx],
    buyer_address: userAddress,
    deposited_amount: input.depositedAmount,
    contract_status: "ACCEPTED" as const,
  };
  contracts[idx] = updated;
  writeContracts(contracts);

  return { txnId: `local_accept_${Date.now()}` };
}

export async function updatePrice(
  input: UpdatePriceInput,
  _wallet: WalletInstance,
  _userAddress: string
): Promise<{ txnId: string }> {
  await sleep(300);
  const contracts = readContracts();
  const idx = contracts.findIndex((c) => c.appId === input.contractId);
  if (idx < 0) throw new Error("Contract not found.");

  contracts[idx] = {
    ...contracts[idx],
    current_price: input.currentPrice,
  };
  writeContracts(contracts);

  return { txnId: `local_update_${Date.now()}` };
}

export async function settleContract(
  input: SettleContractInput,
  _wallet: WalletInstance,
  _userAddress: string
): Promise<{ txnId: string; settlementAmount: number }> {
  await sleep(350);
  const contracts = readContracts();
  const idx = contracts.findIndex((c) => c.appId === input.contractId);
  if (idx < 0) throw new Error("Contract not found.");
  if (contracts[idx].contract_status !== "ACCEPTED") {
    throw new Error("Only accepted contracts can be settled.");
  }

  const contract = contracts[idx];
  const settlementAmount = (contract.current_price - contract.agreed_price) * contract.quantity;
  contracts[idx] = {
    ...contract,
    settlement_amount: settlementAmount,
    contract_status: "SETTLED",
  };
  writeContracts(contracts);

  return {
    txnId: `local_settle_${Date.now()}`,
    settlementAmount,
  };
}

export async function getContract(contractId: number): Promise<FarmSetuForwardContract> {
  await sleep(120);
  const contract = readContracts().find((c) => c.appId === contractId);
  if (!contract) {
    throw new Error(`Contract #${contractId} not found.`);
  }
  return contract;
}

export async function listUserContracts(_userAddress: string): Promise<FarmSetuForwardContract[]> {
  await sleep(160);
  return readContracts().sort((a, b) => b.appId - a.appId);
}
