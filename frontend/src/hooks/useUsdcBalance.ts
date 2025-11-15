import { useState, useEffect } from "react";
import { useWalletConnection } from "./useWalletConnection";
import suiClient from "../lib/suiClient";
import { CONTRACT_ADDRESSES } from "../lib/contractAddresses";

/**
 * Hook to fetch user's SUI token balance
 * Note: Changed from USDC to SUI
 * - USDC: 6 decimals (1 USDC = 1_000_000)
 * - SUI: 9 decimals (1 SUI = 1_000_000_000)
 */
export function useUsdcBalance() {
  const { walletAddress } = useWalletConnection();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalance = async () => {
    if (!walletAddress) {
      setBalance(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch SUI balance from blockchain
      const coinType = CONTRACT_ADDRESSES.COIN_TYPE;
      const result = await suiClient.getBalance({
        owner: walletAddress,
        coinType,
      });

      // SUI has 9 decimals (1 SUI = 1_000_000_000)
      const balanceInSui = Number(result.totalBalance) / 1_000_000_000;
      setBalance(balanceInSui);

      console.log("SUI balance fetched:", { walletAddress, balance: balanceInSui, raw: result.totalBalance });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch SUI balance"));
      console.error("Error fetching SUI balance:", err);
      // Set a small mock balance for testing if fetch fails
      setBalance(0.1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [walletAddress]);

  return {
    balance,
    isLoading,
    error,
    refetch: fetchBalance,
  };
}
