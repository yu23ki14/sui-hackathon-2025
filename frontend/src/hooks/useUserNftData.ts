import { useState, useEffect } from "react";
import { useWalletConnection } from "./useWalletConnection";
import suiClient from "../lib/suiClient";
import { CONTRACT_ADDRESSES } from "../lib/contractAddresses";
import { getRank, Rank } from "../components/RankBadge";
import { getUserNftCount, getUserTotalSupport } from "../lib/nftUtils";

export interface UserNftData {
  nftCount: number;
  rank: Rank;
  totalSupportAmount: number;
}

/**
 * Hook to fetch user's NFT-related data (count, rank, total support amount)
 */
export function useUserNftData() {
  const { walletAddress } = useWalletConnection();
  const [data, setData] = useState<UserNftData>({
    nftCount: 0,
    rank: "None",
    totalSupportAmount: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserNftData = async () => {
    if (!walletAddress) {
      setData({
        nftCount: 0,
        rank: "None",
        totalSupportAmount: 0,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get package ID from environment variable
      const packageId = import.meta.env.VITE_PACKAGE_ID;
      if (!packageId) {
        throw new Error("VITE_PACKAGE_ID is not set in environment variables");
      }

      // Fetch NFT count and total support amount from blockchain
      const [nftCount, totalSupportAmount] = await Promise.all([
        getUserNftCount(walletAddress, packageId),
        getUserTotalSupport(walletAddress, packageId),
      ]);

      // Calculate rank based on total support amount
      const rank = getRank(totalSupportAmount);

      setData({
        nftCount,
        rank,
        totalSupportAmount,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch user NFT data"));
      console.error("Error fetching user NFT data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserNftData();
  }, [walletAddress]);

  return {
    nftCount: data.nftCount,
    rank: data.rank,
    totalSupportAmount: data.totalSupportAmount,
    isLoading,
    error,
    refetch: fetchUserNftData,
  };
}
