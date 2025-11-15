import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESSES } from "../lib/contractAddresses";
import suiClient from "../lib/suiClient";

export interface DistributionSettings {
  periodDays: number;
  maxPerDistribution: number;
  percFighter: number;
  percGym: number;
  percOrganizer: number;
}

/**
 * Hook to manage distribution settings (read and update)
 */
export function useDistributionSettings() {
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [settings, setSettings] = useState<DistributionSettings>({
    periodDays: 30,
    maxPerDistribution: 3000,
    percFighter: 70,
    percGym: 20,
    percOrganizer: 10,
  });
  const [lastDistributedAt, setLastDistributedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const packageId = import.meta.env.VITE_PACKAGE_ID;
      const daoPoolState = CONTRACT_ADDRESSES.DAO_CONTRACT;
      const coinType = CONTRACT_ADDRESSES.COIN_TYPE;

      if (!packageId || !daoPoolState) {
        throw new Error("Contract addresses not configured");
      }

      // Fetch DaoPoolState object to get distribution config
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

      // Parse distribution settings
      // distribution_interval is in milliseconds
      const distributionIntervalMs = Number(fields.distribution_interval);
      const periodDays = distributionIntervalMs / (24 * 60 * 60 * 1000);

      // support_cap is in smallest unit (9 decimals for SUI)
      const supportCapSmallestUnit = Number(fields.support_cap);
      const maxPerDistribution = supportCapSmallestUnit / 1_000_000_000;

      // Ratios are percentages (e.g., 60 = 60%)
      const percFighter = Number(fields.fighter_ratio);
      const percGym = Number(fields.gym_ratio);
      const percOrganizer = Number(fields.organizer_ratio);

      setSettings({
        periodDays,
        maxPerDistribution,
        percFighter,
        percGym,
        percOrganizer,
      });

      // Parse last distribution timestamp (in milliseconds)
      const lastDistributionMs = Number(fields.last_distribution);
      if (lastDistributionMs > 0) {
        setLastDistributedAt(new Date(lastDistributionMs));
      } else {
        setLastDistributedAt(null);
      }

      console.log("Distribution settings fetched:", {
        periodDays,
        maxPerDistribution,
        percFighter,
        percGym,
        percOrganizer,
        lastDistributionMs,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch distribution settings"));
      console.error("Error fetching distribution settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: DistributionSettings): Promise<void> => {
    setIsUpdating(true);
    setError(null);

    try {
      const packageId = import.meta.env.VITE_PACKAGE_ID;
      const daoPoolState = CONTRACT_ADDRESSES.DAO_CONTRACT;
      const coinType = CONTRACT_ADDRESSES.COIN_TYPE;

      if (!packageId || !daoPoolState) {
        throw new Error("Contract addresses not configured");
      }

      console.log("Updating distribution settings:", newSettings);

      // Build transaction
      const tx = new Transaction();

      // Convert settings to contract format
      // Note: We're not changing addresses, only ratios
      // If you need to change addresses, add them as parameters
      const newFighterRatio = newSettings.percFighter;
      const newGymRatio = newSettings.percGym;
      const newOrganizerRatio = newSettings.percOrganizer;

      // Convert period days to milliseconds for distribution_interval
      const newDistributionIntervalMs = Math.floor(newSettings.periodDays * 24 * 60 * 60 * 1000);

      // Call change_distribution_detail function
      // Arguments match dao_pool.move change_distribution_detail function:
      // 1. state: &mut DaoPoolState<T>
      // 2. new_fighter_address: Option<address>
      // 3. new_gym_address: Option<address>
      // 4. new_organizer_address: Option<address>
      // 5. new_fighter_ratio: Option<u64>
      // 6. new_gym_ratio: Option<u64>
      // 7. new_organizer_ratio: Option<u64>
      // 8. new_distribution_interval: Option<u64>
      // 9. clock: &Clock
      tx.moveCall({
        target: `${packageId}::dao_pool::change_distribution_detail`,
        arguments: [
          tx.object(daoPoolState),
          tx.pure.option("address", null), // new_fighter_address (None)
          tx.pure.option("address", null), // new_gym_address (None)
          tx.pure.option("address", null), // new_organizer_address (None)
          tx.pure.option("u64", newFighterRatio), // new_fighter_ratio (Some)
          tx.pure.option("u64", newGymRatio), // new_gym_ratio (Some)
          tx.pure.option("u64", newOrganizerRatio), // new_organizer_ratio (Some)
          tx.pure.option("u64", newDistributionIntervalMs), // new_distribution_interval (Some)
          tx.object("0x6"), // Sui Clock object
        ],
        typeArguments: [coinType],
      });

      // Execute transaction
      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      console.log("Update settings transaction executed:", result);

      const digest = result.digest;

      // Wait for transaction confirmation
      await suiClient.waitForTransaction({
        digest,
        options: {
          showEffects: true,
        },
      });

      console.log("Update settings transaction confirmed:", digest);

      // Update local state
      setSettings(newSettings);

      // Refetch to ensure sync
      await fetchSettings();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update distribution settings"));
      console.error("Error updating distribution settings:", err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    lastDistributedAt,
    updateSettings,
    isLoading,
    isUpdating,
    error,
    refetch: fetchSettings,
  };
}
