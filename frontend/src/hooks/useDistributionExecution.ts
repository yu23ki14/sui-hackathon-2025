import { useState, useEffect } from "react";
import suiClient from "../lib/suiClient";
import { CONTRACT_ADDRESSES } from "../lib/contractAddresses";

export interface Balances {
  pool: number;
  fighter: number;
  gym: number;
  organizer: number;
}

/**
 * Hook to manage distribution execution (regular and bonus)
 */
export function useDistributionExecution(
  periodDays: number,
  lastDistributedAt: Date | null
) {
  const [balances, setBalances] = useState<Balances>({
    pool: 0,
    fighter: 0,
    gym: 0,
    organizer: 0,
  });
  const [nextAvailableTime, setNextAvailableTime] = useState<Date>(new Date());
  const [isDistributing, setIsDistributing] = useState<boolean>(false);
  const [isDistributingBonus, setIsDistributingBonus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalances = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const daoPoolAddress = CONTRACT_ADDRESSES.DAO_CONTRACT;

      // Fetch DaoPoolState object from blockchain
      const result = await suiClient.getObject({
        id: daoPoolAddress,
        options: {
          showContent: true,
        },
      });

      if (result.data?.content && "fields" in result.data.content) {
        const fields = result.data.content.fields as any;

        // Extract treasury balance (Pool balance)
        const treasuryFields = fields.treasury?.fields;
        const poolBalanceRaw = treasuryFields?.value || "0";
        const poolBalance = Number(poolBalanceRaw) / 1_000_000_000; // Convert from smallest unit to SUI (9 decimals)

        console.log("Pool balance fetched:", {
          poolBalanceRaw,
          poolBalance,
          fields,
        });

        // Fighter, Gym, Organizer balances are not stored in the contract
        // They would need to be fetched from their wallet addresses using suiClient.getBalance()
        // For now, keep them as 0 (dummy data)
        setBalances({
          pool: poolBalance,
          fighter: 0, // TODO: Fetch from fighter wallet address
          gym: 0, // TODO: Fetch from gym wallet address
          organizer: 0, // TODO: Fetch from organizer wallet address
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch balances"));
      console.error("Error fetching balances:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNextAvailableTime = () => {
    if (!lastDistributedAt) {
      setNextAvailableTime(new Date());
      return;
    }

    const next = new Date(lastDistributedAt.getTime() + periodDays * 24 * 60 * 60 * 1000);
    setNextAvailableTime(next);
  };

  const executeDistribute = async (): Promise<void> => {
    setIsDistributing(true);
    setError(null);

    try {
      // TODO: Execute regular distribution on blockchain (Admin only)
      // const tx = await daoContract.distribute();
      // await tx.wait();

      console.log("TODO: Execute regular distribution");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Refetch balances after distribution
      await fetchBalances();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Distribution failed"));
      console.error("Error executing distribution:", err);
      throw err;
    } finally {
      setIsDistributing(false);
    }
  };

  const executeBonusDistribute = async (amount: number): Promise<void> => {
    setIsDistributingBonus(true);
    setError(null);

    try {
      // TODO: Execute bonus distribution on blockchain (Admin only)
      // const tx = await daoContract.bonusDistribution(amount * 1_000_000);
      // await tx.wait();

      console.log("TODO: Execute bonus distribution", { amount });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Refetch balances after distribution
      await fetchBalances();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Bonus distribution failed"));
      console.error("Error executing bonus distribution:", err);
      throw err;
    } finally {
      setIsDistributingBonus(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  useEffect(() => {
    calculateNextAvailableTime();
  }, [periodDays, lastDistributedAt]);

  return {
    balances,
    nextAvailableTime,
    executeDistribute,
    executeBonusDistribute,
    isDistributing,
    isDistributingBonus,
    isLoading,
    error,
    refetch: fetchBalances,
  };
}
