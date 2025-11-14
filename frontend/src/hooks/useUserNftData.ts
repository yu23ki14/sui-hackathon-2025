import { useState, useEffect } from "react";
import { useWalletConnection } from "./useWalletConnection";
import suiClient from "../lib/suiClient";
import { CONTRACT_ADDRESSES } from "../lib/contractAddresses";
import { getRank, Rank } from "../components/RankBadge";

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
      // TODO: Fetch NFT count from blockchain
      // const nftCount = await membersNftContract.balanceOf(walletAddress);

      console.log("TODO: Fetch NFT count from blockchain", { walletAddress });
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TODO: Fetch total support amount from blockchain
      // const totalSupport = await daoContract.getUserTotalSupport(walletAddress);

      console.log("TODO: Fetch total support amount from blockchain", { walletAddress });
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data - remove after implementing blockchain integration
      const nftCount = 8;
      const totalSupportAmount = 123.0;
      const rank = getRank(nftCount);

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
