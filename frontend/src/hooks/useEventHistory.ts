import { useState, useEffect } from "react";
import suiClient from "../lib/suiClient";
import { CONTRACT_ADDRESSES } from "../lib/contractAddresses";

export interface SupportEvent {
  date: string;
  supporter: string;
  amount: number;
  txHash: string;
}

export interface DistributeEvent {
  date: string;
  totalAmount: number;
  fighterAmount: number;
  gymAmount: number;
  organizerAmount: number;
  txHash: string;
}

export interface BonusEvent {
  date: string;
  bonusAmount: number;
  fighterAmount: number;
  gymAmount: number;
  organizerAmount: number;
  txHash: string;
}

/**
 * Hook to fetch event history (Support, Distribute, Bonus)
 */
export function useEventHistory() {
  const [supportEvents, setSupportEvents] = useState<SupportEvent[]>([]);
  const [distributeEvents, setDistributeEvents] = useState<DistributeEvent[]>([]);
  const [bonusEvents, setBonusEvents] = useState<BonusEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEventHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Fetch Support events from blockchain
      // const supportEventsResult = await suiClient.queryEvents({
      //   query: {
      //     MoveEventType: `${CONTRACT_ADDRESSES.DAO_CONTRACT}::dao::SupportEvent`,
      //   },
      // });
      // const supportData = supportEventsResult.data.map((event: any) => ({
      //   date: new Date(event.timestampMs).toLocaleString("ja-JP"),
      //   supporter: event.parsedJson.supporter,
      //   amount: event.parsedJson.amount / 1_000_000,
      //   txHash: event.id.txDigest,
      // }));

      console.log("TODO: Fetch Support events from blockchain");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data - remove after implementing blockchain integration
      setSupportEvents([
        {
          date: "2025/11/10 21:34",
          supporter: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          amount: 10.0,
          txHash: "0xabc123",
        },
        {
          date: "2025/11/09 14:22",
          supporter: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
          amount: 50.0,
          txHash: "0xdef456",
        },
      ]);

      // TODO: Fetch Distribute events from blockchain
      // const distributeEventsResult = await suiClient.queryEvents({
      //   query: {
      //     MoveEventType: `${CONTRACT_ADDRESSES.DAO_CONTRACT}::dao::DistributeEvent`,
      //   },
      // });

      console.log("TODO: Fetch Distribute events from blockchain");
      await new Promise((resolve) => setTimeout(resolve, 500));

      setDistributeEvents([
        {
          date: "2025/11/10 21:00",
          totalAmount: 3000,
          fighterAmount: 2100,
          gymAmount: 600,
          organizerAmount: 300,
          txHash: "0x789abc",
        },
      ]);

      // TODO: Fetch Bonus events from blockchain
      // const bonusEventsResult = await suiClient.queryEvents({
      //   query: {
      //     MoveEventType: `${CONTRACT_ADDRESSES.DAO_CONTRACT}::dao::BonusDistributionEvent`,
      //   },
      // });

      console.log("TODO: Fetch Bonus events from blockchain");
      await new Promise((resolve) => setTimeout(resolve, 500));

      setBonusEvents([
        {
          date: "2025/11/08 18:00",
          bonusAmount: 500,
          fighterAmount: 350,
          gymAmount: 100,
          organizerAmount: 50,
          txHash: "0x456def",
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch event history"));
      console.error("Error fetching event history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventHistory();
  }, []);

  return {
    supportEvents,
    distributeEvents,
    bonusEvents,
    isLoading,
    error,
    refetch: fetchEventHistory,
  };
}
