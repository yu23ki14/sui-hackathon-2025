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
      // TODO: Fetch DAO distribution percentages from blockchain
      // const result = await suiClient.getObject({
      //   id: CONTRACT_ADDRESSES.DAO_CONTRACT,
      //   options: { showContent: true },
      // });
      // const fields = (result.data?.content as any)?.fields;
      // setDaoInfo({
      //   name: fields.name,
      //   fighterPercentage: fields.fighter_percentage,
      //   gymPercentage: fields.gym_percentage,
      //   organizerPercentage: fields.organizer_percentage,
      // });

      console.log("TODO: Fetch DAO info from blockchain");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data - remove after implementing blockchain integration
      setDaoInfo({
        name: "TEAM KENTA DAO",
        fighterPercentage: 70,
        gymPercentage: 20,
        organizerPercentage: 10,
      });
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
