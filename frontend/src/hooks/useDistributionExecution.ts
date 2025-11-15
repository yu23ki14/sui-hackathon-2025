import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESSES } from "../lib/contractAddresses";
import suiClient from "../lib/suiClient";

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
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
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
      const packageId = import.meta.env.VITE_PACKAGE_ID;
      const daoPoolState = CONTRACT_ADDRESSES.DAO_CONTRACT;
      const fighterAddress = CONTRACT_ADDRESSES.FIGHTER_ADDRESS;
      const gymAddress = CONTRACT_ADDRESSES.GYM_ADDRESS;
      const organizerAddress = CONTRACT_ADDRESSES.ORGANIZER_ADDRESS;
      const coinType = CONTRACT_ADDRESSES.COIN_TYPE;

      if (!packageId || !daoPoolState) {
        throw new Error("Contract addresses not configured");
      }

      // Fetch DaoPoolState object to get treasury balance
      const daoPoolObject = await suiClient.getObject({
        id: daoPoolState,
        options: {
          showContent: true,
        },
      });

      if (!daoPoolObject.data || !daoPoolObject.data.content || daoPoolObject.data.content.dataType !== "moveObject") {
        throw new Error("Failed to fetch DAO pool state");
      }

      const fields = daoPoolObject.data.content.fields as any;

      // Parse treasury balance (in smallest unit, 9 decimals for SUI)
      const treasuryBalance = Number(fields.treasury) / 1_000_000_000;

      // Fetch individual balances for fighter, gym, and organizer
      // Note: These are their wallet balances, not stored in the contract
      let fighterBalance = 0;
      let gymBalance = 0;
      let organizerBalance = 0;

      // Fetch fighter balance
      if (fighterAddress && fighterAddress !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
        try {
          const fighterCoins = await suiClient.getBalance({
            owner: fighterAddress,
            coinType: coinType,
          });
          fighterBalance = Number(fighterCoins.totalBalance) / 1_000_000_000;
        } catch (err) {
          console.warn("Failed to fetch fighter balance:", err);
        }
      }

      // Fetch gym balance
      if (gymAddress && gymAddress !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
        try {
          const gymCoins = await suiClient.getBalance({
            owner: gymAddress,
            coinType: coinType,
          });
          gymBalance = Number(gymCoins.totalBalance) / 1_000_000_000;
        } catch (err) {
          console.warn("Failed to fetch gym balance:", err);
        }
      }

      // Fetch organizer balance
      if (organizerAddress && organizerAddress !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
        try {
          const organizerCoins = await suiClient.getBalance({
            owner: organizerAddress,
            coinType: coinType,
          });
          organizerBalance = Number(organizerCoins.totalBalance) / 1_000_000_000;
        } catch (err) {
          console.warn("Failed to fetch organizer balance:", err);
        }
      }

      setBalances({
        pool: treasuryBalance,
        fighter: fighterBalance,
        gym: gymBalance,
        organizer: organizerBalance,
      });

      console.log("Balances fetched:", {
        pool: treasuryBalance,
        fighter: fighterBalance,
        gym: gymBalance,
        organizer: organizerBalance,
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
      const packageId = import.meta.env.VITE_PACKAGE_ID;
      const daoPoolState = CONTRACT_ADDRESSES.DAO_CONTRACT;
      const coinType = CONTRACT_ADDRESSES.COIN_TYPE;

      if (!packageId || !daoPoolState) {
        throw new Error("Contract addresses not configured");
      }

      console.log("Executing regular distribution");

      // Build transaction
      const tx = new Transaction();

      // Call distribute function
      // Arguments match dao_pool.move distribute function:
      // 1. state: &mut DaoPoolState<T>
      // 2. clock: &Clock
      tx.moveCall({
        target: `${packageId}::dao_pool::distribute`,
        arguments: [
          tx.object(daoPoolState),
          tx.object("0x6"), // Sui Clock object
        ],
        typeArguments: [coinType],
      });

      // Execute transaction
      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      console.log("Distribution transaction executed:", result);

      const digest = result.digest;

      // Wait for transaction confirmation
      await suiClient.waitForTransaction({
        digest,
        options: {
          showEffects: true,
        },
      });

      console.log("Distribution transaction confirmed:", digest);

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
      const packageId = import.meta.env.VITE_PACKAGE_ID;
      const daoPoolState = CONTRACT_ADDRESSES.DAO_CONTRACT;
      const coinType = CONTRACT_ADDRESSES.COIN_TYPE;

      if (!packageId || !daoPoolState) {
        throw new Error("Contract addresses not configured");
      }

      // Convert amount to smallest unit (9 decimals for SUI)
      const amountInSmallestUnit = Math.floor(amount * 1_000_000_000);

      console.log("Executing bonus distribution:", { amount, amountInSmallestUnit });

      // Build transaction
      const tx = new Transaction();

      // Call distribute_bonus function
      // Arguments match dao_pool.move distribute_bonus function:
      // 1. state: &mut DaoPoolState<T>
      // 2. bonus_amount: u64
      // 3. clock: &Clock
      tx.moveCall({
        target: `${packageId}::dao_pool::distribute_bonus`,
        arguments: [
          tx.object(daoPoolState),
          tx.pure.u64(amountInSmallestUnit),
          tx.object("0x6"), // Sui Clock object
        ],
        typeArguments: [coinType],
      });

      // Execute transaction
      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      console.log("Bonus distribution transaction executed:", result);

      const digest = result.digest;

      // Wait for transaction confirmation
      await suiClient.waitForTransaction({
        digest,
        options: {
          showEffects: true,
        },
      });

      console.log("Bonus distribution transaction confirmed:", digest);

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
