import { useState, useEffect } from "react";
import { useWalletConnection } from "./useWalletConnection";
import suiClient from "../lib/suiClient";
import { CONTRACT_ADDRESSES } from "../lib/contractAddresses";

export interface SupportHistoryItem {
  date: string;
  amount: number;
  txHash: string;
}

/**
 * Hook to fetch user's support history
 */
export function useSupportHistory() {
  const { walletAddress } = useWalletConnection();
  const [history, setHistory] = useState<SupportHistoryItem[]>([]);
  const [lastSupportDate, setLastSupportDate] = useState<Date | null>(null);
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
      // TODO: Fetch support events from blockchain
      // const events = await suiClient.queryEvents({
      //   query: {
      //     MoveEventType: `${CONTRACT_ADDRESSES.DAO_CONTRACT}::dao::SupportEvent`,
      //   },
      //   filter: {
      //     Sender: walletAddress,
      //   },
      // });
      // const historyData = events.data.map((event: any) => ({
      //   date: new Date(event.timestampMs).toLocaleString("ja-JP"),
      //   amount: event.parsedJson.amount / 1_000_000,
      //   txHash: event.id.txDigest,
      // }));

      console.log("TODO: Fetch support events from blockchain", { walletAddress });
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data - remove after implementing blockchain integration
      const historyData: SupportHistoryItem[] = [
        {
          date: "2025/11/10 21:34",
          amount: 10.0,
          txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        },
        {
          date: "2025/11/05 14:22",
          amount: 20.0,
          txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        },
        {
          date: "2025/10/28 18:45",
          amount: 15.5,
          txHash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
        },
      ];

      setHistory(historyData);

      if (historyData.length > 0) {
        const lastDate = new Date(historyData[0].date);
        setLastSupportDate(lastDate);
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
