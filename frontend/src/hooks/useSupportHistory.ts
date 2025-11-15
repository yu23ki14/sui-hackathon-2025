import { useState, useEffect } from "react";
import { useWalletConnection } from "./useWalletConnection";
import suiClient from "../lib/suiClient";
import { CONTRACT_ADDRESSES } from "../lib/contractAddresses";

export interface SupportHistoryItem {
  date: number;
  amount: number;
  txHash: string;
}

/**
 * Hook to fetch user's support history
 */
export function useSupportHistory() {
  const { walletAddress } = useWalletConnection();
  const [history, setHistory] = useState<SupportHistoryItem[]>([]);
  const [lastSupportDate, setLastSupportDate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSupportHistory = async () => {
    if (!walletAddress) {
      setHistory([]);
      setLastSupportDate(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const packageId = import.meta.env.VITE_PACKAGE_ID;

      // Fetch support events from blockchain
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${packageId}::dao_pool::SupportEvent`,
        },
      });

      // Filter events for the current wallet address and map to history items
      const historyData: SupportHistoryItem[] = events.data
        .filter((event: any) => {
          // Filter by supporter address
          const supporter = event.parsedJson?.supporter || "";
          return supporter.toLowerCase() === walletAddress.toLowerCase();
        })
        .map((event: any) => {
          const timestampMs = event.timestampMs || 0;
          const amount = Number(event.parsedJson.amount || 0);
          
          return {
            date: Number(timestampMs),
            amount: amount / 1_000_000_000, // Convert from smallest unit to SUI (9 decimals)
            txHash: event.id?.txDigest || "",
          };
        })
        .sort((a, b) => {
          // Sort by date descending (newest first)
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

      setHistory(historyData);

      console.log("Support history fetched:", {
        walletAddress,
        count: historyData.length,
        history: historyData,
      });

      // Set last support date from the most recent event
      if (historyData.length > 0) {
        const lastDate = historyData[0].date
        setLastSupportDate(lastDate);
      } else {
        setLastSupportDate(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch support history"));
      console.error("Error fetching support history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportHistory();
  }, [walletAddress]);

  return {
    history,
    lastSupportDate,
    isLoading,
    error,
    refetch: fetchSupportHistory,
  };
}
