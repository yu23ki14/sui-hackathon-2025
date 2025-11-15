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
      const packageId = import.meta.env.VITE_PACKAGE_ID;

      // Fetch Support events from blockchain
      const supportEventsResult = await suiClient.queryEvents({
        query: {
          MoveEventType: `${packageId}::dao_pool::SupportEvent`,
        },
      });

      const supportData: SupportEvent[] = supportEventsResult.data.map((event: any) => {
        const timestampMs = event.timestampMs || Date.now();
        const amount = Number(event.parsedJson.amount || 0);

        return {
          date: new Date(timestampMs).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          supporter: event.parsedJson.supporter || "",
          amount: amount / 1_000_000_000, // Convert from smallest unit to SUI (9 decimals)
          txHash: event.id?.txDigest || "",
        };
      });

      setSupportEvents(supportData);

      console.log("Support events fetched:", {
        count: supportData.length,
        events: supportData,
      });

      // Fetch Distribute events from blockchain
      const distributeEventsResult = await suiClient.queryEvents({
        query: {
          MoveEventType: `${packageId}::dao_pool::DistributionEvent`,
        },
      });

      const distributeData: DistributeEvent[] = distributeEventsResult.data.map((event: any) => {
        const timestampMs = event.timestampMs || Date.now();
        const totalAmount = Number(event.parsedJson.total_amount || 0);
        const fighterAmount = Number(event.parsedJson.fighter_amount || 0);
        const gymAmount = Number(event.parsedJson.gym_amount || 0);
        const organizerAmount = Number(event.parsedJson.organizer_amount || 0);

        return {
          date: new Date(timestampMs).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          totalAmount: totalAmount / 1_000_000_000, // Convert to SUI
          fighterAmount: fighterAmount / 1_000_000_000,
          gymAmount: gymAmount / 1_000_000_000,
          organizerAmount: organizerAmount / 1_000_000_000,
          txHash: event.id?.txDigest || "",
        };
      });

      setDistributeEvents(distributeData);

      console.log("Distribute events fetched:", {
        count: distributeData.length,
        events: distributeData,
      });

      // Fetch Bonus events from blockchain
      const bonusEventsResult = await suiClient.queryEvents({
        query: {
          MoveEventType: `${packageId}::dao_pool::BonusDistributionEvent`,
        },
      });

      const bonusData: BonusEvent[] = bonusEventsResult.data.map((event: any) => {
        const timestampMs = event.timestampMs || Date.now();
        const bonusAmount = Number(event.parsedJson.bonus_amount || 0);
        const fighterAmount = Number(event.parsedJson.fighter_amount || 0);
        const gymAmount = Number(event.parsedJson.gym_amount || 0);
        const organizerAmount = Number(event.parsedJson.organizer_amount || 0);

        return {
          date: new Date(timestampMs).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          bonusAmount: bonusAmount / 1_000_000_000, // Convert to SUI
          fighterAmount: fighterAmount / 1_000_000_000,
          gymAmount: gymAmount / 1_000_000_000,
          organizerAmount: organizerAmount / 1_000_000_000,
          txHash: event.id?.txDigest || "",
        };
      });

      setBonusEvents(bonusData);

      console.log("Bonus events fetched:", {
        count: bonusData.length,
        events: bonusData,
      });
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
