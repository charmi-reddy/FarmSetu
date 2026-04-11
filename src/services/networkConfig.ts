import algosdk from "algosdk";

const DEFAULT_ALGOD_SERVER = "https://testnet-api.algonode.cloud";
const DEFAULT_INDEXER_SERVER = "https://testnet-idx.algonode.cloud";

const algodServer = import.meta.env.VITE_NODE_URL || DEFAULT_ALGOD_SERVER;
const algodToken = import.meta.env.VITE_ALGOD_TOKEN || "";
const algodPort = import.meta.env.VITE_ALGOD_PORT || "";

const indexerServer = import.meta.env.VITE_INDEXER_URL || DEFAULT_INDEXER_SERVER;
const indexerToken = import.meta.env.VITE_INDEXER_TOKEN || "";
const indexerPort = import.meta.env.VITE_INDEXER_PORT || "";

export const CONTRACT_MODE = (import.meta.env.VITE_CONTRACT_MODE || "local").toLowerCase();
export const FORWARD_APP_ID = Number(import.meta.env.VITE_FORWARD_APP_ID || 0);

// Standardized oracle address for all FarmSetu contracts
export const ORACLE_ADDRESS = "O3TRKXNGG3B2GRU3ZJKAC2CCFGOPZKEMT4ECXUOAIQCDEOLQ4HX3VJO6TY";

export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
export const indexerClient = new algosdk.Indexer(indexerToken, indexerServer, indexerPort);

export function isOnChainMode() {
  return CONTRACT_MODE === "onchain";
}

