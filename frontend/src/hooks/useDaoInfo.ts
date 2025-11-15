import { useState, useEffect } from "react";
import suiClient from "../lib/suiClient";
import { CONTRACT_ADDRESSES } from "../lib/contractAddresses";

export interface DaoInfo {
  name: string;
  fighterPercentage: number;
  gymPercentage: number;
  organizerPercentage: number;
}

/**
 * Hook to fetch DAO information (distribution percentages, etc.)
 */
export function useDaoInfo() {
  const [daoInfo, setDaoInfo] = useState<DaoInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDaoInfo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const daoPoolAddress = CONTRACT_ADDRESSES.DAO_CONTRACT;

      // Fetch DAO distribution percentages from blockchain
      const result = await suiClient.getObject({
        id: daoPoolAddress,
        options: { showContent: true },
      });

      if (result.data?.content && "fields" in result.data.content) {
        const fields = result.data.content.fields as any;

        setDaoInfo({
          name: "TEAM KENTA DAO", // Contract doesn't store name, use config
          fighterPercentage: Number(fields.fighter_ratio || 70),
          gymPercentage: Number(fields.gym_ratio || 20),
          organizerPercentage: Number(fields.organizer_ratio || 10),
        });

        console.log("DAO info fetched:", {
          fighterPercentage: fields.fighter_ratio,
          gymPercentage: fields.gym_ratio,
          organizerPercentage: fields.organizer_ratio,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch DAO info"));
      console.error("Error fetching DAO info:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDaoInfo();
  }, []);

  return {
    daoInfo,
    isLoading,
    error,
    refetch: fetchDaoInfo,
  };
}
