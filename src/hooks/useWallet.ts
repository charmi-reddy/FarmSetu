import { useEffect, useRef, useState } from "react";
import type { Transaction } from "algosdk";

type WalletConnector = {
  on: (event: "disconnect", listener: () => void) => void;
};

export type WalletInstance = {
  connect: () => Promise<string[]>;
  reconnectSession: () => Promise<string[]>;
  disconnect: () => Promise<void>;
  signTransaction: (
    txGroups: Array<Array<{ txn: Transaction; signers?: string[]; authAddr?: string }>>,
    signerAddress?: string
  ) => Promise<Uint8Array[]>;
  connector?: WalletConnector | null;
};

export type WalletSignRequest = Array<{
  txn: Transaction;
  signers?: string[];
  authAddr?: string;
}>;

export type UseWalletResult = {
  accountAddress: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (
    txns: WalletSignRequest,
    signerAddress?: string
  ) => Promise<Uint8Array[]>;
  wallet: WalletInstance | null;
};

const CONNECT_MODAL_CLOSED = "CONNECT_MODAL_CLOSED";

/**
 * Custom hook for Pera wallet management
 * Handles connection, session restoration, and disconnection
 */
export function useWallet(): UseWalletResult {
  const walletRef = useRef<WalletInstance | null>(null);
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isConnected = Boolean(accountAddress);

  /**
   * Ensures wallet instance exists, initializes if needed
   */
  async function ensureWallet(): Promise<WalletInstance> {
    if (walletRef.current) return walletRef.current;

    try {
      const module = await import("@perawallet/connect");
      const wallet = new module.PeraWalletConnect({
        shouldShowSignTxnToast: false,
      }) as WalletInstance;

      walletRef.current = wallet;
      return wallet;
    } catch (err) {
      throw new Error(
        `Failed to initialize wallet: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  /**
   * Connects wallet and sets up disconnect listener
   */
  async function connect(): Promise<void> {
    setIsLoading(true);
    setError(null);

    try {
      const wallet = await ensureWallet();
      const accounts = await wallet.connect();

      wallet.connector?.on("disconnect", () => {
        void disconnect();
      });

      if (accounts.length > 0) {
        setAccountAddress(accounts[0]);
      }
    } catch (err) {
      const connectError = err as { data?: { type?: string } };

      if (connectError?.data?.type === CONNECT_MODAL_CLOSED) {
        setError("Connection cancelled by user");
      } else {
        const errorMsg =
          err instanceof Error ? err.message : String(err);
        setError(`Connection failed: ${errorMsg}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Disconnects wallet
   */
  async function disconnect(): Promise<void> {
    const wallet = walletRef.current;
    if (!wallet) return;

    try {
      await wallet.disconnect();
      setAccountAddress(null);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(`Disconnection failed: ${errorMsg}`);
    }
  }

  /**
   * Sign transaction(s)
   */
  async function signTransaction(
    txns: WalletSignRequest,
    signerAddress?: string
  ): Promise<Uint8Array[]> {
    const wallet = walletRef.current;
    if (!wallet) {
      throw new Error("Wallet not initialized");
    }
    if (!Array.isArray(txns) || txns.length === 0) {
      throw new Error("No transactions provided for signing");
    }

    return wallet.signTransaction([txns], signerAddress);
  }

  /**
   * Restore session on component mount
   */
  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const wallet = await ensureWallet();
        const accounts = await wallet.reconnectSession();

        if (!mounted) return;

        wallet.connector?.on("disconnect", () => {
          void disconnect();
        });

        if (accounts.length > 0) {
          setAccountAddress(accounts[0]);
        }
      } catch (err) {
        if (mounted) {
          const errorMsg =
            err instanceof Error ? err.message : String(err);
          setError(`Failed to restore session: ${errorMsg}`);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    accountAddress,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    signTransaction,
    wallet: walletRef.current,
  };
}
