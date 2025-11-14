import { useState, useEffect } from "react";
import { useWalletConnection } from "./useWalletConnection";
import suiClient from "../lib/suiClient";
import { CONTRACT_ADDRESSES } from "../lib/contractAddresses";

/**
 * Hook to fetch user's USDC token balance
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
      // TODO: Fetch USDC balance from blockchain
      // const coinType = `${CONTRACT_ADDRESSES.USDC_TOKEN_CONTRACT}::usdc::USDC`;
      // const result = await suiClient.getBalance({
      //   owner: walletAddress,
      //   coinType,
      // });
      // const balanceInUsdc = Number(result.totalBalance) / 1_000_000; // Assuming 6 decimals
      // setBalance(balanceInUsdc);

      console.log("TODO: Fetch USDC balance from blockchain", { walletAddress });
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data - remove after implementing blockchain integration
      setBalance(125.3);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch USDC balance"));
      console.error("Error fetching USDC balance:", err);
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
